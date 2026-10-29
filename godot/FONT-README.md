# Godot 中文字体修复

Godot 网页版内置精简的 Noto Sans CJK SC 字体（SIL OFL 1.1）。字体已补齐当前界面和剧情使用的汉字，并移除字体不支持的装饰符号；不要依赖设备上的中文字体补字。

修改 Godot 文案或重新生成 `godot/scenarios.json` 后，运行 `python scripts/godot-font.py` 检查覆盖率（需要 fontTools）。若提示缺字，用官方完整 Noto Sans CJK SC 字体重新生成：`python scripts/godot-font.py --source /path/to/NotoSansCJKsc-Regular.otf`。

重新导入字体后，用 Godot 4.5.2 的 `--headless --path godot --export-pack Web ../dist/godot/index.pck` 更新网页资源包，并同步 `dist/godot/index.html` 中 `GODOT_CONFIG.fileSizes["index.pck"]` 的字节数。引擎版本未变时，无需重新下载或改动 WASM 分包。

导出检查：`godot --headless --main-pack /absolute/path/dist/godot/index.pck --script /absolute/path/scripts/check-godot-pack.gd`。该检查关闭系统字体回退，验证导出包里的字体、菜单和全部剧情文字。另运行 `godot --headless --path godot --script smoke.gd` 检查玩法与存档。
