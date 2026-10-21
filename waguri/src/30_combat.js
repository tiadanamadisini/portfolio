/* ===== V17 PERTARUNGAN LANJUTAN =====
   🌀 ELAK (2 cas, i-frame 0.35 s) · 🛡 TANGKIS (tahan: kerosakan ×0.3) · ✨ TANGKISAN SEMPURNA (tekan tepat sebelum kena → 0 kerosakan + musuh pening + serangan balas ×2)
   ⚔️ SERANGAN BERAT (tahan butang serang 0.45 s, lepas → sapuan 140° ×2.4) · 🔥 KOMBO (serangan ke-3 berturut → pukulan penamat)
   🌳 POKOK KEMAHIRAN (3 cabang × 4 nod, 1 mata setiap level) · ⚒️ NAIK TARAF SENJATA (+1…+5) · 🔱 TOMBAK (senjata baharu, ditempa)
   musuh baharu dengan corak serangan bertelegraf (garis/bulatan merah): 🐗 Babi Taring Besi (rempuh) · 🐆 Harimau Kumbang (terkam)
   🐒 Kera Liar · 🦇 Kelawar Gua (junam) · 🪨 Golem Batu (hentak) · 👑 Raja Taring Besi · 🗿 BOS KELEMBAI BATU (3 fasa) */
