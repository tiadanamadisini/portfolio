#!/usr/bin/env python3
"""Bina Kediaman Isekai Waguri v17 daripada sumber asal v16.1 + modul src/*.js.

Sumber asal TIDAK diubah secara manual: setiap perubahan ialah tampalan kecil bersemak
(rentetan lama mesti wujud tepat N kali, jika tidak binaan gagal) — supaya jelas apa yang disentuh.

  python3 tools/build.py            → dist/index.html
  python3 tools/build.py --apk KEY  → + dist/Kediaman_Isekai_Waguri_v17_0.apk
"""
import argparse, glob, hashlib, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "original", "index_v16_1.html")
VER = "17.0"
VCODE = 18
PKG = "com.waguri.isekai17"  # sama panjang dengan com.waguri.kediaman → boleh dipasang bersebelahan v16

# (lama, baharu, bilangan dijangka, sebab)
PATCHES = [
    # --- ketinggian & hutan: cangkuk V17 (kawasan lama tidak berubah; H17 pulangkan H lama di luar Lembah Timur)
    ("const H=(x,z)=>{", "const H=(x,z)=>window.H17?H17(x,z,H_0):H_0(x,z);const H_0=(x,z)=>{", 1, "cangkuk ketinggian V17"),
    ("const FD=(x,z)=>{", "const FD=(x,z)=>{const f17=window.FD17&&FD17(x,z);if(f17!==undefined&&f17!==false)return f17;return FD_0(x,z)};const FD_0=(x,z)=>{", 1, "hutan lama dimatikan dalam Lembah Timur"),
    # --- rumput GPU lama (V8 + V13) tidak tumbuh dalam Lembah Timur (tekstur tingginya hanya meliputi dunia lama)
    ("float sc=ok*fade*(.65+aOff.w*.7);", "float sc=ok*fade*(.65+aOff.w*.7)*(1.-step(wp.x,-216.)*step(wp.y,57.));", 2, "rumput lama keluar kawasan baharu"),
    ("float sc=ok*fade*(.48+aOff.w*.5)*(1.-step(abs(wp.x),1.4)*step(4.6,wp.y)*step(wp.y,19.2));",
     "float sc=ok*fade*(.48+aOff.w*.5)*(1.-step(abs(wp.x),1.4)*step(4.6,wp.y)*step(wp.y,19.2))*(1.-step(wp.x,-216.)*step(wp.y,57.));", 1, "rumput tambahan V13 keluar kawasan baharu"),
    # --- peta: offset & saiz dari MAP17 (dunia diluaskan ke barat & utara)
    ("V8(()=>{const K=2.15,X=x=>(x+232)*K,Z=z=>(z+118)*K;W8.mapK=[K,232,118];",
     "V8(()=>{const K=2.15,X=x=>(x+MAP17.ox)*K,Z=z=>(z+MAP17.oy)*K;W8.mapK=[K,MAP17.ox,MAP17.oy];", 1, "peta asas"),
    ("c.width=720;c.height=810;", "c.width=MAP17.w;c.height=MAP17.h;", 1, "kanvas peta asas"),
    ("cw=240,chh=270", "cw=Math.round(MAP17.w/3),chh=Math.round(MAP17.h/3)", 1, "raster peta"),
    ("*3/K-232", "*3/K-MAP17.ox", 2, "raster peta x"),
    ("*3/K-118", "*3/K-MAP17.oy", 2, "raster peta z"),
    ("g.drawImage(sc,0,0,720,810)", "g.drawImage(sc,0,0,MAP17.w,MAP17.h)", 1, "raster peta lukis"),
    ("OX=232,OY=118", "OX=MAP17.ox,OY=MAP17.oy", 2, "peta mini & peta penuh"),
    ("const W=720,H=810,K=2.15", "const W=MAP17.w,H=MAP17.h,K=2.15", 1, "peta penuh V16.1"),
    ("MW=720,MH=810", "MW=MAP17.w,MH=MAP17.h", 1, "peta malam V9"),
    ("(P.x+232)*2.15", "(P.x+MAP17.ox)*2.15", 2, "penanda pemain peta lama"),
    ("(P.z+118)*2.15", "(P.z+MAP17.oy)*2.15", 2, "penanda pemain peta lama"),
    ("(d[2]+232)*2.15", "(d[2]+MAP17.ox)*2.15", 2, "pin peta lama"),
    ("(d[3]+118)*2.15", "(d[3]+MAP17.oy)*2.15", 2, "pin peta lama"),
    ("k=720/r.width", "k=MAP17.w/r.width", 1, "ketik peta lama"),
    ("K=2.15,X=x=>(x+232)*K,Z=z=>(z+118)*K;PENS", "K=2.15,X=x=>(x+MAP17.ox)*K,Z=z=>(z+MAP17.oy)*K;PENS", 1, "kandang pada peta"),
    ('id="mpc" width="720" height="810"', 'id="mpc" width="1452" height="1275"', 2, "kanvas peta lama (sandaran)"),
    # --- identiti versi
    ("<title>Kediaman Isekai Waguri v16</title>", "<title>Kediaman Isekai Waguri v17</title>", 1, "tajuk"),
    ('window.WAGURI_APP={"p": "apk", "v": "16.1"};', 'window.WAGURI_APP={"p": "apk", "v": "%s"};' % VER, 1, "versi"),
]
PRE_ANCHOR = "/* ===== V14 AWAL: tahap grafik dibaca SEBELUM dunia dibina"


