# -*- coding: utf-8 -*-
"""
Fasa 2 — Penjana grid dunia daripada MASTER WORLD MAP.

Input : reference/master-map.png + tools/world_ref.py (data tulisan tangan)
Output: src/v19/world19-data.js   (grid tinggi/kelas/hutan, gzip+base64, + LOC, jalan, jambatan, sauh)
        reference/landmarks.json  (peta rujukan berkoordinat: piksel + meter dunia)
        docs/img/gen-*.png        (imej semakan)

Jalankan:  python3 -I tools/gen_world.py      (dari folder isekai-waguri)
Keperluan: numpy, pillow, scipy, scikit-image
"""
import base64, gzip, json, math, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd
from skimage.morphology import skeletonize

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import world_ref as R  # noqa: E402

IMG = os.path.join(ROOT, 'reference', 'master-map.png')
OUT_JS = os.path.join(ROOT, 'src', 'v19', 'world19-data.js')
OUT_REF = os.path.join(ROOT, 'reference', 'landmarks.json')
DBG = os.path.join(ROOT, 'docs', 'img')
os.makedirs(DBG, exist_ok=True)
os.makedirs(os.path.dirname(OUT_JS), exist_ok=True)

S, TX, TZ = R.S, R.TX, R.TZ
def w(px, py):  # piksel -> meter dunia
    return (round(S * px + TX, 2), round(S * py + TZ, 2))

im = np.asarray(Image.open(IMG).convert('RGB')).astype(np.float32) / 255.0
H_, W_ = im.shape[:2]
assert (W_, H_) == (1536, 1024), 'MASTER MAP mesti 1536x1024'
r, g, b = im[..., 0], im[..., 1], im[..., 2]
mx, mn = im.max(-1), im.min(-1)
v = mx
s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
dd = np.maximum(mx - mn, 1e-6)
h = np.where(mx == r, ((g - b) / dd) % 6, np.where(mx == g, (b - r) / dd + 2, (r - g) / dd + 4)) * 60
yy, xx = np.mgrid[0:H_, 0:W_]

def smooth(t, a, b_):
    x = np.clip((t - a) / (b_ - a), 0, 1)
    return x * x * (3 - 2 * x)

def label_mask(pad=5):
    m = np.zeros((H_, W_), bool)
    for n, (x, y) in R.LABELS.items():
        hw = len(n) * (13 if n == 'Kerajaan' else 8.6) / 2 + pad
        hh = (15 if n == 'Kerajaan' else 11) + pad
        m[max(0, int(y - hh)):int(y + hh), max(0, int(x - hw)):int(x + hw)] = True
    return m

def fill_from_outside(arr, unknown):
    """isi piksel 'unknown' dengan nilai piksel diketahui yang paling hampir"""
    idx = nd.distance_transform_edt(unknown, return_distances=False, return_indices=True)
    return arr[tuple(idx)]

LBL = label_mask()
LAND_LABELS = ('Air Terjun',)          # label di atas lata air terjun: kawasan batu/darat, bukan tasik
def label_box(n, pad=5):
    x, y = R.LABELS[n]
    hw = len(n) * (13 if n == 'Kerajaan' else 8.6) / 2 + pad
    hh = (15 if n == 'Kerajaan' else 11) + pad
    return max(0, int(y - hh)), int(y + hh), max(0, int(x - hw)), int(x + hw)

# ------------------------------------------------------------------ 1. AIR
water = ((h > 185) & (h < 222) & (s > 0.45) & (v > 0.55)) | ((h > 175) & (h < 225) & (s > 0.25) & (v > 0.75) & (b > g))
water = nd.binary_opening(water, iterations=1)
water = nd.binary_closing(water, iterations=2)
lab, n = nd.label(water)
sz = nd.sum(water, lab, range(1, n + 1))
water = np.isin(lab, 1 + np.where(sz >= 60)[0])
water[:4, :] = water[-4:, :] = True                        # bingkai peta = laut (operasi morfologi menghakis tepi)
water[:, :4] = water[:, -4:] = True
water = fill_from_outside(water, LBL)                      # label di atas tasik -> air
for n_ in LAND_LABELS:
    y0_, y1_, x0_, x1_ = label_box(n_)
    water[y0_:y1_, x0_:x1_] = False
