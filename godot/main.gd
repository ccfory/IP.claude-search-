extends Control
## The native game uses the scenario graph exported from reverse-core.js.
const SAVE_PATH = "user://reverse-save.json"
const AMBER = Color("ffad68")
const MUTED = Color("9caaad")
var data: Dictionary
var cover: int = 0
var persona: int = 0
var risk: int = 18
var node_key: String = ""
var history: Array = []
var daily: bool = false
var stack: VBoxContainer
var scroll: ScrollContainer
var can_resume: bool = false
var random_state: int = 0

func daily_unit() -> float:
	random_state = (random_state + 0x6D2B79F5) & 0xffffffff
	var value: int = random_state
	value = ((value ^ (value >> 15)) * (value | 1)) & 0xffffffff
	value = (value ^ ((value + (((value ^ (value >> 7)) * (value | 61)) & 0xffffffff)) & 0xffffffff)) & 0xffffffff
	return float((value ^ (value >> 14)) & 0xffffffff) / 4294967296.0

func daily_pair(date: String) -> Array:
	random_state = 2166136261
	for code in ("daily-" + date).to_utf32_buffer().to_int32_array():
		random_state = ((random_state ^ code) * 16777619) & 0xffffffff
	return [int(daily_unit() * 3), int(daily_unit() * 3)]

func _ready() -> void:
	data = JSON.parse_string(FileAccess.get_file_as_string("res://scenarios.json"))
	var theme_res = Theme.new()
	theme_res.default_font = load("res://assets/terminal-font.otf")
	theme_res.default_font_size = 23
	var normal = StyleBoxFlat.new()
	normal.bg_color = Color("202b32")
	normal.border_color = Color("46535a")
	normal.set_border_width_all(1)
	normal.set_corner_radius_all(7)
	normal.content_margin_left = 22
	normal.content_margin_right = 22
	normal.content_margin_top = 17
	normal.content_margin_bottom = 17
	theme_res.set_stylebox("normal", "Button", normal)
	var hover = normal.duplicate()
	hover.border_color = AMBER
	hover.bg_color = Color("3a3025")
	theme_res.set_stylebox("hover", "Button", hover)
	theme_res.set_stylebox("pressed", "Button", hover)
	theme_res.set_color("font_color", "Button", Color("e4ebe8"))
	theme = theme_res
	var margin = MarginContainer.new()
	margin.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	for edge in ["left", "right", "top", "bottom"]:
		margin.add_theme_constant_override("margin_" + edge, 38)
	add_child(margin)
	scroll = ScrollContainer.new()
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	margin.add_child(scroll)
	stack = VBoxContainer.new()
	stack.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	stack.add_theme_constant_override("separation", 18)
	scroll.add_child(stack)
	can_resume = restore()
	menu()

func clear() -> void:
	for child in stack.get_children():
		stack.remove_child(child)
		child.queue_free()
	scroll.scroll_vertical = 0

func line(text: String, size: int = 23, color: Color = Color("e4ebe8")) -> Label:
	var label = Label.new()
	label.text = text
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.add_theme_font_size_override("font_size", size)
	label.add_theme_color_override("font_color", color)
	stack.add_child(label)
	return label

func button(text: String, action: Callable) -> Button:
	var b = Button.new()
	b.text = text
	b.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	b.custom_minimum_size.y = 75
	b.alignment = HORIZONTAL_ALIGNMENT_LEFT
	b.pressed.connect(action)
	stack.add_child(b)
	return b

func menu() -> void:
	clear()
	line("TERMINAL 008 / GODOT EDITION", 19, AMBER)
	line("这一次，\n轮到你被盘问。", 64)
	line("记住自己的说辞，撑过 Claude 的五轮盘问。\n同一套剧情，原生 Godot 4.5 引擎运行。", 25, MUTED)
	line("05 轮盘问     /     03 种性格     /     03 个身份", 23, AMBER)
	button("抽取身份，开始潜伏 →", func(): start_run(false))
	button("今日挑战 · 北京时间每日更新", func(): start_run(true))
	if can_resume:
		button("继续上次潜伏 →", render)
	button("返回网页版的其他玩法 ↗", func(): OS.shell_open("../index.html" if OS.has_feature("web") else "https://ccfory.github.io/IP.claude-search-/"))
	line("虚构身份推理。这里使用选择式剧情，无需 API。\n完成五轮时疑点低于 55 可过关；达到 100 提前结束。", 21, MUTED)

