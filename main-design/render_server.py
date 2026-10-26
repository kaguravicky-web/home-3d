"""Static file server for the 3D page that can also save canvas snapshots (POST /save?name=...)."""
import base64, os, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[2] if len(sys.argv) > 2 else ROOT


class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def guess_type(self, path):
        t = super().guess_type(path)
        return t + "; charset=utf-8" if t.startswith("text/html") else t

    def do_POST(self):
        q = parse_qs(urlparse(self.path).query)
        name = "".join(ch for ch in q.get("name", ["shot"])[0] if ch.isalnum() or ch in "-_")
        data = self.rfile.read(int(self.headers["Content-Length"])).decode()
        raw = base64.b64decode(data.split(",", 1)[1])
        ext = "jpg" if data.startswith("data:image/jpeg") else "png"
        path = os.path.join(OUT, name + "." + ext)
        open(path, "wb").write(raw)
        self.send_response(200); self.end_headers(); self.wfile.write(path.encode())


ThreadingHTTPServer(("127.0.0.1", int(sys.argv[1])), H).serve_forever()
