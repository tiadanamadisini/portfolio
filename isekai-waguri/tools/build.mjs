// Build Kediaman Isekai Waguri v19 daripada base/Isekai_v18.html (fail asal TIDAK diubah).
//   node tools/build.mjs            -> dist/Kediaman_Isekai_Waguri_v19.html
// Langkah:
//  1. Kenal pasti setiap blok <script> asal melalui tandatangan unik (build gagal jika blok tidak dikenali / berubah).
//  2. Jadikan setiap skrip boleh-laksana sebagai "tahap" lengai <script type="text/x-waguri19"> yang dijalankan oleh pemuat V19
//     mengikut urutan asal, supaya progress loading adalah sebenar dan ralat boleh dikesan.
//  3. Ganti/ tampal blok yang bergantung pada susun atur dunia lama (V17) dengan versi MASTER MAP (src/v19/replace, tampalan di bawah).
//  4. Sisip skrin boot (logo, progress, menu, ralat, WORLD READY) dan lapisan V19.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const BASE = rd('base/Isekai_v18.html');
const OUT = path.join(ROOT, 'dist', 'Kediaman_Isekai_Waguri_v19.html');

// ----------------------------------------------------------------- jadual tahap: [tandatangan unik, nama, label status, fasa, kritikal, berat lalai]
// berat lalai = masa sebenar yang diukur (unit 25 ms, Chromium + SwiftShader, tahap Biasa); pemuat menggantinya dengan masa sebenar boot
// sebelumnya pada peranti pemain (localStorage waguri_boot_prof19) supaya bar progress lebih sekata.
const ST = [
  ['/* three.js r128 — MIT License', 'three', 'Memuatkan enjin 3D (three.js r128)', 'A', 1, 1],
  ['V14 AWAL: tahap grafik dibaca SEBELUM dunia dibina', 'gfx14', 'Membaca tetapan grafik', 'B', 1, 1],
  ['OrbitControls (three.js r128 examples)', 'orbit', 'Kawalan kamera', 'A', 1, 1],
  ['const QL=(()=>{try{const q=localStorage.getItem(\'waguri_q\')', 'teras', 'Membina dunia asas & watak utama (Loading World)', 'B', 1, 122],
  ['TAMBAHAN V2: alat, dapur, NPC', 'v2', 'Penduduk kampung, alat & dapur (Preparing NPC)', 'B', 1, 3],
  ['V3: model Waguri (OBJ+PBR', 'v3', 'Masa dunia & model', 'B', 1, 4],
  ['V4: terrain bukit baru', 'v4', 'Rupa bumi, nyawa & berenang', 'B', 1, 1],
  ['V5: letak barang, gerai', 'v5', 'Gerai, barang & benih', 'B', 1, 1],
  ['V6: peta+teleport', 'v6', 'Peta, teleport & inventori', 'B', 1, 1],
  ['V7: mati kekal barang', 'v7', 'Sampan & fizik', 'B', 1, 1],
  ['V17 PETA DUNIA (data)', 'w17data', 'Grid ketinggian & kawasan MASTER MAP (Loading World)', 'B', 1, 1],
  ['V8 DUNIA → V17 PETA DUNIA', 'v8dunia', 'Rupa bumi, jalan, sungai & jambatan (Loading World)', 'B', 1, 15],
  ['V8 DUNIA (2): hutan, papan tanda', 'v8dunia2', 'Hutan, papan tanda & pin peta', 'B', 1, 2],
  ['jatuh: mula jatuh sebenar', 'jatuh', 'Fizik jatuh', 'B', 1, 1],
  ['V8 ZON & NPC: jeti', 'v8zon', 'Jeti, kios & NPC pasar (Preparing NPC)', 'B', 1, 2],
  ['V8 GRAFIK: cahaya siang semula jadi', 'v8grafik', 'Langit, kabus & rumput 3D', 'B', 0, 1],
  ['V8 GAYA GRAFIK ikut kualiti', 'v8gaya', 'Gaya grafik', 'B', 0, 1],
  ['Peta mini: sentiasa terpapar di kanan atas', 'petamini', 'Peta mini', 'B', 1, 1],
  ['V9: malam gelap + tiang lampu', 'v9', 'Malam, lampu jalan & haiwan', 'B', 1, 1],
  ["const hari=document.createElement('button')", 'hari', 'Jam & cuaca', 'B', 0, 1],
  ['window.WAGURI_APP=', 'app', 'Maklumat aplikasi', 'B', 0, 1],
  ['V13 GRAFIK PC: HDR', 'fx13', 'Pasca-proses HDR & air (Loading Textures)', 'B', 0, 1],
  ['WGM loader — Waguri Game Model', 'wgm', 'Pemuat model GLB', 'B', 1, 1],
  ['V14A: MODEL GLB WAGURI', 'glb14', 'Watak utama GLB + 23 animasi', 'B', 1, 1],
  ['V14 FX: grafik gaya Unreal Engine 5', 'fx14', 'Cahaya volumetrik & gred warna', 'B', 0, 1],
  ['V15 ANIME: gaya grafik anime', 'anime15', 'Gaya anime (cel-shading)', 'B', 0, 1],
  ['V14 DUNIA (1): PAYA BAKAU', 'paya14', 'Paya Bakau & Laluan Hutan Jauh', 'B', 1, 3],
  ['V14 DUNIA (2): KAWASAN TERNAKAN', 'ternak14', 'Kawasan ternakan', 'B', 1, 1],
  ['V14 RPG: Level 0–60', 'rpg14', 'Level 0–60 & misi utama (Initializing Game Systems)', 'B', 1, 1],
  ['V14 MISI: misi sampingan NPC', 'misi14', 'Misi sampingan & dialog NPC', 'B', 1, 1],
  ['V14 PERTEMPURAN: parang', 'tempur14', 'Sistem pertempuran', 'B', 1, 1],
  ['V14 MEMANCING 2.0', 'pancing14', 'Memancing 2.0', 'B', 1, 1],
  ['V14 ACARA KAMPUNG (1)', 'acara14a', 'Acara kampung (1)', 'B', 0, 1],
  ['V14 ACARA KAMPUNG (2)', 'acara14b', 'Acara kampung (2)', 'B', 0, 1],
  ['V14 LANUN: kapal misteri', 'lanun14', 'Lanun & pertahanan', 'B', 0, 1],
  ['V15 PENDUDUK 3D', 'npc15', 'Penduduk 3D (Preparing NPC)', 'B', 1, 1],
  ['V15 SANDARAN SIMPANAN', 'sandaran15', 'Sandaran simpanan', 'B', 0, 1],
  ['V16 SKRIN KALAH', 'kalah16', 'Skrin kalah', 'B', 0, 1],
  ['V16 DUA TANGAN', 'tangan16', 'Dua tangan', 'B', 0, 1],
  ['V16 UI/UX BAHARU', 'ui16', 'Antara muka (UI/UX)', 'B', 1, 1],
  ['V16.1 PETA PENUH BAHARU', 'peta16', 'Peta penuh', 'B', 1, 1],
  ['V17 PETA DUNIA (2): mercu tanda ikut peta', 'landmark17', 'Mercu tanda MASTER MAP', 'B', 1, 25],
];

