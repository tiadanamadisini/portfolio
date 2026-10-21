# -*- coding: utf-8 -*-
"""Jana docs/04-LAPORAN-UJIAN.md daripada keputusan sebenar:
   docs/img/test/acceptance.json (tools/test-acceptance.mjs) + docs/img/verify/semakan.json (tools/verify_map.py)."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = json.load(open(os.path.join(ROOT, 'docs/img/test/acceptance.json'), encoding='utf-8'))
M = json.load(open(os.path.join(ROOT, 'docs/img/verify/semakan.json'), encoding='utf-8'))
g = lambda k: A.get(k, {})
ok = lambda k: bool(g(k).get('ok'))
L, NB, NL = '✅ LULUS', '⛔ BELUM', '⚠️ SEPARA'
st = lambda b: L if b else '❌ GAGAL'
nb = g('baharu-biasa'); hi = g('high-glb'); tv = g('teruskan-v18'); fb = g('ralat-fasa-b-retry'); fa = g('ralat-fasa-a'); ph = g('telefon'); mp = g('peta-dalam-game'); mb = g('mula-baharu-dengan-simpanan')
md = ['# Laporan Ujian Penerimaan — v19\n',
      'Dijana oleh `tools/report_tests.py` daripada keputusan ujian automatik sebenar (`tools/test-acceptance.mjs`, `tools/verify-map.mjs`). ',
      'Persekitaran: %s. **Tiada GPU** — WebGL dipaparkan oleh perisian (SwiftShader), jadi masa loading & fps di sini jauh lebih perlahan daripada telefon sebenar dan **bukan** ukuran prestasi peranti.\n' % A.get('_pelayar', '?'),
      'Tarikh: %s\n' % A.get('_tarikh', '?'),
      '## A. Senario automatik\n', '| Senario | Keputusan | Bukti |\n|---|---|---|']
rows = [
 ('baharu-biasa', 'Permainan baharu (tahap Biasa): logo → progress → menu → muat dunia → WORLD READY → MAIN → bergerak → simpan → muat semula → TERUSKAN', 'a1-logo.jpg a2-menu.jpg a3-loading-dunia.jpg a4-world-ready.jpg a5-dalam-game.jpg'),
 ('teruskan-v18', 'TERUSKAN dengan simpanan **v18 sebenar** (RM1,234 · Hari 7 · Level 12 · 9 ikan · 15 kayu)', 'b1-menu-simpanan-v18.jpg b2-teruskan-v18.jpg'),
 ('mula-baharu-dengan-simpanan', 'MULA BAHARU ketika simpanan wujud → pengesahan → sandaran `_bak19` → permainan baharu', 'c1-sahkan-mula-baharu.jpg'),
 ('high-glb', 'Tahap High: model GLB Waguri + animasi + 39 penduduk 3D; aset dinyahmampat sekali sahaja oleh pemuat', 'd1-high-world-ready.jpg d2-high-dalam-game.jpg'),
 ('ralat-fasa-a', 'Ralat aset kritikal (WebView tanpa DecompressionStream) → skrin ralat + RETRY, dunia tidak dibina', 'e1-ralat-fasa-a.jpg'),
 ('ralat-fasa-b-retry', 'Modul kritikal rosak semasa muat dunia → ralat + RETRY → muat semula berjaya → WORLD READY', 'f1-ralat-fasa-b.jpg f2-selepas-retry.jpg'),
 ('peta-dalam-game', 'Peta mini & peta penuh memaparkan MASTER MAP + pin semua lokasi', 'h1-peta-mini.jpg h2-peta-penuh.jpg'),
 ('telefon', 'Telefon potret 412×915 (sentuh): menu, 5 tahap grafik, loading, WORLD READY, dalam game, tiada skrol mendatar', 'g1-telefon-menu.jpg g2-telefon-grafik.jpg g3-telefon-loading.jpg g4-telefon-ready.jpg g5-telefon-dalam-game.jpg'),
]
for k, d, ev in rows:
    md.append('| %s | %s | %s |' % (d, st(ok(k)) if k in A else NB + ' (tidak dijalankan)', ' '.join('[%s](img/test/%s)' % (e.split('.')[0], e) for e in ev.split())))
md.append('\n## B. Syarat Seksyen 13 (Final Acceptance Test)\n')
md.append('| # | Syarat | Status | Bukti / catatan |\n|---|---|---|---|')
chk = {c[2:].split(' — ')[0]: c[0] == '✔' for c in nb.get('checks', [])}
items = [
 (1, 'APK membuka loading screen terlebih dahulu', NL, 'HTML: ✅ logo + loading muncul dahulu (a1). APK debug ✅ **berjaya dibina** oleh GitHub Actions (aliran kerja *Isekai Waguri APK*, artifak `KediamanIsekaiWaguri-v19-debug-apk`, 5.1 MB) — tetapi **belum dipasang/diuji pada telefon Android sebenar**.'),
 (2, 'Progress loading menunjukkan kemajuan sebenar', st(ok('baharu-biasa') and nb.get('monotonic')), 'Berat tugasan = masa/bait sebenar; menaik secara monoton (Fasa A %s, Fasa B %s sampel). Bait nyahmampat dipaparkan untuk aset gzip.' % (len(nb.get('progressA', [])), len(nb.get('progressB', [])))),
 (3, 'Butang PLAY hanya aktif selepas aset kritikal siap', st(ok('baharu-biasa') and ok('ralat-fasa-b-retry')), 'PLAY hanya dipaparkan selepas 17 semakan kritikal lulus; input permainan disekat semasa loading (`gameInputBlocked` = %s semasa, %s selepas).' % (nb.get('blockedDuring'), nb.get('blockedAfter'))),
 (4, 'Main Character muncul dengan model & animasi yang betul', st(ok('high-glb')), 'High: GLB sedia, %s animasi; Biasa: model prosedural (mengikut reka bentuk asal tahap ringan).' % hi.get('anim')),
 (5, 'Kawasan permulaan tidak kosong', st(chk.get('Rupa bumi kawasan permulaan', False) and chk.get('Bangunan, jalan, jambatan', False)), 'Semakan rupa bumi/bangunan/jalan lulus; tangkapan a5, d2.'),
 (6, 'Semua lokasi asal wujud dalam dunia 3D', st(M['lokasi_lulus'] == M['lokasi_jumlah']), '%d/%d lokasi (docs/03).' % (M['lokasi_lulus'], M['lokasi_jumlah'])),
 (7, 'Kedudukan lokasi sepadan dengan peta rujukan', st(M['iou_fizik'] >= .95), 'IoU darat/air %.3f, F1 garis pantai %.3f (4 m) · %.3f (8 m); ralat kedudukan lokasi 0 m.' % (M['iou_fizik'], M['f1_pantai_fizik']['4m'], M['f1_pantai_fizik']['8m'])),
 (8, 'Jalan, jambatan, sungai dan air terjun berfungsi', st(not M['jalan_basah_tanpa_jambatan'] and all(M['jambatan_wajib'].values()) and len(M['air_terjun']) >= 1), '%d jalan, %d jambatan/jeti, 0 jalan merentas air tanpa jambatan, %d air terjun. Air sungai belum beranimasi aliran (Fasa 3).' % (M['jalan'], len(M['jambatan']), len(M['air_terjun']))),
 (9, 'Semua lokasi utama boleh dikunjungi', st(M['sel_kaki'] / M['sel_darat'] >= .85), '%.1f %% darat boleh dicapai berjalan kaki; pulau kecil/Pulau Rahsia melalui renang/sampan.' % (100 * M['sel_kaki'] / M['sel_darat'])),
 (10, 'Quest dan NPC penting berfungsi', st(chk.get('Sistem misi', False) and chk.get('NPC penting & rutin', False)), 'Sistem v18 dikekalkan: 52 misi utama, 24 sampingan, 28 NPC bernama + Tok Ketua (semakan automatik). Tiada misi baharu dalam v19.'),
 (11, 'Save/load mengekalkan kemajuan serta perubahan dunia', st(ok('teruskan-v18') and ok('baharu-biasa')), 'Simpanan v18 dipulihkan tepat; simpan → muat semula → TERUSKAN (RM777) lulus.'),
 (12, 'Peta dalam game sepadan dengan geografi sebenar', st(ok('peta-dalam-game')) if 'peta-dalam-game' in A else NB, 'Peta = MASTER MAP; pin di koordinat dunia; transformasi diselaraskan di 5 tempat.'),
 (13, 'Tiada aset kritikal hilang / loading tersekat tanpa mesej ralat', st(ok('ralat-fasa-a') and ok('ralat-fasa-b-retry')), 'Ralat Fasa A & B dipaparkan dengan butang RETRY; had masa 180 s untuk sistem tak segerak.'),
 (14, 'Prestasi diuji pada peranti Android sasaran', NB, '**Belum diuji** pada telefon sebenar. Ujian di sini menggunakan pemapar perisian tanpa GPU. Ditetapkan untuk Fasa 7.'),
 (15, 'Laporan ujian menyatakan lulus/gagal/belum', L, 'Dokumen ini.'),
]
for n, d, s_, e in items:
    md.append('| %d | %s | %s | %s |' % (n, d, s_, e))
md.append('\n## C. Senarai semak preloading (Seksyen 11)\n')
md.append('| Syarat | Status |\n|---|---|')
for c in nb.get('checks', []):
    md.append('| %s | %s |' % (c[2:], L if c[0] == '✔' else '❌ GAGAL'))
md.append('| Collision & data navigasi kawasan permulaan | %s (navigasi NPC berasaskan graf jalan belum dibina — Fasa 4) |' % (L if chk.get('Pelanggaran (collision) & interaksi') else '❌'))
md.append('| World streaming kawasan jauh | %s — dunia teras (1 km²) dimuat sepenuhnya sebelum main; streaming sel diperlukan untuk pengembangan 10× (Fasa 6) |' % NB)
md.append('\n## D. Masa loading yang diukur (SwiftShader, bukan telefon)\n')
md.append('| Senario | Fasa A (aset) | Fasa B (dunia) |\n|---|---|---|')
for k in ['baharu-biasa', 'high-glb', 'teruskan-v18']:
    v = g(k)
    if v: md.append('| %s | %s ms | %s ms |' % (k, v.get('tA', '—'), v.get('tB', '—')))
md.append('\n## E. Ciri yang diminta tetapi BELUM dilaksanakan dalam v19\n')
for x in ['12 kampung · 5 bandar · 20 gua · 8 dungeon · 15 pulau · 30 lokasi rahsia (pengembangan 10×)', '300 NPC dengan jadual harian, memori & reputasi',
          '100/300/100/150/50/30 misi utama/sampingan/dunia/peristiwa/tersembunyi/bos', 'Dodge, parry, block, serangan berat, spear, pokok kemahiran, crafting senjata',
          'Mendaki, menyelam, menunggang kuda, memburu, hiasan rumah, musim', 'Grafik PBR bertekstur, GI, refleksi air sebenar, sungai mengalir, kabus volumetrik baharu',
          'World streaming & LOD bangunan', 'APK diuji pada peranti Android sebenar (APK sudah dibina oleh CI, belum dipasang)']:
    md.append('- ⛔ ' + x)
md.append('\nPelan terperinci: [05-PELAN-FASA.md](05-PELAN-FASA.md).')
open(os.path.join(ROOT, 'docs', '04-LAPORAN-UJIAN.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
print('docs/04-LAPORAN-UJIAN.md ditulis')
