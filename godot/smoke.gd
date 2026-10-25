extends SceneTree

func _initialize() -> void:
	var scene = load("res://main.tscn").instantiate()
	root.add_child(scene)
	call_deferred("check", scene)

func check(scene) -> void:
	assert(scene.daily_pair("2026-10-25") == [1, 1])
	assert(scene.daily_pair("2027-02-01") == [0, 0])
	scene.start_run(false)
	for index in [0, 0, 0, 1, 0]:
		scene.choose(index)
	assert(scene.history.size() == 5)
	assert(scene.risk < 55)
	assert(scene.node_key == "")
	scene.start_run(false)
	for index in [0, 2, 1, 0]:
		scene.choose(index)
	assert(scene.risk >= 55)
	assert(scene.restore() == true)
	assert(scene.history.size() == 4)
	print("Godot: native scene, matching daily seed, five-round passing path, contradiction penalties and saved replay passed.")
	quit()
