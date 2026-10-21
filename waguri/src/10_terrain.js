/* ===== V17 DUNIA (1): terrain Lembah Timur — ketulan distrim (world streaming) · 2 LOD · skirt · normal analitik =====
   · jaring lama dalam kawasan ini dibuang (indeks segitiga) → tiada z-fighting
   · bahan terrain DIKONGSI dengan W8.ter → semua gaya grafik lama (anime / UE5 FX) terpakai sama
   · warna bucu: rumput, hutan, batu cerun, SALJI puncak, pasir tasik, lumpur sungai, tanah jalan */
(function () {
  'use strict';
  const W = window.W17, T = THREE;
  if (!W) return;
  const sm = W.sm, lp = W.lp;
  W.chunks = [];
  W.onTick = [];
  W.tick = (f) => W.onTick.push(f);
  /* rng berbenih (dunia sama setiap kali dimuat) */
  W.rng = (seed) => {
    let s = (seed | 0) % 2147483647 || 1;
    if (s < 0) s += 2147483646;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  };
  /* label nama tempat (sprite) */
  W.lab = (t, x, y, z, ic, sc) => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 96;
    const g = c.getContext('2d'), txt = (ic ? ic + ' ' : '') + t;
    g.font = '800 40px "Plus Jakarta Sans",system-ui,sans-serif';
    const w = Math.min(500, g.measureText(txt).width + 44);
    g.fillStyle = 'rgba(28,18,8,.78)';
    const x0 = (512 - w) / 2;
    g.beginPath();
    g.moveTo(x0 + 22, 14);
    g.arcTo(x0 + w, 14, x0 + w, 82, 22);
    g.arcTo(x0 + w, 82, x0, 82, 22);
    g.arcTo(x0, 82, x0, 14, 22);
    g.arcTo(x0, 14, x0 + w, 14, 22);
    g.fill();
    g.fillStyle = '#fde68a';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(txt, 256, 50);
    const tx = new T.CanvasTexture(c);
    tx.encoding = T.sRGBEncoding;
    const s = new T.Sprite(new T.SpriteMaterial({ map: tx, transparent: true }));
    const k = sc || 1;
    s.scale.set(4.6 * k, 0.86 * k, 1);
    s.position.set(x, y, z);
    scene.add(s);
    return s;
  };
  /* tambah destinasi peta / teleport (format asal DS: [ikon, nama, x, z, arah]) */
  W.addDS = (ic, n, x, z, r) => {
    try {
      if (typeof DS !== 'undefined' && !DS.some((d) => d[1] === n)) DS.push([ic, n, x, z, r || 0]);
    } catch (e) {}
  };
  /* pelanggaran: senarai berdekatan pemain digabung ke OB.some (OB lama tidak dibesarkan → tiada kos O(n) tambahan) */
  W.col = new Map();
  W.colNear = [];
  const ck = (x, z) => Math.floor(x / 8) * 4099 + Math.floor(z / 8);
  W.addCol = (o) => {
    const x = o.x != null ? o.x : (o[0] + o[2]) / 2, z = o.z != null ? o.z : (o[1] + o[3]) / 2, r = o.r || Math.max(o[2] - o[0], o[3] - o[1]) / 2 + 1;
    for (let a = Math.floor((x - r) / 8); a <= Math.floor((x + r) / 8); a++)
      for (let b = Math.floor((z - r) / 8); b <= Math.floor((z + r) / 8); b++) {
        const k = a * 4099 + b;
        let l = W.col.get(k);
        if (!l) W.col.set(k, (l = []));
        l.push(o);
      }
    if (W.colDirty) W.colDirty();
  };
  W.delCol = (o) => W.col.forEach((l) => {
    const i = l.indexOf(o);
    if (i >= 0) l.splice(i, 1);
  });
  (function () {
    const some0 = Array.prototype.some;
    let lk = -1;
    OB.some = function (f, t) {
      if (some0.call(this, f, t)) return true;
      const k = ck(P.x, P.z);
      if (k !== lk) {
        lk = k;
        const L = [], cx = Math.floor(P.x / 8), cz = Math.floor(P.z / 8);
        for (let a = -1; a <= 1; a++)
          for (let b = -1; b <= 1; b++) {
            const l = W.col.get((cx + a) * 4099 + cz + b);
            if (l) for (const o of l) if (L.indexOf(o) < 0) L.push(o);
          }
        W.colNear = L;
      }
      return some0.call(W.colNear, f, t);
    };
    W.colDirty = () => (lk = -1);
  })();

  function cutOld() {
    /* buang segitiga jaring lama yang seluruhnya dalam Lembah Timur */
    const m = W8.ter, g = m.geometry, p = g.attributes.position.array, ix = g.index.array;
    const inside = (k) => p[k * 3] <= -216 + 1e-3 && p[k * 3 + 2] < W.RG.z1;
    const keep = [];
    for (let i = 0; i < ix.length; i += 3) {
      const a = ix[i], b = ix[i + 1], c = ix[i + 2];
      if (inside(a) && inside(b) && inside(c)) continue;
      keep.push(a, b, c);
    }
    g.setIndex(new T.BufferAttribute(new Uint32Array(keep), 1));
    /* tepi selatan: baris ZS terakhir yang dibuang sepenuhnya */
    let zE = -1e9;
    for (const z of W8.ZS) if (z < W.RG.z1 && z > zE) zE = z;
    let zPrev = -1e9;
    for (const z of W8.ZS) if (z < zE && z > zPrev) zPrev = z;
    /* segitiga antara zPrev..zE dibuang (semua bucu < z1) → tepi baharu = zE */
    W.zEdge = zE;
    W.cut = ix.length / 3 - keep.length / 3;
  }

  /* ---------- warna bucu ---------- */
  const C = (r, g, b) => new T.Color(r, g, b);
  const cG1 = C(0.4, 0.66, 0.22), cG2 = C(0.28, 0.55, 0.15), cDry = C(0.62, 0.63, 0.3), cFor = C(0.2, 0.35, 0.12), cFor2 = C(0.33, 0.29, 0.15),
    cRk = C(0.5, 0.48, 0.42), cRk2 = C(0.36, 0.35, 0.31), cSnow = C(0.93, 0.95, 0.98), cSand = C(0.82, 0.73, 0.5), cMud = C(0.42, 0.34, 0.21),
    cSst = C(0.82, 0.68, 0.45), cSst2 = C(0.7, 0.52, 0.34), cDirt = C(0.6, 0.47, 0.3), cMead = C(0.5, 0.7, 0.26), cTer = C(0.46, 0.55, 0.2), cVil = C(0.58, 0.6, 0.32);
  const tc = new T.Color(), t2 = new T.Color();
  function colAt(x, z, h, sl, out) {
    const n1 = 0.5 + 0.5 * Math.sin(x * 0.045 + Math.sin(z * 0.031) * 2) * Math.cos(z * 0.052 - x * 0.013),
      n2 = 0.5 + 0.5 * Math.sin(x * 0.21 + z * 0.17) * Math.sin(z * 0.23 - x * 0.11);
    out.copy(cG1).lerp(cG2, n1 * 0.85 + n2 * 0.15);
    out.lerp(cDry, sm((n1 - 0.6) / 0.3) * 0.4);
    const F = W.F;
    const fd = W.FDr(x, z);
    if (fd > 0.2) out.lerp(t2.copy(cFor).lerp(cFor2, n2 * 0.5), sm((fd - 0.2) / 0.5) * 0.75);
    const dm = Math.hypot(x - F.meadow[0], z - F.meadow[1]);
    if (dm < F.meadow[2] + 6) {
      out.lerp(cMead, sm((F.meadow[2] + 6 - dm) / 10) * 0.7);
      /* bintik bunga pada tanah (jauh pun nampak berwarna) */
      const fk = Math.sin(x * 1.7) * Math.sin(z * 1.9) * Math.sin(x * 0.7 + z * 0.9);
      if (fk > 0.35) out.lerp(tc.setRGB(0.95, 0.55 + 0.35 * n2, 0.7 - 0.4 * n1), (fk - 0.35) * 0.9 * sm((F.meadow[2] - dm) / 8));
    }
    const df = Math.hypot((x - F.farm[0]) / F.farm[2], (z - F.farm[1]) / F.farm[3]);
    if (df < 1.5) out.lerp(cTer, sm((1.5 - df) / 0.3) * 0.75);
    const dv = Math.hypot(x - F.village[0], z - F.village[1]);
    if (dv < F.village[2]) out.lerp(cVil, sm((F.village[2] - dv) / 20) * 0.35);
    out.lerp(cRk, sm((h - 30) / 12) * 0.8);
    out.lerp(cRk2, sm((sl - 0.8) / 0.55) * 0.85);
    /* utara (ikut peta rujukan): bukit batu pasir → pintu ke Padang Pasir */
    const ds = sm((-z - 262) / 26) * (1 - sm((-x - 486) / 20));
    if (ds > 0) out.lerp(sl > 1 ? cSst2 : cSst, ds * 0.85);
    /* salji: hanya puncak tinggi banjaran barat */
    const sn = (h - 44 - 6 * n2 + 4 * sl) * sm((-x - 486) / 18);
    if (sn > 0) out.lerp(cSnow, sm(sn / 7) * (sl > 1.6 ? 0.55 : 0.95));
    /* pasir tasik & lumpur sungai */
    const ld = W.lakeD(x, z);
    if (ld < 1.25 && h < 2.6) out.lerp(cSand, sm((1.25 - ld) / 0.15) * sm((2.6 - h) / 1.2));
    const rd = W.riverD(x, z);
    if (rd < 4) out.lerp(cMud, sm((4 - rd) / 3) * 0.7);
    if (W.nearRoad(x, z, 0.9)) out.lerp(cDirt, 0.85);
    out.multiplyScalar(0.94 + 0.12 * n2);
  }
  W.colAt = colAt;

  /* ---------- ketulan ---------- */
  const CS = 68;
  function chunkGeo(c, step, skirt) {
    const x0 = c.x0, x1 = c.x1, z0 = c.z0, z1 = c.z1,
      nx = Math.max(2, Math.round((x1 - x0) / step)) + 1, nzn = Math.max(2, Math.round((z1 - z0) / step)) + 1;
    const nv = nx * nzn, ns = skirt ? 2 * (nx + nzn) - 4 : 0;
    const pos = new Float32Array((nv + ns) * 3), nor = new Float32Array((nv + ns) * 3), col = new Float32Array((nv + ns) * 3), uv = new Float32Array((nv + ns) * 2);
    const H = W.H, e = 0.9;
    for (let j = 0; j < nzn; j++)
      for (let i = 0; i < nx; i++) {
        const k = j * nx + i, x = lp(x0, x1, i / (nx - 1)), z = lp(z0, z1, j / (nzn - 1)), h = H(x, z);
        const hx = H(x + e, z) - H(x - e, z), hz = H(x, z + e) - H(x, z - e);
        let Nx = -hx, Ny = 2 * e, Nz = -hz;
        const l = Math.hypot(Nx, Ny, Nz);
        nor[k * 3] = Nx / l;
        nor[k * 3 + 1] = Ny / l;
        nor[k * 3 + 2] = Nz / l;
        pos[k * 3] = x;
        pos[k * 3 + 1] = h;
        pos[k * 3 + 2] = z;
        uv[k * 2] = x / 3.2;
        uv[k * 2 + 1] = z / 3.2;
        colAt(x, z, h, Math.hypot(hx, hz) / (2 * e), tc);
        col[k * 3] = tc.r;
        col[k * 3 + 1] = tc.g;
        col[k * 3 + 2] = tc.b;
      }
    const idx = [];
    for (let j = 0; j < nzn - 1; j++)
      for (let i = 0; i < nx - 1; i++) {
        const a = j * nx + i, b = a + 1, d = a + nx, f = d + 1;
        idx.push(a, d, b, b, d, f);
      }
    if (skirt) {
      /* gelang tepi → bucu tiruan 3 m ke bawah (sorok retak antara LOD / jaring lama) */
      const ring = [];
      for (let i = 0; i < nx; i++) ring.push(i);
      for (let j = 1; j < nzn; j++) ring.push(j * nx + nx - 1);
      for (let i = nx - 2; i >= 0; i--) ring.push((nzn - 1) * nx + i);
      for (let j = nzn - 2; j > 0; j--) ring.push(j * nx);
      ring.forEach((k, r) => {
        const s = nv + r;
        pos[s * 3] = pos[k * 3];
        pos[s * 3 + 1] = pos[k * 3 + 1] - 3;
        pos[s * 3 + 2] = pos[k * 3 + 2];
        for (let q = 0; q < 3; q++) {
          nor[s * 3 + q] = nor[k * 3 + q];
          col[s * 3 + q] = col[k * 3 + q] * 0.8;
        }
        uv[s * 2] = uv[k * 2];
        uv[s * 2 + 1] = uv[k * 2 + 1] + 0.9;
      });
      for (let r = 0; r < ring.length; r++) {
        const a = ring[r], b = ring[(r + 1) % ring.length], sa = nv + r, sb = nv + ((r + 1) % ring.length);
        idx.push(a, b, sa, b, sb, sa, a, sa, b, b, sa, sb); /* dua muka: sentiasa nampak */
      }
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    g.setAttribute('normal', new T.BufferAttribute(nor, 3));
    g.setAttribute('color', new T.BufferAttribute(col, 3));
    g.setAttribute('uv', new T.BufferAttribute(uv, 2));
    g.setIndex(idx.length > 65535 ? new T.BufferAttribute(new Uint32Array(idx), 1) : new T.BufferAttribute(new Uint16Array(idx), 1));
    g.computeBoundingSphere();
    return g;
  }
  W.chunkGeo = chunkGeo;

  function setup() {
    cutOld();
    const mat = W8.ter.material;
    W.terMat = mat;
    const zs = [];
    for (let z = W.RG.z0; z < W.zEdge - 8; z += CS) zs.push(z);
    zs.push(W.zEdge);
    const xs = [];
    for (let x = W.RG.x0; x < W.RG.x1 - 8; x += CS) xs.push(x);
    xs.push(W.RG.x1);
    for (let j = 0; j < zs.length - 1; j++)
      for (let i = 0; i < xs.length - 1; i++) {
        const c = { x0: xs[i], x1: xs[i + 1], z0: zs[j], z1: zs[j + 1], lod: -1, g: [null, null], m: null, i, j };
        c.cx = (c.x0 + c.x1) / 2;
        c.cz = (c.z0 + c.z1) / 2;
        c.m = new T.Mesh(new T.BufferGeometry(), mat);
        c.m.receiveShadow = true;
        c.m.visible = false;
        c.m.userData.v17 = 1;
        c.m.userData.v8 = 1; /* modul lama abaikan (bukan rumput lama) */
        scene.add(c.m);
        W.chunks.push(c);
      }
    /* bina semua LOD kasar dahulu (murah) supaya dunia tidak kosong */
    W.chunks.forEach((c) => {
      c.g[1] = chunkGeo(c, W.tq.g * 4, true);
    });
    W.terOK = 1;
    console.log('V17 terrain: ' + W.chunks.length + ' ketulan, ' + W.cut + ' segitiga lama dibuang');
  }

  /* penstriman: bina LOD halus satu ketulan setiap bingkai (tiada sentakan), buang bila jauh */
  let busy = 0;
  function stream() {
    if (!W.terOK) return;
    const c0 = camera.position, tq = W.tq;
    let best = null, bd = 1e9;
    for (const c of W.chunks) {
      const dx = Math.max(c.x0 - c0.x, 0, c0.x - c.x1), dz = Math.max(c.z0 - c0.z, 0, c0.z - c.z1), d = Math.hypot(dx, dz);
      c.d = d;
      const want = d < tq.near ? 0 : d < tq.far + 120 ? 1 : 2;
      if (want === 0 && !c.g[0] && d < bd) {
        bd = d;
        best = c;
      }
      const use = want === 0 && c.g[0] ? 0 : want <= 1 ? 1 : 2;
      if (use !== c.lod) {
        c.lod = use;
        if (use < 2) c.m.geometry = c.g[use];
        c.m.visible = use < 2;
      }
      if (c.g[0] && d > tq.near * 1.6 && c.lod !== 0) {
        c.g[0].dispose();
        c.g[0] = null;
      }
    }
    if (best && !busy) {
      busy = 1;
      best.g[0] = chunkGeo(best, tq.g, true);
      busy = 0;
    }
  }
  W.stream = stream;

  /* satu gelung kemas kini untuk semua modul V17 (dipanggil dari gtick) */
  let lt = performance.now();
  function hook() {
    const _g = window.gtick;
    window.gtick = function () {
      _g.apply(this, arguments);
      const now = performance.now(), dt = Math.min(0.1, (now - lt) / 1000);
      lt = now;
      W.dt = dt;
      W.now = now;
      try {
        stream();
      } catch (e) {
        if (!W.e1) (W.e1 = 1), console.error('V17 stream', e);
      }
      for (let i = 0; i < W.onTick.length; i++) {
        try {
          W.onTick[i](dt, now);
        } catch (e) {
          if (!W.onTick[i].e) (W.onTick[i].e = 1), console.error('V17 tick', e);
        }
      }
    };
  }
  when14(
    () => typeof W8 !== 'undefined' && W8.ter && W8.ZS && W8.tc && typeof gtick === 'function' && typeof plM !== 'undefined' && plM.length,
    () => {
      setup();
      hook();
    }
  );
})();
