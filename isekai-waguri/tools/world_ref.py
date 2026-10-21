# -*- coding: utf-8 -*-
"""
MASTER WORLD MAP — data rujukan yang ditulis tangan (Fasa 2).

Semua koordinat dalam PIKSEL gambar `reference/master-map.png` (1536 x 1024).
Penukaran ke koordinat dunia game (meter):

    x_dunia = S * px + TX        z_dunia = S * py + TZ

S/TX/TZ dipilih supaya kawasan rumah asal (rangka koordinat v1–v16: rumah di 0,0)
jatuh tepat di kelompok timur peta (Sawah, Pasar, Camp, Kolam):
  Sawah Kampung (-66,-16) -> Sawah (1290,520) · Pasar (36,0) -> Pasar (1415,522)
  Camp Atas Bukit (-54,47) -> Camp (1300,578) · Kolam (12,52) -> Kolam (1385,595)
  (ralat padanan kuasa dua terkecil 3–9 m)

Procedural generation hanya mengisi perincian; ia TIDAK boleh mengubah apa-apa di bawah.
"""

S, TX, TZ = 0.8, -1096.0, -422.0          # 1 piksel peta = 0.8 m
GRID_PX = 2                                # 1 sel grid = 2 piksel = 1.6 m  -> 768 x 512 sel

# Kawasan rumah asal (rangka v1–v16) yang dilindungi, dalam meter dunia (sama seperti V8 `OR`)
LEGACY_OR = dict(x0=-97, x1=64, z0=-43, z1=123)

# ---------------------------------------------------------------- label nama (kedudukan teks pada peta)
LABELS = {
 'Laluan Hutan Jauh': (612, 68), 'Gunung Utara': (424, 178), 'Gua Salji': (504, 253), 'Kampung Utara': (748, 174),
 'Padang Pasir': (1015, 226), 'Runtuhan Purba': (1240, 236), 'Kawasan Larangan': (1418, 244), 'Sawah Padi': (742, 308),
 'Hutan Barat': (384, 357), 'Kampung Timur': (1060, 374), 'Hutan Timur': (1278, 366), 'Kerajaan': (744, 465),
 'Hutan Utara': (1395, 451), 'Air Terjun': (1108, 494), 'Kebun Buah': (375, 486), 'Sawah': (1290, 520), 'Pasar': (1415, 522),
 'Camp': (1300, 578), 'Tasik Biru': (1027, 587), 'Kolam': (1373, 593), 'Pantai Timur': (1482, 594), 'Pantai Barat': (158, 608),
 'Kandang Lembu': (375, 600), 'Paya Bakau': (1192, 637), 'Puncak': (1325, 640), 'Kampung Selatan': (750, 690),
 'Pelabuhan Barat': (240, 715), 'Bukit': (1238, 718), 'Kawasan Turun Bukit': (1395, 720), 'Hutan Selatan': (607, 764),
 'Tasik Sunyi': (923, 773), 'Gunung Selatan': (1142, 800), 'Gua Selatan': (715, 876), 'Pulau Kecil': (176, 886),
 'Pulau Rahsia': (1142, 955), 'Pulau Lanun': (1415, 890),
}

