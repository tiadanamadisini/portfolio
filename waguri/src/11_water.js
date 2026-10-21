/* ===== V17 DUNIA (2): AIR — sungai mengalir (shader aliran + buih), Tasik Biru, kolam & AIR TERJUN (tirai, buih, wap),
   berenang & menyelam dalam semua air baharu, jambatan kayu boleh dipijak ===== */
(function () {
  'use strict';
  const W = window.W17, T = THREE;
  if (!W) return;
  const sm = W.sm, lp = W.lp;

  /* bahan air: tahap Biasa = warna rata; Medium+ = alunan & buih; High+ = pantulan langit + kilauan */
  function waterMat(flow, base, op) {
    const fancy = W.tq.fancy, q = W.q;
    const m = new T.MeshStandardMaterial({
      color: base || 0x2f86e0,
      roughness: q >= 2 ? 0.08 : 0.2,
      metalness: q >= 2 ? 0.25 : 0.1,
      transparent: true,
      opacity: op || 0.88,
      side: T.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
      depthWrite: false
    });
    if (q >= 1) {
      m.onBeforeCompile = (s) => {
        s.uniforms.uT = timeU;
        s.vertexShader = s.vertexShader
          .replace('#include <common>', '#include <common>\nuniform float uT;varying vec2 vW;varying vec3 vWP;')
          .replace(
            '#include <begin_vertex>',
            '#include <begin_vertex>\nvW=uv;vec4 wp17=modelMatrix*vec4(transformed,1.);vWP=wp17.xyz;' +
              (fancy ? 'transformed.y+=sin(wp17.x*.55+uT*1.7)*.035+cos(wp17.z*.47-uT*1.3)*.03;' : '')
          );
        s.fragmentShader = s.fragmentShader
          .replace('#include <common>', '#include <common>\nuniform float uT;varying vec2 vW;varying vec3 vWP;')
          .replace(
            '#include <color_fragment>',
            '#include <color_fragment>\n' +
              (flow
                ? 'float fl=vW.y*.55-uT*' + (flow * 1.0).toFixed(2) + ';float sx=abs(vW.x-.5)*2.;' +
                  'float st=smoothstep(.72,1.,sin(fl*6.2832+sin(vW.x*9.+fl)*1.3)*.5+.5)*(.35+.65*smoothstep(.55,1.,sx));' +
                  'float bk=smoothstep(.78,1.,sx);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.86,.94,1.),clamp(st*.55+bk*.45,0.,1.));diffuseColor.a=mix(diffuseColor.a,1.,bk*.4);'
                : 'float rp=sin(vWP.x*.9+uT*1.1)*sin(vWP.z*.8-uT*.9);diffuseColor.rgb+=vec3(.05,.07,.08)*smoothstep(.55,1.,rp);') +
              (fancy ? 'vec3 vd17=normalize(cameraPosition-vWP);float fr=pow(1.-clamp(vd17.y,0.,1.),3.);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.72,.86,.98),fr*.45);' : '')
          );
      };
    }
    return m;
  }
  W.waterMat = waterMat;

  function riverMesh() {
    const R = W.RIV, LV = W.LV, P = [], U = [], I = [];
    /* cari air terjun: segmen dengan penurunan aras besar */
    const fall = [];
    for (let i = 1; i < R.n; i++) if (LV[i - 1] - LV[i] > 0.45 && Math.abs(R.Z[i] - W.esc(R.X[i])) < 9) fall.push(i);
    W.fallI = fall.length ? [fall[0] - 1, fall[fall.length - 1]] : null;
    let n = 0;
    for (let i = 0; i < R.n; i++) {
      if (W.fallI && i > W.fallI[0] && i < W.fallI[1]) {
        n = 0;
        continue;
      }
      if (W.lakeD(R.X[i], R.Z[i]) < 0.92) break;
      const [tx, tz] = R.tan(i), hw = W.RW(R.S[i]) / 2 + 0.6, x = R.X[i], z = R.Z[i], y = LV[i] + 0.02;
      P.push(x - tz * hw, y, z + tx * hw, x + tz * hw, y, z - tx * hw);
      U.push(0, R.S[i] / 4, 1, R.S[i] / 4);
      const k = P.length / 3 - 2;
      if (n) I.push(k - 2, k, k - 1, k - 1, k, k + 1);
      n++;
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(P, 3));
    g.setAttribute('uv', new T.Float32BufferAttribute(U, 2));
    g.setIndex(I);
    g.computeVertexNormals();
    const m = new T.Mesh(g, waterMat(1.6, 0x2f8be0, 0.86));
    m.receiveShadow = true;
    m.userData.v8 = 1;
    scene.add(m);
    W.riverM = m;
  }

  function lake() {
    const k = W.F.lake;
    const g = new T.CircleGeometry(1, 64);
    g.rotateX(-Math.PI / 2);
    const m = new T.Mesh(g, waterMat(0, 0x2a7fd0, 0.9));
    m.scale.set(k[2] * 1.12, 1, k[3] * 1.12);
    m.position.set(k[0], k[4], k[1]);
    m.receiveShadow = true;
    m.userData.v8 = 1;
    scene.add(m);
    W.lakeM = m;
    /* kolam air terjun */
    const p = W.F.pool, L = W.lvAt(W.RIV.q(p[0], p[1]));
    W.poolL = L;
    const m2 = new T.Mesh(g, waterMat(0, 0x3a9ae0, 0.9));
    m2.scale.set(p[2] * 1.35, 1, p[3] * 1.35);
    m2.position.set(p[0], L + 0.03, p[1]);
    m2.userData.v8 = 1;
    scene.add(m2);
  }

  /* ---------- AIR TERJUN ---------- */
  function fallTex() {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 256;
    const g = c.getContext('2d');
    /* legap di tengah, lut di tepi → tirai lembut, tebing tidak kelihatan rata di belakangnya */
    const hg = g.createLinearGradient(0, 0, 64, 0);
    hg.addColorStop(0, 'rgba(210,235,255,0)');
    hg.addColorStop(0.18, 'rgba(220,240,255,.78)');
    hg.addColorStop(0.5, 'rgba(235,246,255,.9)');
    hg.addColorStop(0.82, 'rgba(220,240,255,.78)');
    hg.addColorStop(1, 'rgba(210,235,255,0)');
    g.fillStyle = hg;
    g.fillRect(0, 0, 64, 256);
    for (let i = 0; i < 260; i++) {
      const x = Math.random() * 64, y = Math.random() * 256, l = 20 + Math.random() * 60;
      g.strokeStyle = Math.random() < 0.3 ? 'rgba(150,190,225,' + (0.25 + Math.random() * 0.35) + ')' : 'rgba(255,255,255,' + (0.35 + Math.random() * 0.6) + ')';
      g.lineWidth = 1 + Math.random() * 2.5;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + (Math.random() - 0.5) * 2, y + l);
      g.stroke();
    }
    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    return t;
  }
  function puff() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 2, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,.9)');
    gr.addColorStop(0.5, 'rgba(240,248,255,.35)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    return new T.CanvasTexture(c);
  }
  W.puff = puff;
  function waterfall() {
    if (!W.fallI) return;
    const R = W.RIV, LV = W.LV, a = W.fallI[0], b = W.fallI[1];
    const top = [R.X[a], LV[a], R.Z[a]], bot = [R.X[b], W.poolL || LV[b], R.Z[b]];
    W.F.fall = [top[0], top[2]];
    const hgt = top[1] - bot[1] + 0.6, wd = W.RW(R.S[a]) + 1.2, [tx, tz] = R.tan(a);
    W.fallInfo = { top, bot, hgt, wd };
    const tex = fallTex();
    tex.repeat.set(1, Math.max(1, hgt / 6));
    const mat = new T.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.92, depthWrite: false, side: T.DoubleSide, color: 0xe8f6ff });
    /* tirai: pada setiap ketinggian, tolak ke hadapan sehingga berada DI HADAPAN muka tebing (bukan terbenam);
       berhenti di titik hentaman pertama dengan tanah (aliran diteruskan sungai ke kolam) */
    const seg = 18, PP = [], U = [], I = [];
    let outP = 0, yEnd = bot[1];
    const hAt = (s2, wdt) => {
      let hmax = -1e9;
      for (const l of [-0.3, 0, 0.3]) hmax = Math.max(hmax, W.H(top[0] + tx * s2 - tz * l * wdt, top[2] + tz * s2 + tx * l * wdt));
      return hmax;
    };
    const clearAt = (y, wdt) => {
      for (let s2 = outP; s2 < outP + 6; s2 += 0.12) if (hAt(s2, wdt) < y - 0.3) return s2 + 0.25;
      return null;
    };
    const row = (out, y, t, wdt) => {
      for (let i = 0; i <= 1; i++) {
        const s2 = (i - 0.5) * wdt;
        PP.push(top[0] - tz * s2 + tx * out, y, top[2] + tx * s2 + tz * out);
        U.push(i, t * 2);
      }
      const k = PP.length / 3 - 2;
      if (k >= 2) I.push(k - 2, k, k - 1, k - 1, k, k + 1);
    };
    for (let j = 0; j <= seg; j++) {
      const t = j / seg, y = top[1] + 0.25 - t * hgt, wdt = wd * (1 + 0.22 * t);
      const c = clearAt(y, wdt);
      if (c == null || (j > 1 && c - outP > 1.2)) {
        /* hentam tanah: baris terakhir tepat di permukaan */
        yEnd = hAt(outP, wdt) + 0.08;
        row(outP, yEnd, t, wdt);
        break;
      }
      outP = Math.max(outP, c);
      yEnd = y;
      row(outP, y, t, wdt);
    }
    /* kaki tirai sebenar → buih & wap di situ */
    const base = [top[0] + tx * outP, yEnd, top[2] + tz * outP];
    W.fallInfo.base = base;
    W.fallInfo.dir = [tx, tz];
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(PP, 3));
    g.setAttribute('uv', new T.Float32BufferAttribute(U, 2));
    g.setIndex(I);
    const m = new T.Mesh(g, mat);
    /* tiada renderOrder: diisih ikut jarak bersama sprite telus lain (elak 'potongan' segi empat) */
    m.userData.v8 = 1;
    scene.add(m);
    /* lapisan kedua lebih pantas (kedalaman) — High ke atas */
    let m2 = null;
    if (W.q >= 2) {
      const t2 = tex.clone();
      t2.needsUpdate = true;
      m2 = new T.Mesh(g, new T.MeshBasicMaterial({ map: t2, transparent: true, opacity: 0.55, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending }));
      m2.scale.set(1, 1, 1);
      scene.add(m2);
    }
    /* buih di kaki air terjun */
    const fm = new T.Mesh(new T.RingGeometry(0.5, 1, 24), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, depthWrite: false }));
    fm.rotation.x = -Math.PI / 2;
    fm.position.set(base[0] + tx * 0.6, base[1] + 0.06, base[2] + tz * 0.6);
    fm.scale.setScalar(wd * 0.7);
    scene.add(fm);
    /* wap / percikan */
    const NM = W.tq.mist, pm = new T.SpriteMaterial({ map: puff(), transparent: true, depthWrite: false, opacity: 0.5 }), ps = [];
    for (let i = 0; i < NM; i++) {
      const s = new T.Sprite(pm);
      s.userData = { t: Math.random(), sp: 0.15 + Math.random() * 0.25, ox: (Math.random() - 0.5) * wd * 1.4, oz: Math.random() * 3 };
      scene.add(s);
      ps.push(s);
    }
    W.fallM = m;
    W.tick((dt) => {
      const d = Math.hypot(P.x - top[0], P.z - top[2]), vis = d < 260;
      m.visible = vis;
      if (m2) m2.visible = vis;
      fm.visible = vis;
      if (!vis) {
        ps.forEach((s) => (s.visible = false));
        return;
      }
      tex.offset.y -= dt * 1.15;
      if (m2) m2.material.map.offset.y -= dt * 1.8;
      const k = 1 + Math.sin(W.now / 300) * 0.06;
      fm.scale.setScalar(wd * 0.7 * k);
      fm.material.opacity = 0.45 + 0.15 * Math.sin(W.now / 230);
      ps.forEach((s) => {
        const u = s.userData;
        u.t += dt * u.sp;
        if (u.t > 1) u.t -= 1;
        s.visible = d < 140;
        const r = u.t;
        s.position.set(base[0] + tx * (0.6 + u.oz) - tz * u.ox * (1 + r), base[1] + 0.3 + r * 6, base[2] + tz * (0.6 + u.oz) + tx * u.ox * (1 + r));
        s.scale.setScalar(1.4 + r * 4.5);
        s.material.opacity = 0.42;
      });
    });
  }

  /* ---------- jambatan (boleh dipijak: W8.dk) ---------- */
  function bridges() {
    (W.BRIDGES || []).forEach((b, k) => {
      const dx = b.x1 - b.x0, dz = b.z1 - b.z0, L = Math.hypot(dx, dz) + 1.2, ax = dx / (L - 1.2), az = dz / (L - 1.2),
        cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2, Wd = b.w;
      const h0 = b.y0, h1 = b.y1, g = new T.Group();
      g.rotation.order = 'YXZ';
      g.rotation.y = Math.atan2(ax, az);
      g.rotation.x = -Math.atan2(h1 - h0, L);
      g.position.set(cx, (h0 + h1) / 2, cz);
      const wd = S(0x8a5a2b), wd2 = S(0x5e3f22), pl = S(0xb07d45);
      add(g, B(Wd, 0.3, L), pl, 0, 0, 0);
      for (let s = -L / 2 + 0.45; s < L / 2; s += 0.9) add(g, B(Wd + 0.04, 0.05, 0.07), wd2, 0, 0.16, s, false);
      [-1, 1].forEach((sd) => {
        add(g, B(0.2, 0.3, L + 0.2), wd, sd * (Wd / 2 - 0.1), 0.25, 0);
        add(g, B(0.14, 0.12, L + 0.2), wd, sd * (Wd / 2 - 0.1), 1.08, 0);
        for (let s = -L / 2 + 0.2; s <= L / 2 + 0.01; s += (L - 0.4) / Math.max(2, Math.round(L / 2.2))) add(g, B(0.18, 1, 0.18), wd, sd * (Wd / 2 - 0.1), 0.62, s);
        /* tiang ke dasar sungai */
        for (const f of [-0.22, 0.22]) {
          const px = sd * (Wd / 2 - 0.3), hh = 4;
          add(g, new T.CylinderGeometry(0.2, 0.24, hh, 7), wd2, px, -hh / 2, f * L);
        }
      });
      scene.add(g);
      W8.merge(g);
      const nm = b.road === 'Jalan Celah Timur' ? 'Jambatan Kampung Timur' : 'Jambatan Tasik';
      W8.dk.push({ cx, cz, ax, az, L, W: Wd, h0, h1, name: nm });
      W.lab(nm, cx, Math.max(h0, h1) + 3.2, cz, '🌉');
      b.name = nm;
    });
  }

  /* ---------- berenang dalam air baharu (gY2 paling luar) ---------- */
  function swim() {
    const _g = window.gY2;
    window.gY2 = function (x, z) {
      if (!(x < -216 && z < W.RG.z1) || W.inCave) return _g(x, z);
      if (!zb) {
        const b = W8.onDk ? W8.onDk(x, z) : null;
        if (b != null) {
          W4.sw = false;
          return b;
        }
      }
      const h = W.H(x, z);
      let L = null;
      if (W.lakeD(x, z) < 1.12) L = W.F.lake[4];
      else {
        const p = W.F.pool;
        if (Math.hypot((x - p[0]) / p[2], (z - p[1]) / p[3]) < 1.3) L = W.poolL;
        else {
          const q = W.RIV.q(x, z);
          if (q && q.d < W.RW(W.RIV.v(W.RIV.S, q)) / 2 + 0.5) L = W.lvAt(q);
        }
      }
      if (L != null && L - h > 0.95 && !zb) {
        W4.sw = true;
        W4.wl = L;
        /* menyelam: tahan butang lompat semasa berenang tidak diperlukan — kamera turun bila dalam */
        return L - 0.9;
      }
      W4.sw = false;
      return h;
    };
  }

  when14(
    () => W.terOK && W.LV,
    () => {
      riverMesh();
      lake();
      waterfall();
      bridges();
      swim();
      W.waterOK = 1;
    }
  );
})();
