# Pelan Pembangunan Fasa 3–7

Status semasa (v19): **Fasa 1 siap** (audit), **Fasa 2 siap** (dunia 3D dibina semula ikut MASTER MAP + alat semakan), **Seksyen 11 siap** (preloading, menu, RETRY, WORLD READY). Semua yang di bawah **BELUM dilaksanakan** kecuali dinyatakan "sedia ada".

Prinsip yang dikekalkan untuk setiap fasa:
1. Base v18 tidak disentuh; semua perubahan ialah tahap/tampalan dalam `tools/build.mjs` yang disahkan (build gagal jika teks asal berubah).
2. Setiap fasa mesti lulus `tools/test-acceptance.mjs` dan `tools/verify-map.mjs` sebelum digabung.
3. Ketepatan peta dahulu: kandungan baharu diletak hanya pada koordinat `reference/landmarks.json` atau kawasan pengembangan yang ditandakan.

---

## Fasa 3 — Grafik, pencahayaan, persekitaran & kamera

| Kerja | Butiran teknikal | Tahap grafik |
|---|---|---|
| Air sungai mengalir | Reben air sepanjang garis tengah sungai (dari topeng air MASTER MAP) dengan UV mengikut arah aliran + normal map bergerak; buih di kaki air terjun | Medium+ |
| Langit dinamik | Matahari/bulan/bintang mengikut `GS.t` (sedia ada: kitaran siang–malam); tambah fasa bulan & bintang berkelip | semua |
| Kabus volumetrik | Kabus ketinggian (height fog) dalam shader; kabus paya & lembah | High+ |
| Pokok/rumput bergoyang | Sedia ada (shader angin V8/V13) — tambah daun gugur & partikel debu | Medium+ |
| Bahan PBR | Atlas tekstur batu/tanah/kayu (KTX2/Basis untuk mampatan GPU) menggantikan warna bucu | High+ |
| LOD & occlusion | Hutan sudah dibahagi 60 m bin dengan jarak paparan; tambah LOD 3 aras bagi rumah & pokok, impostor untuk gunung jauh, `frustumCulled` per-bin | semua |
| Kamera | Kamera ikut bahu + elak pelanggaran (sedia ada asas); mod sinematik untuk Kerajaan & air terjun | semua |

Sasaran prestasi (diukur pada peranti sebenar, BELUM diuji): Biasa ≥ 30 fps pada Adreno 610; Ultra ≥ 45 fps pada Adreno 730. Masalah diketahui daripada audit: ~1,390 panggilan lukis dalam mod Biasa → sasaran < 400 dengan menggabungkan rumah per kampung dan instancing pokok per jenis.

## Fasa 4 — NPC hidup (sasaran 300 NPC)

Sedia ada: 28 NPC bernama + 22 NPC pasar + 20 reka bentuk 3D. Reka bentuk sistem baharu:

```
NPC { id, nama, umur, pekerjaan, rumah:[x,z], kampung, keluarga:[id], kawan:[id], personaliti:{ramah,berani,tamak,rajin},
      jadual:[{dari:"06:00", ke:"08:00", tindakan:"masak", di:"rumah"}, {..."bertani"...}, ...],
      memori:[{peristiwa, hari, kesan}], reputasi_pemain:-100..100 }
```
- **FSM per NPC**: `Tidur → Bangun → Kerja (bertani/memancing/berniaga/memasak) → Rehat → Berbual → Pulang`, bertukar ikut `GS.t` dan peristiwa (lanun, kebakaran, ribut → `Lari`/`Bantu`).
- **Simulasi bertingkat**: NPC dalam 120 m disimulasi penuh (animasi + laluan); NPC jauh hanya kemas kini jadual (kedudukan "teori") — murah untuk 300 NPC.
- **Laluan**: graf jalan daripada `W19D.ROADS` + titik pintu rumah; A* pada graf (bukan navmesh penuh) supaya ringan di telefon.
- **Dialog**: templat ikut masa/cuaca/reputasi/memori; AI generatif hanya untuk dialog tambahan pilihan (luar talian = templat sahaja).
- Agihan 300 NPC: Kerajaan 80 · 3 kampung asal × 30 · Pelabuhan Barat 25 · Pulau Lanun 20 (lanun) · Pulau Kecil 10 · Kampung Timur/kelompok timur (sedia ada) · pengembangan baharu baki.

## Fasa 5 — Misi, pertempuran, acara & progression

Sedia ada: 52 misi utama (9 Bab), 24 misi sampingan, tugasan harian, 8 acara, serangan lanun 3 gelombang, Level 0–60 ≈ 100 juta EXP, 11 senjata, 11 musuh.

