#!/usr/bin/env python3
"""Bungkus semula APK WebView Kediaman Isekai Waguri tanpa Android SDK.

Langkah:
  1. tampal AndroidManifest.xml binari (versionCode, versionName, pakej) — ganti panjang sama
  2. susun zip (fail tidak dimampat dijajarkan 4 bait, .so tiada)
  3. tandatangan APK Signature Scheme v2 (RSA 2048 + SHA-256)

Guna:
  python3 apk_tool.py info  <AndroidManifest.xml>
  python3 apk_tool.py build --shell DIR --html index.html --out app.apk --key key.pem \
        [--version-code N] [--version-name X.Y] [--package com.x.y]
  python3 apk_tool.py verify app.apk
"""
import argparse, hashlib, io, os, struct, sys, zipfile, zlib, datetime

# ---------------------------------------------------------------- AXML
RES_STRING_POOL = 0x0001
RES_XML_START_ELEMENT = 0x0102
TYPE_INT_DEC = 0x10
TYPE_STRING = 0x03


class Axml:
    def __init__(self, data):
        self.d = bytearray(data)
        assert struct.unpack_from("<HH", self.d, 0)[0] == 0x0003, "bukan AXML"
        self._parse()

    def _parse(self):
        d = self.d
        off = struct.unpack_from("<H", d, 2)[0]
        self.strings, self.str_off = [], []
        self.attrs = []  # (elem, name, type, data, offset_of_typed_value)
        while off < len(d):
            typ, hsz, size = struct.unpack_from("<HHI", d, off)
            if typ == RES_STRING_POOL:
                cnt, scnt, flags, sstart, _ = struct.unpack_from("<IIIII", d, off + 8)
                utf8 = flags & 0x100
                assert not utf8, "kolam rentetan UTF-8 tidak disokong"
                for i in range(cnt):
                    so = struct.unpack_from("<I", d, off + hsz + i * 4)[0]
                    p = off + sstart + so
                    n = struct.unpack_from("<H", d, p)[0]
                    assert n < 0x8000
                    self.str_off.append(p)
                    self.strings.append(d[p + 2:p + 2 + n * 2].decode("utf-16le"))
            elif typ == RES_XML_START_ELEMENT:
                ext = off + hsz
                name = struct.unpack_from("<I", d, ext + 4)[0]
                astart, asize, acount = struct.unpack_from("<HHH", d, ext + 8)
                for i in range(acount):
                    a = ext + astart + i * asize
                    _, an, _, _, dtype, data = struct.unpack_from("<IIIHxBI", d, a)
                    self.attrs.append((self.strings[name], self.strings[an], dtype, data, a + 12))
            off += size

    def attr(self, elem, name):
        for e, n, t, v, o in self.attrs:
            if e == elem and n == name:
                return (self.strings[v] if t == TYPE_STRING else v), t, o
        return None, None, None

    def set_int(self, elem, name, val):
        _, t, o = self.attr(elem, name)
        assert t is not None and t != TYPE_STRING, f"{elem}@{name} bukan int"
        struct.pack_into("<I", self.d, o + 4, val)

    def replace_string(self, old, new):
        """ganti rentetan dalam kolam — mesti sama panjang supaya susun atur tidak berubah"""
        assert len(old) == len(new), f"panjang mesti sama: {old!r} -> {new!r}"
        i = self.strings.index(old)
        p = self.str_off[i]
        self.d[p + 2:p + 2 + len(old) * 2] = new.encode("utf-16le")
        self.strings[i] = new


