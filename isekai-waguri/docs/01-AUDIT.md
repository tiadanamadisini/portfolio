# Fasa 1 — Laporan Audit Projek (Kediaman Isekai Waguri v18)

Tarikh audit: 2026-10-21 · Diaudit oleh: pasukan pembangunan (Claude Code)

## 1. Bahan yang diterima

| Bahan | Status | Catatan |
|---|---|---|
| APK v16.1 | **Tidak diterima** | Tiada fail APK dilampirkan dalam sesi ini. APK tidak dapat diaudit. |
| `Isekai_v18.html` (6.58 MB) | Diterima, diaudit penuh | Lebih baharu daripada APK v16.1. Disimpan tanpa diubah di `base/Isekai_v18.html` (SHA-256 `279385b5…dcdc7341`). |
| Gambar peta (1536×1024 PNG) | Diterima | Dijadikan **MASTER WORLD MAP** di `reference/master-map.png`. |

Kesimpulan: audit dibuat ke atas kod sumber HTML v18, bukan APK. APK v16.1 dipercayai ialah pembalut WebView bagi fail HTML yang sama (tiada kod Unity/Godot/Unreal), kerana HTML ini sudah mengandungi kod pengesanan platform (`WAGURI_APP={"p":"web","v":"18.0"}`) dan sandaran simpanan "HTML ↔ APK". Pengesahan muktamad memerlukan fail APK.

## 2. Teknologi

| Komponen | Butiran |
|---|---|
| Jenis projek | **Game HTML satu fail** (sesuai untuk WebView Android). Bukan projek engine. |
| Enjin 3D | **three.js r128** (terbenam, 603 KB) + OrbitControls |
| Bahasa | JavaScript (ES2017+), tiada langkah build, tiada modul |
| Seni bina | **37 lapisan skrip tampalan** (V2 → V17). Setiap versi membungkus (`monkey-patch`) fungsi global versi sebelumnya, cth. `window.gtick`, `window.gY2`, `window.lifeLost`. |
| Aset terbenam | `wgm14` model Waguri GLB/WGM (gzip, 1.49 MB → 2.48 MB) · `wnp15` 20 reka bentuk penduduk 3D (gzip, 1.27 MB) · `wnp15t` tekstur penduduk (JPEG 2048×1024) · `w17img` gambar peta lama (JPEG 1536×1024) · fon Plus Jakarta Sans (woff2) |
| Simpanan | `localStorage` kunci `waguri_isekai_v1` (JSON `GS`, dengan `normalizeSaveData`), sandaran `_bak15`, `_bak18`; tetapan `waguri_gfx`, `waguri_q`, `waguri_snd`, `waguri_sh`, `waguri_flip`, `waguri_fxo`, `waguri_mapz`, `waguri_v17` |
| Kebergantungan luar | Tiada (berfungsi luar talian). Memerlukan `DecompressionStream` (Chrome/WebView 80+). |

## 3. Urutan boot asal (v18)

1. Pelayar menghurai 6.5 MB HTML; setiap `<script>` dilaksanakan serta-merta mengikut urutan.
2. Skrip utama memanggil `fpsBind(); init(); gInit();` → kanvas WebGL dipasang dan gelung `requestAnimationFrame` **bermula serta-merta**.
3. Lapisan V8–V17 membina dunia secara segerak; lapisan V14–V17 menunggu syarat melalui `when14()` (tinjauan setiap 250 ms, maksimum 150 s).
4. Model GLB Waguri (`G14.ready`), penduduk 3D (`NPC15.ok`) dan mercu tanda peta (`W17.ok`) siap secara tak segerak **selepas** pemain sudah boleh bergerak.

**Masalah:** pemain dibawa terus ke dunia; tiada logo, tiada skrin loading, tiada menu utama, tiada START/CONTINUE, tiada mesej ralat bila sistem gagal (ralat hanya ke `console.error`). Pada mod Ultra, watak prosedural kelihatan dahulu kemudian bertukar kepada GLB beberapa saat kemudian.

## 4. Inventori sistem yang wujud dan berfungsi (disahkan dalam Chromium headless)