# Lokasi WAJIB (senarai pengguna) -> titik sauh sebenar (pusat ciri, bukan teks), [ikon, kawasan]
# Titik sauh dibaca daripada ciri yang dilukis (pusat kampung, mulut gua, kepala air terjun, pusat tasik, dll.)
LOCATIONS = [
 # nama, ikon, kawasan, sauh(px)
 ('Kerajaan', '🏰', 'Tengah', (748, 465)),
 ('Sawah Padi', '🌾', 'Tengah', (742, 318)),
 ('Gunung Utara', '🏔', 'Utara', (415, 92)),
 ('Gua Salji', '❄️', 'Utara', (532, 214)),
 ('Laluan Hutan Jauh', '🌲', 'Utara', (560, 132)),
 ('Kampung Utara', '🏘', 'Utara', (745, 165)),
 ('Hutan Barat', '🌳', 'Barat', (384, 345)),
 ('Kebun Buah', '🍎', 'Barat', (385, 478)),
 ('Kandang Lembu', '🐄', 'Barat', (385, 592)),
 ('Pantai Barat', '🏖', 'Barat', (150, 600)),
 ('Pelabuhan Barat', '⚓', 'Barat', (268, 676)),
 ('Padang Pasir', '🏜', 'Timur', (1020, 195)),
 ('Runtuhan Purba', '🏛', 'Timur', (1215, 192)),
 ('Kawasan Larangan', '🌋', 'Timur', (1395, 128)),
 ('Kampung Timur', '🏘', 'Timur', (1055, 366)),
 ('Hutan Timur', '🌳', 'Timur', (1278, 352)),
 ('Hutan Utara', '🌳', 'Timur', (1395, 440)),
 ('Air Terjun', '💦', 'Timur', (1082, 500)),
 ('Tasik Biru', '💧', 'Timur', (1023, 592)),
 ('Sawah', '🌾', 'Timur', (1290, 512)),
 ('Pasar', '🛒', 'Timur', (1413, 522)),
 ('Camp', '⛺', 'Timur', (1302, 576)),
 ('Kolam', '🪷', 'Timur', (1385, 592)),
 ('Paya Bakau', '🐊', 'Timur', (1165, 640)),
 ('Puncak', '⛰', 'Timur', (1322, 640)),
 ('Bukit', '⛰', 'Timur', (1236, 712)),
 ('Kawasan Turun Bukit', '🥾', 'Timur', (1385, 712)),
 ('Pantai Timur', '🏖', 'Timur', (1452, 600)),
 ('Kampung Selatan', '🏘', 'Selatan', (748, 690)),
 ('Hutan Selatan', '🌳', 'Selatan', (600, 760)),
 ('Gua Selatan', '🕳', 'Selatan', (718, 852)),
 ('Tasik Sunyi', '💧', 'Selatan', (925, 785)),
 ('Gunung Selatan', '🏔', 'Selatan', (1105, 722)),
 ('Pulau Kecil', '🏝', 'Pulau', (180, 875)),
 ('Pulau Rahsia', '🌀', 'Pulau', (1145, 945)),
 ('Pulau Lanun', '🏴‍☠️', 'Pulau', (1418, 888)),
]
# lokasi tambahan v17 yang dikekalkan (tiada label dalam peta master, diletak pada ciri yang sepadan)
EXTRA_LOCATIONS = [
 ('Rumah Api', '🗼', 'Barat', (112, 562)),          # tanjung paling barat Pantai Barat
 ('Air Terjun Barat', '💦', 'Barat', (300, 205)),  # alur gunung di pantai barat laut (v17)
]

# ---------------------------------------------------------------- sauh binaan (mercu tanda)
ANCHORS = {
 'kerajaan': (748, 465), 'istana': (748, 462), 'wall_r_px': 100, 'citadel_r_px': 40,
 'canal_in_c': (748, 465), 'canal_in_r': (106, 123),
 'kampung_utara': (745, 165), 'kampung_timur': (1055, 366), 'kampung_selatan': (748, 690),
 'pantai_barat_town': (262, 640), 'pulau_kecil_village': (182, 872), 'pulau_lanun_fort': (1420, 888), 'menara_lanun': (1410, 846),
 'runtuhan': (1215, 192), 'kawah': (1395, 118), 'desert': (1020, 195), 'desert_r_px': 118,
 'gua_salji': (532, 214), 'gua_selatan': (718, 852),
 'air_terjun_top': (1105, 462), 'air_terjun_pool': (1103, 502),
 'tasik_biru': (1023, 592), 'tasik_sunyi': (925, 785), 'islet_sunyi': (920, 745),
 'kebun_buah': (385, 478), 'kandang_lembu': (385, 592), 'sawah_padi': (742, 318),
 'paya_bakau': (1172, 632), 'bukit': (1236, 712), 'rumah_api': (112, 562),
 'portal_desert': (1020, 280), 'portal_rahsia': (1145, 945), 'portal_kerajaan': (748, 395),
 'pelabuhan_docks': [((150, 690), (-0.62, 0.78)), ((200, 718), (-0.62, 0.78)), ((250, 745), (-0.62, 0.78))],
}

