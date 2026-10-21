/* ===== V17 QUEST: enjin langkah-demi-langkah + kandungan Lembah Timur =====
   jenis langkah: talk · give · visit (boleh bersyarat masa) · ev (kiraan peristiwa) · choice (pilihan dengan kesan) · cond
   📖 BAB TIMUR "Air Terjun yang Membisu" (7 misi utama + pratonton Bab seterusnya)
   ❗ 8 misi sampingan (mekanik berbeza) · 🌍 4 peristiwa dunia · 🔮 1 misi tersembunyi · 🗝 6 lokasi rahsia
   setiap misi: cerita · objektif · lokasi · syarat · cabaran · ganjaran · kesan pada dunia (jadual NPC, kincir, ekonomi, reputasi) */
(function () {
  'use strict';
  const W = window.W17, T = THREE;
  if (!W) return;
  const R = () => window.RPG14;
  const S7 = () => {
    const s = (GS.v17 = GS.v17 || {});
    s.q = s.q || {};
    s.sec = s.sec || {};
    s.evd = s.evd || {};
    return s;
  };
  const qs = (id) => (S7().q[id] = S7().q[id] || { s: 0, step: 0, pg: 0 });
  const hour = () => (6 + (GS.t || 0) / 75) % 24;
  const night = () => hour() >= 19.5 || hour() < 5;
  const nm = (id) => W.nameOf(id);
  const sp = (k) => W.SPOTS[k];
  const have = (k, n) => (GS.inv[k] || 0) >= n;
  const take = (o) => Object.keys(o).forEach((k) => (GS.inv[k] -= o[k]));
  const icn = (k) => (typeof IC !== 'undefined' && IC[k]) || (IT[k] && IT[k][0]) || k;
  const needTxt = (o) => Object.keys(o).map((k) => icn(k) + ' ' + Math.min(GS.inv[k] || 0, o[k]) + '/' + o[k]).join(' · ');

  /* ---------- definisi ---------- */
  const Q = [];
  const def = (o) => (Q.push(o), o);
  /* === BAB TIMUR (utama) === */
  def({ id: 'm1', k: 'main', t: 'Celah Gunung', giver: 'ketua', lv: 12, d: 'Gempa bulan lepas membuka laluan di sebalik dinding gunung barat. Tok Ketua mahu tahu siapa yang tinggal di seberang.',
    steps: [{ ty: 'visit', at: [-222, -14], r: 8, d: 'Pergi ke 🪧 Celah Gunung (hujung barat Laluan Hutan Jauh)' }, { ty: 'visit', at: [-316, -146], r: 14, d: 'Ikut jalan ke 🏘 Kampung Timur di atas air terjun' }, { ty: 'talk', npc: 'hamzah', d: 'Berjumpa Tok Penghulu Hamzah (Balai Raya)', say: 'Orang luar… Sudah 30 tahun tiada siapa melintasi Celah Gunung. Kalau kamu berniat baik, buktikan dengan membantu orang kampung kami.' }],
    rw: { xp: 8, coin: 150, rep: 5 } });
  def({ id: 'm2', k: 'main', t: 'Orang Asing di Kampung', giver: 'hamzah', lv: 12, req: ['m1'], d: 'Tok Penghulu masih curiga. Dengar cerita Nek Jah dan bantu Pak Long Kidam membaiki Kincir Air yang mengairi ladang.',
    steps: [{ ty: 'talk', npc: 'nekjah', d: 'Dengar cerita Nek Jah (dataran / telaga)', say: 'Dahulu, air terjun ini bernyanyi siang dan malam. Lalu datang <b>Kelembai Batu</b> — gergasi yang menyumpah apa sahaja yang ditegurnya menjadi batu. Dia tidur di perut gunung, di belakang tirai air. Sejak dia bergerak semula… air terjun makin senyap.' },
      { ty: 'give', npc: 'kidam', need: { wood: 8 }, d: 'Serah 8 🪵 kayu kepada Pak Long Kidam untuk bilah kincir', say: 'Kayu! Bagus! Bilah lama dah reput. Sekejap… *tuk tuk tuk* … Ha! Berpusing semula!' },
      { ty: 'talk', npc: 'hamzah', d: 'Lapor kepada Tok Penghulu', say: 'Kincir berpusing, padi akan berair. Baiklah… aku mula percaya pada kamu. Tapi Bujang bawa khabar buruk — pergilah jumpa dia.' }],
    rw: { xp: 9, coin: 180, rep: 10, aff: { kidam: 15, hamzah: 8 } }, done: () => W.flag('kincir', 1) });
  def({ id: 'm3', k: 'main', t: 'Bisikan Air Terjun', giver: 'hamzah', lv: 13, req: ['m2'], d: 'Bujang si pemburu ternampak sesuatu di Wakaf Tebing pada waktu malam. Siasat sendiri.',
    steps: [{ ty: 'talk', npc: 'bujang', d: 'Bercakap dengan Bujang (pondok pemburu / ladang)', say: 'Jejak babi makin banyak. Dan malam tadi… mata merah di balik air terjun. Pergi ke Wakaf Tebing waktu malam. Tengok sendiri.' },
      { ty: 'visit', at: 'wakaf', r: 7, night: 1, d: 'Pergi ke ⛩ Wakaf Tebing pada waktu MALAM (19:30–05:00)', onDone: () => W.eyes(true) },
      { ty: 'talk', npc: 'bujang', d: 'Beritahu Bujang apa yang kamu nampak', say: 'Dua mata. Merah. Bergerak bersama gegaran. Itu bukan haiwan. Tapi sebelum itu — babi Taring Besi akan menyerang ladang. Bersedia.' }],
    rw: { xp: 10, coin: 200, rep: 5, aff: { bujang: 12 } } });
  def({ id: 'm4', k: 'main', t: 'Taring Besi', giver: 'seman', lv: 14, req: ['m3'], d: 'Kawanan babi hutan diketuai Raja Taring Besi akan menyerbu ladang padi. Bujang mahu memburu; Pak Seman mahu pagar duri. Pilihan kamu.',
    steps: [{ ty: 'choice', npc: 'seman', d: 'Bincang strategi dengan Pak Seman (ladang)', q: 'Bujang kata kita patut serang dahulu dan hapuskan semua. Aku pula rasa pagar duri cukup untuk lindungi padi. Kamu fikir bagaimana?',
      opts: [['⚔️ Serang dahulu (ikut Bujang)', () => { W.flag('m4', 'serang'); W.aff('bujang', 10); W.aff('seman', -3); W.remember('bujang', 'm4_serang'); }],
        ['🪵 Bina pagar duri (ikut Pak Seman)', () => { W.flag('m4', 'pagar'); W.aff('seman', 10); W.aff('bujang', -3); W.remember('seman', 'm4_pagar'); }]] },
      { ty: 'give', npc: 'seman', need: { wood: 10, batu: 5 }, skip: () => W.flag('m4') !== 'pagar', d: 'Serah 10 🪵 kayu & 5 🪨 batu kepada Pak Seman untuk pagar duri', say: 'Pagar duri siap! Babi biasa takkan lepas. Tapi raja mereka… itu tugas kamu.' },
      { ty: 'cond', d: 'Tunggu malam di 🌾 ladang — serbuan bermula (19:30+)', at: 'ladang', test: () => night() && Math.hypot(P.x - sp('ladang')[0], P.z - sp('ladang')[1]) < 40, onDone: () => W.evt.force('babi', { boss: 1 }) },
      { ty: 'ev', k: 'raid_win', n: 1, d: 'Pertahankan ladang! Tewaskan kawanan & 👑 Raja Taring Besi', at: 'ladang' },
      { ty: 'talk', npc: 'seman', d: 'Kembali kepada Pak Seman', say: 'Ladang selamat! Padi kami selamat! Seluruh kampung terhutang budi.' }],
    rw: { xp: 14, coin: 400, rep: 15, aff: { seman: 10, limah: 10 }, it: { beras: 10 } }, done: () => { W.flag('ladang', W.flag('m4') === 'pagar' ? 'pagar' : 'bebas'); W.flag('beras17', 1); } });
  def({ id: 'm5', k: 'main', t: 'Tiga Kristal', giver: 'nekjah', lv: 16, req: ['m4'], d: 'Nek Jah: "Pintu ke tempat tidur Kelembai dikunci tiga kristal. Hanya cahaya yang boleh membukanya." Masuk Gua Tirai Air di belakang air terjun.',
    steps: [{ ty: 'ev', k: 'enter_cave', n: 1, d: 'Masuk 🕳 Gua Tirai Air (kaki tebing, belakang air terjun)', at: 'cave' }, { ty: 'ev', k: 'crystal_all', n: 1, cum: 1, d: 'Nyalakan ketiga-tiga 💎 kristal di Bilik Kristal', inCave: 1 }],
    rw: { xp: 14, coin: 300, rep: 5 } });
  def({ id: 'm6', k: 'main', t: 'Kelembai Batu', giver: null, lv: 18, req: ['m5'], auto: 1, d: 'Pintu batu terbuka. Gergasi yang menyumpah air terjun menunggu di dalam.',
    steps: [{ ty: 'ev', k: 'boss_kelembai', n: 1, cum: 1, d: 'Tewaskan 🗿 KELEMBAI BATU di arena gua (disyorkan Lv 22+, guna 🌀 elak & 🛡 tangkis!)', inCave: 1 }, { ty: 'talk', npc: 'nekjah', d: 'Khabarkan berita kepada Nek Jah', say: 'Kamu… kamu tewaskan Kelembai?! Dengar tu, cu… air terjun bernyanyi semula. Nenek ingat bunyi ini sejak kecil…' }],
    rw: { xp: 30, coin: 1200, rep: 25, aff: { nekjah: 20, azlan: 15 }, it: { tonik: 3 } }, done: () => { W.flag('fall', 1); W.flag('fest', GS.day); W.fallSing && W.fallSing(); } });
  def({ id: 'm7', k: 'main', t: 'Pesta Air Terjun', giver: 'hamzah', lv: 18, req: ['m6'], d: 'Seluruh kampung meraikan malam ini di dataran. Tok Penghulu mahu bercakap dengan kamu di hadapan semua orang.',
    steps: [{ ty: 'cond', d: 'Sertai pesta di 🌳 dataran (malam ini 19:00–23:30)', at: 'dataran', test: () => hour() >= 19 && hour() < 23.5 && Math.hypot(P.x - sp('dataran')[0], P.z - sp('dataran')[1]) < 16 },
      { ty: 'talk', npc: 'hamzah', d: 'Dengar ucapan Tok Penghulu', say: 'Wahai orang kampung! Waguri telah mengembalikan suara air terjun kita. Mulai hari ini, dia ialah <b>Sahabat Kampung Timur</b>. Pintu setiap rumah terbuka untuknya!' }],
    rw: { xp: 16, coin: 600, rep: 20 }, done: () => W.flag('sahabat', 1) });
  def({ id: 'm8', k: 'main', t: 'Surat ke Kerajaan (Bab seterusnya)', giver: 'hamzah', lv: 22, req: ['m7'], d: 'Tok Penghulu menulis surat kepada Raja di Kerajaan. Jalan ke barat masih tertutup runtuhan — akan dibuka dalam kemas kini seterusnya.',
    steps: [{ ty: 'cond', d: '🔒 Akan datang: wilayah Kerajaan (fasa pembangunan seterusnya)', test: () => false }], rw: { xp: 0, coin: 0 } });
  /* === SAMPINGAN === */
  def({ id: 's1', k: 'side', t: 'Angan-angan Mat Jenin', giver: 'matjenin', lv: 12, d: 'Mat Jenin mahu menjual kelapa untuk "memulakan empayar". Kutip kelapa daripada pokok berbuah di tepi Tasik Biru.',
    steps: [{ ty: 'ev', k: 'kelapa17', n: 5, d: 'Kutip 5 🥥 kelapa dari pokok berbuah (tepi Tasik Biru)', at: [-436, 40] },
      { ty: 'choice', npc: 'matjenin', d: 'Serah kelapa kepada Mat Jenin', q: 'Lima kelapa! Jual jadi duit, duit beli ayam, ayam bertelur, telur jadi ladang, ladang jadi… Eh, kau rasa aku patut kerja keras atau teruskan berangan?',
      opts: [['💪 "Kerja keras, Mat."', () => { W.flag('mj', 'kerja'); W.aff('matjenin', 6); W.aff('hamzah', 4); W.remember('matjenin', 'mj_kerja'); }], ['✨ "Angan-angan pun penting!"', () => { W.flag('mj', 'angan'); W.aff('matjenin', 12); W.remember('matjenin', 'mj_angan'); }]] }],
    rw: { xp: 6, coin: 90 } });
  def({ id: 's2', k: 'side', t: 'Kembar Nakal', giver: 'aminah', lv: 12, d: 'Loceng kelas Cikgu Aminah hilang. Kembar Haris dan Harun nampak gelisah… Cari petunjuk di sekitar kampung.',
    steps: [{ ty: 'ev', k: 'clue', n: 3, d: 'Cari 3 petunjuk 🔍 (bawah rumah Nek Jah, tepi telaga, Pokok Beringin)' }, { ty: 'ev', k: 'bell', n: 1, d: 'Ambil 🔔 loceng di persembunyian Geng Beringin (belakang Balai Raya)' },
      { ty: 'choice', npc: 'aminah', d: 'Pulangkan loceng kepada Cikgu Aminah', q: 'Loceng saya! Di mana kamu jumpa? Siapa yang ambil?',
      opts: [['🗣 "Haris dan Harun yang sorok."', () => { W.aff('aminah', 8); W.aff('haris', -10); W.aff('harun', -6); W.remember('haris', 'bell_told'); W.remember('harun', 'bell_told'); }], ['🤐 "Saya jumpa di tepi jalan."', () => { W.aff('haris', 12); W.aff('harun', 12); W.rep(3); W.remember('haris', 'bell_kept'); W.remember('harun', 'bell_kept'); }]] }],
    rw: { xp: 6, coin: 80 }, pre: () => { GS.inv.loceng = GS.inv.loceng || 0; } });
  def({ id: 's3', k: 'side', t: 'Herba Embun Pagi', giver: 'kalsom', lv: 13, d: 'Bunga embun hanya mekar ketika subuh (05:00–09:00) di Padang Bunga. Bidan Kalsom memerlukannya untuk ubat demam kanak-kanak.',
    steps: [{ ty: 'give', npc: 'kalsom', need: { embun: 4 }, d: 'Petik 4 💧 bunga embun di 🌸 Padang Bunga (05:00–09:00 sahaja) & serah kepada Bidan Kalsom', at: 'padang', say: 'Segar lagi! Ubat ini akan menyelamatkan Adik Puteri yang demam. Ambil ubat ini sebagai tanda terima kasih.' }],
    rw: { xp: 7, coin: 120, it: { ubat: 3 }, aff: { kalsom: 10, dayang: 6, puteri: 6 } } });
  def({ id: 's4', k: 'side', t: 'Ikan Raja Tasik', giver: 'daud', lv: 13, d: 'Abang Daud bertaruh kamu tak boleh tewaskan rekodnya: 4 ekor ikan di Tasik Biru, termasuk seekor ikan jarang ⭐.',
    steps: [{ ty: 'ev', k: 'fish_tasik', n: 4, d: 'Pancing 4 ekor ikan di 💧 Tasik Biru (jeti)', at: 'jeti' }, { ty: 'ev', k: 'fish_tasik_rare', n: 1, d: 'Pancing seekor ikan jarang ⭐ di Tasik Biru (hujan membantu!)', at: 'jeti' }, { ty: 'talk', npc: 'daud', d: 'Tunjukkan hasil kepada Abang Daud', say: 'Ha ha! Kau kalahkan aku! Okay, okay — ambil umpan istimewa aku. Jangan bagitahu Kak Yati aku kalah!' }],
    rw: { xp: 7, coin: 110, it: { umpan: 15 }, aff: { daud: 12 } } });
  def({ id: 's5', k: 'side', t: 'Benang Emas Songket', giver: 'tijah', lv: 14, d: 'Songket diraja Kak Tijah memerlukan benang emas. Mak Senah ada stok — dengan harga.',
    steps: [{ ty: 'give', npc: 'tijah', need: { benang: 3 }, d: 'Beli 3 🧵 benang emas di Kedai Runcit Mak Senah & serah kepada Kak Tijah', say: 'Cukup! Malam ini juga Kak Tijah dan Kak Yati siapkan bunga terakhir. Nah — selendang songket ini untuk kamu.' }],
    rw: { xp: 8, coin: 60, it: { selendang: 1 }, aff: { tijah: 12, yati: 8 } }, done: () => W.flag('songket', 1) });
  def({ id: 's6', k: 'side', t: 'Ronda Malam', giver: 'leman', lv: 15, d: 'Pak Usu Leman mahu teman meronda: periksa 4 tiang tanglung di pinggir kampung pada waktu malam.',
    steps: [{ ty: 'ev', k: 'ronda', n: 4, d: 'Periksa 4 🏮 tanglung ronda (pinggir kampung) pada waktu MALAM', night: 1 }, { ty: 'ev', k: 'kill17_kumbang', n: 1, d: 'Harimau kumbang menghendap! Tewaskan 🐆 seekor', fx: () => W.mkFoe('kumbang', W.F.village[0] - 52, W.F.village[1] - 44, 18) }, { ty: 'talk', npc: 'leman', d: 'Lapor kepada Pak Usu Leman (Menara Tinjau)', say: 'Fuh! Aku… aku tak takut pun. Cuma… terima kasih, kawan. Malam ini aku janji tak tidur di menara.' }],
    rw: { xp: 9, coin: 160, rep: 6, aff: { leman: 12, senah: 3 } } });
  def({ id: 's7', k: 'side', t: 'Kulit untuk Wayang', giver: 'wahab', lv: 14, d: 'Patung Hanuman Tok Dalang Wahab sudah koyak. Bawa kulit haiwan supaya persembahan malam keempat dapat diteruskan.',
    steps: [{ ty: 'give', npc: 'wahab', need: { kulit: 3 }, d: 'Serah 3 🟫 kulit haiwan kepada Tok Dalang Wahab', say: 'Kulit yang bagus! Hanuman baru akan menari malam ini. Datanglah menonton di Balai Raya (malam ke-4 setiap minggu, 20:00).' },
      { ty: 'cond', d: 'Tonton 🎭 wayang kulit di Balai Raya (hari ke-4 minggu, 20:00–22:30)', at: 'balai', test: () => (GS.day || 1) % 7 === 4 && hour() >= 20 && hour() < 22.5 && Math.hypot(P.x - sp('balai')[0], P.z - sp('balai')[1]) < 14 }],
    rw: { xp: 8, coin: 120, rep: 5, aff: { wahab: 14, nekjah: 4 } } });
  def({ id: 's8', k: 'side', t: 'Besi dari Perut Gua', giver: 'tahir', lv: 16, d: 'Pak Tahir boleh menempa senjata lebih tajam — dan sebatang tombak — jika ada bijih besi dari dalam gua.',
    steps: [{ ty: 'give', npc: 'tahir', need: { bijih: 5 }, d: 'Lombong 5 🪨 bijih besi di Lorong Sempit Gua Tirai Air & serah kepada Pak Tahir', say: 'Bijih gua! Lihat kilaunya… Mulai hari ini aku boleh naik taraf senjata kau, dan tempa 🔱 Tombak Buluh Besi.' }],
    rw: { xp: 9, coin: 200, aff: { tahir: 14, azlan: 6 } }, done: () => W.flag('tempa', 1) });
  /* === TERSEMBUNYI === */
  def({ id: 'h1', k: 'hidden', t: 'Kuil yang Dilupakan', giver: null, lv: 15, hidden: 1, d: 'Tulisan pada tiang kuil lama: "Tiga batu menyimpan nama penjaga — di puncak helang, di tengah air, di sarang kelawar."',
    steps: [{ ty: 'ev', k: 'tablet', n: 3, cum: 1, d: 'Cari 3 🗿 batu bersurat (puncak helang · tengah air · sarang kelawar)' }, { ty: 'visit', at: [-426, -262], r: 6, d: 'Kembali ke ⛩ kuil lama & letakkan batu bersurat' }],
    rw: { xp: 18, coin: 700, rep: 5 }, done: () => { W.flag('azimat', 1); tip('🔮 Azimat Penjaga Lembah: ❤️ nyawa maksimum +10% (kekal)'); } });
  W.QDEF = Q;

  /* ---------- enjin ---------- */
  const getQ = (id) => Q.find((q) => q.id === id);
  const avail = (q) => {
    const s = qs(q.id);
    if (s.s) return false;
    if (q.req && !q.req.every((r) => qs(r).s === 2)) return false;
    return true;
  };
  const lvOK = (q) => R().lv() >= q.lv;
  const curStep = (q) => {
    const s = qs(q.id);
    let st = q.steps[s.step];
    while (st && st.skip && st.skip()) {
      s.step++;
      s.pg = 0;
      st = q.steps[s.step];
    }
    return st;
  };
  function accept(q) {
    const s = qs(q.id);
    s.s = 1;
    s.step = 0;
    s.pg = 0;
    s.t = GS.day;
    if (q.pre) q.pre();
    S7().trk = q.id;
    tip((q.k === 'main' ? '📖 Bab Timur: ' : q.k === 'hidden' ? '🔮 Misi tersembunyi: ' : '❗ Misi: ') + q.t);
    enterStep(q);
    save();
  }
  function enterStep(q) {
    const st = curStep(q);
    if (st && st.fx) st.fx();
    /* langkah kumulatif: kira apa yang pemain sudah lakukan sebelum misi/langkah ini bermula */
    if (st && st.ty === 'ev' && st.cum) {
      const s = qs(q.id), c = (S7().evc || {})[st.k] || 0;
      s.pg = Math.min(st.n, Math.max(s.pg, c));
      if (s.pg >= st.n) advance(q);
    }
  }
  function advance(q) {
    const s = qs(q.id), st0 = curStep(q);
    if (st0 && st0.onDone) st0.onDone();
    s.step++;
    s.pg = 0;
    if (!curStep(q)) return complete(q);
    enterStep(q);
    tip('✔ ' + q.t + ' — ' + curStep(q).d);
    save();
  }
  function complete(q) {
    const s = qs(q.id), r = q.rw || {};
    s.s = 2;
    const xp = (r.xp || 0) * R().U(Math.max(q.lv, Math.min(R().lv(), q.lv + 4)));
    if (r.coin) GS.coin += r.coin;
    if (r.it) Object.keys(r.it).forEach((k) => gain(k, r.it[k]));
    if (r.rep) W.rep(r.rep);
    if (r.aff) Object.keys(r.aff).forEach((k) => W.aff(k, r.aff[k]));
    if (q.done) q.done();
    if (S7().trk === q.id) S7().trk = null;
    tip('🏆 ' + (q.k === 'main' ? 'Bab Timur' : 'Misi') + ' selesai: ' + q.t + (r.coin ? ' · +RM' + r.coin : '') + (r.rep ? ' · ⭐ Reputasi +' + r.rep : ''));
    if (xp) setTimeout(() => R().gain(xp, 'Misi'), 300);
    try {
      ev('sq_done', 1);
    } catch (e) {}
    /* misi utama seterusnya auto-ditawar / auto-mula */
    const nx = Q.find((n) => n.req && n.req.indexOf(q.id) >= 0 && n.auto);
    if (nx && avail(nx)) setTimeout(() => accept(nx), 1500);
    hud();
    save();
  }
  W.ev = (k, n) => {
    const ec = (S7().evc = S7().evc || {});
    ec[k] = (ec[k] || 0) + (n || 1);
    Q.forEach((q) => {
      const s = qs(q.id);
      if (s.s !== 1) return;
      const st = curStep(q);
      if (!st || st.ty !== 'ev' || st.k !== k) return;
      if (st.night && !night()) return tip('🌙 Perlu dilakukan pada waktu malam');
      s.pg += n || 1;
      if (s.pg >= st.n) advance(q);
      else tip('📜 ' + q.t + ': ' + s.pg + '/' + st.n);
    });
  };
  /* sambung ev() asal (bunuh, ikan, dll.) → ev V17 */
  function hookEv() {
    R().onEv((k, n) => {
      if (k === 'fish' && W.lakeD(P.x, P.z) < 1.7) W.ev('fish_tasik', n);
      if (k === 'fish_rare' && W.lakeD(P.x, P.z) < 1.7) W.ev('fish_tasik_rare', n);
      if (/^kill_/.test(k)) W.ev(k.replace('kill_', 'kill17_'), n);
    });
  }
  /* langkah visit / cond: semak berkala */
  function tickQ() {
    Q.forEach((q) => {
      const s = qs(q.id);
      if (s.s !== 1) return;
      const st = curStep(q);
      if (!st) return;
      if (st.ty === 'visit') {
        const at = typeof st.at === 'string' ? sp(st.at) : st.at;
        if (at && Math.hypot(P.x - at[0], P.z - at[1]) < st.r && !W.inCave) {
          if (st.night && !night()) {
            if (!st._w || W.now - st._w > 15000) {
              st._w = W.now;
              tip('🌙 Tempat ini perlu dilawati pada waktu malam (19:30–05:00). Tidur atau langkau masa.');
            }
            return;
          }
          advance(q);
        }
      } else if (st.ty === 'cond' && st.test()) advance(q);
    });
    /* misi tersembunyi h1: bermula bila menemui kuil */
    const h = getQ('h1');
    if (!qs('h1').s && Math.hypot(P.x - W.F.kuil[0], P.z - W.F.kuil[1]) < 7) accept(h);
    /* m1 hanya ditawarkan Tok Ketua (dunia lama); jika pemain masuk lembah sendiri → auto mula */
    const m1 = getQ('m1');
    if (!qs('m1').s && P.x < -220 && P.z < 58 && lvOK(m1)) accept(m1);
  }
  /* butang dalam dialog NPC */
  W.Q = {
    forNpc(id) {
      const out = [];
      Q.forEach((q) => {
        const s = qs(q.id);
        if (s.s === 0 && q.giver === id && avail(q)) {
          out.push(['❗ ' + q.t + (lvOK(q) ? '' : ' 🔒Lv' + q.lv), () => {
            if (!lvOK(q)) return QS14.dlg(nm(id), '🔒', 'Saya ada permintaan, tapi ia berbahaya. Kembali bila kamu Level ' + q.lv + '.', null, [['OK', null]]);
            QS14.dlg(nm(id), '📜', q.d, '<b>' + (q.k === 'main' ? '📖 Bab Timur · ' : '❗ ') + q.t + '</b> · Lv ' + q.lv + '<br>🎁 ⭐ ' + R().fmt((q.rw.xp || 0) * R().U(q.lv)) + ' EXP · 💰 RM' + (q.rw.coin || 0) + (q.rw.rep ? ' · Reputasi +' + q.rw.rep : ''), [['Nanti', null], ['✅ Terima', () => accept(q), 1]]);
          }]);
        }
        if (s.s !== 1) return;
        const st = curStep(q);
        if (!st || st.npc !== id) return;
        if (st.ty === 'talk')
          out.push(['📜 ' + q.t, () => {
            W.remember(id, 'q_' + q.id);
            QS14.dlg(nm(id), '📜', st.say || '…', '<b>' + q.t + '</b>', [['➡️ Teruskan', () => advance(q), 1]]);
          }]);
        if (st.ty === 'give') {
          const ok = Object.keys(st.need).every((k) => have(k, st.need[k]));
          out.push([(ok ? '🎁 ' : '📜 ') + q.t, () => {
            if (!ok) return QS14.dlg(nm(id), '📜', st.d, needTxt(st.need), [['OK', null]]);
            QS14.dlg(nm(id), '🎁', 'Boleh serahkan sekarang?', needTxt(st.need), [['Nanti', null], ['🎁 Serah', () => {
              take(st.need);
              QS14.dlg(nm(id), '😊', st.say || 'Terima kasih!', null, [['➡️', () => advance(q), 1]]);
            }, 1]]);
          }]);
        }
        if (st.ty === 'choice')
          out.push(['❓ ' + q.t, () => QS14.dlg(nm(id), '❓', st.q, '<b>' + q.t + '</b> · keputusan anda mengubah dunia', st.opts.map(([l, f]) => [l, () => {
            f();
            advance(q);
          }]))]);
      });
      return out;
    },
    st: qs,
    accept,
    get: getQ,
    step: curStep,
    complete
  };
  /* Tok Ketua (dunia lama) menawarkan Bab Timur */
  function hookKetua() {
    const k0 = QS14.ketuaTalk;
    if (typeof k0 !== 'function') return;
    QS14.ketuaTalk = function () {
      const m1 = getQ('m1');
      if (!qs('m1').s && avail(m1) && lvOK(m1)) {
        return QS14.dlg('Tok Ketua', '🧓', 'Gempa bulan lepas membuka <b>Celah Gunung</b> di hujung barat Laluan Hutan Jauh. Ada asap dapur di seberang sana… mungkin ada kampung lain! Mahu menyiasat?', '<b>📖 Bab Timur: Celah Gunung</b> · Lv 12', [['Nanti', () => k0.apply(this, arguments)], ['✅ Terima', () => accept(m1), 1]]);
      }
      return k0.apply(this, arguments);
    };
  }

  /* ---------- titik interaksi khas ---------- */
  const spr = (ic, x, z, y) => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    g.font = '46px serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(ic, 32, 34);
    const s = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(c), transparent: true, depthWrite: false }));
    s.position.set(x, (y != null ? y : W.H(x, z)) + 0.9, z);
    s.scale.setScalar(0.9);
    scene.add(s);
    return s;
  };
  function spots() {
    const V = W.F.village;
    /* kelapa berbuah (s1) */
    const KP = [[-438, 38], [-430, 44], [-446, 30], [-400, 36], [-392, 30]];
    const im = new T.InstancedMesh(W.GEO.kelapa, W.treeMat, KP.length), d3 = new T.Object3D();
    KP.forEach(([x, z], i) => {
      d3.position.set(x, W.H(x, z) - 0.1, z);
      d3.rotation.set(0, i, 0);
      d3.scale.setScalar(1.05);
      d3.updateMatrix();
      im.setMatrixAt(i, d3.matrix);
      /* WAJIB: bahan pokok dikongsi dengan InstancedMesh berwarna → r128 ranap jika instanceColor tiada */
      im.setColorAt(i, new T.Color(1, 1, 1));
      W.addCol({ x, z, r: 0.5 });
      const mk = spr('🥥', x + 0.8, z, W.H(x, z) + 5.6);
      ST.push({ x, z, r: 2.6, v: () => S7().kp !== GS.day + ':' + i && qs('s1').s === 1, lb: () => '🥥 Petik kelapa', f() {
        S7().kp = GS.day + ':' + i;
        gain('kelapa', 1);
        mk.visible = false;
        W.ev('kelapa17', 1);
        setTimeout(() => (mk.visible = true), 60000);
      } });
    });
    im.geometry = (() => {
      const g = new T.BufferGeometry();
      for (const k in W.GEO.kelapa.attributes) g.setAttribute(k, W.GEO.kelapa.attributes[k]);
      g.boundingSphere = new T.Sphere(new T.Vector3(-420, 5, 36), 40);
      return g;
    })();
    scene.add(im);
    /* petunjuk & loceng (s2) */
    const nekH = W.HOUSES.find((h) => h.id === 'r8') || W.HOUSES[0];
    const CL = [[nekH.x, nekH.z + 1.5, 'bawah rumah Nek Jah: tapak kaki kecil… dan bau kuih'], [sp('telaga')[0] + 1, sp('telaga')[1] + 1, 'tepi telaga: lukisan kapur “GENG BERINGIN”'], [V[0] - 4, V[1] + 2.5, 'akar Pokok Beringin: anak panah kapur menunjuk ke Balai']];
    CL.forEach(([x, z, t], i) => ST.push({ x, z, r: 2.4, v: () => qs('s2').s === 1 && curStep(getQ('s2')).k === 'clue' && !(S7().clue & (1 << i)), lb: () => '🔍 Periksa', f() {
      S7().clue = (S7().clue || 0) | (1 << i);
      tip('🔍 Petunjuk: ' + t);
      W.ev('clue', 1);
    } }));
    const bl = [sp('balai')[0] + 4, sp('balai')[1] - 10];
    ST.push({ x: bl[0], z: bl[1], r: 2.4, v: () => qs('s2').s === 1 && curStep(getQ('s2')).k === 'bell', lb: () => '🔔 Ambil loceng tersorok', f() {
      gain('loceng', 1);
      W.ev('bell', 1);
    } });
    /* bunga embun (s3) — 6 tompok bercahaya, hanya waktu subuh */
    const M = W.F.meadow, emb = [];
    for (let i = 0; i < 6; i++) {
      const a = i * 1.05 + 0.4, x = M[0] + Math.cos(a) * (8 + i * 3), z = M[1] + Math.sin(a) * (8 + i * 3);
      const s = spr('💧', x, z);
      emb.push(s);
      ST.push({ x, z, r: 2.2, v: () => hour() >= 5 && hour() < 9 && !(S7().emb && S7().emb[i] === GS.day), lb: () => '💧 Petik bunga embun', f() {
        S7().emb = S7().emb || [];
        S7().emb[i] = GS.day;
        gain('embun', 1);
        tip('💧 Bunga embun dipetik (' + (GS.inv.embun || 0) + ')');
      } });
    }
    W.tick(() => {
      const on = hour() >= 5 && hour() < 9;
      emb.forEach((s, i) => (s.visible = on && !(S7().emb && S7().emb[i] === GS.day) && Math.hypot(P.x - s.position.x, P.z - s.position.z) < 80));
    });
    /* tanglung ronda (s6) */
    const RD = [[V[0] + 50, V[1] - 20], [V[0] - 50, V[1] + 24], [V[0] - 20, V[1] - 52], [V[0] + 18, V[1] + 50]];
    RD.forEach(([x, z], i) => {
      ST.push({ x, z, r: 3, v: () => qs('s6').s === 1 && curStep(getQ('s6')).k === 'ronda' && !(S7().rd & (1 << i)), lb: () => '🏮 Periksa tanglung ronda', f() {
        if (!night()) return tip('🌙 Ronda hanya pada waktu malam');
        S7().rd = (S7().rd || 0) | (1 << i);
        W.ev('ronda', 1);
      } });
    });
    /* nod bijih dalam gua (s8 & tempaan) */
    const OR = [[-316, -94], [-322, -101], [-313, -103], [-307, -114], [-304, -122]];
    OR.forEach(([x, z], i) => {
      const m = new T.Mesh(new T.DodecahedronGeometry(0.7, 0), new T.MeshStandardMaterial({ color: 0x7a5a48, emissive: 0x3a1a08, roughness: 0.6, metalness: 0.5, flatShading: true }));
      m.position.set(x, W.CV.y + 0.4, z);
      W.cave.g.add(m);
      ST.push({ x, z, r: 2.2, v: () => W.inCave && S7()['or' + i] !== GS.day, lb: () => '⛏ Lombong bijih besi', f() {
        if (!use(4)) return;
        S7()['or' + i] = GS.day;
        gain('bijih', 1);
        tip('⛏ +1 🪨 bijih besi (' + GS.inv.bijih + ') · pulih esok');
      } });
    });
    /* LOKASI RAHSIA (6) */
    const SEC = [
      ['helang', 'Puncak Tebing Helang', W.F.helang, 'tablet'], ['islet', 'Pulau Kecil Tasik Biru', W.F.islet, 'tablet'], ['kelawar', 'Sarang Gua Kelawar', [W.F.gkel[0] - 1.5, W.F.gkel[1]], 'tablet'],
      ['beringin', 'Lubang Akar Beringin', [V[0] - 7.5, V[1] - 5], 'peti'], ['salji', 'Puncak Salji Banjaran Barat', [-518, -196], 'peti_besar'], ['kuil', 'Mezbah Kuil Lama', W.F.kuil, 'peti']
    ];
    W.SEC = SEC;
    SEC.forEach(([id, n, [x, z], tb]) => {
      const y = W.H(x, z);
      if (tb !== 'tablet') {
        const ch = new T.Group();
        add(ch, B(1.1, 0.6, 0.8), S(0x7a4a26), 0, 0.3, 0);
        add(ch, B(1.15, 0.25, 0.85), S(0xd4a537), 0, 0.68, 0);
        ch.position.set(x, y, z);
        scene.add(ch);
      } else {
        const tm = new T.Mesh(new T.BoxGeometry(0.8, 1.2, 0.25), S(0x8a8a80));
        tm.position.set(x, y + 0.6, z);
        tm.rotation.y = 0.4;
        scene.add(tm);
      }
      ST.push({ x, z, r: 2.6, v: () => !S7().sec[id], lb: () => (tb === 'tablet' ? '🗿 Baca batu bersurat' : '🗝 Buka peti tersembunyi'), f() {
        S7().sec[id] = GS.day;
        W.rep(1);
        tip('🗝 RAHSIA DITEMUI: ' + n + ' (' + Object.keys(S7().sec).length + '/' + SEC.length + ')');
        if (tb === 'tablet') {
          gain('tablet', 1);
          W.ev('tablet', 1);
          try {
            R().gain(R().U(R().lv()) * 2, 'Rahsia');
          } catch (e) {}
        } else W.loot(tb);
      } });
    });
    /* runtuhan kuil lama */
    {
      const [x, z] = W.F.kuil, g = new T.Group();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * 6.283, h = 1.5 + ((i * 7) % 5) * 0.8;
        add(g, B(0.8, h, 0.8), S(0x8a8a80), Math.cos(a) * 5, h / 2, Math.sin(a) * 5).rotation.z = (i % 3) * 0.08;
      }
      add(g, new T.CylinderGeometry(2.2, 2.6, 0.6, 8), S(0x7a7a70), 0, 0.3, 0);
      add(g, B(2.2, 0.4, 1.2), S(0x6a6a60), 0, 0.8, 0);
      for (let i = 0; i < 5; i++) add(g, B(1 + (i % 2), 0.4, 0.7), S(0x7f7f74), Math.cos(i * 2) * 3.6, 0.2, Math.sin(i * 2) * 3.6).rotation.y = i;
      g.position.set(x, W.H(x, z), z);
      scene.add(g);
      W8.merge(g);
      W.lab('Kuil Lama', x, W.H(x, z) + 6, z, '⛩', 0.8);
    }
    /* bendera puncak Tebing Helang (pemandangan) */
    {
      const [x, z] = W.F.helang, y = W.H(x, z), g = new T.Group();
      add(g, new T.CylinderGeometry(0.05, 0.05, 4, 5), S(0x5a3a22), 0, 2, 0);
      add(g, B(1.2, 0.7, 0.04), S(0xe63946), 0.6, 3.5, 0);
      g.position.set(x + 2, y, z);
      scene.add(g);
    }
  }
  /* mata merah di balik air terjun (m3) */
  let eyes = null;
  W.eyes = (on) => {
    if (!eyes) {
      eyes = new T.Group();
      [-0.6, 0.6].forEach((s) => {
        const m = new T.Mesh(new T.SphereGeometry(0.22, 8, 6), new T.MeshBasicMaterial({ color: 0xff2a1a }));
        m.position.x = s;
        eyes.add(m);
      });
      const f = W.fallInfo;
      /* tepat di belakang tirai air (di antara tirai & muka tebing) */
      const b = f.base || f.bot, d = f.dir || [0, 1];
      eyes.position.set(b[0] - d[0] * 0.25, b[1] + 4.5, b[2] - d[1] * 0.25);
      eyes.rotation.y = Math.atan2(d[0], d[1]);
      scene.add(eyes);
    }
    eyes.visible = on;
    if (on) {
      tip('👁 …Dua mata merah menyala di balik tirai air terjun. Tanah bergegar perlahan.');
      W.shake && W.shake(0.3);
      setTimeout(() => (eyes.visible = false), 9000);
    }
  };
  /* air terjun "bernyanyi" semula selepas Kelembai: wap lebih tebal + pelangi waktu siang */
  W.fallSing = () => {
    if (W._rb || !W.fallInfo) return;
    const f = W.fallInfo, g = new T.TorusGeometry(9, 0.5, 6, 40, Math.PI);
    const cv = document.createElement('canvas');
    cv.width = 8;
    cv.height = 64;
    const c = cv.getContext('2d'), gr = c.createLinearGradient(0, 0, 0, 64);
    ['#ff0000', '#ff9900', '#ffff00', '#00cc44', '#0099ff', '#6633ff', '#cc33ff'].forEach((col, i) => gr.addColorStop(i / 6, col));
    c.fillStyle = gr;
    c.fillRect(0, 0, 8, 64);
    const m = new T.Mesh(g, new T.MeshBasicMaterial({ map: new T.CanvasTexture(cv), transparent: true, opacity: 0.35, depthWrite: false, side: T.DoubleSide }));
    m.position.set(f.bot[0] + 2, f.bot[1], f.bot[2] + 6);
    m.rotation.y = 0.3;
    scene.add(m);
    W._rb = m;
    W.tick(() => {
      const h = hour();
      m.visible = h > 8 && h < 17 && !W.raining() && !W.inCave;
    });
  };

  /* ---------- PERISTIWA DUNIA ---------- */
  const EV = {
    babi: {
      n: '🐗 Serbuan Babi Hutan', cd: 3,
      can: () => night() && qs('m3').s === 2 && Math.hypot(P.x - W.F.farm[0], P.z - W.F.farm[1]) < 90,
      start(o) {
        const F = W.F.farm, pag = W.flag('ladang') === 'pagar' || W.flag('m4') === 'pagar';
        const n = o && o.boss ? (pag ? 3 : 5) : pag ? 2 : 4;
        this.foes = [];
        for (let i = 0; i < n; i++) this.foes.push(W.mkFoe('babi_tb', F[0] - 30 + i * 3, F[1] - 26 - (i % 2) * 4, 14 + (i % 3)));
        if (o && o.boss) this.foes.push(W.mkFoe('raja_babi', F[0] - 34, F[1] - 30, 17));
        this.foes.forEach((a) => (a.ai.s = 'chase'));
        tip('🐗 SERBUAN! Kawanan babi hutan menyerbu ladang padi' + (pag ? ' (pagar duri melambatkan mereka)' : '') + '!');
        W.bossBar(this.foes.find((a) => a.kind === 'raja_babi') || null);
      },
      tick() {
        return this.foes.every((a) => a.dead);
      },
      win() {
        W.rep(4);
        ['seman', 'limah', 'bujang'].forEach((k) => {
          W.aff(k, 3);
          W.remember(k, 'babi_saved');
        });
        W.ev('raid_win', 1);
        tip('🌾 Ladang selamat! Penduduk bersorak.');
      },
      npc: (d) => (/^(seman|limah|puteri|amir)$/.test(d.id) ? ['flee', 'balai'] : d.id === 'bujang' ? ['work:hunt', 'ladang'] : null)
    },
    hilang: {
      n: '🧒 Adik Puteri Hilang', cd: 5,
      can: () => qs('m2').s === 2 && hour() > 14 && hour() < 18 && !W.raining(),
      start() {
        const ps = [[-468, -96], [-404, -232], [-252, -168]], p = ps[(Math.random() * ps.length) | 0];
        this.p = p;
        this.found = 0;
        const e = W.npcById('puteri');
        e.g.position.set(p[0], W.H(p[0], p[1]), p[1]);
        e.path = null;
        this.mk = spr('❗', p[0], p[1], W.H(p[0], p[1]) + 2.4);
        tip('😢 Mak Limah: "Puteri hilang! Dia kejar rama-rama ke dalam hutan!" — cari dia (petunjuk: ❗ di peta kompas)');
        W.evtTarget = p;
      },
      tick() {
        const e = W.npcById('puteri'), g = e.g;
        if (!this.found && Math.hypot(P.x - g.position.x, P.z - g.position.z) < 3) {
          this.found = 1;
          this.mk.visible = false;
          tip('🧒 Puteri: "Kakak! Saya sesat… bawa saya balik?" — pimpin dia pulang ke kampung');
          W.evtTarget = sp('dataran');
        }
        if (this.found) {
          /* ikut pemain */
          const dx = P.x - g.position.x, dz = P.z - g.position.z, d = Math.hypot(dx, dz);
          if (d > 2) {
            g.position.x += (dx / d) * Math.min(d - 2, 0.12);
            g.position.z += (dz / d) * Math.min(d - 2, 0.12);
            g.rotation.y = Math.atan2(dx, dz);
          }
          g.position.y = W.H(g.position.x, g.position.z);
          if (W.inVillage(g.position.x, g.position.z)) return true;
        }
        return false;
      },
      win() {
        W.rep(5);
        W.aff('puteri', 15);
        W.aff('limah', 12);
        W.aff('seman', 8);
        W.remember('limah', 'puteri_saved');
        W.remember('puteri', 'puteri_saved');
        GS.coin += 120;
        tip('💖 Puteri selamat pulang! Mak Limah menangis gembira. +RM120 · Reputasi +5');
        W.evtTarget = null;
        try {
          R().gain(R().U(R().lv()) * 3, 'Selamatkan Puteri');
        } catch (e) {}
      },
      npc: (d) => (d.id === 'puteri' ? ['lost', 'none'] : d.id === 'limah' ? ['chat', 'dataran'] : null)
    },
    pencuri: {
      n: '🎭 Pencuri Bertopeng', cd: 4,
      can: () => qs('m1').s === 2 && hour() > 9 && hour() < 17 && W.inVillage(P.x, P.z),
      start() {
        const k = sp('kedai');
        this.g = W8.mkP({ n: 'Pencuri Bertopeng', x: k[0], z: k[1], c: 0x111111, h: 0x111111, hat: 'cap', hc: 0x111111, say: [] });
        npcs.splice(npcs.indexOf(this.g), 1);
        this.g.userData.w = 1e9;
        this.t0 = W.now;
        this.wp = [W.F.village[0] - 60, W.F.village[1] - 60];
        tip('🎭 "TOLONG! Pencuri!" — Mak Senah. Seorang bertopeng lari membawa barang kedai. KEJAR dia!');
        W.evtTarget = null;
      },
      tick() {
        const g = this.g;
        if (!g) return true;
        const dx = this.wp[0] - g.position.x, dz = this.wp[1] - g.position.z, d = Math.hypot(dx, dz), dp = Math.hypot(P.x - g.position.x, P.z - g.position.z);
        if (d > 1) {
          const sp2 = dp < 8 ? 0.11 : 0.085;
          g.position.x += (dx / d) * sp2;
          g.position.z += (dz / d) * sp2;
          g.rotation.y = Math.atan2(dx, dz);
          g.position.y = W.H(g.position.x, g.position.z);
          const s = Math.sin(W.now / 70);
          g.userData.L.rotation.x = s;
          g.userData.R.rotation.x = -s;
        }
        if (dp < 2.2) {
          this.caught = 1;
          return true;
        }
        if (W.now - this.t0 > 70000 || d < 1) return true;
        return false;
      },
      win() {
        const g = this.g;
        if (!this.caught) {
          tip('🎭 Pencuri berjaya melarikan diri ke dalam hutan… Mak Senah kerugian.');
          W.aff('senah', -2);
          scene.remove(g);
          return;
        }
        QS14.dlg('Pencuri Bertopeng', '🎭', 'J-jangan apa-apakan saya! Saya… saya Ijal dari seberang bukit. Adik-adik saya lapar sejak ladang kami musnah dilanggar babi hutan…', 'Apa keputusan anda?',
          [['⚖️ Serah kepada Tok Penghulu', () => {
            W.rep(4);
            W.aff('senah', 8);
            W.aff('hamzah', 5);
            W.remember('senah', 'thief_caught');
            tip('⚖️ Ijal dibawa ke Tok Penghulu. Barang Mak Senah dipulangkan. Reputasi +4');
            scene.remove(g);
          }], ['🤝 Pulangkan barang & lepaskan dia (beri RM50)', () => {
            if (GS.coin < 50) return tip('💰 Duit tak cukup');
            GS.coin -= 50;
            W.rep(2);
            W.aff('senah', 3);
            W.aff('esah', 6);
            W.flag('ijal', 1);
            W.remember('senah', 'thief_freed');
            tip('🤝 Ijal berjanji berubah. Mak Esah terharu mendengarnya. (Ijal mungkin muncul semula…)');
            scene.remove(g);
          }]]);
      }
    },
    tumbang: {
      n: '🌳 Pokok Tumbang', cd: 3,
      can: () => W.wx() === W.WX.ribut && qs('m1').s === 2,
      start() {
        const J = W.ROADS[0].R, [x, z, i] = J.at(J.L * 0.55), [tx, tz] = J.tan(i);
        this.p = [x, z];
        this.hits = 0;
        const g = new T.Group();
        const tr = add(g, new T.CylinderGeometry(0.45, 0.6, 9, 7), S(0x5e4128), 0, 0.5, 0);
        tr.rotation.z = Math.PI / 2;
        add(g, new T.IcosahedronGeometry(2.4, 0), S(0x2f7a2f), 4.4, 1.4, 0);
        g.position.set(x, W.H(x, z), z);
        g.rotation.y = Math.atan2(tx, tz);
        scene.add(g);
        this.g = g;
        this.col = { x, z, r: 2.6 };
        W.addCol(this.col);
        this.st = { x, z, r: 3.4, lb: () => '🪓 Potong pokok tumbang (' + this.hits + '/3)', f: () => {
          if (!GS.axe) return tip('Perlu 🪓 kapak');
          if (!use(5)) return;
          this.hits++;
          W.shake(0.15);
          gain('wood', 2);
        } };
        ST.push(this.st);
        W.evtTarget = this.p;
        tip('⛈ Ribut menumbangkan pokok merentangi Jalan Celah Timur! Bersihkan jalan (perlu 🪓).');
      },
      tick() {
        return this.hits >= 3;
      },
      win() {
        scene.remove(this.g);
        W.delCol(this.col);
        ST.splice(ST.indexOf(this.st), 1);
        W.rep(3);
        W.aff('hamzah', 3);
        tip('🌳 Jalan dibersihkan! +4 🪵 kayu · Reputasi +3');
        W.evtTarget = null;
      }
    }
  };
  W.evt = {
    cur: null,
    D: EV,
    force(id, o) {
      if (this.cur) this.end(false);
      const e = EV[id];
      this.cur = e;
      this.id = id;
      S7().evd[id] = GS.day;
      e.start(o);
    },
    end(ok) {
      const e = this.cur;
      this.cur = null;
      if (ok && e.win) e.win();
      else if (e && e.win && e === EV.pencuri) e.win();
      W.evtTarget = null;
      save();
    }
  };
  let evT = 0;
  function tickEvt(now) {
    const E = W.evt;
    if (E.cur) {
      let done = false;
      try {
        done = E.cur.tick();
      } catch (e) {
        console.error('V17 evt', e);
        done = true;
      }
      if (done) E.end(true);
      return;
    }
    if (now - evT < 30000 || W.inCave) return;
    evT = now;
    if (!(P.x < -216 && P.z < 58)) return;
    for (const id in EV) {
      const e = EV[id], last = S7().evd[id] || -99;
      if ((GS.day || 1) - last < e.cd) continue;
      if (e.can() && Math.random() < 0.35) return E.force(id);
    }
  }

  /* ---------- kedai ---------- */
  W.shop = (k, e) => {
    const disc = W.flag('sahabat') ? 0.8 : (GS.v17.rep || 0) >= 40 ? 0.9 : 1;
    if (k === 'kedai') {
      const L = [['benang', 95], ['garam', 3], ['tepung', 6], ['rempah', 12], ['air', 4], ['umpan', 3], ['ubat', 25], ['madu', 45]].concat(W.flag('beras17') ? [['beras', 3]] : []);
      return QS14.dlg('Mak Senah', '🏪', 'Pilih barang!' + (disc < 1 ? ' <b>(diskaun ' + Math.round((1 - disc) * 100) + '%)</b>' : ''), '💰 RM' + GS.coin,
        L.slice(0, 8).map(([it, p]) => {
          const pr = Math.max(1, Math.round(p * disc));
          return [(icn(it)) + ' ' + ((IT[it] && IT[it][1]) || it) + ' · RM' + pr, () => {
            if (GS.coin < pr) return tip('💰 Duit tak cukup');
            GS.coin -= pr;
            gain(it, 1);
            tip('🛍 +1 ' + icn(it) + ' (' + GS.inv[it] + ')');
            hud();
            save();
            W.shop('kedai', e);
          }];
        }).concat([['Tutup', null]]));
    }
    if (k === 'besi') {
      if (!W.flag('tempa')) return QS14.dlg('Pak Tahir', '⚒️', 'Relau aku perlukan bijih besi gua. Tanpa bijih, aku tak boleh naik taraf apa-apa.', null, [['OK', null]]);
      const own = Object.keys(CB14.WPN).filter((w) => w !== 'tumbuk' && (w === 'kapak' ? GS.axe : GS.wpn && GS.wpn[w]));
      const btn = own.slice(0, 5).map((w) => {
        const L = W.wupOf(w), cost = Math.round(Math.max(60, (CB14.WPN[w].price || 300) * 0.35) * (L + 1) * disc), ore = (L + 1) * 2;
        return [CB14.WPN[w].ic + ' ' + CB14.WPN[w].n.replace(/^\S+\s/, '') + ' +' + L + (L >= 5 ? ' (MAKS)' : ' → +' + (L + 1) + ' · RM' + cost + ' 🪨' + ore), () => {
          if (L >= 5) return tip('Sudah maksimum');
          if (GS.coin < cost || !have('bijih', ore)) return tip('Perlu RM' + cost + ' & ' + ore + ' 🪨 bijih');
          GS.coin -= cost;
          GS.inv.bijih -= ore;
          GS.v17.wup[w] = L + 1;
          tip('⚒️ *TANG!* ' + CB14.WPN[w].n + ' kini +' + (L + 1) + ' (kerosakan +' + (L + 1) * 12 + '%)');
          W.aff('tahir', 2);
          hud();
          save();
          W.shop('besi', e);
        }];
      });
      if (!(GS.wpn && GS.wpn.tombak))
        btn.push(['🔱 Tempa Tombak (RM300 · 🪨4 · 🪵6 · 🟫2)', () => {
          if (GS.coin < 300 || !have('bijih', 4) || !have('wood', 6) || !have('kulit', 2)) return tip('Perlu RM300, 4 bijih, 6 kayu, 2 kulit');
          GS.coin -= 300;
          take({ bijih: 4, wood: 6, kulit: 2 });
          GS.wpn = GS.wpn || {};
          GS.wpn.tombak = 1;
          tip('🔱 Tombak Buluh Besi siap! Jangkauan panjang (3.4 m). Tukar senjata dengan 🔄');
          hud();
          save();
        }]);
      btn.push(['Tutup', null]);
      return QS14.dlg('Pak Tahir', '⚒️', 'Senjata mana nak aku tempa?', '💰 RM' + GS.coin + ' · 🪨 ' + (GS.inv.bijih || 0) + ' bijih', btn);
    }
  };

  /* ---------- memori → dialog ---------- */
  Object.assign(W.MEMLINE, {
    m4_serang: { bujang: 'Kau pilih untuk berburu bersama aku. Aku tak lupa.', seman: 'Kau ikut cara Bujang… harap padi aku tak terpijak.' },
    m4_pagar: { seman: 'Pagar duri kau tu masih kukuh! Babi pun serik.', bujang: 'Pagar. Hm. Babi akan cari jalan lain.' },
    babi_saved: { seman: 'Terima kasih selamatkan ladang malam tu!', limah: 'Kalau tak ada kamu, padi kami habis!', bujang: 'Kau bertarung baik malam tu.' },
    mj_kerja: { matjenin: 'Aku dah mula kerja di ladang! Penat… tapi duit sendiri rasa lain.' },
    mj_angan: { matjenin: 'Semalam aku mimpi jadi raja kelapa! Terima kasih percaya pada angan-angan aku!' },
    bell_told: { haris: 'Kau mengadu pada Cikgu! Kau bukan ahli geng lagi!', harun: 'Kakak beritahu Cikgu… kami kena denda.' },
    bell_kept: { haris: 'Kau simpan rahsia geng! Kau memang hebat!', harun: 'Terima kasih tak beritahu Cikgu…' },
    puteri_saved: { limah: 'Mak Limah takkan lupa kamu bawa Puteri pulang.', puteri: 'Kakak selamatkan saya dari hutan!' },
    thief_caught: { senah: 'Pencuri tu kau tangkap! Kedai Mak selamat!' },
    thief_freed: { senah: 'Kau lepaskan pencuri tu… Mak tak faham, tapi Mak hormat.' }
  });

  when14(() => W.npcOK && W.combatOK && W.cave && W.cave.g && typeof QS14 !== 'undefined', () => {
    hookEv();
    hookKetua();
    spots();
    /* langkah kristal: ev crystal n=3 → crystal_all */
    const e0 = W.ev;
    W.ev = (k, n) => {
      e0(k, n);
      if (k === 'crystal' && n >= 3) e0('crystal_all', 1);
    };
    /* bos: muncul bila masuk arena (jika belum ditewaskan) */
    W.tick((dt, now) => {
      tickQ();
      tickEvt(now);
      const ar = W.CV.rooms[3];
      if (W.inCave && !W.cave.st().boss && !W.bossA && !W.cave.gateClosed() && Math.hypot(P.x - ar[0], P.z - ar[1]) < 15 && !W._bossA) {
        const a = W.mkFoe('kelembai', ar[0] + 2, ar[1] - 4, 22, { cave: true, onDie: () => {
          W.cave.st().boss = 1;
          W.cave.chest.visible = true;
          W._bossA = null;
          W.ev('boss_kelembai', 1);
          tip('🗿 KELEMBAI BATU TEWAS! Sumpahan air terjun terlerai… 🎁 peti terbuka di arena.');
          gain('permata', 1);
          W.rep(10);
        } });
        W._bossA = a;
      }
      if (W._bossA && !W.inCave) {
        W.killFoe(W._bossA);
        W._bossA = null;
        W.bossBar(null);
      }
    });
    W.questOK = 1;
  });
})();