| Sistem | Isi kandungan sebenar (dikira semasa runtime) | Objek global |
|---|---|---|
| Watak utama | Waguri prosedural (Ringan/Biasa) + model GLB 94 tulang, **23 animasi** (Biasa, Jalan, Lari, Berenang, Mendayung, Memancing, TebangPokok, Tidur, Pengsan, …) untuk Sinematik/Ultra/Extreme | `player`, `G14` |
| Penduduk | 28 NPC bernama (V2) + 22 NPC pasar/pantai (V8) + 20 reka bentuk model 3D bertekstur (39 contoh di dunia) | `npcs`, `W8.np`, `NPC15` |
| Misi utama | **52 misi** dalam **9 Bab** (Kehidupan Baru → Bangkit Semula) | `Q`, `RPG14.BAB` |
| Misi sampingan | **24 misi** (give / find / escort / kill / visit / multi) + tugasan harian + log misi + jejak 📍 | `QS14` |
| Progression | Level 0–60, jumlah EXP **99,999,250** (≈100 juta, sudah memenuhi syarat), HP/ATK/DEF ikut level, buka kunci ikut level | `RPG14` |
| Pertempuran | 11 senjata (tumbuk, kapak, parang ×2, pedang ×2, keris, busur ×2, senapang ×2), 11 jenis musuh (ular, babi, harimau, beruang, buaya, ular sawa, biawak, bos buaya, lanun, penembak, kapten) | `CB14` |
| Memancing | 32 spesies, 4 joran, minigame tarik, Buku Ikan | `FISH14` |
| Acara | 8 acara kampung (pertandingan memancing, tangkap ayam, memasak, harta karun, bola tampar pantai, istana pasir, lumba renang, lumba sampan) + papan acara + trofi | `EVT14` |
| Lanun | Kapal misteri, peninjau, pagar pertahanan, serangan 3 gelombang + Kapten Janggut Merah, kampung terbakar → bina semula, bunga api | `LANUN14` |
| Pertanian/ternakan | Kebun 6 petak, padi, siram/baja, lembu, reban ayam, kambing, kerbau, burung, kucing, haiwan jinak | `PEN14` |
| Ekonomi | 47 jenis barang, 18 resepi dapur, gerai jualan, kedai senjata, kios | `IT`, `RC` |
| Dunia | Siang/malam (1 hari = 30 min), cuaca, laut, berenang, sampan, air terjun, tanglung, haiwan liar | `GS.t`, `W8`, `W17` |
| UI | HUD V16, tetapan bertab, inventori grid, peta mini, peta penuh (zum/seret/pin/🚀 Pergi), skrin kalah, dua tangan | `UI16`, `MAP16`, `DEATH16`, `HANDS16` |
| Simpanan | Autosimpan 4 s, `pagehide`, normalisasi data, sandaran/pulih kod simpanan | `save()`, `BK15` |
| Grafik | 5 tahap (lihat §6) | `GFX14`, `FX12`, `FX14`, `ANIME15` |

## 5. Penemuan kritikal

1. **Dunia V17 TIDAK dibina daripada MASTER MAP yang dilampirkan.** Grid ketinggian/kawasan V17 (384×256) dijana daripada gambar lain ("Peta Dunia" berlegenda, kini disimpan sebagai `reference/peta-lama-v17.jpg`). Perbandingan kedudukan (piksel peta):

   | Lokasi | V17 (dalam game) | MASTER MAP | Ralat |
   |---|---|---|---|
   | Sawah Padi | (418, 436) barat | (742, 308) utara Kerajaan | **339 px** |
   | Air Terjun | (1362, 450) | (1108, 494) | **258 px** |
   | Tasik Biru | (1154, 448) | (1027, 587) | **188 px** |
   | Padang Pasir | (1032, 100) | (1015, 226) | 127 px |
   | Tasik Sunyi | (1020, 742) | (923, 773) | 102 px |
   | Kampung Timur | (1138, 302) | (1060, 374) | 106 px |
   | Gunung Selatan | tiada dalam senarai lokasi | (1142, 800) | **hilang** |
   | Hutan Utara, Camp, Puncak, Bukit, Kawasan Turun Bukit, Paya Bakau (di timur) | tiada / di tempat lain | kelompok timur | **hilang/tersasar** |

   Oleh itu Fasa 2 mesti **membina semula grid dunia daripada MASTER MAP** sebelum kandungan baharu ditambah.
2. **Kawasan rumah asal** (rumah Waguri, kebun, pasar, kolam, camp atas bukit) sepadan dengan kelompok timur MASTER MAP (Sawah, Pasar, Camp, Kolam, Puncak) apabila skala dunia ialah **0.8 m sepiksel** (ralat padanan 3–9 m), bukan 0.5 m seperti V17. Skala ini dipilih untuk Fasa 2.
3. **Pepijat sedia ada:** misi sampingan *Penjelajah Jambatan* (s13) memerlukan "Jambatan Jalan Baru", tetapi jambatan itu tidak lagi wujud sejak V17 (penanda misi tiada). Akan dibaiki dalam pembinaan semula jalan/jambatan.
4. Transformasi peta (dunia → piksel) dikod keras di 5 tempat berasingan (`K=2,OX=689,OY=285`): peta mini, peta penuh V16.1, peta malam V9, kandang V14, `W8.mapK`.
5. **Prestasi:** walaupun mod Ringan, adegan mempunyai ~1,390 panggilan lukis dan ~0.77 juta segi tiga; Ultra ~1.3 juta segi tiga. Ini berat untuk telefon kelas rendah (sasaran Fasa 7: < 400 panggilan lukis untuk mod Biasa).
6. Dua sistem kualiti berasingan wujud serentak: `waguri_q` (Rendah/Sederhana/Tinggi — saiz peta bayang, ketumpatan jaring & pokok) dan `waguri_gfx` (5 tahap). Pengguna boleh memilih gabungan yang tidak konsisten.
7. Tiada pengendalian ralat yang kelihatan: hampir semua lapisan membalut kod dengan `try{}catch(e){console.error()}` — jika satu sistem gagal, game tetap berjalan dalam keadaan separa rosak tanpa amaran.