# ---------------------------------------------------------------- gunung (px, px, tinggi m, jejari px)
PEAKS = {
 'Gunung Utara': [(415, 88, 78, 95), (468, 120, 70, 80), (362, 120, 58, 70), (515, 165, 52, 62), (446, 190, 46, 58), (330, 165, 34, 45), (548, 212, 34, 40)],
 'Gunung Selatan': [(1100, 712, 58, 70), (1140, 748, 52, 60), (1062, 765, 46, 55), (1188, 772, 40, 50), (1215, 836, 26, 40), (1040, 822, 30, 45)],
 'Tebing Selatan': [(478, 712, 22, 40), (520, 770, 28, 50), (562, 838, 32, 48), (640, 866, 28, 42), (700, 822, 30, 40), (762, 884, 22, 38), (820, 858, 20, 34), (600, 905, 18, 30)],
 'Kawasan Larangan': [(1395, 118, 72, 112)],
 'Bukit': [(1236, 712, 18, 46)],
 'Runtuhan Purba': [(1215, 192, 7, 72)],
}
# dataran tinggi sumber Air Terjun (poligon px, tinggi m) — tebing di sisi selatan
PLATEAUS = [
 ('Dataran Air Terjun', [(1040, 402), (1172, 396), (1178, 462), (1146, 478), (1118, 470), (1092, 470), (1066, 480), (1038, 468)], 15.0),
]