# tutup celah jambatan pada terusan & sungai (jambatan dibina sebagai struktur di atas air)
cx0, cy0 = R.ANCHORS['canal_in_c']
rr = np.hypot(xx - cx0, yy - cy0)
ri0, ri1 = R.ANCHORS['canal_in_r']
inner_canal = (rr >= ri0) & (rr <= ri1)
water |= inner_canal
corr = (rr > 140) & (rr < 255)                               # terusan luar
corr |= (xx > 820) & (xx < 890) & (yy > 40) & (yy < 250)      # sungai utara ke laut
corr |= (xx > 840) & (xx < 905) & (yy > 560) & (yy < 730)     # sungai tenggara ke Tasik Sunyi
corr |= (xx > 1095) & (xx < 1300) & (yy > 500) & (yy < 760)   # sungai Air Terjun -> Paya Bakau
corr |= (xx > 1278) & (xx < 1322) & (yy > 185) & (yy < 245)    # selat Runtuhan Purba -> Kawasan Larangan (jambatan)
closed = nd.binary_closing(water, structure=np.ones((3, 3)), iterations=9)
water |= closed & corr
# kawasan jeti pelabuhan (tiang kayu di atas air) -> air; jeti dibina sebagai objek
# jeti = jalur kayu nipis di atas laut: buka (opening) darat dalam zon pelabuhan supaya jalur < ~7 px menjadi air semula
for zone in [((xx > 60) & (xx < 345) & (yy > 630) & (yy < 815)), ((np.hypot(xx - 1420, yy - 890) > 55) & (np.hypot(xx - 1420, yy - 890) < 118))]:
    land_z = ~water & zone
    keep = nd.binary_opening(land_z, structure=np.ones((3, 3)), iterations=3)
    water |= land_z & ~keep
# dataran Air Terjun: aliran di atasnya dibina sebagai reben air tinggi oleh game, bukan air paras laut
from skimage.draw import polygon as sk_polygon  # noqa: E402
PLAT_IN = []
for nm, poly, ph in R.PLATEAUS:
    m_ = np.zeros((H_, W_), bool)
    pr_, pc_ = sk_polygon([p[1] for p in poly], [p[0] for p in poly], (H_, W_))
    m_[pr_, pc_] = True
    PLAT_IN.append(m_)
    water &= ~nd.binary_dilation(m_, iterations=6)
for (px_, py_, pr_) in R.POOLS:
    water |= np.hypot(xx - px_, yy - py_) < pr_
# pulau kecil terlalu kecil dibuang (<40 piksel) supaya tiada 'tompok'
land = ~water
lab, n = nd.label(land)
sz = nd.sum(land, lab, range(1, n + 1))
land = np.isin(lab, 1 + np.where(sz >= 40)[0])
water = ~land

# laut terbuka = air yang bersambung dengan sempadan selepas memotong saluran sempit
er = nd.binary_erosion(water, iterations=7, border_value=1)
lab, n = nd.label(er)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
ocean = nd.binary_dilation(np.isin(lab, list(border)), iterations=8) & water
inland = water & ~ocean

d_land = nd.distance_transform_edt(water)      # jarak (px) dari darat, untuk piksel air
d_water = nd.distance_transform_edt(~water)    # jarak (px) dari air, untuk piksel darat
d_ocean = nd.distance_transform_edt(~ocean)

# ------------------------------------------------------------------ 2. KELAS WARNA ASAS
green = (h > 70) & (h < 170) & (s > 0.25)
forest_px = green & (v < 0.70) & (s > 0.35)
grass_px = green & ~forest_px
sand_px = (h > 20) & (h < 55) & (s > 0.15) & (s < 0.55) & (v > 0.75)
grey_px = (s < 0.16) & (v > 0.45)
lava_px = (h < 25) & (s > 0.5) & (v > 0.5)
dark_px = (v < 0.45) & (s < 0.35)
snow_px = (s < 0.10) & (v > 0.86)
bl = lambda a, k=9: nd.uniform_filter(a.astype(np.float32), k)
F = {k: bl(m) for k, m in dict(forest=forest_px, grass=grass_px, sand=sand_px, grey=grey_px, lava=lava_px, dark=dark_px).items()}
for k in F:
    F[k] = fill_from_outside(F[k], LBL)
