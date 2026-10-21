# Pelan Dunia — Pulau Isekai (berdasarkan peta rujukan)

Penukaran koordinat: **x = (px − 1380) / 0.97**, **z = py − 520**, dengan (px, py) ialah piksel pada `reference/peta_dunia_rujukan.png` (1536×1024). Utara = −z. Rumah Waguri = (0, 9). Skala diambil daripada padanan Pasar, Sawah, Turun Bukit, Paya Bakau dan Hutan Utara dalam game.

Status: ✅ siap & diuji dalam v17 · 🟡 sebahagian · ⬜ dirancang

## 1. Kawasan dalam peta rujukan

| Kawasan | Piksel | Dunia (x, z) | Status / catatan |
|---|---|---|---|
| Gugusan lama (Rumah, Sawah, Pasar, Camp, Kolam, Puncak, Bukit, Turun Bukit, Pantai Timur, Paya Bakau, Hutan Utara) | (1240–1480, 450–720) | (−212…98, −98…243) | ✅ v16.1, tidak diubah (disahkan: ketinggian sama tepat pada 1,892 titik) |
| **Kampung Timur** | (1060, 375) | (−330, −145) → dibina di **(−340, −150)** | ✅ v17 |
| **Air Terjun** (besar) | (1108, 494) | (−280, −26) → tebing di **(−300, −67)** | ✅ v17 "Air Terjun Tirai Perak", 11 m |
| **Tasik Biru** | (1031, 587) | (−360, 67) → **(−412, 12)** | ✅ v17 (dialih ke utara dinding selatan lama) |
| Padang Pasir | (985, 226) | (−407, −294) | 🟡 v17: Bukit Pasir (pintu) di z < −262; padang pasir penuh ⬜ |
| Runtuhan Purba | (1240, 236) | (−144, −284) | ⬜ utara dinding lama |
| Kawasan Larangan (gunung berapi) | (1405, 243) | (26, −277) | ⬜ |
| Hutan Timur | (1277, 365) | (−106, −155) | ⬜ (sambungan Hutan Jauh Utara) |
| Kerajaan (Kota Diraja) | (746, 465) | (−654, −55) | ⬜ — jalan dari Kampung Timur "tertimbus" (cangkuk cerita M8) |
| Sawah Padi (lingkar Kerajaan) | (742, 308) | (−658, −212) | ⬜ |
| Kampung Utara | (747, 174) | (−653, −346) | ⬜ |
| Gunung Utara + Gua Salji | (424–503, 177–253) | (−986…−904, −343…−267) | ⬜ |
| Laluan Hutan Jauh (barat laut) | (603, 68) | (−801, −452) | ⬜ |
| Hutan Barat | (384, 357) | (−1027, −163) | ⬜ |
| Kebun Buah (besar) | (380, 486) | (−1031, −34) | ⬜ (Kebun kecil lama kekal di rumah) |
| Kandang Lembu (ladang diraja) | (380, 600) | (−1031, 80) | ⬜ (Kandang Lembu lama kekal) |
| Pantai Barat + Pelabuhan Barat | (151–240, 609–715) | (−1267…−1175, 89…195) | ⬜ |
| Kampung Selatan | (750, 689) | (−649, 169) | ⬜ |
| Hutan Selatan + Gua Selatan | (607–715, 763–875) | (−797…−686, 243…355) | ⬜ |
| Tasik Sunyi | (923, 773) | (−471, 253) | ⬜ |
| Gunung Selatan | (1128, 800) | (−260, 280) | ⬜ |
| Pulau Kecil | (176, 886) | (−1241, 366) | ⬜ bot |
| Pulau Lanun | (1415, 890) | (36, 370) | ⬜ bot (Kem Lanun lama di pantai kekal) |
| Pulau Rahsia | (1142, 955) | (−245, 435) | ⬜ bot |

## 2. Kandungan perluasan (sasaran → status v17)

### 12 kampung baharu (budaya berbeza)
| # | Kampung | Lokasi | Identiti | Status |
|---|---|---|---|---|
| 1 | Kampung Timur | (−340, −150) | rumah panggung atas air terjun, tenun songket, kincir air, wayang kulit | ✅ |
| 2 | Kampung Utara | (−653, −346) | tanah tinggi, ladang teh, penternak kuda | ⬜ |
| 3 | Kampung Selatan | (−649, 169) | tembikar labu sayong, sawah bendang | ⬜ |
| 4 | Kampung Oasis | (−430, −390) | kafilah pedagang padang pasir, khemah kain | ⬜ |
| 5 | Kampung Kabus | (−900, −250) | penggembala gunung, rumah batu berbumbung ijuk | ⬜ |
| 6 | Kampung Air Bakau | (−240, 205) | rumah atas air, nipah, nelayan ketam | ⬜ |
| 7 | Kampung Durian | (−1000, −60) | dusun buah, pesta musim buah | ⬜ |
| 8 | Kampung Gembala | (−1031, 80) | ladang lembu diraja, gelanggang | ⬜ |
| 9 | Kampung Tasik Sunyi | (−471, 253) | perawat herba, bunga teratai, sunyi | ⬜ |
| 10 | Kampung Pelombong | (−260, 330) | lombong emas & bijih, terowong | ⬜ |
| 11 | Kampung Runtuhan | (−144, −300) | ahli sejarah & penggali artifak | ⬜ |
| 12 | Kampung Pulau Kecil | (−1241, 366) | penyelam mutiara, perahu layar | ⬜ |

