extends SceneTree
## Run with --headless --main-pack <export.pck> --script <this absolute path>.

func _initialize() -> void:
	var font = load("res://assets/terminal-font.otf") as FontFile
	if font == null:
		push_error("Bundled Godot font could not be loaded")
		quit(1)
		return
	font.allow_system_fallback = false
	var scene = load("res://main.tscn").instantiate()
	root.add_child(scene)
	var text: String = FileAccess.get_file_as_string("res://scenarios.json")
	text += collect_text(scene)
	text += "与久们动否咱哎太奇当总想替活简纠项顿饿验"
	var missing: String = ""
	for character in text:
		if character.strip_edges() != "" and not font.has_char(character.unicode_at(0)) and not missing.contains(character):
			missing += character
	if missing != "":
		push_error("Exported font missing: " + missing)
		quit(1)
		return
	print("Exported PCK: bundled font covers menu, all scenario text and previously missing Chinese characters without system fallback.")
	quit()

func collect_text(node: Node) -> String:
	var text: String = ""
	if node is Label or node is Button:
		text += node.text
	for child in node.get_children():
		text += collect_text(child)
	return text