# ---------------------------------------------------------------- jalan (px). tier: d=diraja 5 m, k=kampung 3.4 m, p=denai 2.4 m
ROADS = [
 # --- jalan jejari Kerajaan (merentasi dua terusan; jambatan dibina automatik di atas air)
 ('Jalan Diraja Utara', 'd', [(748, 364), (747, 340), (747, 300), (747, 282), (747, 260), (747, 228), (746, 210)]),
 ('Jalan Diraja Selatan', 'd', [(749, 562), (747, 580), (747, 600), (747, 625), (748, 642)]),
 ('Jalan Diraja Timur', 'd', [(850, 463), (868, 465), (907, 466), (946, 467), (989, 468), (1000, 470)]),
 ('Jalan Diraja Barat', 'd', [(650, 463), (625, 464), (574, 466), (542, 462), (515, 467), (483, 464)]),
 ('Jalan Diraja Timur Laut', 'd', [(830, 410), (842, 401), (856, 392), (880, 380), (915, 377), (950, 377), (963, 378)]),
 ('Jalan Diraja Barat Laut', 'd', [(672, 408), (651, 398), (630, 392), (612, 375), (598, 357), (581, 351), (544, 349)]),
 ('Jalan Diraja Tenggara', 'd', [(826, 528), (839, 534), (860, 550), (885, 569), (905, 578), (916, 584)]),
 ('Jalan Diraja Barat Daya', 'd', [(672, 520), (653, 531), (628, 548), (605, 564), (585, 580), (572, 594)]),
 ('Jalan Pasir Timur Laut', 'd', [(860, 352), (877, 333), (899, 311), (908, 301)]),
 # --- lingkaran Sawah Padi (antara dua terusan)
 ('Lingkaran Sawah Padi', 'k', [(619, 402), (610, 380), (614, 357), (652, 292), (689, 284), (741, 282), (752, 282), (800, 284), (831, 291), (852, 326), (868, 347), (869, 355)]),
 ('Lingkaran Sawah Timur', 'k', [(854, 392), (836, 407), (838, 414), (852, 446), (852, 462), (878, 464)]),
 ('Lingkaran Sawah Selatan', 'k', [(833, 529), (820, 540), (795, 554), (764, 590), (740, 588), (720, 582), (701, 580), (675, 565), (665, 563)]),
 ('Jalan Sawah Padi', 'p', [(774, 344), (786, 343), (827, 361), (851, 383), (854, 391)]),
 # --- utara
 ('Jalan Kampung Utara', 'k', [(645, 160), (647, 151), (655, 139), (678, 119), (692, 113), (701, 110), (734, 105), (764, 109), (780, 107), (818, 121), (832, 142), (868, 147), (910, 147)]),
 ('Jalan Kampung Utara Selatan', 'k', [(632, 207), (656, 206), (675, 211), (692, 216), (717, 215), (733, 220), (746, 215), (774, 218), (797, 216), (827, 221), (864, 242), (879, 255), (896, 262), (902, 272), (960, 314)]),
 ('Jalan Pantai Utara', 'p', [(780, 107), (802, 82), (807, 69)]),
 ('Jalan Gua Salji', 'k', [(431, 268), (438, 276), (469, 293), (493, 313), (526, 324), (527, 324), (577, 293), (596, 277), (606, 264), (618, 265), (652, 291)]),
 ('Jalan Hutan Barat', 'k', [(607, 263), (613, 235), (632, 207), (632, 205), (630, 175)]),
 # --- barat
 ('Jalan Kebun Buah', 'k', [(348, 429), (382, 423), (396, 415), (419, 410), (451, 410), (503, 402), (512, 399), (529, 374), (534, 354), (544, 349)]),
 ('Lingkaran Kebun Buah', 'k', [(483, 464), (481, 531), (505, 520), (514, 520), (557, 574), (572, 594), (585, 604), (602, 631), (624, 640), (648, 643)]),
 ('Jalan Kandang Lembu', 'k', [(481, 531), (440, 536), (400, 538), (340, 538), (288, 534), (281, 492), (279, 488), (281, 467), (288, 453), (288, 446), (267, 448), (246, 456)]),
 ('Jalan Pantai Barat', 'k', [(288, 534), (265, 581), (232, 589)]),
 ('Jalan Pelabuhan', 'k', [(466, 643), (421, 653), (409, 662), (390, 668), (355, 665), (354, 666), (335, 695), (333, 720)]),
 # --- timur
 ('Jalan Kampung Timur', 'k', [(980, 314), (1038, 307), (1056, 308), (1061, 305), (1068, 308), (1095, 309), (1105, 304), (1132, 274), (1139, 273), (1152, 264), (1200, 262), (1250, 275), (1316, 301), (1337, 300)]),
 ('Jalan Barat Kampung Timur', 'k', [(995, 428), (974, 405), (964, 386), (960, 357), (963, 324), (960, 314)]),
 ('Jalan Air Terjun', 'k', [(1004, 430), (1059, 428), (1074, 426), (1081, 422), (1094, 423), (1123, 418), (1138, 403), (1165, 402), (1192, 408), (1224, 406), (1241, 410), (1251, 417), (1273, 425), (1321, 429)]),
 ('Jalan Hutan Utara', 'k', [(1322, 429), (1358, 417), (1410, 412), (1432, 425), (1436, 433)]),
 ('Jalan Pasar', 'k', [(1322, 430), (1332, 455), (1334, 471), (1335, 472), (1365, 484), (1387, 499)]),
 ('Jalan Sawah Timur', 'k', [(1215, 588), (1210, 553), (1214, 516), (1221, 497), (1228, 488), (1244, 478), (1284, 479), (1286, 479), (1301, 477), (1307, 480), (1334, 472)]),
 ('Jalan Kampung Timur Utara', 'p', [(1129, 397), (1125, 340), (1095, 309)]),
 ('Jalan Runtuhan', 'p', [(1250, 275), (1262, 240), (1270, 218), (1292, 213), (1322, 213), (1342, 218)]),
 # --- tengah-selatan / tasik
 ('Jalan Tasik Biru', 'k', [(989, 468), (988, 490), (973, 525), (958, 545), (944, 571), (944, 636), (987, 652), (1036, 661), (1059, 654), (1070, 647), (1080, 646), (1092, 654), (1105, 658), (1136, 655), (1144, 658), (1170, 662)]),
 ('Jalan Tasik Biru Utara', 'p', [(997, 488), (1028, 506), (1039, 512), (1055, 520), (1064, 545), (1092, 570), (1102, 588), (1098, 619), (1081, 645)]),
 ('Jalan Tasik Sunyi', 'k', [(916, 584), (917, 600), (922, 613), (944, 636), (934, 657), (924, 667), (860, 688), (857, 699), (848, 717), (827, 742), (826, 793), (830, 802), (851, 822), (875, 833), (886, 839), (903, 847), (924, 850), (956, 841), (977, 829), (997, 817), (1019, 789), (1029, 739), (1034, 733), (1043, 687), (1037, 662)]),
 ('Jalan Gunung Selatan', 'p', [(1035, 734), (1055, 729), (1067, 722), (1084, 724)]),
 ('Jalan Kampung Selatan', 'k', [(648, 643), (662, 639), (720, 637), (748, 640), (792, 637), (832, 639), (851, 664), (860, 688)]),
 ('Jalan Kampung Selatan Bawah', 'k', [(640, 694), (643, 705), (647, 715), (661, 727), (666, 727), (703, 740), (738, 742), (748, 750), (755, 742), (826, 742)]),
 ('Jalan Gua Selatan', 'p', [(748, 752), (756, 784), (757, 785), (778, 792), (802, 793), (821, 798)]),
 ('Jalan Bukit', 'p', [(1170, 662), (1197, 700), (1192, 718), (1197, 738)]),
 ('Jambatan Pulau Lanun', 'd', [(1336, 758), (1358, 772), (1384, 819), (1398, 836)]),
]
# kolam air terjun (dikorek; buih putih dalam peta tidak dikesan sebagai air): (px, py, jejari px)
POOLS = [(1103, 502, 15)]