# ---------------------------------------------------------------- ZIP (dijajar)
def _dos(dt=(1981, 1, 1, 0, 0, 0)):
    y, mo, d, h, mi, s = dt
    return ((h << 11) | (mi << 5) | (s // 2)), (((y - 1980) << 9) | (mo << 5) | d)


def build_zip(entries):
    """entries: [(name, bytes, compress)] → bait zip; fail STORED dijajar 4 bait (zipalign)."""
    out = io.BytesIO()
    cd = []
    t, dte = _dos()
    for name, data, comp in entries:
        nb = name.encode()
        crc = zlib.crc32(data) & 0xFFFFFFFF
        if comp:
            c = zlib.compressobj(9, zlib.DEFLATED, -15)
            body = c.compress(data) + c.flush()
            method = 8
        else:
            body, method = data, 0
        off = out.tell()
        extra = b""
        if method == 0:
            pad = (4 - (off + 30 + len(nb)) % 4) % 4
            extra = b"\x00" * pad
        out.write(struct.pack("<IHHHHHIIIHH", 0x04034B50, 20, 0x0800, method, t, dte, crc, len(body), len(data), len(nb), len(extra)))
        out.write(nb + extra + body)
        cd.append(struct.pack("<IHHHHHHIIIHHHHHII", 0x02014B50, 20, 20, 0x0800, method, t, dte, crc, len(body), len(data),
                              len(nb), 0, 0, 0, 0, 0, off) + nb)
    cd_off = out.tell()
    cdb = b"".join(cd)
    out.write(cdb)
    out.write(struct.pack("<IHHHHIIH", 0x06054B50, 0, 0, len(cd), len(cd), len(cdb), cd_off, 0))
    return out.getvalue(), cd_off, len(cdb)


# ---------------------------------------------------------------- v2
V2_ID = 0x7109871A
ALG = 0x0103  # RSASSA-PKCS1-v1_5 + SHA2-256


def lp(b):
    return struct.pack("<I", len(b)) + b


def _chunks_digest(sections):
    dig = []
    for s in sections:
        for i in range(0, len(s), 1 << 20):
            c = s[i:i + (1 << 20)]
            dig.append(hashlib.sha256(b"\xa5" + struct.pack("<I", len(c)) + c).digest())
    return hashlib.sha256(b"\x5a" + struct.pack("<I", len(dig)) + b"".join(dig)).digest()


def load_key(path):
    from cryptography.hazmat.primitives import serialization
    from cryptography import x509
    raw = open(path, "rb").read()
    key = serialization.load_pem_private_key(raw, None)
    cert = x509.load_pem_x509_certificate(raw)
    return key, cert


def make_key(path, cn="Kediaman Isekai Waguri"):
    from cryptography.hazmat.primitives.asymmetric import rsa
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography import x509
    from cryptography.x509.oid import NameOID
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    nm = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, cn)])
    now = datetime.datetime(2026, 1, 1)
    cert = (x509.CertificateBuilder().subject_name(nm).issuer_name(nm).public_key(key.public_key())
            .serial_number(x509.random_serial_number()).not_valid_before(now)
            .not_valid_after(now + datetime.timedelta(days=365 * 30)).sign(key, hashes.SHA256()))
    with open(path, "wb") as f:
        f.write(key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.TraditionalOpenSSL,
                                  serialization.NoEncryption()))
        f.write(cert.public_bytes(serialization.Encoding.PEM))
    os.chmod(path, 0o600)


def sign_v2(zipb, cd_off, cd_len, key, cert):
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import padding
    ent = zipb[:cd_off]
    cdb = zipb[cd_off:cd_off + cd_len]
    eocd = bytearray(zipb[cd_off + cd_len:])
    # semasa mencerna, offset CD dalam EOCD = permulaan blok tandatangan (= cd_off)
    digest = _chunks_digest([ent, cdb, bytes(eocd)])
    certder = cert.public_bytes(serialization.Encoding.DER)
    signed = lp(lp(struct.pack("<I", ALG) + lp(digest))) + lp(lp(certder)) + lp(b"")
    sig = key.sign(signed, padding.PKCS1v15(), hashes.SHA256())
    pub = key.public_key().public_bytes(serialization.Encoding.DER, serialization.PublicFormat.SubjectPublicKeyInfo)
    signer = lp(signed) + lp(lp(struct.pack("<I", ALG) + lp(sig))) + lp(pub)
    val = lp(lp(signer))
    pair = struct.pack("<QI", 4 + len(val), V2_ID) + val
    size = len(pair) + 8 + 16
    block = struct.pack("<Q", size) + pair + struct.pack("<Q", size) + b"APK Sig Block 42"
    struct.pack_into("<I", eocd, 16, cd_off + len(block))
    return ent + block + cdb + bytes(eocd)