### 5 bandar besar (ekonomi sendiri)
| Bandar | Lokasi | Ekonomi | Status |
|---|---|---|---|
| Kota Diraja Kerajaan | (−654, −55) | istana, pasar besar, gilda, kejohanan pedang & memanah | ⬜ |
| Bandar Pelabuhan Barat | (−1175, 195) | perdagangan laut, kapal, pasar ikan, galangan | ⬜ |
| Bandar Oasis | (−420, −360) | kafilah, rempah, permata | ⬜ |
| Bandar Lombong Selatan | (−300, 300) | tempaan, lombong, logam | ⬜ |
| Bandar Gelap Pulau Lanun | (36, 370) | pasar gelap, penjara, arena | ⬜ |

### 20 gua · 8 dungeon (bos unik)
✅ **Gua Tirai Air** (dungeon 1, bos **Kelembai Batu** 3 fasa) · ✅ **Gua Kelawar** (gua kecil rahsia).
⬜ Gua Salji · Gua Selatan · Gua Kristal Istana · Gua Pasir Berbisik · Gua Lava · Gua Paya · Gua Laut · Gua Lanun · Gua Akar · Gua Madu · Gua Emas · Gua Gema · Gua Ais · Katakomb Runtuhan · Gua Pelangi · Terowong Bawah Tasik Sunyi · Gua Harimau · Gua Puncak Larangan.
Dungeon ⬜: Gua Salji (Beruang Putih Purba) · Kota Pasir Tertimbus (Raja Kala Jengking) · Katakomb Runtuhan (Penjaga Gangsa) · Kapal Hantu Lanun (Kapten Bayang) · Gua Lava (Garuda Api) · Paya Dalam (Buaya Putih Siluman) · Gua Laut Pulau Rahsia (Ratu Ombak).

### 15 pulau (dengan bot)
⬜ Pulau Kecil · Pulau Lanun · Pulau Rahsia · Pulau Penyu · Pulau Karang · Pulau Burung · Pulau Kelapa · Pulau Batu Belah · Pulau Mutiara · Pulau Rusa · Pulau Api · Pulau Kabus · Pulau Bulan · Pulau Pasir Timbul · Pulau Teratai.
(v17: pulau kecil di tengah Tasik Biru boleh dicapai dengan berenang, dan menyimpan batu bersurat.)

### 30 lokasi rahsia
✅ 6 dalam Lembah Timur: Puncak Tebing Helang · Pulau Kecil Tasik Biru · Sarang Gua Kelawar · Lubang Akar Beringin · Puncak Salji Banjaran Barat · Mezbah Kuil Lama.
⬜ 24 lagi (2 setiap kampung/bandar baharu + Kawasan Larangan & pulau).

### Penduduk (sasaran ≥ 300)
✅ Kampung Timur 27 (+28 NPC asal kekal) · ⬜ Kota Diraja 60 · 4 bandar lain × 30 · 11 kampung × 14 = **≈ 360**.

### Quest (sasaran berperingkat)
| Jenis | Sasaran | Asal v16.1 | v17 baharu | Baki |
|---|---|---|---|---|
| Main Quest | 100 | 52 | 7 (+1 pratonton) | 40 |
| Side Quest | 300 | 24 + harian | 8 | 268 |
| World Quest / Peristiwa | 100 | 8 acara + serangan lanun | 4 peristiwa | ~87 |
| Random Events | 150 | — | (peristiwa dunia dipilih secara rawak) | ~146 |
| Hidden Quest | 50 | — | 1 | 49 |
| Boss Encounters | 30 | 3 (Buaya Tembaga, Kapten Janggut Merah, serangan lanun) | 2 (Raja Taring Besi, Kelembai Batu) | 25 |

## 3. Peraturan pembinaan kawasan baharu (dipelajari dalam v17)
1. Setiap wilayah = medan ketinggian sendiri, diadun ke dunia lama melalui cangkuk `H17` (kawasan lama tidak berubah).
2. Terrain dalam **ketulan 68 m**, 2 LOD + skirt, distrim satu ketulan setiap bingkai.
3. Jaring lama dalam wilayah baharu dibuang mengikut segi tiga (tiada z-fighting).
4. Pokok/batu berinstans per ketulan; pelanggaran disimpan dalam grid ruang (bukan tatasusunan `OB` lama).
5. Sempadan dunia dinamik (`XN/XM/ZN/ZX` sebagai getter) membenarkan bentuk dunia bukan segi empat.
6. Peta: pemalar `MAP17` (offset & saiz) — besarkan apabila wilayah baharu ditambah.