// ----------------------------------------------------------------- tampalan: [nama tahap, teks asal (mesti wujud TEPAT sekali), teks baharu, sebab]
const PATCH = [
  ['petamini', 'const K=2,OX=689,OY=285,N=208', 'const K=W19D.MAPK[0],OX=W19D.MAPK[1],OY=W19D.MAPK[2],N=208', 'transformasi peta MASTER MAP'],
  ['v9', 'const MW=1536,MH=1024,MK=2,mX=x=>(x+689)*MK,mZ=z=>(z+285)*MK;', 'const MW=1536,MH=1024,MK=W19D.MAPK[0],mX=x=>(x+W19D.MAPK[1])*MK,mZ=z=>(z+W19D.MAPK[2])*MK;', 'transformasi peta malam'],
  ['peta16', 'const W=1536,H=1024,K=2,OX=689,OY=285;', 'const W=1536,H=1024,K=W19D.MAPK[0],OX=W19D.MAPK[1],OY=W19D.MAPK[2];', 'transformasi peta penuh'],
  ['peta16', "const F={tjn:[-431,-256],tjw:[-589,-90],tjs:[-555,84]};", 'const F=W19D.FLAGS;', 'bendera Laluan Hutan Jauh ikut MASTER MAP'],
  ['misi14', "const FLAGS={tjn:[-431,-256,'Barat Laut'],tjw:[-589,-90,'Tebing Barat'],tjs:[-555,84,'Barat Daya']};",
    "const FLAGS={tjn:[...W19D.FLAGS.tjn,'Barat Laut'],tjw:[...W19D.FLAGS.tjw,'Tebing Barat'],tjs:[...W19D.FLAGS.tjs,'Barat Daya']};", 'bendera misi'],
  ['misi14', "const VIS=[{k:'visit_tjn',x:-431,z:-256,r:7},{k:'visit_tjw',x:-589,z:-90,r:7},{k:'visit_tjs',x:-555,z:84,r:7},",
    "const VIS=[{k:'visit_tjn',x:W19D.FLAGS.tjn[0],z:W19D.FLAGS.tjn[1],r:7},{k:'visit_tjw',x:W19D.FLAGS.tjw[0],z:W19D.FLAGS.tjw[1],r:7},{k:'visit_tjs',x:W19D.FLAGS.tjs[0],z:W19D.FLAGS.tjs[1],r:7},", 'misi utama Bab 5 (bendera)'],
  ['paya14', "L2('🌲 Laluan Hutan Jauh',-400,-252,4);L2('🌲 Laluan Hutan Jauh',-575,-100,4);L2('🌲 Laluan Hutan Jauh',-600,40,4);",
    "{const TP=W19D.TRAIL.p,T2=W19D.TRAIL2.p;[TP[6],TP[13],TP[19],T2[3]].forEach(p=>L2('🌲 Laluan Hutan Jauh',p[0],p[1],4))}", 'label laluan'],
  ['paya14', "W8.sign(-328,-230,[[0,-1,'🌲 Laluan Hutan Jauh (Utara)'],[0,1,'🏰 Kerajaan']]);",
    "W8.sign(W19D.TRAIL.p[0][0],W19D.TRAIL.p[0][1]+4,[[-1,-.3,'🌲 Laluan Hutan Jauh'],[.4,1,'🏰 Kerajaan']]);", 'papan tanda laluan'],
  ['paya14', "[[1,.2,'🐊 Paya Bakau (BAHAYA)'],[-1,-.3,'🏘 Kampung Selatan']]", "[[1,.2,'🐊 Paya Bakau (BAHAYA)'],[-1,-.3,'💧 Tasik Biru · 🏰 Kerajaan']]", 'arah papan tanda paya'],
  ['paya14', "W8.sign(-555,84,[[1,0,'🌲 Hutan Selatan'],[-1,-1,'⚓ Pelabuhan Barat']]);",
    "W8.sign(W19D.FLAGS.tjs[0]+4,W19D.FLAGS.tjs[1]-3,[[1,0,'🌲 Hutan Selatan'],[0,-1,'⚓ Pelabuhan Barat']]);", 'papan tanda barat daya'],
  ['paya14', "W8.sign(-589,-90,[[0,-1,'🌲 Laluan Hutan Jauh (Utara)'],[0,1,'🏖 Pantai Barat']])",
    "W8.sign(W19D.FLAGS.tjw[0]+4,W19D.FLAGS.tjw[1]+3,[[0,-1,'🌲 Laluan Hutan Jauh (Utara)'],[0,1,'🏖 Pantai Barat']])", 'papan tanda tebing barat'],
  ['paya14', "pin('🌲','Laluan Hutan Jauh',-431,-256,Math.PI/2);pin('🚩','Tebing Barat',-589,-90,0);pin('🚩','Barat Daya',-555,84,0)",
    "pin('🌲','Laluan Hutan Jauh',...W8.landNear(...W19D.FLAGS.tjn),Math.PI/2);pin('🚩','Tebing Barat',...W19D.FLAGS.tjw,0);pin('🚩','Barat Daya',...W19D.FLAGS.tjs,0)", 'pin peta laluan'],
  ['acara14a', "['Bendera Barat Laut','Di bawah bendera merah, hujung utara laluan hutan jauh.',-176,-69,24]",
    "['Bendera Barat Laut','Di bawah bendera merah, hujung utara laluan hutan jauh.',W19D.FLAGS.tjn[0]+3,W19D.FLAGS.tjn[1]+2,24]", 'klu harta karun'],
  ['acara14a', "['Bukit Selatan','Di puncak bukit selatan, tempat melihat matahari terbenam.',-92,206,16]",
    "['Bukit Selatan','Di puncak Bukit, tempat melihat matahari terbenam.',W19D.A.bukit[0],W19D.A.bukit[1],16]", 'klu harta karun'],
  ['acara14a', "['Jambatan Paya','Di jambatan kayu merentasi paya — awas buaya!',-262,60,34]",
    "['Jambatan Paya','Di jambatan kayu merentasi paya — awas buaya!',W19D.BR['Jambatan Paya Bakau'][0],W19D.BR['Jambatan Paya Bakau'][1],34]", 'klu harta karun'],
  ['acara14a', "'<b>Selamat datang ke Kampung Isekai v18!</b><br>'+v16", "'<b>Selamat datang ke Kampung Isekai v19!</b><br>'+(window.V19NEWS||'')+v16", 'berita versi'],
  ['acara14a', "if(!GS.v15n){const baru=!GS.v14n;GS.v14n=1;GS.v15n=1;GS.v16n=1;save();", "if(!GS.v15n){const baru=!GS.v14n;GS.v14n=1;GS.v15n=1;GS.v16n=1;GS.v19n=1;save();", 'berita versi'],
  ['app', 'window.WAGURI_APP={"p": "web", "v": "18.0"};', 'window.WAGURI_APP={"p": (/; wv\\)|WaguriApp/.test(navigator.userAgent)?"apk":"web"), "v": "19.0"};', 'versi'],
  ['wgm', '    const u8 = typeof src === \'string\' ? b64(src) : src;\n    const buf = await gunzip(u8);',
    "    const cached = typeof src === 'string' && window.__W19A && window.__W19A.take('wgm14', src.length);\n    const buf = cached || await gunzip(typeof src === 'string' ? b64(src) : src);", 'guna aset yang sudah dinyahmampat oleh pemuat (sekali sahaja)'],
  ['npc15', "const buf=await gunzip(b64(el.textContent.replace(/\\s+/g,'')));el.textContent='';",
    "const s0=el.textContent.replace(/\\s+/g,''),cb=window.__W19A&&__W19A.take('wnp15',s0.length);const buf=cb||await gunzip(b64(s0));el.textContent='';", 'guna aset yang sudah dinyahmampat'],
  ['npc15', "const img=new Image();const src='data:image/jpeg;base64,'+et.textContent.replace(/\\s+/g,'');et.textContent='';\n await new Promise((res,rej)=>{img.onload=res;img.onerror=()=>rej(new Error('tekstur NPC gagal'));img.src=src});",
    "const pim=window.BOOT19&&BOOT19.assets&&BOOT19.assets.wnp15t&&BOOT19.assets.wnp15t.img;const img=pim||new Image();const src=pim?'':'data:image/jpeg;base64,'+et.textContent.replace(/\\s+/g,'');et.textContent='';\n if(!pim)await new Promise((res,rej)=>{img.onload=res;img.onerror=()=>rej(new Error('tekstur NPC gagal'));img.src=src});", 'guna tekstur yang sudah dinyahkod'],
];
const REPLACE = {  // blok diganti sepenuhnya (dunia V17 -> MASTER MAP)
  w17data: 'src/v19/replace/16-w17-data.js',
  v8dunia: 'src/v19/replace/17-world.js',
  v8dunia2: 'src/v19/replace/18-world2.js',
  landmark17: 'src/v19/replace/52-landmarks.js',
};
const INSERT_BEFORE = {  // tahap baharu disisip sebelum tahap asal
  w17data: [['w19data', 'Data dunia MASTER MAP', 1, 2, 'src/v19/world19-data.js', 'A']],  // data sahaja: dinyahmampat dalam Fasa A
};
const APPEND = [['v19teras', 'Lapisan V19 (berita & semakan peta)', 0, 1, 'src/v19/v19-core.js']];