# Laluan Hutan Jauh (jalan kecil hutan; hujungnya ada 3 bendera misi)
TRAIL = ('Laluan Hutan Jauh', [(640, 168), (629, 174), (600, 168), (572, 146), (552, 141), (532, 132), (512, 120), (456, 98), (428, 70), (395, 60),
                               (372, 72), (338, 100), (300, 130), (290, 175), (288, 200), (284, 224), (282, 240), (296, 280), (270, 305), (250, 332), (232, 380),
                               (226, 425), (246, 456), (267, 448), (288, 446)])
TRAIL2 = ('Laluan Hutan Jauh (Selatan)', [(232, 589), (262, 610), (300, 650), (330, 690), (333, 720), (318, 748)])
FLAGS = {'tjn': (402, 62), 'tjw': (258, 326), 'tjs': (318, 748)}   # bendera misi s20 'Jejak Laluan Jauh'

# Nama jambatan (diberi kepada jambatan automatik yang paling hampir, < 22 px)
BRIDGE_NAMES = {
 'Jambatan Utara': (747, 242), 'Jambatan Diraja': (746, 356), 'Jambatan Selatan': (747, 613), 'Jambatan Istana Selatan': (747, 571),
 'Jambatan Jalan Baru': (946, 467), 'Jambatan Istana Timur': (868, 465), 'Jambatan Barat': (556, 465), 'Jambatan Istana Barat': (625, 464),
 'Jambatan Hutan': (581, 351), 'Jambatan Istana Barat Laut': (651, 398), 'Jambatan Kampung Timur': (932, 377), 'Jambatan Istana Timur Laut': (842, 401),
 'Jambatan Tenggara': (885, 569), 'Jambatan Istana Tenggara': (839, 534), 'Jambatan Barat Daya': (605, 564), 'Jambatan Istana Barat Daya': (653, 531),
 'Jambatan Gua Salji': (631, 276), 'Jambatan Padang Pasir': (887, 322), 'Jambatan Sungai Utara': (853, 144), 'Jambatan Kuala Utara': (853, 236),
 'Jambatan Paya Bakau': (1190, 657), 'Jambatan Larangan': (1306, 213), 'Jambatan Pulau Lanun': (1371, 796), 'Jambatan Tasik Sunyi': (858, 615),
}

# ---------------------------------------------------------------- kawasan kelas khas (override warna)
# kelas: 0 laut dalam,1 air,2 pasir,3 rumput,4 hutan,5 sawah/ladang,6 batu,7 salji,8 padang pasir,9 lava,10 kampung,11 Kerajaan,12 tanah/jalan
VILLAGE_BOXES = [  # (x0,y0,x1,y1) px — kawasan rumah padat
 (678, 118, 815, 216), (985, 322, 1128, 412), (680, 640, 822, 742), (186, 588, 340, 722), (124, 836, 244, 918), (1336, 820, 1484, 960),
]
FARM_BOXES = [(292, 420, 482, 532), (292, 540, 476, 642), (1236, 494, 1342, 548)]
RUIN_BOX = (1150, 128, 1292, 262)
DESERT_C, DESERT_R = (1020, 195), 122
VOLCANO_BOX = (1300, 88, 1528, 318)
SAWAH_PADI_RING = ((748, 440), 150, 232)   # pusat, r dalam, r luar (dihadkan oleh air)
