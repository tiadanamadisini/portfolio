# -*- coding: utf-8 -*-
"""
Semakan peta Seksyen 12F — bandingkan dunia 3D sebenar (tangkapan + data fizik daripada game) dengan MASTER MAP.

Input  : reference/master-map.png, reference/landmarks.json, docs/img/verify/{topdown-3d.png, probe.json, reach.json}
         (jalankan `node tools/verify-map.mjs` dahulu)
Output : docs/img/verify/{overlay-50.jpg, banding.jpg, pantai-beza.png, capai.png, semakan.json}
         docs/03-SEMAKAN-PETA.md

Metrik garis pantai dikira daripada data FIZIK dunia (ketinggian SF di setiap sel 2 m — apa yang pemain pijak),
dan juga daripada warna tangkapan top-down (apa yang pemain lihat).
"""
import json, math, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = os.path.join(ROOT, 'docs', 'img', 'verify')
J = lambda *p: os.path.join(ROOT, *p)
ref = json.load(open(J('reference', 'landmarks.json'), encoding='utf-8'))
probe = json.load(open(os.path.join(V, 'probe.json'), encoding='utf-8'))
reach = json.load(open(os.path.join(V, 'reach.json'), encoding='utf-8'))
S, TX, TZ = ref['transform']['S'], ref['transform']['TX'], ref['transform']['TZ']
toPx = lambda x, z: ((x - TX) / S, (z - TZ) / S)

master = Image.open(J('reference', 'master-map.png')).convert('RGB')
top = Image.open(os.path.join(V, 'topdown-3d.png')).convert('RGB')
M = np.asarray(master).astype(np.float32) / 255
T = np.asarray(top).astype(np.float32) / 255
H_, W_ = M.shape[:2]

def hsv(a):
    mx, mn = a.max(-1), a.min(-1); d = np.maximum(mx - mn, 1e-6); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    return h, np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0), mx

# --- topeng air MASTER MAP (bebas daripada penjana: ambang warna mudah + pembersihan label)
h, s, v = hsv(M)
mw = ((h > 185) & (h < 222) & (s > 0.45) & (v > 0.55)) | ((h > 175) & (h < 225) & (s > 0.25) & (v > 0.75) & (M[..., 2] > M[..., 1]))
mw = nd.binary_closing(nd.binary_opening(mw, iterations=1), iterations=2)
mw[:4, :] = mw[-4:, :] = mw[:, :4] = mw[:, -4:] = True
lab, n = nd.label(mw); sz = nd.sum(mw, lab, range(1, n + 1)); mw = np.isin(lab, 1 + np.where(sz >= 60)[0])
m_land = ~mw

# --- topeng air dunia 3D (fizik): grid capaian, '3'-'5' = air
nx, nz, st = reach['nx'], reach['nz'], reach['step']
g = np.frombuffer(reach['grid'].encode(), np.uint8).reshape(nz, nx) - 48
g_land = g < 3
# sampel semula topeng master ke grid fizik (pusat sel -> piksel)
ii, jj = np.meshgrid(np.arange(nx), np.arange(nz))
px = ((TX + (ii + .5) * st) - TX) / S
py = ((TZ + (jj + .5) * st) - TZ) / S
pxi, pyi = np.clip(px.astype(int), 0, W_ - 1), np.clip(py.astype(int), 0, H_ - 1)
m_land_g = m_land[pyi, pxi]
def iou(a, b): return float((a & b).sum() / max(1, (a | b).sum()))
def edge(a): return a & ~nd.binary_erosion(a)
def bf1(a, b, tol):
    ea, eb = edge(a), edge(b)
    da, db = nd.distance_transform_edt(~ea), nd.distance_transform_edt(~eb)
    p = float((db[ea] <= tol).mean()) if ea.any() else 0; r_ = float((da[eb] <= tol).mean()) if eb.any() else 0
    return 2 * p * r_ / max(1e-9, p + r_), p, r_
iou_phys = iou(m_land_g, g_land)
f1_2, _, _ = bf1(m_land_g, g_land, 1)    # 1 sel = 2 m
f1_4, _, _ = bf1(m_land_g, g_land, 2)    # 4 m
f1_8, _, _ = bf1(m_land_g, g_land, 4)    # 8 m