// ----------------------------------------------------------------- huraikan
const re = /<script([^>]*)>([\s\S]*?)<\/script>/g;
let m, out = '', last = 0, si = 0;
const used = new Set(), report = [];
const attrEsc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const stage = (name, label, ph, crit, w, code) => {
  if (/<\/script/i.test(code)) throw new Error('kod tahap ' + name + ' mengandungi </script');
  si++;
  return `<script type="text/x-waguri19" data-i="${si}" data-name="${name}" data-label="${attrEsc(label)}" data-ph="${ph}" data-crit="${crit}" data-w="${w}">${code}</script>`;
};
const apply = (name, code) => {
  let c = code;
  for (const [n, a, b, why] of PATCH) {
    if (n !== name) continue;
    const k = c.split(a).length - 1;
    if (k !== 1) throw new Error(`Tampalan [${name}] (${why}) dijumpai ${k} kali: ${a.slice(0, 70)}`);
    c = c.replace(a, () => b);
    report.push(`tampal ${name}: ${why}`);
  }
  return c;
};
while ((m = re.exec(BASE))) {
  out += BASE.slice(last, m.index);
  last = re.lastIndex;
  const attrs = m[1], body = m[2];
  if (/octet-stream/.test(attrs)) {
    if (/id="w17img"/.test(attrs)) {  // gambar peta: MASTER MAP
      out += `<script type="application/octet-stream" id="w17img">${rd('src/v19/master-map.jpg.b64')}</script>`;
      report.push('aset w17img -> MASTER MAP JPEG');
    } else out += m[0];
    continue;
  }
  const hits = ST.filter(s => body.includes(s[0]));
  if (hits.length !== 1) throw new Error('Blok skrip tidak dikenali / berganda (' + hits.length + '): ' + body.trim().slice(0, 90));
  const [sig, name, label, ph, crit, w] = hits[0];
  if (used.has(name)) throw new Error('Tandatangan berganda: ' + name);
  used.add(name);
  for (const ins of INSERT_BEFORE[name] || []) out += stage(ins[0], ins[1], ins[5] || 'B', ins[2], ins[3], rd(ins[4]));
  let code = REPLACE[name] ? rd(REPLACE[name]) : body;
  if (REPLACE[name]) report.push(`ganti ${name} <- ${REPLACE[name]}`);
  code = apply(name, code);
  out += stage(name, label, ph, crit, w, code);
}
out += BASE.slice(last);
const missing = ST.filter(s => !used.has(s[1]));
if (missing.length) throw new Error('Tahap tidak dijumpai dalam base: ' + missing.map(s => s[1]).join(', '));
const unusedPatch = PATCH.filter(p => !used.has(p[0]));
if (unusedPatch.length) throw new Error('Tampalan tanpa tahap: ' + unusedPatch.map(p => p[0]).join(', '));

