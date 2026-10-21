# Roadmap Pembangunan — Kediaman Isekai Waguri

Petunjuk status: ✅ siap & diuji automatik · 🟡 sebahagian · ⬜ belum · ⚠️ belum diuji pada peranti sebenar

## Fasa & status (selepas v17.0)

| Fasa | Skop | Status | Hasil boleh diuji |
|---|---|---|---|
| 1. Audit | APK, kod, semua sistem asal | ✅ | [`AUDIT_v16_1.md`](AUDIT_v16_1.md) |
| 2. Peta 3D ikut gambar | Bina wilayah dengan kedudukan relatif tepat | 🟡 Lembah Timur siap (≈ 340 × 374 m, lebih besar daripada dunia lama). Wilayah lain dirancang dengan koordinat | [`PELAN_DUNIA.md`](PELAN_DUNIA.md) |
| 3. Grafik, cahaya, kamera | 5 tahap dengan perbezaan sebenar | 🟡 Lihat §Grafik | tangkapan skrin `tests/out/gfx_*.png` |
| 4. NPC & AI | 300 NPC berjadual | 🟡 27 NPC Kampung Timur dengan FSM penuh + 28 NPC asal | ujian jadual & laluan |
| 5. Quest, combat, event, progression | | ✅ untuk vertical slice | ujian aliran Bab Timur + bos |
| 6. World expansion | 12 kampung, 5 bandar, 20 gua, 8 dungeon, 15 pulau, 30 rahsia | ⬜ (1 kampung, 2 gua, 1 dungeon, 6 rahsia siap) | — |
| 7. Optimasi, ujian, APK | | 🟡 APK bertandatangan + 33 ujian automatik; ⚠️ prestasi telefon belum diukur | `dist/*.apk`, `tests/smoke.js` |

## Vertical slice v17 — apa yang benar-benar ada

**Dunia:** Celah Gunung (gaung menembusi dinding barat) → Lembah Timur: dataran tinggi, tebing dan **air terjun 11 m**, sungai yang mengalir dari bukit utara melalui tebing ke Tasik Biru, kolam, pulau kecil, Padang Bunga, ladang padi bertingkat, hutan tebal, Bukit Pasir utara (pintu ke Padang Pasir), banjaran barat bersalji, Kuil Lama, Gua Kelawar, **Gua Tirai Air** (4 bilik bawah tanah).

**Kampung Timur:** 16 rumah panggung (penempatan berprosedur berbenih), Balai Raya, Kedai Runcit, Rumah Tenun, Tukang Besi (relau bercahaya), Pokok Beringin Tua, telaga, kincir air berputar, menara tinjau, wakaf tebing, jeti + sampan, tanglung, pagar buluh, jemuran, wau di langit, tingkap bercahaya pada waktu malam.

**Penduduk (27):** nama, latar, personaliti (10 jenis), kerja, rumah, keluarga/kawan, jadual 24 jam, dialog mengikut waktu, cuaca, aktiviti, reputasi, kemesraan dan **memori keputusan pemain**; tidur dalam rumah, bekerja (17 jenis aktiviti), berbual berpasangan, kanak-kanak bermain, berteduh ketika hujan, lari ketika serbuan, menonton wayang kulit pada malam ke-4, pesta selepas bos; hadiah kegemaran; panel "Kenali".

**Cerita & aktiviti:** Bab Timur (7 misi + pratonton), 8 misi sampingan (pilihan yang mengubah jadual NPC, kemesraan dan ekonomi), 4 peristiwa dunia (serbuan babi, kanak-kanak hilang, pencuri bertopeng dengan pilihan moral, pokok tumbang ketika ribut), 1 misi tersembunyi (3 batu bersurat → azimat kekal), 6 rahsia, kabus peta, memancing di tasik baharu (guna minigame sedia ada).

**Pertarungan:** elak (2 cas, i-frame), tangkis, tangkisan sempurna + serangan balas, serangan berat, kombo, 12 kemahiran, naik taraf senjata +1…+5, tombak (senjata ke-12), 6 musuh baharu dengan telegraf, 2 bos (Raja Taring Besi, Kelembai Batu 3 fasa: hentak → batu + minion → gegaran gelang).

**Sistem global baharu:** cuaca (5 jenis) dan 4 musim untuk seluruh dunia.

## Grafik — perbezaan sebenar setiap tahap (kandungan V17)

