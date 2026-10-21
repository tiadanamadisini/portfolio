# Laporan Ujian Penerimaan — v19

Dijana oleh `tools/report_tests.py` daripada keputusan ujian automatik sebenar (`tools/test-acceptance.mjs`, `tools/verify-map.mjs`). 
Persekitaran: Chromium 141.0.7390.37 headless, WebGL SwiftShader (tiada GPU). **Tiada GPU** — WebGL dipaparkan oleh perisian (SwiftShader), jadi masa loading & fps di sini jauh lebih perlahan daripada telefon sebenar dan **bukan** ukuran prestasi peranti.

Tarikh: 2026-10-21T18:09:22.424Z

## A. Senario automatik

| Senario | Keputusan | Bukti |
|---|---|---|
| Permainan baharu (tahap Biasa): logo → progress → menu → muat dunia → WORLD READY → MAIN → bergerak → simpan → muat semula → TERUSKAN | ✅ LULUS | [a1-logo](img/test/a1-logo.jpg) [a2-menu](img/test/a2-menu.jpg) [a3-loading-dunia](img/test/a3-loading-dunia.jpg) [a4-world-ready](img/test/a4-world-ready.jpg) [a5-dalam-game](img/test/a5-dalam-game.jpg) |
| TERUSKAN dengan simpanan **v18 sebenar** (RM1,234 · Hari 7 · Level 12 · 9 ikan · 15 kayu) | ✅ LULUS | [b1-menu-simpanan-v18](img/test/b1-menu-simpanan-v18.jpg) [b2-teruskan-v18](img/test/b2-teruskan-v18.jpg) |
| MULA BAHARU ketika simpanan wujud → pengesahan → sandaran `_bak19` → permainan baharu | ✅ LULUS | [c1-sahkan-mula-baharu](img/test/c1-sahkan-mula-baharu.jpg) |
| Tahap High: model GLB Waguri + animasi + 39 penduduk 3D; aset dinyahmampat sekali sahaja oleh pemuat | ✅ LULUS | [d1-high-world-ready](img/test/d1-high-world-ready.jpg) [d2-high-dalam-game](img/test/d2-high-dalam-game.jpg) |
| Ralat aset kritikal (WebView tanpa DecompressionStream) → skrin ralat + RETRY, dunia tidak dibina | ✅ LULUS | [e1-ralat-fasa-a](img/test/e1-ralat-fasa-a.jpg) |
| Modul kritikal rosak semasa muat dunia → ralat + RETRY → muat semula berjaya → WORLD READY | ✅ LULUS | [f1-ralat-fasa-b](img/test/f1-ralat-fasa-b.jpg) [f2-selepas-retry](img/test/f2-selepas-retry.jpg) |
| Peta mini & peta penuh memaparkan MASTER MAP + pin semua lokasi | ✅ LULUS | [h1-peta-mini](img/test/h1-peta-mini.jpg) [h2-peta-penuh](img/test/h2-peta-penuh.jpg) |
| Telefon potret 412×915 (sentuh): menu, 5 tahap grafik, loading, WORLD READY, dalam game, tiada skrol mendatar | ✅ LULUS | [g1-telefon-menu](img/test/g1-telefon-menu.jpg) [g2-telefon-grafik](img/test/g2-telefon-grafik.jpg) [g3-telefon-loading](img/test/g3-telefon-loading.jpg) [g4-telefon-ready](img/test/g4-telefon-ready.jpg) [g5-telefon-dalam-game](img/test/g5-telefon-dalam-game.jpg) |

## B. Syarat Seksyen 13 (Final Acceptance Test)

