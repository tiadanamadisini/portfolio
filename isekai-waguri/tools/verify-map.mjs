// Semakan peta (Seksyen 12F): boot game sebenar → tangkap top-down dunia 3D → data lokasi/jalan/jambatan → kebolehcapaian.
//   node tools/verify-map.mjs        (kemudian: python3 -I tools/verify_map.py)
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'docs', 'img', 'verify');
fs.mkdirSync(OUT, { recursive: true });
const url = 'file://' + path.join(ROOT, 'dist', 'Kediaman_Isekai_Waguri_v19.html');
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
const errs = [];
p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => { try { if (!sessionStorage.getItem('s')) { sessionStorage.setItem('s', 1); localStorage.clear(); localStorage.setItem('waguri_gfx', 'lite'); } } catch (e) {} });
await p.goto(url);
await p.waitForSelector('#b19menu:not([hidden])', { timeout: 300000 });
await p.click('#b19n');
await p.waitForSelector('#b19ready:not([hidden]), #b19err:not([hidden])', { timeout: 600000 });
if (await p.$('#b19err:not([hidden])')) { console.log(await p.$eval('#b19ed', e => e.textContent)); process.exit(1); }
await p.click('#b19play');
// tengah hari supaya warna kawasan jelas (masa dalam game: GS.t 450 = 12:00)
await p.evaluate(() => { GS.t = 450; try { QS14.close && QS14.close(); } catch (e) {} });
await p.waitForTimeout(5000);
const td = await p.evaluate(() => MAPV19.topdown());
fs.writeFileSync(path.join(OUT, 'topdown-3d.png'), Buffer.from(td.split(',')[1], 'base64'));
const probe = await p.evaluate(() => MAPV19.probe());
fs.writeFileSync(path.join(OUT, 'probe.json'), JSON.stringify(probe, null, 1));
const reach = await p.evaluate(() => MAPV19.reach(2));
fs.writeFileSync(path.join(OUT, 'reach.json'), JSON.stringify(reach));
// pandangan sudut di beberapa mercu tanda (bukti visual 3D)
const shots = [['kerajaan', 'Kerajaan'], ['air-terjun', 'Air Terjun'], ['kawasan-larangan', 'Kawasan Larangan'], ['pelabuhan-barat', 'Pelabuhan Barat']];
for (const [f, n] of shots) {
  const png = await p.evaluate(n => { const L = W19D.LOC.find(l => l.n === n); const x = L.x, z = L.z, y = W8.SF(x, z);
    const c = camera.clone(); c.far = 2000; c.position.set(x + 75, y + 60, z + 75); c.lookAt(x, y, z); c.updateProjectionMatrix();
    (W8.tc || []).forEach(m => m.visible = true); renderer.render(scene, c); return renderer.domElement.toDataURL('image/jpeg', 0.85); }, n);
  fs.writeFileSync(path.join(OUT, 'view-' + f + '.jpg'), Buffer.from(png.split(',')[1], 'base64'));
}
console.log('ralat halaman:', errs.length ? errs : 'tiada');
console.log('lokasi:', probe.loc.length, '· jambatan/jeti:', probe.bridges.length, '· jalan:', probe.roads.length, '· sel kaki:', reach.footCells, '/', reach.landCells);
await b.close();