| Kandungan | Sasaran | Sedia ada | Pendekatan |
|---|---|---|---|
| Main Quest | 100 | 52 | Bab 10–18 ikut lokasi peta: Kerajaan (politik istana), Padang Pasir & Runtuhan Purba (kota purba), Kawasan Larangan (gunung berapi), Gunung Utara/Gua Salji |
| Side Quest | 300 | 24 | Format data JSON (`{id,npc,syarat,objektif[],ganjaran,kesan_dunia}`) + editor; setiap misi mesti ada kesan dunia (reputasi/ekonomi/NPC) — tiada "tukar nama NPC" |
| World Quest | 100 | 0 | Rantaian ikut kawasan (contoh: membina semula jambatan Paya Bakau) |
| Random Events | 150 | 8 acara + lanun | Penjadual peristiwa ikut hari/cuaca/reputasi: kebakaran → bina semula, babi hutan serang ladang, pencuri bertopeng, ribut di pelabuhan, NPC hilang |
| Hidden Quest | 50 | 0 | Dicetus oleh lokasi rahsia (Fasa 6) |
| Boss | 30 | 2 (Bos Buaya, Kapten Janggut Merah) | Bos berfasa (corak serangan berubah pada 66 % / 33 % HP) |

Pertempuran (belum ada): serangan ringan/berat, **dodge** (i-frame 0.3 s, kos stamina), **block/parry** (tetingkap parry 0.2 s → stagger musuh), spear, pokok kemahiran (3 cabang: Pedang · Busur · Ikhtiar), naik taraf senjata & crafting daripada bahan dunia. Progression Level 60 / 100 juta EXP **dikekalkan** (sudah memenuhi syarat).

## Fasa 6 — Pengembangan dunia 10× & kandungan

Pulau teras (MASTER MAP) = 1.01 km², **dilindungi** (tiada perubahan susun atur). Sasaran 10× = ~10 km² melalui kawasan baharu di luar sempadan peta, disambung oleh laluan laut (sampan/kapal), jambatan dan terowong:

| Kawasan baharu | Arah | Sambungan | Kandungan |
|---|---|---|---|
| Kepulauan Utara (bersalji) | utara Gunung Utara | terowong Gua Salji + feri | 2 kampung, 1 bandar, 4 gua, 1 dungeon |
| Tanah Besar Barat | barat Pelabuhan Barat | kapal dari Pelabuhan Barat | 1 bandar pelabuhan besar, 3 kampung, lembah & padang bunga |
| Gurun Timur Laut | timur Padang Pasir | jambatan Runtuhan Purba | kota purba (dungeon), 2 kampung oasis |
| Kepulauan Selatan | selatan Pulau Rahsia | portal 🌀 + bot | 8 pulau, lokasi rahsia, sarang lanun |
| Pergunungan Timur | timur Kawasan Larangan | laluan lava (dungeon) | 1 bandar perlombongan, tebing tinggi, air terjun bersambung |

Jumlah sasaran: 12 kampung, 5 bandar, 20 gua, 8 dungeon (setiap satu bos unik), 15 pulau boleh dilawati dengan bot, 30 lokasi rahsia.

**World streaming** (wajib sebelum pengembangan): dunia dibahagi sel 128 m; setiap sel = fail data (tinggi + kelas + objek) dimuat secara tak segerak mengikut jarak dan **arah perjalanan** pemain (sel di hadapan diutamakan), dengan 3 aras LOD (penuh < 200 m, ringkas < 600 m, impostor/peta jauh). Collision & rupa bumi dimuat sebelum objek; laluan masuk kawasan yang belum siap ditutup dengan peralihan (kabus/feri). Pemuat V19 sudah menyediakan rangka (tugasan berwajaran, semakan kritikal, RETRY) untuk digunakan semula bagi setiap sel.

## Fasa 7 — Pengoptimuman, ujian & Android

- APK: projek pembalut WebView sedia (`android/`, aliran kerja GitHub Actions `.github/workflows/isekai-waguri-apk.yml`) — **belum dibina/diuji** (SDK Android tidak boleh dimuat turun dalam persekitaran pembangunan ini).
- Ujian peranti sebenar: 3 telefon (rendah/sederhana/tinggi) × 5 tahap grafik, ukur fps, suhu, RAM, masa loading.
- Mampatan aset (KTX2), pemisahan aset besar keluar daripada HTML (aset APK), had memori WebView.
- **Keputusan enjin**: kekal three.js jika Fasa 3–6 mencapai sasaran fps; jika tidak (terutama world streaming 10× di telefon kelas rendah), pertimbangkan Godot 4 (Mobile renderer) dengan memindahkan data dunia (`world19-data`, `landmarks.json`) dan sistem misi (format JSON) yang sudah dipisahkan.
