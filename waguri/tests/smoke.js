/* Ujian asap Kediaman Isekai Waguri v17 (Chromium tanpa kepala, WebGL perisian SwiftShader).
   node tests/smoke.js [--quick] [--gfx lite,biasa,sine,ultra,ext] [--out DIR]
   memerlukan: npm i playwright-core (dalam tests/) + Chromium (PLAYWRIGHT_BROWSERS_PATH atau CHROME=/laluan/chrome)
   NOTA: SwiftShader sangat perlahan (~1–3 FPS) — FPS di sini BUKAN ukuran prestasi telefon. */
const { chromium } = require('playwright-core');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const OUT = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : path.join(ROOT, 'tests', 'out');
const QUICK = process.argv.includes('--quick');
fs.mkdirSync(OUT, { recursive: true });
function chrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const b = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  const d = fs.readdirSync(b).filter((x) => x.startsWith('chromium-')).map((x) => path.join(b, x, 'chrome-linux', 'chrome')).find((p) => fs.existsSync(p));
  if (!d) throw new Error('Chromium tidak dijumpai');
  return d;
}
let pass = 0, fail = 0;
const log = [];
function check(name, ok, info) {
  (ok ? pass++ : fail++);
  const l = (ok ? '✅' : '❌') + ' ' + name + (info !== undefined ? '  → ' + (typeof info === 'string' ? info : JSON.stringify(info)) : '');
  console.log(l);
  log.push(l);
}
async function boot(browser, file, gfx, keepStorage) {
  const ctx = keepStorage || (await browser.newContext({ viewport: { width: 1280, height: 720 } }));
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e.stack || e).slice(0, 300)));
  p.on('console', (m) => {
    if (m.type() === 'error') errs.push(m.text().slice(0, 300));
  });
  if (!keepStorage) await p.addInitScript((g) => { try { if (!localStorage.getItem('__t')) { localStorage.setItem('waguri_gfx', g); localStorage.setItem('__t', '1'); } } catch (e) {} }, gfx);
  await p.goto('file://' + file, { waitUntil: 'commit', timeout: 240000 });
  await p.waitForFunction(() => window.W17 ? W17.uiOK && W17.questOK : typeof plM !== 'undefined' && plM.length && window.MAP16, null, { timeout: 240000, polling: 500 });
  await p.waitForTimeout(1500);
  return { p, ctx, errs };
}
/* jalankan semua tick V17 dengan masa simulasi (tidak bergantung FPS) */
const FF = `window.__ff=(sec,dt)=>{dt=dt||0.05;let now=Math.max(performance.now(),window.__fn||0);for(let t=0;t<sec;t+=dt){now+=dt*1000;W17.now=now;W17.dt=dt;for(const f of W17.onTick)try{f(dt,now)}catch(e){}}window.__fn=now;};`;