order = ['forest', 'grass', 'sand', 'grey', 'lava', 'dark']
arg = np.argmax(np.stack([F[k] for k in order]), 0)
CL = np.array([4, 3, 2, 12, 9, 6], np.uint8)[arg]
rockfrac = nd.gaussian_filter(fill_from_outside(nd.uniform_filter(grey_px.astype(np.float32), 31), LBL), 6)
snowfrac = nd.gaussian_filter(fill_from_outside(snow_px.astype(np.float32), LBL), 3)

# ------------------------------------------------------------------ 3. TINGGI (meter)
mpp = S                                         # meter sepiksel
rng = np.random.default_rng(19)
def vnoise(scale_px, seed):
    rs = np.random.default_rng(seed)
    gw, gh = int(W_ / scale_px) + 3, int(H_ / scale_px) + 3
    gr = rs.random((gh, gw)).astype(np.float32)
    return nd.zoom(gr, (H_ / (gh - 2), W_ / (gw - 2)), order=3)[:H_, :W_] * 2 - 1
N1, N2, N3 = vnoise(90, 1), vnoise(30, 2), vnoise(12, 3)

base = 0.45 + 1.6 * smooth(d_water, 0, 10) + 2.2 * smooth(d_water, 10, 130) + 0.7 * N1 * smooth(d_water, 6, 40)
HT = base.copy()

def peak_field(peaks, sharp=1.6):
    out = np.zeros((H_, W_), np.float32)
    for (px, py, ph, pr) in peaks:
        t = np.hypot(xx - px, yy - py) / pr
        f = np.clip(1 - t, 0, 1) ** sharp
        out = np.maximum(out, ph * f)
    return out

ridge = 1 + 0.22 * N2 + 0.10 * N3
mtn_mask = np.zeros((H_, W_), np.float32)
for name in ('Gunung Utara', 'Gunung Selatan'):
    pf = peak_field(R.PEAKS[name]) * ridge
    k = 0.35 + 0.65 * np.clip(rockfrac / 0.45, 0, 1)
    add = pf * k
    HT = np.maximum(HT, base + add)
    mtn_mask = np.maximum(mtn_mask, np.clip(pf / 12, 0, 1))
pf = peak_field(R.PEAKS['Tebing Selatan'], 1.2) * ridge * np.clip(rockfrac / 0.4, 0, 1) * smooth(d_ocean, 0, 16)
HT = np.maximum(HT, base + pf)
mtn_mask = np.maximum(mtn_mask, np.clip(pf / 8, 0, 1))
# gunung berapi (Kawasan Larangan): kon + kawah
vx, vy, vh, vr = R.PEAKS['Kawasan Larangan'][0]
rv = np.hypot(xx - vx, yy - vy)
cone = vh * np.clip(1 - rv / vr, 0, 1) ** 1.15 * (1 + 0.12 * N3) - 13 * smooth(-rv, -15, -6)
inV = (xx > R.VOLCANO_BOX[0]) & (xx < R.VOLCANO_BOX[2]) & (yy > R.VOLCANO_BOX[1]) & (yy < R.VOLCANO_BOX[3])
HT = np.where(inV, np.maximum(HT, base + cone * smooth(d_water, 0, 8)), HT)
# Bukit & Runtuhan Purba (dataran)
bx, by, bh, br = R.PEAKS['Bukit'][0]
HT = np.maximum(HT, base + bh * np.clip(1 - np.hypot(xx - bx, yy - by) / br, 0, 1) ** 1.3)
rx_, ry_, rh_, rr_ = R.PEAKS['Runtuhan Purba'][0]
HT = np.maximum(HT, base + rh_ * smooth(-np.hypot(xx - rx_, yy - ry_) / rr_, -1, -0.55) * smooth(d_water, 0, 10))
# dataran tinggi sumber Air Terjun
for (nm, poly, ph), inside in zip(R.PLATEAUS, PLAT_IN):
    # bentuk organik: jarak ke tepi poligon dilicinkan + hingar, cerun lembut 22 px kecuali tebing lata air terjun
    din = nd.gaussian_filter(nd.distance_transform_edt(inside) - nd.distance_transform_edt(~inside), 6) + 5 * N2
    plat = ph * smooth(din, -14, 10)
    fx, fy = R.ANCHORS['air_terjun_top']
    lip = (np.abs(xx - fx) < 30) & (yy > fy - 10)
    plat = np.where(lip, plat * smooth(-yy, -(fy + 22), -(fy + 4)), plat)
    HT = np.maximum(HT, base + plat)