| | Biasa | Medium | High | Ultra | Extreme |
|---|---|---|---|---|---|
| Grid terrain halus | 3.2 m | 2.4 m | 2.0 m | 1.6 m | 1.25 m |
| Jarak LOD halus / jarak pandang | 110 / 210 m | 140 / 250 m | 160 / 290 m | 190 / 330 m | 230 / 380 m |
| Ketumpatan pokok · jarak | 42 % · 150 m | 68 % · 190 m | 85 % · 230 m | 100 % · 280 m | 115 % · 330 m |
| Bayang pokok | ✗ | ✗ | ✓ | ✓ | ✓ |
| Rumput V17 (bilah) | 0 | 1,400 | 2,800 | 5,200 | 8,800 |
| Bunga padang | 260 | 700 | 1,300 | 2,100 | 3,200 |
| Air | rata | alunan + buih aliran | + fresnel/pantulan langit, pantulan logam | sama | + gelombang verteks |
| Air terjun | 1 lapisan | 1 lapisan + 24 wap | 2 lapisan + 46 wap | 2 lapisan + 80 wap | 2 lapisan + 120 wap |
| Titis hujan | 260 | 520 | 800 | 1,200 | 1,800 |
| Daun ikosahedron | rendah | rendah | rendah | butiran tinggi | butiran tinggi |

Saluran grafik asal kekal mengikut tahap: cel-shading anime, model GLB Waguri dan penduduk (High+), bloom, AO, sinar matahari, kabus atmosfera, FXAA/SSAA.

**Belum tercapai (jujur):** iluminasi global sebenar, set tekstur PBR beresolusi tinggi, kabus isipadu berasaskan *ray-marching*, occlusion culling selain pemotongan frustum + jarak. Sasaran "setanding Wuthering Waves / UE5" **tidak realistik** dalam WebView + Three.js r128 pada telefon; pendekatan semasa ialah gaya anime bergaya dengan kesan murah.

## Optimasi yang dilaksanakan
Penstriman ketulan terrain (1 ketulan/bingkai, buang LOD halus apabila jauh) · 2 LOD + skirt · pokok berinstans per ketulan dengan sfera sempadan ketulan · **object pooling** untuk rumput (tetingkap toroidal, hanya sel baharu dikemas kini), hujan, telegraf, gelembung bual · bangunan statik digabung (W8.merge) · satu mesh glow untuk semua tingkap · grid ruang pelanggaran (OB lama tidak membesar) · LOD AI (NPC jauh melompat nod, tanpa animasi; disembunyikan > 160 m) · musuh hanya dilahirkan dalam 95 m · gua tidak merender dunia luar.

## Prestasi & spesifikasi peranti (⚠️ sasaran, BELUM diukur)
Bekas pembangunan hanya ada GPU perisian (SwiftShader ~1–3 FPS), jadi **tiada angka FPS sebenar boleh dilaporkan**. Sasaran awal untuk diuji:

| Tahap | Sasaran peranti | Sasaran FPS |
|---|---|---|
| Biasa | Android 7+, RAM 3 GB, GPU kelas Adreno 506 / Mali-G52 | 30 |
| Medium | RAM 4 GB, Snapdragon 680 / Helio G88 | 30 |
| High | RAM 6 GB, Snapdragon 778G / Dimensity 1080 | 30 |
| Ultra | RAM 8 GB, Snapdragon 8 Gen 1+ | 30–45 |
| Extreme | telefon perdana / PC GPU diskret | 60 (PC) |

Langkah seterusnya: profil di 3 telefon sebenar (`chrome://inspect` → Performance), kemudian laraskan jadual `W17.TQ`.

## Cadangan enjin
* **Sekarang:** teruskan Three.js / WebView. Semua sistem, model dan simpanan pemain dikekalkan, dan kitaran ujian mengambil minit, bukan jam.
* **Apabila dunia melepasi ~4 wilayah atau 150+ NPC aktif:** nilai semula. Pilihan: (a) naik taraf Three.js ke versi semasa (WebGL2, KTX2/Basis untuk mampatan tekstur, BatchedMesh) dengan mengalihkan tampalan shader V13–V15; atau (b) port ke **Godot 4** (eksport Android natif, LOD/occlusion terbina, sumber terbuka). Untuk port, data (quest, NPC, dialog, peta) sudah dalam bentuk boleh dialih (objek JS biasa).
* Unity/Unreal memberikan grafik terbaik tetapi memerlukan penulisan semula penuh dan rantaian binaan berlesen.

## Vertical slice seterusnya (cadangan)
**Kota Diraja Kerajaan + Sawah Padi lingkar** (−654, −55): buka jalan "tertimbus" dari Kampung Timur, 60 penduduk, ekonomi bandar (gilda, pasar besar, harga turun naik), kejohanan memanah dan pedang, Bab Kerajaan (10 misi), 1 dungeon (Gua Kristal Istana).