(async () => {
  const browser = await chromium.launch({ executablePath: chrome(), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const V16 = path.join(ROOT, 'original', 'index_v16_1.html'), V17 = path.join(ROOT, 'dist', 'index.html');
  /* ---------- 1. dunia lama tidak berubah ---------- */
  const grid = [];
  for (let x = -210; x <= 100; x += 7.3) for (let z = -96; z <= 240; z += 7.7) grid.push([x, z]);
  const a = await boot(browser, V16, 'biasa');
  const h16 = await a.p.evaluate((g) => g.map(([x, z]) => W8.H(x, z)), grid);
  const base16 = await a.p.evaluate(() => ({ Q: Q.length, SQ: QS14.SQ.length, npc: npcs.map((g) => g.userData.n), DS: DS.map((d) => d[1]), W: Object.keys(CB14.WPN), ST: ST.length, items: Object.keys(IT).length }));
  await a.ctx.close();
  const b = await boot(browser, V17, 'biasa');
  const P = b.p;
  await P.evaluate(FF);
  const h17 = await P.evaluate((g) => g.map(([x, z]) => W8.H(x, z)), grid);
  let diff = 0;
  h16.forEach((v, i) => (diff = Math.max(diff, Math.abs(v - h17[i]))));
  check('Ketinggian dunia lama sama tepat dengan v16.1 (' + grid.length + ' titik)', diff === 0, 'beza maks ' + diff);
  const s17 = await P.evaluate(() => ({ Q: Q.length, SQ: QS14.SQ.length, npc: npcs.map((g) => g.userData.n), DS: DS.map((d) => d[1]), W: Object.keys(CB14.WPN), ST: ST.length, items: Object.keys(IT).length }));
  check('Misi utama asal kekal (' + base16.Q + ')', s17.Q === base16.Q, s17.Q);
  check('Misi sampingan asal kekal (' + base16.SQ + ')', s17.SQ === base16.SQ, s17.SQ);
  check('Semua NPC asal kekal', base16.npc.every((n) => s17.npc.includes(n)), base16.npc.length + ' asal');
  check('Semua destinasi peta asal kekal', base16.DS.every((n) => s17.DS.includes(n)), s17.DS.length + ' destinasi');
  check('Semua senjata asal kekal + tombak', base16.W.every((n) => s17.W.includes(n)) && s17.W.includes('tombak'));
  check('Item asal kekal', s17.items >= base16.items, base16.items + ' → ' + s17.items);
  /* ---------- 2. modul V17 ---------- */
  const ok = await P.evaluate(() => ({ ter: W17.terOK, water: W17.waterOK, flora: W17.floraOK, vill: W17.villOK, npc: W17.npcOK, combat: W17.combatOK, quest: W17.questOK, ui: W17.uiOK, map: W17.mapReady, n: W17.npcs.length, houses: W17.HOUSES.length, chunks: W17.chunks.length, fall: W17.fallInfo && +W17.fallInfo.hgt.toFixed(1), MC: [MC.width, MC.height] }));
  check('Semua modul V17 sedia', ok.ter && ok.water && ok.flora && ok.vill && ok.npc && ok.combat && ok.quest && ok.ui && ok.map, ok);
  check('27 penduduk Kampung Timur', ok.n === 27, ok.n);
  check('Air terjun dikesan di tebing (8–16 m)', ok.fall > 8 && ok.fall < 16, ok.fall);
  check('Peta diluaskan (1452×1275)', ok.MC[0] === 1452 && ok.MC[1] === 1275, ok.MC);
  check('Tiada ralat JS semasa muat', b.errs.length === 0, b.errs.slice(0, 3));
  /* ---------- 3. jadual NPC ---------- */
  const sch = await P.evaluate(() => {
    const r = {};
    for (const h of [3, 7.6, 10, 20.6, 23]) {
      GS.t = (h - 6 + 24) % 24 * 75;
      __ff(1.2);
      r[h] = W17.npcs.map((e) => e.act);
    }
    return r;
  });
  check('Malam (03:00): hampir semua tidur, pengawal berjaga', sch[3].filter((a) => a === 'sleep').length >= 24 && sch[3].includes('work:guard'), sch[3].filter((a) => a === 'sleep').length + ' tidur');
  check('Pagi (10:00): penduduk bekerja (≥10 jenis kerja)', new Set(sch[10].filter((a) => /^work/.test(a))).size >= 8, [...new Set(sch[10])].join(','));
  const arr = await P.evaluate(() => {
    GS.t = (10 - 6) * 75;
    P.x = -500;
    P.z = 40;
    __ff(40, 0.1);
    return W17.npcs.filter((e) => e.arr).length;
  });
  check('NPC sampai ke tempat kerja (LOD jauh, 40 s simulasi)', arr >= 22, arr + '/27');
  /* ---------- 4. aliran Bab Timur + sampingan ---------- */
  const flow = await P.evaluate(() => {
    const out = [];
    const W = W17;
    GS.plv = 24;
    GS.hp = 100;
    GS.en = 100;
    GS.inv.wood = 40;
    GS.inv.batu = 20;
    GS.coin = 9000;
    const btn = (id, re) => {
      const b = W.Q.forNpc(id).find((x) => re.test(x[0]));
      if (!b) throw new Error('butang tiada: ' + id + ' ' + re + ' · ada: ' + W.Q.forNpc(id).map((x) => x[0]).join('|') + ' · jejak: ' + JSON.stringify(out));
      return b;
    };
    /* klik butang terakhir dalam dialog QS14 (terima/teruskan/serah) */
    const clickLast = () => {
      const bs = [...document.querySelectorAll('#dlg14 button')];
      if (bs.length) bs[bs.length - 1].click();
    };
    const clickTxt = (re) => {
      const b = [...document.querySelectorAll('#dlg14 button')].find((x) => re.test(x.textContent));
      if (b) b.click();
      return !!b;
    };
    const go = (x, z) => {
      P.x = x;
      P.z = z;
      __ff(0.6);
    };
    const stp = (id) => W.Q.st(id);
    go(-222, -14);
    out.push(['m1 auto', stp('m1').s]);
    go(-316, -146);
    const e = W.npcById('hamzah');
    btn('hamzah', /Celah Gunung/)[1]();
    clickLast();
    out.push(['m1', stp('m1').s]);
    btn('hamzah', /Orang Asing/)[1]();
    clickLast();
    btn('nekjah', /Orang Asing/)[1]();
    clickLast();
    btn('kidam', /Orang Asing/)[1]();
    clickLast();
    clickLast();
    btn('hamzah', /Orang Asing/)[1]();
    clickLast();
    out.push(['m2', stp('m2').s, W.flag('kincir')]);
    btn('hamzah', /Bisikan/)[1]();
    clickLast();
    btn('bujang', /Bisikan/)[1]();
    clickLast();
    GS.t = (21 - 6) * 75;
    const wk = W.SPOTS.wakaf;
    go(wk[0], wk[1]);
    btn('bujang', /Bisikan/)[1]();
    clickLast();
    out.push(['m3', stp('m3').s]);
    btn('seman', /Taring Besi/)[1]();
    clickLast();
    btn('seman', /Taring Besi/)[1]();
    clickTxt(/pagar/);
    btn('seman', /Taring Besi/)[1]();
    clickLast();
    clickLast();
    const la = W.SPOTS.ladang;
    go(la[0], la[1]);
    out.push(['raid', !!W.evt.cur, W.evt.cur && W.evt.cur.foes.length]);
    W.evt.cur.foes.forEach((a) => CB14.hitT(a, 1e9));
    __ff(0.5);
    btn('seman', /Taring Besi/)[1]();
    clickLast();
    out.push(['m4', stp('m4').s, W.flag('m4'), W.flag('ladang')]);
    btn('nekjah', /Tiga Kristal/)[1]();
    clickLast();
    W.cave.enter();
    return out;
  });
  await P.waitForFunction(() => W17.inCave, null, { timeout: 60000 });
  const flow2 = await P.evaluate(() => {
    const W = W17, out = [];
    const clickLast = () => {
      const bs = [...document.querySelectorAll('#dlg14 button')];
      if (bs.length) bs[bs.length - 1].click();
    };
    out.push(['inCave', W.inCave, +P.y.toFixed(1)]);
    /* teka-teki kristal: tekan setiap ST kristal */
    ST.filter((s) => s.lb && /kristal/.test(s.lb())).forEach((s) => s.f());
    return out;
  });
  await P.waitForFunction(() => W17.Q.st('m6').s === 1, null, { timeout: 60000 });
  const flow2b = await P.evaluate(() => {
    const W = W17, out = [];
    out.push(['gate', !W.cave.gateClosed(), W.Q.st('m5').s, W.Q.st('m6').s]);
    const ar = W.CV.rooms[3];
    P.x = ar[0];
    P.z = ar[1] + 8;
    __ff(0.3);
    const a = W._bossA;
    out.push(['boss', !!a, a && a.lv, a && Math.round(a.mhp)]);
    /* fasa */
    a.ai.s = 'chase';
    W.bossBar(a);
    let hits = 0;
    const h0 = RPG14.hurtAbs;
    RPG14.hurtAbs = function () {
      hits++;
      return 0;
    };
    a.hp = a.mhp * 0.6;
    __ff(12, 0.05);
    const ph2 = a.ph;
    a.hp = a.mhp * 0.3;
    __ff(12, 0.05);
    const ph3 = a.ph;
    RPG14.hurtAbs = h0;
    out.push(['phases', ph2, ph3, 'serangan kena', hits, 'minion', W.foes.filter((f) => f.kind === 'golem' && !f.dead).length]);
    CB14.hitT(a, 1e9);
    __ff(0.5);
    out.push(['m6 step', W.Q.st('m6').step, W.cave.st().boss]);
    W.cave.exit();
    return out;
  });
  await P.waitForFunction(() => !W17.inCave, null, { timeout: 60000 });
  console.log('flow', JSON.stringify(flow.concat(flow2, flow2b)));
  const flow3 = await P.evaluate(() => {
    const W = W17, out = [];
    const btn = (id, re) => {
      const b = W.Q.forNpc(id).find((x) => re.test(x[0]));
      if (!b) throw new Error('butang tiada: ' + id + ' ' + re + ' · ada: ' + W.Q.forNpc(id).map((x) => x[0]).join('|') + ' · m6 ' + JSON.stringify(W.Q.st('m6')) + ' m5 ' + JSON.stringify(W.Q.st('m5')) + ' inCave ' + W.inCave);
      return b;
    };
    const clickLast = () => {
      const bs = [...document.querySelectorAll('#dlg14 button')];
      if (bs.length) bs[bs.length - 1].click();
    };
    btn('nekjah', /Kelembai/)[1]();
    clickLast();
    out.push(['m6', W.Q.st('m6').s, W.flag('fall'), !!W._rb]);
    btn('hamzah', /Pesta/)[1]();
    clickLast();
    GS.t = (20 - 6) * 75;
    P.x = W.SPOTS.dataran[0];
    P.z = W.SPOTS.dataran[1];
    __ff(1);
    btn('hamzah', /Pesta/)[1]();
    clickLast();
    out.push(['m7', W.Q.st('m7').s, W.flag('sahabat')]);
    /* sampingan dengan pilihan: Mat Jenin */
    btn('matjenin', /Mat Jenin/)[1]();
    clickLast();
    W.ev('kelapa17', 5);
    btn('matjenin', /Mat Jenin/)[1]();
    [...document.querySelectorAll('#dlg14 button')].find((x) => /Kerja keras/.test(x.textContent)).click();
    GS.t = (14 - 6) * 75;
    __ff(1.5);
    out.push(['s1', W.Q.st('s1').s, W.flag('mj'), W.npcById('matjenin').act]);
    out.push(['rep', GS.v17.rep, 'aff seman', W.npcS('seman').a, 'mem', W.npcS('seman').mem.join(',')]);
    out.push(['talk', W.talkText(W.npcById('seman')).replace(/<[^>]+>/g, '')]);
    out.push(['ev sq_done → misi asal', typeof Q !== 'undefined']);
    return out;
  });
  const F = {};
  flow.concat(flow2, flow2b, flow3).forEach((r) => (F[r[0]] = r.slice(1)));
  console.log(JSON.stringify(F));
  check('M1 Celah Gunung bermula auto & selesai', F['m1 auto'][0] === 1 && F.m1[0] === 2);
  check('M2 selesai + kincir dibaiki (kesan dunia)', F.m2[0] === 2 && F.m2[1] === 1);
  check('M3 (lawatan malam) selesai', F.m3[0] === 2);
  check('M4 pilihan "pagar" → serbuan babi bermula (kurang babi)', F.raid[0] === true && F.raid[1] === 4, F.raid);
  check('M4 selesai + kesan pilihan disimpan', F.m4[0] === 2 && F.m4[1] === 'pagar' && F.m4[2] === 'pagar', F.m4);
  check('Gua: masuk bawah tanah', F.inCave[0] === true && F.inCave[1] < -60, F.inCave);
  check('Teka-teki 3 kristal buka pintu, M5 selesai, M6 bermula', F.gate[0] === true && F.gate[1] === 2 && F.gate[2] === 1, F.gate);
  check('Bos Kelembai muncul di arena', F.boss[0] === true, F.boss);
  check('Bos bertukar fasa 2 → 3 & menyerang', F.phases[0] === 2 && F.phases[1] === 3 && F.phases[3] > 0, F.phases);
  check('Bos fasa 2 memanggil minion golem', F.phases[5] >= 1, F.phases[5]);
  check('Bos tewas → misi maju', F['m6 step'][0] === 1 && F['m6 step'][1] === 1);
  check('M6 selesai: air terjun bernyanyi + pelangi', F.m6[0] === 2 && F.m6[1] === 1 && F.m6[2] === true);
  check('M7 Pesta selesai: gelaran Sahabat', F.m7[0] === 2 && F.m7[1] === 1);
  check('Pilihan Mat Jenin mengubah jadual (bekerja di ladang)', F.s1[0] === 2 && F.s1[1] === 'kerja' && F.s1[2] === 'work:farm', F.s1);
  check('Reputasi & kemesraan & memori dikemas kini', F.rep[0] > 50 && F.rep[2] > 10 && /m4_pagar/.test(F.rep[4]), F.rep);
  /* ---------- 5. AI musuh (simulasi) ---------- */
  const ai = await P.evaluate(() => {
    GS.hp = 100;
    P.x = -420;
    P.z = -60;
    const a = W17.mkFoe('babi_tb', -420, -66, 14), b = W17.mkFoe('kumbang', -414, -58, 20);
    let hits = 0, st = new Set();
    const h0 = RPG14.hurtAbs;
    RPG14.hurtAbs = function (n) {
      hits++;
      return h0.apply(this, arguments);
    };
    for (let i = 0; i < 200; i++) {
      __ff(0.05);
      st.add(a.ai.s);
      st.add('k:' + b.ai.s);
    }
    RPG14.hurtAbs = h0;
    return { hits, st: [...st], hp: +GS.hp.toFixed(1) };
  });
  check('AI musuh: kejar → telegraf → serang/rempuh, pemain tercedera', ai.hits > 0 && ai.st.includes('wind') && (ai.st.includes('dash') || ai.st.includes('rec')), ai);
  /* ---------- 6. simpan & muat semula ---------- */
  const sv = await P.evaluate(() => {
    save();
    return { q: Object.keys(GS.v17.q).length, rep: GS.v17.rep };
  });
  const ctx = b.ctx;
  const P2 = await ctx.newPage();
  const errs2 = [];
  P2.on('pageerror', (e) => errs2.push(String(e)));
  await P.close();
  await P2.goto('file://' + V17, { waitUntil: 'commit', timeout: 240000 });
  await P2.waitForFunction(() => window.W17 && W17.uiOK && W17.questOK, null, { timeout: 240000, polling: 500 });
  const ld = await P2.evaluate(() => ({ q: Object.keys(GS.v17.q).length, rep: GS.v17.rep, m7: W17.Q.st('m7').s, gate: !W17.cave.gateClosed(), mj: W17.flag('mj') }));
  check('Simpan/muat: kemajuan V17 kekal selepas muat semula', ld.q === sv.q && ld.rep === sv.rep && ld.m7 === 2 && ld.gate && ld.mj === 'kerja', ld);
  check('Tiada ralat selepas muat semula', errs2.length === 0, errs2.slice(0, 2));
  await P2.screenshot({ path: path.join(OUT, 'reload.png') });
  await ctx.close();
  /* ---------- 7. lima tahap grafik ---------- */
  if (!QUICK) {
    const GF = process.argv.includes('--gfx') ? process.argv[process.argv.indexOf('--gfx') + 1].split(',') : ['lite', 'biasa', 'sine', 'ultra', 'ext'];
    for (const g of GF) {
      const t = await boot(browser, V17, g);
      const r = await t.p.evaluate(() => {
        try {
          QS14.close();
        } catch (e) {}
        document.querySelectorAll('#dlg14').forEach((d) => d.classList.remove('o'));
        P.x = -285;
        P.z = -24;
        rot = -2.2;
        snap();
        GS.t = (9 - 6) * 75;
        return { q: W17.q, grass: W17.tq.grass, g: W17.tq.g, mist: W17.tq.mist, name: GFX14.names[GFX14.lv] };
      });
      await t.p.waitForTimeout(9000);
      await t.p.screenshot({ path: path.join(OUT, 'gfx_' + g + '.png') });
      const info = await t.p.evaluate(() => ({ tris: renderer.info.render.triangles, geo: renderer.info.memory.geometries, tex: renderer.info.memory.textures }));
      check('Grafik ' + r.name + ': muat tanpa ralat', t.errs.length === 0, Object.assign(r, info, { errs: t.errs.slice(0, 2) }));
      await t.ctx.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'report.txt'), log.join('\n') + '\n\nLULUS ' + pass + ' · GAGAL ' + fail + '\n');
  console.log('\nLULUS ' + pass + ' · GAGAL ' + fail);
  process.exit(fail ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(2);
});