## 6. Tahap grafik sedia ada (perbezaan sebenar)

| Kunci | Nama asal | Nama baharu (v19) | Watak | Pasca-proses | Pencahayaan |
|---|---|---|---|---|---|
| `lite` | Ringan | **Biasa** | prosedural | tiada | asas |
| `biasa` | Biasa | **Medium** | prosedural | paip FX penuh (HDR, bloom, AO, sinaran matahari) | cel-shading tiada |
| `sine` | Sinematik | **High** | GLB + toon | FX tahap Ultra, cahaya volumetrik | cel-shading + garis luar |
| `ultra` | Ultra | **Ultra** | GLB + toon | FX Extreme, PCSS, DOF pilihan | cel-shading + garis luar |
| `ext` | Extreme | **Extreme** | GLB + toon | FX Extreme + supersampling 1.25×, AO penuh, rumput lebih padat | penuh |

Perbezaan antara tahap adalah **ciri sebenar** (model watak, laluan pasca-proses, bayang), bukan sekadar kecerahan. Dalam v19, menu utama menyelaraskan `waguri_q` dengan tahap yang dipilih (Biasa→Rendah, Medium/High→Sederhana, Ultra/Extreme→Tinggi) supaya resolusi peta bayang dan ketumpatan dunia turut berubah.

## 7. Apa yang dikekalkan (keputusan)

Semua sistem dalam §4 dikekalkan tanpa perubahan fungsi. v19 dibina sebagai **lapisan tambahan + tampalan bertanda** di atas `base/Isekai_v18.html` melalui skrip build (`tools/build.mjs`), supaya:

- fail asal tidak pernah diubah, dan setiap perubahan boleh disemak satu per satu;
- kunci simpanan `waguri_isekai_v1` dan formatnya kekal → simpanan pemain lama boleh **CONTINUE** dalam v19.

Komponen yang **dibina semula** (dengan sebab teknikal):

| Komponen | Sebab | Fungsi asal dikekalkan? |
|---|---|---|
| Data grid dunia V17 (`W17`) | dijana daripada peta yang salah | Ya — API `W17.h/cls/fd/col/LOC/mapCanvas` sama |
| Jalan, jambatan, kedudukan mercu tanda V17 | kedudukan tidak sepadan MASTER MAP | Ya — semua jenis mercu tanda (Kerajaan+istana, kampung, pelabuhan, gua, air terjun, gunung berapi, pulau) dibina semula di koordinat baharu |
| Urutan boot | tiada loading/menu | Ya — semua skrip asal masih dijalankan mengikut urutan asal |

## 8. Cadangan enjin

| Pilihan | Kelebihan | Kekurangan | Keputusan |
|---|---|---|---|
| Kekal three.js (HTML + WebView) | semua 52 misi, 24 misi sampingan, combat, NPC, simpanan dikekalkan 100%; build pantas; satu fail | had prestasi WebView, tiada GI/streaming terbina | **Dipilih untuk Fasa 1–3 (vertical slice)** |
| Godot 4 (Mobile renderer) | APK natif, LOD/occlusion terbina, sumber terbuka | semua sistem perlu ditulis semula dalam GDScript | Calon Fasa 6–7 jika dunia 10× tidak muat dalam WebView |
| Unity URP / Unreal 5 | grafik tertinggi | tulis semula sepenuhnya, saiz APK besar, UE5 tidak sesuai telefon kelas rendah | Tidak disyorkan sekarang |

Alasan: syarat "JANGAN bina game kosong dari awal" dan "kekalkan semua sistem" hanya boleh dipenuhi dengan selamat jika enjin dikekalkan. Penghijrahan enjin hanya patut dibuat selepas vertical slice membuktikan reka bentuk dunia, dan memerlukan anggaran berbulan-bulan.

## 9. Spesifikasi peranti (anggaran awal, belum diuji pada telefon sebenar)

| Tahap | RAM | GPU minimum | Android WebView |
|---|---|---|---|
| Biasa | 3 GB | Mali-G52 / Adreno 610 | Chrome 90+ |
| Medium / High | 4–6 GB | Adreno 650 / Mali-G77 | Chrome 100+ |
| Ultra / Extreme | 8 GB+ | Adreno 730+ / Immortalis-G715 | Chrome 110+ |

Angka ini perlu disahkan dengan ujian peranti sebenar dalam Fasa 7.
