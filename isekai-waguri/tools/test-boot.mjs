// Ujian aliran boot v19 dalam Chromium headless (WebGL SwiftShader).
//   node tools/test-boot.mjs [gfx=lite] [mode=new|continue] [outdir=docs/img/test]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const gfx = process.argv[2] || 'lite', mode = process.argv[3] || 'new', outdir = path.join(ROOT, process.argv[4] || 'docs/img/test');
fs.mkdirSync(outdir, { recursive: true });
const url = 'file://' + path.join(ROOT, 'dist', 'Kediaman_Isekai_Waguri_v19.html');
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
const p = await ctx.newPage();
const logs = [];
p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') logs.push(m.type() + ': ' + m.text().slice(0, 300)); });
p.on('pageerror', e => logs.push('PAGEERROR: ' + e.message));
const seed = process.env.SAVE ? fs.readFileSync(process.env.SAVE, 'utf8') : null;
await p.addInitScript(([g, s]) => { try { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem('waguri_gfx', g); if (s) localStorage.setItem('waguri_isekai_v1', s); } } catch (e) {} }, [gfx, seed]);
const t0 = Date.now(), T = () => ((Date.now() - t0) / 1000).toFixed(1) + 's';
const pct = [];
await p.goto(url, { waitUntil: 'commit', timeout: 120000 });
await p.waitForSelector('#b19', { timeout: 60000 });
await p.waitForTimeout(400);
await p.screenshot({ path: path.join(outdir, '01-logo-loading.jpg'), type: 'jpeg', quality: 78 });
const sample = async () => { try { pct.push([T(), await p.$eval('#b19pct', e => e.textContent), await p.$eval('#b19st', e => e.textContent)]); } catch (e) {} };
const iv = setInterval(sample, 700);
await p.waitForFunction(() => { const m = document.getElementById('b19menu'), e = document.getElementById('b19err'); return (m && !m.hidden) || (e && !e.hidden); }, null, { timeout: 300000 });
if (await p.$eval('#b19err', e => !e.hidden)) { console.log('RALAT FASA A:', await p.$eval('#b19ed', e => e.textContent)); await p.screenshot({ path: path.join(outdir, 'err.jpg'), type: 'jpeg', quality: 78 }); process.exit(1); }
console.log('MENU pada', T());
await p.screenshot({ path: path.join(outdir, '02-menu.jpg'), type: 'jpeg', quality: 78 });
await p.click(mode === 'continue' ? '#b19c' : '#b19n');
if (mode === 'new' && await p.$('#b19y')) { await p.screenshot({ path: path.join(outdir, '02b-confirm.jpg'), type: 'jpeg', quality: 78 }); await p.click('#b19y'); }
await p.waitForTimeout(1500);
await p.screenshot({ path: path.join(outdir, '03-loading-world.jpg'), type: 'jpeg', quality: 78 });
await p.waitForFunction(() => { const r = document.getElementById('b19ready'), e = document.getElementById('b19err'); return (r && !r.hidden) || (e && !e.hidden); }, null, { timeout: 600000 });
clearInterval(iv);
if (await p.$eval('#b19err', e => !e.hidden)) { console.log('RALAT FASA B:', await p.$eval('#b19ed', e => e.textContent)); await p.screenshot({ path: path.join(outdir, 'err.jpg'), type: 'jpeg', quality: 78 }); }
else {
  console.log('WORLD READY pada', T());
  await p.screenshot({ path: path.join(outdir, '04-world-ready.jpg'), type: 'jpeg', quality: 78 });
  await p.click('#b19play');
  await p.waitForTimeout(6000);
  await p.screenshot({ path: path.join(outdir, '05-in-game.jpg'), type: 'jpeg', quality: 78 });
}
const st = await p.evaluate(() => { const B = window.BOOT19; return { phase: B.phase, done: B.done, tA: B.tA, tB: B.tB, mode: B.mode, warn: B.warnU || B.warn, checks: B.checks, stageMs: B.stageMs, jobs: B.jobs.map(j => [j.done, j.ms, j.cond.slice(0, 60)]), gpu: B.gpu }; });
fs.writeFileSync(path.join(outdir, 'boot-report.json'), JSON.stringify({ gfx, mode, progress: pct, state: st, console: logs }, null, 1));
console.log(JSON.stringify({ tA: st.tA, tB: st.tB, done: st.done, warn: st.warn, checks: (st.checks || []).map(c => (c.ok ? 'LULUS ' : 'GAGAL ') + c.n + ' — ' + c.d) }, null, 1));
console.log('progress samples:', pct.map(x => x[1]).join(' '));
console.log(logs.slice(0, 25).join('\n'));
await b.close();
