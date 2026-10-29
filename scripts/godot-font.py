"""Build/check the bundled font against every Godot script and dialogue character.

Build: python scripts/godot-font.py --source /path/to/NotoSansCJKsc-Regular.otf
Check: python scripts/godot-font.py
Requires fontTools. The source font is Noto Sans CJK SC (SIL OFL 1.1):
https://github.com/notofonts/noto-cjk/blob/main/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Regular.otf
"""
import argparse
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source', type=Path)
args = parser.parse_args()
texts = [p.read_text(encoding='utf-8') for p in (root / 'godot').glob('*.gd')]
texts.append((root / 'godot/scenarios.json').read_text(encoding='utf-8'))
required = {ord(c) for c in ''.join(texts) if not c.isspace()}
required.update(range(32, 127))
target = root / 'godot/assets/terminal-font.otf'

def check(font):
    missing = sorted(required - set(font.getBestCmap()))
    if missing:
        raise SystemExit('Missing font glyphs: ' + ' '.join(f'{chr(c)} (U+{c:04X})' for c in missing))

if args.source:
    font = TTFont(args.source, recalcTimestamp=False)
    check(font)
    options = subset.Options()
    options.recalc_timestamp = False
    sub = subset.Subsetter(options=options)
    sub.populate(unicodes=required)
    sub.subset(font)
    font.save(target)
    font.close()
with TTFont(target) as font:
    check(font)
print(f'Godot font: all {len(required)} required characters covered; {target.stat().st_size} bytes.')
