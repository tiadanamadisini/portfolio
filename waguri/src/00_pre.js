/* ===== V17 PRA: Lembah Timur — medan ketinggian, sungai, tasik, celah gunung, sempadan dunia & peta diluaskan =====
   dimuat SEBELUM enjin teras supaya terrain lama (W8.H), hutan & peta guna ketinggian yang sama.
   Kawasan lama (x ≥ -216 atau z ≥ 58) TIDAK berubah walau satu bucu pun. */
(function () {
  'use strict';
  const W = (window.W17 = window.W17 || {});
  const sm = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t)),
    lp = (a, b, t) => a + (b - a) * t;
  W.sm = sm;
  W.lp = lp;

  /* ---------- sempadan kawasan ---------- */
  const RG = { x0: -556, x1: -216, z0: -316, z1: 58 };
  W.RG = RG;
  W.inRg = (x, z) => x < RG.x1 && z < RG.z1 && x > RG.x0 - 40 && z > RG.z0 - 40;

  /* ---------- polyline + grid carian pantas ---------- */
  function cat(pts, step) {
    /* Catmull-Rom → titik sekata */
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      const L = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]), n = Math.max(1, Math.round(L / step));
      for (let k = 0; k < n; k++) {
        const t = k / n, t2 = t * t, t3 = t2 * t;
        const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
        out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
      }
    }
    out.push(pts[pts.length - 1].slice());
    return out;
  }
  function PL(pts, pad) {
    const n = pts.length, X = new Float32Array(n), Z = new Float32Array(n), S = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      X[i] = pts[i][0];
      Z[i] = pts[i][1];
      if (i) S[i] = S[i - 1] + Math.hypot(X[i] - X[i - 1], Z[i] - Z[i - 1]);
    }
    const C = 16, G = new Map(), K = (a, b) => a * 4099 + b;
    for (let i = 0; i < n - 1; i++) {
      const a0 = Math.floor((Math.min(X[i], X[i + 1]) - pad) / C), a1 = Math.floor((Math.max(X[i], X[i + 1]) + pad) / C),
        b0 = Math.floor((Math.min(Z[i], Z[i + 1]) - pad) / C), b1 = Math.floor((Math.max(Z[i], Z[i + 1]) + pad) / C);
      for (let a = a0; a <= a1; a++)
        for (let b = b0; b <= b1; b++) {
          const k = K(a, b);
          let l = G.get(k);
          if (!l) G.set(k, (l = []));
          l.push(i);
        }
    }
    const o = { X, Z, S, n, L: S[n - 1], pts };
    o.q = (x, z) => {
      const l = G.get(K(Math.floor(x / C), Math.floor(z / C)));
      if (!l) return null;
      let bd = 1e18, bi = 0, bt = 0;
      for (let j = 0; j < l.length; j++) {
        const i = l[j], ax = X[i], az = Z[i], dx = X[i + 1] - ax, dz = Z[i + 1] - az;
        let t = ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1);
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const ex = x - ax - t * dx, ez = z - az - t * dz, d = ex * ex + ez * ez;
        if (d < bd) { bd = d; bi = i; bt = t; }
      }
      return { d: Math.sqrt(bd), i: bi, t: bt };
    };
    o.v = (A, q) => A[q.i] + (A[q.i + 1] - A[q.i]) * q.t;
    o.tan = (i) => {
      const a = Math.max(0, i - 1), b = Math.min(n - 1, i + 1), dx = X[b] - X[a], dz = Z[b] - Z[a], l = Math.hypot(dx, dz) || 1;
      return [dx / l, dz / l];
    };
    o.at = (s) => {
      /* titik pada jarak s sepanjang garis */
      let i = 0;
      while (i < n - 2 && S[i + 1] < s) i++;
      const t = Math.max(0, Math.min(1, (s - S[i]) / (S[i + 1] - S[i] || 1)));
      return [lp(X[i], X[i + 1], t), lp(Z[i], Z[i + 1], t), i];
    };
    return o;
  }
  W.cat = cat;
  W.PL = PL;

  /* ---------- hingar murah (deterministik) ---------- */
  const nz = (x, z) =>
    Math.sin(x * 0.061 + 1.7) * Math.cos(z * 0.057 - 0.4) * 0.55 +
    Math.sin(x * 0.019 - z * 0.027 + 2.6) * 0.9 +
    Math.sin(x * 0.143 + z * 0.121) * 0.22 +
    Math.sin(x * 0.31 - z * 0.27) * 0.07;
  W.nz = nz;
  const ridge = (x, z) => 1 - Math.abs(Math.sin(x * 0.045 + Math.sin(z * 0.033) * 1.6) * Math.cos(z * 0.041 - x * 0.012));

  /* ---------- ciri landskap (koordinat dunia; utara = -z) ---------- */
  const F = {
    village: [-340, -150, 52], /* 🏘 Kampung Timur — dataran atas air terjun */
    plateau: 15.2,
    fall: [-300.5, -62.6], /* bibir air terjun */
    pool: [-301, -46, 10, 8],
    lake: [-412, 12, 33, 20, 0.9], /* 💧 Tasik Biru: cx, cz, rx, rz, aras air */
    meadow: [-445, -128, 34], /* 🌸 Padang Bunga */
    farm: [-388, -168, 22, 15], /* 🌾 ladang padi bukit kampung */
    helang: [-505, -252], /* 🦅 Puncak Tebing Helang */
    kuil: [-426, -262], /* ⛩ runtuhan lama dalam hutan */
    islet: [-418, 14, 4.2], /* pulau kecil di tengah tasik */
    gkel: [-482, -34], /* 🦇 Gua Kelawar (gua kecil) */
    cave: [-307.5, -59.4] /* pintu Gua Tirai Air (belakang air terjun) */
  };
  W.F = F;
  /* garis tebing (escarpment) z = esc(x); utara tebing = dataran tinggi */
  const esc = (x) => -60 + 5.5 * Math.sin(x * 0.031 + 0.8) + 2.2 * Math.sin(x * 0.083);
  W.esc = esc;
  const escW = (x) => 2.6 + 34 * sm((x + 278) / 22) + 30 * sm((-x - 432) / 30); /* lebar cerun: curam di tengah, landai di hujung */

  const HL = [
    [-262, -205, 16, 36], [-470, -60, 14, 34], [-370, -260, 18, 42], [-236, -150, 22, 40], [-520, -150, 20, 50],
    [-460, 40, 10, 30], [-250, -280, 26, 44], [-505, -252, 34, 34], [-340, 30, 6, 26], [-232, -90, 16, 30]
  ];
  /* dasar (tanpa jalan/sungai) */
  function T0(x, z) {
    const n = nz(x, z);
    let h = 3.2 + n * 1.6;
    /* dataran tinggi utara tebing */
    const e = esc(x), w = escW(x), st = sm((e - z) / w);
    const hp = F.plateau + n * 2.2 + 3 * sm((-z - 190) / 60);
    h = lp(h, hp, st);
    /* bukit-bukau */
    for (let i = 0; i < HL.length; i++) {
      const q = HL[i], d = Math.hypot(x - q[0], z - q[1]);
      if (d < q[3]) h += q[2] * sm(1 - d / q[3]) * (0.8 + 0.2 * ridge(x, z));
    }
    /* banjaran sempadan (utara & barat) → gunung bersalji */
    h += 58 * sm((-z - 262) / 42) * (0.72 + 0.28 * ridge(x * 1.3, z));
    h += 62 * sm((-x - 498) / 46) * (0.7 + 0.3 * ridge(x, z * 1.2));
    /* lembah tasik lebih rendah */
    h = lp(h, 1.4 + n * 0.6, sm(1 - Math.hypot((x - F.lake[0]) / 70, (z - F.lake[1]) / 46)) * 0.85);
    /* dataran kampung diratakan */
    const dv = Math.hypot(x - F.village[0], z - F.village[1]);
    h = lp(h, F.plateau + 0.4 + 0.25 * Math.sin(x * 0.2) * Math.sin(z * 0.17), sm((F.village[2] - dv) / 18));
    /* ladang bertingkat */
    const df = Math.hypot((x - F.farm[0]) / F.farm[2], (z - F.farm[1]) / F.farm[3]);
    if (df < 1.6) {
      const tq = F.plateau + 0.9 + Math.floor((z - F.farm[1] + 30) / 7) * -0.55;
      h = lp(h, tq, sm((1.5 - df) / 0.4));
    }
    /* padang bunga — beralun lembut */
    const dm = Math.hypot(x - F.meadow[0], z - F.meadow[1]);
    h = lp(h, F.plateau + 1 + n * 0.8, sm((F.meadow[2] - dm) / 16) * 0.8);
    return h;
  }

  /* ---------- jalan kawasan ---------- */
  const ROADS = [
    /* Jalan Celah Timur: dari Laluan Hutan Jauh (x=-204) → celah gunung → kolam air terjun → naik cerun → jambatan → kampung */
    { n: 'Jalan Celah Timur', w: 4.2, c: 0xc9a26a, pts: [[-203.5, -9], [-214, -12], [-228, -16], [-246, -24], [-256, -38], [-260, -56], [-264, -76], [-274, -96], [-290, -114], [-306, -126], [-322, -138], [-336, -148]] },
    /* ke Tasik Biru */
    { n: 'Lorong Tasik', w: 2.8, c: 0xa7794a, pts: [[-256, -38], [-266, -26], [-282, -14], [-304, -4], [-328, 4], [-350, 12], [-364, 17], [-374, 19]] },
    /* denai ke tebing kolam air terjun */
    { n: 'Denai Air Terjun', w: 2.0, c: 0x8f6a43, pts: [[-266, -26], [-280, -34], [-289, -41]] },
    /* ke Padang Bunga & barat */
    { n: 'Lorong Padang', w: 2.6, c: 0xa7794a, pts: [[-352, -152], [-372, -150], [-396, -144], [-420, -136], [-442, -128], [-466, -118]] },
    /* ke utara (hutan tebal, kuil lama) */
    { n: 'Denai Utara', w: 2.2, c: 0x8f6a43, pts: [[-344, -170], [-352, -196], [-372, -222], [-398, -244], [-424, -258]] },
    /* ke ladang */
    { n: 'Lorong Ladang', w: 2.2, c: 0x9a7448, pts: [[-358, -158], [-372, -164], [-386, -166]] }
  ];
  ROADS.forEach((r) => {
    r.R = PL(cat(r.pts, 2), r.w / 2 + 12);
    r.Y = null;
  });
  W.ROADS = ROADS;

  /* ---------- sungai ---------- */
  const RIVc = [
    [-292, -308], [-300, -272], [-311, -240], [-306, -206], [-296, -180], [-292, -152], [-296, -124], [-301, -98], [-301, -78],
    [-300.5, -66], [-300.5, -61], [-301, -52], [-303, -44], [-314, -32], [-332, -20], [-352, -10], [-374, -2], [-394, 8], [-406, 12]
  ];
  const RIV = PL(cat(RIVc, 1.5), 30);
  W.RIV = RIV;
  const RW = (s) => 4.2 + 3.2 * sm((s - 60) / 160); /* lebar sungai bertambah ke hilir */
  W.RW = RW;

  /* ---------- gua (bawah tanah, y ≈ -70) ---------- */
  const CV = {
    y: -70,
    /* bilik: [cx, cz, rx, rz] */
    rooms: [[-309, -76, 7, 6], [-318, -98, 9, 8], [-306, -118, 7, 6], [-322, -136, 17, 15]],
    tun: [[-309, -70], [-309, -76], [-316, -90], [-318, -98], [-310, -110], [-306, -118], [-314, -128], [-322, -136]]
  };
  CV.T = PL(cat(CV.tun, 1), 12);
  W.CV = CV;
  W.inCave = false;
  W.caveFloor = (x, z) => {
    let best = -1e9;
    for (const r of CV.rooms) {
      const d = Math.hypot((x - r[0]) / r[2], (z - r[1]) / r[3]);
      if (d < 1) best = Math.max(best, CV.y + 0.35 * Math.sin(x * 0.7) * Math.cos(z * 0.6) * (1 - d));
    }
    const q = CV.T.q(x, z);
    if (q && q.d < 2.6) best = Math.max(best, CV.y + 0.1);
    return best;
  };
  W.inCaveArea = (x, z) => W.caveFloor(x, z) > -1e8;

  /* ---------- aras air sungai (menurun ke hilir; terjun di tebing) ---------- */
  let LV = null;
  function buildLV(H0) {
    LV = new Float32Array(RIV.n);
    for (let i = 0; i < RIV.n; i++) {
      const x = RIV.X[i], z = RIV.Z[i];
      let L = blendBase(x, z, H0) - 1.05;
      if (i) L = Math.min(L, LV[i - 1]);
      LV[i] = Math.max(F.lake[4], L);
    }
    W.LV = LV;
  }
  W.lvAt = (q) => (LV ? RIV.v(LV, q) : 0);

  /* tanpa sungai: dasar + pengadun dinding lama + celah gunung */
  const PASS = PL(cat([[-200, -9], [-214, -12], [-228, -16], [-246, -24], [-256, -36]], 2), 30);
  function blendBase(x, z, H0) {
    const t = T0(x, z);
    const wE = sm((-216 - x) / 26), wS = sm((RG.z1 - z) / 24), w = wE * wS;
    if (w >= 1) return t;
    let h0 = H0(x, z);
    /* celah gunung: dinding lama dipotong menjadi gaung */
    const q = PASS.q(x, z);
    if (q && x < -216) {
      const m = 1 - sm((q.d - 5) / 15);
      if (m > 0) h0 = lp(h0, Math.min(h0, t + 0.6 * q.d), m);
    }
    return lp(h0, t, w);
  }

  function roadY(r, H0) {
    const R = r.R, n = R.n, Yn = new Float32Array(n), Y = new Float32Array(n), win = 7;
    for (let i = 0; i < n; i++) Yn[i] = blendBase(R.X[i], R.Z[i], H0);
    for (let i = 0; i < n; i++) {
      let s = 0, c = 0;
      for (let k = -win; k <= win; k++) {
        const j = i + k;
        if (j < 0 || j >= n) continue;
        const wt = 1 - Math.abs(k) / (win + 1);
        s += Yn[j] * wt;
        c += wt;
      }
      Y[i] = s / c;
    }
    /* hujung jalan lama mesti tepat dengan tanah lama */
    if (r.n === 'Jalan Celah Timur') for (let i = 0; i < 6 && i < n; i++) Y[i] = lp(H0(R.X[i], R.Z[i]), Y[i], i / 6);
    /* naik di atas sungai (jambatan) */
    for (let i = 0; i < n; i++) {
      const q = RIV.q(R.X[i], R.Z[i]);
      if (q && q.d < RW(RIV.v(RIV.S, q)) / 2 + 3 && LV) Y[i] = Math.max(Y[i], RIV.v(LV, q) + 1.6);
    }
    r.Y = Y;
  }

  /* ---------- H17: ketinggian akhir ---------- */
  let ready = false, H0ref = null;
  function init(H0) {
    H0ref = H0;
    buildLV(H0);
    ROADS.forEach((r) => roadY(r, H0));
    /* jambatan: titik silang jalan × sungai */
    W.BRIDGES = [];
    ROADS.forEach((r) => {
      const R = r.R;
      let inW = false, a = 0;
      for (let i = 0; i < R.n; i++) {
        const q = RIV.q(R.X[i], R.Z[i]), on = !!(q && q.d < RW(RIV.v(RIV.S, q)) / 2 + 1.2);
        if (on && !inW) a = i;
        if (!on && inW) {
          const i0 = Math.max(0, a - 2), i1 = Math.min(R.n - 1, i + 1);
          W.BRIDGES.push({ road: r.n, x0: R.X[i0], z0: R.Z[i0], x1: R.X[i1], z1: R.Z[i1], y0: r.Y[i0], y1: r.Y[i1], w: r.w + 1.2 });
        }
        inW = on;
      }
    });
    ready = true;
  }
  W.ready = () => ready;

  const flatR = (r, x, z, h) => {
    const q = r.R.q(x, z);
    if (!q) return h;
    const hw = r.w / 2, sh = r.w * 0.9 + 2.4;
    if (q.d > hw + sh) return h;
    return lp(h, r.R.v(r.Y, q), 1 - sm((q.d - hw) / sh));
  };
  function carveRiver(x, z, h) {
    const q = RIV.q(x, z);
    if (!q || q.d > 22) return h;
    const s = RIV.v(RIV.S, q), L = RIV.v(LV, q), hw = RW(s) / 2;
    if (q.d < hw - 0.6) return Math.min(h, L - 1.25 - 0.4 * (1 - q.d / hw));
    if (q.d < hw + 1.4) return Math.min(h, lp(L - 0.85, L + 0.35, sm((q.d - hw + 0.6) / 2)));
    const bank = L + 0.35 + 0.9 * (q.d - hw - 1.4);
    return h > bank ? lp(bank, h, sm((q.d - hw - 1.4) / 9)) : h;
  }
  function carveLake(x, z, h) {
    const k = F.lake, d = Math.hypot((x - k[0]) / k[2], (z - k[1]) / k[3]);
    if (d > 1.5) return h;
    let bed = k[4] - 0.4 - 3.2 * sm((1 - d) / 0.7);
    const di = Math.hypot(x - F.islet[0], z - F.islet[1]);
    if (di < F.islet[2] + 3) bed = Math.max(bed, k[4] + 0.9 - 0.35 * di);
    if (d < 1) return Math.min(h, bed);
    return lp(Math.min(h, k[4] + 0.25), h, sm((d - 1) / 0.5));
  }
  function carvePool(x, z, h) {
    const p = F.pool, d = Math.hypot((x - p[0]) / p[2], (z - p[1]) / p[3]);
    if (d > 1.6 || !LV) return h;
    const L = W.lvAt(RIV.q(p[0], p[1]));
    if (d < 1) return Math.min(h, L - 2.2 * (1 - d * d) - 0.5);
    return lp(Math.min(h, L + 0.3), h, sm((d - 1) / 0.6));
  }
  function H17(x, z, H0) {
    if (W.inCave && W.inCaveArea(x, z)) return W.caveFloor(x, z);
    if (!(x < -216 && z < RG.z1)) return H0(x, z);
    if (!ready) init(H0);
    let h = blendBase(x, z, H0);
    for (let i = 0; i < ROADS.length; i++) h = flatR(ROADS[i], x, z, h);
    h = carveRiver(x, z, h);
    h = carvePool(x, z, h);
    h = carveLake(x, z, h);
    return h;
  }
  window.H17 = H17;
  W.H = (x, z) => H17(x, z, H0ref || (() => 0));
  W.T0 = T0;

  /* jalan/sungai berdekatan (untuk letak pokok/bangunan) */
  W.nearRoad = (x, z, pad) => {
    for (const r of ROADS) {
      const q = r.R.q(x, z);
      if (q && q.d < r.w / 2 + (pad || 0)) return true;
    }
    return false;
  };
  W.riverD = (x, z) => {
    const q = RIV.q(x, z);
    return q ? q.d - RW(RIV.v(RIV.S, q)) / 2 : 1e9;
  };
  W.lakeD = (x, z) => Math.hypot((x - F.lake[0]) / F.lake[2], (z - F.lake[1]) / F.lake[3]);

  /* kepadatan hutan dalam kawasan (hutan lama dimatikan di sini; V17 tanam sendiri) */
  window.FD17 = (x, z) => (x < -216 && z < RG.z1 ? 0 : undefined);
  W.FDr = (x, z) => {
    if (W.lakeD(x, z) < 1.35 || W.riverD(x, z) < 4 || W.nearRoad(x, z, 3)) return 0;
    if (Math.hypot(x - F.village[0], z - F.village[1]) < F.village[2] + 4) return 0;
    if (Math.hypot(x - F.meadow[0], z - F.meadow[1]) < F.meadow[2] - 2) return 0.015;
    if (Math.hypot((x - F.farm[0]) / F.farm[2], (z - F.farm[1]) / F.farm[3]) < 1.7) return 0;
    if (Math.hypot(x - F.pool[0], z - F.pool[1]) < 16) return 0;
    const n = 0.5 + 0.5 * Math.sin(x * 0.05 + Math.sin(z * 0.04) * 2) * Math.cos(z * 0.047 - x * 0.02);
    let d = 0.26 + 0.24 * n;
    if (z < -196) d = Math.max(d, 0.78); /* hutan tebal utara */
    if (x < -462) d = Math.max(d, 0.7); /* hutan tebal barat */
    if (z > -58 && z < 40 && x > -380 && x < -230) d *= 0.55; /* lembah lebih terbuka */
    return d;
  };

  /* ---------- sempadan dinamik (dunia lama ∪ Lembah Timur) ---------- */
  const base = { XN: -212, XM: 98, ZN: -98, ZX: 243 };
  W.base = base;
  const zx = () => (typeof P !== 'undefined' ? P.z : 9), xx = () => (typeof P !== 'undefined' ? P.x : 0);
  const caveB = () => {
    if (!W.inCave) return null;
    return [-336, -294, -150, -64];
  };
  const def = (k, get) =>
    Object.defineProperty(window, k, {
      configurable: true,
      get,
      set(v) {
        base[k] = v;
      }
    });
  def('XN', () => {
    const c = caveB();
    if (c) return c[0];
    const z = zx();
    return z < RG.z1 - 1 && z > RG.z0 ? RG.x0 : base.XN;
  });
  def('XM', () => {
    const c = caveB();
    if (c) return c[1];
    const z = zx();
    return z < base.ZN ? -206 : base.XM;
  });
  def('ZN', () => {
    const c = caveB();
    if (c) return c[2];
    return xx() < -206 ? RG.z0 : base.ZN;
  });
  def('ZX', () => {
    const c = caveB();
    if (c) return c[3];
    return xx() < base.XN ? RG.z1 - 1 : base.ZX;
  });

  /* ---------- 5 tahap grafik: nama baharu (ID dalaman & simpanan kekal sama) ---------- */
  try {
    const G = window.GFX14;
    if (G) {
      G.names = { lite: '⚪ Biasa', biasa: '🟢 Medium', sine: '🎬 High', ultra: '🔥 Ultra', ext: '💎 Extreme' };
      G.desc = {
        lite: 'telefon kelas rendah · tanpa bayang pokok, rumput & kabus',
        biasa: 'cantik & stabil · rumput, buih air, kabus nipis',
        sine: 'gaya anime 3D · air mengalir, kabus atmosfera, model watak',
        ultra: 'sinematik · pokok & rumput padat, wap air terjun, cahaya isipadu',
        ext: 'maksimum · grid terrain halus, jarak pandang jauh, kesan penuh'
      };
    }
  } catch (e) {}
  /* jadual kualiti V17 ikut tahap (0 Biasa … 4 Extreme) — beza sebenar, bukan sekadar kecerahan */
  W.TQ = [
    { g: 3.2, near: 110, far: 210, tree: 0.42, treeFar: 150, grass: 0, fl: 260, mist: 0, fancy: 0, shT: 0, rain: 260, cl: 0 },
    { g: 2.4, near: 140, far: 250, tree: 0.68, treeFar: 190, grass: 1400, fl: 700, mist: 24, fancy: 0, shT: 0, rain: 520, cl: 1 },
    { g: 2.0, near: 160, far: 290, tree: 0.85, treeFar: 230, grass: 2800, fl: 1300, mist: 46, fancy: 1, shT: 1, rain: 800, cl: 1 },
    { g: 1.6, near: 190, far: 330, tree: 1.0, treeFar: 280, grass: 5200, fl: 2100, mist: 80, fancy: 1, shT: 1, rain: 1200, cl: 2 },
    { g: 1.25, near: 230, far: 380, tree: 1.15, treeFar: 330, grass: 8800, fl: 3200, mist: 120, fancy: 2, shT: 1, rain: 1800, cl: 2 }
  ];
  W.q = window.GFX14 ? Math.max(0, Math.min(4, GFX14.q | 0)) : 1;
  W.tq = W.TQ[W.q];

  /* ---------- konfigurasi peta (dunia lama + Lembah Timur) ---------- */
  window.MAP17 = { ox: 572, oy: 334, w: 1452, h: 1275, k: 2.15 };
  W.mapX = (x) => (x + MAP17.ox) * MAP17.k;
  W.mapZ = (z) => (z + MAP17.oy) * MAP17.k;
})();
