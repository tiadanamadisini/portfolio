/* ===== V17 CUACA & MUSIM (seluruh dunia) =====
   cuaca: ☀️ cerah · ⛅ berawan · 🌫 kabus pagi · 🌧 hujan · ⛈ ribut (kilat + guruh + angin kencang)
   musim (7 hari setiap satu): 🌞 Kemarau · 🌧 Tengkujuh · 🍈 Musim Buah · 🌾 Musim Menuai
   kesan: kabus/cahaya/awan berubah, titis hujan (dikitar semula ikut kamera), angin goyang pokok & rumput V17,
          ikan lebih galak masa hujan, penduduk berteduh, padi menguning musim menuai */
(function () {
  'use strict';
  const W = window.W17, T = THREE;
  if (!W) return;
  const WX = {
    cerah: { ic: '☀️', n: 'Cerah', sun: 1, hemi: 1, fog: 1, rain: 0, wind: 1, cl: 0 },
    awan: { ic: '⛅', n: 'Berawan', sun: 0.7, hemi: 0.92, fog: 1.25, rain: 0, wind: 1.3, cl: 0.35 },
    kabus: { ic: '🌫', n: 'Kabus', sun: 0.6, hemi: 0.95, fog: 3.2, rain: 0, wind: 0.5, cl: 0.25 },
    hujan: { ic: '🌧', n: 'Hujan', sun: 0.42, hemi: 0.78, fog: 1.9, rain: 1, wind: 1.8, cl: 0.7 },
    ribut: { ic: '⛈', n: 'Ribut', sun: 0.25, hemi: 0.62, fog: 2.4, rain: 2, wind: 3.2, cl: 1 }
  };
  const SEA = [
    { ic: '🌞', n: 'Musim Kemarau', w: { cerah: 6, awan: 3, kabus: 1, hujan: 0.6, ribut: 0.2 } },
    { ic: '🌧', n: 'Musim Tengkujuh', w: { cerah: 1.2, awan: 3, kabus: 1, hujan: 4, ribut: 1.6 } },
    { ic: '🍈', n: 'Musim Buah', w: { cerah: 4, awan: 3, kabus: 1.2, hujan: 1.6, ribut: 0.4 } },
    { ic: '🌾', n: 'Musim Menuai', w: { cerah: 5, awan: 2.6, kabus: 2, hujan: 1, ribut: 0.3 } }
  ];
  W.WX = WX;
  W.SEA = SEA;
  const st = () => (GS.v17 = GS.v17 || {});
  W.season = () => SEA[Math.floor(((GS.day || 1) - 1) / 7) % 4];
  W.wx = () => WX[(st().wx && st().wx.k) || 'cerah'];
  W.raining = () => !!W.wx().rain;
  const hour = () => (6 + (GS.t || 0) / 75) % 24;
  function pick() {
    const s = W.season(), h = hour();
    const w = Object.assign({}, s.w);
    if (h > 5 && h < 9) w.kabus *= 3; /* kabus pagi */
    else w.kabus *= 0.25;
    let tot = 0;
    for (const k in w) tot += w[k];
    let r = Math.random() * tot;
    for (const k in w) if ((r -= w[k]) <= 0) return k;
    return 'cerah';
  }
  function setWx(k, quiet) {
    const s = st();
    s.wx = { k, until: (GS.day || 1) * 1800 + (GS.t || 0) + 240 + Math.random() * 360 };
    if (!quiet) tip(WX[k].ic + ' Cuaca: ' + WX[k].n + (k === 'hujan' || k === 'ribut' ? ' — penduduk berteduh, ikan lebih galak!' : ''));
    if (W.onWx) W.onWx(k);
  }
  W.setWx = setWx;

  /* ---------- titis hujan ---------- */
  const NR = W.tq.rain;
  const rg = new T.BufferGeometry(), rp = new Float32Array(NR * 6), rv = new Float32Array(NR);
  for (let i = 0; i < NR; i++) {
    const x = (Math.random() - 0.5) * 50, y = Math.random() * 30, z = (Math.random() - 0.5) * 50;
    rp.set([x, y, z, x, y - 0.7, z], i * 6);
    rv[i] = 0.7 + Math.random() * 0.5;
  }
  rg.setAttribute('position', new T.BufferAttribute(rp, 3));
  const rm = new T.LineBasicMaterial({ color: 0xaecbe6, transparent: true, opacity: 0.5, depthWrite: false, fog: true });
  const rain = new T.LineSegments(rg, rm);
  rain.frustumCulled = false;
  rain.visible = false;
  rain.userData.v8 = 1;
  scene.add(rain);
  let flash = 0, nextBolt = 0, ac = null;
  function thunder(dist) {
    try {
      if (!ac) return;
      const d = ac.createBuffer(1, ac.sampleRate * 2.2, ac.sampleRate), a = d.getChannelData(0);
      let v = 0;
      for (let i = 0; i < a.length; i++) {
        v = v * 0.985 + (Math.random() * 2 - 1) * 0.15;
        a[i] = v * Math.pow(1 - i / a.length, 2.2) * (i < ac.sampleRate * 0.06 ? i / (ac.sampleRate * 0.06) : 1);
      }
      const s = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 380;
      g.gain.value = 0.7 / (1 + dist);
      s.buffer = d;
      s.connect(f).connect(g).connect(ac.destination);
      s.start(ac.currentTime + dist * 0.6);
    } catch (e) {}
  }
  addEventListener('pointerdown', () => {
    if (!ac)
      try {
        ac = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {}
  }, { once: true });

  /* ---------- kesan pada cahaya / kabus / awan (tanpa berkumpul dari bingkai ke bingkai) ---------- */
  const mul = { sun: 1, hemi: 1, fog: 1, cl: 0 };
  const last = { d: -1, s: -1, h: -1 }, basev = { d: 0, s: 0, h: 0 };
  const cDark = new T.Color(0x4a5566), cTmp = new T.Color();
  function applyEnv() {
    const cv = W.inCave;
    const k = W.wx(), lpk = 1 - Math.pow(0.02, W.dt || 0.016);
    mul.sun += ((cv ? 0.04 : k.sun) - mul.sun) * lpk;
    mul.hemi += ((cv ? 0.28 : k.hemi) - mul.hemi) * lpk;
    mul.fog += ((cv ? 2.6 : k.fog) - mul.fog) * lpk;
    mul.cl += (k.cl - mul.cl) * lpk;
    if (scene.fog) {
      const d = scene.fog.density;
      if (d !== last.d) basev.d = d;
      if (scene.fog.density != null) scene.fog.density = basev.d * mul.fog;
      last.d = scene.fog.density;
      if (mul.cl > 0.02 || cv) scene.fog.color.lerp(cTmp.copy(cv ? new T.Color(0x0c0f14) : cDark), cv ? 0.9 : mul.cl * 0.55);
    }
    if (sun.intensity !== last.s) basev.s = sun.intensity;
    sun.intensity = basev.s * mul.sun + flash * 2.5;
    last.s = sun.intensity;
    if (hemi.intensity !== last.h) basev.h = hemi.intensity;
    hemi.intensity = basev.h * mul.hemi + flash * 1.8;
    last.h = hemi.intensity;
    try {
      if (clouds && clouds.mat) clouds.mat.color.lerp(cDark, mul.cl * 0.6);
    } catch (e) {}
    try {
      if (typeof skyU !== 'undefined' && mul.cl > 0.02) {
        skyU.top.value.lerp(cDark, mul.cl * 0.55);
        skyU.bot.value.lerp(cTmp.set(0x8592a0), mul.cl * 0.5);
      }
    } catch (e) {}
  }
  function hookEnv() {
    const e0 = window.env;
    window.env = function () {
      e0.apply(this, arguments);
      try {
        applyEnv();
      } catch (e) {
        if (!W.eW) (W.eW = 1), console.error('V17 cuaca', e);
      }
    };
  }

  /* ---------- HUD cip cuaca ---------- */
  let chip = null;
  function hud() {
    if (!chip) {
      chip = document.createElement('div');
      chip.id = 'wx17';
      chip.className = 'gp';
      chip.style.cssText =
        'position:fixed;top:calc(env(safe-area-inset-top,0px) + 50px);left:50%;transform:translateX(-50%);padding:3px 10px;font:800 10.5px "Plus Jakarta Sans",sans-serif;color:#e2e8f0;z-index:7;border-radius:999px;pointer-events:none;white-space:nowrap';
      document.body.appendChild(chip);
    }
    const k = W.wx(), s = W.season();
    chip.textContent = (W.inCave ? '🕳 Dalam gua' : k.ic + ' ' + k.n) + ' · ' + s.ic + ' ' + s.n;
  }
  W.wxHud = hud;

  let lastSea = -1, hudT = 0;
  W.tick((dt, now) => {
    const s = st(), abs = (GS.day || 1) * 1800 + (GS.t || 0);
    if (!s.wx || abs > s.wx.until || abs < s.wx.until - 3000) setWx(pick(), !s.wx);
    const si = Math.floor(((GS.day || 1) - 1) / 7) % 4;
    if (si !== lastSea) {
      if (lastSea >= 0) tip(SEA[si].ic + ' ' + SEA[si].n + ' bermula!');
      lastSea = si;
      /* padi menguning ketika musim menuai */
      try {
        if (W.padi) {
          const c = new T.Color();
          for (let i = 0; i < W.padi.count; i++) W.padi.setColorAt(i, c.setHSL(si === 3 ? 0.12 + Math.random() * 0.03 : 0.2 + Math.random() * 0.06, si === 3 ? 0.75 : 0.6, si === 3 ? 0.5 : 0.38 + Math.random() * 0.1));
          W.padi.instanceColor.needsUpdate = true;
        }
      } catch (e) {}
    }
    const k = W.wx();
    W.windU.value += ((W.inCave ? 0 : k.wind) - W.windU.value) * Math.min(1, dt * 0.8);
    /* hujan ikut kamera */
    const on = k.rain > 0 && !W.inCave;
    rain.visible = on;
    if (on) {
      const c = camera.position, n = Math.floor(NR * (k.rain > 1 ? 1 : 0.6)), a = rg.attributes.position.array, sp = 26 * (k.rain > 1 ? 1.4 : 1), wx = 0.06 * k.wind;
      rm.opacity = k.rain > 1 ? 0.6 : 0.45;
      for (let i = 0; i < NR; i++) {
        const o = i * 6;
        if (i >= n) {
          a[o + 1] = a[o + 4] = -999;
          continue;
        }
        let x = a[o], y = a[o + 1], z = a[o + 2];
        y -= sp * rv[i] * dt;
        x += wx;
        if (y < c.y - 8 || y < -900 || Math.abs(x - c.x) > 25 || Math.abs(z - c.z) > 25) {
          x = c.x + (Math.random() - 0.5) * 50;
          z = c.z + (Math.random() - 0.5) * 50;
          y = c.y + 6 + Math.random() * 20;
        }
        a[o] = x;
        a[o + 1] = y;
        a[o + 2] = z;
        a[o + 3] = x - wx * 3;
        a[o + 4] = y - 0.75;
        a[o + 5] = z;
      }
      rg.attributes.position.needsUpdate = true;
      /* kilat masa ribut */
      if (k.rain > 1 && now > nextBolt) {
        nextBolt = now + 5000 + Math.random() * 11000;
        flash = 1;
        thunder(Math.random() * 2.5);
      }
    }
    flash *= Math.pow(0.004, dt);
    try {
      /* hujan: ikan jarang ⭐ lebih galak (×1.3 berat peluang). Bahagi dahulu faktor lama → tiada pengumpulan */
      if (window.FISH14 && typeof FISH14.luck === 'number') {
        const f = on ? 1.3 : 1, pf = W.fLuck || 1;
        if (f !== pf) {
          FISH14.luck = (FISH14.luck / pf) * f;
          W.fLuck = f;
        }
      }
    } catch (e) {}
    if (now - hudT > 1000) {
      hudT = now;
      hud();
    }
  });
  when14(() => typeof window.env === 'function' && typeof GS !== 'undefined' && W.terOK, hookEnv);
})();
