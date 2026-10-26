// ==== 自由摆放 - the copy "C2 - 家具（自由摆放）" (2026-10-22): the user drags and turns the living-room pieces themselves.
// Each piece is a clone of this page's own model (shared geometry and materials, so the sofa colours and the rug colour
// still apply) inside a wrapper in livMir whose origin is the piece's footprint centre; while it is on, the page's own
// living pieces hide. Local mm as everywhere in the living code: sofa wall x 7995, study wall x 10700, glass y 1830,
// the living line y 5100. A +rotation of a wrapper turns it clockwise in the top view (livMir is mirrored).
const FREE = (() => {
  const KEY = 'c2free.v2', KEY1 = 'c2free.v1', W0 = 7995, W1 = 10700, GL = 1830, LINE = 5100;
  const liv = () => livings[Object.keys(livings).find(k => livings[k].visible)] || Object.values(livings)[0];
  // the catalogue: what the user liked on the page (2026-10-22: the coffee table decided, the black columns and the 2.9 out). frame: the source has its own frame (seat centre at 0, facing +z),
  // so the wrapper takes its yaw; otherwise the source is baked as it stands and centred on its footprint
  // the wall shelves with an orchid (the user, 2026-10-22: 再加个黑色白色壁挂，壁挂上面放兰花，成为组合; then 加个松绿色):
  // matte black, white or pine green, four shapes: an upright block W160 x H260 x D160 (default, a small wall plinth), a
  // half-round ledge R150 x H100, and the 十八纸 honeycomb-paper peninsula the user had in mind (the model of the hall:
  // a half disc on top with a pleated edge, the honeycomb fanning down to a rounded point at the wall) in D450 x H200 or
  // D350 x H150; a glass bud vase with one purple orchid arching into the room on top; own frame: the middle of the back on
  // the wall at 0, facing +z, the top at 1.0 m
  function wallShelf(col, rough) {
    const g = new THREE.Group(), prev = target, m = M(col, { roughness: rough }), pm = M(col, { roughness: 0.9, side: THREE.DoubleSide }); target = g;
    const part = (s, geo, mat, y, z) => { const o = new THREE.Mesh(geo, mat); o.position.set(0, y, z); o.castShadow = o.receiveShadow = true; o.userData.shape = s; o.visible = s === 'col'; g.add(o); };
    part('col', new THREE.BoxGeometry(0.16, 0.26, 0.16), m, 0.87, 0.08);
    part('half', new THREE.CylinderGeometry(0.15, 0.15, 0.1, 48, 1, false, -Math.PI / 2, Math.PI), m, 0.95, 0);
    const pleat = geo => { const q = geo.attributes.position; for (let i = 0; i < q.count; i++) { const px = q.getX(i), pz = q.getZ(i);
      if (Math.hypot(px, pz) < 1e-4) continue; const k = 1 + 0.03 * Math.abs(Math.sin(40 * Math.atan2(px, pz))); q.setX(i, px * k); q.setZ(i, pz * k); } geo.computeVertexNormals(); return geo; };
    const prof = []; for (let i = 0; i <= 14; i++) { const u = i / 14; prof.push(new THREE.Vector2(0.03 + 0.195 * Math.pow(1 - u, 1.6), -0.035 - 0.165 * u)); }
    [['p45', 1, 1, 0.035], ['p35', 0.175 / 0.225, 0.75, 0.03]].forEach(([s, kr, kh, th]) => {
      part(s, pleat(new THREE.LatheGeometry(prof.map(q => new THREE.Vector2(q.x * kr, q.y * kh)), 60, -Math.PI / 2, Math.PI)), pm, 1.0, 0);
      part(s, pleat(new THREE.CylinderGeometry(0.225 * kr, 0.225 * kr, th, 60, 1, false, -Math.PI / 2, Math.PI)), pm, 1.0 - th / 2, 0); });
    const vp = [[0.001, 0], [0.022, 0], [0.026, 0.015], [0.027, 0.045], [0.017, 0.085], [0.009, 0.1], [0.012, 0.11]].map(([rr, h]) => new THREE.Vector2(rr, h));
    const v = new THREE.Mesh(new THREE.LatheGeometry(vp, 32), new THREE.MeshStandardMaterial({ color: '#eef5f5', transparent: true, opacity: 0.3, roughness: 0.03, metalness: 0.1, side: THREE.DoubleSide }));
    v.position.set(0, 1.0, 0.07); g.add(v);
    const wv = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.019, 0.05, 24), new THREE.MeshStandardMaterial({ color: '#d6ecee', transparent: true, opacity: 0.45, roughness: 0.05 })); wv.position.set(0, 1.03, 0.07); g.add(wv);
    orchid(0, 1.1, 0.07, Math.PI / 2, [[0, 0.4, 0.17, 7], [-0.9, 0.33, 0.14, 5], [0.9, 0.3, 0.13, 4]], true);
    target = prev; return g;
  }
  // the two pots every plant can stand in (the user, 2026-10-23, their photos: a woven seagrass basket, a smooth white
  // planter), D450 x H420, moss on top; returns the foliage group above the pot top - scaled by the height row, never
  // counted for overlaps
  function potPair(g) {
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    const lathe = (pr, mt, key) => { const o = new THREE.Mesh(new THREE.LatheGeometry(pr.map(([rr, y]) => new THREE.Vector2(rr, y)), 48), mt); o.castShadow = o.receiveShadow = true; o.userData.pot = key; o.visible = key === 'basket'; g.add(o); return o; };
    const wv = canvasTex(64, 64, (x, w, h) => { x.fillStyle = '#b8955f'; x.fillRect(0, 0, w, h);
      for (let j = 0; j < h; j += 8) for (let i = 0; i < w; i += 8) { x.fillStyle = ((i + j) / 8) % 2 ? 'rgba(120,88,48,0.45)' : 'rgba(232,208,164,0.35)'; x.fillRect(i, j, 8, 4); } });
    wv.wrapS = wv.wrapT = THREE.RepeatWrapping; wv.repeat.set(16, 6);
    lathe([[0.001, 0], [0.16, 0], [0.205, 0.05], [0.228, 0.17], [0.222, 0.3], [0.2, 0.39], [0.19, 0.412], [0.2, 0.42], [0.185, 0.42], [0.18, 0.39]], new THREE.MeshStandardMaterial({ map: wv, roughness: 1, side: THREE.DoubleSide }), 'basket');
    lathe([[0.001, 0], [0.17, 0], [0.19, 0.02], [0.225, 0.4], [0.225, 0.42], [0.205, 0.42], [0.2, 0.39]], M('#f2f0ec', { roughness: 0.6, side: THREE.DoubleSide }), 'white');
    const moss = new THREE.Mesh(new THREE.CircleGeometry(0.19, 32), M('#4b5a2e', { roughness: 1 })); moss.rotation.x = -Math.PI / 2; moss.position.y = 0.392; g.add(moss);
    const fol = new THREE.Group(); fol.position.y = 0.39; fol.userData.grow = true; fol.userData.noHull = true; g.add(fol);
    return fol;
  }
  // for the wall facing the sofa (the user, 2026-10-23: 茶几对面的墙有点空; 客厅加电视; 路由器藏起来)
  // a wall-hung TV: a thin black panel w x h (m) in a hairline bezel on a flat mount; own frame: the back on the wall at 0,
  // facing +z, the screen centre at 1.0 m (the height row moves it)
  function wallTV(w, h) {
    const g = new THREE.Group(), bez = M('#121213', { roughness: 0.35, metalness: 0.2 });
    const b = new THREE.Mesh(new THREE.BoxGeometry(w + 0.012, h + 0.012, 0.012), bez); b.position.set(0, 1.0, 0.032); b.castShadow = true; g.add(b);
    const s = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.002), mat.screen); s.position.set(0, 1.0, 0.0385); g.add(s);
    const m = new THREE.Mesh(new THREE.BoxGeometry(w * 0.45, h * 0.4, 0.026), M('#2a2a2c', { roughness: 0.6 })); m.position.set(0, 0.97, 0.013); g.add(m);
    return g;
  }
  // natural cane, an open weave round staggered holes (as on the lounger)
  const caneTan = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const x = cv.getContext('2d');
    x.fillStyle = '#d6b07a'; x.fillRect(0, 0, 64, 64); x.strokeStyle = 'rgba(150,110,60,0.5)'; x.lineWidth = 1.2;
    for (let i = 0; i < 64; i += 8) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 32, 64); x.stroke(); x.beginPath(); x.moveTo(i + 32, 0); x.lineTo(i, 64); x.stroke(); }
    x.globalCompositeOperation = 'destination-out'; for (let rr = 0; rr < 4; rr++) for (let c = 0; c < 4; c++) { x.beginPath(); x.arc(c * 16 + (rr % 2 ? 16 : 8), rr * 16 + 8, 4.2, 0, 6.283); x.fill(); }
    const tx = new THREE.CanvasTexture(cv); tx.encoding = THREE.sRGBEncoding; tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(9, 7);
    return new THREE.MeshStandardMaterial({ map: tx, transparent: true, alphaTest: 0.4, roughness: 0.8, side: THREE.DoubleSide }); })();
  // a low console W1600 x D380 x H500: black frame on short tapered legs, four doors of natural cane in black frames with
  // small black knobs - the router, the set-top box and the cables hide behind the cane, which lets Wi-Fi out and air in;
  // own frame: the centre of the footprint at 0, facing +z
  // (W, D, H in m; LG the leg height, 0 for a hung one; hung: its own frame is then the back on the wall at 0, the top at 1.0 m)
  function caneConsole(W = 1.6, D = 0.38, H = 0.5, LG = 0.1, hung = false) {
    const g = new THREE.Group(), blk = M('#1c1b1a', { roughness: 0.5 });
    const bx = (w, h, d, x, y, z, m) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m || blk); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; g.add(o); return o; };
    bx(W, 0.025, D, 0, H - 0.0125, 0); bx(W - 0.04, 0.02, D - 0.02, 0, LG + 0.01, 0);
    [-1, 1].forEach(s => bx(0.025, H - LG - 0.025, D, s * (W / 2 - 0.0125), (H + LG) / 2 - 0.0125, 0));
    bx(W - 0.05, H - LG - 0.03, 0.01, 0, (H + LG) / 2 - 0.01, -D / 2 + 0.005);
    if (LG > 0) [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([sx, sz]) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.011, LG, 12), blk); l.position.set(sx * (W / 2 - 0.05), LG / 2, sz * (D / 2 - 0.05)); l.castShadow = true; g.add(l); });
    const nd = Math.max(2, Math.round(W / 0.4)), dw = (W - 0.05) / nd, dh = H - LG - 0.045, dy = (H + LG) / 2 - 0.012, z = D / 2 - 0.006;
    for (let i = 0; i < nd; i++) { const cx = -W / 2 + 0.025 + dw * (i + 0.5);
      bx(dw - 0.006, 0.022, 0.018, cx, dy + dh / 2 - 0.011, z); bx(dw - 0.006, 0.022, 0.018, cx, dy - dh / 2 + 0.011, z);
      bx(0.022, dh, 0.018, cx - dw / 2 + 0.014, dy, z); bx(0.022, dh, 0.018, cx + dw / 2 - 0.014, dy, z);
      const pane = new THREE.Mesh(new THREE.PlaneGeometry(dw - 0.05, dh - 0.044), caneTan); pane.position.set(cx, dy, z - 0.002); g.add(pane);
      const kn = new THREE.Mesh(new THREE.SphereGeometry(0.009, 10, 8), blk); kn.position.set(cx + (i % 2 ? -1 : 1) * (dw / 2 - 0.04), dy, z + 0.016); g.add(kn); }
    if (!hung) return g;
    const w = new THREE.Group(); g.position.set(0, 1.0 - H, D / 2); w.add(g); return w;
  }
  // a pair of botanical prints 500 x 700: black frames 25 mm, cream mats, a palm frond on one, a fan leaf on the other,
  // 80 mm apart; own frame: the back on the wall at 0, facing +z, the centre at 1.0 m
  function botanicalPair() {
    const g = new THREE.Group(), blk = M('#1c1b1a', { roughness: 0.5 });
    const print = (kind) => { const cv = document.createElement('canvas'); cv.width = 256; cv.height = 360; const x = cv.getContext('2d');
      x.fillStyle = '#f1ece0'; x.fillRect(0, 0, 256, 360); x.fillStyle = '#e8e1d2'; x.fillRect(28, 28, 200, 304); x.strokeStyle = '#3e6b3a'; x.fillStyle = '#4a7a42'; x.lineCap = 'round';
      if (kind === 'palm') { x.lineWidth = 3; x.beginPath(); x.moveTo(128, 320); x.quadraticCurveTo(120, 200, 150, 70); x.stroke();
        for (let i = 0; i < 22; i++) { const u = i / 22, px = 128 + (150 - 128) * u * u - 8 * u, py = 320 - 250 * u, L = 70 * Math.sin(Math.PI * (0.15 + 0.8 * u)); x.lineWidth = 2;
          [-1, 1].forEach(s => { x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + s * L * 0.6, py - 6, px + s * L, py + 18); x.stroke(); }); } }
      else { x.lineWidth = 3; x.beginPath(); x.moveTo(128, 320); x.lineTo(128, 190); x.stroke();
        for (let i = 0; i < 9; i++) { const a = -Math.PI * 0.95 + Math.PI * 0.9 * i / 8; x.beginPath(); x.moveTo(128, 190); x.quadraticCurveTo(128 + 50 * Math.cos(a - 0.15), 190 + 50 * Math.sin(a - 0.15), 128 + 95 * Math.cos(a), 190 + 95 * Math.sin(a));
          x.quadraticCurveTo(128 + 50 * Math.cos(a + 0.15), 190 + 50 * Math.sin(a + 0.15), 128, 190); x.fill(); } }
      const tx = new THREE.CanvasTexture(cv); tx.encoding = THREE.sRGBEncoding; return new THREE.MeshStandardMaterial({ map: tx, roughness: 0.9 }); };
    [['palm', -0.29], ['fan', 0.29]].forEach(([k, x0]) => {
      const f = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.025), blk); f.position.set(x0, 1.0, 0.0125); f.castShadow = true; g.add(f);
      const pm = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.66), print(k)); pm.position.set(x0, 1.0, 0.0255); g.add(pm); });
    return g;
  }
  // a small wall-hung router box (the user, 2026-10-24: 放个小框似乎就行啊): W360 x D130 x H220, black frame, natural cane front,
  // open bottom for the cables, slots in the top for air; own frame: the back on the wall at 0, facing +z, the top at 1.0 m
  function routerBox() {
    const g = new THREE.Group(), blk = M('#1c1b1a', { roughness: 0.5 }), W = 0.36, D = 0.13, H = 0.22, y0 = 1.0 - H;
    const bx = (w, h, d, x, y, z, m) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m || blk); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; g.add(o); return o; };
    [-1, 1].forEach(s => bx(0.015, H, D, s * (W / 2 - 0.0075), y0 + H / 2, D / 2));
    for (let i = 0; i < 6; i++) bx((W - 0.03) / 6 - 0.012, 0.012, D - 0.01, -W / 2 + 0.015 + ((W - 0.03) / 6) * (i + 0.5), 1.0 - 0.006, D / 2);   // the slatted top
    bx(W - 0.03, H - 0.012, 0.008, 0, y0 + (H - 0.012) / 2, 0.004);   // the back board
    [[W, 0.02, 0, 1.0 - 0.022], [W, 0.02, 0, y0 + 0.01]].forEach(([w, h, x, y]) => bx(w, h, 0.016, x, y, D - 0.008));
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.03, H - 0.05), caneTan); pane.position.set(0, y0 + H / 2 - 0.005, D - 0.01); g.add(pane);
    return g;
  }
  // a seagrass basket for the router (the user, 2026-10-24: 我想放这种里面，塞沙发旁边): D340 x H320, slightly tapered, a
  // twisted rim, two rope handles, a folded linen cloth over half the opening; own frame: the base centre at 0
  function seagrassBasket() {
    const g = new THREE.Group(), R = 0.17, H = 0.32;
    const wv = canvasTex(64, 64, (x, w, h) => { x.fillStyle = '#b39565'; x.fillRect(0, 0, w, h);
      for (let j = 0; j < h; j += 4) { x.fillStyle = j % 8 ? 'rgba(120,92,52,0.35)' : 'rgba(225,200,150,0.35)'; x.fillRect(0, j, w, 2); }
      for (let i = 0; i < w; i += 8) { x.fillStyle = 'rgba(90,68,38,0.25)'; x.fillRect(i, 0, 1, h); } });
    wv.wrapS = wv.wrapT = THREE.RepeatWrapping; wv.repeat.set(10, 5);
    const mt = new THREE.MeshStandardMaterial({ map: wv, roughness: 1, side: THREE.DoubleSide });
    const body = new THREE.Mesh(new THREE.LatheGeometry([[0.001, 0], [R - 0.02, 0], [R - 0.012, 0.012], [R, H - 0.02], [R + 0.004, H]].map(([rr, y]) => new THREE.Vector2(rr, y)), 40), mt); body.castShadow = body.receiveShadow = true; g.add(body);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(R + 0.004, 0.012, 8, 40), mt); rim.rotation.x = Math.PI / 2; rim.position.y = H; g.add(rim);
    [-1, 1].forEach(s => { const hd = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.008, 6, 16, Math.PI), new THREE.MeshStandardMaterial({ color: '#c9ad7c', roughness: 1 })); hd.position.set(s * (R + 0.006), H - 0.05, 0); hd.rotation.set(0, Math.PI / 2, Math.PI / 2 * s); g.add(hd); });
    const cloth = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.012, 0.3), M('#efe9de', { roughness: 1 })); cloth.position.set(-0.06, H + 0.012, 0); cloth.rotation.z = 0.05; g.add(cloth);
    return g;
  }
  // a solid-wood side table with a magazine slot (the user, 2026-10-24, a shop photo; about W500 x D300 x H500, estimated):
  // a top and two thick end panels in light oak, under the top a V slot - a sloping board and a low front board - for
  // magazines, or the router; own frame: the centre of the footprint at 0, facing +z (the slot opens to +z)
  function slotTable() {
    const g = new THREE.Group(), oak = M('#b8864f', { roughness: 0.6 }), W = 0.5, D = 0.3, H = 0.5, t = 0.025;
    const bx = (w, h, d, x, y, z, rx) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), oak); o.position.set(x, y, z); if (rx) o.rotation.x = rx; o.castShadow = o.receiveShadow = true; g.add(o); return o; };
    bx(W, t, D, 0, H - t / 2, 0); [-1, 1].forEach(s => bx(t, H - t, D, s * (W / 2 - t / 2), (H - t) / 2, 0));
    const a = Math.atan2(0.13, D - 0.04); bx(W - 2 * t, 0.018, Math.hypot(0.13, D - 0.04), 0, 0.33, -0.005, a);   // the sloping board, low at the front
    bx(W - 2 * t, 0.1, 0.018, 0, 0.29, D / 2 - 0.02);   // the low front board
    return g;
  }
  // a black square side table W450 x D450 x H500 (the user, 2026-10-24, a shop photo): four slab legs 45 thick and 130
  // wide, each flush with one face and half-round at its corner, turning round the table like a pinwheel; the top between
  // them; a cane shelf in a black frame at about half height; own frame: the centre of the footprint at 0
  function slabSideTable() {
    const g = new THREE.Group(), blk = M('#1a1918', { roughness: 0.6 }), S = 0.225, H = 0.5, T = 0.045, L = 0.13;
    const sh = new THREE.Shape(); sh.moveTo(S - L, -S); sh.lineTo(S - T / 2, -S); sh.absarc(S - T / 2, -S + T / 2, T / 2, -Math.PI / 2, Math.PI / 2, false); sh.lineTo(S - L, -S + T); sh.closePath();
    const geo = new THREE.ExtrudeGeometry(sh, { depth: H, bevelEnabled: false, curveSegments: 10 }); geo.rotateX(-Math.PI / 2);
    for (let i = 0; i < 4; i++) { const o = new THREE.Mesh(geo, blk); o.rotation.y = i * Math.PI / 2; o.castShadow = o.receiveShadow = true; g.add(o); }
    const bx = (w, h, d, x, y, z, m) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m || blk); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; g.add(o); return o; };
    bx(0.43, 0.03, 0.43, 0, H - 0.015, 0);
    const y = 0.22, I = S - T, f = 0.025;
    [-1, 1].forEach(s => { bx(2 * I, 0.03, f, 0, y, s * (I - f / 2)); bx(f, 0.03, 2 * I - 2 * f, s * (I - f / 2), y, 0); });
    const cane = new THREE.Mesh(new THREE.PlaneGeometry(2 * I - 2 * f, 2 * I - 2 * f), caneTan); cane.rotation.x = -Math.PI / 2; cane.position.y = y + 0.008; g.add(cane);
    return g;
  }
  // a black four-tier shelf side table W450 x D380 x H670 (the user, 2026-10-24, a shop photo): one solid side panel
  // whose front edge curves deep back between the shelves, four boards cantilevered from it (gaps 210 / 195 / 210, the
  // lowest on the floor), low lips along the open front and side of the lower three; own frame: the centre of the
  // footprint at 0, facing +z (the open front); the panel at -x, which shows on the right in the mirrored living room
  function tierSideTable() {
    const g = new THREE.Group(), blk = M('#1a1918', { roughness: 0.55 }), W = 0.45, D = 0.38, P = 0.018, t = 0.0145, z0 = D / 2;
    const lv = [0]; [0.21, 0.195, 0.21].forEach(h => lv.push(lv[lv.length - 1] + t + h)); const top = lv[3] + t;
    const sh = new THREE.Shape(); sh.moveTo(-z0, 0); sh.lineTo(z0, 0);
    for (let k = 0; k < 3; k++) { const a = lv[k] + t, b = lv[k + 1]; sh.lineTo(z0, a);
      for (let j = 1; j < 16; j++) { const u = j / 16; sh.lineTo(z0 - 0.22 * Math.sin(Math.PI * u), a + (b - a) * u); } sh.lineTo(z0, b); }
    sh.lineTo(z0, top); sh.lineTo(-z0, top); sh.closePath();
    const pg = new THREE.ExtrudeGeometry(sh, { depth: P, bevelEnabled: false }); pg.rotateY(-Math.PI / 2); pg.translate(-W / 2 + P, 0, 0);
    const pn = new THREE.Mesh(pg, blk); pn.castShadow = pn.receiveShadow = true; g.add(pn);
    const bx = (w, h, d, x, y, z) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), blk); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; g.add(o); return o; };
    const bw = W - P, bxc = P / 2;
    lv.forEach((y, k) => { bx(bw, t, D, bxc, y + t / 2, 0);
      if (k < 3) { bx(bw, 0.012, 0.012, bxc, y + t + 0.006, z0 - 0.006); bx(0.012, 0.012, D - 0.012, W / 2 - 0.006, y + t + 0.006, -0.006); }
      else bx(bw, 0.02, 0.012, bxc, y - 0.004, z0 - 0.006); });   // the top: a thicker front edge
    return g;
  }
  // the burl column (2026-10-19, the old window pedestal of the page; asked back on 2026-10-24): D300, 500 high
  // (also sold 800), pale honey burl with swirls and clusters of dark eyes; own frame: the base centre at 0
  function burlColumn() {
    const tx = canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#e1c895'; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 40; i++) { const cx = rnd(i + 800) * w, cy = rnd(i + 900) * h, rr = 12 + rnd(i + 1000) * 40;
        x.strokeStyle = 'rgba(186,146,92,' + (0.08 + rnd(i + 1100) * 0.14) + ')'; x.lineWidth = 1 + rnd(i + 1200) * 2;
        x.beginPath(); x.ellipse(cx, cy, rr, rr * (0.35 + rnd(i + 1300) * 0.4), rnd(i + 1400) * 3, 0, Math.PI * (1 + rnd(i + 1500))); x.stroke(); }
      for (let k = 0; k < 9; k++) { const cx = 20 + rnd(k + 1600) * 216, cy = 20 + rnd(k + 1700) * 216;
        const hg = x.createRadialGradient(cx, cy, 2, cx, cy, 22); hg.addColorStop(0, 'rgba(196,140,74,0.45)'); hg.addColorStop(1, 'rgba(196,140,74,0)');
        x.fillStyle = hg; x.beginPath(); x.arc(cx, cy, 22, 0, 6.283); x.fill();
        for (let i = 0; i < 22; i++) { x.fillStyle = 'rgba(104,64,30,0.75)'; x.beginPath(); x.arc(cx + (rnd(k * 30 + i + 1800) - 0.5) * 30, cy + (rnd(k * 30 + i + 1900) - 0.5) * 22, 0.8 + rnd(k * 30 + i + 2000) * 1.8, 0, 6.283); x.fill(); } } });
    tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(0.94, 0.5);
    const top = tx.clone(); top.needsUpdate = true; top.repeat.set(0.3, 0.3);
    const g = new THREE.Group(), side = new THREE.MeshStandardMaterial({ map: tx, roughness: 0.4 }), cap = new THREE.MeshStandardMaterial({ map: top, roughness: 0.4 });
    const o = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.5, 48), [side, cap, cap]); o.position.y = 0.25; o.castShadow = o.receiveShadow = true; g.add(o);
    return g;
  }
  // the black arch nesting tables (the user, 2026-10-25, a shop photo): W x W x H, a top on four panels each with an arch
  // through it (legs ~22% of the width either side, the arch top ~3/4 up); wall wt and top tt chosen so the three nest:
  // the middle (35) slides under the big (inside 35.6 x 42), the small (28) under the middle (inside 29 x 40); black ash;
  // own frame: the centre of the footprint at 0
  function archStool(W, H, wt, tt, mat) {
    const blackWood = mat || ARCH_MAT.black, g = new THREE.Group(), Hp = H - tt, a = W * 0.275, hA = Hp - a - Math.max(0.06, W * 0.17);
    const panel = w => { const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(-a, 0); s.lineTo(-a, hA);
      for (let k = 1; k <= 20; k++) { const th = Math.PI * (1 - k / 20); s.lineTo(a * Math.cos(th), hA + a * Math.sin(th)); }
      s.lineTo(a, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, Hp); s.lineTo(-w / 2, Hp); s.closePath();
      const geo = new THREE.ExtrudeGeometry(s, { depth: wt, bevelEnabled: false }); geo.translate(0, 0, -wt / 2); return geo; };
    const gF = panel(W), gS = panel(W - 2 * wt), o = W / 2 - wt / 2;
    [[gF, 0, o, 0], [gF, 0, -o, Math.PI], [gS, o, 0, Math.PI / 2], [gS, -o, 0, -Math.PI / 2]].forEach(([geo, x, z, ry]) => {
      const m = new THREE.Mesh(geo, blackWood); m.position.set(x, 0, z); m.rotation.y = ry; m.castShadow = m.receiveShadow = true; g.add(m); });
    const top = new THREE.Mesh(new THREE.BoxGeometry(W, tt, W), blackWood); top.position.y = H - tt / 2; top.castShadow = top.receiveShadow = true; g.add(top);
    return g;
  }
  const ARCH = { L: [0.40, 0.45, 0.022, 0.03], M: [0.35, 0.42, 0.03, 0.02], S: [0.28, 0.40, 0.025, 0.025] };
  // 2026-10-25 (拱门小几黑色太黑了，应该和椅子线条一样黑，他还有白色): the chairs' matt black, or white
  const ARCH_MAT = { black: M('#1c1b1a', { roughness: 0.5 }), white: M('#e6e2da', { roughness: 0.55 }) };
  const archOne = (k, m) => archStool(...ARCH[k], m);
  function archSet(m) { const g = archOne('L', m); g.add(archOne('M', m)); g.add(archOne('S', m)); return g; }
  const archSets = () => ['black', 'white'].map(c => { const g = archSet(ARCH_MAT[c]); g.userData.col = c; return g; });
  const paperCols = () => [['white'], ['black', M('#1c1b1a', { roughness: 0.95, flatShading: true })]].map(([c, m]) => { const o = paperColumn(300, 500, m); o.userData.col = c; return o; });   // nested, as stored
  // the CXLR oval C table (the user, 2026-10-25, a shop photo; black ash, 550 high - the rest estimated): an oval top
  // ~450 x 350 with a raised rim, a round column D75 at its back edge, an oval base ~400 x 300 under it; the top reaches
  // forward over the base like a C (slides over a sofa arm or a bed); own frame: the centre of the top at 0, facing +z
  function ovalCTable() {
    const g = new THREE.Group(), m = blackWood, H = 0.55;
    const oval = (rx, rz, h, y) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(rx, rx, h, 48), m); o.scale.z = rz / rx; o.position.y = y; o.castShadow = o.receiveShadow = true; g.add(o); return o; };
    oval(0.225, 0.175, 0.022, H - 0.011 - 0.012);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.218, 0.009, 8, 48), m); rim.rotation.x = Math.PI / 2; rim.scale.y = 0.175 / 0.225; rim.position.y = H - 0.012; g.add(rim);
    const b = oval(0.2, 0.15, 0.03, 0.015); b.position.set(-0.02, 0.015, -0.06);
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.0375, 0.0375, H - 0.06, 24), m); c.position.set(-0.06, (H - 0.03) / 2 + 0.015, -0.12); c.castShadow = true; g.add(c);
    return g;
  }
  // the zuoxia 斜塔 table (the user, 2026-10-25, a shop photo; black): a top 400 x 300 at 430, one board 275 wide slanting
  // from under the top near one end down to the floor past the middle, a foot 260 x 275 on the floor back under the top, a
  // small cross bar near the bottom of the slant; the far end of the top hangs free; own frame: the centre of the top at 0
  // (x flipped so it shows as in the photo in the mirrored living room)
  function slantTable() {
    const g = new THREE.Group(), m = M('#1c1b1a', { roughness: 0.55 }), T = 0.022;
    const bx = (w, h, d, x, y, z, rz) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); if (rz) o.rotation.z = rz; o.castShadow = o.receiveShadow = true; g.add(o); return o; };
    bx(0.40, T, 0.30, 0, 0.43 - T / 2, 0);
    const ax = 0.115, ay = 0.43 - T, bxp = -0.06, L = Math.hypot(bxp - ax, ay), ang = Math.atan2(bxp - ax, ay);
    bx(T, L, 0.275, (ax + bxp) / 2, ay / 2, 0, ang);                         // the slant
    bx(0.26, 0.016, 0.275, bxp + 0.13 - 0.01, 0.008, 0);                     // the foot
    bx(0.09, 0.016, 0.2, ax - 0.03, ay - 0.008, 0);                          // a cleat under the top
    bx(0.07, 0.018, 0.29, bxp + 0.045, 0.1, 0);                              // the cross bar near the bottom
    return g;
  }
  // three more coffee tables to try (the user, 2026-10-25, shop photos); own frames: the centre of the footprint at 0, the
  // length along x (turn them a quarter to lie along the sofa)
  const rrShape = (w, d, rr, path) => { const s = path ? new THREE.Path() : new THREE.Shape(), x = w / 2 - rr, z = d / 2 - rr;
    s.absarc(x, z, rr, 0, Math.PI / 2); s.absarc(-x, z, rr, Math.PI / 2, Math.PI); s.absarc(-x, -z, rr, Math.PI, 1.5 * Math.PI); s.absarc(x, -z, rr, 1.5 * Math.PI, 2 * Math.PI); return s; };
  // the burl block 1000 x 700 x 350: corners R200, every face in the pale honey burl of the burl waterfall table (the
  // user, 2026-10-25: the same colour as the other burl, one material all round), a 15 mm lip standing 4 mm proud round
  // the top, a plinth set in 15 mm
  function burlPillTable(W = 1.0) {   // smaller ones keep the 10:7 plan and the corner, 35 high
    const g = new THREE.Group(), D = W * 0.7, H = 0.35, R = 0.2 * W;
    const burl = burlAmber;
    const put = (m, y) => { m.position.y = y; m.castShadow = m.receiveShadow = true; g.add(m); return m; };
    put(rbox(W - 0.03, 0.02, D - 0.03, R - 0.015, burl), 0);
    put(rbox(W, H - 0.026, D, R, burl), 0.02);
    put(rbox(W - 0.03, 0.004, D - 0.03, R - 0.015, burl), H - 0.008);
    const ring = rrShape(W, D, R); ring.holes.push(rrShape(W - 0.03, D - 0.03, R - 0.015, true));
    const rg = new THREE.ExtrudeGeometry(ring, { depth: 0.008, bevelEnabled: false, curveSegments: 12 }); rg.rotateX(-Math.PI / 2); put(new THREE.Mesh(rg, burl), H - 0.008);
    return g;
  }
  // the two coffee tables the owner sent (2026-10-27): the LEFUR Soda in blue glass, D550 x 300, and the woven straw
  // tatami table, which comes in 60 x 45 x 30 (small) and 80 x 50 x 35 (medium)
  const sodaTable = () => { const g = new THREE.Group();
    const gl = new THREE.MeshStandardMaterial({ color: '#2f7fb5', transparent: true, opacity: 0.66, roughness: 0.06, metalness: 0.05 });
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.275, 0.268, 0.05, 56), gl); top.position.y = 0.275; top.castShadow = true; g.add(top);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.272, 0.016, 12, 56), gl); rim.rotation.x = Math.PI / 2; rim.position.y = 0.252; g.add(rim);
    [[-0.08, -0.08], [0.08, -0.08], [-0.08, 0.08], [0.08, 0.08]].forEach(([x, z]) => {
      const l = new THREE.Mesh(new THREE.CylinderGeometry(0.077, 0.077, 0.25, 28), gl); l.position.set(x, 0.125, z); l.castShadow = true; g.add(l); });
    return g; };
  const tatamiTable = (W, D, H) => { const g = new THREE.Group(), st = rattanMat.clone(); st.map = rattanMat.map.clone(); st.map.repeat.set(W * 7, 4); st.map.needsUpdate = true;
    const body = rbox(W, H - 0.04, D, 0.03, st); body.position.y = (H - 0.04) / 2; body.castShadow = body.receiveShadow = true; g.add(body);
    const top = rbox(W + 0.012, 0.04, D + 0.012, 0.022, st); top.position.y = H - 0.02; top.castShadow = true; g.add(top);
    return g; };
  // the 筇竹 tea table 1050 x 580 x 450, black: bamboo-jointed rods round the top (crossing a little at the corners) over a
  // cane panel, a frame under them, aprons whose lower edge arches up toward the middle, legs with a knee and a kicked foot
  function bambooRimTable() {
    const g = new THREE.Group(), W = 1.05, D = 0.58, H = 0.45, blk = M('#1a1816', { roughness: 0.4 }), nodeM = M('#6b5a44', { roughness: 0.35 }), yr = H - 0.017;
    const add2 = (m, x, y, z) => { m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
    const bx = (w, h, d, x, y, z, m) => add2(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m || blk), x, y, z);
    bx(W - 0.03, 0.035, D - 0.03, 0, yr - 0.0175, 0);
    const mat = canvasTex(32, 32, (x, w, h) => { x.fillStyle = '#a8773f'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(92,58,24,0.5)'; x.lineWidth = 1.2;
      for (let i = -32; i < 64; i += 4) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 32, 32); x.stroke(); } for (let j = 0; j < 32; j += 8) { x.fillStyle = 'rgba(255,230,180,0.12)'; x.fillRect(0, j, 32, 3); } });
    mat.wrapS = mat.wrapT = THREE.RepeatWrapping; mat.repeat.set((W - 0.07) / 0.04, (D - 0.07) / 0.04);   // a tight woven rattan mat
    const cane = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.07, D - 0.07), new THREE.MeshStandardMaterial({ map: mat, roughness: 0.85 })); cane.rotation.x = -Math.PI / 2; add2(cane, 0, yr + 0.002, 0);
    const rodX = z => { const c = add2(new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, W + 0.02, 16), blk), 0, yr, z); c.rotation.z = Math.PI / 2;
      for (let x = -W / 2 + 0.07; x < W / 2 - 0.03; x += 0.15) { const n = add2(new THREE.Mesh(new THREE.TorusGeometry(0.0175, 0.004, 6, 16), nodeM), x, yr, z); n.rotation.y = Math.PI / 2; } };
    const rodZ = x => { const c = add2(new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, D + 0.02, 16), blk), x, yr + 0.001, 0); c.rotation.x = Math.PI / 2;
      for (let z = -D / 2 + 0.08; z < D / 2 - 0.04; z += 0.14) add2(new THREE.Mesh(new THREE.TorusGeometry(0.0175, 0.004, 6, 16), nodeM), x, yr + 0.001, z); };
    [-1, 1].forEach(s => { rodX(s * (D / 2 - 0.017)); rodZ(s * (W / 2 - 0.017)); });
    const apron = L => { const s = new THREE.Shape(), n = 24; s.moveTo(-L / 2, 0); s.lineTo(L / 2, 0);
      for (let i = 0; i <= n; i++) { const x = L / 2 - L * i / n, u = Math.abs(x) / (L / 2); s.lineTo(x, -0.03 - 0.045 * Math.pow(u, 4)); }
      s.closePath(); const geo = new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: false }); geo.translate(0, 0, -0.01); return geo; };
    const yA = yr - 0.035, lx = W / 2 - 0.06, lz = D / 2 - 0.06;
    [-1, 1].forEach(s => { add2(new THREE.Mesh(apron(2 * lx), blk), 0, yA, s * lz);
      const e = add2(new THREE.Mesh(apron(2 * lz), blk), s * lx, yA, 0); e.rotation.y = Math.PI / 2; });
    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([sx, sz]) => { const x = sx * lx, z = sz * lz;
      bx(0.05, 0.07, 0.05, x, yA - 0.035, z);                                            // the knee
      bx(0.038, yA - 0.14, 0.038, x, (yA - 0.07 + 0.07) / 2, z);                          // the leg
      const f = bx(0.042, 0.08, 0.042, x + sx * 0.012, 0.04, z + sz * 0.012); f.rotation.set(-sz * 0.3, 0, sx * 0.3); });   // the foot kicked out
    return g;
  }
  // the water-hyacinth table 1000 x 500 x 380 (dark): a 70 mm top and two 70 mm end panels in chunky braid, a fine rattan
  // panel let into the top, striped cane on the inner faces of the ends
  function hyacinthTable() {
    const g = new THREE.Group(), W = 1.0, D = 0.5, H = 0.38, T = 0.07;
    const braid = canvasTex(64, 32, (x, w, h) => { x.fillStyle = '#5e4120'; x.fillRect(0, 0, w, h);
      for (let row = 0; row < 2; row++) for (let i = -1; i < 5; i++) { const cx = i * 16 + (row ? 8 : 0), cy = row * 16 + 8;
        const gr = x.createLinearGradient(cx - 8, cy - 6, cx + 8, cy + 6); gr.addColorStop(0, '#d6a05a'); gr.addColorStop(0.5, '#b47e3e'); gr.addColorStop(1, '#7f5428');
        x.fillStyle = gr; x.beginPath(); x.ellipse(cx, cy, 9, 5.5, row ? 0.5 : -0.5, 0, 6.283); x.fill(); } });
    const twill = canvasTex(32, 32, (x, w, h) => { x.fillStyle = '#9c6c36'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(70,44,18,0.55)'; x.lineWidth = 1.4;
      for (let i = -32; i < 64; i += 4) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 32, 32); x.stroke(); } });
    const strip = canvasTex(32, 32, (x, w, h) => { x.fillStyle = '#d8b989'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(150,108,62,0.7)'; x.lineWidth = 2;
      for (let i = -32; i < 64; i += 6) { x.beginPath(); x.moveTo(i, 32); x.lineTo(i + 20, 0); x.stroke(); } });
    const mt = (tx, w, h, rw, rh) => { const c = tx.clone(); c.needsUpdate = true; c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(Math.max(1, w / rw), Math.max(1, h / rh)); return new THREE.MeshStandardMaterial({ map: c, roughness: 0.95 }); };
    const bm = (w, h) => mt(braid, w, h, 0.1, 0.05);
    const top = new THREE.Mesh(new THREE.BoxGeometry(W, T, D), [bm(D, T), bm(D, T), bm(W, D), bm(W, D), bm(W, T), bm(W, T)]);
    top.position.y = H - T / 2; top.castShadow = top.receiveShadow = true; g.add(top);
    const pn = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.15, D - 0.15), mt(twill, W - 0.15, D - 0.15, 0.05, 0.05)); pn.rotation.x = -Math.PI / 2; pn.position.y = H + 0.002; g.add(pn);
    const lh = H - T, st = mt(strip, D, lh, 0.08, 0.08);
    [-1, 1].forEach(s => { const out = bm(D, lh), mats = [s > 0 ? out : st, s > 0 ? st : out, bm(T, D), bm(T, D), bm(T, lh), bm(T, lh)];
      const l = new THREE.Mesh(new THREE.BoxGeometry(T, lh, D), mats); l.position.set(s * (W / 2 - T / 2), lh / 2, 0); l.castShadow = l.receiveShadow = true; g.add(l); });
    return g;
  }
  // a Burmese teak table 900 x 450 x 400 (the user, 2026-10-25, a shop photo; the size corrected the same day): a 30 mm top over a 65 mm apron set
  // in 30, four turned legs (a square block under the apron, then a ring, a vase and a taper to a small foot); teak or black,
  // both in the piece, the colour row shows one; own frame: the centre of the footprint at 0, the length along x
  const TONES = ['teak', 'black'];
  function teakTeaTable() {
    const g = new THREE.Group(), W = 0.9, D = 0.45, H = 0.4, TN = 0.27;   // TN: the turned part of each leg
    const one = (m, tone) => { const s = new THREE.Group(); s.userData.tone = tone;
      const bx = (w, h, d, x, y, z) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; s.add(o); };
      bx(W, 0.03, D, 0, H - 0.015, 0);
      const ax = W / 2 - 0.03, az = D / 2 - 0.03;
      [-1, 1].forEach(q => { bx(2 * ax - 0.05, 0.065, 0.018, 0, H - 0.03 - 0.0325, q * (az - 0.009)); bx(0.018, 0.065, 2 * az - 0.05, q * (ax - 0.009), H - 0.03 - 0.0325, 0); });
      const prof = [[0.001, 0], [0.012, 0], [0.013, 0.012], [0.017, 0.03], [0.021, 0.052], [0.016, 0.062], [0.023, 0.085], [0.024, 0.11], [0.017, 0.132], [0.022, 0.142], [0.022, 0.15], [0.001, 0.15]].map(([rr, y]) => new THREE.Vector2(rr * 1.15, y * TN / 0.15));
      const lg = new THREE.LatheGeometry(prof, 20);
      [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([sx, sz]) => { const x = sx * (ax - 0.025), z = sz * (az - 0.025);
        const l = new THREE.Mesh(lg, m); l.position.set(x, 0, z); l.castShadow = true; s.add(l); bx(0.05, H - 0.03 - TN, 0.05, x, TN + (H - 0.03 - TN) / 2, z); });
      g.add(s); };
    one(woodMat('#84603c', '#55391f'), 'teak'); one(blackWood, 'black');
    return g;
  }
  // the cane lounger in black (as bought) or natural wood: both frames in the piece, the row shows one
  const FRMS = ['black', 'oak'], oakFrame = M('#b88b58', { roughness: 0.55 });
  const loungers = () => { const a = LOUNGER.clone(true), b = LOUNGER.clone(true); a.userData.frm = 'black'; b.userData.frm = 'oak';
    b.traverse(o => { if (o.isMesh && !o.material.map && !o.userData.keep) o.material = oakFrame; }); return [a, b]; };
  // the scroll-arm planter chair (the user, 2026-10-25: 图片这个椅子也模拟一把，买的到的 - their photo): a black frame, a
  // close-woven caramel cane seat and back; flat arms running forward into a big scroll that curls down and under, an S
  // support down to the seat rail; curved legs splayed forward and back, a ring-turned stretcher low at the front; the
  // lumbar cushion; about 65 x 78 x 87, seat about 40, arms about 61; its own frame: the centre of the footprint at 0, facing +z
  function scrollChair() {
    const g = new THREE.Group(), blk = M('#1c1b1a', { roughness: 0.5 }), SW = 0.27;
    const side = (X, pts, rad, sx) => { const c = new THREE.CatmullRomCurve3(pts.map(([z, y]) => new THREE.Vector3(0, y, z)));
      const m = new THREE.Mesh(new THREE.TubeGeometry(c, 80, rad, 12, false), blk); m.scale.x = sx; m.position.x = X; m.castShadow = m.receiveShadow = true; g.add(m); return m; };
    const rod = (y, z, rad) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, 2 * SW, 20), blk); m.rotation.z = Math.PI / 2; m.position.set(0, y, z); m.castShadow = true; g.add(m); return m; };
    [-1, 1].forEach(s => { const X = s * SW, XA = s * (SW + 0.02);
      side(X, [[0.3, 0.4], [0.15, 0.395], [0, 0.385], [-0.15, 0.372], [-0.23, 0.372]], 0.028, 0.6);
      side(X, [[-0.235, 0.32], [-0.26, 0.45], [-0.3, 0.6], [-0.34, 0.74], [-0.37, 0.86]], 0.026, 0.7);
      side(X, [[0.2, 0.392], [0.26, 0.31], [0.305, 0.19], [0.34, 0.08], [0.365, 0]], 0.026, 0.65);
      side(X, [[-0.12, 0.378], [-0.22, 0.29], [-0.3, 0.17], [-0.35, 0.07], [-0.375, 0]], 0.026, 0.65);
      side(XA, [[-0.31, 0.6], [-0.15, 0.605], [0, 0.61], [0.14, 0.61], [0.21, 0.605], [0.26, 0.595], [0.295, 0.57], [0.305, 0.535], [0.29, 0.5], [0.255, 0.48], [0.215, 0.49],
        [0.195, 0.52], [0.2, 0.555], [0.225, 0.572], [0.255, 0.565], [0.268, 0.54], [0.258, 0.518], [0.238, 0.512]], 0.014, 2.6);
      side(XA, [[0.25, 0.485], [0.238, 0.455], [0.226, 0.425], [0.22, 0.4]], 0.014, 2.2); });
    rod(0.395, 0.3, 0.022); rod(0.372, -0.225, 0.018); rod(0.85, -0.365, 0.024); rod(0.42, -0.245, 0.016);
    rod(0.1, 0.335, 0.014); [-0.15, -0.05, 0.05, 0.15].forEach(x => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 8), blk); b.scale.set(0.65, 1, 1); b.position.set(x, 0.1, 0.335); g.add(b); });
    rod(0.1, -0.338, 0.013);
    const cv = document.createElement('canvas'); cv.width = cv.height = 32; const x = cv.getContext('2d'); x.fillStyle = '#9a6b40'; x.fillRect(0, 0, 32, 32);
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { const h = (i + j) % 2; x.fillStyle = h ? 'rgba(255, 220, 160, 0.16)' : 'rgba(70, 40, 15, 0.16)'; x.fillRect(j * 4, i * 4, 4, 4);
      x.strokeStyle = 'rgba(60, 35, 12, 0.35)'; x.lineWidth = 0.6; x.beginPath(); if (h) { x.moveTo(j * 4, i * 4 + 2); x.lineTo(j * 4 + 4, i * 4 + 2); } else { x.moveTo(j * 4 + 2, i * 4); x.lineTo(j * 4 + 2, i * 4 + 4); } x.stroke(); }
    const tx = new THREE.CanvasTexture(cv); tx.encoding = THREE.sRGBEncoding; tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(12, 12);
    const cane = new THREE.MeshStandardMaterial({ map: tx, roughness: 0.6, side: THREE.DoubleSide }), Wd = 2 * SW - 0.03;
    const strip = prof => { const pts = new THREE.CatmullRomCurve3(prof.map(([z, y]) => new THREE.Vector3(0, y, z))).getPoints(24), pos = [], uv = [], idx = []; let len = 0;
      pts.forEach((q, i) => { if (i) len += q.distanceTo(pts[i - 1]); [-Wd / 2, Wd / 2].forEach((xx, j) => { pos.push(xx, q.y, q.z); uv.push(j * Wd, len); }); });
      for (let i = 0; i < 24; i++) { const a = 2 * i; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, cane); m.castShadow = m.receiveShadow = true; g.add(m); };
    strip([[0.285, 0.41], [0.1, 0.392], [-0.1, 0.378], [-0.215, 0.382]]); strip([[-0.24, 0.425], [-0.268, 0.55], [-0.305, 0.7], [-0.345, 0.825]]);
    const pl = lumbarPillow(); pl.position.set(0, 0.529, -0.215); pl.rotation.x = -0.257; g.add(pl);
    return g;
  }
  // a tall areca palm (the user, 2026-10-23: 自选里面增加一盆很高的绿叶植物，新加坡本地植物 - their photos: slender canes with
  // arching feathery fronds, in a white planter with moss or in a woven basket): a dozen canes, each ending in an arching
  // frond of narrow drooping leaflets; a woven seagrass basket or a smooth white planter, D450 x H420, moss on top; its own
  // frame: the pot centre at 0; about 1.8 m tall as built - the height row scales the canes and fronds about the pot top
  function arecaPalm() {
    const g = new THREE.Group(), V = (x, y, z) => new THREE.Vector3(x, y, z);
    const fol = potPair(g);
    const caneM = M('#7c8a3e', { roughness: 0.7 }), leafM = [M('#3d6b2a', { roughness: 0.75, side: THREE.DoubleSide }), M('#507d33', { roughness: 0.75, side: THREE.DoubleSide })], pos = [[], []];
    for (let i = 0; i < 12; i++) {
      const az = i * 2.399 + rnd(i + 900) * 0.6, out = V(Math.cos(az), 0, Math.sin(az));
      const b = V(out.x * 0.07 * rnd(i + 910), 0, out.z * 0.07 * rnd(i + 920)), hTop = 0.45 + 0.5 * rnd(i + 930), lean = 0.05 + 0.1 * rnd(i + 940);
      const top = b.clone().addScaledVector(out, lean).setY(hTop);
      fol.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([b, b.clone().lerp(top, 0.5).addScaledVector(out, -0.02), top]), 8, 0.011, 6, false), caneM));
      const L = 0.45 + 0.22 * rnd(i + 950), rise = 0.26 + 0.17 * rnd(i + 960);
      const fr = new THREE.CatmullRomCurve3([top, top.clone().addScaledVector(out, L * 0.3).add(V(0, rise, 0)), top.clone().addScaledVector(out, L * 0.65).add(V(0, rise * 0.9, 0)), top.clone().addScaledVector(out, L).add(V(0, rise * 0.2, 0))]);
      fol.add(new THREE.Mesh(new THREE.TubeGeometry(fr, 16, 0.006, 5, false), caneM));
      const P = pos[i % 2];
      for (let j = 0; j < 26; j++) { const u = 0.08 + 0.92 * j / 25, q = fr.getPointAt(u), tg = fr.getTangentAt(u), sd = V(0, 1, 0).cross(tg).normalize();
        const ll = 0.26 * (0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, u * 1.1)));
        [-1, 1].forEach(sg => { const dir = sd.clone().multiplyScalar(sg).addScaledVector(tg, 0.55).add(V(0, -0.55 - 0.3 * u, 0)).normalize();
          const tip = q.clone().addScaledVector(dir, ll).add(V(0, -0.2 * ll, 0)), mid = q.clone().addScaledVector(dir, ll * 0.4), wd = dir.clone().cross(tg).cross(dir).normalize().multiplyScalar(0.016);
          const a1 = mid.clone().add(wd), a2 = mid.clone().sub(wd);
          P.push(q.x, q.y, q.z, a1.x, a1.y, a1.z, tip.x, tip.y, tip.z, q.x, q.y, q.z, tip.x, tip.y, tip.z, a2.x, a2.y, a2.z); }); }
    }
    pos.forEach((P, k) => { const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); lg.computeVertexNormals(); const lm = new THREE.Mesh(lg, leafM[k]); lm.castShadow = true; fol.add(lm); });
    return g;
  }
  // the orchid vase (ORCH_V) and the cane lounge chair (LOUNGER) are built on the page; the copy takes them from there
  // a fruit bowl (2026-10-25: 装饰加水果盘): a shallow cream ceramic bowl D300 with two oranges, a lemon, a red and a green apple
  const fruitBowl = () => { const g = new THREE.Group(), cer = M('#ece6da', { roughness: 0.5 });
    const bowl = new THREE.Mesh(new THREE.LatheGeometry([[0.001, 0], [0.06, 0], [0.12, 0.03], [0.15, 0.068], [0.145, 0.07], [0.115, 0.034], [0.055, 0.008], [0.001, 0.008]].map(([q, y]) => new THREE.Vector2(q, y)), 40), cer); bowl.castShadow = true; g.add(bowl);
    [['#e8892b', 0, 0, 0.04, 0.03], ['#e8892b', 0.06, 0.03, 0.038, 0], ['#e9c54a', -0.055, 0.035, 0.036, 0], ['#c43a2e', 0.02, -0.06, 0.037, 0], ['#9cbf4a', -0.045, -0.04, 0.035, 0]].forEach(([c, x, z, q, up]) => {
      const f = new THREE.Mesh(new THREE.SphereGeometry(q, 16, 12), M(c, { roughness: 0.5 })); f.position.set(x, 0.01 + q * 0.9 + up, z); f.castShadow = true; g.add(f); }); return g; };
  // two lamps (2026-10-25: 古典台灯 / 转臂极简落地灯): a ginger-jar table lamp with an empire shade, a black swing-arm floor lamp
  // the table lamp since 2026-10-25 (台灯用这个款, 中古磨砂黑 小号 30 x 40): a matt black ceramic jar, a short black stem, a wide
  // cream coolie shade D30 x 17; rechargeable, no cord
  // two soft pieces for the white sofa (2026-10-25, 组合B: 白沙发上搭一条燕麦色粗针毯，再加两个橄榄绿、焦糖色的靠垫): a chunky-knit
  // oatmeal throw folded to about 50 x 36 on the seat; two cushions 45 x 45 x 14, olive and caramel, leaning back side by side
  const softTex = (base, dark, light, rib) => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); x.fillStyle = base; x.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 64; i += rib) { x.fillStyle = dark; x.fillRect(i, 0, Math.max(1, rib / 4), 64); x.fillStyle = light; x.fillRect(i + rib / 2, 0, Math.max(1, rib / 4), 64); }
    if (rib > 4) for (let y = 0; y < 64; y += 6) for (let i = 0; i < 64; i += rib) { x.strokeStyle = dark; x.lineWidth = 1; x.beginPath(); x.moveTo(i, y); x.lineTo(i + rib / 2, y + 3); x.lineTo(i + rib, y); x.stroke(); }
    const tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding; tx.wrapS = tx.wrapT = THREE.RepeatWrapping; return tx; };
  const knitThrow = () => { const g = new THREE.Group(), tx = softTex('#d8c8a6', 'rgba(110, 90, 60, 0.35)', 'rgba(255, 248, 230, 0.3)', 8); tx.repeat.set(10, 10);
    const m = new THREE.MeshStandardMaterial({ map: tx, roughness: 1 }), a = rbox(0.5, 0.036, 0.36, 0.06, m); a.castShadow = a.receiveShadow = true; g.add(a);
    const b = rbox(0.48, 0.034, 0.34, 0.06, m); b.position.set(0.01, 0.034, -0.006); b.rotation.y = 0.05; b.castShadow = true; g.add(b); return g; };
  const sqPillow = col => { const W = 0.45, D = 0.14, geo = new THREE.BoxGeometry(W, W, D, 20, 20, 1), q = geo.attributes.position;
    for (let i = 0; i < q.count; i++) { const u = Math.max(-1, Math.min(1, q.getX(i) / (W / 2))), v = Math.max(-1, Math.min(1, q.getY(i) / (W / 2))), f = Math.sqrt(1 - u * u) * Math.sqrt(1 - v * v);
      q.setXYZ(i, q.getX(i) * (1 - 0.06 * (1 - v * v)), q.getY(i) * (1 - 0.06 * (1 - u * u)), q.getZ(i) * (0.12 + 0.88 * f)); }
    geo.computeVertexNormals(); const tx = softTex(col, 'rgba(0, 0, 0, 0.06)', 'rgba(255, 255, 255, 0.05)', 2); tx.repeat.set(6, 6);
    const o = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tx, roughness: 0.95 })); o.castShadow = o.receiveShadow = true; return o; };
  const pillowPair = () => { const g = new THREE.Group(); [[-0.21, '#6f7a4a', 0.06], [0.21, '#a8672f', -0.07]].forEach(([x, c, ry]) => { const o = sqPillow(c); o.position.set(x, 0.21, 0.03); o.rotation.set(-0.32, ry, 0); g.add(o); }); return g; };
  // two curved sofas (the user, 2026-10-26: 现在模拟这两个豌豆沙发 ... 认真建模 - shop sheets and photos): the crescent 圆弧沙发
  // S1540 260 x 140 x 80 and the bean 豌豆沙发 QJ2316 252 x 135 x 72, built at their own size; the fabric white, a soft lemon
  // or light blue, and a blue-and-white ikat (as on the reference armchairs) on the seat or on the backs; the parts carry
  // userData.role (seat / back) and uvk (how their texture coordinates run: m metres, sph round, box per face)
  const FAB = { white: '#eee9e0', lemon: '#f5e9a2', blue: '#bcd0e2', teal: '#8fbfb2' }, FAB_REP = { m: [6, 6], sph: [12, 6], box: [3, 3] }, PAT_REP = { m: [2, 2], sph: [5, 2], box: [1, 1] };
  const fabTex = col => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); x.fillStyle = col; x.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 700; i++) { x.fillStyle = rnd(i * 3 + 7) < 0.5 ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)'; x.fillRect(rnd(i * 5 + 1) * 64, rnd(i * 11 + 2) * 64, 1.5, 1.5); } return c; };
  const ikatCanvas = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); x.fillStyle = '#f3f0e8'; x.fillRect(0, 0, 256, 256);
    const motif = (cx, cy, k) => { for (let dy = -60; dy <= 60; dy += 3) { const q = 1 - (dy / 60) * (dy / 60); if (q <= 0) continue; const hw = 40 * Math.sqrt(q), j1 = (rnd(k * 131 + dy) - 0.5) * 12, j2 = (rnd(k * 71 + dy + 9) - 0.5) * 12;
        x.globalAlpha = 0.85; x.fillStyle = '#86a3c4'; x.fillRect(cx - hw + j1, cy + dy, 2 * hw - j1 + j2, 2.4);
        if (q > 0.45) { const hi = hw * 0.45; x.globalAlpha = 0.9; x.fillStyle = '#c3d3e4'; x.fillRect(cx - hi + j2 * 0.5, cy + dy, 2 * hi, 2.4); } }
      for (let i = 0; i < 10; i++) { x.globalAlpha = 0.5; x.fillStyle = '#86a3c4'; x.fillRect(cx - 50 + rnd(k * 17 + i) * 100, cy - 64 + rnd(k * 29 + i) * 128, 4 + rnd(k * 37 + i) * 10, 2); } x.globalAlpha = 1; };
    [[64, 64], [192, 64], [0, 192], [128, 192], [256, 192]].forEach(([cx, cy], k) => motif(cx, cy, k)); [[64, 320], [192, 320], [64, -64], [192, -64]].forEach(([cx, cy], k) => motif(cx, cy, k));
    return c; })();
  const MAT_C = {}, texMat = (key, canvas, rep, rough) => { if (MAT_C[key]) return MAT_C[key]; const tx = new THREE.CanvasTexture(canvas); tx.encoding = THREE.sRGBEncoding; tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(...rep); return MAT_C[key] = new THREE.MeshStandardMaterial({ map: tx, roughness: rough, side: THREE.DoubleSide }); };
  const FAB_CV = {}, fabFor = (col, uvk) => texMat('f' + col + uvk, FAB_CV[col] || (FAB_CV[col] = fabTex(FAB[col])), FAB_REP[uvk || 'm'], 0.9), patFor = uvk => texMat('p' + uvk, ikatCanvas, PAT_REP[uvk || 'm'], 0.88);
  const role = (o, rl, uvk) => { o.userData.role = rl; o.userData.uvk = uvk; o.material = fabFor('white', uvk); return o; };
  const applyFab = (w, c) => { const [c0, p0] = String(c || 'white').split('|'), col = FAB[c0] ? c0 : 'white', pat = ['seat', 'back'].includes(p0) ? p0 : ''; w.userData.free.c = col + (pat ? '|' + pat : '');
    w.children[0].traverse(o => { if (o.isMesh && o.userData.role) o.material = o.userData.role === pat ? patFor(o.userData.uvk) : fabFor(col, o.userData.uvk); }); };
  const slab = (pts, y0, h, bev, m) => { const sh = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z))), geo = new THREE.ExtrudeGeometry(sh, { depth: Math.max(0.001, h - 2 * bev), bevelEnabled: bev > 0, bevelThickness: bev, bevelSize: bev, bevelSegments: 5, curveSegments: 6 });
    geo.rotateX(-Math.PI / 2); geo.translate(0, y0 + bev, 0); const o = new THREE.Mesh(geo, m); o.castShadow = o.receiveShadow = true; return o; };
  const fitTo = (g, W, D) => { g.updateMatrixWorld(true); const b = new THREE.Box3().setFromObject(g), sx = W / (b.max.x - b.min.x), sz = D / (b.max.z - b.min.z), cx = (b.min.x + b.max.x) / 2, cz = (b.min.z + b.max.z) / 2;
    const o = new THREE.Group(); g.position.set(-cx * sx, 0, -cz * sz); g.scale.set(sx, 1, sz); o.add(g); return o; };
  // the crescent: concentric arcs about a point in front (radius 2.0, 30 degrees either side), a back shell 26 thick swept
  // along the curve and round both ends as arms (flat top, 7 cm rounded edges, the seat side leaning back 3 cm), 80 high at
  // the back sloping to 64 at the arm ends; two seat cushions 66 deep, 45 high, a soft rolled edge; two back pillows; a
  // light plinth 5 high set in 1.5 %
  const arcSofa = () => { const g = new THREE.Group(), Ro = 2.0, tb = 0.26, ds = 0.66, Ri = Ro - tb - ds, rs = ds / 2, Rs = Ri + rs, phi = 0.53, zO = 0;
    const P = (a, rr) => [rr * Math.sin(a), zO - rr * Math.cos(a)];
    const cap = (s, rr, b) => { const a = s * phi, u = [Math.sin(a), -Math.cos(a)], tt = [s * Math.cos(a), s * Math.sin(a)], c = P(a, Rs); return [c[0] + rr * (Math.cos(b) * u[0] + Math.sin(b) * tt[0]), c[1] + rr * (Math.cos(b) * u[1] + Math.sin(b) * tt[1])]; };
    const arc = (rr, a0, a1, n) => Array.from({ length: n + 1 }, (_, i) => P(a0 + (a1 - a0) * i / n, rr)), cp = (s, rr, b0, b1, n) => Array.from({ length: n + 1 }, (_, i) => cap(s, rr, b0 + (b1 - b0) * i / n));
    const sweep = (path, w, hOf) => { const pos = [], uv = [], idx = [], NP = path.length; let len = 0, PR = 0;
      path.forEach(([x, z], i) => { const [x0, z0] = path[Math.max(0, i - 1)], [x1, z1] = path[Math.min(NP - 1, i + 1)], L = Math.hypot(x1 - x0, z1 - z0) || 1, nx = (z1 - z0) / L, nz = -(x1 - x0) / L, h = hOf(i), rr = 0.07, ln = 0.03;
        if (i) len += Math.hypot(x - path[i - 1][0], z - path[i - 1][1]);
        const prof = [[-w / 2, 0.05], [-w / 2 + ln, h - rr]]; for (let k = 1; k <= 5; k++) { const th = Math.PI - k * Math.PI / 10; prof.push([-w / 2 + ln + rr + rr * Math.cos(th), h - rr + rr * Math.sin(th)]); }
        for (let k = 0; k <= 5; k++) { const th = Math.PI / 2 - k * Math.PI / 10; prof.push([w / 2 - rr + rr * Math.cos(th), h - rr + rr * Math.sin(th)]); } prof.push([w / 2, 0.05]); PR = prof.length;
        let pl = 0; prof.forEach(([d, y], j) => { if (j) pl += Math.hypot(d - prof[j - 1][0], y - prof[j - 1][1]); pos.push(x + nx * d, y, z + nz * d); uv.push(len, pl); }); });
      for (let i = 0; i < NP - 1; i++) for (let j = 0; j < PR - 1; j++) { const a0 = i * PR + j, a1 = a0 + PR; idx.push(a0, a1, a0 + 1, a1, a1 + 1, a0 + 1); }
      [0, NP - 1].forEach(i => { for (let j = 1; j < PR - 1; j++) idx.push(i * PR, i * PR + j, i * PR + j + 1); });
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
      const o = new THREE.Mesh(geo); o.castShadow = o.receiveShadow = true; role(o, 'back', 'm'); o.material = o.material.clone(); o.material.side = THREE.DoubleSide; o.userData.dbl = true; return o; };
    const bE = 0.8 * Math.PI, NC = 26, NA = 64, spine = [...cp(-1, rs + tb / 2, bE, 0, NC), ...arc(Ro - tb / 2, -phi, phi, NA).slice(1), ...cp(1, rs + tb / 2, 0, bE, NC).slice(1)];
    const hAt = i => { const c = i < NC ? (NC - i) / NC : i > NC + NA ? (i - NC - NA) / NC : 0; return 0.8 - 0.16 * Math.pow(Math.min(1, c), 1.3); };
    const seatL = [...arc(Ro - tb, -0.004, -phi, 32), ...cp(-1, rs, 0, Math.PI, 20), ...arc(Ri, -phi, -0.004, 32)], seatR = [...arc(Ro - tb, 0.004, phi, 32), ...cp(1, rs, 0, Math.PI, 20), ...arc(Ri, phi, 0.004, 32)];
    const foot = [...arc(Ro, -phi, phi, 48), ...cp(1, rs + tb, 0, Math.PI, 20), ...arc(Ri, phi, -phi, 48), ...cp(-1, rs + tb, Math.PI, 0, 20)];
    const pl = slab(foot, 0, 0.05, 0, M('#cdc8bf', { roughness: 0.8 })); pl.scale.set(0.985, 1, 0.985); g.add(pl);
    [seatL, seatR].forEach(s => g.add(role(slab(s, 0.05, 0.4, 0.06), 'seat', 'm'))); g.add(sweep(spine, tb, hAt));
    [-0.3, 0.3].forEach(a => { const q = role(sqPillow('#eee9e0'), 'back', 'box'), [x, z] = P(a, Ro - tb - 0.1); q.position.set(x, 0.45 + 0.17, z); q.rotation.order = 'YXZ'; q.rotation.set(-0.22, -a, 0); g.add(q); });
    return fitTo(g, 2.6, 1.4); };
  // the bean: a gently curved seat 41 high with a soft rolled edge on a dark plinth set in; two boxy rounded backs 70 high
  // (a superellipsoid, flat faces and rounded edges) - 100 wide wrapping the left end, 78 wide angled round the right end
  const peaBlob = (w, h, d) => { const geo = new THREE.SphereGeometry(0.5, 56, 40), q = geo.attributes.position, n = 6;
    for (let i = 0; i < q.count; i++) { const x = q.getX(i) * 2, y = q.getY(i) * 2, z = q.getZ(i) * 2, s = Math.pow(Math.pow(Math.abs(x), n) + Math.pow(Math.abs(y), n) + Math.pow(Math.abs(z), n), 1 / n) || 1; q.setXYZ(i, x / s * 0.5 * w, y / s * 0.5 * h, z / s * 0.5 * d); }
    geo.computeVertexNormals(); const nr = geo.attributes.normal, uvA = geo.attributes.uv;   // a box projection in metres: no pinch at the top
    for (let i = 0; i < q.count; i++) { const ax = Math.abs(nr.getX(i)), ay = Math.abs(nr.getY(i)), az = Math.abs(nr.getZ(i)); if (ay >= ax && ay >= az) uvA.setXY(i, q.getX(i), q.getZ(i)); else if (ax >= az) uvA.setXY(i, q.getZ(i), q.getY(i)); else uvA.setXY(i, q.getX(i), q.getY(i)); }
    uvA.needsUpdate = true; const o = new THREE.Mesh(geo); o.castShadow = o.receiveShadow = true; return role(o, 'back', 'm'); };
  // the pea, traced from the plan drawing (px of the shop sheet's sketch, 252 cm = 995 px): the left back a curved band from
  // the front-left corner round the left end to the middle of the back, the right back a kidney round the right end, the
  // seat between them with its front dipping back in the middle; the metal trays (the drawing's two small circles) left out
  const peaSofa = () => { const g = new THREE.Group(), X = px => (px - 100) / 995 * 2.52 - 1.26, Z = py => (py - 100) / 565 * 1.35 - 0.675;
    const loop = (pts, n) => new THREE.CatmullRomCurve3(pts.map(([px, py]) => new THREE.Vector3(X(px), 0, Z(py))), true, 'centripetal').getPoints(n).map(v => [v.x, v.z]);
    const LB = loop([[115, 540], [92, 470], [90, 420], [110, 350], [170, 270], [260, 200], [380, 150], [500, 128], [600, 125], [655, 135], [665, 180], [650, 215], [600, 268], [520, 295], [430, 318], [350, 345], [300, 385], [275, 440], [265, 490], [240, 530], [195, 552], [150, 556]], 140);
    const RB = loop([[820, 235], [860, 203], [930, 205], [1000, 235], [1060, 300], [1095, 390], [1100, 470], [1075, 540], [1020, 565], [975, 550], [950, 500], [935, 430], [905, 370], [860, 335], [825, 300]], 110);
    const SE = loop([[205, 548], [240, 585], [330, 602], [430, 575], [530, 535], [620, 518], [700, 530], [790, 572], [880, 600], [960, 595], [1010, 560], [985, 520], [960, 460], [940, 400], [900, 350], [850, 320], [810, 270], [760, 240], [680, 250], [620, 290], [520, 320], [430, 342], [355, 370], [315, 410], [295, 460], [280, 505], [250, 535]], 140);
    const cen = pts => { let x = 0, z = 0; pts.forEach(([a1, b1]) => { x += a1; z += b1; }); return [x / pts.length, z / pts.length]; };
    const [sx, sz] = cen(SE), pl = slab(SE.map(([x, z]) => [sx + (x - sx) * 0.92, sz + (z - sz) * 0.9]), 0, 0.06, 0, M('#3a3530', { roughness: 0.8 })); g.add(pl);
    g.add(role(slab(SE, 0.05, 0.36, 0.1), 'seat', 'm')); g.add(role(slab(LB, 0, 0.72, 0.08), 'back', 'm')); g.add(role(slab(RB, 0, 0.72, 0.08), 'back', 'm'));
    g.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(g), s = 2.52 / (bb.max.x - bb.min.x), o = new THREE.Group();
    g.scale.setScalar(s); g.position.set(-(bb.min.x + bb.max.x) / 2 * s, 0, -(bb.min.z + bb.max.z) / 2 * s); g.scale.y = 1; o.add(g); return o; };
  // the rug and the painting as pieces to add (2026-10-26: 墙上的画和地摊默认没有，让我可添加): the sisal flat weave 160 x 230 on
  // the floor, the green oil painting 120 x 90 (the painting of the living room's option) on a wall, its back at 0, centre 1.0 m
  const sisalRug = () => { const m = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.006, 2.3), new THREE.MeshStandardMaterial({ map: LRUG_TX.sisal, roughness: 1 })); m.position.y = 0.003; m.receiveShadow = true; m.userData.noSupport = true; return m; };
  const oilArt = () => { const g = new THREE.Group(), c = LART.clone(true); c.visible = true; c.rotation.set(0, 0, 0); c.position.set(0, 1.0, 0); g.add(c); return g; };
  const LAMP_BASE = { black: M('#1a1918', { roughness: 0.85 }), white: M('#e9e6df', { roughness: 0.6 }) };   // the two base colours of both table lamps
  const classicLamp = (col = 'black') => { const g = new THREE.Group(), cer = LAMP_BASE[col], blk = M('#141312', { roughness: 0.5 });   // redrawn from the shop photo, 2026-10-25
    const out = new THREE.SplineCurve([[0.056, 0], [0.066, 0.014], [0.077, 0.042], [0.086, 0.08], [0.09, 0.115], [0.088, 0.142], [0.078, 0.166], [0.06, 0.182], [0.042, 0.19], [0.034, 0.193], [0.032, 0.2]].map(([q, y]) => new THREE.Vector2(q, y))).getPoints(40);
    const base = new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(0.001, 0), ...out, new THREE.Vector2(0.001, 0.2)], 56), cer); base.castShadow = true; g.add(base);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.06, 16), blk); stem.position.y = 0.23; g.add(stem);
    const shp = [[0.15, 0], [0.149, 0.008], [0.128, 0.03], [0.088, 0.08], [0.05, 0.127], [0.018, 0.168]].map(([q, y]) => new THREE.Vector2(q, y));
    const sh = new THREE.Mesh(new THREE.LatheGeometry(shp, 64), glowMat({ color: '#efe9dc', emissive: '#ffd9a6', emissiveIntensity: 0.15, roughness: 0.9, side: THREE.DoubleSide }, 0.15, 1.2)); sh.position.y = 0.237; sh.castShadow = true; g.add(sh);
    const cap = new THREE.Mesh(new THREE.CircleGeometry(0.018, 24), M('#e6dfd0', { roughness: 0.9, side: THREE.DoubleSide })); cap.rotation.x = -Math.PI / 2; cap.position.y = 0.405; g.add(cap); return g; };
  // tall fresh branches in a big clear vase (the user, 2026-10-25: 给我个花瓶插这种高枝条试试 - the reference photo's leafy branch
  // in the foreground): a bulbous clear vase D25 x 40 with water, three branches leaning out to about 1.2 m, twigs off them,
  // small leaves in clusters; the branches left out of the footprint; its own frame: the vase base at 0
  function branchVase() {
    const g = new THREE.Group(), tw = new THREE.Group(); tw.userData.noHull = true; g.add(tw);
    const glass = new THREE.MeshStandardMaterial({ color: '#eef5f5', transparent: true, opacity: 0.28, roughness: 0.03, metalness: 0.1, side: THREE.DoubleSide });
    g.add(new THREE.Mesh(new THREE.LatheGeometry([[0.001, 0], [0.09, 0], [0.118, 0.05], [0.125, 0.13], [0.105, 0.24], [0.065, 0.33], [0.052, 0.38], [0.058, 0.4]].map(([q, y]) => new THREE.Vector2(q, y)), 40), glass));
    const wt = new THREE.Mesh(new THREE.CylinderGeometry(0.118, 0.09, 0.18, 32), new THREE.MeshStandardMaterial({ color: '#d6ecee', transparent: true, opacity: 0.4, roughness: 0.05 })); wt.position.y = 0.095; g.add(wt);
    const bark = M('#5b4636', { roughness: 0.8 }), lm = ['#4f7a3a', '#6a9448', '#3e6630'].map(c => M(c, { roughness: 0.6, side: THREE.DoubleSide }));
    const leaf = new THREE.CircleGeometry(0.018, 8); leaf.scale(1, 1.9, 1); leaf.translate(0, 0.034, 0);
    let sd = 1; const R = () => rnd(sd++ * 7.3);
    const grow = (p0, dir, len, rad, depth) => { const pts = [p0.clone()]; let q = p0.clone(); const d = dir.clone();
      for (let i = 1; i <= 5; i++) { d.add(new THREE.Vector3((R() - 0.5) * 0.35, (R() - 0.5) * 0.1, (R() - 0.5) * 0.35)).normalize(); q = q.clone().addScaledVector(d, len / 5); pts.push(q); }
      const c = new THREE.CatmullRomCurve3(pts), tb = new THREE.Mesh(new THREE.TubeGeometry(c, 16, rad, 6, false), bark); tb.castShadow = true; tw.add(tb);
      if (depth > 0) for (let k = 0; k < 2; k++) { const s = 0.4 + k * 0.28, o = c.getPoint(s), dd = c.getTangent(s).add(new THREE.Vector3((R() - 0.5) * 2.4, 0.1, (R() - 0.5) * 2.4)).normalize(); grow(o, dd, len * 0.42, rad * 0.6, depth - 1); }
      const n = depth === 2 ? 5 : depth === 1 ? 7 : 9;
      for (let k = 0; k < n; k++) { const o = c.getPoint(0.3 + 0.7 * R()), l = new THREE.Mesh(leaf, lm[k % 3]); l.position.copy(o); l.rotation.set(R() * 6.28, R() * 6.28, R() * 6.28); l.castShadow = k % 2 === 0; tw.add(l); } };
    [[0.45, 1, 0.1, 0.7], [-0.4, 1, -0.2, 0.6]].forEach(([x, y, z, len]) => grow(new THREE.Vector3(0, 0.15, 0), new THREE.Vector3(x, y, z).normalize(), len, 0.005, 2));   // thinner, fewer, lower (2026-10-25)
    return g; }
  // the column lamp (the user, 2026-10-25: 台灯，加这种 - GRAVITY, 小号): a hand-thrown ceramic column D10 x 30, its top rounded
  // over and its foot softened, a linen drum shade D25 x 18 from about 29 to 47 cm; its own frame: the base at 0
  const LINEN = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); x.fillStyle = '#d9d1c2'; x.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 64; i += 2) { x.fillStyle = 'rgba(120, 105, 80, ' + (0.06 + rnd(i) * 0.08) + ')'; x.fillRect(0, i, 64, 1); x.fillStyle = 'rgba(255, 250, 240, ' + (0.05 + rnd(i + 99) * 0.07) + ')'; x.fillRect(i, 0, 1, 64); }
    const tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding; tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(6, 2); return tx; })();
  const gravityLamp = (col = 'black') => { const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.LatheGeometry([[0.001, 0], [0.044, 0], [0.048, 0.006], [0.05, 0.03], [0.05, 0.24], [0.048, 0.265], [0.04, 0.284], [0.025, 0.296], [0.001, 0.3]].map(([q, y]) => new THREE.Vector2(q, y)), 48), LAMP_BASE[col]); b.castShadow = true; g.add(b);
    const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.125, 0.18, 64, 1, true), glowMat({ map: LINEN, color: '#ffffff', emissive: '#ffd9a6', emissiveIntensity: 0.15, roughness: 0.95, side: THREE.DoubleSide }, 0.15, 1.2)); sh.position.y = 0.38; sh.castShadow = true; g.add(sh);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.124, 0.002, 6, 64), M('#b9b0a0', { roughness: 0.8 })); rim.rotation.x = Math.PI / 2; rim.position.y = 0.469; g.add(rim); return g; };
  const swingLamp = () => { const g = new THREE.Group(), blk = M('#1b1a19', { roughness: 0.45, metalness: 0.3 }), brass = M('#b8964f', { roughness: 0.3, metalness: 0.8 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.02, 40), blk); base.position.y = 0.01; base.castShadow = true; g.add(base);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 1.48, 12), blk); pole.position.y = 0.76; g.add(pole);
    const joint = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 12), brass); joint.position.y = 1.5; g.add(joint);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.7, 12), blk); arm.rotation.z = Math.PI / 2; arm.position.set(0.35, 1.5, 0); g.add(arm);
    const shd = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.075, 0.12, 32, 1, true), new THREE.MeshStandardMaterial({ color: '#1b1a19', roughness: 0.45, metalness: 0.3, side: THREE.DoubleSide })); shd.position.set(0.7, 1.44, 0); g.add(shd);
    const glow = new THREE.Mesh(new THREE.CircleGeometry(0.068, 24), glowMat({ color: '#fff4e2', emissive: '#ffd59a', emissiveIntensity: 0.2, roughness: 0.4 }, 0.2, 1.8)); glow.rotation.x = Math.PI / 2; glow.position.set(0.7, 1.39, 0); g.add(glow); return g; };
  const CAT = [
    { k: 'le260', n: '乐园沙发 2.6', src: () => liv().userData.sofas.le260, tub: true, dim: [260, 101, 62], dimNote: '（按 3150×1220×750 等比估算）' },
    { k: 'jm', n: '骏马扶手椅', src: () => LCH.A.jmcar.children[0], frame: true, wd: true },
    { k: 'rt', n: '藤编扶手椅', src: () => LCH.A.rtcar.children[0], frame: true, wd: true },
    { k: 'pea252', n: '豌豆沙发 252', src: () => peaSofa(), fab: true, frame: true, wd: true, dim: [252, 119, 72], dimText: '豌豆沙发 252×119×72（商品表 135 深含两个金属托盘，已拿掉）', spawn: [8700, 3770, Math.PI / 2] },   // 2026-10-27: the only sofa in the catalogue
    { k: 'casa', n: '转椅', src: () => LCH.B.casa, round: true, dim: [77, 77] },
    { k: 'car', n: '卡门凳', src: () => LCH.A.jmcar.children[1], frame: true, wd: true },
    { k: 'rl', n: '藤编躺椅', src: () => loungers(), frm: true, frame: true, wd: true, dim: [60, 82.1, 72] },
    { k: 'scroll', n: '卷扶手南洋藤椅', src: () => scrollChair(), frame: true, wd: true, dim: [65, 78, 87], spawn: [9700, 2300, 3 * Math.PI / 2] },
    { k: 'nordic', n: '黑格栅玻璃茶几 100×50', src: () => liv().userData.tables.nordic },   // back since 2026-10-24 (the user asked for it again)
    { k: 'burlpill', n: '树瘤圆角茶几 100×70×35', src: () => burlPillTable(), frame: true, wd: true, dim: [100, 70, 35], spawn: [9570, 3740, Math.PI / 2] },
    { k: 'burlpill90', n: '树瘤圆角茶几', src: () => burlPillTable(0.9), frame: true, wd: true, dim: [90, 63, 35], spawn: [9570, 3740, Math.PI / 2] },
    { k: 'soda', n: 'Soda 蓝色玻璃圆几', src: () => sodaTable(), frame: true, round: true, dim: [55, 55, 30], spawn: [9570, 3740, 0] },
    { k: 'tatami60', n: '蒲草榻榻米茶几 小号', src: () => tatamiTable(0.6, 0.45, 0.30), frame: true, wd: true, dim: [60, 45, 30], dimText: '蒲草榻榻米茶几 小号 60×45×30（木框＋蒲草，手工误差约 2cm）', spawn: [9570, 3740, 0] },
    { k: 'tatami80', n: '蒲草榻榻米茶几 中号', src: () => tatamiTable(0.8, 0.50, 0.35), frame: true, wd: true, dim: [80, 50, 35], dimText: '蒲草榻榻米茶几 中号 80×50×35（木框＋蒲草，手工误差约 2cm）', spawn: [9570, 3740, 0] },
    { k: 'burlpill80', n: '树瘤圆角茶几 80×56×35', src: () => burlPillTable(0.8), frame: true, wd: true, dim: [80, 56, 35], spawn: [9570, 3740, Math.PI / 2] },
    { k: 'bamboo', n: '筇竹青云茶几 105×58×45（黑框藤面）', src: () => bambooRimTable(), frame: true, wd: true, dim: [105, 58, 45], spawn: [9570, 3740, Math.PI / 2] },
    { k: 'hyacinth', n: '水葫芦编织茶几 100×50×38（深色）', src: () => hyacinthTable(), frame: true, wd: true, dim: [100, 50, 38], spawn: [9570, 3740, Math.PI / 2] },
    { k: 'teak', n: '缅甸柚木茶几 90×45×40', src: () => teakTeaTable(), tone: true, frame: true, wd: true, dim: [90, 45, 40], spawn: [9570, 3740, Math.PI / 2] },
    { k: 'burl', n: '树瘤茶几', src: () => liv().userData.tables.burlwf },
    { k: 'bk', n: '两本书', src: () => TDECO, frame: true, center: true, deco: true },
    { k: 'tlamp', n: '陶罐台灯', src: () => ['black', 'white'].map(c => { const o = classicLamp(c); o.userData.col = c; return o; }), cols: ['black', 'white'], frame: true, deco: true, dimText: '台灯：灯罩 Φ30，高 40 cm（充电款）' },
    { k: 'glamp', n: '陶瓷圆柱台灯', src: () => ['black', 'white'].map(c => { const o = gravityLamp(c); o.userData.col = c; return o; }), cols: ['black', 'white'], frame: true, deco: true, dimText: '台灯：陶瓷底座 Φ10×30，亚麻灯罩 Φ25，高 47 cm' },
    { k: 'branch', n: '高枝条玻璃瓶', src: () => branchVase(), frame: true, deco: true, dimText: '玻璃瓶 Φ25×40，鲜枝连瓶高约 0.9 m' },
    { k: 'flamp', n: '转臂落地灯', src: () => swingLamp(), frame: true, spawn: [10560, 2450, Math.PI], dimText: '落地灯：高 152 cm，转臂 70 cm，底盘 Φ26' },
    { k: 'throw', n: '粗针织盖毯（燕麦色）', src: () => knitThrow(), frame: true, deco: true, dimText: '粗针织盖毯，叠成约 50×36 搭在沙发上' },
    { k: 'pillows', n: '靠垫一对（橄榄绿、焦糖）', src: () => pillowPair(), frame: true, deco: true, dimText: '靠垫两个，各 45×45：橄榄绿、焦糖色' },
    { k: 'srug', n: '剑麻色平织地毯 160×230', src: () => sisalRug(), frame: true, floor: true, dim: [160, 230], spawn: [9620, 3770, 0], dimText: '剑麻色平织地毯 160×230' },
    { k: 'oilart', n: '绿色油画 120×90', src: () => oilArt(), frame: true, wall: true, art: true, dim: [120, 90], hs: [140, 145, 150, 155], hDef: 1450, spawn: [10700, 3770, -Math.PI / 2], dimText: '绿色油画 120×90，细深色框' },
    { k: 'fruit', n: '水果盘', src: () => fruitBowl(), frame: true, deco: true, dimText: '果盘 Φ30×7 cm' },
    { k: 'vs', n: '兰花瓶', src: () => ORCH_V, frame: true, deco: true, dimText: '玻璃花瓶 Φ5.4×11 cm，连兰花约高 51 cm' },
    { k: 'pc', n: '十八纸圆柱', src: () => paperCols(), cols: ['white', 'black'], hgt: true, round: true, h0: 500, hDef: 450, hs: [40, 45, 50, 55, 60, 70], dia: [25, 30, 35, 40] },
    { k: 'palm', n: '散尾葵', src: () => arecaPalm(), frame: true, grow: true, h0: 1800, hDef: 1800, potH: 420, hs: [150, 180, 210], pot: true, spawn: [9350, 1000, 0] },
    { k: 'ct', n: 'C形亚克力边几', src: () => CTAB, frame: true, hgt: true, h0: 550, hDef: 450, hs: [40, 45, 50, 55, 60], ctv: true, wd: true },   // 45 the user's height
    { k: 'slabst', n: '黑木藤格方边几 45×45×50', src: () => slabSideTable(), frame: true, wd: true, dim: [45, 45, 50], spawn: [8260, 2200, 0] },
    { k: 'tier4', n: '黑色四层架边几 45×38×67', src: () => tierSideTable(), frame: true, wd: true, dim: [45, 38, 67], spawn: [8260, 2200, Math.PI / 2] },
    { k: 'burlcol', n: '树瘤圆柱', src: () => burlColumn(), hgt: true, round: true, h0: 500, hDef: 500, hs: [50, 80], spawn: [8220, 2150, 0] },
    { k: 'arch3', n: '拱门边几', src: () => archSets(), cols: ['black', 'white'], frame: true, wd: true, dim: [40, 40, 45], spawn: [8260, 2200, 0] },
    { k: 'archM', n: '黑色拱门边几·中 35×35×42', src: () => archOne('M'), frame: true, wd: true, dim: [35, 35, 42], spawn: [8260, 2200, 0] },
    { k: 'archS', n: '黑色拱门边几·小 28×28×40', src: () => archOne('S'), frame: true, wd: true, dim: [28, 28, 40], spawn: [8260, 2200, 0] },
    { k: 'cxlr', n: '黑色椭圆C形边几 高55（面约45×35，尺寸估）', src: () => ovalCTable(), frame: true, wd: true, dim: [45, 35, 55], spawn: [8260, 2200, 0] },
    { k: 'slant', n: '斜塔边几 40×30×43（黑）', src: () => slantTable(), frame: true, wd: true, dim: [40, 30, 43], spawn: [8260, 2200, 0] },
    { k: 'slottab', n: '实木书报边几 50×30×50（尺寸估）', src: () => slotTable(), frame: true, wd: true, dim: [50, 30, 50], spawn: [8160, 2380, Math.PI / 2] },
    { k: 'sgbasket', n: '草编篮 Φ34×32（藏路由器）', src: () => seagrassBasket(), frame: true, round: true, dim: [34, 32], spawn: [8200, 2500, 0] },
    { k: 'rbox', n: '藤编路由器盒 36×13×22（挂墙）', src: () => routerBox(), frame: true, wall: true, fl: true, dim: [36, 13, 22], hs: [30, 45, 60, 80], hDef: 600, spawn: [10700, 3300, -Math.PI / 2] },
    { k: 'fcab', n: '悬空藤门窄柜 120×25×35', src: () => caneConsole(1.2, 0.25, 0.35, 0, true), frame: true, wall: true, fl: true, dim: [120, 25, 35], hs: [45, 55, 65, 75], hDef: 550, spawn: [10700, 3900, -Math.PI / 2] },
    // the own TV of the user on its silver V-leg stand (银翼, as in the master bedroom); the screen size follows the page
    { k: 'tvm', n: '移动电视（银翼V字架）', src: () => { const s = wingStand(); Object.entries(s.userData.tvs).forEach(([k, o]) => { o.visible = k === state.tvs; }); return s; }, frame: true, center: true, wd: true, spawn: [10300, 3900, -Math.PI / 2] },
    { k: 'art2', n: '植物版画一对 50×70', src: () => botanicalPair(), frame: true, wall: true, art: true, dim: [108, 70], hs: [130, 140, 150, 160], hDef: 1450, spawn: [10700, 3900, -Math.PI / 2] },
    { k: 'iron', n: '小铁边几', src: () => SIDEIRON, round: true, dim: [20, 58] },
    { k: 'rug', n: '绿色平织地毯 160×230', src: () => LRUG, floor: true },
  ];
  // the coffee tables cut to the two burls (2026-10-25: 茶几也可以只留两个树瘤的，其他都实在比不上他们): the others leave the library;
  // a saved layout with one of them gets the burl 90 x 63 in its place (load)
  const CT_GONE = ['nordic', 'burlpill', 'burlpill80', 'bamboo', 'hyacinth', 'teak'];
  // and the rest the user cut the same day (边几只保留… 其他删除 / 删除悬空窄柜，植物版画，绿色地毯，路由器篮子，挂墙路由器 / 骏马椅子和卡门凳确认不要)
  const LIB_GONE = ['le260', 'rt', 'slabst', 'tier4', 'archM', 'archS', 'cxlr', 'slant', 'slottab', 'iron', 'fcab', 'art2', 'rug', 'sgbasket', 'rbox', 'jm', 'car'];
  for (let i = CAT.length - 1; i >= 0; i--) if (CT_GONE.includes(CAT[i].k) || LIB_GONE.includes(CAT[i].k)) CAT.splice(i, 1);
  const BY = Object.fromEntries(CAT.map(c => [c.k, c])), TPL = {}, DEF_KEYS = ['le260', 'jm', 'car', ...(state.ly !== 'none' ? ['po'] : []), ...(CTAB.visible ? ['ct'] : []), 'burlpill90', 'casa', 'rug'];   // the page's default as it loads
  const pieces = [];
  let on = true, sel = null, drag = null, def = [], cur = null, mydef = null, locked = false, xsel = null, gsel = null;   // gsel: anything else clicked   // xsel: the hall rug or stool, picked
  const DEF_KEY = 'c2free.def', LOCK_KEY = 'c2free.lock';
  // named arrangements 组合A-C: saved in this browser; 组合A is also built in (the one the user saved first,
  // 2026-10-22: the 2.6 all white, the chair + stool turned ~25 deg toward the window, the black orchid column in the
  // sofa-side window corner, no rug), so it is there in any browser until the user saves over it
  const SLOT_KEY = 'c2free.slots.v1', SLOTS = ['A', 'B', 'C'];
  const BUILTIN = { A: { v: 2, sfc: 'oat', lrug: 'sage', pieces: [{ k: 'jm', x: 9160, y: 2210, a: 1.0472 }, { k: 'car', x: 9600, y: 2460, a: 1.0472 }, { k: 'casa', x: 9450, y: 4860, a: 0 },
    { k: 'pea252', x: 8600, y: 3720, a: 0, c: 'white' }, { k: 'burlpill90', x: 9420, y: 3680, a: 0 }, { k: 'ct', x: 8260, y: 2110, a: 10.9956, h: 450, c: 'clear' }, { k: 'bk', x: 9420, y: 3680, a: 0 }, { k: 'vs', x: 8260, y: 2110, a: 1.5708 }] },
    // 组合B (2026-10-25, 好的，你做成组合b): the default A and what the living room lacked - the sisal flat-weave rug, the linen
    // curtains, the green painting opposite the sofa, the palm back by the window on the sofa side, the jar lamp on the arch
    // tables (the orchid to the coffee table), the oatmeal throw and the olive / caramel cushions on the sofa
    B: { v: 2, sfc: 'w', lrug: 'sisal', sheer: 'linen', lmir: 'L',
      opts: {'sfc': 'w', 'lrug': 'sisal', 'sheer': 'linen', 'lart': 'oil', 'lmir': 'L', 'dchair': 'limo', 'dcush': 'white', 'dseat': 'caramel', 'dback': 'low', 'kchair': 'fblack', 'dwall': 'chair', 'ctuck': 'open', 'dpend': 'paper', 'dart': 'off',
        'hlamp': 'drum40', 'hmir': 'on', 'hstool': 'ysn', 'hart': 'off', 'hart2': 'off', 'hrugc': 'natural', 'endp': '75', 'ebdp': '20', 'mnc': 'cyl', 'mbp': 'white', 'tv': 'R', 'kjoin': 'off', 'sdopen': 'closed'},
      dine: {'x': -0.83, 'z': -0.02, 'r': -6.283185307179586}, dchair: 'limo', dset: 'off', dcount: '5s', dwall: 'chair', hrug: {'p': {'x': 7.05, 'z': 9.94, 'r': 0}, 'c': 'natural'}, hst: {'x': 7.91, 'z': 10.29, 'r': 1.5707963267948966},
      pieces: [
      {'k': 'casa', 'x': 9650, 'y': 5180, 'a': 6.2832}, {'k': 'pea252', 'x': 8700, 'y': 3770, 'a': 1.5708, 'c': 'blue'}, {'k': 'arch3', 'x': 9620, 'y': 2280, 'a': 0.7854, 'c': 'black'},
      {'k': 'burlpill90', 'x': 9700, 'y': 3750, 'a': 1.5708}, {'k': 'bk', 'x': 9720, 'y': 3650, 'a': 1.5708}, {'k': 'srug', 'x': 9640, 'y': 3770, 'a': 0}, {'k': 'oilart', 'x': 10700, 'y': 3770, 'a': -1.5708, 'h': 1450},
      {'k': 'rl', 'x': 10170, 'y': 2550, 'a': 4.7124, 'c': 'black'}, {'k': 'vs', 'x': 9670, 'y': 3960, 'a': 1.5708}, {'k': 'tlamp', 'x': 9620, 'y': 2280, 'a': 0.7854, 'c': 'black'},
      {'k': 'palm', 'x': 8300, 'y': 2130, 'a': 0, 'h': 1800, 'c': 'basket'}] },
    // the default the user saved again on 2026-10-25, 14:51 (组合a设为默认了): the sofa on the fibre wall a little toward the hall,
    // the burl 90 across with books, the arch tables turned 45 by the lounger with the orchid, the lounger by the study wall,
    // the swivel and the paper column at the dining end; no palm, no fruit bowl; the dining set turned back about the same
    // centre (6820 / 6930), five 利默 + the Stokke, the chairs pulled out; the hall: black drum, the MUJI mirror, the rug-colour
    // stool; the study: the black folding chair
    C: { v: 2, sfc: 'w', lrug: 'none', sheer: 'none', lmir: 'L',
      opts: {'sfc': 'w', 'lrug': 'none', 'sheer': 'none', 'lmir': 'L', 'dchair': 'limo', 'dcush': 'white', 'dseat': 'caramel', 'dback': 'low', 'kchair': 'fblack', 'dwall': 'chair', 'ctuck': 'open', 'dpend': 'paper', 'dart': 'off',
        'hlamp': 'drum40', 'hmir': 'on', 'hstool': 'ysn', 'hart': 'off', 'hart2': 'off', 'hrugc': 'natural', 'endp': '75', 'ebdp': '20', 'mnc': 'cyl', 'mbp': 'white', 'tv': 'R', 'kjoin': 'off', 'sdopen': 'closed'},
      dine: {'x': -0.83, 'z': -0.02, 'r': -6.283185307179586}, dchair: 'limo', dset: 'off', dcount: '5s', dwall: 'chair', hrug: {'p': {'x': 7.05, 'z': 9.94, 'r': 0}, 'c': 'natural'}, hst: {'x': 7.91, 'z': 10.29, 'r': 1.5707963267948966},
      pieces: [
      {'k': 'casa', 'x': 9650, 'y': 5180, 'a': 6.2832}, {'k': 'pea252', 'x': 8700, 'y': 3770, 'a': 1.5708, 'c': 'white'}, {'k': 'arch3', 'x': 9620, 'y': 2280, 'a': 0.7854, 'c': 'black'},
      {'k': 'burlpill90', 'x': 9700, 'y': 3750, 'a': 1.5708}, {'k': 'bk', 'x': 9720, 'y': 3650, 'a': 1.5708},
      {'k': 'rl', 'x': 10170, 'y': 2550, 'a': 4.7124, 'c': 'black'}, {'k': 'vs', 'x': 9600, 'y': 2350, 'a': 1.5708}] } };
  const migrate = list => list.some(p => p.k === 'bk' || p.k === 'vs') ? list : list.concat(list.filter(p => ['nordic', 'burl'].includes(p.k)).map(p => ({ k: 'bk', x: p.x, y: p.y, a: p.a || 0 })));
  let slots = {}; try { slots = JSON.parse(localStorage.getItem(SLOT_KEY) || '{}') || {}; } catch (e) { slots = {}; }
  const slotOf = s => slots[s] || BUILTIN[s] || null;
  const box = document.getElementById('freeBox'), $ = id => document.getElementById(id);
  // convex hull (monotone chain) of [x, y] points
  const hull = P => { const p = [...new Map(P.map(q => [Math.round(q[0] / 5) + ',' + Math.round(q[1] / 5), q])).values()].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (p.length < 3) return p; const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
    p.forEach(q => { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); });
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1)); };
  function makeTpl(c) {
    scene.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(livMir.matrixWorld).invert(), t = new THREE.Group(), home = {};
    [].concat(c.src()).forEach((s, i) => { const m = inv.clone().multiply(s.matrixWorld), cl = s.clone(true); cl.visible = true;
      if (c.frame) { const p = new THREE.Vector3(), q = new THREE.Quaternion(), sc = new THREE.Vector3(); m.decompose(p, q, sc);
        if (i === 0) { home.x = p.x / MM; home.y = p.z / MM; home.a = new THREE.Euler().setFromQuaternion(q, 'YXZ').y; }
        cl.position.set(0, 0, 0); cl.rotation.set(0, 0, 0); }
      else m.decompose(cl.position, cl.quaternion, cl.scale);
      t.add(cl); });
    t.updateMatrixWorld(true);
    if (!c.frame || c.center) { const b = new THREE.Box3().setFromObject(t), cx = (b.min.x + b.max.x) / 2, cz = (b.min.z + b.max.z) / 2;   // center: a frame piece centred on its footprint
      t.children.forEach(o => { o.position.x -= cx; o.position.z -= cz; }); if (!c.frame) { home.x = cx / MM; home.y = cz / MM; home.a = 0; } t.updateMatrixWorld(true); }
    const pts = [], v = new THREE.Vector3(), bb = [Infinity, -Infinity, Infinity, -Infinity]; let top = 0;
    t.traverse(o => { if (!o.isMesh || !o.visible && o !== t || !o.geometry || !o.geometry.attributes.position) return; let vis = true, nh = false;
      for (let p = o; p && p !== t; p = p.parent) { if (!p.visible) vis = false; if (p.userData.noHull) nh = true; } if (!vis) return;
      const a = o.geometry.attributes.position; for (let i = 0; i < a.count; i++) { v.fromBufferAttribute(a, i).applyMatrix4(o.matrixWorld); const px = v.x / MM, pz = v.z / MM; if (!nh) pts.push([px, pz]); if (px < bb[0]) bb[0] = px; if (px > bb[1]) bb[1] = px; if (pz < bb[2]) bb[2] = pz; if (pz > bb[3]) bb[3] = pz; if (v.y > top) top = v.y; } });
    const H = hull(pts), xs = H.map(p => p[0]), ys = H.map(p => p[1]);
    const dim = [bb[1] - bb[0], bb[3] - bb[2], top / MM];   // mm
    return { t, home, hull: H, dim, size: [Math.round((Math.max(...xs) - Math.min(...xs)) / 10), Math.round((Math.max(...ys) - Math.min(...ys)) / 10)].sort((u, v) => v - u) };   // long side first
  }
  const tpl = k => { if (!TPL[k]) { try { TPL[k] = makeTpl(BY[k]); } catch (e) { TPL[k] = null; } } return TPL[k]; };
  // the selection ring and the living line on the floor
  const ringMat = new THREE.LineBasicMaterial({ color: '#2f7d64', depthTest: false, transparent: true }), badMat = new THREE.LineBasicMaterial({ color: '#c0392b', depthTest: false, transparent: true });
  const fillMat = new THREE.MeshBasicMaterial({ color: '#2f7d64', transparent: true, opacity: 0.28, depthWrite: false }), fillBad = new THREE.MeshBasicMaterial({ color: '#c0392b', transparent: true, opacity: 0.3, depthWrite: false });
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(W0 * MM, 0.008, LINE * MM), new THREE.Vector3(W1 * MM, 0.008, LINE * MM)]),
    new THREE.LineDashedMaterial({ color: '#b0413e', dashSize: 0.12, gapSize: 0.08, depthTest: false, transparent: true }));
  line.computeLineDistances(); line.renderOrder = 998; livMir.add(line);
  const SHAPES = ['col', 'half', 'p45', 'p35'];
  const shapeOf = (w, s) => { s = SHAPES.includes(s) ? s : 'col'; w.userData.shape = s; w.children[0].traverse(o => { if (o.userData && o.userData.shape) o.visible = o.userData.shape === s; }); };
  const CTV = ['clear', 'smoke', 'brown', 'ripple'];
  const POTS = ['basket', 'white'];   // the palm's pot
  const sheetOf = (w, c) => { if (BY[w.userData.free.k].fab) { applyFab(w, c); return; } const bb = BY[w.userData.free.k], key = bb.pot ? 'pot' : bb.frm ? 'frm' : bb.tone ? 'tone' : bb.cols ? 'col' : 'ctv', L = key === 'pot' ? POTS : key === 'frm' ? FRMS : key === 'tone' ? TONES : key === 'col' ? bb.cols : CTV; c = L.includes(c) ? c : L[0]; w.userData.free.c = c; w.children[0].traverse(o => { if (o.userData && o.userData[key]) o.visible = o.userData[key] === c; }); };
  const growOf = (w, h, k) => { const c = BY[k || w.userData.free.k], f = (h - c.potH) / (c.h0 - c.potH); w.children[0].traverse(o => { if (o.userData && o.userData.grow) o.scale.setScalar(f); }); };
  const tubOf = w => { let o = null; w.children[0].traverse(c => { if (c.userData && c.userData.tub) o = c; }); return o; };
  const turnTub = (w, t) => { const o = tubOf(w); if (o) o.rotation.y = t; w.userData.free.t = t; };
  function add(k, x, y, a, h, s, t, c, d) {
    const T = tpl(k); if (!T) return null;
    const w = new THREE.Group(); w.add(T.t.clone(true)); w.position.set(x * MM, 0, y * MM); w.rotation.y = a || 0;
    if (BY[k].hgt) { h = h || BY[k].hDef || BY[k].h0 || 500; w.children[0].scale.y = h / (BY[k].h0 || 500); }   // the side tables: any height (built at h0, 50 for the round ones)
    if (BY[k].wall) { h = h || 1000; w.children[0].position.y = (h - 1000) * MM; shapeOf(w, s || 'col'); }
    if (BY[k].grow) { h = h || BY[k].hDef; growOf(w, h, k); }   // the palm: canes and fronds, not the pot
    if (BY[k].dia) { d = BY[k].dia.includes(d) ? d : 30; w.children[0].scale.x = w.children[0].scale.z = d / 30; }   // the paper column, built at D300   // the wall shelves: the top of the block, built at 1 m
    const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(T.hull.map(([px, py]) => new THREE.Vector3(px * MM, BY[k].floor ? 0.016 : 0.012, py * MM))), ringMat);
    ring.renderOrder = 999; ring.visible = false; w.add(ring);
    const fill = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(T.hull.map(([px, py]) => new THREE.Vector2(px * MM, -py * MM)))), fillMat);
    fill.rotation.x = -Math.PI / 2; fill.position.y = BY[k].floor ? 0.017 : 0.014; fill.renderOrder = 997; fill.visible = false; fill.userData.noSupport = true; w.add(fill);
    w.userData.free = { k, ring, fill, h: BY[k].hgt || BY[k].wall || BY[k].grow ? h : 0 }; if (BY[k].wall) w.userData.free.s = w.userData.shape; if (BY[k].tub && t) turnTub(w, t); if (BY[k].ctv || BY[k].pot || BY[k].frm || BY[k].tone || BY[k].cols || BY[k].fab) sheetOf(w, c);
    if (BY[k].dia) { w.userData.free.d = d; ring.scale.set(d / 30, 1, d / 30); fill.scale.set(d / 30, d / 30, 1); } livMir.add(w); pieces.push(w); return w;
  }
  const poly = w => { const h = tpl(w.userData.free.k).hull, c = Math.cos(w.rotation.y), s = Math.sin(w.rotation.y), x0 = w.position.x / MM, y0 = w.position.z / MM, f = (w.userData.free.d || 30) / 30;
    return h.map(([x, y]) => [x0 + f * (x * c + y * s), y0 + f * (-x * s + y * c)]); };
  const axes = P => P.map((p, i) => { const q = P[(i + 1) % P.length], dx = q[1] - p[1], dy = p[0] - q[0], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; });
  const proj = (P, a) => { let mn = Infinity, mx = -Infinity; P.forEach(p => { const d = p[0] * a[0] + p[1] * a[1]; if (d < mn) mn = d; if (d > mx) mx = d; }); return [mn, mx]; };
  const hits = (A, B) => [...axes(A), ...axes(B)].every(a => { const [a0, a1] = proj(A, a), [b0, b1] = proj(B, a); return Math.min(a1, b1) - Math.max(a0, b0) > 8; });
  const segD = (p, a, b) => { const vx = b[0] - a[0], vy = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / (vx * vx + vy * vy || 1))); return Math.hypot(p[0] - a[0] - t * vx, p[1] - a[1] - t * vy); };
  const gap = (A, B) => { let m = Infinity; [[A, B], [B, A]].forEach(([P, Q]) => P.forEach(p => Q.forEach((q, i) => { m = Math.min(m, segD(p, q, Q[(i + 1) % Q.length])); }))); return m; };
  const cm = v => Math.round(v / 10);
  // the size of a piece in cm: the shop's (dim) where it is known, else the model's; a chosen height wins
  const WSZ = { col: [16, 16, 26], half: [30, 15, 10], p45: [45, 22.5, 20], p35: [35, 17.5, 15] };   // the wall shelves by shape
  const f1 = v => String(Math.round(v * 10) / 10), xs3 = d => d.map(f1).join(' × ') + ' cm';
  function dimText(w) {
    const k = w.userData.free.k, c = BY[k], [mx, mz, my] = tpl(k).dim.map(v => Math.round(v / 10)), hh = w.userData.free.h ? w.userData.free.h / 10 : 0;
    if (c.dimText) return c.dimText;
    if (c.fl) return '尺寸（宽×深×高）' + ' ' + xs3(c.dim) + ' · ' + '柜面高' + ' ' + hh + ' cm';
    if (c.tv || c.art) return (c.tv ? '屏幕' : '两幅画框') + ' ' + xs3(c.dim) + ' · ' + '中心高' + ' ' + hh + ' cm';
    if (c.wall) return '壁挂尺寸（宽×深×高）' + ' ' + xs3(WSZ[w.userData.free.s] || WSZ.col) + ' · ' + '挂高' + ' ' + hh + ' cm';
    if (c.floor) return '尺寸（长×宽）' + ' ' + xs3(c.dim || [Math.max(mx, mz), Math.min(mx, mz)]);
    if (c.grow) return '尺寸（冠幅×高）' + ' ' + xs3([Math.round(Math.max(mx, mz) * (hh * 10 - c.potH) / (c.h0 - c.potH)), hh]) + ' · ' + (c.potT || '花盆') + ' ' + (c.potD || 'Φ45×42') + ' cm';
    if (c.round) { const d = c.dim || [w.userData.free.d || mx, my]; return '尺寸（直径×高）' + ' ' + xs3([d[0], hh || d[1]]); }
    const d = (c.dim || (c.wd ? [mx, mz, my] : [Math.max(mx, mz), Math.min(mx, mz), my])).slice(); if (hh) d[2] = hh;
    return (c.wd ? '尺寸（宽×深×高）' : '尺寸（长×宽×高）') + ' ' + xs3(d) + (c.dimNote || '');
  }
  // a tag over the selected piece in the view: its name and size, seen even with the panel folded (the user, 2026-10-23:
  // 点击家具时候，显示家具尺寸); the language bits are declared after this runs at load, hence the try
  const tag = document.createElement('div'); tag.className = 'frtag'; tag.hidden = true; document.body.appendChild(tag);
  const trL = s => { try { return LANG !== 'zh' ? trTo(s, LANG) : s; } catch (e) { return s; } };
  function tagText() { tag.textContent = ''; tag.classList.remove('bad'); if (!sel) return; const b = document.createElement('b'); b.textContent = trL(BY[sel.userData.free.k].n);
    tag.append(b, ' · ' + trL(dimText(sel))); const wn = sel.userData.free.warn; if (wn) { tag.append(' · ' + trL(wn)); tag.classList.add('bad'); } }
  let xT = null, xF = 0;
  const xTagText = T => { tag.textContent = ''; const b = document.createElement('b'); b.textContent = trL(T.head); tag.append(b, ' · ' + trL(T.dim));
    if (T.warn) tag.append(' · ' + trL(T.warn)); tag.classList.toggle('bad', !!T.bad); };
  const tagV = new THREE.Vector3();
  function tagLoop() { requestAnimationFrame(tagLoop);   // started by init; the line at the bottom right: what is picked, its size, what is wrong
    if (!on || (!sel && !dsel && !xsel && !gsel)) { if (!tag.hidden) tag.hidden = true; xT = null; gBox.visible = false; return; }
    if (sel) { gBox.visible = false; tag.hidden = false; return; }
    if (!xT || ++xF % 4 === 0) { xT = xTag(); if (xT) { xTagText(xT); gB.copy(xT.box); } }
    gBox.visible = !!xT; tag.hidden = !xT; }
  function info() {
    pieces.forEach(w => { w.userData.free.ring.visible = w.userData.free.fill.visible = w === sel; });
    if (!sel) { tagText(); $('frName').textContent = '还没选家具'; $('frDim').textContent = ''; $('frInfo').textContent = '点一下家具选中它，按住拖动。'; $('frSel').classList.add('none'); return; }
    $('frSel').classList.remove('none');
    const k = sel.userData.free.k, T = tpl(k), P = poly(sel), xs = P.map(p => p[0]), ys = P.map(p => p[1]);
    let d = Math.round(((sel.rotation.y - (BY[k].frame ? Math.PI / 2 : 0)) * 180 / Math.PI) % 360); if (d > 180) d -= 360; if (d <= -180) d += 360;
    const hh = sel.userData.free.h; hRow(k, hh); $('frT').hidden = !BY[k].tub; $('frC').hidden = !BY[k].ctv; $('frP').hidden = !BY[k].pot; $('frF').hidden = !BY[k].frm; $('frTn').hidden = !BY[k].tone; $('frCl').hidden = !BY[k].cols && !BY[k].fab; $('frPat').hidden = !BY[k].fab; $('frD').hidden = !BY[k].dia;
    if (BY[k].pot) POTS.forEach(c => $('fp-' + c).setAttribute('aria-pressed', sel.userData.free.c === c)); if (BY[k].frm) FRMS.forEach(c => $('ff-' + c).setAttribute('aria-pressed', sel.userData.free.c === c)); if (BY[k].tone) TONES.forEach(c => $('ftn-' + c).setAttribute('aria-pressed', sel.userData.free.c === c)); if (BY[k].dia) BY[k].dia.forEach(v => $('fd-' + v).setAttribute('aria-pressed', sel.userData.free.d === v));
    if (BY[k].ctv) CTV.forEach(c => $('fc-' + c).setAttribute('aria-pressed', sel.userData.free.c === c)); if (BY[k].cols || BY[k].fab) { const [c0, p0] = String(sel.userData.free.c || '').split('|'), CL = BY[k].fab ? ['white', 'lemon', 'blue', 'teal'] : BY[k].cols;
      ['black', 'white', 'lemon', 'blue', 'teal'].forEach(c => { const b = $('fcl-' + c); b.hidden = !CL.includes(c); b.setAttribute('aria-pressed', c0 === c); }); if (BY[k].fab) ['none', 'seat', 'back'].forEach(q => $('fpt-' + q).setAttribute('aria-pressed', (p0 || 'none') === q)); }
    if (BY[k].tub) { const td = Math.round(((sel.userData.free.t || 0) * 180 / Math.PI) % 360); $('frTv').textContent = td ? (td > 0 ? '顺时针' : '逆时针') + ' ' + Math.abs(td) + '°' : '原样'; } $('frS').hidden = !BY[k].wall || !!BY[k].tv || !!BY[k].art || !!BY[k].fl; SHAPES.forEach(s => $('fsh-' + s).setAttribute('aria-pressed', sel.userData.free.s === s));
    $('frName').textContent = BY[k].n + ' · ' + (d === 0 ? '转角 0°' : (d > 0 ? '顺时针' : '逆时针') + ' ' + Math.abs(d) + '°'); $('frDim').textContent = dimText(sel); tagText();
    const a = cm(Math.min(...xs) - W0), b = cm(W1 - Math.max(...xs)), g = cm(Math.min(...ys) - GL), over = cm(Math.max(...ys) - LINE);
    const wall = (n, v) => v < 0 ? n + ' ' + '压进墙里' + ' ' + -v + 'cm' : n + ' ' + v + 'cm';
    const out = Math.max(...ys) <= GL - 100 ? ['在阳台'] : [wall('离沙发墙', a), wall('离书房墙', b), wall('离窗', g)];   // GL - 100: the balcony floor edge
    if (over > 0) out.push('超出客厅线' + ' ' + over + 'cm');
    let bad = null, near = null, nd = Infinity;
    const loose = c => c.floor || c.wall || c.slide || c.deco;
    if (!loose(BY[k])) pieces.forEach(o => { if (o === sel || loose(BY[o.userData.free.k])) return; const Q = poly(o);
      if (hits(P, Q)) bad = bad || o; else { const dd = gap(P, Q); if (dd < nd) { nd = dd; near = o; } } });
    if (BY[k].deco) out.unshift('放在：' + (sel.userData.free.on || '地上'));
    if (bad) out.push('重叠：' + BY[bad.userData.free.k].n); else if (near) out.push('最近：' + BY[near.userData.free.k].n + ' ' + cm(nd) + 'cm');
    const PW = P.map(([x, y]) => toWorld(x, y)), inW = !BY[k].wall && !BY[k].fl && (inWall(PW) || (!BY[k].deco && inFixed(PW)));
    let xhit = null; if (sel.position.z / MM > LINE + 300 && !BY[k].wall) {   // taken out of the living room: the nearest wall, built-in or the dining set
      const xs2 = PW.map(q => q[0]), ys2 = PW.map(q => q[1]), c = obstCheck([[Math.min(...xs2), Math.max(...xs2), Math.min(...ys2), Math.max(...ys2)]], dineParts().map(o => ['餐桌和椅子', rectOf(o)]).filter(e => e[1]));
      for (let i = out.length - 1; i >= 0; i--) if (['离沙发墙', '离书房墙', '离窗', '超出客厅线', '在阳台'].some(s => out[i].startsWith(s))) out.splice(i, 1);
      xhit = c.hit === '餐桌和椅子' && !BY[k].deco ? c.hit : null; if (xhit) out.unshift('重叠：' + xhit); else if (!c.hit && c.gmin < Infinity) out.unshift('最近：' + c.gname + ' ' + cm(c.gmin) + 'cm'); }
    if (inW) out.unshift('⚠ 进墙或撞到柜子了，挪出来一点');
    const wrong = !!bad || inW || !!xhit; sel.userData.free.warn = inW ? '⚠ 进墙或撞到柜子了，挪出来一点' : xhit ? '⚠ 重叠：' + xhit : bad ? '⚠ 重叠：' + BY[bad.userData.free.k].n : ''; tagText();
    sel.userData.free.ring.material = wrong ? badMat : ringMat; sel.userData.free.fill.material = wrong ? fillBad : fillMat;
    $('frInfo').textContent = out.join(' · '); $('frInfo').classList.toggle('bad', wrong);
  }
  const snap = () => pieces.map(w => Object.assign({ k: w.userData.free.k, x: Math.round(w.position.x / MM), y: Math.round(w.position.z / MM), a: +w.rotation.y.toFixed(4) }, w.userData.free.h ? { h: w.userData.free.h } : {}, w.userData.free.s ? { s: w.userData.free.s } : {}, w.userData.free.t ? { t: +w.userData.free.t.toFixed(4) } : {}, w.userData.free.c ? { c: w.userData.free.c } : {}, w.userData.free.d ? { d: w.userData.free.d } : {}));
  let dirty = false, armed = null, armT = 0;
  function save(keepSlot) { ppl(); try { localStorage.setItem(KEY, JSON.stringify(snap())); } catch (e) {} if (!keepSlot && cur && !dirty) { dirty = true; slotUI(); } }
  function slotUI() { SLOTS.forEach(s => { const o = $('fs-o' + s); if (!o) return; o.disabled = !slotOf(s); o.setAttribute('aria-pressed', cur === s); });
    const rs = $('fr-resave'); rs.hidden = !(cur && dirty); if (cur) rs.textContent = '保存修改到组合' + cur; }
  // a second click on the same button within 3 s does it
  function arm(id, label, fn) { const b = $(id); clearTimeout(armT);
    if (armed === id) { armed = null; b.textContent = b.dataset.t0; fn(); return; }
    if (armed) { const o = $(armed); o.textContent = o.dataset.t0; }
    armed = id; b.dataset.t0 = b.textContent; b.textContent = label; armT = setTimeout(() => { armed = null; b.textContent = b.dataset.t0; }, 3000); }
  const flash = (id, txt) => { const b = $(id), t0 = b.textContent; b.textContent = txt; setTimeout(() => { b.textContent = t0; }, 1400); };
  // the room choices kept with a set, as the default and in this browser (2026-10-25: 黄色小凳子存了，也没存进去 / 餐厅画存不进默认)
  const OPT_KEY = 'c2free.opts', OPT_KEYS = ['sfc', 'lrug', 'sheer', 'lart', 'lmir', 'dchair', 'dtab', 'dcush', 'dseat', 'dback', 'kchair', 'dwall', 'ctuck', 'dpend', 'dart', 'hlamp', 'hmir', 'hstool', 'hart', 'hart2', 'hrugc',
    'endp', 'ebdp', 'mnc', 'mbp', 'tv', 'kjoin', 'sdopen'];
  const optsNow = () => Object.fromEntries(OPT_KEYS.map(k => [k, state[k]])), optSave = () => { try { localStorage.setItem(OPT_KEY, JSON.stringify(optsNow())); } catch (e) {} };
  const setOf = () => ({ v: 2, opts: optsNow(), pieces: snap(), sfc: state.sfc, lrug: state.lrug, sheer: state.sheer, lmir: state.lmir, dine, dchair: state.dchair, dset: state.dset, dcount: state.dcount, dwall: state.dwall,
    hrug: { p: hrug, c: state.hrugc }, hst, at: new Date().toISOString().slice(0, 16) });
  function applySet(L) { if (L.sfc) state.sfc = L.sfc; if (L.lrug) state.lrug = L.lrug; if (L.sheer) state.sheer = L.sheer; if (L.lmir) state.lmir = L.lmir; if ('dine' in L) dine = L.dine || null;
    if (L.dchair) { state.dchair = L.dchair; state.dset = L.dset || 'off'; state.dcount = L.dcount || '4'; state.dwall = L.dwall || 'chair'; } sane(); dineSave(); dineUI();
    if (L.hrug) { hrug = L.hrug.p || null; if (L.hrug.c) state.hrugc = L.hrug.c; rugSave(); rugUI(); } if ('hst' in L) { hst = L.hst || null; stoolSave(); }
    if (L.opts) { OPT_KEYS.forEach(k => { if (k in L.opts) state[k] = L.opts[k]; }); sane(); }
    load(L.v === 2 ? L.pieces : migrate(L.pieces)); save(true); applyLiving(); }
  function saveSlot(s, now) {   // into an empty set, or back into the open one, at once; over another saved set on a second click
    const go = () => { slots[s] = setOf();
      try { localStorage.setItem(SLOT_KEY, JSON.stringify(slots)); } catch (e) {}
      cur = s; dirty = false; slotUI(); flash(now ? 'fs-s' + s : 'fs-s' + s, '已存'); };
    if (now || !slotOf(s) || s === cur) go(); else arm('fs-s' + s, '再点一次覆盖', go);
  }
  function openSlot(s) { const L = slotOf(s); if (!L) return; applySet(L); cur = s; dirty = false; slotUI(); }
  const downRay = new THREE.Raycaster(), dn = new THREE.Vector3(0, -1, 0);
  function supportOf(w) {
    livMir.updateMatrixWorld(true);
    const p = livMir.localToWorld(new THREE.Vector3(w.position.x, 0, w.position.z)); downRay.set(new THREE.Vector3(p.x, 2.6, p.z), dn);
    const vis = o => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
    const targets = pieces.filter(o => o !== w && o.visible && !BY[o.userData.free.k].floor); if (typeof diningMove !== 'undefined') targets.push(diningMove);
    const big = o => { const gg = o.geometry; if (!gg.boundingSphere) gg.computeBoundingSphere(); const sc = o.getWorldScale(new THREE.Vector3()); return gg.boundingSphere.radius * Math.max(Math.abs(sc.x), Math.abs(sc.y), Math.abs(sc.z)) > 0.1; };   // not a flower or a small vase
    const hit = downRay.intersectObjects(targets, true).find(h => h.object.isMesh && vis(h.object) && !h.object.userData.noSupport && big(h.object));
    if (!hit) return { y: 0, on: '' };
    let top = null; for (let q = hit.object; q; q = q.parent) if (q.userData && q.userData.free) { top = q; break; }
    return { y: hit.point.y, on: top ? BY[top.userData.free.k].n : '餐桌' };
  }
  function settle() { pieces.forEach(w => { if (!BY[w.userData.free.k].deco) return; w.position.y = 0; const s = supportOf(w); w.position.y = s.y; w.userData.free.on = s.on; }); }
  function clear() { pieces.splice(0).forEach(w => livMir.remove(w)); sel = null; }
  function load(list) { clear(); list.forEach(p => {
    // the wide-arm sofa tried on 2026-10-22 (too big for the room): the 乐园 2.6 in its place
    if (p.k === 'ns' || p.k === 'ns24') p = { k: 'le260', x: +p.x - 40, y: +p.y, a: (+p.a || 0) - Math.PI / 2 };
    if (CT_GONE.includes(p.k)) p = { k: 'burlpill90', x: +p.x, y: +p.y, a: +p.a || 0 };   // the coffee tables cut on 2026-10-25
    let k = ['pw', 'rw', 'rb'].includes(p.k) ? 'pc' : p.k, x = +p.x, a = +p.a || 0, c = p.c;
    if (k === 'le260' || k === 'arc260') { k = 'pea252'; c = c || 'white'; if (Math.abs(Math.sin(a)) < 0.1) { x += 180 * Math.cos(a); a += Math.PI / 2; } }   // 2026-10-27: the pea is the only sofa now, so older layouts come across
    if (BY[k]) add(k, x, +p.y, a, +p.h || 0, p.s, +p.t || 0, c, +p.d || 0); }); settle(); info(); ppl(); }   // pw / rw / rb: the plain columns, now paper ones
  const select = w => { sel = w; if (w) xsel = gsel = null; if (w && dsel) { dsel = false; dineUI(); } info(); };
  const turn = deg => { if (!sel) return; sel.rotation.y += deg * Math.PI / 180; info(); save(); };
  const setH = h => { if (!sel || !sel.userData.free.h) return; sel.userData.free.h = h; const c = BY[sel.userData.free.k];
    if (c.wall) sel.children[0].position.y = (h - 1000) * MM; else if (c.grow) growOf(sel, h); else sel.children[0].scale.y = h / (c.h0 || 500); info(); save(); };
  const setD = d => { if (!sel || !BY[sel.userData.free.k].dia) return; const f = d / 30; sel.userData.free.d = d; sel.children[0].scale.x = sel.children[0].scale.z = f;
    sel.userData.free.ring.scale.set(f, 1, f); sel.userData.free.fill.scale.set(f, f, 1); info(); save(); };
  const setS = s => { if (!sel || !BY[sel.userData.free.k].wall) return; shapeOf(sel, s); sel.userData.free.s = s; info(); save(); };
  const setC = c => { if (!sel || !(BY[sel.userData.free.k].ctv || BY[sel.userData.free.k].pot || BY[sel.userData.free.k].frm || BY[sel.userData.free.k].tone || BY[sel.userData.free.k].cols || BY[sel.userData.free.k].fab)) return; if (BY[sel.userData.free.k].fab) { const p0 = String(sel.userData.free.c || '').split('|')[1]; c = c + (p0 ? '|' + p0 : ''); } sheetOf(sel, c); info(); save(); };
  const setT = t => { if (!sel || !BY[sel.userData.free.k].tub) return; turnTub(sel, t); settle(); info(); save(); };
  const HS = { hgt: [40, 45, 50, 55, 60], wall: [80, 90, 100, 110, 120, 130] };
  function hRow(k, hh) { const list = BY[k].hs || (BY[k].wall ? HS.wall : BY[k].hgt ? HS.hgt : null), kind = list && list.join(), row = $('frH'); row.hidden = !kind; if (!kind) return;
    if (row.dataset.kind !== kind) { row.dataset.kind = kind; row.querySelectorAll('button').forEach(b => b.remove());
      list.forEach(v => { const b = document.createElement('button'); b.className = 'seg'; b.type = 'button'; b.textContent = v; b.dataset.v = v; b.addEventListener('click', () => setH(v * 10)); row.appendChild(b); }); }
    row.querySelector('.rl').textContent = BY[k].wall ? '挂高' : '高度'; row.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', hh === +b.dataset.v * 10)); }
  const remove = () => { if (!sel) return; livMir.remove(sel); pieces.splice(pieces.indexOf(sel), 1); sel = null; settle(); info(); save(); };
  // pointer: a press on a piece selects it and drags it on the floor (the orbit doesn't start); the rug moves only once it
  // is selected, so a press on it still orbits the view; a click on empty floor drops the selection
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), floorP = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const aim = e => { const r = canvas.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); };
  const onFloor = () => { const p = new THREE.Vector3(); if (!ray.ray.intersectPlane(floorP, p)) return null; livMir.worldToLocal(p); return [p.x / MM, p.z / MM]; };
  const pick = () => { const hs = ray.intersectObjects(pieces.filter(w => w.visible), true).filter(h => h.object.isMesh);
    const top = w => { for (let o = w; o; o = o.parent) if (o.userData && o.userData.free) return o; return null; };
    const solid = hs.map(h => top(h.object)).find(w => w && !BY[w.userData.free.k].floor); return solid || hs.map(h => top(h.object)).find(Boolean) || null; };
  let down = null;
  // the walls of the plan (2026-10-25): a piece, the dining set or the rug overlapping one is flagged; 8 mm of grace
  const WALLS = S.walls.map(([a, b, c, d]) => [Math.min(a, c) + 8, Math.max(a, c) - 8, Math.min(b, d) + 8, Math.max(b, d) - 8]);
  const toWorld = (x, y) => { const v = livMir.localToWorld(new THREE.Vector3(x * MM, 0, y * MM)); return [v.x / MM, v.z / MM]; };
  const polyRect = (P, R) => { const ax = [[1, 0], [0, 1]]; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; ax.push([b[1] - a[1], a[0] - b[0]]); }
    const rc = [[R[0], R[2]], [R[1], R[2]], [R[1], R[3]], [R[0], R[3]]];
    return ax.every(([nx, ny]) => { let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
      P.forEach(([x, y]) => { const q = x * nx + y * ny; a0 = Math.min(a0, q); a1 = Math.max(a1, q); }); rc.forEach(([x, y]) => { const q = x * nx + y * ny; b0 = Math.min(b0, q); b1 = Math.max(b1, q); });
      return a1 > b0 && b1 > a0; }); };
  const inWall = P => P.length > 2 && WALLS.some(R => R[0] < R[1] && R[2] < R[3] && polyRect(P, R));
  // the built-ins, as obstacles too (named for the notes): the entrance cabinet at its depth, the right unit, the fridge, the
  // kitchen counters, the DB/ST closet
  const FIXED = () => { const DL = state.entry === 'new' ? (+state.endp || 75) * 10 : 850;
    const SBD = state.entry === 'new' && state.esb !== 'flush' ? Math.min(350, DL) : DL;   // the sideboard recessed or flush
    return [['玄关柜', [5850, 5850 + DL, 9080, 9650]], ['餐边柜', [5850, 5850 + SBD, 8095, 9080]], ['右边书架柜', state.entry === 'new' ? [7565, 8165, 9080, 9730] : null], ['冰箱', [8165, 8765, 9080, 9730]],
      ['厨房台面', [8765, 10100, 9060, 9730]], ['厨房台面', [10080, 10700, 6220, 9080]], ['电箱柜', [5850, 6132, 9700, 11680]]].filter(f => f[1]); };
  const OBST = () => [...WALLS.filter(R => R[0] < R[1] && R[2] < R[3]).map(R => ['墙', R]), ...FIXED()];
  const rectGap = (a, b) => Math.hypot(Math.max(0, b[0] - a[1], a[0] - b[1]), Math.max(0, b[2] - a[3], a[2] - b[3]));   // 0 when they touch or overlap
  const rectOf = o => { const b = new THREE.Box3().setFromObject(o); return b.isEmpty() ? null : [b.min.x / MM, b.max.x / MM, b.min.z / MM, b.max.z / MM]; };
  const inFixed = P => P.length > 2 && FIXED().some(([, R]) => polyRect(P, [R[0] + 8, R[1] - 8, R[2] + 8, R[3] - 8]));
  const boxInWall = o => { const b = new THREE.Box3().setFromObject(o); if (b.isEmpty()) return false; const x0 = b.min.x / MM, x1 = b.max.x / MM, y0 = b.min.z / MM, y1 = b.max.z / MM; return inWall([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]); };
  // the dining set moves too (2026-10-25): a press on the table or a chair drags the whole set on the floor (world), the
  // row in the panel turns it about the table's centre and picks the chairs; the pendant stays; kept in this browser and
  // in each saved set
  const DN_KEY = 'c2free.dine'; let dine = null, dsel = false, ddrag = null;
  const HR_KEY = 'c2free.hrug'; let hrug = null, rdrag = null;   // the hall rug: { x, z, r } in the world (m)
  const HS_KEY = 'c2free.hstool'; let hst = null, sdrag = null;   // the small hall stool, the same way
  window.hallStoolFree = () => on ? hst : null;
  const shown = o => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };   // the stool holds one group per style: only the shown one counts
  const stoolHit = () => hallYStool.visible && ray.intersectObject(hallYStool, true).some(h => shown(h.object));
  const stoolSave = () => { try { localStorage.setItem(HS_KEY, JSON.stringify(hst)); } catch (e) {} };
  window.hallRugFree = () => on ? hrug : null;
  const rugHit = () => HRUG.visible && ray.intersectObject(HRUG, false).length > 0;
  const RUGC = ['sisal', 'natural', 'sage', 'ivory', 'char', 'off'];
  function rugUI() { RUGC.forEach(c => { const b = $('fhg-' + c); if (b) b.setAttribute('aria-pressed', (RUGC.includes(state.hrugc) ? state.hrugc : 'natural') === c); });
    const n = $('hgNote'); if (!n) return; const inW = HRUG.visible && boxInWall(HRUG); n.classList.toggle('bad', inW); n.textContent = (inW ? '⚠ 地毯进墙了。' + ' ' : '') + '点一下地毯就能拖动，可以转 90°。'; }
  const rugSave = () => { try { localStorage.setItem(HR_KEY, JSON.stringify({ p: hrug, c: state.hrugc })); } catch (e) {} };
  window.dineFree = () => on ? dine : null;
  const dineHit = () => { const vis = o => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
    return ray.intersectObject(diningMove, true).some(h => h.object.isMesh && vis(h.object)); };
  const dineNow = () => ({ x: diningMove.position.x, z: diningMove.position.z, r: diningMove.rotation.y });
  const dineSave = () => { try { localStorage.setItem(DN_KEY, JSON.stringify({ f: dine, c: state.dchair, s: state.dset, n: state.dcount, w: state.dwall })); } catch (e) {} if (cur && !dirty) { dirty = true; slotUI(); } };
  function dineTurn(a, abs) {   // radians, + counter-clockwise from above; abs: to that turn
    scene.updateMatrixWorld(true); if (!dine) dine = dineNow();
    const c = diningMove.localToWorld(new THREE.Vector3(DX * MM, 0, DY * MM)), r1 = abs ? a : dine.r + a, d = r1 - dine.r, vx = dine.x - c.x, vz = dine.z - c.z, cs = Math.cos(d), sn = Math.sin(d);
    dine = { x: c.x + vx * cs + vz * sn, z: c.z - vx * sn + vz * cs, r: r1 }; applyLiving(); dineSave(); dineUI(); }
  const DN_COMBO = { jm4: { dchair: 'jm', dset: 'off', dcount: '4' }, jm6: { dchair: 'jm', dset: 'six' }, li4: { dchair: 'limo', dset: 'off', dcount: '4' } };   // the official layout (2026-10-25)
  const dineCombo = () => state.dset === 'six' ? 'jm6' : state.dchair === 'jm' ? 'jm4' : state.dchair === 'limo' ? 'li4' : '';
  const DN_NOTE = { jm4: '骏马扶手椅 4 把（两边各 2 把）+ 宝宝椅在桌头。', jm6: '骏马扶手椅 6 把（两边各 3 把）：很挤，宝宝椅放不下，适合来客人。', li4: '利默椅 4 把（两边各 2 把）+ 宝宝椅在桌头。', li5: '利默椅 5 把（两边各 2 把，另一头 1 把）+ 宝宝椅在桌头。', li6: '利默椅 6 把（两边各 2 把，两头各 1 把），没有宝宝椅的位置。' };
  const DW = ['chair', 'ban120', 'ban140', 'bench120', 'bench140'];
  // the choices deleted on 2026-10-25 (按你的删): a set or this browser still holding one gets the nearest kept one
  const sane = () => { state.dset = 'off'; if (!['4', '5s', '6'].includes(state.dcount)) state.dcount = '4'; if (state.dwall === 'ban140') state.dwall = 'ban120'; if (state.dwall === 'bench140') state.dwall = 'bench120';
    state.lrug = 'none'; state.lart = 'none'; state.dchair = 'limo'; if (!['ysy', 'ysg', 'ysn', 'boucle', 'boul60', 'xpine', 'cord', 'none'].includes(state.hstool)) state.hstool = 'none';
    if (state.hlamp === 'zoxy') state.hlamp = 'tier85'; if (!['silkB', 'drum40', 'tier85', 'none'].includes(state.hlamp)) state.hlamp = 'drum40'; if (!['natural', 'off'].includes(state.hrugc)) state.hrugc = 'natural';
    if (state.hmir === 'wall') state.hmir = 'arch'; if (!['tallm', 'off'].includes(state.hart)) state.hart = 'tallm'; state.hart2 = 'off'; if (state.dpend === 'palm') state.dpend = 'paper'; if (!['60', '75'].includes(state.endp)) state.endp = '75'; state.esb = 'recess'; };
  const visA = o => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  const dineParts = () => { scene.updateMatrixWorld(true); return [tabOval, stokke, ...Object.values(chairSets).flatMap(s => s.children), ...sixSet.children.flatMap(g => g.children), ...wallSeat.children].filter(o => o && o.isObject3D && visA(o)); };
  const obstCheck = (Rs, extra) => { let hit = null, gmin = Infinity, gname = ''; const L = [...OBST(), ...(extra || [])];
    Rs.forEach(R => L.forEach(([nm, Q]) => { const g = rectGap(R, Q); if (g <= 0 && R[1] > Q[0] + 8 && R[0] < Q[1] - 8 && R[3] > Q[2] + 8 && R[2] < Q[3] - 8) hit = hit || nm; else if (g < gmin) { gmin = g; gname = nm; } }));
    return { hit, gmin, gname }; };
  const freeObst = () => pieces.filter(w => { const c = BY[w.userData.free.k]; return !(c.floor || c.wall || c.slide || c.deco); }).map(w => { const PW = poly(w).map(([x, y]) => toWorld(x, y)), xs = PW.map(q => q[0]), ys = PW.map(q => q[1]);
    return [BY[w.userData.free.k].n, [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]]; });
  const dineCheck = () => { const Rs = dineParts().filter(o => o !== wallSeat && !Object.values(WALLSEAT).includes(o)).map(rectOf).filter(Boolean), c = obstCheck(Rs, freeObst()), tight = !c.hit && c.gmin < 300 && state.ctuck !== 'open';   // pulled out: the gap is the sitting room already
    return { bad: !!c.hit || tight, text: c.hit ? '⚠ 撞到' + c.hit + '了。' : c.gmin < Infinity ? (tight ? '⚠ 最窄处离' + c.gname + '只有' + ' ' + Math.round(c.gmin / 10) + 'cm，太挤（坐下至少留 30cm，后面要走人留 60cm）。' : '最窄处离' + c.gname + ' ' + Math.round(c.gmin / 10) + 'cm。') : '' }; };
  const DOOR = [7950, 11765], inDoor = R => [[R[0], R[2]], [R[1], R[2]], [R[0], R[3]], [R[1], R[3]], [(R[0] + R[1]) / 2, (R[2] + R[3]) / 2], [(R[0] + R[1]) / 2, R[3]], [R[1], (R[2] + R[3]) / 2]]
    .some(([x, y]) => x <= DOOR[0] && y <= DOOR[1] && Math.hypot(x - DOOR[0], y - DOOR[1]) < 1000);   // inside the front door's swing (leaf 1000 on its hinge)
  const visBox = o => { const B = new THREE.Box3(); o.updateMatrixWorld(true); o.traverse(q => { if (q.isMesh && visA(q)) B.expandByObject(q); }); return B; };
  const sizeOf = o => visBox(o).getSize(new THREE.Vector3());
  const localSize = o => { o.updateMatrixWorld(true); const inv = new THREE.Matrix4().copy(o.matrixWorld).invert(), B = new THREE.Box3();   // in the piece's own frame: a turned stool still reads 37 x 27
    o.traverse(q => { if (!q.isMesh || !visA(q) || !q.geometry || !q.geometry.attributes.position) return; if (!q.geometry.boundingBox) q.geometry.computeBoundingBox(); B.union(q.geometry.boundingBox.clone().applyMatrix4(inv.clone().multiply(q.matrixWorld))); });
    return B.getSize(new THREE.Vector3()); };
  const furnOf = o => { let s = sizeOf(o); if (Math.max(s.x, s.z) > 2.7 || s.y > 2.9 || (s.y < 0.03 && Math.max(s.x, s.z) > 1.2)) return null;   // a wall, a floor, the ceiling
    let best = o; for (let q = o.parent; q && q !== scene && q !== livMir; q = q.parent) { s = sizeOf(q); if (Math.max(s.x, s.z) > 2.6 || s.y > 2.85 || s.x * s.z > 5) break; best = q; } return best; };
  function pickAny(e) { aim(e); const hs = ray.intersectObjects(scene.children, true).filter(h => h.object.isMesh && visA(h.object) && !(h.object.material && h.object.material.transparent && h.object.material.opacity < 0.3));
    for (const h of hs) { const s = sizeOf(h.object); if (Math.max(s.x, s.z) > 2.7 || (s.y > 2.4 && Math.max(s.x, s.z) > 1.0) || (s.y < 0.03 && Math.max(s.x, s.z) > 1.2)) continue;   // walls, floors: look past them
      const f = furnOf(h.object); if (f) return f; } return null; }
  const gB = new THREE.Box3(), gBox = new THREE.Box3Helper(gB, 0x4f6b5c); gBox.visible = false; scene.add(gBox);
  function xTag() {
    if (gsel) { const B = visBox(gsel); if (B.isEmpty()) return null; const s = B.getSize(new THREE.Vector3());
      return { box: B, head: gsel.userData.label || '选中的家具', dim: '尺寸（长×宽×高）' + ' ' + Math.round(Math.max(s.x, s.z) * 100) + '×' + Math.round(Math.min(s.x, s.z) * 100) + '×' + Math.round(s.y * 100) + 'cm', warn: '', bad: false }; }   // the tag of the dining set, the hall rug or the stool: where, what, and what is wrong
    if (dsel) { const B = new THREE.Box3(); dineParts().forEach(o => B.expandByObject(o)); if (B.isEmpty()) return null; const c = dineCheck();
      return { box: B, at: [(B.min.x + B.max.x) / 2, B.max.y + 0.12, (B.min.z + B.max.z) / 2], head: '餐桌和椅子', dim: '椭圆桌 140×85' + ' · ' + '整套约' + ' ' + Math.round((B.max.x - B.min.x) / MM / 10) + '×' + Math.round((B.max.z - B.min.z) / MM / 10) + 'cm', warn: c.text, bad: c.bad }; }
    const rug = xsel === 'rug', o = rug ? HRUG : xsel === 'stool' ? hallYStool : null; if (!o || !o.visible) return null;
    scene.updateMatrixWorld(true); const B = rug ? new THREE.Box3().setFromObject(o) : visBox(o); if (B.isEmpty()) return null; const R = [B.min.x / MM, B.max.x / MM, B.min.z / MM, B.max.z / MM], c = obstCheck([R]), dr = inDoor(R);
    const warn = c.hit ? '⚠ 撞到' + c.hit + '了。' : dr && !rug ? '⚠ 在开门的范围里，门会撞到。' : dr ? '门会扫过地毯：要选薄的平织，门底留缝。' : c.gmin < Infinity ? '最近：' + c.gname + ' ' + Math.round(c.gmin / 10) + 'cm' : '';
    return { box: B, at: [(B.min.x + B.max.x) / 2, B.max.y + 0.12, (B.min.z + B.max.z) / 2], head: rug ? '玄关地毯' : '玄关小凳', dim: (() => { const s = localSize(o); return Math.round(Math.max(s.x, s.z) * 100) + '×' + Math.round(Math.min(s.x, s.z) * 100) + (rug ? '' : '×' + Math.round(s.y * 100)) + 'cm'; })(), warn, bad: !!c.hit || (dr && !rug) }; }
  function dineUI() { ['jm4', 'jm6', 'li4'].forEach(k => { const b = $('dn-' + k); if (b) b.setAttribute('aria-pressed', dineCombo() === k); });
    DW.forEach(k => { const b = $('fdw-' + k); if (b) b.setAttribute('aria-pressed', (DW.includes(state.dwall) ? state.dwall : 'chair') === k); });
    // the tightest place: what the table, a chair or the Stokke runs into (a free piece too), else the least room left
    const dc = on ? dineCheck() : { bad: false, text: '' }, dw = dc.bad, room = dc.text;
    const n = $('dnNote'); if (n) { n.classList.toggle('bad', dw); } if (n) n.textContent = (room ? room + ' ' : '') + (dsel ? '已选中餐桌：按住拖动，Q / E 转 5°，或者用上面的按钮。' : '点一下餐桌或椅子就能拖动整套，吊灯跟着餐桌中心一起动。') + ' ' + (DN_NOTE[dineCombo() === 'li4' && state.dcount !== '4' ? (state.dcount === '6' ? 'li6' : 'li5') : dineCombo()] || ''); }
  window.addEventListener('pointerdown', e => {
    if (!on || locked || e.target !== canvas || e.button !== 0 || walk) return;
    aim(e); const w = pick(); down = { x: e.clientX, y: e.clientY, w };
    if (!w && stoolHit()) { select(null); xsel = 'stool'; gsel = null; if (dsel) { dsel = false; dineUI(); } down.w = 'stool'; e.stopPropagation(); e.preventDefault(); const p = new THREE.Vector3(); if (!ray.ray.intersectPlane(floorP, p)) return;
      if (!hst) hst = { x: hallYStool.position.x, z: hallYStool.position.z, r: hallYStool.rotation.y }; sdrag = { id: e.pointerId, p0: p.clone(), x0: hst.x, z0: hst.z }; try { canvas.setPointerCapture(e.pointerId); } catch (er) {} return; }
    if (!w && !dineHit() && rugHit()) { select(null); xsel = 'rug'; gsel = null; if (dsel) { dsel = false; dineUI(); } down.w = 'rug'; e.stopPropagation(); e.preventDefault(); const p = new THREE.Vector3(); if (!ray.ray.intersectPlane(floorP, p)) return;
      if (!hrug) hrug = { x: HRUG.position.x, z: HRUG.position.z, r: HRUG.rotation.y }; rdrag = { id: e.pointerId, p0: p.clone(), x0: hrug.x, z0: hrug.z }; try { canvas.setPointerCapture(e.pointerId); } catch (er) {} return; }
    if (!w) { if (!dineHit()) return; select(null); xsel = gsel = null; dsel = true; dineUI(); down.w = 'dine'; e.stopPropagation(); e.preventDefault();   // the dining set
      const p = new THREE.Vector3(); if (!ray.ray.intersectPlane(floorP, p)) return; if (!dine) dine = dineNow();
      ddrag = { id: e.pointerId, p0: p.clone(), x0: dine.x, z0: dine.z }; try { canvas.setPointerCapture(e.pointerId); } catch (er) {} return; }
    const fl = BY[w.userData.free.k].floor && w !== sel; select(w); e.stopPropagation(); e.preventDefault();
    if (fl) return;
    const p = onFloor(); if (!p) return;
    drag = { w, id: e.pointerId, off: [w.position.x / MM - p[0], w.position.z / MM - p[1]] }; try { canvas.setPointerCapture(e.pointerId); } catch (er) {}
  }, true);
  window.addEventListener('pointermove', e => { if (sdrag && e.pointerId === sdrag.id) { aim(e); const p = new THREE.Vector3(); if (!ray.ray.intersectPlane(floorP, p)) return;
      hst = { x: Math.round((sdrag.x0 + p.x - sdrag.p0.x) * 100) / 100, z: Math.round((sdrag.z0 + p.z - sdrag.p0.z) * 100) / 100, r: hst.r }; hallYStool.position.set(hst.x, 0, hst.z); return; }
    if (rdrag && e.pointerId === rdrag.id) { aim(e); const p = new THREE.Vector3(); if (!ray.ray.intersectPlane(floorP, p)) return;
      hrug = { x: Math.round((rdrag.x0 + p.x - rdrag.p0.x) * 100) / 100, z: Math.round((rdrag.z0 + p.z - rdrag.p0.z) * 100) / 100, r: hrug.r }; HRUG.position.set(hrug.x, 0.003, hrug.z); rugUI(); return; }
    if (ddrag && e.pointerId === ddrag.id) { aim(e); const p = new THREE.Vector3(); if (!ray.ray.intersectPlane(floorP, p)) return;
      dine = { x: Math.round((ddrag.x0 + p.x - ddrag.p0.x) * 100) / 100, z: Math.round((ddrag.z0 + p.z - ddrag.p0.z) * 100) / 100, r: dine.r }; diningMove.position.set(dine.x, 0, dine.z); return; }
    if (!drag || e.pointerId !== drag.id) return; aim(e); const p = onFloor(); if (!p) return;
    let x = Math.max(6000, Math.min(13500, Math.round((p[0] + drag.off[0]) / 10) * 10)), y = Math.max(250, Math.min(9500, Math.round((p[1] + drag.off[1]) / 10) * 10));
    if (BY[drag.w.userData.free.k].wall) {   // a wall shelf near the sofa wall or the study wall snaps onto it, facing the room
      if (x - W0 < 300) { x = W0; drag.w.rotation.y = Math.PI / 2; } else if (W1 - x < 300 && y < LINE) { x = W1; drag.w.rotation.y = -Math.PI / 2; } }
    drag.w.position.x = x * MM; drag.w.position.z = y * MM;
    if (BY[drag.w.userData.free.k].deco) { const s = supportOf(drag.w); drag.w.position.y = s.y; drag.w.userData.free.on = s.on; }
    info(); }, true);
  window.addEventListener('pointerup', e => {
    if (drag && e.pointerId === drag.id) { drag = null; settle(); info(); save(); }
    if (ddrag && e.pointerId === ddrag.id) { ddrag = null; applyLiving(); dineSave(); dineUI(); }
    if (rdrag && e.pointerId === rdrag.id) { rdrag = null; applyLiving(); rugSave(); rugUI(); }
    if (sdrag && e.pointerId === sdrag.id) { sdrag = null; applyLiving(); stoolSave(); }
    if (down && !down.w && on && e.target === canvas && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 5) { select(null); xsel = null; if (dsel) { dsel = false; dineUI(); } gsel = pickAny(e); }
    down = null; }, true);
  window.addEventListener('keydown', e => { if (!on || locked || (!sel && !dsel) || /INPUT|TEXTAREA/.test((e.target || {}).tagName || '')) return;
    const k = e.key.toLowerCase();
    if (dsel && !sel) { if (k === 'q' || k === 'e') { dineTurn((k === 'q' ? 1 : -1) * (e.shiftKey ? 45 : 5) * Math.PI / 180); e.preventDefault(); } else if (k === 'escape') { dsel = false; dineUI(); } return; }
    if ((xsel || gsel) && !sel) { if (k === 'escape') xsel = gsel = null; return; }
    if (k === 'q' || k === 'e') { turn((k === 'q' ? -1 : 1) * (e.shiftKey ? 45 : 5)); e.preventDefault(); }
    else if (k === 'delete' || k === 'backspace') { remove(); e.preventDefault(); }
    else if (k === 'escape') select(null); });
  // the page's own living pieces hide while this is on (this hook runs after all the others)
  // the living family sits on the pieces as arranged here (2026-10-24)
  window.LIV_PEOPLE_SRC = () => { if (!on) return null; const at = k => { const w = pieces.find(o => o.userData.free.k === k && o.visible); return w ? { x: w.position.x, z: w.position.z, a: w.rotation.y, obj: w } : null; };
    return { sofa: ['pea252'].map(at).find(Boolean) || null, lounger: at('rl'), chair: at('casa'), table: ['nordic', 'burl', 'burlpill', 'burlpill90', 'burlpill80', 'bamboo', 'hyacinth', 'teak'].map(at).find(Boolean) || null }; };
  const ppl = () => { if (typeof placeLivPeople === 'function') placeLivPeople(); };
  function hideOwn() {
    if (!on) return;
    ppl();
    Object.values(livings).forEach(g => { const u = g.userData;
      [u.sofas, u.tables, u.lyS].forEach(o => o && Object.values(o).forEach(v => [].concat(v).forEach(x => { if (x) x.visible = false; })));
      [u.one, u.rug, u.tvL, u.stab && u.stab.glass].forEach(x => { if (x) x.visible = false; }); });
    [LCH.A, LCH.B, SIDECOL].forEach(o => Object.values(o).forEach(x => { x.visible = false; }));
    [BENCH, OPP, SIDEIRON, TDECO, wsVase, cornerTri, cornerSq, cornerBk, CTAB, LOUNGER, ORCH_V].forEach(x => { if (x) x.visible = false; });
    // the living panel: only the colours still mean something
    document.querySelectorAll('#ctxLiv > .row, #ctxLiv > p.cap').forEach(r => { if (r.querySelector('[id^="sfc-"], [id^="lr-"]') || r.id === 'sfcNote') return;
      if (!r.hidden) { r.hidden = true; r.dataset.fh = '1'; } });
  }
  function setLock(v) { locked = v; select(null); if (dsel) { dsel = false; dineUI(); } line.visible = on && !locked; box.classList.toggle('locked', v);
    $('fr-lock').textContent = v ? '继续摆放' : '固定家具'; if (!window.FREE_HIDE) { try { localStorage.setItem(LOCK_KEY, v ? '1' : ''); } catch (e) {} } }
  function setOn(v) {
    on = v; pieces.forEach(w => { w.visible = on; }); line.visible = on && !locked; if (!on) select(null);
    if (!on) document.querySelectorAll('#ctxLiv [data-fh]').forEach(r => { r.hidden = false; delete r.dataset.fh; });
    $('fr-on').textContent = on ? '关掉自由摆放' : '打开自由摆放'; box.classList.toggle('off', !on); $('frFreeNote').hidden = !on;
    applyLiving(); info();
  }
  function copy() {
    const L = pieces.map(w => Object.assign({ k: w.userData.free.k, x: Math.round(w.position.x / MM), y: Math.round(w.position.z / MM), a: +(w.rotation.y * 180 / Math.PI).toFixed(1) }, w.userData.free.h ? { h: w.userData.free.h } : {}, w.userData.free.s ? { s: w.userData.free.s } : {}, w.userData.free.t ? { t: +(w.userData.free.t * 180 / Math.PI).toFixed(1) } : {}, w.userData.free.c ? { c: w.userData.free.c } : {}, w.userData.free.d ? { d: w.userData.free.d } : {}));
    const txt = ['C2 客厅自由摆放（中心点 mm：沙发墙 x7995，书房墙 x10700，窗 y1830，客厅线 y5100）', ...L.map(p => BY[p.k].n + '  x ' + p.x + '  y ' + p.y + '  ' + p.a + '°' + (p.h ? '  h ' + p.h : '')), JSON.stringify(L)].join('\n');
    const done = () => { $('fr-copy').textContent = '已复制'; setTimeout(() => { $('fr-copy').textContent = '复制布局'; }, 1600); };
    const box2 = () => { io2(true, false, '复制下面这段发给 Claude', txt); $('frText').select(); };
    try { (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(done, box2); } catch (e) { box2(); }
  }
  function io2(show, ok, cap, txt) { $('frIO').hidden = !show; $('fr-io-ok').hidden = !ok; $('frIOcap').textContent = cap || ''; if (txt !== undefined) $('frText').value = txt; }
  function paste() { io2(true, true, '把 Claude 给你的布局粘贴在这里，再点确定', ''); $('frText').focus(); }
  function pasteOk() {
    const s = $('frText').value;
    try { const m = s.match(/\[[\s\S]*\]/), L = JSON.parse(m ? m[0] : s); load(L.map(p => ({ k: p.k, x: p.x, y: p.y, a: (+p.a || 0) * Math.PI / 180, h: p.h, s: p.s, t: (+p.t || 0) * Math.PI / 180, c: p.c, d: p.d }))); save(); io2(false); }
    catch (e) { $('frIOcap').textContent = '没看懂这段布局'; }
  }
  function init() {
    const optCode = optsNow(), lay0 = state.lay;   // the page's own choices, before this browser's if (BUILTIN[lay0]) { state.lay = 'none'; applyLiving(); }
    CAT.forEach(c => tpl(c.k));
    def = BUILTIN[lay0] && typeof LAYS !== 'undefined' && LAYS[lay0] ? BUILTIN[lay0].pieces.map(p => Object.assign({}, p, p.k === 'ct' ? { c: state.ctab } : {}))
      : migrate(DEF_KEYS.filter(k => TPL[k]).map(k => ({ k, x: TPL[k].home.x, y: TPL[k].home.y, a: TPL[k].home.a })));
    state.lay = lay0;
    if (!window.FREE_HIDE) { try { mydef = JSON.parse(localStorage.getItem(DEF_KEY) || 'null'); } catch (e) {} if (mydef && Array.isArray(mydef.pieces) && mydef.pieces.length) def = mydef.pieces; else mydef = null; }
    let saved = null, old = false; if (!window.FREE_HIDE) try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (!Array.isArray(saved)) { saved = JSON.parse(localStorage.getItem(KEY1) || 'null'); old = true; } } catch (e) {}
    load(Array.isArray(saved) && saved.length ? (old ? migrate(saved) : saved) : def);
    const lib = $('frLib'), LIB_G = [['沙发和椅子', ['pea252', 'casa', 'rl', 'scroll']], ['茶几', ['burlpill90', 'soda', 'tatami60', 'tatami80', 'burl']],
      ['边几', ['pc', 'burlcol', 'ct', 'arch3']], ['装饰', ['bk', 'vs', 'branch', 'throw', 'pillows', 'fruit', 'palm', 'tvm']], ['灯具', ['tlamp', 'glamp', 'flamp']], ['地毯和画', ['srug', 'oilart']], ['其他', []]], libRows = {};
    LIB_G.forEach(([g]) => { const h = document.createElement('div'); h.className = 'frgrp'; h.textContent = g; const rw = document.createElement('div'); rw.className = 'row'; lib.appendChild(h); lib.appendChild(rw); libRows[g] = rw; });
    const libRow = k => libRows[(LIB_G.find(([, ks]) => ks.includes(k)) || ['其他'])[0]];
    CAT.forEach(c => { if (!TPL[c.k]) return; const b = document.createElement('button'); b.className = 'seg'; b.type = 'button'; b.textContent = c.n;
      b.addEventListener('click', () => { if (!on) setOn(true); const n = pieces.length % 5; const tb = pieces.find(o => ['nordic', 'burl', 'burlpill', 'burlpill90', 'burlpill80', 'bamboo', 'hyacinth', 'teak'].includes(o.userData.free.k)), sp = BY[c.k].spawn;
        const w = sp ? add(c.k, sp[0], sp[1], sp[2], BY[c.k].hDef || 0) : BY[c.k].wall ? add(c.k, W1, 2800 + n * 120, -Math.PI / 2, 1000) : BY[c.k].deco && tb ? add(c.k, Math.round(tb.position.x / MM) + (n - 2) * 90, Math.round(tb.position.z / MM) - 150 + n * 60, Math.PI / 2)
          : add(c.k, 9350 + n * 60, 3500 + n * 60, BY[c.k].frame ? Math.PI / 2 : 0); settle(); select(w); save(); }); libRow(c.k).appendChild(b); });
    Object.values(libRows).forEach(rw => { if (!rw.children.length) { rw.previousSibling.remove(); rw.remove(); } });
    $('fr-l45').addEventListener('click', () => turn(-45)); $('fr-l5').addEventListener('click', () => turn(-5));
    $('fr-r5').addEventListener('click', () => turn(5));
    CTV.forEach(c => $('fc-' + c).addEventListener('click', () => setC(c)));
    $('ft-0').addEventListener('click', () => setT(0)); $('ft-win').addEventListener('click', () => setT(150 * Math.PI / 180));
    $('ft-l').addEventListener('click', () => setT((sel && sel.userData.free.t || 0) - Math.PI / 6)); $('ft-r').addEventListener('click', () => setT((sel && sel.userData.free.t || 0) + Math.PI / 6)); SHAPES.forEach(s => $('fsh-' + s).addEventListener('click', () => setS(s))); $('fr-r45').addEventListener('click', () => turn(45)); $('fr-del').addEventListener('click', remove);
    $('fr-top').addEventListener('click', () => setView('ltop')); $('fr-reset').addEventListener('click', () => { const go = () => { const B = BUILTIN[lay0] || {};   // the whole default: pieces and every room choice
      applySet(mydef || Object.assign({}, B, { v: 2, pieces: def, dine: null, hrug: { p: null, c: optCode.hrugc }, hst: null, opts: Object.assign({}, optCode, B.opts) })); cur = null; dirty = false; slotUI(); }; if (pieces.length) arm('fr-reset', '再点一次恢复默认', go); else go(); });
    $('fr-resave').addEventListener('click', () => { if (cur) saveSlot(cur, true); }); $('fr-io-ok').addEventListener('click', pasteOk); $('fr-io-x').addEventListener('click', () => io2(false));
    $('fr-def').addEventListener('click', () => { mydef = setOf(); def = mydef.pieces; try { localStorage.setItem(DEF_KEY, JSON.stringify(mydef)); } catch (e) {} flash('fr-def', '已设为默认');
      io2(true, false, (cur ? '组合' + cur : '现在的布局') + '已设为这个浏览器的默认（恢复默认就回到它）。想让发布的页面也默认这样，把下面这段发给 Claude。', 'C2 默认组合' + '\n' + JSON.stringify(mydef)); $('frText').select(); });
    $('fr-copy').addEventListener('click', copy); $('fr-paste').addEventListener('click', paste); $('fr-on').addEventListener('click', () => setOn(!on));
    $('fr-lock').addEventListener('click', () => setLock(!locked)); if (!window.FREE_HIDE) { let v = ''; try { v = localStorage.getItem(LOCK_KEY) || ''; } catch (e) {} if (v) setLock(true); }
    $('fr-fold').addEventListener('click', () => { const m = box.classList.toggle('min'); $('fr-fold').textContent = m ? '展开' : '收起'; });
    const place = () => { if (box.parentElement && box.parentElement.id === 'dock') { box.style.top = ''; box.style.maxHeight = ''; return; }   // in the one panel
      const top = Math.round(document.getElementById('sheet').getBoundingClientRect().bottom + 8);   // under the slim bar
      box.style.top = top + 'px'; box.style.maxHeight = 'calc(100% - ' + (top + (innerWidth <= 520 ? Math.round(innerHeight * 0.46) : 130)) + 'px)'; };
    if (innerWidth <= 520) { box.classList.add('min'); $('fr-fold').textContent = '展开'; }
    window.addEventListener('resize', place); setInterval(place, 500); place();
    POTS.forEach(c => $('fp-' + c).addEventListener('click', () => setC(c))); FRMS.forEach(c => $('ff-' + c).addEventListener('click', () => setC(c))); TONES.forEach(c => $('ftn-' + c).addEventListener('click', () => setC(c))); ['black', 'white', 'lemon', 'blue', 'teal'].forEach(c => $('fcl-' + c).addEventListener('click', () => setC(c)));
    ['none', 'seat', 'back'].forEach(q => $('fpt-' + q).addEventListener('click', () => { if (!sel || !BY[sel.userData.free.k].fab) return; const c0 = String(sel.userData.free.c || 'white').split('|')[0]; sheetOf(sel, c0 + (q === 'none' ? '' : '|' + q)); info(); save(); })); [25, 30, 35, 40].forEach(v => $('fd-' + v).addEventListener('click', () => setD(v)));
    // the sheer on the living glass (none / open / drawn), kept in this browser; the page's own hook marks the buttons
    // the dining set: as kept in this browser, else the 利默 four + Stokke; the chairs pulled out (not on the trade pages)
    if (!window.FREE_HIDE) { let v = null; try { v = JSON.parse(localStorage.getItem(DN_KEY) || 'null'); } catch (e) {}
      if (v) { dine = v.f || null; if (v.c) state.dchair = v.c; if (v.s) state.dset = v.s; if (v.n) state.dcount = v.n; if (v.w) state.dwall = v.w; }
      else { const B0 = (mydef && mydef.dine !== undefined ? mydef : BUILTIN[lay0]) || {}; Object.assign(state, DN_COMBO.li4); if ('dine' in B0) dine = B0.dine || null; if (B0.dwall) state.dwall = B0.dwall; if (B0.dcount) state.dcount = B0.dcount; }
      state.ctuck = 'open'; }
    sane();
    ['cn-4', 'cn-5s', 'cn-6'].forEach(id => ($(id) || document.createElement('i')).addEventListener('click', () => { dineSave(); dineUI(); }));   // the chair count, saved with the set
    Object.keys(DN_COMBO).forEach(k => ($('dn-' + k) || document.createElement('i')).addEventListener('click', () => { Object.assign(state, DN_COMBO[k]); state.ctuck = 'open'; applyLiving(); dineSave(); dineUI(); }));
    $('dr-l').addEventListener('click', () => dineTurn(Math.PI / 12)); $('dr-r').addEventListener('click', () => dineTurn(-Math.PI / 12));
    $('dr-h').addEventListener('click', () => dineTurn(0, true)); $('dr-v').addEventListener('click', () => dineTurn(Math.PI / 2, true));
    $('dr-0').addEventListener('click', () => { dine = null; applyLiving(); dineSave(); dineUI(); });
    DW.forEach(k => ($('fdw-' + k) || document.createElement('i')).addEventListener('click', () => { state.dwall = k; applyLiving(); dineSave(); dineUI(); })); dineUI();
    // the hall rug: where and in what it was left in this browser
    { const B0 = (mydef || BUILTIN[lay0]) || {}; let v = null; if (!window.FREE_HIDE) try { v = JSON.parse(localStorage.getItem(HR_KEY) || 'null'); } catch (e) {} v = v || B0.hrug || null;
      if (v) { hrug = v.p || null; if (v.c) state.hrugc = v.c; } }
    RUGC.forEach(c => $('fhg-' + c).addEventListener('click', () => { state.hrugc = c; applyLiving(); rugSave(); rugUI(); }));
    $('fhg-turn').addEventListener('click', () => { if (!hrug) hrug = { x: HRUG.position.x, z: HRUG.position.z, r: 0 }; hrug.r = hrug.r ? 0 : Math.PI / 2; applyLiving(); rugSave(); rugUI(); });
    $('fhg-0').addEventListener('click', () => { hrug = null; applyLiving(); rugSave(); rugUI(); }); rugUI();
    { const B0 = (mydef || BUILTIN[lay0]) || {}; let v; if (!window.FREE_HIDE) try { v = JSON.parse(localStorage.getItem(HS_KEY) || 'undefined'); } catch (e) {} hst = v !== undefined ? v : (B0.hst || null); }
    $('fst-turn').addEventListener('click', () => { if (!hst) hst = { x: hallYStool.position.x, z: hallYStool.position.z, r: 0 }; hst.r = hst.r ? 0 : Math.PI / 2; applyLiving(); stoolSave(); });
    $('fst-0').addEventListener('click', () => { hst = null; applyLiving(); stoolSave(); });
    const SH_KEY = 'c2free.sheer', SHS = ['none', 'open', 'shut', 'linen']; try { const v = localStorage.getItem(SH_KEY); if (SHS.includes(v)) state.sheer = v; } catch (e) {}
    SHS.forEach(v => $('sh-' + v).addEventListener('click', () => { state.sheer = v; try { localStorage.setItem(SH_KEY, v); } catch (e) {} if (cur && !dirty) { dirty = true; slotUI(); } applyLiving(); }));
    // the living room flipped or not (state.lmir: R the sofa on the right wall, L on the fibre wall), kept in this browser
    const LM_KEY = 'c2free.lmir'; try { const v = localStorage.getItem(LM_KEY); if (v === 'L' || v === 'R') state.lmir = v; } catch (e) {}
    ['R', 'L'].forEach(v => $('lm-' + v).addEventListener('click', () => { state.lmir = v; try { localStorage.setItem(LM_KEY, v); } catch (e) {} if (cur && !dirty) { dirty = true; slotUI(); } applyLiving(); }));
    SLOTS.forEach(s => { $('fs-o' + s).addEventListener('click', () => openSlot(s)); $('fs-s' + s).addEventListener('click', () => saveSlot(s)); }); slotUI();
    hook(hideOwn);
    // the trade pages (carpentry, lighting) build on this page with window.FREE_HIDE = true: no panel, the page as it
    // stands in its default layout (2026-10-23: 删除普通版，全部同步成Home-3d)
    // the room choices: the default set's, then this browser's default, then what was left here last (read last, so it wins)
    if (window.FREE_HIDE) { const base = Object.assign({}, (BUILTIN[lay0] || {}).opts); OPT_KEYS.forEach(k => { if (k in base) state[k] = base[k]; }); sane();
      const B0 = BUILTIN[lay0] || {}; if ('dine' in B0) dine = B0.dine || null; if (B0.dwall) state.dwall = B0.dwall; if (B0.dcount) state.dcount = B0.dcount; }
    if (!window.FREE_HIDE) { const base = Object.assign({}, (BUILTIN[lay0] || {}).opts, mydef && mydef.opts); let o = null; try { o = JSON.parse(localStorage.getItem(OPT_KEY) || 'null'); } catch (e) {}
      Object.assign(base, o || {}); OPT_KEYS.forEach(k => { if (k in base) state[k] = base[k]; }); sane(); hook(optSave); }
    // the room rows live in the right panel (2026-10-25): sofa side and sheer with the living room, the dining set with the dining
    // room, the hall rug and the stool with the entrance
    if (!window.FREE_HIDE) [['frmLmir', 'slotLiv'], ['frmWinSec', 'slotLiv'], ['frSheer', 'slotLiv'], ['frmDine', 'slotDine'], ['dnNote', 'slotDine'], ['frmRug', 'slotRug'], ['hgNote', 'slotRug'], ['frmStool', 'slotStool']]
      .forEach(([e, s]) => { if ($(e) && $(s)) $(s).appendChild($(e)); });
    tagLoop();
    // the trade pages: the user's default as it is (pieces shown and locked, no panel), not the page's old living set
    if (window.FREE_HIDE) { box.style.display = 'none'; const vf = document.getElementById('v-ftop'); if (vf) vf.style.display = 'none'; setOn(true); setLock(true); } else setOn(true);
  }
  return { init, pieces, add, load, select, setOn, openSlot, get on() { return on; } };
})();