# padang pasir: bukit pasir + piramid batu
dcx, dcy = R.DESERT_C
rd = np.hypot(xx - dcx, yy - dcy)
inD = rd < R.DESERT_R
dune = 1.8 * (N2 * 0.5 + 0.5) + 1.2 * np.sin(xx * 0.09 + N1 * 3) * 0.5
rocky = nd.gaussian_filter((grey_px | dark_px).astype(np.float32) * inD, 4) * 26
HT = np.where(inD, base + (dune + rocky) * smooth(-rd, -R.DESERT_R, -R.DESERT_R + 25), HT)
# batu umum lain (pulau berbatu dll.)
gen_rock = np.clip(rockfrac - 0.3, 0, 1) * 18 * smooth(d_water, 0, 10) * (1 - np.clip(mtn_mask, 0, 1))
gen_rock *= ~inD
gen_rock *= ~((np.hypot(xx - cx0, yy - cy0)) < 260)        # Kerajaan & terusan dikecualikan
for (x0, y0, x1, y1) in R.VILLAGE_BOXES + R.FARM_BOXES + [R.RUIN_BOX]:
    gen_rock[y0:y1, x0:x1] = 0
HT = np.maximum(HT, base + gen_rock)
# Kerajaan: dataran rata + bukit istana
rk = np.hypot(xx - cx0, yy - cy0)
city = rk < R.ANCHORS['wall_r_px'] + 4
HT = np.where(city, 3.0 + 6.0 * smooth(-rk, -42, -14), HT)
# kampung & ladang: diratakan (purata besar)
flatm = np.zeros((H_, W_), bool)
for (x0, y0, x1, y1) in R.VILLAGE_BOXES + R.FARM_BOXES:
    flatm[y0:y1, x0:x1] = True
HTs = nd.gaussian_filter(HT, 14)
HT = np.where(flatm & ~water, np.minimum(HT, HTs + 0.3), HT)
# air
sea_h = -0.6 - 9.0 * smooth(d_land, 0, 60)
in_h = -0.7 - 2.6 * smooth(d_land, 0, 7)
HT = np.where(ocean, sea_h, np.where(inland, in_h, HT))
HT = np.where(~water, np.maximum(HT, 0.25), HT)
HT = nd.gaussian_filter(HT, 0.8)
HT = np.where(water, np.minimum(HT, -0.62), np.maximum(HT, 0.2))

# ------------------------------------------------------------------ 4. KELAS AKHIR (override semantik)
cls = CL.copy()
cls[cls == 9] = np.where(inV[cls == 9], 9, 12)             # lava hanya di gunung berapi
cls[(cls == 6) & ~inV] = 12
rockish = (cls == 12) & (rockfrac > 0.3) & ~city
cls[rockish] = 6
mt = (mtn_mask > 0.25) & ((cls == 12) | (cls == 6))
cls[mt] = 6
snow = mt & (snowfrac > 0.35) & (yy < 300) & (xx < 640)
cls[snow] = 7
cls[(HT > 52) & (xx < 640) & (yy < 300) & ~water] = 7
cls[inD & ((cls == 2) | (cls == 12) | (cls == 6) | (cls == 3))] = 8
cls[inV & ~water & (cls != 9)] = 13           # basalt gelap gunung berapi
cls[inV & ~water & lava_px] = 9                 # aliran lava (oren)
for (x0, y0, x1, y1) in R.VILLAGE_BOXES:
    sub = cls[y0:y1, x0:x1]
    sub[(sub == 12) | (sub == 2) | (sub == 6)] = 10
x0, y0, x1, y1 = R.RUIN_BOX
sub = cls[y0:y1, x0:x1]; sub[(sub == 12) | (sub == 6)] = 10
for (x0, y0, x1, y1) in R.FARM_BOXES:
    sub = cls[y0:y1, x0:x1]; sub[(sub == 3) | (sub == 12)] = 5
