# Fasa 1 — Audit Kediaman Isekai Waguri v16.1

Tarikh audit: 21 Okt 2026 · Sumber: `Kediaman_Isekai_Waguri_v16_1.apk` (3.78 MB)

Audit ini dibuat dengan membongkar APK, membaca kod, dan **menjalankan game sebenar** dalam Chromium tanpa kepala (WebGL SwiftShader). Angka "masa jalan" di bawah dibaca terus daripada game yang sedang berjalan, bukan diteka daripada kod.

## 1. Jenis projek

| Perkara | Dapatan |
|---|---|
| Jenis APK | **Pembungkus WebView.** Hanya 5 fail: `AndroidManifest.xml`, `classes.dex` (2.8 KB), `resources.arsc`, ikon, `assets/index.html` |
| Aktiviti | `com.waguri.kediaman.MainActivity` memuatkan `file:///android_asset/index.html` (JS + DOM storage + fail dibenarkan; `save()` dipanggil ketika `onPause`; "tekan Kembali dua kali untuk keluar") |
| Pakej / versi | `com.waguri.kediaman` · versionCode 17 · versionName 16.1 · minSdk 24 · targetSdk 34 |
| Tandatangan | APK Signature Scheme **v2 sahaja**, RSA + SHA-256 (tiada `META-INF`) |
| Enjin | **Three.js r128** (603 KB, dibenam) + OrbitControls; satu fail HTML 5.68 MB |
| Aset dibenam | Model GLB Waguri (format WGM: kuantum + gzip, rig 94 tulang, 23 animasi) · 20 rekaan penduduk 3D (WNP1 + tekstur JPEG) · 2 fon WOFF2 · ikon |
| Struktur kod | ~750 KB JS dalam 40 blok `<script>` berlapis V2 → V16.1; setiap lapisan menampal fungsi global (`gtick`, `env`, `gY2`, `hud`, `npST.f` …) |

**Kesimpulan:** sumber game boleh dipulihkan **sepenuhnya** daripada APK (semua JS, model dan tekstur ada dalam `index.html`). Tiada sumber yang hilang. Projek v17 dibina di atas fail ini tanpa menyunting kod asal secara manual (lihat §5).

## 2. Kandungan sedia ada (dibaca semasa game berjalan)

| Sistem | Masa jalan v16.1 |
|---|---|
| Misi utama | **52** misi dalam **9 Bab** (Kehidupan Baru → Bangkit Semula) |
| Misi sampingan | **24** (beri, bunuh, cari, lawat, pelbagai, iring) + tugasan harian |
| NPC bernama | **28** dalam dunia (+ watak acara) · 20 reka bentuk model 3D (mod Sinematik+) |
| Haiwan | **164** (8 jenis liar: harimau, babi, ular, beruang, buaya, ular sawa, biawak, Buaya Tembaga) + ternakan |
| Musuh | 11 spesies (termasuk lanun, penembak, Kapten Janggut Merah) |
| Senjata | 11 (tumbuk, kapak, parang ×2, pedang ×2, keris, busur ×2, senapang ×2) |
| Ikan | 32 spesies, minigame sentap/tarik, Buku Ikan, joran naik taraf |
| Acara kampung | 8 (memancing, tangkap ayam, memasak, harta karun, bola tampar, istana pasir, renang, sampan) |
| Item / resipi | 47 item · 18 resipi masakan |
| Titik interaksi | 507 · halangan pelanggaran 1,626 · 5,363 objek adegan |
| Progression | Level 0–60, jumlah EXP ke Lv60 = **99,999,250** (sasaran ~100 juta sudah dipenuhi) |
| Simpanan | `localStorage` kunci `waguri_isekai_v1` (objek `GS`, 51 medan) + sandaran kod salin/tampal (V15) |
| Grafik | 5 tahap: Ringan / Biasa / Sinematik / Ultra / Extreme (cel-shading anime, bloom, AO, sinar matahari, kabus, FXAA/SSAA) |
| Peta | Peta mini + peta penuh V16.1 (zum, seret, teleport, kompas), 41 destinasi |
| Dunia | Kira-kira 310 × 341 unit (x −212…98, z −98…243), dikelilingi dinding gunung; laut di timur |

## 3. Pemetaan dengan peta rujukan

Kawasan sedia ada dalam game sepadan dengan **gugusan timur** peta rujukan: Sawah, Pasar, Camp, Kolam, Puncak, Bukit, Kawasan Turun Bukit, Pantai Timur, Paya Bakau, Hutan Utara dan Pulau Lanun. Skala anggaran: **~0.97 piksel peta = 1 m dunia**, jadi seluruh pulau dalam gambar ≈ 1,380 × 950 m — kira-kira **12× dunia lama** (sepadan dengan sasaran "10× lebih luas").

Percanggahan yang perlu disahkan oleh pemilik projek:
* Gambar meletakkan **Kandang Lembu** dan **Kebun Buah** di barat jauh, sedangkan dalam game kedua-duanya kecil, betul-betul di sebelah rumah Waguri. Andaian v17: gambar menunjukkan versi **besar baharu** (ladang diraja dekat Kerajaan); yang lama kekal di tempatnya.
* **Air Terjun** dalam gambar ialah air terjun besar di barat laut Tasik Biru, berlainan daripada "Kolam Air Terjun" kecil di sebelah Camp. Andaian v17: kedua-duanya wujud. Yang besar dibina sebagai *Air Terjun Tirai Perak*.
* Peta rujukan ialah lakaran. Kedudukan **relatif** dikekalkan (contohnya Kampung Timur di barat laut gugusan lama, Air Terjun di selatannya, Tasik Biru di barat daya, Padang Pasir di utara). Koordinat tepat boleh berbeza beberapa puluh meter kerana dinding gunung dunia lama.

Jadual koordinat semua kawasan ada dalam [`PELAN_DUNIA.md`](PELAN_DUNIA.md).

## 4. Penilaian teknikal

| Aspek | Penilaian |
|---|---|
| Boleh dikekalkan | Semua sistem. Kod berlapis tetapi stabil (tiada ralat JS semasa muat dalam ujian). |
| Risiko utama | (1) Semua kod berkongsi skop global → tambahan mesti membalut, bukan menulis semula. (2) Terrain lama ialah **satu jaring** tanpa LOD. (3) Pemalar peta (232/118/720/810) dikod keras di 7 tempat. (4) Rumput GPU lama hanya meliputi dunia lama. (5) Three.js r128 sudah lama; menaik taraf akan memecahkan tampalan shader V13–V15. |
| Prestasi | Tidak dapat diukur dalam bekas ini: SwiftShader (CPU) memberi ~1–3 FPS dan **tidak mewakili telefon**. Pengukuran mesti dibuat pada peranti sebenar (lihat ROADMAP §Prestasi). |

## 5. Keputusan pendekatan

1. **Kekalkan Three.js / WebView untuk Fasa 1–6.** Semua kandungan, model GLB, sistem dan simpanan pemain boleh terus digunakan. Menulis semula dalam Unity atau Godot bermakna mengalihkan ~750 KB logik permainan dengan tangan dan kehilangan keserasian simpanan.
2. **Tiada suntingan manual pada kod asal.** `tools/build.py` menggunakan **22 tampalan kecil bersemak**: setiap rentetan sauh mesti wujud tepat N kali, jika tidak binaan gagal. Modul baharu (`src/*.js`) disuntik sebagai lapisan V17.
3. Untuk penilaian semula enjin (Godot 4 / Unity) pada masa hadapan, lihat [`ROADMAP.md`](ROADMAP.md).