(function () {
  'use strict';
  const W = window.W17, T = THREE;
  if (!W) return;
  const st = () => {
    const s = (GS.v17 = GS.v17 || {});
    s.sk = s.sk || {};
    s.wup = s.wup || {};
    return s;
  };
  const R = () => window.RPG14;

  /* ---------- pokok kemahiran ---------- */
  const SK = [
    { b: '⚔️ Pendekar', l: [['tajam', 'Bilah Tajam', 3, '+6% kerosakan jarak dekat'], ['berat', 'Hentakan Padu', 2, '+20% serangan berat'], ['tangkis', 'Mata Helang', 2, '+0.06 s tetingkap tangkisan sempurna'], ['kombo', 'Rentak Silat', 2, '+30% pukulan penamat kombo']] },
    { b: '🏹 Pemburu', l: [['mata', 'Bidikan Tepat', 3, '+8% kerosakan jarak jauh'], ['jejak', 'Penjejak', 2, '+15% peluang barang jatuh (musuh V17)'], ['cepat', 'Langkah Angin', 2, 'cas elak pulih 15% lebih pantas'], ['kebal', 'Kulit Badak', 3, '+4% pertahanan']] },
    { b: '🧭 Perantau', l: [['nyawa', 'Jantung Kental', 3, '+5% nyawa maksimum'], ['pulih', 'Nafas Hutan', 2, 'pulih nyawa di luar pertempuran'], ['tuah', 'Bertuah', 2, '+10% duit daripada musuh V17'], ['jauh', 'Pengembara', 1, 'elak lebih jauh (+25%)']] }
  ];
  W.SK = SK;
  const rk = (k) => st().sk[k] || 0;
  W.rk = rk;
  W.skPts = () => Math.max(0, (R() ? R().lv() : 0) + (st().skB || 0) - Object.values(st().sk).reduce((a, b) => a + b, 0));
  W.learn = (k) => {
    const n = SK.flatMap((b) => b.l).find((x) => x[0] === k);
    if (!n || rk(k) >= n[2] || W.skPts() < 1) return false;
    st().sk[k] = rk(k) + 1;
    save();
    return true;
  };
  W.wupOf = (k) => st().wup[k] || 0;
  function hookStats() {
    const R0 = R(), a0 = R0.atk, m0 = R0.maxHP, d0 = R0.def;
    R0.atk = function (L) {
      let m = a0.call(this, L);
      try {
        const k = CB14.cur(), w = CB14.WPN[k];
        if (w) m *= 1 + (w.ty === 'm' ? 0.06 * rk('tajam') : 0.08 * rk('mata')) + 0.12 * W.wupOf(k);
        if (W.cmb && W.cmb.counter && performance.now() < W.cmb.counter) {
          m *= 2;
          W.cmb.counter = 0;
          R0.float('✨ SERANG BALAS ×2', 'c');
        }
        if (W.azimat) m *= 1;
      } catch (e) {}
      return m;
    };
    R0.maxHP = function (L) {
      return Math.round(m0.call(this, L) * (1 + 0.05 * rk('nyawa') + (W.flag && W.flag('azimat') ? 0.1 : 0)));
    };
    R0.def = function (L) {
      return Math.min(0.4, d0.call(this, L) + 0.04 * rk('kebal'));
    };
  }

  /* ---------- elak · tangkis · berat ---------- */
  const C = (W.cmb = { ch: 2, chT: 0, inv: 0, blk: 0, blkT: 0, dash: null, counter: 0, combo: 0, comboT: 0, hold: 0 });
  const chargeMs = () => 1300 * (1 - 0.15 * rk('cepat'));
  function moveDir() {
    /* arah input (joystick/kekunci) dalam ruang dunia; tiada input → ke belakang */
    let ix = (P.k.r ? 1 : 0) - (P.k.l ? 1 : 0) + mv.x, iy = (P.k.f ? 1 : 0) - (P.k.b ? 1 : 0) + mv.y;
    const fx = -Math.sin(cy), fz = -Math.cos(cy);
    let wx = iy * fx - ix * fz, wz = iy * fz + ix * fx;
    const l = Math.hypot(wx, wz);
    if (l < 0.2) return [-Math.sin(rot), -Math.cos(rot)];
    return [wx / l, wz / l];
  }
  W.dodge = () => {
    if (zb || zl || C.dash) return;
    if (C.ch < 1) return R().float('🌀 Cas elak belum pulih', 'd');
    if (!use(2)) return;
    C.ch--;
    if (!C.chT) C.chT = performance.now();
    const [dx, dz] = moveDir();
    C.dash = { dx, dz, t0: performance.now(), dist: 5.2 * (1 + 0.25 * rk('jauh')), done: 0 };
    C.inv = performance.now() + 380;
    ghost();
  };
  const ghosts = [];
  function ghost() {
    try {
      const s = new T.Sprite(new T.SpriteMaterial({ map: W.puffTex || (W.puffTex = W.puff()), color: 0xbfe6ff, transparent: true, opacity: 0.6, depthWrite: false }));
      s.position.set(P.x, P.y + 0.8, P.z);
      s.scale.setScalar(1.6);
      scene.add(s);
      ghosts.push({ s, t0: performance.now() });
    } catch (e) {}
  }
  W.block = (on) => {
    const now = performance.now();
    if (on && !C.blk) C.blkT = now;
    C.blk = on ? 1 : 0;
  };
  /* kerosakan ke atas pemain → elak / tangkis / tangkisan sempurna */
  function hookHurt() {
    const R0 = R(), h0 = R0.hurtAbs;
    R0.hurtAbs = function (n, src) {
      const now = performance.now(), atk = W.lastAtk;
      W.lastAtk = null;
      if (now < C.inv) {
        R0.float('🌀 ELAK!', 'g');
        return 0;
      }
      if (C.blk) {
        const win = 220 + 60 * rk('tangkis');
        if (now - C.blkT < win) {
          R0.float('✨ TANGKISAN SEMPURNA!', 'c');
          C.counter = now + 1500;
          stagger(atk);
          if (W.ev) W.ev('parry', 1);
          return 0;
        }
        R0.float('🛡 Tangkis', '');
        return h0.call(this, n * 0.3, src);
      }
      return h0.call(this, n, src);
    };
  }
  function stagger(a) {
    if (a && a.ai) {
      a.ai.s = 'stun';
      a.ai.t = performance.now() + 1300;
      tele(a, null);
      return;
    }
    /* haiwan lama: tolak ke belakang */
    try {
      const t = CB14.nearest(3.5);
      if (t && t.g) {
        const dx = t.g.position.x - P.x, dz = t.g.position.z - P.z, l = Math.hypot(dx, dz) || 1;
        t.g.position.x += (dx / l) * 1.8;
        t.g.position.z += (dz / l) * 1.8;
      }
    } catch (e) {}
  }
  function heavy() {
    const k = CB14.cur(), w = CB14.WPN[k];
    if (!w || w.ty !== 'm') return R().float('Serangan berat hanya untuk senjata jarak dekat', '');
    if (!use(3)) return;
    const fx = Math.sin(rot), fz = Math.cos(rot), rng = w.rng * 1.25;
    let n = 0;
    CB14.targets().forEach((t) => {
      const p = t.g.position, dx = p.x - P.x, dz = p.z - P.z, d = Math.hypot(dx, dz);
      if (d > rng + ((CB14.SPEC[t.kind] && CB14.SPEC[t.kind].r) || 1) * 0.6) return;
      if ((dx * fx + dz * fz) / (d || 1) < -0.17 && d > 1) return;
      if (Math.abs(p.y - P.y) > 4) return;
      const dmg = w.dmg * R().atk() * 2.4 * (1 + 0.2 * rk('berat'));
      CB14.hitT(t, dmg, true);
      n++;
      if (t.ai && !t.boss) {
        t.g.position.x += (dx / (d || 1)) * 1.4;
        t.g.position.z += (dz / (d || 1)) * 1.4;
      }
    });
    CB14.cd = performance.now() + 700;
    R().float(n ? '💥 HENTAKAN BERAT' : '💨 Sapuan berat', n ? 'c' : '');
    swingFx(1);
  }
  function swingFx(big) {
    try {
      const m = new T.Mesh(new T.RingGeometry(0.6, big ? 3.2 : 2.2, 20, 1, -1.2, 2.4), new T.MeshBasicMaterial({ color: 0xfff3c4, transparent: true, opacity: 0.7, side: T.DoubleSide, depthWrite: false }));
      m.rotation.x = -Math.PI / 2;
      m.rotation.z = -rot - Math.PI / 2 + Math.PI;
      m.position.set(P.x, P.y + 1, P.z);
      scene.add(m);
      ghosts.push({ s: m, t0: performance.now(), ring: 1 });
    } catch (e) {}
  }
  /* kombo: kira serangan ringan berturut */
  function hookAttack() {
    const a0 = CB14.attack;
    CB14.attack = function () {
      const cd0 = CB14.cd;
      const r = a0.apply(this, arguments);
      if (CB14.cd !== cd0) {
        const now = performance.now();
        C.combo = now - C.comboT < 1100 ? C.combo + 1 : 1;
        C.comboT = now;
        if (C.combo >= 3) {
          C.combo = 0;
          const t = CB14.tgt, w = CB14.WPN[CB14.cur()];
          if (t && !t.dead && w && w.ty === 'm' && Math.hypot(t.g.position.x - P.x, t.g.position.z - P.z) < w.rng + 1.5) {
            setTimeout(() => {
              if (!t.dead) {
                CB14.hitT(t, w.dmg * R().atk() * 0.6 * (1 + 0.3 * rk('kombo')), true);
                R().float('🔥 PENAMAT KOMBO', 'c');
                swingFx(0);
              }
            }, 160);
          }
        }
      }
      return r;
    };
  }
  /* butang */
  function ui() {
    const css = document.createElement('style');
    css.textContent = `
#dg17,#bk17{position:fixed;z-index:6;width:54px;height:54px;border-radius:50%;border:2px solid rgba(255,255,255,.4);color:#fff;font-size:22px;touch-action:none;display:none;box-shadow:0 6px 16px rgba(0,0,0,.35)}
#dg17{right:116px;bottom:calc(env(safe-area-inset-bottom,0px) + 104px);background:radial-gradient(circle at 35% 30%,#38bdf8,#0369a1)}
#bk17{right:186px;bottom:calc(env(safe-area-inset-bottom,0px) + 32px);background:radial-gradient(circle at 35% 30%,#a3a3a3,#404040)}
#dg17.on,#bk17.on{transform:scale(.9);filter:brightness(1.3)}
#dg17 b{position:absolute;left:50%;bottom:-9px;transform:translateX(-50%);display:flex;gap:3px}#dg17 b i{width:8px;height:8px;border-radius:50%;background:#e0f2fe;border:1px solid #0c4a6e}#dg17 b i.e{background:#334155}
#hv17{position:fixed;right:104px;bottom:calc(env(safe-area-inset-bottom,0px) + 22px);width:74px;height:74px;border-radius:50%;pointer-events:none;z-index:7;display:none;background:conic-gradient(#fbbf24 var(--p,0%),transparent 0)}
@media(max-width:520px){#dg17{right:20px;bottom:calc(env(safe-area-inset-bottom,0px) + 172px)}#bk17{right:90px;bottom:calc(env(safe-area-inset-bottom,0px) + 172px)}#hv17{right:16px;bottom:calc(env(safe-area-inset-bottom,0px) + 96px);width:68px;height:68px}}
body.m16 #dg17,body.m16 #bk17{opacity:0!important;pointer-events:none!important}`;
    document.head.appendChild(css);
    document.body.insertAdjacentHTML('beforeend', '<button id="dg17" title="Elak (Shift)">🌀<b><i></i><i></i></b></button><button id="bk17" title="Tangkis (tahan C)">🛡</button><div id="hv17"></div>');
    const dg = $('dg17'), bk = $('bk17'), hv = $('hv17'), ab = $('atk14');
    dg.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      W.dodge();
    });
    const bon = (e) => {
      e.preventDefault();
      e.stopPropagation();
      W.block(true);
      bk.classList.add('on');
    }, boff = (e) => {
      W.block(false);
      bk.classList.remove('on');
    };
    bk.addEventListener('pointerdown', bon);
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => bk.addEventListener(t, boff));
    /* serangan berat: tahan butang serang */
    if (ab) {
      ab.addEventListener('pointerdown', () => (C.hold = performance.now()), true);
      const up = () => {
        if (C.hold && performance.now() - C.hold > 450) heavy();
        C.hold = 0;
        hv.style.display = 'none';
      };
      ['pointerup', 'pointercancel'].forEach((t) => ab.addEventListener(t, up, true));
      ab.addEventListener('pointerleave', () => {
        C.hold = 0;
        hv.style.display = 'none';
      });
    }
    addEventListener('keydown', (e) => {
      if (e.repeat) return;
      const k = e.key.toLowerCase();
      if (k === 'shift') W.dodge();
      if (k === 'c') W.block(true);
      if (k === 'f' || k === 'j') C.holdK = performance.now();
    });
    addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'c') W.block(false);
      if ((k === 'f' || k === 'j') && C.holdK && performance.now() - C.holdK > 450) heavy();
      if (k === 'f' || k === 'j') C.holdK = 0;
    });
    let ut = 0;
    W.tick((dt, now) => {
      /* pulih cas elak */
      if (C.ch < 2 && C.chT && now - C.chT > chargeMs()) {
        C.ch++;
        C.chT = C.ch < 2 ? now : 0;
      }
      /* pergerakan elak */
      if (C.dash) {
        const d = C.dash, p = Math.min(1, (now - d.t0) / 280), want = d.dist * (1 - Math.pow(1 - p, 2.2));
        const s = want - d.done;
        const nx = P.x + d.dx * s, nz = P.z + d.dz * s;
        if (!solid(nx, P.z) && !stpX(P.x, P.z, nx, P.z) && nx > XN && nx < XM) P.x = nx;
        if (!solid(P.x, nz) && !stpX(P.x, P.z, P.x, nz) && nz > ZN && nz < ZX) P.z = nz;
        d.done = want;
        if (now - d.t0 > 120 && now - d.t0 < 200 && !d.g2) {
          d.g2 = 1;
          ghost();
        }
        if (p >= 1) C.dash = null;
      }
      for (let i = ghosts.length - 1; i >= 0; i--) {
        const g = ghosts[i], k = (now - g.t0) / (g.ring ? 260 : 420);
        if (k >= 1) {
          scene.remove(g.s);
          ghosts.splice(i, 1);
          continue;
        }
        g.s.material.opacity = (g.ring ? 0.7 : 0.6) * (1 - k);
        if (!g.ring) g.s.scale.setScalar(1.6 + k * 1.2);
        else g.s.scale.setScalar(1 + k * 0.4);
      }
      /* pengisi serangan berat */
      if (C.hold) {
        const p = Math.min(1, (now - C.hold) / 450);
        if (p > 0.15) {
          hv.style.display = 'block';
          hv.style.setProperty('--p', p * 100 + '%');
        }
      }
      /* pulih nyawa di luar pertempuran (Nafas Hutan) */
      if (rk('pulih') && now - (CB14.inCombat || 0) > 6000 && GS.hp > 0 && GS.hp < 100) GS.hp = Math.min(100, GS.hp + dt * 0.5 * rk('pulih'));
      if (now - ut > 150) {
        ut = now;
        const on = ab && ab.style.display !== 'none' && !document.body.classList.contains('m16');
        dg.style.display = bk.style.display = on ? 'block' : 'none';
        dg.querySelectorAll('i').forEach((e, i) => e.classList.toggle('e', i >= C.ch));
      }
    });
  }

  /* ---------- barang baharu ---------- */
  function items() {
    Object.assign(IT, {
      bijih: ['🪨', 'Bijih Besi Gua', 30], embun: ['💧', 'Bunga Embun', 22], benang: ['🧵', 'Benang Emas', 40], loceng: ['🔔', 'Loceng Cikgu', 0],
      permata: ['💎', 'Permata Kelembai', 900], tablet: ['🗿', 'Batu Bersurat', 0], selendang: ['🧣', 'Selendang Songket', 650], madu: ['🍯', 'Madu Hutan (⚡+30 ❤️+10)', 28]
    });
    ['bijih', 'embun', 'benang', 'loceng', 'permata', 'tablet', 'selendang', 'madu'].forEach((k) => {
      IC[k] = IT[k][0];
      if (GS.inv[k] == null) GS.inv[k] = 0;
    });
    Object.assign(VAL, { bijih: 18, embun: 14, benang: 0, permata: 700, selendang: 480, madu: 20 });
    try {
      Object.assign(EF, { madu: [30, 10] });
    } catch (e) {}
    /* tombak: senjata baharu (ditempa Pak Tahir) */
    CB14.WPN.tombak = { n: '🔱 Tombak Buluh Besi', ic: '🔱', ty: 'm', dmg: 52, cd: 0.6, rng: 3.4, lv: 14, price: 0 };
  }
  W.give = (k, n) => {
    gain(k, n || 1);
  };
  const LOOT = {
    peti: [['coin', 1, 120, 260], ['madu', 0.6, 1, 2], ['ubat', 0.5, 1, 2], ['bijih', 0.4, 1, 2]],
    peti_besar: [['coin', 1, 400, 800], ['permata', 0.15, 1, 1], ['bijih', 1, 2, 4], ['tonik', 0.7, 1, 2]],
    peti_gua: [['coin', 1, 1500, 2200], ['permata', 1, 1, 1], ['bijih', 1, 4, 6], ['tonik', 1, 2, 3]]
  };
  W.loot = (tb) => {
    const L = LOOT[tb] || LOOT.peti, out = [];
    L.forEach(([k, p, a, b]) => {
      if (Math.random() > p) return;
      const n = a + Math.floor(Math.random() * (b - a + 1));
      if (k === 'coin') GS.coin += n;
      else gain(k, n);
      out.push((k === 'coin' ? '💰RM' : (IC[k] || '') + '×') + n);
    });
    tip('🎁 Peti dibuka: ' + out.join(' · '));
    try {
      R().gain(R().U(R().lv()) * (tb === 'peti_gua' ? 12 : tb === 'peti_besar' ? 4 : 1.5), 'Harta');
    } catch (e) {}
    hud();
    save();
  };

  /* ---------- MUSUH V17 ---------- */
  const SPEC17 = {
    babi_tb: { hp: 60, dmg: 10, xp: 0.9, coin: 14, name: '🐗 Babi Taring Besi', drop: [['daging', 1, 2], ['taring', 0.35, 1]], r: 1.05 },
    kumbang: { hp: 85, dmg: 14, xp: 1.3, coin: 28, name: '🐆 Harimau Kumbang', drop: [['kulit', 1, 1], ['taring', 0.4, 1]], r: 1.15 },
    kera: { hp: 38, dmg: 7, xp: 0.6, coin: 8, name: '🐒 Kera Liar', drop: [['pisang', 0.6, 2], ['fruit', 0.4, 1]], r: 0.7 },
    kelawar: { hp: 30, dmg: 8, xp: 0.6, coin: 6, name: '🦇 Kelawar Gua', drop: [['kulit', 0.2, 1]], r: 0.6 },
    golem: { hp: 120, dmg: 15, xp: 1.6, coin: 30, name: '🪨 Golem Batu', drop: [['batu', 1, 3], ['bijih', 0.55, 1]], r: 1.2 },
    raja_babi: { hp: 520, dmg: 18, xp: 12, coin: 320, name: '👑 Raja Taring Besi', drop: [['taring', 1, 3], ['kulit', 1, 2]], r: 1.8, boss: 1 },
    kelembai: { hp: 1200, dmg: 18, xp: 40, coin: 1500, name: '🗿 Kelembai Batu', drop: [['bijih', 1, 5], ['batu', 1, 6]], r: 3.2, boss: 1 }
  };
  W.SPEC17 = SPEC17;
  /* model prosedural */
  const MAT = {};
  const ms = (c, o) => MAT[c + (o ? JSON.stringify(o) : '')] || (MAT[c + (o ? JSON.stringify(o) : '')] = new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.85, flatShading: true }, o || {})));
  function mdl(kind) {
    const g = new T.Group(), body = new T.Group();
    g.add(body);
    const legs = [];
    const bx = (p, w, h, d, c, x, y, z, o) => {
      const m = new T.Mesh(new T.BoxGeometry(w, h, d), ms(c, o));
      m.position.set(x, y, z);
      m.castShadow = true;
      p.add(m);
      return m;
    };
    const sp = (p, r, c, x, y, z, sx, sy, sz, o) => {
      const m = new T.Mesh(new T.IcosahedronGeometry(r, 1), ms(c, o));
      m.position.set(x, y, z);
      m.scale.set(sx || 1, sy || 1, sz || 1);
      m.castShadow = true;
      p.add(m);
      return m;
    };
    const leg = (x, z, h, c) => {
      const q = new T.Group();
      q.position.set(x, h, z);
      bx(q, 0.16, h, 0.16, c, 0, -h / 2, 0);
      g.add(q);
      legs.push(q);
    };
    if (kind === 'babi_tb' || kind === 'raja_babi') {
      const c = kind === 'raja_babi' ? 0x3a2a22 : 0x5a4636;
      sp(body, 0.6, c, 0, 0.75, 0, 1, 0.85, 1.5);
      sp(body, 0.36, c, 0, 0.78, 0.85, 1, 0.9, 1.1);
      bx(body, 0.26, 0.22, 0.24, 0x8a6a5a, 0, 0.7, 1.22);
      [-1, 1].forEach((s) => {
        const t = new T.Mesh(new T.ConeGeometry(0.06, 0.42, 5), ms(0xd8d8d8, { metalness: 0.8, roughness: 0.3 }));
        t.position.set(s * 0.17, 0.72, 1.2);
        t.rotation.set(-0.9, 0, s * 0.5);
        body.add(t);
      });
      sp(body, 0.05, 0xff3030, -0.14, 0.92, 1.05, 1, 1, 1, { emissive: 0xff2000, emissiveIntensity: 0.9 });
      sp(body, 0.05, 0xff3030, 0.14, 0.92, 1.05, 1, 1, 1, { emissive: 0xff2000, emissiveIntensity: 0.9 });
      bx(body, 0.08, 0.3, 0.8, 0x2a1a12, 0, 1.15, 0);
      [[-0.3, 0.55], [0.3, 0.55], [-0.3, -0.55], [0.3, -0.55]].forEach(([x, z]) => leg(x, z, 0.5, c));
    } else if (kind === 'kumbang') {
      sp(body, 0.5, 0x15151a, 0, 0.75, 0, 0.9, 0.75, 1.7);
      sp(body, 0.32, 0x15151a, 0, 0.92, 0.95, 1, 0.9, 1.1);
      sp(body, 0.06, 0xfacc15, -0.12, 1.0, 1.22, 1, 1, 1, { emissive: 0xfacc15, emissiveIntensity: 1.2 });
      sp(body, 0.06, 0xfacc15, 0.12, 1.0, 1.22, 1, 1, 1, { emissive: 0xfacc15, emissiveIntensity: 1.2 });
      const tl = bx(body, 0.08, 0.08, 1.1, 0x15151a, 0, 0.95, -1.2);
      tl.rotation.x = -0.5;
      [[-0.28, 0.6], [0.28, 0.6], [-0.28, -0.6], [0.28, -0.6]].forEach(([x, z]) => leg(x, z, 0.55, 0x15151a));
    } else if (kind === 'kera') {
      sp(body, 0.35, 0x8a5a3a, 0, 0.7, 0, 1, 1.2, 0.9);
      sp(body, 0.26, 0x8a5a3a, 0, 1.25, 0.05);
      sp(body, 0.16, 0xe8b898, 0, 1.22, 0.24, 1, 0.8, 0.6);
      [-1, 1].forEach((s) => {
        const a = bx(body, 0.1, 0.7, 0.1, 0x8a5a3a, s * 0.38, 0.65, 0.1);
        a.rotation.z = s * 0.3;
      });
      [[-0.15, 0], [0.15, 0]].forEach(([x, z]) => leg(x, z, 0.4, 0x8a5a3a));
    } else if (kind === 'kelawar') {
      sp(body, 0.22, 0x2a2030, 0, 0, 0, 1, 1, 1.2);
      [-1, 1].forEach((s) => {
        const w = new T.Mesh(new T.ConeGeometry(0.5, 0.9, 3), ms(0x3a2a44, { side: T.DoubleSide }));
        w.rotation.set(0, 0, (s * Math.PI) / 2);
        w.scale.set(1, 1, 0.15);
        w.position.set(s * 0.55, 0, 0);
        body.add(w);
        legs.push(w);
      });
      sp(body, 0.04, 0xff4040, -0.08, 0.08, 0.24, 1, 1, 1, { emissive: 0xff0000, emissiveIntensity: 1 });
      sp(body, 0.04, 0xff4040, 0.08, 0.08, 0.24, 1, 1, 1, { emissive: 0xff0000, emissiveIntensity: 1 });
      body.position.y = 2.2;
    } else if (kind === 'golem' || kind === 'kelembai') {
      const big = kind === 'kelembai', c = big ? 0x6f6a62 : 0x7d776d, k = big ? 2.6 : 1;
      sp(body, 0.8 * k, c, 0, 1.6 * k, 0, 1.1, 1, 0.9);
      sp(body, 0.45 * k, c, 0, 2.6 * k, 0.15 * k);
      sp(body, 0.08 * k, 0xff7a1a, -0.17 * k, 2.68 * k, 0.5 * k, 1, 1, 1, { emissive: 0xff5a00, emissiveIntensity: 1.6 });
      sp(body, 0.08 * k, 0xff7a1a, 0.17 * k, 2.68 * k, 0.5 * k, 1, 1, 1, { emissive: 0xff5a00, emissiveIntensity: 1.6 });
      if (big) {
        /* retak bercahaya (makin terang ikut fasa) */
        const crk = new T.Mesh(new T.TorusGeometry(0.9 * k, 0.05 * k, 4, 18), ms(0xff8a2a, { emissive: 0xff4a00, emissiveIntensity: 1.2 }));
        crk.position.set(0, 1.6 * k, 0.35 * k);
        crk.rotation.y = 0.3;
        body.add(crk);
        body.userData.crk = crk;
        for (let i = 0; i < 6; i++) sp(body, 0.18 * k, 0x8b9e5a, Math.cos(i) * 0.7 * k, 2.1 * k + Math.sin(i * 3) * 0.3 * k, Math.sin(i) * 0.5 * k, 1, 0.4, 1); /* lumut */
      }
      [-1, 1].forEach((s) => {
        const a = new T.Group();
        a.position.set(s * 0.95 * k, 2.1 * k, 0);
        sp(a, 0.32 * k, c, 0, -0.5 * k, 0, 1, 1.6, 1);
        sp(a, 0.38 * k, c, 0, -1.15 * k, 0.1 * k);
        body.add(a);
        legs.push(a);
      });
      [[-0.4 * k, 0], [0.4 * k, 0]].forEach(([x, z]) => leg(x, z, 0.85 * k, c));
    }
    g.userData.legs = legs;
    g.userData.body = body;
    return g;
  }
  /* telegraf (pool) */
  const TP = [];
  function telMesh() {
    let m = TP.find((q) => !q.userData.busy);
    if (!m) {
      m = new T.Mesh(new T.RingGeometry(0.86, 1, 40), new T.MeshBasicMaterial({ color: 0xff2a2a, transparent: true, opacity: 0.55, depthWrite: false, side: T.DoubleSide }));
      m.rotation.x = -Math.PI / 2;
      m.renderOrder = 5;
      m.userData.fill = new T.Mesh(new T.CircleGeometry(1, 40), new T.MeshBasicMaterial({ color: 0xff3a3a, transparent: true, opacity: 0.22, depthWrite: false }));
      m.add(m.userData.fill);
      m.userData.fill.position.z = 0.01;
      m.userData.line = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ color: 0xff2a2a, transparent: true, opacity: 0.35, depthWrite: false, side: T.DoubleSide }));
      scene.add(m, m.userData.line);
      TP.push(m);
    }
    m.visible = true;
    m.userData.busy = 1;
    m.userData.lineOnly = 0;
    return m;
  }
  function tele(a, spec) {
    if (a.tel) {
      a.tel.visible = false;
      a.tel.userData.line.visible = false;
      a.tel.userData.busy = 0;
      a.tel = null;
    }
    if (!spec) return;
    const m = telMesh();
    a.tel = m;
    if (spec.line) {
      m.visible = false;
      const L = m.userData.line, [x0, z0, x1, z1, w] = spec.line, len = Math.hypot(x1 - x0, z1 - z0);
      L.visible = true;
      L.scale.set(w, len, 1);
      L.rotation.order = 'YXZ';
      L.rotation.set(-Math.PI / 2, Math.atan2(x1 - x0, z1 - z0), 0);
      L.position.set((x0 + x1) / 2, gY2((x0 + x1) / 2, (z0 + z1) / 2) + 0.08, (z0 + z1) / 2);
      a.tel = m;
      m.userData.lineOnly = 1;
    } else {
      m.userData.line.visible = false;
      m.position.set(spec.x, gY2(spec.x, spec.z) + 0.07, spec.z);
      m.scale.setScalar(spec.r);
      m.userData.fill.scale.setScalar(0.02);
    }
    m.userData.t0 = performance.now();
    m.userData.dur = spec.dur || 600;
  }
  /* pool kesan batu dilempar */
  const rocks = [];
  function throwRock(a, x, z) {
    const m = new T.Mesh(new T.DodecahedronGeometry(0.9, 0), ms(0x6f6a62));
    m.castShadow = true;
    scene.add(m);
    const t = { m, a, x0: a.g.position.x, y0: a.g.position.y + 7, z0: a.g.position.z, x, z, t0: performance.now(), dur: 1200, tel: null };
    const tl = { tel: null };
    tele(tl, { x, z, r: 2.6, dur: 1200 });
    t.tel = tl;
    rocks.push(t);
  }

  const E = (W.foes = []);
  function mk(kind, x, z, lv, o) {
    const g = mdl(kind);
    g.position.set(x, gY2(x, z), z);
    if (kind === 'raja_babi') g.scale.setScalar(1.7);
    scene.add(g);
    const a = { g, kind, flv: lv, lv: 0, ex: 1, hx: x, hz: z, ai: { s: 'idle', t: 0, wx: x, wz: z }, cave: !!(o && o.cave), boss: SPEC17[kind].boss ? 1 : 0, o: o || {} };
    CB14.ensure(a);
    a.onHit = () => {
      if (a.ai.s === 'idle' || a.ai.s === 'wander') a.ai.s = 'chase';
      if (a.onHit2) a.onHit2();
    };
    a.onDie = () => {
      tele(a, null);
      a.ai.s = 'dead';
      a.deadT = performance.now();
      /* jejak & tuah (kemahiran) */
      try {
        if (Math.random() < 0.15 * rk('jejak')) {
          const d = SPEC17[kind].drop[0];
          gain(d[0], 1);
          R().float('🏹 Penjejak: +' + (IC[d[0]] || '') + '1', 'g');
        }
        if (rk('tuah')) GS.coin += Math.round(SPEC17[kind].coin * (1 + a.lv * 0.15) * 0.1 * rk('tuah'));
      } catch (e) {}
      if (a.o.onDie) a.o.onDie(a);
    };
    CB14.extra.push(a);
    E.push(a);
    return a;
  }
  W.mkFoe = mk;
  W.killFoe = (a) => {
    a.ai.s = 'gone';
    a.dead = 1;
    tele(a, null);
    scene.remove(a.g);
    const i = CB14.extra.indexOf(a);
    if (i >= 0) CB14.extra.splice(i, 1);
    const j = E.indexOf(a);
    if (j >= 0) E.splice(j, 1);
  };
  /* titik kelahiran Lembah Timur (dibangkitkan semula selepas 2–4 minit) */
  const SPAWN = [
    ['babi_tb', -408, -186, 14], ['babi_tb', -412, -150, 15], ['babi_tb', -470, -150, 18], ['babi_tb', -462, -170, 18], ['babi_tb', -340, -12, 13], ['babi_tb', -256, -110, 13],
    ['kumbang', -392, -232, 20], ['kumbang', -444, -252, 21], ['kumbang', -300, -236, 20], ['kera', -432, 36, 15], ['kera', -440, 26, 15], ['kera', -392, 34, 14],
    ['kelawar', -312, -78, 19, 1], ['kelawar', -306, -74, 19, 1], ['kelawar', -314, -80, 19, 1], ['golem', -308, -114, 21, 1], ['golem', -304, -120, 21, 1]
  ];
  const slots = SPAWN.map((s) => ({ s, a: null, rt: 0 }));
  function spawnTick(now) {
    slots.forEach((sl) => {
      const [k, x, z, lv, cave] = sl.s;
      if (sl.a && sl.a.ai.s === 'dead' && now - sl.a.deadT > 1500) {
        W.killFoe(sl.a);
        sl.a = null;
        sl.rt = now + 120000 + Math.random() * 120000;
      }
      if (sl.a || now < sl.rt) return;
      if (!!cave !== W.inCave) return;
      const d = Math.hypot(P.x - x, P.z - z);
      if (d < 95 && d > 25) sl.a = mk(k, x, z, lv, { cave: !!cave });
    });
  }
  W.spawnSlots = slots;
  /* AI */
  const v3 = new T.Vector3();
  function hitPlayer(a, mult, r, cx, cz) {
    const d = Math.hypot(P.x - cx, P.z - cz);
    if (d > r || Math.abs(P.y - a.g.position.y) > 3.5) return false;
    const s = SPEC17[a.kind];
    W.lastAtk = a;
    R().hurtAbs(CB14.DMs(s.dmg, a.lv) * mult * (0.88 + Math.random() * 0.24));
    CB14.inCombat = performance.now();
    return true;
  }
  function face(a, x, z, k) {
    const t = Math.atan2(x - a.g.position.x, z - a.g.position.z);
    let d = t - a.g.rotation.y;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    a.g.rotation.y += d * Math.min(1, k);
  }
  function moveTo(a, x, z, sp, dt) {
    const dx = x - a.g.position.x, dz = z - a.g.position.z, d = Math.hypot(dx, dz);
    if (d < 0.05) return d;
    const s = Math.min(d, sp * dt), nx = a.g.position.x + (dx / d) * s, nz = a.g.position.z + (dz / d) * s;
    if (!a.cave && W.inHouse(nx, nz)) return d;
    a.g.position.x = nx;
    a.g.position.z = nz;
    a.g.position.y = gY2(nx, nz) + (a.kind === 'kelawar' ? 0 : 0);
    face(a, x, z, dt * 8);
    a.walk = (a.walk || 0) + s * 3;
    return d;
  }
  function anim(a, now) {
    const L = a.g.userData.legs, w = a.walk || 0;
    if (a.kind === 'kelawar') {
      L.forEach((q, i) => (q.rotation.x = Math.sin(now / 60 + i * 3) * 0.7));
      a.g.userData.body.position.y = 1.8 + Math.sin(now / 300) * 0.4;
      return;
    }
    if (a.kind === 'golem' || a.kind === 'kelembai') {
      L.forEach((q, i) => (q.rotation.x = (i < 2 ? Math.sin(w) * 0.5 : Math.sin(w + i * 3.1) * 0.45) + (a.ai.s === 'wind' && i < 2 ? -2.2 : 0)));
      return;
    }
    L.forEach((q, i) => (q.rotation.x = Math.sin(w + (i % 2 ? 0 : 3.1) + (i > 1 ? 1.5 : 0)) * 0.6));
    a.g.userData.body.position.y = a.ai.s === 'wind' ? -0.12 : Math.abs(Math.sin(w)) * 0.05;
  }
  function ai(a, dt, now) {
    if (a.dead || a.ai.s === 'dead' || a.ai.s === 'gone') return;
    const s = a.ai, p = a.g.position, d = Math.hypot(P.x - p.x, P.z - p.z), night = W.hour() > 19.5 || W.hour() < 5.5;
    const aggro = a.kind === 'kumbang' ? (night ? 26 : 14) : a.kind === 'kera' ? 9 : a.boss ? 40 : 16;
    if (a.cave !== W.inCave) {
      a.g.visible = false;
      return;
    }
    a.g.visible = d < 140;
    if (s.s === 'stun') {
      a.g.rotation.z = Math.sin(now / 50) * 0.15;
      if (now > s.t) {
        a.g.rotation.z = 0;
        s.s = 'chase';
      }
      return;
    }
    if (a.boss && a.kind === 'kelembai') return boss(a, dt, now, d);
    if (s.s === 'idle' || s.s === 'wander') {
      if (d < aggro && !W.inVillage(P.x, P.z)) s.s = 'chase';
      else {
        if (now > s.t) {
          s.wx = a.hx + (Math.random() - 0.5) * 14;
          s.wz = a.hz + (Math.random() - 0.5) * 14;
          s.t = now + 3000 + Math.random() * 4000;
        }
        moveTo(a, s.wx, s.wz, 1.2, dt);
      }
    } else if (s.s === 'chase') {
      if (d > 45 || Math.hypot(p.x - a.hx, p.z - a.hz) > 60 || W.inVillage(P.x, P.z)) {
        s.s = 'wander';
        s.wx = a.hx;
        s.wz = a.hz;
      } else {
        const ar = SPEC17[a.kind].r + 1.1;
        if (a.kind === 'babi_tb' || a.kind === 'raja_babi') {
          if (d < 11 && d > 3.5 && now > (s.cdC || 0)) {
            /* REMPUH: garis telegraf */
            s.s = 'wind';
            s.t = now + (a.kind === 'raja_babi' ? 650 : 780);
            const ux = (P.x - p.x) / d, uz = (P.z - p.z) / d;
            s.cx = p.x + ux * 11;
            s.cz = p.z + uz * 11;
            s.atk = 'charge';
            tele(a, { line: [p.x, p.z, s.cx, s.cz, a.kind === 'raja_babi' ? 3 : 2], dur: s.t - now });
          } else if (d <= ar) {
            s.s = 'wind';
            s.t = now + 420;
            s.atk = 'bite';
          } else moveTo(a, P.x, P.z, a.kind === 'raja_babi' ? 4.2 : 3.6, dt);
        } else if (a.kind === 'kumbang') {
          if (d < 8 && d > 3 && now > (s.cdC || 0)) {
            s.s = 'wind';
            s.t = now + 560;
            s.atk = 'pounce';
            s.cx = P.x;
            s.cz = P.z;
            tele(a, { x: P.x, z: P.z, r: 2, dur: 560 });
          } else if (d <= ar) {
            s.s = 'wind';
            s.t = now + 380;
            s.atk = 'bite';
          } else moveTo(a, P.x, P.z, night ? 5 : 4.2, dt);
        } else if (a.kind === 'golem') {
          if (d <= ar + 1) {
            s.s = 'wind';
            s.t = now + 900;
            s.atk = 'slam';
            tele(a, { x: p.x, z: p.z, r: 3.4, dur: 900 });
          } else moveTo(a, P.x, P.z, 2.1, dt);
        } else {
          /* kera / kelawar */
          if (d <= ar) {
            s.s = 'wind';
            s.t = now + (a.kind === 'kelawar' ? 300 : 330);
            s.atk = 'bite';
          } else moveTo(a, P.x, P.z, a.kind === 'kelawar' ? 5.2 : 4.4, dt);
        }
      }
    } else if (s.s === 'wind') {
      if (s.atk === 'bite' || s.atk === 'slam') face(a, P.x, P.z, dt * 10);
      if (a.tel && !a.tel.userData.lineOnly) a.tel.userData.fill.scale.setScalar(Math.min(1, (now - a.tel.userData.t0) / a.tel.userData.dur));
      if (now >= s.t) {
        if (s.atk === 'bite') {
          const fx = Math.sin(a.g.rotation.y), fz = Math.cos(a.g.rotation.y), r = SPEC17[a.kind].r;
          hitPlayer(a, 1, r + 1.4, p.x + fx * r, p.z + fz * r);
          s.s = 'rec';
          s.t = now + 650;
        } else if (s.atk === 'slam') {
          hitPlayer(a, 1.35, 3.4, p.x, p.z);
          tele(a, null);
          shake(0.25);
          s.s = 'rec';
          s.t = now + 900;
        } else if (s.atk === 'charge' || s.atk === 'pounce') {
          tele(a, null);
          s.s = 'dash';
          s.t0 = now;
          s.hit = 0;
          s.x0 = p.x;
          s.z0 = p.z;
        }
      }
    } else if (s.s === 'dash') {
      const dur = s.atk === 'pounce' ? 280 : 480, k = Math.min(1, (now - s.t0) / dur);
      const nx = s.x0 + (s.cx - s.x0) * k, nz = s.z0 + (s.cz - s.z0) * k;
      if (!W.inHouse(nx, nz)) {
        p.x = nx;
        p.z = nz;
      }
      p.y = gY2(p.x, p.z) + (s.atk === 'pounce' ? Math.sin(k * Math.PI) * 1.6 : 0);
      a.walk = (a.walk || 0) + dt * 20;
      if (!s.hit && hitPlayer(a, s.atk === 'pounce' ? 1.3 : 1.25, s.atk === 'pounce' ? 2 : 1.5, p.x, p.z)) s.hit = 1;
      if (k >= 1) {
        s.s = 'rec';
        s.t = now + 900;
        s.cdC = now + 3200 + Math.random() * 2000;
      }
    } else if (s.s === 'rec') {
      if (now > s.t) s.s = 'chase';
    }
    anim(a, now);
  }
  /* bos */
  function boss(a, dt, now, d) {
    const s = a.ai, p = a.g.position, hp = a.hp / a.mhp, ph = hp > 0.66 ? 1 : hp > 0.33 ? 2 : 3;
    if (!a.ph || a.ph !== ph) {
      if (a.ph) {
        R().float(ph === 2 ? '🗿 Kelembai mengamuk! (Fasa 2)' : '🔥 KELEMBAI MURKA! (Fasa 3)', 'd', v3.set(p.x, p.y + 9, p.z));
        tip(ph === 2 ? '🪨 Kelembai melontar batu & memanggil golem! Elak bulatan merah.' : '🌋 Fasa terakhir: gelombang gegaran — LOMPAT atau ELAK ketika gelang menghampiri!');
        if (ph === 2) for (let i = 0; i < 2; i++) mk('golem', p.x + (i ? 6 : -6), p.z + 4, a.lv - 2, { cave: true, minion: 1 });
        shake(0.6);
      }
      a.ph = ph;
      const crk = a.g.userData.body.userData.crk;
      if (crk) crk.material.emissiveIntensity = 1.2 + (ph - 1) * 1.4;
    }
    if (s.s === 'idle') {
      if (d < 22) {
        s.s = 'chase';
        tip('🗿 KELEMBAI BATU terjaga! "Siapa berani menegurku…?"');
        W.bossBar(a);
      }
      return anim(a, now);
    }
    const spd = ph === 3 ? 2.6 : 1.9;
    if (s.s === 'chase') {
      if (now > (s.next || 0)) {
        const r = Math.random();
        if (ph >= 3 && r < 0.3) {
          s.s = 'wind';
          s.atk = 'quake';
          s.t = now + 900;
          tele(a, { x: p.x, z: p.z, r: 4.5, dur: 900 });
        } else if (ph >= 2 && r < 0.6) {
          s.s = 'wind';
          s.atk = 'rock';
          s.t = now + 500;
        } else if (d < 9) {
          s.s = 'wind';
          s.atk = 'slam';
          s.t = now + (ph === 3 ? 750 : 1000);
          tele(a, { x: p.x + Math.sin(a.g.rotation.y) * 3, z: p.z + Math.cos(a.g.rotation.y) * 3, r: 5.2, dur: s.t - now });
        } else s.next = now + 300;
      }
      if (s.s === 'chase') moveTo(a, P.x, P.z, spd, dt);
    } else if (s.s === 'wind') {
      if (s.atk === 'slam') face(a, P.x, P.z, dt * 3);
      if (a.tel && !a.tel.userData.lineOnly) a.tel.userData.fill.scale.setScalar(Math.min(1, (now - a.tel.userData.t0) / a.tel.userData.dur));
      if (now >= s.t) {
        if (s.atk === 'slam') {
          const t = a.tel;
          hitPlayer(a, 1.4, 5.2, t ? t.position.x : p.x, t ? t.position.z : p.z);
          tele(a, null);
          shake(0.5);
          s.s = 'rec';
          s.t = now + (ph === 3 ? 600 : 1000);
        } else if (s.atk === 'rock') {
          const n = ph === 3 ? 3 : 2;
          for (let i = 0; i < n; i++) throwRock(a, P.x + (i ? (Math.random() - 0.5) * 6 : 0), P.z + (i ? (Math.random() - 0.5) * 6 : 0));
          s.s = 'rec';
          s.t = now + 1400;
        } else if (s.atk === 'quake') {
          tele(a, null);
          shake(0.8);
          s.wave = { t0: now, x: p.x, z: p.z, hit: 0 };
          s.s = 'rec';
          s.t = now + 1500;
        }
        s.next = now + (ph === 3 ? 900 : 1500);
      }
    } else if (s.s === 'rec') {
      if (now > s.t) s.s = 'chase';
    }
    /* gelombang gegaran: gelang membesar; terkena jika di atas tanah ketika gelang lalu */
    if (s.wave) {
      const r = ((now - s.wave.t0) / 1000) * 9;
      if (!a.wv) {
        a.wv = new T.Mesh(new T.RingGeometry(0.9, 1, 48), new T.MeshBasicMaterial({ color: 0xffa040, transparent: true, opacity: 0.8, side: T.DoubleSide, depthWrite: false }));
        a.wv.rotation.x = -Math.PI / 2;
        scene.add(a.wv);
      }
      a.wv.visible = true;
      a.wv.position.set(s.wave.x, W.CV.y + 0.12, s.wave.z);
      a.wv.scale.setScalar(Math.max(0.1, r));
      const dp = Math.hypot(P.x - s.wave.x, P.z - s.wave.z);
      if (!s.wave.hit && Math.abs(dp - r) < 0.9 && P.y - gY2(P.x, P.z) < 0.35) {
        s.wave.hit = 1;
        W.lastAtk = a;
        R().hurtAbs(CB14.DMs(SPEC17.kelembai.dmg, a.lv) * 0.9);
      }
      if (r > 18) {
        s.wave = null;
        a.wv.visible = false;
      }
    }
    anim(a, now);
  }
  W.inVillage = (x, z) => Math.hypot(x - W.F.village[0], z - W.F.village[1]) < W.F.village[2] + 4;
  let shk = 0;
  function shake(k) {
    shk = Math.max(shk, k);
  }
  W.shake = shake;
  function tickRocks(now) {
    for (let i = rocks.length - 1; i >= 0; i--) {
      const r = rocks[i], k = Math.min(1, (now - r.t0) / r.dur);
      r.m.position.set(r.x0 + (r.x - r.x0) * k, r.y0 + (gY2(r.x, r.z) - r.y0) * k + Math.sin(k * Math.PI) * 6, r.z0 + (r.z - r.z0) * k);
      r.m.rotation.x += 0.2;
      if (r.tel.tel) r.tel.tel.userData.fill.scale.setScalar(k);
      if (k >= 1) {
        W.lastAtk = r.a;
        const dd = Math.hypot(P.x - r.x, P.z - r.z);
        if (dd < 2.6) R().hurtAbs(CB14.DMs(SPEC17.kelembai.dmg, r.a.lv) * 1.1);
        tele(r.tel, null);
        scene.remove(r.m);
        rocks.splice(i, 1);
        shake(0.2);
      }
    }
  }
  /* bar nyawa bos */
  W.bossBar = (a) => {
    let b = $('bb17');
    if (!b) {
      document.body.insertAdjacentHTML('beforeend', '<div id="bb17" class="gp" style="position:fixed;top:calc(env(safe-area-inset-top,0px) + 74px);left:50%;transform:translateX(-50%);width:min(420px,80vw);padding:6px 10px;z-index:9;display:none"><b style="font:900 12px \'Plus Jakarta Sans\',sans-serif;color:#fde68a"></b><div style="height:8px;background:rgba(255,255,255,.15);border-radius:5px;overflow:hidden;margin-top:4px"><i style="display:block;height:100%;background:linear-gradient(90deg,#f97316,#dc2626);width:100%"></i></div></div>');
      b = $('bb17');
    }
    W.bossA = a;
    b.style.display = a ? 'block' : 'none';
  };

  let ft = 0;
  W.tick((dt, now) => {
    spawnTick(now);
    for (let i = 0; i < E.length; i++) ai(E[i], dt, now);
    /* musuh bukan-slot (minion, peristiwa) dibersihkan 2 s selepas mati */
    for (let i = E.length - 1; i >= 0; i--) {
      const a = E[i];
      if (a.ai.s === 'dead' && now - a.deadT > 2000 && !slots.some((q) => q.a === a)) W.killFoe(a);
    }
    tickRocks(now);
    /* animasi telegraf */
    TP.forEach((m) => {
      if (!m.visible) return;
      const k = (now - m.userData.t0) / m.userData.dur;
      m.material.opacity = 0.45 + 0.25 * Math.sin(now / 60);
      if (k > 1.6 && !m.userData.lineOnly) {
        m.visible = false;
        m.userData.busy = 0;
      }
    });
    if (shk > 0) {
      camera.position.x += (Math.random() - 0.5) * shk;
      camera.position.y += (Math.random() - 0.5) * shk;
      shk = Math.max(0, shk - dt * 1.8);
    }
    if (W.bossA) {
      const b = $('bb17'), a = W.bossA;
      if (a.dead || a.ai.s === 'gone') {
        b.style.display = 'none';
        W.bossA = null;
      } else if (now - ft > 120) {
        ft = now;
        b.querySelector('b').textContent = SPEC17[a.kind].name + ' · Lv ' + a.lv + ' · Fasa ' + (a.ph || 1);
        b.querySelector('i').style.width = Math.max(0, (a.hp / a.mhp) * 100) + '%';
      }
    }
  });

  when14(() => window.CB14 && CB14.SPEC && window.RPG14 && RPG14.hurtAbs && W.terOK && typeof IT !== 'undefined' && $('atk14'), () => {
    Object.assign(CB14.SPEC, SPEC17);
    items();
    hookStats();
    hookHurt();
    hookAttack();
    ui();
    W.combatOK = 1;
  });
})();
