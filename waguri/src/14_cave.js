/* ===== V17 DUNGEON 1: GUA TIRAI AIR (di belakang air terjun) =====
   4 bilik bawah tanah (y ≈ -70): 🦇 Dewan Pintu · 💎 Bilik Kristal (teka-teki 3 kristal) · ⛏ Lorong Sempit · 🗿 Arena Kelembai Batu
   masuk/keluar dengan peralihan pudar · cahaya matahari dimalapkan · kamera dirapatkan · pintu batu terbuka bila 3 kristal menyala
   + Gua Kelawar (gua kecil rahsia di barat lembah) */
(function () {
  'use strict';
  const W = window.W17, T = THREE;
  if (!W) return;
  const CV = W.CV, Y = CV.y;
  const C = (W.cave = { lit: [0, 0, 0], gate: null, crystals: [] });
  const st = () => {
    const s = (GS.v17 = GS.v17 || {});
    s.cave = s.cave || { lit: [0, 0, 0], gate: 0, boss: 0, chest: 0 };
    return s.cave;
  };

  function rockTex() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    g.fillStyle = '#6d6a66';
    g.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 500; i++) {
      g.fillStyle = 'rgba(' + (Math.random() < 0.5 ? '255,255,255' : '0,0,0') + ',' + Math.random() * 0.12 + ')';
      g.fillRect(Math.random() * 128, Math.random() * 128, 2 + Math.random() * 7, 2 + Math.random() * 7);
    }
    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.repeat.set(4, 4);
    return t;
  }
  function build() {
    const tex = rockTex();
    const wm = new T.MeshStandardMaterial({ color: 0x8a8278, map: tex, roughness: 0.95, side: T.BackSide, flatShading: true });
    const fm = new T.MeshStandardMaterial({ color: 0x6f675c, map: tex, roughness: 1, flatShading: true });
    const grp = new T.Group();
    grp.visible = false;
    scene.add(grp);
    C.g = grp;
    /* kubah bilik (bergerigi) */
    CV.rooms.forEach((r, k) => {
      const g = new T.SphereGeometry(1, 20, 14);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), z = p.getZ(i), n = 1 + 0.12 * Math.sin(x * 7 + k) * Math.cos(z * 6) + 0.08 * Math.sin(y * 9);
        p.setXYZ(i, x * n, Math.max(-0.15, y) * n, z * n);
      }
      g.computeVertexNormals();
      const m = new T.Mesh(g, wm);
      m.scale.set(r[2] + 1.5, k === 3 ? 11 : 6.5, r[3] + 1.5);
      m.position.set(r[0], Y, r[1]);
      grp.add(m);
      /* lantai */
      const fg = new T.CircleGeometry(1, 28);
      fg.rotateX(-Math.PI / 2);
      const fp = fg.attributes.position;
      for (let i = 0; i < fp.count; i++) {
        const x = r[0] + fp.getX(i) * (r[2] + 1.2), z = r[1] + fp.getZ(i) * (r[3] + 1.2);
        fp.setXYZ(i, x, Math.max(Y - 0.2, W.caveFloor(x, z) > -1e8 ? W.caveFloor(x, z) : Y) - 0.02, z);
      }
      fg.computeVertexNormals();
      grp.add(new T.Mesh(fg, fm));
      /* stalaktit */
      const nS = k === 3 ? 26 : 10;
      for (let i = 0; i < nS; i++) {
        const a = Math.random() * 6.283, rr = Math.sqrt(Math.random()) * 0.85, L = 0.8 + Math.random() * 2.4;
        const s = new T.Mesh(new T.ConeGeometry(0.25 + Math.random() * 0.3, L, 6), fm);
        s.rotation.x = Math.PI;
        s.position.set(r[0] + Math.cos(a) * rr * r[2], Y + (k === 3 ? 10 : 5.8) * (1 - rr * rr * 0.6) - L / 2, r[1] + Math.sin(a) * rr * r[3]);
        grp.add(s);
      }
    });
    /* terowong */
    const pts = CV.tun.map((p) => new T.Vector3(p[0], Y + 1.4, p[1]));
    const tube = new T.TubeGeometry(new T.CatmullRomCurve3(pts), 60, 2.9, 10, false);
    grp.add(new T.Mesh(tube, wm));
    const tf = [];
    for (let i = 0; i < CV.T.n; i++) tf.push(CV.T.X[i], CV.T.Z[i]);
    for (let i = 0; i < CV.T.n - 1; i++) {
      const [tx, tz] = CV.T.tan(i), x = CV.T.X[i], z = CV.T.Z[i], L = Math.hypot(CV.T.X[i + 1] - x, CV.T.Z[i + 1] - z) + 0.1;
      const s = new T.Mesh(new T.BoxGeometry(5, 0.2, L), fm);
      s.position.set((x + CV.T.X[i + 1]) / 2, Y - 0.05, (z + CV.T.Z[i + 1]) / 2);
      s.rotation.y = Math.atan2(tx, tz);
      grp.add(s);
    }
    /* kristal bercahaya (teka-teki) di Bilik Kristal */
    const r1 = CV.rooms[1];
    C.cmOff = new T.MeshStandardMaterial({ color: 0x6b7c99, emissive: 0x102040, emissiveIntensity: 0.4, roughness: 0.3, metalness: 0.2 });
    C.cmOn = new T.MeshStandardMaterial({ color: 0x9be7ff, emissive: 0x38bdf8, emissiveIntensity: 1.6, roughness: 0.2 });
    [[-6, -3], [6, -4], [0, 6]].forEach(([dx, dz], i) => {
      const g = new T.Group();
      for (let k = 0; k < 4; k++) {
        const c = new T.Mesh(new T.OctahedronGeometry(0.5 + k * 0.12, 0), C.cmOff);
        c.scale.set(0.6, 2.2 - k * 0.3, 0.6);
        c.position.set(Math.cos(k * 2) * 0.4, 1 + k * 0.15, Math.sin(k * 2) * 0.4);
        c.rotation.z = (k - 1.5) * 0.25;
        g.add(c);
      }
      const x = r1[0] + dx, z = r1[1] + dz;
      g.position.set(x, W.caveFloor(x, z), z);
      grp.add(g);
      C.crystals.push({ g, x, z, i });
      ST.push({
        x, z, r: 2.4,
        v: () => W.inCave && !st().lit[i],
        lb: () => '💎 Sentuh kristal ' + (i + 1),
        f() {
          st().lit[i] = 1;
          syncCrystals();
          const n = st().lit.filter(Boolean).length;
          tip(n < 3 ? '💎 Kristal menyala (' + n + '/3)… gema bergetar di lorong' : '💎 Ketiga-tiga kristal menyala! Pintu batu terbuka…');
          if (n === 3) openGate();
          if (W.ev) W.ev('crystal', n);
        }
      });
    });
    /* kristal hiasan (ungu) di dinding semua bilik */
    const deco = new T.MeshStandardMaterial({ color: 0xc4b5fd, emissive: 0x7c3aed, emissiveIntensity: 1.1, roughness: 0.2 });
    CV.rooms.forEach((r, k) => {
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * 6.283 + k, x = r[0] + Math.cos(a) * r[2] * 0.95, z = r[1] + Math.sin(a) * r[3] * 0.95;
        const c = new T.Mesh(new T.OctahedronGeometry(0.35 + Math.random() * 0.3, 0), deco);
        c.scale.y = 2;
        c.position.set(x, Y + 0.5 + Math.random() * 2, z);
        c.rotation.set(Math.random(), Math.random(), (Math.random() - 0.5) * 1.2);
        grp.add(c);
      }
    });
    /* pintu batu antara lorong sempit & arena */
    const gp = CV.tun[CV.tun.length - 2];
    const gate = new T.Mesh(new T.BoxGeometry(6.5, 6, 1.6), new T.MeshStandardMaterial({ color: 0x5b5650, map: tex, roughness: 1, flatShading: true }));
    const [ga, gb] = [CV.tun[CV.tun.length - 3], gp];
    gate.position.set(gb[0], Y + 3, gb[1]);
    gate.rotation.y = Math.atan2(gb[0] - ga[0], gb[1] - ga[1]);
    grp.add(gate);
    C.gate = gate;
    C.gateCol = { x: gb[0], z: gb[1], r: 2.6 };
    /* obor (cahaya bergerak ke obor terdekat) */
    C.L1 = new T.PointLight(0xffa64a, 0, 18, 2);
    C.L2 = new T.PointLight(0x7dd3fc, 0, 22, 2);
    scene.add(C.L1, C.L2);
    C.torch = [];
    const tm = G(0xffb347, 0xff7a00, 1.2);
    CV.rooms.forEach((r, k) => {
      [0, 3.14].forEach((a) => {
        const x = r[0] + Math.cos(a + k) * (r[2] - 0.6), z = r[1] + Math.sin(a + k) * (r[3] - 0.6);
        const t = new T.Mesh(new T.ConeGeometry(0.18, 0.5, 6), tm);
        t.position.set(x, Y + 2.2, z);
        grp.add(t);
        const s = new T.Mesh(new T.CylinderGeometry(0.05, 0.06, 1.2, 5), S(0x3b2a1a));
        s.position.set(x, Y + 1.5, z);
        grp.add(s);
        C.torch.push([x, Y + 2.4, z]);
      });
    });
    /* peti harta di arena (selepas bos) */
    const ch = new T.Group();
    const cw = S(0x8a5a2b), cg = S(0xd4a537);
    add(ch, B(1.3, 0.7, 0.9), cw, 0, 0.35, 0);
    add(ch, B(1.35, 0.3, 0.95), cg, 0, 0.75, 0);
    const ar = CV.rooms[3];
    ch.position.set(ar[0] - 5, W.caveFloor(ar[0] - 5, ar[1] - 6), ar[1] - 6);
    ch.visible = false;
    grp.add(ch);
    C.chest = ch;
    /* pintu masuk di luar (lubang gelap di kaki tebing) */
    const ex = new T.Group();
    const arch = new T.Mesh(new T.TorusGeometry(2.4, 0.7, 6, 12, Math.PI), S(0x6b6660));
    arch.position.y = 0.2;
    ex.add(arch);
    const hole = new T.Mesh(new T.CircleGeometry(2.2, 16, 0, Math.PI), new T.MeshBasicMaterial({ color: 0x050608 }));
    hole.position.set(0, 0.2, -0.3);
    ex.add(hole);
    const [cx, cz] = W.F.cave;
    ex.position.set(cx, W.H(cx, cz) - 0.1, cz - 2.2);
    scene.add(ex);
    W.lab('Gua Tirai Air', cx, W.H(cx, cz) + 4.6, cz - 1, '🕳', 0.85);
    W.addDS('🕳', 'Gua Tirai Air (dungeon)', cx + 2, cz + 3, Math.PI);
    ST.push({ x: cx, z: cz, r: 3.4, v: () => !W.inCave, lb: () => '🕳 Masuk Gua Tirai Air' + (st().boss ? ' (✔ ditewaskan)' : ' · Lv 18+'), f: () => C.enter() });
    const e0 = CV.tun[0];
    ST.push({ x: e0[0], z: e0[1] + 1.5, r: 3, v: () => W.inCave, lb: () => '☀️ Keluar gua', f: () => C.exit() });
    ST.push({ x: ch.position.x, z: ch.position.z, r: 2.6, v: () => W.inCave && st().boss && !st().chest, lb: () => '🎁 Buka peti Kelembai', f: () => {
      st().chest = 1;
      if (W.loot) W.loot('peti_gua');
      ch.children[1].rotation.x = -1;
    } });
    syncCrystals();
    if (st().gate) openGate(true);
    if (st().boss) ch.visible = true;
    gKelawar();
  }
  function syncCrystals() {
    C.crystals.forEach((c) => c.g.children.forEach((m) => (m.material = st().lit[c.i] ? C.cmOn : C.cmOff)));
  }
  function openGate(quiet) {
    st().gate = 1;
    if (C.gate) C.gate.visible = false;
    if (!quiet) R14().float && R14().float('🗿 Pintu batu runtuh!', 'c');
  }
  C.gateClosed = () => !st().gate;
  const R14 = () => window.RPG14 || {};
  C.st = st;

  /* ---------- masuk / keluar ---------- */
  const fade = document.createElement('div');
  fade.style.cssText = 'position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;transition:opacity .45s;z-index:30';
  document.body.appendChild(fade);
  let cd0 = 6.5;
  function tpTo(x, z, r, inside) {
    fade.style.opacity = 1;
    setTimeout(() => {
      W.inCave = inside;
      C.g.visible = inside;
      P.x = x;
      P.z = z;
      P.y = gY2(x, z);
      try {
        rot = r;
        snap();
      } catch (e) {}
      try {
        if (inside) {
          cd0 = cd;
          cd = Math.min(cd, 4.2);
        } else cd = cd0;
      } catch (e) {}
      if (W.wxHud) W.wxHud();
      setTimeout(() => (fade.style.opacity = 0), 120);
    }, 460);
  }
  C.enter = () => {
    const L = window.RPG14 ? RPG14.lv() : 99;
    if (L < 18 && !C.warned) {
      C.warned = 1;
      tip('⚠️ Gua ini berbahaya (disyorkan Lv 18+). Tekan sekali lagi untuk masuk juga.');
      return;
    }
    const e = CV.tun[0];
    tpTo(e[0], e[1] + 1.2, Math.PI, true);
    tip('🕳 Gua Tirai Air… bunyi air terjun bergema. Hati-hati.');
    if (W.ev) W.ev('enter_cave', 1);
  };
  C.exit = () => {
    const [cx, cz] = W.F.cave;
    tpTo(cx + 1.5, cz + 3.5, 0, false);
  };
  /* kamera & cahaya obor ketika dalam gua */
  W.tick(() => {
    if (!C.g) return;
    if (!W.inCave) {
      C.L1.intensity = C.L2.intensity = 0;
      return;
    }
    let best = null, bd = 1e9, b2 = null, bd2 = 1e9;
    C.torch.forEach((t) => {
      const d = Math.hypot(t[0] - P.x, t[2] - P.z);
      if (d < bd) {
        b2 = best;
        bd2 = bd;
        best = t;
        bd = d;
      } else if (d < bd2) {
        b2 = t;
        bd2 = d;
      }
    });
    C.L1.position.set(best[0], best[1], best[2]);
    C.L1.intensity = 2.2 + Math.sin(W.now / 90) * 0.25;
    if (b2) C.L2.position.set(P.x, P.y + 2.6, P.z);
    C.L2.intensity = 0.7;
    const c = camera.position, f = W.caveFloor(c.x, c.z);
    const top = f > -1e8 ? Y + 5 : Y + 3.4;
    if (c.y > top) c.y = top;
    if (c.y < Y + 0.6) c.y = Y + 0.6;
    /* pintu batu menghalang */
    if (C.gateClosed()) {
      const g = C.gateCol, d = Math.hypot(P.x - g.x, P.z - g.z);
      if (d < g.r) {
        const k = g.r / (d || 1);
        P.x = g.x + (P.x - g.x) * k;
        P.z = g.z + (P.z - g.z) * k;
        if (!C.gT || W.now - C.gT > 4000) {
          C.gT = W.now;
          tip('🗿 Pintu batu berukir… tiga lekuk kristal kelihatan pada permukaannya.');
        }
      }
    }
  });

  /* ---------- Gua Kelawar (rahsia, tanpa teleport: ceruk di lereng bukit) ---------- */
  function gKelawar() {
    const [x, z] = W.F.gkel, y = W.H(x, z), g = new T.Group();
    const arch = new T.Mesh(new T.TorusGeometry(2, 0.8, 6, 10, Math.PI), S(0x5d5a55));
    g.add(arch);
    const back = new T.Mesh(new T.SphereGeometry(2.6, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshStandardMaterial({ color: 0x2a2826, side: T.BackSide }));
    back.scale.set(1, 1.1, 1.3);
    back.position.z = -1.6;
    g.add(back);
    g.position.set(x, y - 0.2, z);
    g.rotation.y = Math.PI / 2;
    scene.add(g);
    W.addCol({ x: x - 3.2, z, r: 1.2 });
    /* kelawar beterbangan (sprite) */
    const cv = document.createElement('canvas');
    cv.width = cv.height = 64;
    const c2 = cv.getContext('2d');
    c2.font = '48px serif';
    c2.textAlign = 'center';
    c2.textBaseline = 'middle';
    c2.fillText('🦇', 32, 34);
    const sm = new T.SpriteMaterial({ map: new T.CanvasTexture(cv), transparent: true });
    const bats = [];
    for (let i = 0; i < 6; i++) {
      const s = new T.Sprite(sm);
      s.scale.setScalar(0.7);
      scene.add(s);
      bats.push(s);
    }
    W.tick(() => {
      const near = Math.hypot(P.x - x, P.z - z) < 90 && !W.inCave, t = W.now / 1000;
      bats.forEach((s, i) => {
        s.visible = near && (hourNow() > 18.5 || hourNow() < 6.5 || Math.hypot(P.x - x, P.z - z) < 14);
        s.position.set(x + Math.sin(t * 1.3 + i * 1.7) * (3 + i * 0.6), y + 2.5 + Math.sin(t * 2.1 + i) * 1.4, z + Math.cos(t * 1.1 + i * 2.1) * (3 + i * 0.5));
      });
    });
    W.lab('Gua Kelawar', x, y + 4, z, '🦇', 0.7);
  }
  const hourNow = () => (6 + (GS.t || 0) / 75) % 24;
  W.hour = hourNow;

  when14(() => W.villOK && typeof ST !== 'undefined', build);
})();
