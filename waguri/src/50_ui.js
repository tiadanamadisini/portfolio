/* ===== V17 UI: penjejak objektif (kompas + penanda 3D) · panel 🧭 Lembah Timur (Misi · Penduduk · Kemahiran · Dunia) ·
   sepanduk kawasan · "Apa yang baharu v17" ===== */
(function () {
  'use strict';
  const W = window.W17, T = THREE;
  if (!W) return;
  const R = () => window.RPG14;
  const S7 = () => (GS.v17 = GS.v17 || {});
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const css = document.createElement('style');
  css.textContent = `
#trk17{font-size:10.5px;margin-top:5px;padding-top:5px;border-top:1px solid rgba(255,255,255,.15);color:#e0f2fe;display:none;align-items:center;gap:6px}
#trk17 i{font-style:normal;display:inline-block;width:18px;height:18px;line-height:18px;text-align:center;border-radius:50%;background:#0ea5e9;color:#fff;font-size:11px;flex:none}
#trk17 b{color:#7dd3fc}
#jb17{position:fixed;top:calc(env(safe-area-inset-top,0px) + 10px);left:calc(50% + 76px);height:34px;padding:0 11px;border-radius:999px;font:800 12px 'Plus Jakarta Sans',sans-serif;color:#e0f2fe;z-index:8;border:1px solid rgba(125,211,252,.45)}
#jp17{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(560px,94vw);max-height:min(82vh,720px);z-index:40;display:none;flex-direction:column;padding:12px;box-sizing:border-box}
#jp17.o{display:flex}
#jp17 .hd{display:flex;align-items:center;gap:8px;margin-bottom:8px}#jp17 .hd b{flex:1;font:900 15px 'Plus Jakarta Sans',sans-serif;color:#fff}
#jp17 .tb{display:flex;gap:5px;margin-bottom:8px;flex-wrap:wrap}#jp17 .tb .b{padding:7px 10px;font-size:11.5px}#jp17 .tb .b.on{background:rgba(56,189,248,.35)}
#jp17 .bd{overflow-y:auto;flex:1;min-height:0;font-size:11.5px;line-height:1.45;padding-right:2px;-webkit-overflow-scrolling:touch}
#jp17 .cd{background:rgba(255,255,255,.07);border-radius:12px;padding:8px 10px;margin-bottom:6px}
#jp17 .cd.dn{opacity:.55}#jp17 .cd.cur{border:1px solid #38bdf8}
#jp17 h4{margin:8px 2px 5px;font:900 10.5px 'Plus Jakarta Sans',sans-serif;letter-spacing:.6px;text-transform:uppercase;color:#fbbf24}
#jp17 .st{display:block;color:#cbd5e1;font-size:11px}#jp17 .st.ok{color:#86efac}#jp17 .st.now{color:#7dd3fc;font-weight:800}
#jp17 .sk{display:grid;grid-template-columns:repeat(2,1fr);gap:6px}#jp17 .sk .cd{margin:0}
#jp17 .pip{display:inline-block;width:9px;height:9px;border-radius:50%;background:#334155;margin-right:3px;border:1px solid #64748b}#jp17 .pip.on{background:#fbbf24;border-color:#fbbf24}
#jp17 .np{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px}#jp17 .np .cd{margin:0}
#jp17 small{color:#94a3b8}
#ban17{position:fixed;left:50%;top:28%;transform:translate(-50%,-50%);z-index:26;pointer-events:none;text-align:center;opacity:0;transition:opacity .8s}
#ban17.o{opacity:1}#ban17 b{display:block;font:900 30px 'Plus Jakarta Sans',sans-serif;color:#fff;text-shadow:0 2px 10px #000,0 0 30px #0ea5e9;letter-spacing:1px}#ban17 span{font:700 13px 'Plus Jakarta Sans',sans-serif;color:#e0f2fe;text-shadow:0 2px 4px #000}
@media(max-width:600px){#jb17{left:auto;right:12px;top:calc(env(safe-area-inset-top,0px) + 168px)}}`;
  document.head.appendChild(css);
  document.body.insertAdjacentHTML('beforeend', '<button id="jb17" class="gp">🧭 Lembah Timur</button><div id="jp17" class="gp"></div><div id="ban17"><b></b><span></span></div>');
  const jp = $('jp17');
  $('jb17').onclick = () => open('misi');

  /* ---------- sasaran objektif ---------- */
  function target() {
    if (W.evtTarget) return { x: W.evtTarget[0], z: W.evtTarget[1], t: W.evt.cur ? W.evt.cur.n : 'Peristiwa' };
    const id = S7().trk;
    if (!id || !W.Q) return null;
    const q = W.Q.get(id), s = W.Q.st(id);
    if (!q || s.s !== 1) return null;
    const st = W.Q.step(q);
    if (!st) return null;
    let p = null;
    if (st.npc) {
      const e = W.npcById(st.npc);
      if (e) p = [e.g.position.x, e.g.position.z];
    } else if (st.at) p = typeof st.at === 'string' ? (st.at === 'cave' ? W.F.cave : st.at === 'padang' ? W.F.meadow : W.SPOTS[st.at]) : st.at;
    if (st.inCave && !W.inCave) p = W.F.cave;
    return { x: p ? p[0] : null, z: p ? p[1] : null, t: q.t, d: st.d };
  }
  W.target = target;
  /* penanda 3D: tiang cahaya */
  const bm = new T.Mesh(new T.CylinderGeometry(0.35, 0.35, 40, 8, 1, true), new T.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.28, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide }));
  bm.visible = false;
  bm.renderOrder = 6;
  scene.add(bm);
  let tk = 0;
  W.tick((dt, now) => {
    const g = target();
    bm.visible = !!(g && g.x != null) && !W.inCave;
    if (bm.visible) {
      bm.position.set(g.x, W.H(g.x, g.z) + 20, g.z);
      bm.material.opacity = 0.2 + 0.1 * Math.sin(now / 300);
      const d = Math.hypot(P.x - g.x, P.z - g.z);
      bm.scale.set(1, 1, 1);
      bm.visible = d > 6;
    }
    if (now - tk < 250) return;
    tk = now;
    let e = $('trk17');
    if (!e) {
      const qp = $('qp');
      if (!qp) return;
      e = document.createElement('div');
      e.id = 'trk17';
      e.innerHTML = '<i>⬆</i><span></span>';
      qp.appendChild(e);
    }
    if (!g) {
      e.style.display = 'none';
      return;
    }
    e.style.display = 'flex';
    let txt = '<b>' + esc(g.t) + '</b>' + (g.d ? ' · ' + esc(g.d) : '');
    if (g.x != null) {
      const dx = g.x - P.x, dz = g.z - P.z, d = Math.hypot(dx, dz);
      /* anak panah relatif kamera: 0° = depan */
      const a = Math.atan2(dx, dz) - (cy + Math.PI);
      e.firstChild.style.transform = 'rotate(' + (-a * 180) / Math.PI + 'deg)';
      txt += ' · ' + (d < 1000 ? Math.round(d) + ' m' : (d / 1000).toFixed(1) + ' km');
    }
    e.lastChild.innerHTML = txt;
  });

  /* ---------- panel ---------- */
  let tab = 'misi';
  function open(t) {
    tab = t || tab;
    jp.classList.add('o');
    render();
  }
  W.openJ = open;
  function render() {
    const tabs = [['misi', '📜 Misi'], ['npc', '👥 Penduduk'], ['sk', '🌳 Kemahiran (' + W.skPts() + ')'], ['dunia', '🌍 Dunia']];
    let h = '<div class="hd"><b>🧭 Lembah Timur</b><button class="b" id="jx17">✕</button></div><div class="tb">' + tabs.map(([k, n]) => '<button class="b' + (k === tab ? ' on' : '') + '" data-t="' + k + '">' + n + '</button>').join('') + '</div><div class="bd">';
    if (tab === 'misi') h += misi();
    else if (tab === 'npc') h += npc();
    else if (tab === 'sk') h += skills();
    else h += dunia();
    jp.innerHTML = h + '</div>';
    $('jx17').onclick = () => jp.classList.remove('o');
    jp.querySelectorAll('[data-t]').forEach((b) => (b.onclick = () => open(b.dataset.t)));
    jp.querySelectorAll('[data-trk]').forEach((b) => (b.onclick = () => {
      S7().trk = b.dataset.trk;
      render();
    }));
    jp.querySelectorAll('[data-sk]').forEach((b) => (b.onclick = () => {
      if (W.learn(b.dataset.sk)) {
        tip('🌳 Kemahiran dipelajari!');
        hud();
      } else tip('Tiada mata kemahiran / sudah maksimum');
      render();
    }));
  }
  function misi() {
    const L = W.QDEF, grp = { main: '📖 Bab Timur — Air Terjun yang Membisu', side: '❗ Misi Sampingan', hidden: '🔮 Tersembunyi' };
    let h = '';
    Object.keys(grp).forEach((k) => {
      const qs = L.filter((q) => q.k === k && !(q.hidden && !W.Q.st(q.id).s));
      if (!qs.length) return;
      h += '<h4>' + grp[k] + '</h4>';
      qs.forEach((q) => {
        const s = W.Q.st(q.id), cur = S7().trk === q.id;
        h += '<div class="cd' + (s.s === 2 ? ' dn' : '') + (cur ? ' cur' : '') + '"><b>' + (s.s === 2 ? '✅ ' : s.s === 1 ? '▶️ ' : '⬜ ') + esc(q.t) + '</b> <small>· Lv ' + q.lv + (q.giver && W.npcById(q.giver) ? ' · ' + esc(W.nameOf(q.giver)) : q.giver === 'ketua' ? ' · Tok Ketua' : '') + '</small><br><small>' + esc(q.d) + '</small>';
        if (s.s === 1) {
          q.steps.forEach((st, i) => {
            if (st.skip && st.skip()) return;
            h += '<span class="st' + (i < s.step ? ' ok' : i === s.step ? ' now' : '') + '">' + (i < s.step ? '✔ ' : i === s.step ? '➤ ' : '· ') + esc(st.d) + (i === s.step && st.ty === 'ev' ? ' (' + s.pg + '/' + st.n + ')' : '') + '</span>';
          });
          if (!cur) h += '<button class="b" data-trk="' + q.id + '" style="margin-top:5px;padding:5px 9px;font-size:11px">📍 Jejak</button>';
        } else if (s.s === 0) h += '<span class="st">' + (q.req && !q.req.every((r) => W.Q.st(r).s === 2) ? '🔒 Selesaikan misi sebelumnya' : q.giver === 'ketua' ? '💬 Bercakap dengan Tok Ketua (dunia lama) atau masuk Celah Gunung' : q.giver ? '💬 Bercakap dengan ' + esc(W.nameOf(q.giver)) : '') + '</span>';
        h += '</div>';
      });
    });
    return h;
  }
  function npc() {
    let h = '<small>Kemesraan naik bila anda bersembang (sekali sehari), memberi hadiah kegemaran & membantu misi. Penduduk mengingati keputusan anda.</small><div class="np" style="margin-top:6px">';
    W.npcs.forEach((e) => {
      const s = W.npcS(e.d.id), hearts = Math.max(0, Math.min(5, Math.round((s.a + 10) / 20)));
      h += '<div class="cd"><b>' + esc(e.d.n) + '</b><br><small>' + esc(e.d.job) + '</small><br>' + '💗'.repeat(hearts) + '🤍'.repeat(5 - hearts) + ' <small>' + s.a + '</small><br><small>' + (s.met ? '🕐 ' + esc(W.actName(e.act)) : '❔ belum dikenali') + '</small></div>';
    });
    return h + '</div>';
  }
  function skills() {
    let h = '<small>⭐ 1 mata kemahiran setiap Level. Mata tersedia: <b style="color:#fbbf24">' + W.skPts() + '</b></small>';
    W.SK.forEach((b) => {
      h += '<h4>' + b.b + '</h4><div class="sk">';
      b.l.forEach(([k, n, mx, d]) => {
        const r = W.rk(k);
        h += '<div class="cd"><b>' + esc(n) + '</b><br>' + Array.from({ length: mx }, (_, i) => '<span class="pip' + (i < r ? ' on' : '') + '"></span>').join('') + '<br><small>' + esc(d) + '</small><br>' + (r < mx ? '<button class="b" data-sk="' + k + '" style="margin-top:4px;padding:5px 9px;font-size:11px">＋ Belajar</button>' : '<small>✅ Maksimum</small>') + '</div>';
      });
      h += '</div>';
    });
    h += '<h4>⚔️ Kawalan tempur</h4><div class="cd"><small>🌀 <b>Elak</b> (Shift / butang biru): 2 cas, kebal 0.35 s<br>🛡 <b>Tangkis</b> (tahan C / butang kelabu): kerosakan ×0.3 · tekan <b>tepat sebelum</b> serangan = <b>Tangkisan Sempurna</b> (0 kerosakan, musuh pening, serangan balas ×2)<br>⚔️ <b>Serangan berat</b>: tahan butang serang ≥0.45 s lalu lepas (sapuan 140°, ×2.4)<br>🔥 <b>Kombo</b>: 3 serangan ringan berturut → pukulan penamat<br>🟥 Garis/bulatan merah = serangan musuh akan datang — keluar dari kawasan itu!</small></div>';
    return h;
  }
  function dunia() {
    const s = S7(), sec = Object.keys(s.sec || {}).length, rep = s.rep || 0;
    const tier = rep >= 60 ? 'Wira Lembah' : rep >= 30 ? 'Sahabat' : rep >= 10 ? 'Dikenali' : rep >= 0 ? 'Orang asing' : 'Dicurigai';
    let h = '<div class="cd"><b>⭐ Reputasi Kampung Timur: ' + rep + '</b> <small>(' + tier + ')</small><br><small>Reputasi tinggi: harga kedai lebih murah, penduduk lebih mesra, dialog berubah.</small></div>';
    h += '<div class="cd"><b>🗺 Penerokaan: ' + (W.fogPct ? W.fogPct() : 0) + '%</b> · <b>🗝 Rahsia: ' + sec + '/' + (W.SEC ? W.SEC.length : 6) + '</b><br><small>Kabus peta hilang bila anda meneroka. Rahsia: puncak tinggi, pulau, gua kecil, akar pokok tua…</small></div>';
    const k = W.wx(), se = W.season();
    h += '<div class="cd"><b>' + k.ic + ' ' + k.n + ' · ' + se.ic + ' ' + se.n + '</b><br><small>Musim bertukar setiap 7 hari. Hujan: ikan jarang lebih galak, penduduk berteduh. Ribut: kilat & pokok tumbang. Musim Menuai: padi menguning.</small></div>';
    h += '<h4>📍 Kawasan</h4>';
    [['🏘 Kampung Timur', '27 penduduk · kedai · tukang besi · tenun · balai'], ['💦 Air Terjun Tirai Perak', 'kolam, wap air, 🕳 Gua Tirai Air (dungeon)'], ['💧 Tasik Biru', 'jeti memancing, pulau kecil, pokok kelapa'], ['🌸 Padang Bunga', 'bunga embun waktu subuh, pokok sakura'], ['🌾 Ladang Padi Bukit', 'diairi kincir air, sasaran babi hutan'], ['🏜 Bukit Pasir Utara', 'pintu ke Padang Pasir (wilayah akan datang), hutan tebal, harimau kumbang'], ['🏔 Banjaran Barat', 'puncak bersalji; jalan ke Kerajaan tertimbus runtuhan'], ['⛩ Kuil Lama', '???']].forEach(([a, b]) => (h += '<div class="cd"><b>' + a + '</b><br><small>' + b + '</small></div>'));
    h += '<h4>🌍 Peristiwa dunia</h4><div class="cd"><small>' + Object.values(W.evt.D).map((e) => e.n).join(' · ') + '<br>Peristiwa berlaku mengikut masa, cuaca & kemajuan cerita ketika anda berada di Lembah Timur.' + (W.evt.cur ? '<br><b style="color:#fca5a5">SEDANG BERLAKU: ' + W.evt.cur.n + '</b>' : '') + '</small></div>';
    return h;
  }

  /* ---------- sepanduk kawasan ---------- */
  const ban = $('ban17');
  let inR = null, bt = 0;
  function banner(a, b) {
    ban.firstChild.textContent = a;
    ban.lastChild.textContent = b;
    ban.classList.add('o');
    clearTimeout(bt);
    bt = setTimeout(() => ban.classList.remove('o'), 3600);
  }
  W.banner = banner;
  let lastZone = '';
  W.tick(() => {
    if (W.inCave) {
      if (lastZone !== 'gua') {
        lastZone = 'gua';
        banner('🕳 Gua Tirai Air', 'Dungeon · musuh Lv 19–22 · Bos: Kelembai Batu');
      }
      return;
    }
    const r = P.x < -216 && P.z < 58;
    if (r !== inR) {
      if (r && inR === false) banner('🏞 LEMBAH TIMUR', R().lv() < 12 ? '⚠️ Musuh Lv 13–22 — disyorkan Lv 12+' : 'Kampung Timur · Air Terjun · Tasik Biru · Padang Bunga');
      inR = r;
    }
    if (!r) return;
    let z = '';
    if (W.inVillage(P.x, P.z)) z = '🏘 Kampung Timur';
    else if (W.lakeD(P.x, P.z) < 1.6) z = '💧 Tasik Biru';
    else if (Math.hypot(P.x - W.F.meadow[0], P.z - W.F.meadow[1]) < W.F.meadow[2]) z = '🌸 Padang Bunga';
    else if (Math.hypot(P.x - W.F.fall[0], P.z - W.F.fall[1]) < 30) z = '💦 Air Terjun Tirai Perak';
    else if (P.z < -262 && P.x > -486) z = '🏜 Bukit Pasir Utara';
    else if (P.x < -490) z = '🏔 Banjaran Barat';
    if (z && z !== lastZone) banner(z, '');
    if (z) lastZone = z;
  });

  /* ---------- apa yang baharu ---------- */
  function whatsNew() {
    if (S7().wn17) return;
    S7().wn17 = 1;
    save();
    QS14.dlg('Kediaman Isekai Waguri v17', '🏞',
      '<b>Selamat datang ke v17 — LEMBAH TIMUR!</b><br>🪧 <b>Celah Gunung</b> terbuka di hujung barat Laluan Hutan Jauh → dunia kini lebih dua kali ganda luasnya<br>🏘 <b>Kampung Timur</b>: 27 penduduk dengan jadual harian, kerja, keluarga, memori & reputasi<br>💦 Air terjun, sungai mengalir, Tasik Biru, padang bunga, gunung bersalji<br>🕳 Dungeon <b>Gua Tirai Air</b> + bos 3 fasa <b>Kelembai Batu</b><br>🌀 Elak · 🛡 Tangkis · ✨ Tangkisan sempurna · ⚔️ Serangan berat · 🌳 Pokok kemahiran · ⚒️ Naik taraf senjata · 🔱 Tombak<br>🌦 Cuaca & musim · 🌍 peristiwa dunia · 🗝 rahsia · 🗺 kabus peta<br>⚙️ 5 tahap grafik: Biasa · Medium · High · Ultra · Extreme',
      '📖 Bab Timur bermula: bercakap dengan <b>Tok Ketua</b> (Lv 12+) atau terus ke Celah Gunung. Tekan <b>🧭 Lembah Timur</b> untuk misi & kemahiran.',
      [['Jom teroka!', null, 1]]);
  }
  when14(() => W.questOK && typeof QS14 !== 'undefined' && QS14.dlg && !QS14.dlgOpen, () => setTimeout(whatsNew, 2500));
  W.uiOK = 1;
})();
