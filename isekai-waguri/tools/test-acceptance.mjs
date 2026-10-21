// Ujian penerimaan v19 (Seksyen 11 & 13) — setiap senario dalam konteks pelayar baharu (storan kosong).
//   node tools/test-acceptance.mjs [senario...]      -> docs/img/test/*.png + docs/img/test/acceptance.json
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'docs', 'img', 'test');
fs.mkdirSync(OUT, { recursive: true });
const URL_ = 'file://' + path.join(ROOT, 'dist', 'Kediaman_Isekai_Waguri_v19.html');
const SAVE18 = fs.readFileSync(path.join(ROOT, 'tools', 'fixtures', 'simpanan-v18.json'), 'utf8');
const only = process.argv.slice(2);
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const results = {};

async function open({ gfx = 'lite', save = null, init = null, phone = false } = {}) {
  const ctx = await browser.newContext(phone ? { viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Mobile Safari/537.36' } : { viewport: { width: 1280, height: 720 } });
  const p = await ctx.newPage();
  const log = [];
  p.on('pageerror', e => log.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') log.push('console.error ' + m.text().slice(0, 200)); });
  await p.addInitScript(([g, s]) => { try { if (!sessionStorage.getItem('__seed')) { sessionStorage.setItem('__seed', '1'); localStorage.clear(); if (g) localStorage.setItem('waguri_gfx', g); if (s) localStorage.setItem('waguri_isekai_v1', s); } } catch (e) {} }, [gfx, save]);
  if (init) await p.addInitScript(init);
  const samples = [];
  const t0 = Date.now();
  await p.goto(URL_, { waitUntil: 'commit' });
  const iv = setInterval(async () => { try { samples.push([Date.now() - t0, await p.evaluate(() => { const B = window.BOOT19; return [B ? B.phase : '-', +(document.getElementById('b19pct') || {}).textContent?.replace('%', '') || 0]; })]); } catch (e) {} }, 400);
  return { ctx, p, log, samples, t0, stop: () => clearInterval(iv) };
}
const vis = (p, sel) => p.$eval(sel, e => !e.hidden).catch(() => false);
const waitAny = (p, sels, ms) => p.waitForFunction(s => s.some(q => { const e = document.querySelector(q); return e && !e.hidden; }), sels, { timeout: ms });
const shot = (p, f) => p.screenshot({ path: path.join(OUT, f.replace(/\.png$/, '.jpg')), type: 'jpeg', quality: 78 });
const state = p => p.evaluate(() => { const B = window.BOOT19; return { phase: B.phase, done: B.done, mode: B.mode, tA: B.tA, tB: B.tB, checks: B.checks, warn: B.warnU || B.warn, fatal: B.fatal || null }; });
async function toMenu(p) { await waitAny(p, ['#b19menu', '#b19err'], 300000); }
async function toReady(p) { await waitAny(p, ['#b19ready', '#b19err'], 900000); }

const S = {
  async 'baharu-biasa'() {
    const o = await open({ gfx: 'lite' }), { p } = o;
    await p.waitForSelector('#b19', { timeout: 60000 }); await p.waitForTimeout(300); await shot(p, 'a1-logo.png');
    await toMenu(p); await shot(p, 'a2-menu.png');
    const contDisabled = await p.$eval('#b19c', e => e.disabled);
    await p.click('#b19n'); await p.waitForTimeout(1200); await shot(p, 'a3-loading-dunia.png');
    const blockedDuring = await p.evaluate(() => typeof gameInputBlocked === 'function' ? gameInputBlocked() : 'tiada');
    await toReady(p); o.stop(); await shot(p, 'a4-world-ready.png');
    const st = await state(p);
    const playEnabled = await p.$eval('#b19play', e => !e.disabled);
    await p.click('#b19play'); await p.waitForTimeout(2500);
    const blockedAfter = await p.evaluate(() => gameInputBlocked());
    // jalan ke hadapan 2 s dengan kekunci W -> pemain bergerak?
    // tutup dialog alu-aluan Tok Ketua (muncul untuk pemain baharu) seperti pemain sebenar
    for (let i = 0; i < 12 && await p.evaluate(() => !!(window.UI16 && UI16.blocked && UI16.blocked())); i++) {
      const jb = p.getByText('Jom main!', { exact: true }); if (await jb.count()) await jb.first().click().catch(() => {}); await p.waitForTimeout(500); }
    const dialogClosed = await p.evaluate(() => !(window.UI16 && UI16.blocked && UI16.blocked()));
    const p0 = await p.evaluate(() => [P.x, P.z]);
    // tahan W sehingga pemain bergerak > 1 m (bebas kadar bingkai; SwiftShader tanpa GPU hanya ~1–3 fps)
    await p.keyboard.down('w');
    await p.waitForFunction(p0 => Math.hypot(P.x - p0[0], P.z - p0[1]) > 1, p0, { timeout: 30000 }).catch(() => {});
    await p.keyboard.up('w');
    const p1 = await p.evaluate(() => [P.x, P.z]);
    await shot(p, 'a5-dalam-game.png');
    // simpan -> muat semula -> TERUSKAN
    await p.evaluate(() => { GS.coin = 777; save(); });
    await p.reload({ waitUntil: 'commit' }); await toMenu(p);
    const menuTxt = await p.$eval('#b19c', e => e.textContent);
    await p.click('#b19c'); await toReady(p);
    const coinAfter = await p.evaluate(() => GS.coin);
    const prog = o.samples.map(s => s[1]);
    const mono = ph => { const v = prog.filter(x => x[0] === ph).map(x => x[1]); return v.every((x, i) => i === 0 || x >= v[i - 1]); };
    await o.ctx.close();
    return { ok: st.done === false && contDisabled && blockedDuring === true && playEnabled && blockedAfter === false && Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) > 1 && /RM 777/.test(menuTxt) && coinAfter === 777 && st.checks.every(c => c.ok) && mono('A') && mono('B'),
      contDisabled, blockedDuring, blockedAfter, dialogClosed, moved_m: +Math.hypot(p1[0] - p0[0], p1[1] - p0[1]).toFixed(2), menuTxt, coinAfter, tA: st.tA, tB: st.tB, checks: st.checks.map(c => (c.ok ? '✔ ' : '✘ ') + c.n + ' — ' + c.d), warn: st.warn,
      progressA: prog.filter(x => x[0] === 'A').map(x => x[1]), progressB: prog.filter(x => x[0] === 'B').map(x => x[1]), monotonic: mono('A') && mono('B'), log: o.log };
  },
  async 'teruskan-v18'() {
    const o = await open({ gfx: 'biasa', save: SAVE18 }), { p } = o;
    await toMenu(p); await shot(p, 'b1-menu-simpanan-v18.png');
    const txt = await p.$eval('#b19c', e => e.textContent);
    await p.click('#b19c'); await toReady(p); o.stop(); const st = await state(p);
    await p.click('#b19play'); await p.waitForTimeout(3000); await shot(p, 'b2-teruskan-v18.png');
    const g = await p.evaluate(() => ({ coin: GS.coin, day: GS.day, plv: GS.plv, fish: GS.inv.fish, wood: GS.inv.wood, lv: GS.lv }));
    await o.ctx.close();
    return { ok: g.coin === 1234 && g.day === 7 && g.plv === 12 && g.fish === 9 && g.wood === 15 && st.checks.every(c => c.ok), menuTxt: txt, gs: g, tB: st.tB, failed: st.checks.filter(c => !c.ok), warn: st.warn, log: o.log };
  },
  async 'mula-baharu-dengan-simpanan'() {
    const o = await open({ gfx: 'lite', save: SAVE18 }), { p } = o;
    await toMenu(p); await p.click('#b19n'); await p.waitForSelector('#b19y'); await shot(p, 'c1-sahkan-mula-baharu.png');
    await p.click('#b19y'); await toReady(p); o.stop();
    const r = await p.evaluate(() => ({ coin: GS.coin, day: GS.day, bak: localStorage.getItem('waguri_isekai_v1_bak19') }));
    await o.ctx.close();
    return { ok: r.coin === 20 && r.day === 1 && r.bak === SAVE18, coin: r.coin, day: r.day, backupSama: r.bak === SAVE18 };
  },
  async 'high-glb'() {
    const o = await open({ gfx: 'sine' }), { p } = o;
    await toMenu(p); await p.click('#b19n'); await toReady(p); o.stop(); const st = await state(p);
    await shot(p, 'd1-high-world-ready.png');
    await p.click('#b19play'); await p.waitForTimeout(4000);
    try { await p.evaluate(() => { try { QS14.close && QS14.close(); } catch (e) {} }); } catch (e) {}
    await shot(p, 'd2-high-dalam-game.png');
    const g = await p.evaluate(() => ({ glb: !!(window.G14 && G14.ready), anim: window.G14 ? Object.keys(G14.act).length : 0, npc3d: window.NPC15 ? NPC15.n : 0, cacheUsed: !!(BOOT19.assets.wgm14 && BOOT19.assets.wgm14.used), cacheUsedNpc: !!(BOOT19.assets.wnp15 && BOOT19.assets.wnp15.used) }));
    await o.ctx.close();
    return { ok: g.glb && g.anim >= 20 && g.npc3d > 10 && g.cacheUsed && st.checks.every(c => c.ok), ...g, tA: st.tA, tB: st.tB, failed: st.checks.filter(c => !c.ok), warn: st.warn, log: o.log };
  },
  async 'ralat-fasa-a'() {
    const o = await open({ gfx: 'lite', init: () => { try { delete window.DecompressionStream; window.DecompressionStream = undefined; } catch (e) {} } }), { p } = o;
    await waitAny(p, ['#b19err', '#b19menu'], 120000); o.stop();
    const err = await vis(p, '#b19err'), menu = await vis(p, '#b19menu'), retry = await vis(p, '#b19retry');
    const msg = await p.$eval('#b19ed', e => e.textContent).catch(() => '');
    await shot(p, 'e1-ralat-fasa-a.png');
    const world = await p.evaluate(() => typeof scene !== 'undefined');
    await o.ctx.close();
    return { ok: err && !menu && retry && !world, ralatDipapar: err, menuDisekat: !menu, butangRetry: retry, duniaTidakDibina: !world, mesej: msg.split('\n')[0] };
  },
  async 'ralat-fasa-b-retry'() {
    const o = await open({ gfx: 'lite' }), { p } = o;
    await toMenu(p);
    await p.evaluate(() => { document.querySelector('script[data-name="v8dunia"]').textContent = 'throw new Error("ujian: modul rupa bumi rosak")'; });
    await p.click('#b19n'); await toReady(p);
    const err = await vis(p, '#b19err'), msg = await p.$eval('#b19ed', e => e.textContent).catch(() => '');
    const playHidden = !(await vis(p, '#b19ready'));
    await shot(p, 'f1-ralat-fasa-b.png');
    await p.click('#b19retry');
    await p.waitForTimeout(1500);
    await toReady(p); o.stop();
    const ready = await vis(p, '#b19ready'); const st = await state(p);
    await shot(p, 'f2-selepas-retry.png');
    await o.ctx.close();
    return { ok: err && playHidden && ready && st.checks.every(c => c.ok), ralatDipapar: err, playDisekat: playHidden, mesej: msg.split('\n').slice(0, 2).join(' | '), selepasRetry: ready ? 'WORLD READY' : 'gagal', mod: st.mode };
  },
  async 'peta-dalam-game'() {
    const o = await open({ gfx: 'lite' }), { p } = o;
    await toMenu(p); await p.click('#b19n'); await toReady(p); o.stop(); await p.click('#b19play'); await p.waitForTimeout(1500);
    for (let i = 0; i < 12 && await p.evaluate(() => !!(window.UI16 && UI16.blocked && UI16.blocked())); i++) {
      const jb = p.getByText('Jom main!', { exact: true }); if (await jb.count()) await jb.first().click().catch(() => {}); await p.waitForTimeout(500); }
    await shot(p, 'h1-peta-mini.png');
    await p.evaluate(() => window.mpOpen(1)); await p.waitForTimeout(2000); await shot(p, 'h2-peta-penuh.png');
    const r = await p.evaluate(() => { const m = W17.mapCanvas(); const pins = (typeof DS !== 'undefined' ? DS : []).map(d => d[1]);
      const need = W19D.LOC.map(l => l.n).filter(n => n !== 'Laluan Hutan Jauh');
      const has = n => pins.includes(n) || (n === 'Sawah' && pins.includes('Sawah')) ;
      return { petaMaster: !!(m && m.width === 1536 && m.height === 1024), pin: pins.length, tiadaPin: need.filter(n => !has(n)), K: W8.mapK }; });
    await o.ctx.close();
    return { ok: r.petaMaster && r.tiadaPin.length === 0, ...r };
  },
  async 'telefon'() {
    const o = await open({ gfx: 'lite', phone: true }), { p } = o;
    await toMenu(p); await shot(p, 'g1-telefon-menu.png');
    await p.click('#b19g'); await p.waitForTimeout(300); await shot(p, 'g2-telefon-grafik.png');
    const tiers = await p.$$eval('#b19gfx [data-k]', a => a.map(e => e.textContent.replace(/\s+/g, ' ').trim()));
    await p.click('#b19gfx [data-k="lite"]'); await p.click('#b19gb');
    await p.click('#b19n'); await p.waitForTimeout(1500); await shot(p, 'g3-telefon-loading.png');
    await toReady(p); o.stop(); await shot(p, 'g4-telefon-ready.png');
    await p.tap('#b19play'); await p.waitForTimeout(3000); await shot(p, 'g5-telefon-dalam-game.png');
    const ov = await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
    await o.ctx.close();
    return { ok: tiers.length === 5 && ov, tahapGrafik: tiers, tiadaSkrolMendatar: ov, log: o.log };
  },
};
for (const [k, f] of Object.entries(S)) {
  if (only.length && !only.includes(k)) continue;
  const t = Date.now();
  try { results[k] = await f(); } catch (e) { results[k] = { ok: false, ralatUjian: String(e && e.stack || e).slice(0, 600) }; }
  results[k].saat = Math.round((Date.now() - t) / 1000);
  console.log((results[k].ok ? 'LULUS ' : 'GAGAL ') + k + ' (' + results[k].saat + ' s)');
}
const prev = fs.existsSync(path.join(OUT, 'acceptance.json')) ? JSON.parse(fs.readFileSync(path.join(OUT, 'acceptance.json'), 'utf8')) : {};
fs.writeFileSync(path.join(OUT, 'acceptance.json'), JSON.stringify({ ...prev, ...results, _tarikh: new Date().toISOString(), _pelayar: 'Chromium ' + browser.version() + ' headless, WebGL SwiftShader (tiada GPU)' }, null, 1));
await browser.close();
