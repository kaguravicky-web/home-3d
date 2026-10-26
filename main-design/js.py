import io, re, sys
t = io.open(sys.argv[1], encoding='utf-8').read()
s = max(re.findall(r"<script>(.*?)</script>", t, re.S), key=len); io.open(sys.argv[2], 'w', encoding='utf-8').write(s)