func start_run(is_daily: bool) -> void:
	daily = is_daily
	var rng = RandomNumberGenerator.new()
	if daily:
		var date = Time.get_date_string_from_unix_time(int(Time.get_unix_time_from_system()) + 28800)
		var pair: Array = daily_pair(date)
		cover = int(pair[0])
		persona = int(pair[1])
	else:
		rng.randomize()
		cover = rng.randi_range(0, 2)
		persona = rng.randi_range(0, 2)
	risk = 18
	history = []
	node_key = "%d/%d/0/none/none" % [cover, persona]
	can_resume = true
	persist()
	render()

func render() -> void:
	clear()
	var c: Dictionary = data.covers[cover]
	var p: Dictionary = data.personalities[persona]
	line("IP 判断 / 身份互换 / GODOT", 19, AMBER)
	if node_key == "" or risk >= 100:
		result()
		return
	line("第 %d / 5 轮  ·  %s" % [history.size() + 1, p.name], 40)
	line("掩护身份：%s\n%s / %s / %s\n%s" % [c.name, c.city, c.place, c.transport, c.job], 23, MUTED)
	line("疑点指数  %d / 100" % risk, 28, AMBER)
	var meter = ProgressBar.new()
	meter.value = risk
	meter.show_percentage = false
	meter.custom_minimum_size.y = 9
	stack.add_child(meter)
	if history.size() > 0:
		var last: Dictionary = history.back()
		line("你刚才：" + str(last.answer), 22, MUTED)
		line("Claude：" + str(last.reply), 24, AMBER)
	else:
		line(str(p.prefix), 23, MUTED)
	var stage: Dictionary = data.nodes[node_key]
	line("Claude\n" + str(stage.question), 32)
	for i in stage.choices.size():
		var choice: Dictionary = stage.choices[i]
		button("0%d   %s" % [i + 1, choice.text], choose.bind(i))
	if history.size() > 0:
		button("查看已经说过的话 ▤", memory)
	button("保存并返回", menu)

func choose(index: int) -> void:
	if node_key == "" or risk >= 100:
		return
	var stage: Dictionary = data.nodes[node_key]
	var choice: Dictionary = stage.choices[index]
	risk = clampi(risk + int(choice.risk), 0, 100)
	history.append({"question": stage.question, "answer": choice.text, "reply": choice.reply, "delta": choice.risk, "id": choice.id, "risk": risk})
	node_key = str(choice.next) if choice.next != null else ""
	can_resume = node_key != "" and risk < 100
	persist()
	render()

func memory() -> void:
	clear()
	line("已说过的话 / MEMORY", 34, AMBER)
	for i in history.size():
		line("0%d / %s\n你：%s" % [i + 1, history[i].question, history[i].answer], 24)
	button("返回盘问 →", render)

func result() -> void:
	var passed = risk < 55
	line("潜伏成功。" if passed else "身份暴露。", 58, AMBER)
	line("一致性得分  %d\n最终疑点  %d / 100\n完成轮数  %d / 5" % [100-risk, risk, history.size()], 31)
	var worst: Dictionary = history[0]
	for item in history:
		if item.delta > worst.delta:
			worst = item
	line("最险瞬间" if worst.delta > 0 else "最稳瞬间", 24, AMBER)
	line("「%s」\nClaude：%s" % [worst.answer, worst.reply], 28)
	button("再抽一个身份 →", func(): start_run(false))
	button("查看完整盘问记录", memory)
	button("返回主菜单", menu)

func persist() -> void:
	var f = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify({"v":1, "cover":cover, "persona":persona, "daily":daily, "history":history}))

func restore() -> bool:
	if not FileAccess.file_exists(SAVE_PATH):
		return false
	var saved = JSON.parse_string(FileAccess.get_file_as_string(SAVE_PATH))
	if not saved is Dictionary or saved.get("v") != 1:
		return false
	if not saved.get("history") is Array or saved.history.size() > 5:
		return false
	if not saved.get("cover") is float and not saved.get("cover") is int:
		return false
	if not saved.get("persona") is float and not saved.get("persona") is int:
		return false
	cover = int(saved.cover)
	persona = int(saved.persona)
	if cover < 0 or cover > 2 or persona < 0 or persona > 2:
		return false
	risk = 18
	history = []
	node_key = "%d/%d/0/none/none" % [cover, persona]
	for item in saved.history:
		if node_key == "" or risk >= 100 or not item is Dictionary:
			return false
		var stage: Dictionary = data.nodes[node_key]
		var found = false
		for choice in stage.choices:
			if choice.id == item.get("id"):
				risk = clampi(risk + int(choice.risk), 0, 100)
				history.append({"question":stage.question, "answer":choice.text, "reply":choice.reply, "delta":choice.risk, "id":choice.id, "risk":risk})
				node_key = str(choice.next) if choice.next != null else ""
				found = true
				break
		if not found:
			return false
	daily = saved.get("daily", false) == true
	return node_key != "" and risk < 100
