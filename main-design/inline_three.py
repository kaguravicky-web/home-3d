"""Make a standalone copy of a page: three.js r128 and OrbitControls inlined instead of loaded from the CDN, so the file
also works offline and in previews that cannot reach the network. Usage: inline_three.py <vendor dir> <in.html> <out.html>"""
import io, sys

vendor, src, dst = sys.argv[1:4]
t = io.open(src, encoding="utf-8").read()
for url, name in [("https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js", "three.min.js"),
                  ("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js", "OrbitControls.js")]:
    tag = f'<script src="{url}"></script>'
    assert t.count(tag) == 1, tag
    js = io.open(vendor + "/" + name, encoding="utf-8").read().replace("</script", "<\\/script")
    t = t.replace(tag, "<script>\n" + js + "\n</script>")
io.open(dst, "w", encoding="utf-8").write(t)
print(dst, len(t))