| # | Syarat | Status | Bukti / catatan |
|---|---|---|---|
| 1 | APK membuka loading screen terlebih dahulu | ⚠️ SEPARA | HTML: ✅ logo + loading muncul dahulu (a1). APK debug ✅ **berjaya dibina** oleh GitHub Actions (aliran kerja *Isekai Waguri APK*, artifak `KediamanIsekaiWaguri-v19-debug-apk`, 5.1 MB) — tetapi **belum dipasang/diuji pada telefon Android sebenar**. |
| 2 | Progress loading menunjukkan kemajuan sebenar | ✅ LULUS | Berat tugasan = masa/bait sebenar; menaik secara monoton (Fasa A 2, Fasa B 43 sampel). Bait nyahmampat dipaparkan untuk aset gzip. |
| 3 | Butang PLAY hanya aktif selepas aset kritikal siap | ✅ LULUS | PLAY hanya dipaparkan selepas 17 semakan kritikal lulus; input permainan disekat semasa loading (`gameInputBlocked` = True semasa, False selepas). |
| 4 | Main Character muncul dengan model & animasi yang betul | ✅ LULUS | High: GLB sedia, 23 animasi; Biasa: model prosedural (mengikut reka bentuk asal tahap ringan). |
| 5 | Kawasan permulaan tidak kosong | ✅ LULUS | Semakan rupa bumi/bangunan/jalan lulus; tangkapan a5, d2. |
| 6 | Semua lokasi asal wujud dalam dunia 3D | ✅ LULUS | 38/38 lokasi (docs/03). |
| 7 | Kedudukan lokasi sepadan dengan peta rujukan | ✅ LULUS | IoU darat/air 0.968, F1 garis pantai 0.913 (4 m) · 0.953 (8 m); ralat kedudukan lokasi 0 m. |
| 8 | Jalan, jambatan, sungai dan air terjun berfungsi | ✅ LULUS | 42 jalan, 33 jambatan/jeti, 0 jalan merentas air tanpa jambatan, 2 air terjun. Air sungai belum beranimasi aliran (Fasa 3). |
| 9 | Semua lokasi utama boleh dikunjungi | ✅ LULUS | 93.7 % darat boleh dicapai berjalan kaki; pulau kecil/Pulau Rahsia melalui renang/sampan. |
| 10 | Quest dan NPC penting berfungsi | ✅ LULUS | Sistem v18 dikekalkan: 52 misi utama, 24 sampingan, 28 NPC bernama + Tok Ketua (semakan automatik). Tiada misi baharu dalam v19. |
| 11 | Save/load mengekalkan kemajuan serta perubahan dunia | ✅ LULUS | Simpanan v18 dipulihkan tepat; simpan → muat semula → TERUSKAN (RM777) lulus. |
| 12 | Peta dalam game sepadan dengan geografi sebenar | ✅ LULUS | Peta = MASTER MAP; pin di koordinat dunia; transformasi diselaraskan di 5 tempat. |
| 13 | Tiada aset kritikal hilang / loading tersekat tanpa mesej ralat | ✅ LULUS | Ralat Fasa A & B dipaparkan dengan butang RETRY; had masa 180 s untuk sistem tak segerak. |
| 14 | Prestasi diuji pada peranti Android sasaran | ⛔ BELUM | **Belum diuji** pada telefon sebenar. Ujian di sini menggunakan pemapar perisian tanpa GPU. Ditetapkan untuk Fasa 7. |
| 15 | Laporan ujian menyatakan lulus/gagal/belum | ✅ LULUS | Dokumen ini. |

## C. Senarai semak preloading (Seksyen 11)

| Syarat | Status |
|---|---|
| Watak utama dimuatkan — player dalam adegan | ✅ LULUS |
| Model & animasi watak — model prosedural (tahap lite) | ✅ LULUS |
| Rupa bumi kawasan permulaan — 90652 bucu | ✅ LULUS |
| Pemain berdiri di atas tanah — y=0.00 tanah=0.00 | ✅ LULUS |
| Bangunan, jalan, jambatan — 42 jalan · 33 jambatan/jeti | ✅ LULUS |
| Sungai & air terjun — sungai 78 titik | ✅ LULUS |
| Pelanggaran (collision) & interaksi — 3787 halangan · 500 titik interaksi | ✅ LULUS |
| NPC penting & rutin — 28 NPC bernama · Tok Ketua ada | ✅ LULUS |
| Sistem misi — 52 misi utama · 24 sampingan | ✅ LULUS |
| Inventori & ekonomi — 47 jenis barang · RM20 | ✅ LULUS |
| Pertempuran — 11 jenis musuh | ✅ LULUS |
| Kamera — FOV 50 | ✅ LULUS |
| Kawalan skrin sentuh — kayu bedik & butang lompat | ✅ LULUS |
| Data simpanan dibaca & disahkan — permainan baharu · Hari 1 | ✅ LULUS |
| Pencahayaan & tetapan grafik — tahap ⚪ Biasa | ✅ LULUS |
| Peta dalam game (MASTER MAP) — 1536×1024 · 38 lokasi | ✅ LULUS |
| Semua lokasi asal wujud — 38 lokasi | ✅ LULUS |
| Collision & data navigasi kawasan permulaan | ✅ LULUS (navigasi NPC berasaskan graf jalan belum dibina — Fasa 4) |
| World streaming kawasan jauh | ⛔ BELUM — dunia teras (1 km²) dimuat sepenuhnya sebelum main; streaming sel diperlukan untuk pengembangan 10× (Fasa 6) |

## D. Masa loading yang diukur (SwiftShader, bukan telefon)

| Senario | Fasa A (aset) | Fasa B (dunia) |
|---|---|---|
| baharu-biasa | 617 ms | 17033 ms |
| high-glb | 276 ms | 61505 ms |
| teruskan-v18 | — ms | 52196 ms |

## E. Ciri yang diminta tetapi BELUM dilaksanakan dalam v19

- ⛔ 12 kampung · 5 bandar · 20 gua · 8 dungeon · 15 pulau · 30 lokasi rahsia (pengembangan 10×)
- ⛔ 300 NPC dengan jadual harian, memori & reputasi
- ⛔ 100/300/100/150/50/30 misi utama/sampingan/dunia/peristiwa/tersembunyi/bos
- ⛔ Dodge, parry, block, serangan berat, spear, pokok kemahiran, crafting senjata
- ⛔ Mendaki, menyelam, menunggang kuda, memburu, hiasan rumah, musim
- ⛔ Grafik PBR bertekstur, GI, refleksi air sebenar, sungai mengalir, kabus volumetrik baharu
- ⛔ World streaming & LOD bangunan
- ⛔ APK diuji pada peranti Android sebenar (APK sudah dibina oleh CI, belum dipasang)

Pelan terperinci: [05-PELAN-FASA.md](05-PELAN-FASA.md).