fx_, fy_ = R.ANCHORS['air_terjun_top']
rocks_ = (np.abs(xx - fx_) < 34) & (yy > fy_ - 26) & (yy < fy_ + 34) & ~water & (rockfrac > 0.12)
cls[rocks_] = 6
# Sawah Padi: tanah di antara dua terusan (isian banjir dari label)
between = ~water & ~city
lab, n = nd.label(between)
sp = lab == lab[318, 742]
sp &= (rk < 250)
cls[sp & ((cls == 3) | (cls == 12))] = 5
cls[city] = 11
cls[ocean & (d_land > 22)] = 0
cls[water & ~(ocean & (d_land > 22))] = 1
# pantai: pasir dekat laut
beach = ~water & (d_ocean < 9) & ((cls == 3) | (cls == 12))
cls[beach & (HT < 2.2)] = 2

# ------------------------------------------------------------------ 5. KETUMPATAN HUTAN
fd = nd.gaussian_filter(fill_from_outside(forest_px.astype(np.float32), LBL), 3.5)
fd = np.clip((fd - 0.18) / 0.55, 0, 1)
zero = water | city | np.isin(cls, [5, 7, 8, 9, 10, 11, 13]) | (d_water < 3)
fd[zero] = 0
fd[cls == 6] *= 0.25
fd[cls == 2] *= 0.3

# ------------------------------------------------------------------ 6. GRID (2x2 piksel -> 1 sel)
GW, GH = W_ // R.GRID_PX, H_ // R.GRID_PX
def down_mean(a):
    return a.reshape(GH, R.GRID_PX, GW, R.GRID_PX).mean((1, 3))
def down_mode(a, k=14):
    o = np.zeros((k, GH, GW), np.int32)
    blk = a.reshape(GH, R.GRID_PX, GW, R.GRID_PX)
    for c in range(k):
        o[c] = (blk == c).sum((1, 3))
    # air menang seri supaya garis pantai tidak menyempit
    o[1] = o[1] * 2 + 1
    o[0] = o[0] * 2
    return np.argmax(o, 0).astype(np.uint8)
Hg = down_mean(HT)
Cg = down_mode(cls)
Fg = down_mean(fd)
Hq = np.clip(np.round((Hg + 12.0) * 20), 0, 65535).astype('<u2')   # 0.05 m setiap langkah
Fq = np.clip(np.round(Fg * 255), 0, 255).astype(np.uint8)
blob = b'W19G' + np.array([GW, GH], '<u4').tobytes() + Hq.tobytes() + Cg.tobytes() + Fq.tobytes()
gz = gzip.compress(blob, 9, mtime=0)
b64 = base64.b64encode(gz).decode()

# ------------------------------------------------------------------ 7. JALAN, JAMBATAN, LOKASI (meter dunia)
def on_land_px(px, py):
    px, py = int(round(px)), int(round(py))
    return 0 <= px < W_ and 0 <= py < H_ and not water[py, px]
warn = []
roads = []
TW = {'d': 5.0, 'k': 3.4, 'p': 2.4}
TC = {'d': 0xc9a26a, 'k': 0xb08a58, 'p': 0x9a7448}
for nm, tier, pts in R.ROADS:
    roads.append({'n': nm, 't': tier, 'w': TW[tier], 'c': TC[tier], 'p': [w(*p) for p in pts]})
trail = {'n': R.TRAIL[0], 't': 'p', 'w': 2.8, 'c': 0x8f6a43, 'p': [w(*p) for p in R.TRAIL[1]]}
trail2 = {'n': R.TRAIL2[0], 't': 'p', 'w': 2.8, 'c': 0x8f6a43, 'p': [w(*p) for p in R.TRAIL2[1]]}
for rd in [*R.ROADS, ('trail', 'p', R.TRAIL[1]), ('trail2', 'p', R.TRAIL2[1])]:
    for p in rd[2]:
        if not on_land_px(*p):
            # air dibenarkan jika ia lintasan jambatan (bersebelahan darat dalam 40 px sepanjang jalan)
            pass
def loc_entry(nm, ic, reg, p):
    x, z = w(*p)
    return {'n': nm, 'ic': ic, 'reg': reg, 'px': list(p), 'x': x, 'z': z, 'label_px': list(R.LABELS.get(nm, p))}
