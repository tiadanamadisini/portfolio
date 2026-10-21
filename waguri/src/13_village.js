/* ===== V17 DUNIA (4): KAMPUNG TIMUR — "kampung di atas air terjun"
   identiti: rumah panggung kayu gelap · atap genting merah-bata & atap nipah · tebar layar berukir · tanglung kuning ·
   pagar buluh · KINCIR AIR di sungai · Pokok Beringin Tua di dataran · wau di langit · jeti Tasik Biru · menara tinjau
   semua bangunan statik digabung (W8.merge) → sedikit draw call; tingkap bercahaya = satu mesh glow (ikut malam) ===== */
(function () {
  'use strict';
  const W = window.W17, T = THREE;
  if (!W) return;
  const F = W.F, V = F.village;
  W.HOUSES = [];
  W.SPOTS = {}; /* titik kerja/rehat untuk NPC */
  const winQ = []; /* [x,y,z, ax,az, w,h] kuad tingkap → mesh glow */

  const wood = 0x6a4428, wood2 = 0x4a2e18, wood3 = 0x8a5a2b, roofR = 0xa84a2a, roofN = 0x8b7a4a, wall = 0xd9b98a, wall2 = 0xc79c68;
  const mat = (c) => S(c);
  function box(g, w, h, d, c, x, y, z, ry, rx, rz) {
    const m = add(g, B(w, h, d), mat(c), x, y, z);
    if (ry) m.rotation.y = ry;
    if (rx) m.rotation.x = rx;
    if (rz) m.rotation.z = rz;
    return m;
  }
  function tri(g, w, h, d, c, x, y, z) {
    /* muka gable segitiga (tebar layar) */
    const s = new T.Shape();
    s.moveTo(-w / 2, 0);
    s.lineTo(w / 2, 0);
    s.lineTo(0, h);
    s.lineTo(-w / 2, 0);
    const ge = new T.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
    ge.translate(0, 0, -d / 2);
    const m = new T.Mesh(ge, mat(c));
    m.position.set(x, y, z);
    m.castShadow = m.receiveShadow = true;
    g.add(m);
    return m;
  }
  function roof(g, w, d, h, y, c, over) {
    /* bumbung pelana: dua papan condong + rabung + tebar layar */
    const o = over || 0.7, half = d / 2 + o, L = Math.hypot(half, h), a = Math.atan2(h, half);
    [-1, 1].forEach((s) => box(g, w + o * 2, 0.16, L, c, 0, y + h / 2, (s * half) / 2, 0, s * a));
    box(g, w + o * 2 + 0.1, 0.22, 0.26, wood2, 0, y + h + 0.05, 0);
    [-1, 1].forEach((s) => {
      const t = tri(g, d + 0.2, h, 0.12, wall2, s * (w / 2 + 0.02), y, 0);
      t.rotation.y = Math.PI / 2;
      /* ukiran tebar layar: jalur kayu silang */
      box(g, 0.08, h * 0.7, 0.08, wood2, s * (w / 2 + 0.1), y + h * 0.38, 0);
      box(g, 0.1, 0.1, d * 0.6, wood2, s * (w / 2 + 0.1), y + h * 0.22, 0);
      /* kepala cicak (hujung rabung) */
      box(g, 0.12, 0.5, 0.12, wood2, s * (w / 2 + o), y + h + 0.3, 0, 0, 0, s * 0.4);
    });
  }
  function win(g, x, y, z, ax, az, ww, hh) {
    /* bingkai kayu (digabung) + kuad kaca bercahaya (mesh glow berasingan) */
    box(g, ax ? 0.1 : ww + 0.2, hh + 0.2, ax ? ww + 0.2 : 0.1, wood2, x, y, z);
    winQ.push([g, x, y, z, ax, az, ww, hh]);
  }
  /* rumah panggung */
  function house(o) {
    const g = new T.Group(), w = o.w || 6.4, d = o.d || 5.2, fy = 1.5, wh = 2.5, rc = o.nipah ? roofN : roofR;
    /* tiang */
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) box(g, 0.24, fy + 0.2, 0.24, wood2, -w / 2 + 0.3 + (i * (w - 0.6)) / 2, (fy + 0.2) / 2 - 0.2, -d / 2 + 0.3 + (j * (d - 0.6)) / 2);
    /* lantai & dinding */
    box(g, w + 0.3, 0.2, d + 0.3, wood, 0, fy, 0);
    box(g, w, wh, 0.14, o.wc || wall, 0, fy + wh / 2, -d / 2);
    box(g, 0.14, wh, d, o.wc || wall, -w / 2, fy + wh / 2, 0);
    box(g, 0.14, wh, d, o.wc || wall, w / 2, fy + wh / 2, 0);
    box(g, w * 0.32, wh, 0.14, o.wc || wall, -w * 0.34, fy + wh / 2, d / 2);
    box(g, w * 0.32, wh, 0.14, o.wc || wall, w * 0.34, fy + wh / 2, d / 2);
    box(g, w * 0.36, 0.6, 0.14, o.wc || wall, 0, fy + wh - 0.3, d / 2);
    box(g, w * 0.34, wh - 0.6, 0.06, wood2, 0, fy + (wh - 0.6) / 2, d / 2 - 0.05); /* pintu */
    /* jalur kayu (rangka) */
    [-w / 2, w / 2].forEach((x) => [-d / 2, d / 2].forEach((z) => box(g, 0.2, wh + 0.1, 0.2, wood2, x, fy + wh / 2, z)));
    box(g, w + 0.2, 0.14, 0.2, wood2, 0, fy + wh, d / 2);
    box(g, w + 0.2, 0.14, 0.2, wood2, 0, fy + wh, -d / 2);
    /* serambi + tangga */
    box(g, w * 0.7, 0.16, 1.5, wood3, 0, fy - 0.35, d / 2 + 0.85);
    for (let k = 0; k < 4; k++) box(g, 1.2, 0.1, 0.36, wood3, 0, 0.15 + k * 0.32, d / 2 + 1.9 + (3 - k) * 0.32);
    [-0.62, 0.62].forEach((x) => box(g, 0.08, 1.8, 0.08, wood2, x, 0.9, d / 2 + 2.2, 0, 0.5));
    /* pagar serambi */
    [-1, 1].forEach((s) => box(g, 0.06, 0.6, 1.4, wood2, s * w * 0.35, fy - 0.05, d / 2 + 0.85));
    /* tingkap */
    win(g, -w / 2 - 0.08, fy + 1.35, -d * 0.18, 1, 0, 1.0, 0.9);
    win(g, w / 2 + 0.08, fy + 1.35, d * 0.18, 1, 0, 1.0, 0.9);
    win(g, -w * 0.34, fy + 1.35, d / 2 + 0.08, 0, 1, 1.0, 0.9);
    win(g, w * 0.34, fy + 1.35, d / 2 + 0.08, 0, 1, 1.0, 0.9);
    roof(g, w, d, o.nipah ? 2.6 : 2.2, fy + wh, rc);
    /* pasu bunga & tempayan */
    add(g, new T.CylinderGeometry(0.32, 0.26, 0.6, 8), S(0x9a5b3a), w / 2 - 0.4, 0.3, d / 2 + 2.6);
    add(g, new T.SphereGeometry(0.3, 8, 6), S(o.fl || 0xff7aa8), w / 2 - 0.4, 0.75, d / 2 + 2.6);
    return place(g, o, Math.max(w, d) / 2 + 0.2, [w, d + 1.4]);
  }
  function place(g, o, r, fp) {
    const y = W.H(o.x, o.z);
    g.position.set(o.x, y, o.z);
    g.rotation.y = o.ry || 0;
    scene.add(g);
    /* tingkap → koordinat dunia */
    g.updateMatrixWorld(true);
    W8.merge(g);
    /* pelanggaran: segi empat ikut putaran (0/90/180/270 sahaja) */
    if (fp) {
      const sw = Math.abs(Math.sin(o.ry || 0)) > 0.5, hx = (sw ? fp[1] : fp[0]) / 2, hz = (sw ? fp[0] : fp[1]) / 2;
      const rc = [o.x - hx, o.z - hz, o.x + hx, o.z + hz];
      W.addCol(rc);
      (W.FOOT = W.FOOT || []).push(rc);
    }
    const ry = o.ry || 0, fd = (o.door || 3.4) + (o.d || 5.2) / 2;
    const door = [o.x + Math.sin(ry) * fd, o.z + Math.cos(ry) * fd];
    const h = { id: o.id, n: o.n, x: o.x, z: o.z, ry, door, y, g, type: o.type || 'house' };
    W.HOUSES.push(h);
    return h;
  }
  W.inHouse = (x, z) => (W.FOOT || []).some((r) => x > r[0] - 1 && x < r[2] + 1 && z > r[1] - 1 && z < r[3] + 1);

  /* ---------- bangunan khas ---------- */
  function balai(o) {
    const g = new T.Group(), w = 11, d = 7.5, fy = 1.1;
    for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) box(g, 0.3, fy + 3.2, 0.3, wood2, -w / 2 + 0.3 + (i * (w - 0.6)) / 4, (fy + 3.2) / 2 - 0.2, -d / 2 + 0.3 + (j * (d - 0.6)) / 2);
    box(g, w + 0.4, 0.24, d + 0.4, wood, 0, fy, 0);
    box(g, w, 0.9, 0.12, wood3, 0, fy + 0.5, -d / 2);
    [-1, 1].forEach((s) => box(g, 0.12, 0.9, d, wood3, (s * w) / 2, fy + 0.5, 0));
    for (let k = 0; k < 3; k++) box(g, 3.2, 0.12, 0.4, wood3, 0, 0.2 + k * 0.3, d / 2 + 0.8 + (2 - k) * 0.4);
    roof(g, w, d, 3, fy + 3.1, roofR, 1);
    /* papan nama */
    box(g, 3.4, 0.7, 0.1, 0x2e5a3a, 0, fy + 3.6, d / 2 + 0.75);
    box(g, 1.6, 0.6, 0.5, wood, -3, fy + 0.4, 1); /* bangku */
    box(g, 1.6, 0.6, 0.5, wood, 3, fy + 0.4, 1);
    const h = place(g, o, 6.5, [w + 0.4, d + 0.4]);
    W.lab('Balai Raya Kampung Timur', o.x, h.y + 8.2, o.z, '🏛');
    return h;
  }
  function kedai(o, awn, label, ic) {
    const g = new T.Group(), w = 5.5, d = 4.4;
    box(g, w, 2.8, d, o.wc || wall2, 0, 1.4, 0);
    box(g, w + 0.2, 0.2, d + 0.2, wood, 0, 0.1, 0);
    box(g, w * 0.7, 1.1, 0.1, 0x2a1a10, 0, 1.6, d / 2 + 0.02);
    box(g, w * 0.75, 0.9, 0.9, wood3, 0, 0.45, d / 2 + 0.7); /* kaunter */
    /* kanopi berjalur */
    for (let i = 0; i < 6; i++) box(g, w / 6, 0.08, 1.8, i % 2 ? 0xffffff : awn, -w / 2 + w / 12 + (i * w) / 6, 2.75, d / 2 + 0.8, 0, -0.32);
    roof(g, w, d, 1.6, 2.8, roofR);
    win(g, -w / 2 - 0.06, 1.7, 0, 1, 0, 0.9, 0.8);
    win(g, w / 2 + 0.06, 1.7, 0, 1, 0, 0.9, 0.8);
    const h = place(g, o, 3.8, [w, d + 1.6]);
    h.type = o.type;
    W.lab(label, o.x, h.y + 5.4, o.z, ic);
    return h;
  }
  function besi(o) {
    const g = new T.Group();
    for (const [x, z] of [[-2.4, -2], [2.4, -2], [-2.4, 2], [2.4, 2]]) box(g, 0.26, 3, 0.26, wood2, x, 1.5, z);
    box(g, 5.4, 0.15, 4.6, wood, 0, 0.08, 0);
    roof(g, 5, 4.2, 1.5, 3, 0x5a5048);
    box(g, 1.5, 1.1, 1.2, 0x5b5654, -1.2, 0.55, -1.2); /* relau */
    box(g, 0.6, 1.6, 0.6, 0x5b5654, -1.2, 2.1, -1.4);
    add(g, new T.CylinderGeometry(0.35, 0.45, 0.6, 8), S(0x3a3a3a), 1, 0.55, 0.6); /* landasan */
    box(g, 0.9, 0.2, 0.35, 0x2a2a2a, 1, 0.92, 0.6);
    const h = place(g, o, 3.2, [5.4, 4.6]);
    /* bara relau bercahaya */
    const em = add(scene, B(1.0, 0.4, 0.1), G(0xff7a1a, 0xff4a00, 1.2), 0, 0, 0, false);
    const ry = o.ry || 0, lx = -1.2, lz = -0.58;
    em.position.set(o.x + lx * Math.cos(ry) + lz * Math.sin(ry), h.y + 0.6, o.z - lx * Math.sin(ry) + lz * Math.cos(ry));
    em.rotation.y = ry;
    const pl = new T.PointLight(0xff8a2a, 0.9, 9, 2);
    pl.position.copy(em.position).add(new T.Vector3(0, 0.8, 0.6));
    scene.add(pl);
    W.forgeL = pl;
    W.lab('Tukang Besi Pak Tahir', o.x, h.y + 5.6, o.z, '⚒️');
    h.type = 'besi';
    return h;
  }
  function beringin(x, z) {
    /* Pokok Beringin Tua — tanda tempat dataran */
    const g = new T.Group(), y = W.H(x, z);
    add(g, new T.CylinderGeometry(1.2, 1.8, 7, 9), S(0x5e4632), 0, 3.5, 0);
    for (let i = 0; i < 10; i++) {
      const a = i * 0.63, r = 1.4 + (i % 3) * 0.6;
      const rt = add(g, new T.CylinderGeometry(0.08, 0.14, 6.5, 4), S(0x6b5440), Math.cos(a) * r, 3.25, Math.sin(a) * r);
      rt.rotation.z = Math.cos(a) * 0.12;
    }
    const lv = [0x2f7a2f, 0x3a8834, 0x286b2a, 0x34802f, 0x418f39];
    for (let i = 0; i < 9; i++) {
      const a = i * 0.7;
      add(g, new T.IcosahedronGeometry(3 + (i % 3) * 0.6, W.q >= 3 ? 1 : 0), S(lv[i % 5]), Math.cos(a) * 3.6, 8 + (i % 2) * 1.6, Math.sin(a) * 3.6);
    }
    add(g, new T.IcosahedronGeometry(4, W.q >= 3 ? 1 : 0), S(0x2f7a2f), 0, 10.5, 0);
    /* pelantar batu bulat */
    add(g, new T.CylinderGeometry(3.4, 3.6, 0.5, 18), S(0x9aa0a2), 0, 0.25, 0);
    g.position.set(x, y, z);
    scene.add(g);
    W8.merge(g);
    W.addCol({ x, z, r: 3.6 });
    W.lab('Pokok Beringin Tua', x, y + 15, z, '🌳');
  }
  function telaga(x, z) {
    const g = new T.Group();
    add(g, new T.CylinderGeometry(1, 1.05, 0.9, 14, 1, true), S(0x9aa0a2), 0, 0.45, 0);
    add(g, new T.CylinderGeometry(0.92, 0.92, 0.05, 14), S(0x2a5a8a), 0, 0.55, 0);
    [-0.95, 0.95].forEach((s) => box(g, 0.14, 2.2, 0.14, wood2, s, 1.1, 0));
    box(g, 2.2, 0.12, 0.14, wood2, 0, 2.15, 0);
    roof(g, 1.4, 1.6, 0.7, 2.2, roofR, 0.3);
    const y = W.H(x, z);
    g.position.set(x, y, z);
    scene.add(g);
    W8.merge(g);
    W.addCol({ x, z, r: 1.2 });
    W.SPOTS.telaga = [x + 1.6, z];
  }
  function lampu(x, z) {
    const g = new T.Group(), y = W.H(x, z);
    add(g, new T.CylinderGeometry(0.06, 0.08, 2.8, 6), S(0x3b2a1a), 0, 1.4, 0);
    box(g, 0.7, 0.07, 0.07, 0x3b2a1a, 0.3, 2.7, 0);
    g.position.set(x, y, z);
    scene.add(g);
    W8.merge(g);
    const b = add(scene, new T.CylinderGeometry(0.16, 0.2, 0.42, 8), G(0xffd27a, 0xffaa22, 0.7), x + 0.6, y + 2.42, z, false);
    W.lampB = W.lampB || [];
    W.lampB.push(b);
  }
  function kincir(x, z) {
    /* kincir air — berputar mengikut arus */
    const y = W.lvAt(W.RIV.q(x, z)), g = new T.Group(), w = new T.Group();
    for (let i = 0; i < 8; i++) {
      const sp = box(w, 0.14, 3.6, 0.14, wood3, 0, 0, 0);
      sp.rotation.z = (i / 8) * Math.PI;
      const pd = box(w, 0.9, 0.06, 0.7, wood, Math.cos((i / 8) * 6.283) * 1.8, Math.sin((i / 8) * 6.283) * 1.8, 0);
      pd.rotation.z = (i / 8) * 6.283;
    }
    add(w, new T.TorusGeometry(1.8, 0.07, 5, 24), S(wood2), 0, 0, 0.3);
    add(w, new T.TorusGeometry(1.8, 0.07, 5, 24), S(wood2), 0, 0, -0.3);
    W8.merge(w);
    g.add(w);
    [-0.6, 0.6].forEach((s) => box(g, 0.2, 2.6, 0.2, wood2, 0, -0.6, s));
    const q = W.RIV.q(x, z), [tx, tz] = W.RIV.tan(q.i);
    g.rotation.y = Math.atan2(tx, tz) + Math.PI / 2;
    g.position.set(x, y + 1.3, z);
    scene.add(g);
    W.tick((dt) => {
      if (Math.abs(P.x - x) < 160 && Math.abs(P.z - z) < 160) w.rotation.z -= dt * 0.9;
    });
    W.lab('Kincir Air', x, y + 5, z, '🎡', 0.8);
  }
  function menara(x, z) {
    const g = new T.Group(), hh = 7;
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => box(g, 0.22, hh, 0.22, wood2, a * 1.1, hh / 2, b * 1.1, 0, b * 0.04, -a * 0.04));
    box(g, 3, 0.2, 3, wood, 0, hh, 0);
    [-1, 1].forEach((s) => box(g, 3, 0.9, 0.1, wood3, 0, hh + 0.5, s * 1.45));
    [-1, 1].forEach((s) => box(g, 0.1, 0.9, 3, wood3, s * 1.45, hh + 0.5, 0));
    roof(g, 2.6, 2.6, 1.3, hh + 2.1, roofN, 0.4);
    [0, 1, 2].forEach((k) => [-1, 1].forEach((s) => box(g, 2.3, 0.08, 0.08, wood2, 0, 1.5 + k * 2, s * 1.1, 0, 0, s * 0.5)));
    const y = W.H(x, z);
    g.position.set(x, y, z);
    scene.add(g);
    W8.merge(g);
    W.addCol({ x, z, r: 1.5 });
    W.lab('Menara Tinjau', x, y + hh + 4.6, z, '🗼', 0.8);
    W.SPOTS.menara = [x, z + 2.4];
    W.SPOTS.menaraTop = [x, z, y + hh + 0.12];
  }
  function wakaf(x, z, ry, nm) {
    const g = new T.Group();
    [[-1.4, -1.4], [1.4, -1.4], [-1.4, 1.4], [1.4, 1.4]].forEach(([a, b]) => box(g, 0.18, 2.6, 0.18, wood2, a, 1.3, b));
    box(g, 3.2, 0.14, 3.2, wood3, 0, 0.55, 0);
    roof(g, 3, 3, 1.4, 2.6, roofR, 0.4);
    const y = W.H(x, z);
    g.position.set(x, y, z);
    g.rotation.y = ry || 0;
    scene.add(g);
    W8.merge(g);
    if (nm) W.lab(nm, x, y + 5.3, z, '⛩', 0.8);
    return [x, z, y];
  }
  function pagarBuluh(pts) {
    const g = new T.Group();
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, z0] = pts[i], [x1, z1] = pts[i + 1], L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.round(L / 0.5));
      for (let k = 0; k <= n; k++) {
        const x = x0 + ((x1 - x0) * k) / n, z = z0 + ((z1 - z0) * k) / n;
        add(g, new T.CylinderGeometry(0.05, 0.05, 1.1 + (k % 2) * 0.2, 5), S(0x9db35a), x, W.H(x, z) + 0.55, z, false);
      }
      const a = Math.atan2(x1 - x0, z1 - z0);
      [0.45, 0.85].forEach((h) => {
        const r = add(g, new T.CylinderGeometry(0.03, 0.03, L, 4), S(0x7f9a43), (x0 + x1) / 2, (W.H(x0, z0) + W.H(x1, z1)) / 2 + h, (z0 + z1) / 2, false);
        r.rotation.set(Math.PI / 2, 0, 0);
        r.rotation.order = 'YXZ';
        r.rotation.y = a;
      });
    }
    scene.add(g);
    W8.merge(g, false);
  }
  function jemuran(x, z, ry) {
    const g = new T.Group();
    [-1.6, 1.6].forEach((s) => box(g, 0.08, 1.8, 0.08, wood2, s, 0.9, 0));
    box(g, 3.3, 0.03, 0.03, 0xdddddd, 0, 1.75, 0);
    [0xe74c3c, 0x3498db, 0xf1c40f, 0xffffff, 0x9b59b6].forEach((c, i) => box(g, 0.45, 0.6, 0.03, c, -1.2 + i * 0.6, 1.42, 0));
    g.position.set(x, W.H(x, z), z);
    g.rotation.y = ry || 0;
    scene.add(g);
    W8.merge(g, false);
  }
  function jeti(x0, z0) {
    /* jeti kayu masuk ke Tasik Biru + sampan */
    const L = 11, ax = -1, az = 0.05, l = Math.hypot(ax, az), dx = ax / l, dz = az / l, cx = x0 + (dx * L) / 2, cz = z0 + (dz * L) / 2, y = W.F.lake[4] + 0.55;
    const g = new T.Group();
    g.rotation.y = Math.atan2(dx, dz);
    g.position.set(cx, y, cz);
    box(g, 2.4, 0.22, L, 0xb07d45, 0, 0, 0);
    for (let k = -L / 2 + 0.4; k < L / 2; k += 0.75) box(g, 2.45, 0.05, 0.07, 0x5e3f22, 0, 0.12, k);
    [-1, 1].forEach((s) => {
      for (let k = -L / 2 + 0.5; k <= L / 2; k += 2.5) box(g, 0.18, 2.2, 0.18, 0x5e3f22, s * 1.05, -0.9, k);
    });
    scene.add(g);
    W8.merge(g);
    W8.dk.push({ cx, cz, ax: dx, az: dz, L, W: 2.4, h0: y, h1: y, name: 'Jeti Tasik Biru' });
    /* sampan tertambat */
    const s = new T.Group();
    box(s, 0.9, 0.35, 3.2, 0x7a4a26, 0, 0, 0);
    box(s, 0.7, 0.08, 2.8, 0x5a3418, 0, 0.18, 0);
    [-1.5, 1.5].forEach((zz) => box(s, 0.5, 0.3, 0.5, 0x7a4a26, 0, 0.12, zz, 0, zz > 0 ? 0.4 : -0.4));
    s.position.set(cx + dz * 2.2, W.F.lake[4] + 0.12, cz - dx * 2.2);
    s.rotation.y = Math.atan2(dx, dz);
    scene.add(s);
    W8.merge(s);
    W.sampan = s;
    W.SPOTS.jeti = [x0 + dx * (L - 1), z0 + dz * (L - 1), Math.atan2(dx, dz)];
    W.lab('Jeti Tasik Biru', x0 + dx * 3, y + 3, z0 + dz * 3, '🎣', 0.8);
  }
  function wau() {
    /* wau bulan di langit kampung */
    const L = [];
    [[0xe63946, 0xf1c40f], [0x2a9d8f, 0xffffff]].forEach((c, i) => {
      const g = new T.Group();
      const s = new T.Shape();
      s.moveTo(0, 1.2);
      s.quadraticCurveTo(1.4, 0.6, 1.1, -0.1);
      s.quadraticCurveTo(0.4, 0.1, 0, -0.4);
      s.quadraticCurveTo(-0.4, 0.1, -1.1, -0.1);
      s.quadraticCurveTo(-1.4, 0.6, 0, 1.2);
      const m = new T.Mesh(new T.ShapeGeometry(s), new T.MeshBasicMaterial({ color: c[0], side: T.DoubleSide }));
      g.add(m);
      const t = new T.Mesh(new T.CircleGeometry(0.55, 16, Math.PI, Math.PI), new T.MeshBasicMaterial({ color: c[1], side: T.DoubleSide }));
      t.position.set(0, -0.35, 0.01);
      g.add(t);
      g.scale.setScalar(1.6);
      scene.add(g);
      L.push({ g, i });
    });
    W.tick(() => {
      const t = W.now / 1000;
      L.forEach(({ g, i }) => {
        g.position.set(V[0] + 12 * Math.sin(t * 0.13 + i * 2) + i * 18 - 9, F.plateau + 30 + 3 * Math.sin(t * 0.7 + i), V[1] + 8 * Math.cos(t * 0.11 + i));
        g.rotation.set(0.25 * Math.sin(t * 0.9 + i), t * 0.05 + i, 0.2 * Math.sin(t * 1.3 + i));
      });
    });
  }
  /* kuad tingkap → satu mesh glow (cerah waktu malam melalui senarai glow asal) */
  function windows() {
    const P3 = [], I = [], v = new T.Vector3();
    winQ.forEach(([g, x, y, z, ax, az, ww, hh]) => {
      const k = P3.length / 3, cs = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
      cs.forEach(([a, b]) => {
        v.set(x + (ax ? 0.03 * Math.sign(x) : (a * ww) / 2), y + (b * hh) / 2, z + (az ? 0.03 * Math.sign(z) : (a * ww) / 2));
        v.applyMatrix4(g.matrixWorld);
        P3.push(v.x, v.y, v.z);
      });
      I.push(k, k + 1, k + 2, k, k + 2, k + 3);
    });
    const ge = new T.BufferGeometry();
    ge.setAttribute('position', new T.Float32BufferAttribute(P3, 3));
    ge.setIndex(I);
    ge.computeVertexNormals();
    const m = G(0xffe29a, 0xffaa33, 0.55);
    m.side = T.DoubleSide;
    W.winMat = m;
    const me = new T.Mesh(ge, m);
    me.userData.v8 = 1;
    scene.add(me);
  }

  function build() {
    const vx = V[0], vz = V[1];
    /* dataran tengah */
    beringin(vx - 4, vz - 2);
    telaga(vx + 8, vz - 9);
    W.SPOTS.dataran = [vx + 2, vz + 4];
    /* bangunan awam */
    balai({ id: 'balai', x: vx - 18, z: vz + 12, ry: 0, n: 'Balai Raya' });
    W.SPOTS.balai = [vx - 18, vz + 19.5];
    kedai({ id: 'kedai', x: vx + 14, z: vz - 14, ry: Math.PI, type: 'kedai', wc: 0xe8d2a8 }, 0x2e86c1, 'Kedai Runcit Mak Senah', '🏪');
    W.SPOTS.kedai = [vx + 14, vz - 17.5];
    kedai({ id: 'tenun', x: vx - 22, z: vz - 16, ry: Math.PI, type: 'tenun', wc: 0xd9b0c8 }, 0x9b59b6, 'Rumah Tenun Songket', '🧵');
    W.SPOTS.tenun = [vx - 22, vz - 19.5];
    besi({ id: 'besi', x: vx + 24, z: vz - 2, ry: -Math.PI / 2 });
    W.SPOTS.besi = [vx + 20.5, vz - 2];
    /* rumah keluarga (16) — ditempatkan berprosedur (benih tetap): jauh dari jalan, sungai & bangunan lain, menghadap dataran */
    const NM = [
      'Rumah Tok Penghulu', 'Rumah Keluarga Pak Seman', 'Rumah Mak Senah', 'Rumah Pak Tahir', 'Rumah Cikgu Aminah', 'Rumah Bidan Kalsom',
      'Rumah Abang Daud', 'Rumah Nek Jah', 'Rumah Pak Ngah Jalil', 'Rumah Kak Tijah', 'Rumah Pak Usu Leman', 'Rumah Mat Jenin',
      'Rumah Kembar Haris & Harun', 'Rumah Tok Mudim', 'Rumah Wak Kasim', 'Pondok Pemburu Bujang'
    ];
    const FLC = [0x2f6fb0, 0xffd34d, 0xff7aa8, 0xffffff, 0xc79bff, 0xff9f43, 0xff5a6e, 0x7cc4ff];
    const taken = W.HOUSES.map((h) => [h.x, h.z, 9]).concat([[vx - 4, vz - 2, 9], [vx + 8, vz - 9, 4]]);
    const rr = W.rng(4242);
    let made = 0;
    for (let t = 0; t < 4000 && made < NM.length; t++) {
      const a = rr() * 6.283, r = 20 + rr() * 27, x = vx + Math.cos(a) * r, z = vz + Math.sin(a) * r;
      if (W.nearRoad(x, z, 7) || W.riverD(x, z) < 9 || taken.some((q) => Math.hypot(q[0] - x, q[1] - z) < q[2] + 6.5)) continue;
      if (Math.abs(W.H(x, z) - F.plateau) > 1.6) continue;
      const ry = Math.round(Math.atan2(vx - x, vz - z) / (Math.PI / 2)) * (Math.PI / 2);
      /* pintu & tangga tidak boleh menghadap jalan terlalu dekat */
      const id = 'r' + (made + 1);
      house({ id, n: NM[made], x, z, ry, nipah: made % 3 === 1, fl: FLC[made % FLC.length], w: made === 0 ? 7.4 : 6.4 });
      taken.push([x, z, 5]);
      made++;
    }
    W.houseN = made;
    /* lampu tanglung sepanjang jalan & dataran */
    for (let a = 0; a < 8; a++) lampu(vx - 2 + Math.cos((a / 8) * 6.283 + 0.3) * 11, vz - 1 + Math.sin((a / 8) * 6.283 + 0.3) * 11);
    const J = W.ROADS[0].R;
    for (let s = 40; s < J.L - 20; s += 34) {
      const [x, z, i] = J.at(s), [tx, tz] = J.tan(i);
      lampu(x - tz * 3.2, z + tx * 3.2);
    }
    /* pagar buluh keliling ladang */
    const fm = F.farm, fp = [];
    for (let k = 0; k <= 20; k++) {
      const a = (k / 20) * 6.283;
      if (a > 0.1 && a < 0.6) continue; /* pintu ladang (menghala ke kampung) */
      fp.push([fm[0] + Math.cos(a) * fm[2] * 1.32, fm[1] + Math.sin(a) * fm[3] * 1.32]);
    }
    pagarBuluh(fp);
    W.SPOTS.ladang = [fm[0] + 6, fm[1]];
    /* orang-orang sawah */
    {
      const g = new T.Group();
      add(g, new T.CylinderGeometry(0.06, 0.06, 2.4, 5), S(0x5a3a22), 0, 1.2, 0);
      box(g, 1.6, 0.1, 0.1, 0x5a3a22, 0, 1.8, 0);
      add(g, new T.SphereGeometry(0.25, 8, 8), S(0xf3d9a4), 0, 2.55, 0);
      add(g, new T.ConeGeometry(0.45, 0.4, 8), S(0xd8b85e), 0, 2.85, 0);
      box(g, 0.8, 0.8, 0.2, 0xc0392b, 0, 1.6, 0);
      g.position.set(fm[0] - 4, W.H(fm[0] - 4, fm[1] - 2), fm[1] - 2);
      scene.add(g);
      W8.merge(g);
    }
    jemuran(vx + 20, vz - 28, 0.3);
    jemuran(vx - 30, vz + 22, -0.4);
    /* kincir air & wakaf tebing (pandangan air terjun) */
    kincir(-293.5, -150);
    W.SPOTS.kincir = [-298, -150];
    W.SPOTS.wakaf = wakaf(-286, -84, 0.4, 'Wakaf Tebing');
    menara(vx - 34, vz + 50);
    jeti(-374, 19.5);
    wau();
    windows();
    /* papan tanda pintu masuk */
    W.lab('Celah Gunung → Kampung Timur', -222, W.H(-222, -14) + 4.5, -14, '🪧', 0.9);
    W.lab('Kampung Timur', vx + 36, F.plateau + 6.5, vz - 3, '🏘', 1.25);
    W.lab('Air Terjun Tirai Perak', F.fall[0] + 6, (W.fallInfo ? W.fallInfo.top[1] : 12) + 5, F.fall[1] + 8, '💦', 1.1);
    W.lab('Tasik Biru', F.lake[0], 7, F.lake[1], '💧', 1.2);
    W.lab('Padang Bunga', F.meadow[0], F.plateau + 6, F.meadow[1], '🌸', 1.1);
    W.lab('Ladang Padi Bukit', fm[0], F.plateau + 5, fm[1] - 18, '🌾', 0.9);
    /* destinasi peta / teleport */
    W.addDS('🏘', 'Kampung Timur', vx + 30, vz - 2, Math.PI / 2);
    W.addDS('💦', 'Air Terjun Tirai Perak', -286, -36, -Math.PI / 2);
    W.addDS('💧', 'Tasik Biru', -366, 18, -Math.PI / 2);
    W.addDS('🌸', 'Padang Bunga', F.meadow[0] + 20, F.meadow[1], -Math.PI / 2);
    W.addDS('🪧', 'Celah Gunung', -226, -15, -Math.PI / 2);
    W.villOK = 1;
  }
  when14(() => W.terOK && W.waterOK && typeof DS !== 'undefined' && W8.merge, build);
})();