def verify_v2(apk):
    """semak bebas: cari blok, kira semula digest, sahkan tandatangan RSA"""
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import padding
    d = apk
    e = d.rfind(b"PK\x05\x06")
    cd_len, cd_off = struct.unpack_from("<II", d, e + 12)
    assert d[cd_off - 16:cd_off] == b"APK Sig Block 42", "tiada blok tandatangan"
    size = struct.unpack_from("<Q", d, cd_off - 24)[0]
    bstart = cd_off - size - 8
    p = bstart + 8
    v2 = None
    while p < cd_off - 24:
        ln, idv = struct.unpack_from("<QI", d, p)
        if idv == V2_ID:
            v2 = d[p + 12:p + 8 + ln]
        p += 8 + ln
    assert v2, "tiada blok v2"
    rd = lambda b, o: (b[o + 4:o + 4 + struct.unpack_from("<I", b, o)[0]], o + 4 + struct.unpack_from("<I", b, o)[0])
    signers, _ = rd(v2, 0)
    signer, _ = rd(signers, 0)
    signed, o = rd(signer, 0)
    sigs, o = rd(signer, o)
    pub, o = rd(signer, o)
    s1, _ = rd(sigs, 0)
    alg = struct.unpack_from("<I", s1, 0)[0]
    sig, _ = rd(s1, 4)
    k = serialization.load_der_public_key(pub)
    k.verify(sig, signed, padding.PKCS1v15(), hashes.SHA256())
    digs, _ = rd(signed, 0)
    d1, _ = rd(digs, 0)
    want, _ = rd(d1, 4)
    eocd = bytearray(d[e:])
    struct.pack_into("<I", eocd, 16, bstart)
    got = _chunks_digest([d[:bstart], d[cd_off:e], bytes(eocd)])
    assert got == want, "digest tidak sepadan"
    zipfile.ZipFile(io.BytesIO(d)).testzip()
    return alg


# ---------------------------------------------------------------- CLI
def cmd_info(a):
    x = Axml(open(a.manifest, "rb").read())
    for n in ("package", "versionCode", "versionName"):
        print(n, "=", x.attr("manifest", n)[0])
    for n in ("minSdkVersion", "targetSdkVersion"):
        print(n, "=", x.attr("uses-sdk", n)[0])


def cmd_build(a):
    sh = a.shell
    man = Axml(open(os.path.join(sh, "AndroidManifest.xml"), "rb").read())
    if a.version_code:
        man.set_int("manifest", "versionCode", a.version_code)
    if a.version_name:
        man.replace_string(man.attr("manifest", "versionName")[0], a.version_name)
    if a.package:
        man.replace_string(man.attr("manifest", "package")[0], a.package)
    files = [("AndroidManifest.xml", bytes(man.d), True)]
    for rel in ("classes.dex", "resources.arsc"):
        files.append((rel, open(os.path.join(sh, rel), "rb").read(), rel != "resources.arsc"))
    for root, _, fs in os.walk(os.path.join(sh, "res")):
        for f in sorted(fs):
            p = os.path.join(root, f)
            files.append((os.path.relpath(p, sh).replace(os.sep, "/"), open(p, "rb").read(), False))
    files.append(("assets/index.html", open(a.html, "rb").read(), True))
    if not os.path.exists(a.key):
        make_key(a.key)
        print("kunci baharu dijana:", a.key)
    key, cert = load_key(a.key)
    zb, co, cl = build_zip(files)
    apk = sign_v2(zb, co, cl, key, cert)
    open(a.out, "wb").write(apk)
    verify_v2(apk)
    print("OK", a.out, len(apk), "bait · sha256", hashlib.sha256(apk).hexdigest())


def cmd_verify(a):
    apk = open(a.apk, "rb").read()
    print("v2 OK, alg=0x%04x" % verify_v2(apk))
    z = zipfile.ZipFile(io.BytesIO(apk))
    x = Axml(z.read("AndroidManifest.xml"))
    for n in ("package", "versionCode", "versionName"):
        print(n, "=", x.attr("manifest", n)[0])


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sp = ap.add_subparsers(dest="c", required=True)
    p = sp.add_parser("info"); p.add_argument("manifest"); p.set_defaults(f=cmd_info)
    p = sp.add_parser("build")
    for k in ("shell", "html", "out", "key"):
        p.add_argument("--" + k, required=True)
    p.add_argument("--version-code", type=int)
    p.add_argument("--version-name")
    p.add_argument("--package")
    p.set_defaults(f=cmd_build)
    p = sp.add_parser("verify"); p.add_argument("apk"); p.set_defaults(f=cmd_verify)
    a = ap.parse_args()
    a.f(a)
