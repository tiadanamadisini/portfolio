/* ===== V17 SIMULASI PENDUDUK: FSM berjadual + laluan A* + LOD AI + animasi kerja + gelembung bual + dialog berkonteks =====
   keadaan: tidur (dalam rumah) · berjalan · kerja (tani/tempa/pancing/tenun/ajar/jaga/masak/kisar/herba/ukir/buru) · makan · bual · main · tonton
   gangguan jadual: 🌧 hujan → berteduh · 🐗 serangan babi → lari ke balai · 🎭 malam wayang · 🎉 pesta · keputusan quest (cth. Mat Jenin)
   memori & reputasi: GS.v17.npc[id] = { a: kemesraan -100..100, met, td: hari terakhir bual, mem: [..] } · GS.v17.rep (reputasi kampung) */
(function () {
  'use strict';
  const W = window.W17, T = THREE;
  if (!W || !W.NPCD) return;
  const V = W.F.village, sm = W.sm;
  const ST17 = () => (GS.v17 = GS.v17 || {});
  W.npcS = (id) => {
    const s = ST17();
    s.npc = s.npc || {};
    return (s.npc[id] = s.npc[id] || { a: 0, met: 0, td: 0, mem: [] });
  };
  W.rep = (d) => {
    const s = ST17();
    s.rep = Math.max(-100, Math.min(100, (s.rep || 0) + (d || 0)));
    return s.rep;
  };
  W.aff = (id, d) => {
    const s = W.npcS(id);
    s.a = Math.max(-100, Math.min(100, s.a + (d || 0)));
    return s.a;
  };
  W.remember = (id, k) => {
    const s = W.npcS(id);
    if (s.mem.indexOf(k) < 0) s.mem.push(k);
  };
  W.knows = (id, k) => W.npcS(id).mem.indexOf(k) >= 0;
  W.flag = (k, v) => {
    const s = ST17();
    s.fl = s.fl || {};
    if (v !== undefined) s.fl[k] = v;
    return s.fl[k];
  };
  const hour = () => (6 + (GS.t || 0) / 75) % 24;

  /* ---------- graf laluan ---------- */
  const N = [], E = [];
  const node = (x, z, tag) => {
    N.push({ x, z, tag });
    E.push([]);
    return N.length - 1;
  };
  const link = (a, b) => {
    if (a === b || E[a].indexOf(b) >= 0) return;
    const d = Math.hypot(N[a].x - N[b].x, N[a].z - N[b].z);
    E[a].push(b, d);
    E[b].push(a, d);
  };
  const blocked = (x, z) =>
    (W.FOOT || []).some((r) => x > r[0] - 0.9 && x < r[2] + 0.9 && z > r[1] - 0.9 && z < r[3] + 0.9) ||
    Math.hypot(x - (V[0] - 4), z - (V[1] - 2)) < 4.6 || W.riverD(x, z) < 1.2;
  const clear = (a, b) => {
    const n = Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / 0.8);
    for (let i = 1; i < n; i++) if (blocked(a.x + ((b.x - a.x) * i) / n, a.z + ((b.z - a.z) * i) / n)) return false;
    return true;
  };
  function buildGraph() {
    const G = 5, idx = new Map();
    for (let x = V[0] - V[2]; x <= V[0] + V[2]; x += G)
      for (let z = V[1] - V[2]; z <= V[1] + V[2]; z += G) {
        if (Math.hypot(x - V[0], z - V[1]) > V[2] - 2 || blocked(x, z)) continue;
        idx.set(Math.round(x / G) + ',' + Math.round(z / G), node(x, z, 'g'));
      }
    idx.forEach((i, k) => {
      const [a, b] = k.split(',').map(Number);
      [[1, 0], [0, 1], [1, 1], [1, -1]].forEach(([da, db]) => {
        const j = idx.get(a + da + ',' + (b + db));
        if (j != null && clear(N[i], N[j])) link(i, j);
      });
    });
    /* jalan di luar kampung */
    W.ROADS.forEach((r) => {
      let prev = -1;
      for (let s = 0; s <= r.R.L; s += 6) {
        const [x, z] = r.R.at(s);
        const inV = Math.hypot(x - V[0], z - V[1]) < V[2] - 3;
        if (inV) {
          prev = -1;
          continue;
        }
        const i = node(x, z, 'r');
        if (prev >= 0) link(prev, i);
        prev = i;
      }
    });
    /* sambung nod jalan ↔ grid berdekatan */
    for (let i = 0; i < N.length; i++) {
      if (N[i].tag !== 'r') continue;
      for (let j = 0; j < N.length; j++) if (j !== i && Math.hypot(N[i].x - N[j].x, N[i].z - N[j].z) < 7.5 && clear(N[i], N[j])) link(i, j);
    }
  }
  function nearestNode(x, z) {
    let b = 0, bd = 1e18;
    for (let i = 0; i < N.length; i++) {
      const d = (N[i].x - x) ** 2 + (N[i].z - z) ** 2;
      if (d < bd && E[i].length) {
        bd = d;
        b = i;
      }
    }
    return b;
  }
  function astar(s, t) {
    if (s === t) return [s];
    const g = new Float64Array(N.length).fill(1e18), from = new Int32Array(N.length).fill(-1), open = [s], h = (i) => Math.hypot(N[i].x - N[t].x, N[i].z - N[t].z);
    g[s] = 0;
    const f = new Float64Array(N.length).fill(1e18);
    f[s] = h(s);
    const inO = new Uint8Array(N.length);
    inO[s] = 1;
    let it = 0;
    while (open.length && it++ < 4000) {
      let bi = 0;
      for (let k = 1; k < open.length; k++) if (f[open[k]] < f[open[bi]]) bi = k;
      const c = open.splice(bi, 1)[0];
      inO[c] = 0;
      if (c === t) {
        const p = [c];
        let q = c;
        while (from[q] >= 0) p.unshift((q = from[q]));
        return p;
      }
      const e = E[c];
      for (let k = 0; k < e.length; k += 2) {
        const n = e[k], ng = g[c] + e[k + 1];
        if (ng < g[n]) {
          g[n] = ng;
          from[n] = c;
          f[n] = ng + h(n);
          if (!inO[n]) {
            inO[n] = 1;
            open.push(n);
          }
        }
      }
    }
    return null;
  }
  W.path = (x0, z0, x1, z1) => {
    const a = nearestNode(x0, z0), b = nearestNode(x1, z1), p = astar(a, b);
    const out = p ? p.map((i) => [N[i].x, N[i].z]) : [];
    out.push([x1, z1]);
    return out;
  };
  W.graphN = () => N.length;

  /* ---------- tempat ---------- */
  const HUT = [[-380, -214], [-452, -160], [-262, -196], [-430, -60]];
  function placeOf(d, pl, act) {
    const S = W.SPOTS, h = W.HOUSES.find((q) => q.id === d.home) || W.HOUSES[0];
    const k = d.idx;
    const jit = (x, z, r) => [x + Math.cos(k * 2.39) * r, z + Math.sin(k * 2.39) * r];
    if (pl === 'in' || pl === 'home') return h ? jit(h.door[0], h.door[1], pl === 'in' ? 0 : 1.2) : [V[0], V[1]];
    if (pl === 'wander') {
      const r = W.rng(k * 977 + Math.floor((GS.t || 0) / 200) + (GS.day || 0) * 31)();
      const a = r * 6.283, rr = 8 + ((r * 7919) % 1) * 22;
      const p = [V[0] + Math.cos(a) * rr, V[1] + Math.sin(a) * rr];
      return blocked(p[0], p[1]) ? jit(V[0] + 3, V[1] + 6, 3) : p;
    }
    if (pl === 'hutan') return HUT[k % HUT.length];
    if (pl === 'padang') return jit(W.F.meadow[0], W.F.meadow[1], 6 + (k % 4) * 3);
    if (pl === 'ladang') return jit(S.ladang[0], S.ladang[1], 3 + (k % 3) * 3);
    if (pl === 'jeti') return d.id === 'daud' ? [S.jeti[0], S.jeti[1]] : jit(S.jeti[0] + 9, S.jeti[1] - 2, 2.5);
    if (pl === 'menara') return S.menara;
    if (pl === 'balai') return act === 'work:study' ? jit(S.balai[0], S.balai[1] - 5, 2.5) : jit(S.balai[0], S.balai[1], 2.2);
    const s = S[pl];
    if (!s) return [V[0], V[1]];
    return jit(s[0], s[1], pl === 'dataran' ? 4.5 : 1.4);
  }

  /* ---------- penggantian jadual (cuaca, peristiwa, pesta, keputusan quest) ---------- */
  const OUT = /farm|fish|forage|hunt|herb|stroll|play|climb|train/;
  function activity(d) {
    const h = hour();
    let blk = d.sch[d.sch.length - 1];
    for (const b of d.sch) if (h >= b[0]) blk = b;
    let act = blk[1], pl = blk[2];
    const day = GS.day || 1, dow = day % 7;
    /* Mat Jenin: keputusan quest mengubah jadualnya */
    if (d.id === 'matjenin' && W.flag('mj') === 'kerja' && /idle|stroll/.test(act) && h > 8 && h < 18) (act = 'work:farm'), (pl = 'ladang');
    /* malam wayang kulit (Tok Dalang Wahab, hari ke-4) */
    const pf = W.NPCD.find((q) => q.id === 'wahab').perf;
    const wy = dow === pf[0] && h >= pf[1] && h < pf[2] && !W.raining();
    if (wy) {
      if (d.id === 'wahab') return ['perform', 'balai'];
      if (!/sleep|guard/.test(act) && d.idx % 4 !== 3) return ['watch', 'balai'];
    }
    /* pesta air terjun (selepas Kelembai ditewaskan) */
    if (W.flag('fest') === day && h >= 19 && h < 23.5 && d.id !== 'leman') return ['chat', 'dataran'];
    /* peristiwa dunia */
    const ev = W.evt && W.evt.cur;
    if (ev && ev.npc) {
      const o = ev.npc(d, act, pl);
      if (o) return o;
    }
    /* hujan: berteduh */
    if (W.raining() && OUT.test(act) && d.id !== 'bujang') return d.idx % 3 === 0 ? ['chat', 'balai'] : ['idle', 'home'];
    return [act, pl];
  }

  /* ---------- binaan NPC ---------- */
  W.npcs = [];
  function spawn() {
    W.NPCD.forEach((d, i) => {
      d.idx = i;
      const [x, z] = placeOf(d, 'home', 'idle');
      const g = W8.mkP(Object.assign({ n: d.n, x, z, ry: 0, say: d.say }, d.look));
      const u = g.userData;
      u.v17 = d.id;
      u.w = 1e9; /* pergerakan dikawal V17, bukan gelung asal */
      const e = { d, g, path: null, pi: 0, act: 'idle', pl: 'home', key: '', hid: false, sp: d.look.s && d.look.s < 0.8 ? 2.2 : 1.55, bub: null, bubT: 0, next: 0, ph: Math.random() * 6 };
      W.npcs.push(e);
    });
    try {
      if (window.NPC15 && NPC15.ok) NPC15.scan();
    } catch (e) {}
  }
  const vis = (e, on) => {
    if (e.hid === !on) return;
    e.hid = !on;
    e.g.visible = on;
    const i = npcs.indexOf(e.g);
    if (on && i < 0) npcs.push(e.g);
    if (!on && i >= 0) npcs.splice(i, 1);
    if (e.g.userData.rod) e.g.userData.rod.visible = on && e.act === 'work:fish';
  };

  /* ---------- gelembung bual ---------- */
  function bubble(e, txt) {
    if (!e.bub) {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 96;
      const t = new T.CanvasTexture(c);
      const s = new T.Sprite(new T.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
      s.scale.set(3.6, 0.68, 1);
      s.renderOrder = 998;
      s.userData.c = c;
      scene.add(s);
      e.bub = s;
    }
    const c = e.bub.userData.c, g = c.getContext('2d');
    g.clearRect(0, 0, 512, 96);
    g.font = '700 26px "Plus Jakarta Sans",system-ui,sans-serif';
    let t = txt.length > 34 ? txt.slice(0, 33) + '…' : txt;
    const w = Math.min(500, g.measureText(t).width + 36);
    g.fillStyle = 'rgba(255,255,255,.93)';
    const x0 = (512 - w) / 2;
    g.beginPath();
    g.moveTo(x0 + 16, 8);
    g.arcTo(x0 + w, 8, x0 + w, 70, 16);
    g.arcTo(x0 + w, 70, x0, 70, 16);
    g.arcTo(x0, 70, x0, 8, 16);
    g.arcTo(x0, 8, x0 + w, 8, 16);
    g.fill();
    g.beginPath();
    g.moveTo(246, 70);
    g.lineTo(256, 90);
    g.lineTo(266, 70);
    g.fill();
    g.fillStyle = '#1e293b';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(t, 256, 40);
    e.bub.material.map.needsUpdate = true;
    e.bub.visible = true;
    e.bubT = W.now + 3800;
  }
  const BARK = {
    'work:farm': ['Fuh, panas!', 'Padi ni dah tinggi.', 'Babi hutan, jangan datang lagi!'],
    'work:forge': ['*TANG! TANG!*', 'Bara kurang panas!', 'Besi ni degil.'],
    'work:fish': ['Makan… makanlah umpan…', 'Ha! Dapat!', 'Ikan tasik cerdik.'],
    'work:weave': ['Satu benang, satu doa.', 'Corak pucuk rebung…'],
    'work:shop': ['Mari, mari, beli!', 'Barang baru sampai!', 'Murah, murah!'],
    'work:cook': ['Wanginya!', 'Garam sikit lagi.', 'Santan dah pecah minyak.'],
    'work:teach': ['Ulang selepas cikgu!', 'Haris, duduk diam!'],
    'work:guard': ['Semua aman…', 'Zzz… eh! Tak tidur!'],
    'work:mill': ['Pusing, kincir, pusing!', 'Bilah ni goyang…'],
    'work:herb': ['Daun ini untuk demam.', 'Embun pagi paling mujarab.'],
    'work:carve': ['Ukur dua kali…', 'Kayu cengal ni keras!'],
    'work:hunt': ['…', 'Jejak segar.'],
    'work:train': ['Hiaah!', 'Satu… dua… tangkis!'],
    'work:study': ['A, B, C…', 'Satu tambah satu…'],
    'work:climb': ['Kelapa muda!', 'Jangan jatuh, Mat…'],
    play: ['Kejar aku!', 'Hahaha!', 'Tak dapat!'],
    eat: ['Sedapnya…', 'Alhamdulillah, kenyang.'],
    watch: ['Hebatnya wayang!', 'Shhh!', 'Ha ha ha!'],
    perform: ['Maka berkatalah Kelembai…', '*bunyi gendang*'],
    flee: ['Babi hutan!', 'Lari!', 'Tolong!']
  };

  /* ---------- kemas kini ---------- */
  let tAI = 0;
  function think(e) {
    const [act, pl] = activity(e.d);
    const key = act + '@' + pl + (pl === 'wander' ? Math.floor((GS.t || 0) / 200) : '');
    if (key === e.key) return;
    e.key = key;
    e.act = act;
    e.pl = pl;
    if (act === 'lost') {
      /* dikawal peristiwa dunia (cth. kanak-kanak hilang) */
      e.path = null;
      e.arr = true;
      if (e.hid) vis(e, true);
      return;
    }
    const tgt = placeOf(e.d, pl, act);
    e.tgt = tgt;
    const u = e.g.userData;
    u.run = null;
    u.sit = 0;
    if (e.g.userData.rod) e.g.userData.rod.visible = false;
    e.path = W.path(e.g.position.x, e.g.position.z, tgt[0], tgt[1]);
    e.pi = 0;
    e.arr = false;
    if (act !== 'sleep' && e.hid) vis(e, true);
  }
  function arrive(e) {
    e.arr = true;
    const u = e.g.userData, a = e.act;
    if (a === 'sleep') return vis(e, false);
    if (/work:(weave|carve|herb)|eat|watch/.test(a) && !(a === 'work:herb' && e.pl === 'padang')) u.sit = 1;
    if (a === 'work:fish') {
      u.sit = 1;
      if (!u.rod) W8.rodOn(e.g, 2.6);
      u.rod.visible = true;
      e.g.rotation.y = W.SPOTS.jeti[2] || -Math.PI / 2;
    }
    if (a === 'play') u.run = [e.tgt[0], e.tgt[1], 2.2 + (e.d.idx % 3), Math.random() * 6];
  }
  const facing = (g, x, z) => (g.rotation.y = Math.atan2(x - g.position.x, z - g.position.z));
  function animate(e, dt, t) {
    const u = e.g.userData, g = e.g, a = e.act;
    if (u.run) return; /* gelung asal W8.np animasi berlari */
    const s = Math.sin(t * 9 + e.ph);
    if (!e.arr) {
      u.L.rotation.x = s * 0.6;
      u.R.rotation.x = -s * 0.6;
      u.AL.rotation.x = -s * 0.5;
      u.AR.rotation.x = s * 0.5;
      return;
    }
    if (!u.sit) {
      u.L.rotation.x *= 0.8;
      u.R.rotation.x *= 0.8;
    }
    const k = Math.sin(t * 4 + e.ph);
    if (a === 'work:farm') {
      u.AR.rotation.x = u.AL.rotation.x = -1.3 + Math.max(0, k) * 1.1;
      g.position.y += Math.max(0, -k) * 0.04;
    } else if (a === 'work:forge') {
      u.AR.rotation.x = -2.4 + Math.abs(Math.sin(t * 5.5 + e.ph)) * 1.9;
      u.AL.rotation.x = -0.7;
    } else if (a === 'work:train') {
      u.AR.rotation.x = -1.6 + Math.sin(t * 8) * 1.2;
      u.AL.rotation.x = -1.6 - Math.sin(t * 8) * 1.2;
      g.rotation.y += Math.sin(t * 2) * 0.03;
    } else if (/work:(weave|carve|herb|cook|shop)/.test(a)) {
      u.AR.rotation.x = -0.9 + Math.sin(t * 3 + e.ph) * 0.35;
      u.AL.rotation.x = -0.9 - Math.sin(t * 3.3 + e.ph) * 0.3;
    } else if (a === 'work:teach' || a === 'work:lead' || a === 'perform') {
      u.AR.rotation.x = -1.2 + Math.sin(t * 1.3 + e.ph) * 0.9;
      u.AL.rotation.x = a === 'perform' ? -1.4 + Math.cos(t * 2) * 0.6 : 0;
    } else if (a === 'work:guard') {
      g.rotation.y += dt * 0.25;
    } else if (a === 'chat') {
      u.AR.rotation.x = -0.4 + Math.max(0, Math.sin(t * 1.7 + e.ph)) * -0.9;
    } else if (a === 'flee') {
      u.L.rotation.x = s;
      u.R.rotation.x = -s;
    }
  }
  function step(e, dt, t, near) {
    const g = e.g, p = e.path;
    let y0 = null;
    if (p && e.pi < p.length && !e.g.userData.run) {
      const [tx, tz] = p[e.pi], dx = tx - g.position.x, dz = tz - g.position.z, d = Math.hypot(dx, dz);
      const sp = (e.act === 'flee' ? 3.4 : e.sp) * (near ? 1 : 3) * dt;
      if (!near && d > 0.1) {
        /* LOD: NPC jauh → bergerak terus per nod (tanpa animasi) */
        g.position.x = tx;
        g.position.z = tz;
        e.pi++;
      } else if (d <= sp) {
        g.position.x = tx;
        g.position.z = tz;
        e.pi++;
      } else {
        g.position.x += (dx / d) * sp;
        g.position.z += (dz / d) * sp;
        g.rotation.y = Math.atan2(dx, dz);
      }
      if (e.pi >= p.length) arrive(e);
    } else if (!e.arr) arrive(e);
    /* ketinggian */
    if (!e.g.userData.run) {
      if (e.act === 'work:guard' && e.arr && W.SPOTS.menaraTop) {
        const m = W.SPOTS.menaraTop;
        g.position.set(m[0], m[2], m[1]);
      } else {
        const b = W8.onDk ? W8.onDk(g.position.x, g.position.z) : null;
        y0 = b != null ? b : W.H(g.position.x, g.position.z);
        g.position.y = y0 + (e.g.userData.sit ? -0.38 : 0);
      }
    }
    /* tonton/bual: menghadap sasaran */
    if (e.arr && near) {
      if (e.act === 'watch') facing(g, W.SPOTS.balai[0], W.SPOTS.balai[1] - 3);
      else if (e.act === 'chat' && e.mate) facing(g, e.mate.g.position.x, e.mate.g.position.z);
      else if (e.act === 'work:study') facing(g, W.SPOTS.balai[0], W.SPOTS.balai[1]);
    }
    if (near && !e.hid) animate(e, dt, t);
  }
  function social() {
    /* pasangkan NPC yang bual di tempat sama */
    const grp = {};
    W.npcs.forEach((e) => {
      e.mate = null;
      if (e.act === 'chat' && e.arr && !e.hid) (grp[e.pl] = grp[e.pl] || []).push(e);
    });
    Object.values(grp).forEach((l) => l.forEach((e, i) => (e.mate = l[i ^ 1] || (l.length > 1 ? l[0] : null))));
  }
  let tSoc = 0, tBark = 0;
  function tick(dt, now) {
    const t = now / 1000;
    const think1 = now - tAI > 500;
    if (think1) tAI = now;
    for (const e of W.npcs) {
      if (think1) think(e);
      const d = Math.hypot(e.g.position.x - P.x, e.g.position.z - P.z), near = d < 110 && !W.inCave;
      if (!e.hid) e.g.visible = d < 160 && !W.inCave;
      step(e, dt, t, near);
      if (e.bub) {
        e.bub.visible = now < e.bubT && e.g.visible && d < 30;
        if (e.bub.visible) e.bub.position.set(e.g.position.x, e.g.position.y + 2.95 * (e.g.scale.y || 1), e.g.position.z);
      }
    }
    if (now - tSoc > 2000) {
      tSoc = now;
      social();
    }
    /* gelembung ambien: NPC berdekatan pemain sekali-sekala bersuara */
    if (now - tBark > 2600) {
      tBark = now;
      const c = W.npcs.filter((e) => !e.hid && e.arr && Math.hypot(e.g.position.x - P.x, e.g.position.z - P.z) < 16 && now > e.bubT + 6000);
      if (c.length) {
        const e = c[(Math.random() * c.length) | 0];
        let L = BARK[e.act];
        if (e.act === 'chat' && e.mate) {
          const g = e.d.gos;
          L = [g[(Math.random() * g.length) | 0]];
        }
        if (L) bubble(e, L[(Math.random() * L.length) | 0]);
      }
    }
  }
  W.bubble = bubble;

  /* ---------- dialog ---------- */
  const tod = (h) => (h >= 5 && h < 12 ? 'pagi' : h >= 12 && h < 19 ? 'petang' : 'malam');
  const pick = (a) => a[(Math.random() * a.length) | 0];
  W.npcById = (id) => W.npcs.find((e) => e.d.id === id);
  W.nameOf = (id) => {
    const e = W.npcById(id);
    return e ? e.d.n : id;
  };
  W.MEMLINE = {}; /* kunci memori → baris dialog (diisi modul quest) */
  function talkText(e) {
    const d = e.d, s = W.npcS(d.id), h = hour(), rep = ST17().rep || 0;
    const parts = [];
    if (!s.met) parts.push('Kenalkan, saya <b>' + d.n + '</b> — ' + d.job.toLowerCase() + '.');
    else parts.push(W.GREET[d.per][tod(h)]);
    /* memori: perkara terbaru yang pemain lakukan */
    const mem = s.mem.slice().reverse().find((k) => W.MEMLINE[k] && W.MEMLINE[k][d.id]);
    if (mem && Math.random() < 0.7) parts.push(W.MEMLINE[mem][d.id]);
    else if (W.raining()) parts.push(d.rain);
    else if (h >= 20 || h < 5) parts.push(d.night);
    else if (/^work/.test(e.act) && Math.random() < 0.6) parts.push(pick(d.work));
    else parts.push(pick(d.say));
    /* reputasi & kemesraan */
    if (s.a >= 40 || rep >= 50) parts.push('<i>' + d.hi + '</i>');
    else if (s.a <= -20 || rep <= -30) parts.push('<i>' + d.lo + '</i>');
    return parts.join(' ');
  }
  W.talkText = talkText;
  function giftMenu(e) {
    const d = e.d, like = W.LIKE[d.id] || [];
    const inv = Object.keys(GS.inv || {}).filter((k) => GS.inv[k] > 0 && typeof IT !== 'undefined' && IT[k]).sort((a, b) => (like.includes(b) ? 1 : 0) - (like.includes(a) ? 1 : 0)).slice(0, 6);
    if (!inv.length) return QS14.dlg(d.n, '🎁', 'Kamu tiada barang untuk dihadiahkan.', null, [['Tutup', null]]);
    QS14.dlg(d.n, '🎁', 'Mahu beri apa kepada ' + d.n + '?', '💡 ' + d.n + ' suka: ' + like.map((k) => (IT[k] ? IT[k][0] + ' ' + IT[k][1] : k)).join(', '),
      inv.map((k) => [IT[k][0] + ' ' + IT[k][1], () => {
        const s = W.npcS(d.id);
        if (s.gd === GS.day) return QS14.dlg(d.n, '🙂', 'Terima kasih, tapi kamu dah beri hadiah hari ini. Esok pula ya!', null, [['OK', null]]);
        GS.inv[k]--;
        s.gd = GS.day;
        const lk = like.includes(k), d0 = lk ? 10 : 3;
        W.aff(d.id, d0);
        if (lk) W.remember(d.id, 'gift_' + k);
        try {
          RPG14.float((lk ? '💖 ' : '🙂 ') + d.n + ' +' + d0, 'g');
        } catch (er) {}
        QS14.dlg(d.n, lk ? '💖' : '🙂', lk ? 'Wah! Ini kegemaran saya! Terima kasih banyak-banyak!' : 'Terima kasih, baik hati kamu.', null, [['😊', null]]);
        hud();
        save();
      }]).concat([['Batal', null]]));
  }
  W.talk = function (e) {
    const d = e.d, s = W.npcS(d.id);
    const first = !s.met, txt = talkText(e);
    s.met = 1;
    if (s.td !== GS.day) {
      s.td = GS.day;
      W.aff(d.id, 1);
    }
    facing(e.g, P.x, P.z);
    const btn = [];
    const qb = W.Q && W.Q.forNpc ? W.Q.forNpc(d.id) : [];
    qb.forEach((b) => btn.push(b));
    btn.push(['💬 Sembang', () => {
      const g = pick(d.gos);
      if (s.gs !== GS.day) {
        s.gs = GS.day;
        W.aff(d.id, 1);
      }
      QS14.dlg(d.n, '💬', g, first ? '📖 ' + d.bio : null, [['👍', null], ['🎁 Beri hadiah', () => giftMenu(e)]]);
    }]);
    btn.push(['👤 Kenali', () => {
      const fam = Object.keys(d.fam || {}).map((k) => k + ': ' + [].concat(d.fam[k]).map(W.nameOf).join(' & ')).join(' · ');
      const sx = W.npcS(d.id);
      QS14.dlg(d.n, '👤', '📖 ' + d.bio,
        '💼 ' + d.job + ' · 🏠 ' + ((W.HOUSES.find((q) => q.id === d.home) || {}).n || '-') + (fam ? '<br>👪 ' + fam : '') + (d.kawan ? '<br>🤝 Kawan: ' + d.kawan.map(W.nameOf).join(', ') : '') +
          '<br>💗 Kemesraan: ' + sx.a + ' · 🕐 Sekarang: ' + actName(e.act),
        [['OK', null]]);
    }]);
    if (d.shop && W.shop) btn.push(['🛍 ' + (d.shop === 'besi' ? 'Tempa & naik taraf' : 'Kedai'), () => W.shop(d.shop, e)]);
    btn.push(['Tutup', null]);
    QS14.dlg(d.n, first ? '👋' : '💬', txt, null, btn.slice(0, 6));
    if (W.ev) W.ev('talk_' + d.id, 1);
    save();
  };
  const AN = {
    sleep: 'tidur', idle: 'berehat', eat: 'makan', chat: 'berbual', stroll: 'bersiar-siar', play: 'bermain', watch: 'menonton wayang', perform: 'bermain wayang kulit', flee: 'melarikan diri!',
    'work:farm': 'bertani', 'work:forge': 'menempa', 'work:fish': 'memancing', 'work:weave': 'menenun', 'work:shop': 'berniaga', 'work:cook': 'memasak', 'work:teach': 'mengajar',
    'work:guard': 'berjaga', 'work:mill': 'menjaga kincir', 'work:herb': 'meramu herba', 'work:carve': 'mengukir', 'work:hunt': 'memburu', 'work:train': 'berlatih silat',
    'work:study': 'belajar', 'work:climb': 'memanjat kelapa', 'work:lead': 'bermesyuarat', 'work:forage': 'mencari hasil hutan'
  };
  const actName = (a) => AN[a] || a;
  W.actName = actName;
  function hookTalk() {
    const f0 = npST.f, l0 = npST.lb;
    npST.f = function () {
      if (nn && nn.userData && nn.userData.v17) {
        const e = W.npcs.find((q) => q.g === nn);
        if (e) return W.talk(e);
      }
      return f0.apply(this, arguments);
    };
    npST.lb = function () {
      if (nn && nn.userData && nn.userData.v17) {
        const e = W.npcs.find((q) => q.g === nn);
        if (e) return '💬 ' + e.d.n + ' · ' + actName(e.act);
      }
      return l0.apply(this, arguments);
    };
  }

  when14(() => W.villOK && W.HOUSES.length > 10 && typeof npST !== 'undefined' && W8.mkP && typeof QS14 !== 'undefined' && QS14.dlg, () => {
    buildGraph();
    spawn();
    hookTalk();
    W.tick(tick);
    W.npcOK = 1;
    console.log('V17 penduduk: ' + W.npcs.length + ' NPC · graf ' + N.length + ' nod');
  });
})();
