/* ===== V17 DUNIA (3): FLORA — pokok berinstans distrim ikut ketulan (pain, renek, meranti, buluh, kelapa, pain bersalji),
   batu, padang bunga, padi bukit, RUMPUT beralun dikitar semula di sekeliling pemain (object pooling) ===== */
(function () {
  'use strict';
  const W = window.W17, T = THREE;
  if (!W) return;
  const sm = W.sm;

  const mg = (parts) => {
    const Pp = [], Cc = [];
    parts.forEach(([g0, x, y, z, c, sx, sy, sz, rx, rz]) => {
      const g = g0.index ? g0.toNonIndexed() : g0.clone();
      const m = new T.Matrix4().compose(
        new T.Vector3(x, y, z),
        new T.Quaternion().setFromEuler(new T.Euler(rx || 0, 0, rz || 0)),
        new T.Vector3(sx || 1, sy || sx || 1, sz || sx || 1)
      );
      g.applyMatrix4(m);
      const p = g.attributes.position.array, cc = new T.Color(c);
      for (let i = 0; i < p.length; i += 3) {
        Pp.push(p[i], p[i + 1], p[i + 2]);
        /* gelap di bawah, cerah di atas (AO murah) */
        const k = 0.78 + 0.22 * Math.min(1, Math.max(0, (p[i + 1] - y + 1) / 3));
        Cc.push(cc.r * k, cc.g * k, cc.b * k);
      }
    });
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(Pp, 3));
    g.setAttribute('color', new T.Float32BufferAttribute(Cc, 3));
    g.computeVertexNormals();
    return g;
  };
  const q = W.q, D = q >= 3 ? 1 : 0;
  const CY = (a, b, h, s) => new T.CylinderGeometry(a, b, h, s, 1, true), CO = (r, h, s) => new T.ConeGeometry(r, h, s, 1, true),
    IC = (r) => new T.IcosahedronGeometry(r, D);
  const GEO = {
    pine: mg([[CY(0.17, 0.3, 2.8, 5), 0, 1.4, 0, 0x5a3d26], [CO(2.1, 3.4, 7), 0, 3.4, 0, 0x1d5a2a], [CO(1.65, 3, 7), 0, 5, 0, 0x246838], [CO(1.15, 2.6, 6), 0, 6.4, 0, 0x2c7641]]),
    snow: mg([
      [CY(0.17, 0.3, 2.8, 5), 0, 1.4, 0, 0x5a3d26], [CO(2.1, 3.4, 7), 0, 3.4, 0, 0x1d4a2e], [CO(1.75, 1.2, 7), 0, 4.55, 0, 0xf1f5f9],
      [CO(1.65, 3, 7), 0, 5, 0, 0x22583a], [CO(1.3, 1.1, 7), 0, 6, 0, 0xf8fafc], [CO(1.15, 2.6, 6), 0, 6.4, 0, 0x2a6340], [CO(0.7, 1.1, 6), 0, 7.4, 0, 0xffffff]
    ]),
    leaf: mg([[CY(0.22, 0.36, 3.4, 5), 0, 1.7, 0, 0x5e4128], [IC(1.9), 0, 4.6, 0, 0x3b8a32], [IC(1.5), 1.25, 4.1, 0.45, 0x327c2b], [IC(1.4), -1.15, 4.2, -0.5, 0x46993a], [IC(1.25), 0.2, 5.6, -0.3, 0x3f9234]]),
    tall: mg([[CY(0.28, 0.5, 7.5, 6), 0, 3.75, 0, 0x7a5a3a], [IC(2.6), 0, 8.6, 0, 0x2f7a2f], [IC(2), 1.8, 7.9, 0.4, 0x3a8834], [IC(1.9), -1.6, 8.1, -0.6, 0x286b2a], [IC(1.5), 0.3, 9.9, 0, 0x34802f]]),
    bush: mg([[IC(1), 0, 0.75, 0, 0x3a7f30], [IC(0.8), 0.75, 0.55, 0.3, 0x438c35], [IC(0.7), -0.6, 0.5, -0.25, 0x35762c]]),
    sakura: mg([[CY(0.2, 0.32, 3, 5), 0, 1.5, 0, 0x6b4a3a], [IC(1.7), 0, 4.1, 0, 0xf6a5c0], [IC(1.3), 1.1, 3.7, 0.4, 0xf9bcd1], [IC(1.2), -1, 3.8, -0.4, 0xee93b3]]),
    bamboo: (() => {
      const pa = [];
      for (let i = 0; i < 7; i++) {
        const a = i * 2.4, r = 0.25 + (i % 3) * 0.22, h = 6 + (i % 4) * 1.3;
        pa.push([CY(0.07, 0.09, h, 5), Math.cos(a) * r, h / 2, Math.sin(a) * r, i % 2 ? 0x7fa83a : 0x93b847, 1, 1, 1, Math.cos(a) * 0.08, Math.sin(a) * 0.08]);
        pa.push([CO(0.55, 1.6, 5), Math.cos(a) * r * 1.6, h - 0.2, Math.sin(a) * r * 1.6, 0x5c9a2e]);
      }
      return mg(pa);
    })(),
    kelapa: (() => {
      const pa = [[CY(0.16, 0.24, 7, 6), 0.4, 3.5, 0, 0x8a6a4a, 1, 1, 1, 0, -0.12]];
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * 6.283;
        pa.push([new T.BoxGeometry(0.5, 0.06, 2.6), 0.8 + Math.cos(a) * 1.2, 6.9, Math.sin(a) * 1.2, 0x3f8f2e, 1, 1, 1, 0.5 * Math.sin(a), -0.5 * Math.cos(a)]);
      }
      pa.push([IC(0.35), 0.8, 6.6, 0, 0x6b4a2a]);
      return mg(pa);
    })()
  };
  W.GEO = GEO;
  /* bahan pokok + angin (lebih kuat semasa ribut: W.wind) */
  W.windU = { value: 1 };
  const tm = new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.92, side: T.DoubleSide });
  tm.onBeforeCompile = (s) => {
    s.uniforms.uT = timeU;
    s.uniforms.uWd = W.windU;
    s.vertexShader =
      'uniform float uT;uniform float uWd;\n' +
      s.vertexShader.replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nfloat wv=max(position.y-1.6,0.)*.026*uWd;transformed.x+=sin(uT*(1.1+.5*uWd)+instanceMatrix[3].x*.13+instanceMatrix[3].z*.09)*wv;transformed.z+=cos(uT*.9+instanceMatrix[3].z*.11)*wv*.7;'
      );
  };
  W.treeMat = tm;

  /* ---------- penanaman ikut ketulan ---------- */
  const spc = 4.6 / Math.sqrt(W.tq.tree);
  const d3 = new T.Object3D(), cl = new T.Color();
  function plant(c) {
    const r = W.rng(9001 + c.i * 131 + c.j * 7919), byT = {}, cols = [];
    for (let x = c.x0; x < c.x1; x += spc)
      for (let z = c.z0; z < c.z1; z += spc) {
        const px = x + r() * spc, pz = z + r() * spc, d = W.FDr(px, pz);
        if (r() > d) continue;
        const h = W.H(px, pz);
        if (h > 56 || h < 1.2 || (pz < -276 && px > -486 && r() < 0.8)) continue; /* bukit pasir utara: jarang pokok */
        const sl = Math.abs(W.H(px + 1, pz) - W.H(px - 1, pz)) + Math.abs(W.H(px, pz + 1) - W.H(px, pz - 1));
        if (sl > 3.4) continue;
        const u = r();
        let ty;
        if (h > 33) ty = px < -490 ? (u < 0.8 ? 'snow' : 'pine') : u < 0.5 ? 'pine' : 'bush';
        else if (W.riverD(px, pz) < 12 && u < 0.45) ty = 'bamboo';
        else if (W.lakeD(px, pz) < 1.6 && u < 0.4) ty = 'kelapa';
        else if (pz < -196) ty = u < 0.5 ? 'pine' : u < 0.8 ? 'tall' : u < 0.9 ? 'leaf' : 'bush';
        else if (Math.hypot(px - W.F.meadow[0], pz - W.F.meadow[1]) < W.F.meadow[2] + 22 && u < 0.35) ty = 'sakura';
        else ty = u < 0.22 ? 'pine' : u < 0.58 ? 'leaf' : u < 0.8 ? 'tall' : 'bush';
        const s = (ty === 'bush' ? 0.8 : 0.85) + r() * 0.55;
        (byT[ty] = byT[ty] || []).push([px, h - 0.12, pz, s, r() * 6.28]);
        if (ty !== 'bush') cols.push({ x: px, z: pz, r: (ty === 'tall' ? 0.6 : 0.42) * s });
      }
    /* batu: dekat sungai, tebing & cerun */
    const rk = [];
    for (let k = 0; k < 26; k++) {
      const px = c.x0 + r() * (c.x1 - c.x0), pz = c.z0 + r() * (c.z1 - c.z0), rd = W.riverD(px, pz);
      const h = W.H(px, pz), sl = Math.abs(W.H(px + 1, pz) - W.H(px - 1, pz));
      if (W.nearRoad(px, pz, 2) || W.lakeD(px, pz) < 1) continue;
      if (!(rd < 5 && rd > 0) && sl < 0.9 && r() > 0.25) continue;
      rk.push([px, h, pz, 0.4 + r() * (rd < 5 ? 0.8 : 1.6)]);
    }
    c.flora = { byT, cols, rk, ims: [] };
  }
  function show(c) {
    const f = c.flora;
    Object.keys(f.byT).forEach((ty) => {
      const L = f.byT[ty], im = new T.InstancedMesh(GEO[ty], tm, L.length);
      L.forEach((t, i) => {
        d3.position.set(t[0], t[1], t[2]);
        d3.rotation.set(0, t[4], 0);
        d3.scale.setScalar(t[3]);
        d3.updateMatrix();
        im.setMatrixAt(i, d3.matrix);
        im.setColorAt(i, cl.setRGB(0.82 + Math.random() * 0.3, 0.85 + Math.random() * 0.28, 0.8 + Math.random() * 0.25));
      });
      im.castShadow = W.tq.shT && ty !== 'bush';
      im.receiveShadow = true;
      im.userData.v8 = 1;
      /* r128: InstancedMesh dicantas ikut sfera geometri → geometri ringan berkongsi atribut + sfera ketulan */
      const g = new T.BufferGeometry();
      for (const k in GEO[ty].attributes) g.setAttribute(k, GEO[ty].attributes[k]);
      g.boundingSphere = new T.Sphere(new T.Vector3(c.cx, 15, c.cz), 62);
      im.geometry = g;
      scene.add(im);
      f.ims.push(im);
    });
    if (f.rk.length) {
      const im = new T.InstancedMesh(new T.DodecahedronGeometry(1, 0), S(0x7c7f80), f.rk.length);
      f.rk.forEach((t, i) => {
        d3.position.set(t[0], t[1] - t[3] * 0.25, t[2]);
        d3.rotation.set(t[0], t[2], 0);
        d3.scale.set(t[3], t[3] * 0.62, t[3] * 1.1);
        d3.updateMatrix();
        im.setMatrixAt(i, d3.matrix);
      });
      im.castShadow = W.q >= 2;
      im.receiveShadow = true;
      im.userData.v8 = 1;
      const g = im.geometry;
      g.boundingSphere = new T.Sphere(new T.Vector3(c.cx, 10, c.cz), 62);
      scene.add(im);
      f.ims.push(im);
    }
    f.cols.forEach(W.addCol);
    f.on = 1;
  }
  function hide(c) {
    const f = c.flora;
    f.ims.forEach((m) => {
      scene.remove(m);
    });
    f.ims = [];
    f.cols.forEach(W.delCol);
    f.on = 0;
  }
  /* penstriman pokok: tanam ≤1 ketulan setiap bingkai */
  W.tick(() => {
    if (!W.chunks.length) return;
    let did = 0;
    for (const c of W.chunks) {
      if (c.d == null) continue;
      const want = c.d < W.tq.treeFar;
      if (want && !c.flora && !did) {
        plant(c);
        did = 1;
      }
      if (want && c.flora && !c.flora.on && !did) {
        show(c);
        did = 1;
      }
      if (!want && c.flora && c.flora.on && c.d > W.tq.treeFar + 60) hide(c);
    }
  });

  /* ---------- padang bunga + padi bukit (statik) ---------- */
  function meadow() {
    const F = W.F, N = W.tq.fl, r = W.rng(777);
    const g = new T.IcosahedronGeometry(0.13, 0);
    const st = new T.CylinderGeometry(0.015, 0.015, 0.45, 3);
    st.translate(0, -0.22, 0);
    const fm = new T.MeshStandardMaterial({ roughness: 0.7, emissive: 0x221111, emissiveIntensity: 0.25 });
    fm.onBeforeCompile = (s) => {
      s.uniforms.uT = timeU;
      s.vertexShader =
        'uniform float uT;\n' +
        s.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.x+=sin(uT*2.2+instanceMatrix[3].x*.7+instanceMatrix[3].z*.5)*.06;');
    };
    const im = new T.InstancedMesh(g, fm, N), ims = new T.InstancedMesh(st, S(0x3f8f2e), N);
    const pal = [0xff7aa8, 0xffffff, 0xffd34d, 0xc79bff, 0xff9f43, 0x7cc4ff, 0xff5a6e];
    let n = 0;
    for (let k = 0; k < N * 3 && n < N; k++) {
      const a = r() * 6.283, rr = Math.sqrt(r()) * (F.meadow[2] + 8), x = F.meadow[0] + Math.cos(a) * rr, z = F.meadow[1] + Math.sin(a) * rr;
      if (W.nearRoad(x, z, 0.8)) continue;
      const h = W.H(x, z);
      d3.position.set(x, h + 0.42 + r() * 0.15, z);
      d3.rotation.set(0, 0, 0);
      d3.scale.setScalar(0.8 + r() * 0.7);
      d3.updateMatrix();
      im.setMatrixAt(n, d3.matrix);
      ims.setMatrixAt(n, d3.matrix);
      im.setColorAt(n, cl.set(pal[(r() * pal.length) | 0]));
      n++;
    }
    im.count = ims.count = n;
    [im, ims].forEach((m) => {
      m.userData.v8 = 1;
      m.geometry.boundingSphere = new T.Sphere(new T.Vector3(F.meadow[0], F.plateau, F.meadow[1]), F.meadow[2] + 12);
      scene.add(m);
    });
    /* padi bukit */
    const pg = new T.ConeGeometry(0.09, 0.85, 3, 1, true);
    pg.translate(0, 0.42, 0);
    const pm = new T.MeshStandardMaterial({ color: 0x8fbf3a, roughness: 0.8, side: T.DoubleSide });
    pm.onBeforeCompile = fm.onBeforeCompile;
    const NP = [500, 900, 1500, 2200, 3000][W.q], ip = new T.InstancedMesh(pg, pm, NP);
    let m2 = 0;
    for (let k = 0; k < NP * 3 && m2 < NP; k++) {
      const x = F.farm[0] + (r() - 0.5) * 2.6 * F.farm[2], z = F.farm[1] + (r() - 0.5) * 2.6 * F.farm[3];
      if (Math.hypot((x - F.farm[0]) / F.farm[2], (z - F.farm[1]) / F.farm[3]) > 1.25 || W.nearRoad(x, z, 0.7)) continue;
      d3.position.set(x, W.H(x, z), z);
      d3.rotation.set((r() - 0.5) * 0.3, r() * 6, (r() - 0.5) * 0.3);
      d3.scale.set(1, 0.8 + r() * 0.5, 1);
      d3.updateMatrix();
      ip.setMatrixAt(m2, d3.matrix);
      ip.setColorAt(m2, cl.setHSL(0.2 + r() * 0.06, 0.6, 0.38 + r() * 0.1));
      m2++;
    }
    ip.count = m2;
    ip.userData.v8 = 1;
    ip.geometry.boundingSphere = new T.Sphere(new T.Vector3(F.farm[0], F.plateau, F.farm[1]), 40);
    scene.add(ip);
    W.padi = ip;
  }

  /* ---------- rumput dikitar semula (pool) ---------- */
  function grass() {
    const N = W.tq.grass;
    if (!N) return;
    const n = Math.floor(Math.sqrt(N)), s = W.q >= 3 ? 0.62 : 0.75;
    const g = new T.PlaneGeometry(0.12, 0.62, 1, 2);
    g.translate(0, 0.31, 0);
    {
      /* bilah: hujung tirus */
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) if (p.getY(i) > 0.6) p.setX(i, 0);
      /* normal menghala ke atas → bilah berwarna seperti tanah (tiada sisi gelap) */
      const nn = g.attributes.normal;
      for (let i = 0; i < nn.count; i++) nn.setXYZ(i, 0, 1, 0);
    }
    const m = new T.MeshStandardMaterial({ color: 0x6fc24a, roughness: 0.95, side: T.DoubleSide });
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uT = timeU;
      sh.uniforms.uWd = W.windU;
      sh.vertexShader =
        'uniform float uT;uniform float uWd;\n' +
        sh.vertexShader.replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\nfloat k=position.y*position.y*2.2;transformed.x+=sin(uT*(2.+uWd)+instanceMatrix[3].x*.6+instanceMatrix[3].z*.4)*.12*k*uWd;transformed.z+=cos(uT*1.6+instanceMatrix[3].x*.3)*.06*k*uWd;'
        );
    };
    const im = new T.InstancedMesh(g, m, n * n);
    im.instanceMatrix.setUsage(T.DynamicDrawUsage);
    im.userData.v8 = 1;
    im.frustumCulled = false;
    im.receiveShadow = true;
    scene.add(im);
    const hsh = (a, b) => {
      let h = (a * 374761393 + b * 668265263) | 0;
      h = (h ^ (h >>> 13)) * 1274126177;
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    };
    const setCell = (a, b) => {
      const ia = ((a % n) + n) % n, ib = ((b % n) + n) % n, k = ia * n + ib;
      const x = (a + hsh(a, b)) * s, z = (b + hsh(b, a)) * s;
      let ok = x < -216 && z < W.zEdge - 0.5 && !W.inCave;
      let h = 0;
      if (ok) {
        h = W.H(x, z);
        const fd = W.FDr(x, z);
        if (W.nearRoad(x, z, 0.4) || W.riverD(x, z) < 0.8 || W.lakeD(x, z) < 1.08 || h > 32 || fd > 0.85) ok = false;
        if (Math.hypot(x - W.F.village[0], z - W.F.village[1]) < W.F.village[2] - 10 || (W.inHouse && W.inHouse(x, z))) ok = false;
      }
      if (!ok) d3.scale.setScalar(0);
      else d3.scale.set(1, 0.45 + hsh(a + 7, b) * 0.55, 1);
      d3.position.set(x, h - 0.05, z);
      d3.rotation.set(0, hsh(a, b + 3) * 6.28, 0);
      d3.updateMatrix();
      im.setMatrixAt(k, d3.matrix);
      im.setColorAt(k, cl.setHSL(0.25 + hsh(b, a + 1) * 0.07, 0.55, 0.32 + hsh(a + 1, b) * 0.14));
    };
    let pcx = 1e9, pcz = 1e9;
    W.tick(() => {
      const inR = P.x < -200 && P.z < W.zEdge + 10;
      im.visible = inR && !W.inCave;
      if (!im.visible) return;
      const cx = Math.round(P.x / s), cz = Math.round(P.z / s);
      if (cx === pcx && cz === pcz) return;
      const h = n >> 1, ox0 = pcx - h, oz0 = pcz - h, nx0 = cx - h, nz0 = cz - h;
      for (let a = nx0; a < nx0 + n; a++) {
        const inX = a >= ox0 && a < ox0 + n;
        for (let b = nz0; b < nz0 + n; b++) if (!(inX && b >= oz0 && b < oz0 + n)) setCell(a, b);
      }
      pcx = cx;
      pcz = cz;
      im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
    });
  }

  /* kamera tidak terbenam dalam kanopi pokok: tarik kamera ke hadapan pokok yang menghalang (kawasan V17) */
  function camGuard() {
    const hd = new T.Vector3();
    W.tick(() => {
      if (W.inCave || !(P.x < -200 && P.z < W.zEdge + 10)) return;
      const c = camera.position;
      hd.set(P.x, P.y + 1.5, P.z);
      const dx = c.x - hd.x, dz = c.z - hd.z, L2 = dx * dx + dz * dz;
      if (L2 < 1) return;
      let best = 1;
      for (const o of W.colNear) {
        if (!(o.r > 0 && o.r < 1)) continue; /* pokok sahaja (bukan rumah) */
        const R = o.r * 4.4, ox = o.x - hd.x, oz = o.z - hd.z, t = (ox * dx + oz * dz) / L2;
        if (t < 0.1 || t > 1.05) continue;
        const ex = ox - t * dx, ez = oz - t * dz;
        if (ex * ex + ez * ez > R * R) continue;
        const y = hd.y + (c.y - hd.y) * t, base = W.H(o.x, o.z);
        if (y < base + 2.2) continue; /* di bawah kanopi (batang) — biar */
        const tc = Math.max(0.12, t - R / Math.sqrt(L2));
        if (tc < best) best = tc;
      }
      if (best < 1) c.set(hd.x + dx * best, hd.y + (c.y - hd.y) * best, hd.z + dz * best);
    });
  }

  when14(
    () => W.terOK && W.waterOK,
    () => {
      meadow();
      grass();
      camGuard();
      W.floraOK = 1;
    }
  );
})();