locs = [loc_entry(*L) for L in R.LOCATIONS] + [loc_entry(*L) for L in R.EXTRA_LOCATIONS]
for L in locs:
    px, py = L['px']
    if not on_land_px(px, py) and L['n'] not in ('Tasik Biru', 'Tasik Sunyi', 'Kolam'):
        warn.append('LOKASI DI AIR: %s %s' % (L['n'], L['px']))
anch = {}
for k, val in R.ANCHORS.items():
    if isinstance(val, tuple) and len(val) == 2 and all(isinstance(q, (int, float)) for q in val) and not k.endswith('_r') and not k.startswith('canal'):
        anch[k] = w(*val)
anch['wall_r'] = R.ANCHORS['wall_r_px'] * S
anch['citadel_r'] = R.ANCHORS['citadel_r_px'] * S
anch['desert_r'] = R.ANCHORS['desert_r_px'] * S
anch['docks'] = [[*w(*p), d[0], d[1]] for p, d in R.ANCHORS['pelabuhan_docks']]
peaks = {k: [[*w(px, py), ph, pr * S] for (px, py, ph, pr) in v_] for k, v_ in R.PEAKS.items()}
bridges = {k: w(*p) for k, p in R.BRIDGE_NAMES.items()}
flags = {k: w(*p) for k, p in R.FLAGS.items()}
OX, OY = -TX, -TZ                                 # u=(x+OX)/K-.5 , K = 1.6
data = {
    'v': 19, 'S': S, 'TX': TX, 'TZ': TZ, 'GW': int(GW), 'GH': int(GH), 'K': S * R.GRID_PX, 'OX': OX, 'OY': OY,
    'MAPK': [1 / S, OX, OY],      # piksel peta = (x+OX)*MAPK[0]
    'OR': R.LEGACY_OR, 'LOC': locs, 'ROADS': roads, 'TRAIL': trail, 'TRAIL2': trail2, 'BR': bridges, 'FLAGS': flags,
    'A': anch, 'PEAKS': peaks, 'PLAT': [[nm, [w(*p) for p in poly], ph] for nm, poly, ph in R.PLATEAUS],
    'bounds': {'x0': TX, 'x1': TX + S * W_, 'z0': TZ, 'z1': TZ + S * H_},
}
with open(OUT_JS, 'w', encoding='utf-8') as f:
    f.write('/* ===== V19 DATA DUNIA — dijana oleh tools/gen_world.py daripada reference/master-map.png. JANGAN sunting dengan tangan. ===== */\n')
    f.write('window.W19D=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
    f.write('window.W19D.gz="' + b64 + '";\n')
ref = {'_tentang': 'Peta rujukan berkoordinat (Fasa 2). px = piksel MASTER MAP 1536x1024; x,z = meter dunia game. x = %g*px %+g, z = %g*py %+g' % (S, TX, S, TZ),
       'transform': {'S': S, 'TX': TX, 'TZ': TZ}, 'locations': locs, 'bridges': {k: {'px': list(R.BRIDGE_NAMES[k]), 'xz': list(v_)} for k, v_ in bridges.items()},
       'flags': {k: {'px': list(R.FLAGS[k]), 'xz': list(v_)} for k, v_ in flags.items()},
       'peaks': peaks, 'roads': [{'n': r_['n'], 'tier': r_['t'], 'px': [list(p) for p in src[2]]} for r_, src in zip(roads, R.ROADS)],
       'trail': {'n': R.TRAIL[0], 'px': [list(p) for p in R.TRAIL[1]]}, 'grid': {'GW': int(GW), 'GH': int(GH), 'cell_m': S * R.GRID_PX},
       'water_stats': {'ocean_px': int(ocean.sum()), 'inland_px': int(inland.sum()), 'land_px': int((~water).sum())},
       'warnings': warn}
with open(OUT_REF, 'w', encoding='utf-8') as f:
    json.dump(ref, f, ensure_ascii=False, indent=1)

# MASTER MAP sebagai JPEG terbenam (peta penuh & peta mini dalam game memaparkan gambar asal)
import io  # noqa: E402
bio = io.BytesIO()
Image.open(IMG).convert('RGB').save(bio, 'JPEG', quality=86, optimize=True, progressive=True)
with open(os.path.join(ROOT, 'src', 'v19', 'master-map.jpg.b64'), 'w') as f:
    f.write(base64.b64encode(bio.getvalue()).decode())
print('MASTER MAP JPEG %.0f KB' % (len(bio.getvalue()) / 1024))

# ------------------------------------------------------------------ 8. IMEJ SEMAKAN
PAL = np.array([[30, 60, 110], [50, 120, 200], [230, 210, 150], [120, 190, 80], [40, 110, 45], [190, 200, 90], [130, 128, 120],
                [240, 244, 250], [225, 180, 110], [240, 110, 20], [190, 120, 90], [200, 200, 205], [170, 140, 100], [58, 54, 60]], np.uint8)
Image.fromarray(PAL[Cg]).save(os.path.join(DBG, 'gen-kelas.png'))
gy_, gx_ = np.gradient(Hg)
shade = np.clip(0.6 + (gx_ * -0.7 + gy_ * -0.7) * 0.35, 0.2, 1.2)
hcol = np.clip((Hg + 12) / 92, 0, 1)
hs = (np.stack([shade * (0.35 + hcol * 0.65)] * 3, -1) * 230)
hs[Hg < -0.35] = [40, 90, 160]
Image.fromarray(np.clip(hs, 0, 255).astype(np.uint8)).save(os.path.join(DBG, 'gen-tinggi.png'))
print('grid %dx%d  gz %.0f KB  b64 %.0f KB  tinggi %.1f..%.1f m' % (GW, GH, len(gz) / 1024, len(b64) / 1024, Hg.min(), Hg.max()))
print('lokasi %d, jalan %d, jambatan bernama %d' % (len(locs), len(roads), len(bridges)))
for x_ in warn:
    print('AMARAN', x_)

# ------------------------------------------------------------------ 9. DOKUMEN PETA RUJUKAN (docs/02-PETA-RUJUKAN.md)
md = ['# Fasa 2 — Peta Rujukan Berkoordinat (MASTER MAP)\n',
      'Dijana oleh `tools/gen_world.py` daripada `reference/master-map.png` + data tulisan tangan `tools/world_ref.py`. '
      'Jangan sunting dengan tangan; ubah `world_ref.py` dan jalankan semula.\n',
      '## 1. Skala & sistem koordinat\n',
      '| Perkara | Nilai |\n|---|---|',
      '| Gambar rujukan | 1536 × 1024 piksel |',
      '| Skala dunia | **1 piksel = %.1f m** → pulau teras %.0f m × %.0f m (%.2f km²) |' % (S, S * W_, S * H_, S * W_ * S * H_ / 1e6),
      '| Penukaran | x = %.1f·px %+.0f · z = %.1f·py %+.0f (meter; +x timur, +z selatan) |' % (S, TX, S, TZ),
      '| Asal (0, 0) | pintu rumah Waguri (rangka asal v1–v16) = piksel (%.0f, %.0f) |' % (-TX / S, -TZ / S),
      '| Grid data | %d × %d sel, 1 sel = %.1f m (tinggi 0.05 m, kelas kawasan, ketumpatan hutan) |' % (GW, GH, S * R.GRID_PX),
      '| Julat tinggi | %.1f m (laut dalam) hingga %.1f m (Gunung Utara) |' % (float(Hg.min()), float(Hg.max())),
      '\n**Kenapa 0.8 m sepiksel?** Kawasan rumah asal (rumah, kebun, pasar, kolam, camp atas bukit) mempunyai saiz tetap dalam meter. '
      'Padanan kuasa dua terkecil antara ciri asal dan kelompok timur peta (Sawah, Pasar, Camp, Kolam) memberi skala ≈0.8 m/px dengan ralat 3–9 m. '
      'Skala V17 lama (0.5 m/px) menjadikan kawasan asal 1.6× terlalu besar berbanding peta.\n',
      '## 2. Lokasi wajib (36) + lokasi tambahan v17 (2)\n',
      '`Sauh` = pusat ciri sebenar yang dilukis (pusat kampung, mulut gua, kepala air terjun, pusat tasik). `Label` = kedudukan teks nama pada peta.\n',
      '| # | Lokasi | Ikon | Kawasan | Sauh (px) | Label (px) | Dunia x, z (m) |\n|---|---|---|---|---|---|---|']
for i, L in enumerate(locs, 1):
    md.append('| %d | %s | %s | %s | %d, %d | %d, %d | %.1f, %.1f |' % (i, L['n'], L['ic'], L['reg'], L['px'][0], L['px'][1], L['label_px'][0], L['label_px'][1], L['x'], L['z']))
md += ['\n## 3. Sambungan geografi kritikal\n',
       '- **Kerajaan** di tengah: kota bulat jejari %.0f m, tembok + 8 pintu, istana di tengah (%.0f, %.0f) m; **terusan dalam** (cincin %d–%d px dari pusat) dan **terusan luar** (bentuk ikut peta) dengan 16 lintasan jambatan pada 8 jalan jejari.' % (
           R.ANCHORS['wall_r_px'] * S, *w(*R.ANCHORS['istana']), *R.ANCHORS['canal_in_r']),
       '- **Sungai utara** dari terusan luar ke laut utara (antara Kampung Utara dan Padang Pasir); **sungai tenggara** dari terusan luar ke **Tasik Sunyi**.',
       '- **Air Terjun**: dataran tinggi %.0f m (sumber + kolam mata air) → tebing → kolam air terjun (%.0f, %.0f) m → sungai mengalir ke tenggara melalui **Paya Bakau** ke kelompok timur.' % (
           R.PLATEAUS[0][2], *w(*R.ANCHORS['air_terjun_pool'])),
       '- **Padang Pasir** kekal di timur laut (pusat %.0f, %.0f m, jejari %.0f m); **Runtuhan Purba** di timurnya dengan jambatan ke **Kawasan Larangan** (pulau gunung berapi).' % (*w(*R.DESERT_C), R.DESERT_R * S),
       '- **Pulau Lanun** di tenggara luar pantai, disambung jambatan panjang dari Kawasan Turun Bukit. **Pelabuhan Barat** di pesisir barat daya.',
       '- **Gunung Utara** (puncak %.0f m) dan **Gunung Selatan** (puncak %.0f m) dibina sebagai rupa bumi 3D; tebing berbatu sepanjang pantai selatan (Gua Selatan).' % (
           max(p[2] for p in R.PEAKS['Gunung Utara']), max(p[2] for p in R.PEAKS['Gunung Selatan'])),
       '\n## 4. Jalan (%d) & jambatan bernama (%d)\n' % (len(roads), len(bridges)),
       '| Jalan | Jenis | Titik kawalan (px) |\n|---|---|---|']
for (nm, tier, pts) in R.ROADS:
    md.append('| %s | %s | %s |' % (nm, {'d': 'diraja 5 m', 'k': 'kampung 3.4 m', 'p': 'denai 2.4 m'}[tier], ' → '.join('(%d,%d)' % p for p in pts)))
md.append('| %s | denai 2.8 m | %s |' % (R.TRAIL[0], ' → '.join('(%d,%d)' % p for p in R.TRAIL[1])))
md += ['\nJambatan dibina **automatik** di setiap tempat jalan merentas air (tiada jalan memotong air tanpa jambatan) dan diberi nama jambatan bernama terdekat:\n',
       '| Jambatan | Piksel | Dunia x, z (m) |\n|---|---|---|']
for k, p in R.BRIDGE_NAMES.items():
    md.append('| %s | %d, %d | %.1f, %.1f |' % (k, p[0], p[1], *w(*p)))
md += ['\n## 5. Gunung, bukit & dataran (tinggi ditetapkan tangan — peta 2D tiada ketinggian)\n', '| Kawasan | Puncak (px) | Tinggi | Jejari |\n|---|---|---|---|']
for k, v_ in R.PEAKS.items():
    for (px, py, ph, pr) in v_:
        md.append('| %s | %d, %d | %.0f m | %.0f m |' % (k, px, py, ph, pr * S))
md += ['\n## 6. Imej grid yang dijana\n', 'Kelas kawasan (laut dalam, air, pasir, rumput, hutan, sawah, batu, salji, padang pasir, lava, kampung, Kerajaan, jalan, basalt):\n',
       '![kelas](img/gen-kelas.png)\n', 'Ketinggian (berlorek):\n', '![tinggi](img/gen-tinggi.png)\n']
open(os.path.join(ROOT, 'docs', '02-PETA-RUJUKAN.md'), 'w', encoding='utf-8').write('\n'.join(md))
print('docs/02-PETA-RUJUKAN.md ditulis')