// ----------------------------------------------------------------- lapisan V19, skrin boot
let app = '';
for (const [n, l, c, w, f] of APPEND) app += stage(n, l, 'B', c, w, rd(f));
const bootHTML = `<div id="b19" role="dialog" aria-modal="true" aria-label="Memuatkan Kediaman Isekai Waguri">
<div class="b19-bg"></div><div class="b19-vig"></div>
<div class="b19-wrap">
 <div class="b19-logo"><div class="b19-em">🏡</div><h1>Kediaman Isekai Waguri</h1><small>Open World RPG · v19</small></div>
 <div class="b19-panel b19-ld" id="b19ld" aria-live="polite"><div class="b19-ph"><b id="b19ph">Memulakan…</b><span class="b19-pct" id="b19pct">0%</span></div>
  <div class="b19-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"><i id="b19bar"></i></div>
  <div class="b19-st" id="b19st">Menyediakan pemuat</div><div class="b19-sub" id="b19sub"></div><div class="b19-tip" id="b19tip"></div></div>
 <div class="b19-panel b19-menu" id="b19menu" hidden></div>
 <div class="b19-panel b19-gfx" id="b19gfx" hidden></div>
 <div class="b19-panel b19-err" id="b19err" hidden><h2>⚠️ Gagal memuatkan</h2><p id="b19em" style="font-size:13px;margin:0 0 8px"></p><pre id="b19ed"></pre>
  <div class="b19-row" style="margin-top:10px"><button class="b19-btn b19-pri" id="b19retry">🔄 CUBA LAGI (RETRY)</button><button class="b19-btn" id="b19copy">📋 Salin laporan</button></div></div>
 <div class="b19-panel b19-ready" id="b19ready" hidden><div class="b19-big">WORLD READY</div><p id="b19rp"></p><details class="b19-warn" id="b19w" hidden><summary></summary><ul></ul></details>
  <button class="b19-btn b19-pri" id="b19play" style="width:100%;justify-content:center">▶ MAIN (PLAY)</button></div>
</div>
<div class="b19-ver">v19.0 · three.js r128 · <span id="b19dev"></span></div>
</div>`;
const n1 = out.split('<body>').length - 1;
if (n1 !== 1) throw new Error('<body> tidak unik');
out = out.replace('<body>', '<body>\n' + bootHTML);
out = out.replace('</head>', `<style>${rd('src/v19/boot.css')}</style>\n</head>`);
const nb = out.split('</body>').length - 1;
if (nb !== 1) throw new Error('</body> tidak unik');
out = out.replace('</body>', app + `<script>${rd('src/v19/boot.js')}</script>\n</body>`);
out = out.replace('<title>Kediaman Isekai Waguri v18</title>', '<title>Kediaman Isekai Waguri v19</title>');
if (!out.includes('<title>Kediaman Isekai Waguri v19</title>')) throw new Error('tajuk tidak dikemas kini');
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out);
console.log(report.join('\n'));
console.log(`\n${si} tahap · ${(out.length / 1048576).toFixed(2)} MB -> ${path.relative(ROOT, OUT)}`);
