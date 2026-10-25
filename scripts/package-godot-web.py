"""Split and compress the WASM asset for static hosts with per-file size limits."""
from pathlib import Path
import gzip, json

dest = Path(__file__).resolve().parents[1] / 'dist' / 'godot'
wasm = dest / 'index.wasm'
if wasm.exists():
    raw = wasm.read_bytes()
    parts = []
    for i, offset in enumerate(range(0, len(raw), 12 * 1024 * 1024)):
        name = f'engine-{i}.bin'
        (dest / name).write_bytes(gzip.compress(raw[offset:offset + 12 * 1024 * 1024], mtime=0))
        parts.append(name)
    # Only the generated engine asset is removed; it is reconstructed by the loader.
    wasm.unlink()
    loader = '''<script>
// The engine remains a standard Godot export. Reassemble its compressed WASM
// from small static assets so it can run on hosts with a 25 MiB asset limit.
(() => {
 const originalFetch = window.fetch.bind(window);
 const wasmURL = new URL('index.wasm', location.href).href;
 let wasmPromise;
 window.fetch = function(input, init) {
  const url = new URL(input instanceof Request ? input.url : String(input), location.href).href;
  if (url !== wasmURL) return originalFetch(input, init);
  wasmPromise ||= Promise.all(PARTS.map(async name => {
   const response = await originalFetch(new URL(name, wasmURL));
   if (!response.ok) throw new Error('Engine download failed: ' + response.status);
   return new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  })).then(chunks => new Blob(chunks, {type:'application/wasm'}));
  return wasmPromise.then(blob => new Response(blob, {headers:{'Content-Type':'application/wasm'}}));
 };
})();
</script>'''.replace('PARTS', json.dumps(parts))
    html = dest / 'index.html'
    html.write_text(html.read_text().replace('</head>', loader + '\n</head>').replace('</body>', '<a href="../reverse.html" style="position:fixed;right:16px;top:14px;z-index:100;color:#ffad68;background:#182126;padding:10px 16px;font:14px system-ui">切换轻量网页版 ↗</a></body>'))
    print('Packaged Godot engine:', len(parts), 'compressed pieces;', sum((dest/p).stat().st_size for p in parts), 'download bytes')
else:
    raise SystemExit('Run the Godot Web release export before packaging.')