def build(html_out):
    s = open(SRC, encoding="utf-8").read()
    for old, new, n, why in PATCHES:
        c = s.count(old)
        if c != n:
            sys.exit(f"TAMPALAN GAGAL ({why}): {old!r} dijumpai {c}×, dijangka {n}×")
        s = s.replace(old, new)
    mods = sorted(glob.glob(os.path.join(ROOT, "src", "*.js")))
    pre = [m for m in mods if os.path.basename(m).startswith("00_")]
    post = [m for m in mods if m not in pre]
    tag = lambda m: "<script>/* %s */\n%s\n</script>\n" % (os.path.basename(m), open(m, encoding="utf-8").read())
    # modul PRA: selepas skrip GFX14 (sebelum enjin teras)
    i = s.index(PRE_ANCHOR)
    j = s.index("</script>", i) + len("</script>")
    s = s[:j] + "\n" + "".join(tag(m) for m in pre) + s[j:]
    # modul lain: sebelum </body>
    k = s.rindex("</body>")
    s = s[:k] + "".join(tag(m) for m in post) + s[k:]
    for m in post + pre:
        body = open(m, encoding="utf-8").read()
        if "</script" in body:
            sys.exit("modul mengandungi </script>: " + m)
    os.makedirs(os.path.dirname(html_out), exist_ok=True)
    open(html_out, "w", encoding="utf-8").write(s)
    print("HTML:", html_out, len(s.encode()), "bait ·", len(pre) + len(post), "modul ·", len(PATCHES), "tampalan")
    return html_out


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(ROOT, "dist", "index.html"))
    ap.add_argument("--apk", metavar="KEY_PEM", help="bina APK bertandatangan dengan kunci ini")
    a = ap.parse_args()
    h = build(a.out)
    for m in sorted(glob.glob(os.path.join(ROOT, "src", "*.js"))):
        r = subprocess.run(["node", "--check", m], capture_output=True, text=True)
        if r.returncode:
            sys.exit("ralat sintaks: " + m + "\n" + r.stderr)
    if a.apk:
        apk = os.path.join(ROOT, "dist", "Kediaman_Isekai_Waguri_v%s.apk" % VER.replace(".", "_"))
        subprocess.run([sys.executable, os.path.join(ROOT, "tools", "apk_tool.py"), "build", "--shell", os.path.join(ROOT, "original", "apk_shell"),
                        "--html", h, "--out", apk, "--key", a.apk, "--version-code", str(VCODE), "--version-name", VER, "--package", PKG], check=True)