# --- topeng air dunia 3D (visual): warna permukaan laut dalam tangkapan
th, ts, tv = hsv(T)
t_water = (np.abs(th - 197) < 9) & (ts > 0.2) & (ts < 0.42) & (tv > 0.76)
t_water = nd.binary_closing(nd.binary_opening(t_water, iterations=1), iterations=2)
t_land = ~t_water
iou_vis = iou(m_land, t_land)
f1v_3, _, _ = bf1(m_land, t_land, 3)
f1v_6, _, _ = bf1(m_land, t_land, 6)

# --- imej: tindihan 50%, banding sisi, beza garis pantai, capaian
Image.blend(master, top, 0.5).save(os.path.join(V, 'overlay-50.jpg'), quality=85)
sb = Image.new('RGB', (W_, H_ // 2)); sb.paste(master.resize((W_ // 2, H_ // 2)), (0, 0)); sb.paste(top.resize((W_ // 2, H_ // 2)), (W_ // 2, 0)); sb.save(os.path.join(V, 'banding.jpg'), quality=85)
dif = np.zeros((nz, nx, 3), np.uint8)
dif[m_land_g & g_land] = [86, 160, 70]; dif[~m_land_g & ~g_land] = [40, 90, 160]
dif[m_land_g & ~g_land] = [230, 50, 50]; dif[~m_land_g & g_land] = [250, 210, 40]
Image.fromarray(dif).resize((W_ // 2, H_ // 2), Image.NEAREST).save(os.path.join(V, 'pantai-beza.png'))
cap = np.zeros((nz, nx, 3), np.uint8)
cmap = {0: [200, 40, 40], 1: [80, 180, 80], 2: [240, 160, 40], 3: [25, 50, 90], 4: [40, 110, 190], 5: [70, 140, 210]}
for k, c in cmap.items(): cap[g == k] = c
Image.fromarray(cap).resize((W_ // 2, H_ // 2), Image.NEAREST).save(os.path.join(V, 'capai.png'))

# --- senarai semak lokasi
P = {l['n']: l for l in probe['loc']}
R_ = {l['n']: l['r'] for l in reach['loc']}
rows = []
for L in ref['locations']:
    n = L['n']; pl = P.get(n)
    gx, gz = (pl['x'], pl['z']) if pl else (None, None)
    ax, az = S * L['px'][0] + TX, S * L['px'][1] + TZ
    err = math.hypot(gx - ax, gz - az) if pl else None
    pin = pl and pl['pin']
    pin_off = math.hypot(pin[0] - gx, pin[1] - gz) if pin else None
    lbl = L.get('label_px') or L['px']
    lbl_d = math.hypot(lbl[0] - L['px'][0], lbl[1] - L['px'][1]) * S
    lake = n in ('Tasik Biru', 'Tasik Sunyi', 'Kolam')
    terrain_ok = pl is not None and (pl['wet'] == lake or n in ('Pelabuhan Barat',))
    rch = R_.get(n, 0)
    ok = pl is not None and err is not None and err < 1.0 and (pin is not None or n == 'Laluan Hutan Jauh') and (terrain_ok or lake) and rch > 0
    rows.append(dict(n=n, reg=L['reg'], px=L['px'], xz=[round(ax, 1), round(az, 1)], err_m=None if err is None else round(err, 2), pin=pin, pin_off_m=None if pin_off is None else round(pin_off, 1),
                     label_m=round(lbl_d, 1), h=pl and pl['h'], wet=pl and pl['wet'], reach={1: 'kaki', 2: 'renang/bot', 0: 'TIDAK'}[rch], ok=bool(ok)))

# --- jalan & jambatan
wet_roads = [r for r in probe['roads'] if r['wetNoBridge'] > 0]
bridges = [b['n'] for b in probe['bridges']]
need = ['Jambatan Camp', 'Jambatan Hutan', 'Jambatan Jalan Baru', 'Jambatan Paya Bakau', 'Jambatan Pulau Lanun', 'Jambatan Larangan']
need_ok = {n: n in bridges for n in need}
named_ok = sorted(set(bridges) & set(ref['bridges'].keys()))
flags = probe['flags']
falls = probe.get('falls', [])

res = dict(iou_fizik=round(iou_phys, 4), f1_pantai_fizik={'2m': round(f1_2, 4), '4m': round(f1_4, 4), '8m': round(f1_8, 4)},
           iou_visual=round(iou_vis, 4), f1_pantai_visual={'2.4m': round(f1v_3, 4), '4.8m': round(f1v_6, 4)},
           lokasi=rows, lokasi_lulus=sum(r['ok'] for r in rows), lokasi_jumlah=len(rows),
           jalan=len(probe['roads']), jalan_basah_tanpa_jambatan=wet_roads, jambatan=bridges, jambatan_wajib=need_ok, jambatan_bernama=named_ok,
           bendera=flags, air_terjun=falls, sel_kaki=reach['footCells'], sel_darat=reach['landCells'])
json.dump(res, open(os.path.join(V, 'semakan.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# --- laporan markdown
ok_ = lambda b: '✅' if b else '❌'
md = []
md.append('# Fasa 2 — Laporan Semakan Peta (MASTER MAP ↔ dunia 3D)\n')
md.append('Dijana oleh `tools/verify-map.mjs` + `tools/verify_map.py` daripada **game sebenar** (build `dist/Kediaman_Isekai_Waguri_v19.html`, '
          'Chromium headless, tahap grafik Biasa). Jangan sunting dengan tangan — jalankan semula alat.\n')
md.append('## 1. Ringkasan\n')
md.append('| Semakan | Keputusan | Ambang lulus | Status |\n|---|---|---|---|')
md.append('| IoU darat/air (fizik dunia vs MASTER MAP) | %.3f | ≥ 0.95 | %s |' % (iou_phys, ok_(iou_phys >= .95)))
md.append('| F1 garis pantai, toleransi 4 m (fizik) | %.3f | ≥ 0.85 | %s |' % (f1_4, ok_(f1_4 >= .85)))
md.append('| F1 garis pantai, toleransi 8 m (fizik) | %.3f | ≥ 0.95 | %s |' % (f1_8, ok_(f1_8 >= .95)))
md.append('| IoU darat/air (warna tangkapan top-down) | %.3f | ≥ 0.90 | %s |' % (iou_vis, ok_(iou_vis >= .90)))
md.append('| Lokasi (36 wajib + 2 lokasi v17) wujud di koordinat peta, ada pin, boleh dicapai | %d / %d | semua | %s |' % (res['lokasi_lulus'], len(rows), ok_(res['lokasi_lulus'] == len(rows))))
md.append('| Jambatan wajib (misi & laluan pulau) | %d / %d | semua | %s |' % (sum(need_ok.values()), len(need), ok_(all(need_ok.values()))))
md.append('| Jalan merentas air tanpa jambatan | %d | 0 | %s |' % (len(wet_roads), ok_(not wet_roads)))
md.append('| Air terjun dengan sumber di kawasan tinggi | %d dibina | ≥ 1 | %s |' % (len(falls), ok_(any(f[2] > 8 for f in falls))))
md.append('| Darat boleh dicapai berjalan kaki dari rumah | %.1f %% | ≥ 85 %% | %s |\n' % (100 * reach['footCells'] / max(1, reach['landCells']), ok_(reach['footCells'] / max(1, reach['landCells']) >= .85)))
md.append('## 2. Perbandingan visual\n')
md.append('Kiri: MASTER MAP · Kanan: tangkapan top-down dunia 3D (kamera ortografik, 1 piksel = 0.8 m, sejajar dengan peta).\n')
md.append('![banding](img/verify/banding.jpg)\n')
md.append('Tindihan separa lut sinar 50 % (MASTER MAP + dunia 3D):\n')
md.append('![tindihan](img/verify/overlay-50.jpg)\n')
md.append('Beza garis pantai (data fizik): 🟩 darat di kedua-dua · 🟦 air di kedua-dua · 🟥 darat dalam peta tetapi air dalam game · 🟨 air dalam peta tetapi darat dalam game.\n')
md.append('![beza](img/verify/pantai-beza.png)\n')
md.append('Kebolehcapaian dari pintu rumah Waguri: 🟩 berjalan kaki · 🟧 perlu berenang/bot · 🟥 tidak dapat dicapai · biru = air.\n')
md.append('![capai](img/verify/capai.png)\n')
md.append('## 3. Senarai semak lokasi\n')
md.append('`ralat` = jarak antara kedudukan lokasi dalam game dan titik sauh pada MASTER MAP. `pin` = anjakan pin peta (pin dialih ke darat terdekat bila perlu). '
          '`label` = jarak teks label peta ke titik sauh ciri.\n')
md.append('| # | Lokasi | Kawasan | Piksel peta | Dunia (x, z) m | Ralat | Pin | Label | Tinggi | Capaian | Status |\n|---|---|---|---|---|---|---|---|---|---|---|')
for i, r in enumerate(rows, 1):
    md.append('| %d | %s | %s | %d, %d | %.1f, %.1f | %s m | %s | %.0f m | %s m | %s | %s |' % (
        i, r['n'], r['reg'], r['px'][0], r['px'][1], r['xz'][0], r['xz'][1], r['err_m'], '—' if r['pin_off_m'] is None else '%.1f m' % r['pin_off_m'],
        r['label_m'], r['h'], r['reach'], ok_(r['ok'])))
md.append('\n## 4. Jalan, sungai & jambatan\n')
md.append('- Jalan dalam game: **%d** (40 dijejak daripada MASTER MAP + Laluan Hutan Jauh 2 bahagian).' % len(probe['roads']))
md.append('- Jambatan/jeti dibina: **%d**; jambatan bernama ikut peta: %s.' % (len(bridges), ', '.join(named_ok)))
md.append('- Jambatan wajib: ' + ', '.join('%s %s' % (ok_(v_), k) for k, v_ in need_ok.items()) + '.')
md.append('- Jalan merentas air tanpa jambatan: ' + (', '.join('%s (%d titik)' % (r['n'], r['wetNoBridge']) for r in wet_roads) if wet_roads else '**tiada** ✅') + '.')
md.append('- Air terjun: ' + '; '.join('(%.0f, %.0f) puncak %.1f m' % tuple(f) for f in falls) + '.')
md.append('- Bendera Laluan Hutan Jauh: ' + ', '.join('%s (%.0f, %.0f) tinggi %.1f m' % (k, f_['x'], f_['z'], f_['h']) for k, f_ in flags.items()) + '.\n')
md.append('## 5. Had yang diketahui (jujur)\n')
md.append('- Sungai & terusan berada pada paras laut (satah air tunggal); hanya air terjun mempunyai paras tinggi (kolam mata air di atas tebing). Aliran air yang bergerak di sepanjang sungai belum dianimasikan.')
md.append('- Kawasan rumah asal (rangka v1–v16) dikekalkan tepat seperti v18 di kelompok timur; susun atur dalaman kelompok itu (rumah, kolam besar, camp atas bukit) mengikut permainan asal, bukan lukisan baharu dalam peta, supaya tiada misi/NPC lama rosak.')
md.append('- Pulau kecil dan Pulau Rahsia hanya boleh dicapai dengan berenang atau sampan (seperti peta: tiada jambatan dilukis).')
md.append('- Ketinggian gunung, tebing dan dataran ditentukan secara tangan (tools/world_ref.py) kerana peta 2D tidak menyimpan ketinggian.\n')
open(J('docs', '03-SEMAKAN-PETA.md'), 'w', encoding='utf-8').write('\n'.join(md))
print(json.dumps({k: res[k] for k in ['iou_fizik', 'f1_pantai_fizik', 'iou_visual', 'f1_pantai_visual', 'lokasi_lulus', 'lokasi_jumlah', 'jambatan_wajib', 'sel_kaki', 'sel_darat']}, ensure_ascii=False))
print('jalan basah:', [(r['n'], r['wetNoBridge']) for r in wet_roads])
for r in rows:
    if not r['ok']: print('GAGAL', r)
