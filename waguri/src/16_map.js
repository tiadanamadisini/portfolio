/* ===== V17 PETA: Lembah Timur dilukis pada peta asas (peta mini + peta penuh V16.1 berkongsi kanvas MC) =====
   raster terrain sudah meliputi kawasan baharu (tampalan MAP17); di sini ditambah air, jalan, bangunan, label & kabus peta (belum diterokai) */
(function () {
  'use strict';
  const W = window.W17;
  if (!W) return;
  const X = W.mapX, Z = W.mapZ, K = MAP17.k;
  W.seen = null;
  function overlay(c) {
    const g = c.getContext('2d');
    const ln = (pts, w, col, dash) => {
      g.save();
      g.strokeStyle = col;
      g.lineWidth = w;
      g.lineCap = g.lineJoin = 'round';
      if (dash) g.setLineDash(dash);
      g.beginPath();
      pts.forEach((p, i) => g[i ? 'lineTo' : 'moveTo'](X(p[0]), Z(p[1])));
      g.stroke();
      g.restore();
    };
    const tx = (t, x, z, s, col, st) => {
      g.font = '800 ' + s + 'px system-ui,sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.lineWidth = 4;
      g.strokeStyle = st || 'rgba(255,255,255,.92)';
      g.strokeText(t, X(x), Z(z));
      g.fillStyle = col;
      g.fillText(t, X(x), Z(z));
    };
    const F = W.F, R = W.RIV;
    /* sungai (lebar ikut hilir) */
    for (let i = 1; i < R.n; i += 2) ln([[R.X[i - 1], R.Z[i - 1]], [R.X[Math.min(R.n - 1, i + 1)], R.Z[Math.min(R.n - 1, i + 1)]]], W.RW(R.S[i]) * K, '#3a8fe0');
    g.fillStyle = '#3f9ee8';
    g.beginPath();
    g.ellipse(X(F.lake[0]), Z(F.lake[1]), F.lake[2] * K, F.lake[3] * K, 0, 0, 6.29);
    g.fill();
    g.fillStyle = '#9bd27a';
    g.beginPath();
    g.arc(X(F.islet[0]), Z(F.islet[1]), F.islet[2] * K, 0, 6.29);
    g.fill();
    g.fillStyle = '#4aa8ee';
    g.beginPath();
    g.ellipse(X(F.pool[0]), Z(F.pool[1]), F.pool[2] * K * 1.3, F.pool[3] * K * 1.3, 0, 0, 6.29);
    g.fill();
    /* tebing (garis putus) */
    const ep = [];
    for (let x = -430; x <= -262; x += 4) ep.push([x, W.esc(x)]);
    ln(ep, 3, 'rgba(70,50,30,.55)', [5, 4]);
    W.ROADS.forEach((r) => ln(r.R.pts, Math.max(3, r.w * K * 0.9), r.n === 'Jalan Celah Timur' ? '#d99a48' : '#a7794a'));
    (W.BRIDGES || []).forEach((b) => ln([[b.x0, b.z0], [b.x1, b.z1]], b.w * K, '#8a5a2b'));
    (W.FOOT || []).forEach((r) => {
      g.fillStyle = '#a0522d';
      g.fillRect(X(r[0]), Z(r[1]), (r[2] - r[0]) * K, (r[3] - r[1]) * K);
    });
    g.fillStyle = '#b9d36a';
    g.beginPath();
    g.ellipse(X(F.farm[0]), Z(F.farm[1]), F.farm[2] * K * 1.25, F.farm[3] * K * 1.25, 0, 0, 6.29);
    g.fill();
    tx('🏘 Kampung Timur', F.village[0], F.village[1] - 58, 16, '#3a1a06');
    tx('💦 Air Terjun', F.fall[0] + 18, F.fall[1] + 4, 12, '#0d3b7a');
    tx('💧 Tasik Biru', F.lake[0], F.lake[1] + 28, 14, '#0d3b7a');
    tx('🌸 Padang Bunga', F.meadow[0], F.meadow[1] - 6, 13, '#7a1a4a');
    tx('🌾 Ladang', F.farm[0], F.farm[1] + 22, 11, '#3a3a10');
    tx('🏜 Bukit Pasir → Padang Pasir', -390, -296, 13, '#5a3a16');
    tx('🏔 Banjaran Barat (bersalji) · jalan ke Kerajaan tertimbus', -526, -120, 12, '#1d2a1d');
    tx('🌲 Hutan Tebal', -400, -230, 12, '#0d3b14');
    tx('Celah Gunung', -228, -26, 11, '#5a3a16');
    tx('Sungai Tirai Perak', -312, -214, 11, '#0d3b7a');
    g.strokeStyle = 'rgba(60,40,20,.5)';
    g.lineWidth = 2;
    g.setLineDash([6, 6]);
    g.strokeRect(X(W.RG.x0), Z(W.RG.z0), (W.RG.x1 - W.RG.x0) * K, (W.RG.z1 - W.RG.z0) * K);
    g.setLineDash([]);
    return c;
  }
  /* kabus peta: Lembah Timur ditutup sehingga diterokai (grid 12 m, disimpan dalam GS.v17.fog) */
  const FG = 12, fgW = Math.ceil((W.RG.x1 - W.RG.x0) / FG), fgH = Math.ceil((W.RG.z1 - W.RG.z0) / FG);
  W.fogBits = () => {
    const s = (GS.v17 = GS.v17 || {});
    if (!s.fog || s.fog.length !== Math.ceil((fgW * fgH) / 6)) s.fog = 'A'.repeat(Math.ceil((fgW * fgH) / 6));
    return s;
  };
  const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  W.reveal = (x, z, r) => {
    const s = W.fogBits(), a = s.fog.split('');
    let ch = 0;
    for (let i = Math.floor((x - r - W.RG.x0) / FG); i <= Math.floor((x + r - W.RG.x0) / FG); i++)
      for (let j = Math.floor((z - r - W.RG.z0) / FG); j <= Math.floor((z + r - W.RG.z0) / FG); j++) {
        if (i < 0 || j < 0 || i >= fgW || j >= fgH) continue;
        const k = j * fgW + i, c = k / 6 | 0, b = k % 6, v = B64.indexOf(a[c]);
        if (!(v & (1 << b))) {
          a[c] = B64[v | (1 << b)];
          ch = 1;
        }
      }
    if (ch) s.fog = a.join('');
    return ch;
  };
  const seen = (i, j) => {
    const s = W.fogBits(), k = j * fgW + i, c = s.fog[(k / 6) | 0];
    return !!(B64.indexOf(c) & (1 << k % 6));
  };
  W.fogPct = () => {
    let n = 0;
    for (let j = 0; j < fgH; j++) for (let i = 0; i < fgW; i++) if (seen(i, j)) n++;
    return Math.round((n / (fgW * fgH)) * 100);
  };
  let base = null;
  function compose() {
    if (!base) return null;
    const c = document.createElement('canvas');
    c.width = base.width;
    c.height = base.height;
    const g = c.getContext('2d');
    g.drawImage(base, 0, 0);
    g.fillStyle = 'rgba(18,26,40,.82)';
    for (let j = 0; j < fgH; j++)
      for (let i = 0; i < fgW; i++)
        if (!seen(i, j)) g.fillRect(X(W.RG.x0 + i * FG) - 0.5, Z(W.RG.z0 + j * FG) - 0.5, FG * K + 1, FG * K + 1);
    return c;
  }
  function wrap() {
    const m0 = window.mapBase;
    if (!m0 || m0.__v17) return;
    window.mapBase = function () {
      base = overlay(m0.apply(this, arguments));
      return compose() || base;
    };
    window.mapBase.__v17 = 1;
    W.mapReady = 1;
  }
  /* kemas kini kabus peta semasa meneroka (MC dibina semula hanya bila ada sel baharu, maks 1×/2 s) */
  let lastC = 0, dirty = 0;
  W.tick(() => {
    if (P.x < -210 && P.z < W.RG.z1 && !W.inCave) if (W.reveal(P.x, P.z, 40)) dirty = 1;
    if (dirty && base && W.now - lastC > 2000 && typeof MC !== 'undefined') {
      lastC = W.now;
      dirty = 0;
      try {
        MC = compose();
        if (window.MAP16) MAP16.dirty = 1;
      } catch (e) {}
    }
  });
  when14(() => typeof window.mapBase === 'function' && W.villOK && typeof GS !== 'undefined', () => {
    wrap();
    /* jika MC sudah dibina sebelum kita sempat membalut → bina semula */
    try {
      if (typeof MC !== 'undefined' && MC) MC = window.mapBase();
    } catch (e) {
      console.error('V17 peta', e);
    }
  });
})();
