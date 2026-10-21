# Kediaman Isekai Waguri — v19 (Open World RPG, three.js)

Game satu fail HTML (sesuai untuk Android WebView) yang dibina **di atas v18 tanpa membuang apa-apa ciri asal**. v19 membina semula dunia 3D supaya sepadan dengan **MASTER WORLD MAP** dan menambah sistem preloading profesional.

▶ **Main:** buka [`dist/Kediaman_Isekai_Waguri_v19.html`](dist/Kediaman_Isekai_Waguri_v19.html) dalam Chrome / Edge (desktop atau Android). Tiada internet diperlukan.

| Dokumen | Isi |
|---|---|
| [docs/01-AUDIT.md](docs/01-AUDIT.md) | Fasa 1 — audit v18: teknologi, 37 lapisan skrip, inventori sistem, penemuan kritikal, cadangan enjin |
| [docs/02-PETA-RUJUKAN.md](docs/02-PETA-RUJUKAN.md) | Fasa 2 — peta rujukan berkoordinat: skala, 38 lokasi, jalan, jambatan, gunung |
| [docs/03-SEMAKAN-PETA.md](docs/03-SEMAKAN-PETA.md) | Fasa 2 — semakan peta: top-down 3D vs MASTER MAP, tindihan 50 %, IoU garis pantai, senarai semak lokasi, kebolehcapaian |
| [docs/04-LAPORAN-UJIAN.md](docs/04-LAPORAN-UJIAN.md) | Ujian penerimaan Seksyen 11 & 13: lulus / gagal / belum dilaksanakan |
| [docs/05-PELAN-FASA.md](docs/05-PELAN-FASA.md) | Pelan Fasa 3–7 (grafik, 300 NPC, misi, pertempuran, pengembangan 10×, world streaming, APK) |

## Apa yang baharu dalam v19

- **Dunia ikut MASTER MAP** (`reference/master-map.png`): grid ketinggian/kawasan/hutan 768×512 dijana daripada gambar; Kerajaan bulat dengan dua terusan dan 16 lintasan jambatan, 3 kampung, Padang Pasir, Runtuhan Purba, gunung berapi Kawasan Larangan, Gunung Utara/Selatan, Air Terjun dengan sumber di dataran tinggi, Tasik Biru, Tasik Sunyi, Paya Bakau, Pelabuhan Barat, Pulau Kecil/Rahsia/Lanun. Kawasan rumah asal dikekalkan di kelompok timur (Sawah · Pasar · Camp · Kolam).
- **Preloading sebenar**: logo → progress 0–100 % berdasarkan tugasan/bait sebenar → MENU UTAMA (TERUSKAN / MULA BAHARU / GRAFIK) → muat dunia → 17 semakan kritikal → **WORLD READY** → MAIN. Ralat → mesej + **RETRY**; pemain tidak dibawa masuk ke dunia yang rosak.
- **5 tahap grafik**: Biasa · Medium · High · Ultra · Extreme (dipilih di menu sebelum dunia dibina).
- Simpanan v18 (`waguri_isekai_v1`) **boleh diteruskan** terus; MULA BAHARU menyandarkan simpanan lama ke `waguri_isekai_v1_bak19`.
- Pepijat v18 dibaiki: jambatan misi "Penjelajah Jambatan" (Jambatan Jalan Baru) wujud semula.

## Struktur

```
base/Isekai_v18.html        fail asal (TIDAK diubah)
reference/master-map.png    MASTER WORLD MAP · landmarks.json (peta rujukan berkoordinat, dijana)
tools/world_ref.py          data tulisan tangan: label, sauh lokasi, jalan, jambatan, gunung (piksel peta)
tools/gen_world.py          MASTER MAP -> src/v19/world19-data.js (grid gzip) + dokumen 02
tools/build.mjs             base v18 + src/v19 -> dist/Kediaman_Isekai_Waguri_v19.html
src/v19/boot.*              skrin boot & pemuat (Seksyen 11)
src/v19/replace/*.js        modul dunia V17 yang ditulis semula untuk MASTER MAP
src/v19/v19-core.js         berita v19 + alat semakan peta (MAPV19.topdown/probe/reach)
tools/verify-map.mjs + verify_map.py   semakan peta (Seksyen 12F)
tools/test-acceptance.mjs   ujian penerimaan (7 senario)
android/                    pembalut WebView (Gradle) — dibina oleh .github/workflows/isekai-waguri-apk.yml
```

## Bina & uji

```bash
cd isekai-waguri
pip install numpy pillow scipy scikit-image   # sekali sahaja
npm install                                    # playwright (untuk ujian)
python3 -I tools/gen_world.py                  # hanya jika MASTER MAP / world_ref.py berubah
node tools/build.mjs                           # -> dist/Kediaman_Isekai_Waguri_v19.html
node tools/test-acceptance.mjs                 # ujian penerimaan
node tools/verify-map.mjs && python3 -I tools/verify_map.py   # semakan peta -> docs/03
```

APK: aliran kerja **Isekai Waguri APK** (tab Actions GitHub) membina APK debug secara automatik setiap kali folder ini berubah — muat turun artifak `KediamanIsekaiWaguri-v19-debug-apk`. Boleh juga `gradle assembleDebug` dalam `android/` dengan Android SDK. APK **belum diuji pada telefon sebenar** — lihat laporan ujian.
