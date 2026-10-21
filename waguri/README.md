# Kediaman Isekai Waguri — v17 "Lembah Timur"

Open-world RPG 3D (Three.js, WebView Android) yang dibina **di atas v16.1 tanpa membuang apa-apa**. v17 ialah *vertical slice* pertama perluasan dunia mengikut peta rujukan.

| Dokumen | Isi |
|---|---|
| [`docs/AUDIT_v16_1.md`](docs/AUDIT_v16_1.md) | Fasa 1: audit APK, kod dan sistem asal (angka masa jalan) |
| [`docs/PELAN_DUNIA.md`](docs/PELAN_DUNIA.md) | Koordinat setiap kawasan peta rujukan + senarai kampung/bandar/gua/pulau/rahsia |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Status fasa, jadual grafik 5 tahap, optimasi, sasaran peranti, cadangan enjin |

## Struktur
```
original/index_v16_1.html     game asal (diekstrak dari APK, TIDAK disunting)
original/apk_shell/           manifest, dex, resources, ikon asal
src/00_pre.js                 dimuat sebelum enjin: medan ketinggian Lembah Timur, sempadan dinamik, MAP17, nama 5 tahap grafik
src/10_terrain.js             ketulan terrain distrim + LOD + skirt, grid pelanggaran, pembantu
src/11_water.js               sungai, tasik, kolam, air terjun, berenang, jambatan
src/12_flora.js               pokok berinstans per ketulan, rumput dikitar semula, padang bunga, padi
src/13_village.js             Kampung Timur (bangunan, kincir, jeti, wau, tingkap bercahaya)
src/14_cave.js                Gua Tirai Air (dungeon) + Gua Kelawar
src/15_weather.js             cuaca & musim (seluruh dunia)
src/16_map.js                 lapisan peta + kabus peta
src/20_npc_data.js            27 penduduk (latar, personaliti, jadual, dialog)
src/21_npc_sim.js             FSM jadual, laluan A*, LOD AI, dialog berkonteks, memori & reputasi
src/30_combat.js              elak/tangkis/berat/kombo, kemahiran, naik taraf, musuh & bos
src/40_quest.js               enjin quest + Bab Timur, sampingan, peristiwa, rahsia, kedai
src/50_ui.js                  penjejak objektif, panel 🧭 Lembah Timur, sepanduk, "apa yang baharu"
tools/build.py                bina dist/index.html (+ APK) dengan tampalan bersemak
tools/apk_tool.py             tampal manifest binari, susun zip, tandatangan APK v2 (tanpa Android SDK)
tests/smoke.js                33 ujian fungsi + 5 ujian tahap grafik (Chromium tanpa kepala)
dist/                         hasil binaan: index.html & APK
```

## Bina & uji
```bash
python3 tools/build.py                          # → dist/index.html
python3 tools/build.py --apk /laluan/kunci.pem  # → + dist/Kediaman_Isekai_Waguri_v17_0.apk
cd tests && npm i && cd .. && node tests/smoke.js        # penuh (≈ 30 min dalam SwiftShader)
node tests/smoke.js --quick                              # tanpa ujian tahap grafik
```
`dist/index.html` juga boleh dibuka terus dalam Chrome desktop (PC) untuk bermain/menguji.

## Memasang APK
* Pakej v17 ialah **`com.waguri.isekai17`** (v16.1 ialah `com.waguri.kediaman`). APK ditandatangan dengan kunci baharu kerana kunci asal tiada. Android tidak membenarkan kemas kini merentas kunci yang berlainan, jadi v17 dipasang **bersebelahan** v16.1 tanpa memadam progres lama.
* **Pindah progres:** dalam v16.1 → ⚙ Tetapan → 📤 Salin kod simpanan → dalam v17 → ⚙ Tetapan → 📥 Masuk.
* Kunci tandatangan **tidak** disimpan dalam repo. Simpan fail `.pem` anda sendiri; kunci yang sama diperlukan untuk kemas kini v17.x seterusnya.

## Mula bermain kandungan baharu
Level 12 ke atas → bercakap dengan **Tok Ketua**, atau terus ke 🪧 **Celah Gunung** di hujung barat Laluan Hutan Jauh (destinasi peta "Celah Gunung"). Tekan **🧭 Lembah Timur** untuk misi, penduduk, kemahiran dan maklumat dunia.

Kawalan PC: WASD gerak · Space lompat · E/Enter interaksi · F/J serang (tahan = berat) · Shift elak · C tahan = tangkis · Q tukar senjata.
