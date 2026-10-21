/* ===== V17 PENDUDUK KAMPUNG TIMUR (data) — 27 watak unik =====
   setiap watak: nama · latar · personaliti · kerja · rumah · keluarga/kawan · jadual harian · dialog sendiri
   jadual: [jam mula, aktiviti, tempat]  (tempat: home/in = dalam rumah, atau titik W17.SPOTS / 'wander' / 'hutan' / 'padang')
   rupa: pilihan mkP asal (c baju, h rambut, hat, td tudung, s saiz) → model 3D NPC15 dipadankan ikut nama (mod High+) */
(function () {
  'use strict';
  const W = window.W17;
  if (!W) return;
  /* ucapan ikut personaliti × waktu */
  W.GREET = {
    tegas: { pagi: 'Assalamualaikum. Awal kamu keluar hari ini.', petang: 'Hm. Petang-petang begini, ada urusan?', malam: 'Malam sudah. Jangan merayau jauh.' },
    ramah: { pagi: 'Selamat pagi, nak! Dah sarapan?', petang: 'Eh, Waguri! Mari singgah sekejap.', malam: 'Malam-malam pun datang menjenguk? Baiknya hati.' },
    pendiam: { pagi: '…Pagi.', petang: '…Ya?', malam: '…Lewat sudah.' },
    kelakar: { pagi: 'Pagi! Ayam pun belum habis berkokok, kamu dah sampai!', petang: 'Petang-petang ni sedap minum kopi… kopi kamu belanja?', malam: 'Malam ni bulan cantik, macam muka aku masa muda dulu!' },
    nakal: { pagi: 'Hehe… kakak tak nampak apa-apa kan?', petang: 'Kejar kami kalau boleh!', malam: 'Shhh! Nanti mak dengar kami belum tidur!' },
    bijak: { pagi: 'Pagi yang baik dimulakan dengan niat yang baik, cu.', petang: 'Matahari condong, bayang memanjang… begitu juga umur kita.', malam: 'Bintang malam ini terang. Elok untuk bercerita.' },
    gopoh: { pagi: 'Cepat, cepat! Banyak kerja pagi ni!', petang: 'Aduh, tak sempat-sempat! Ada apa?', malam: 'Eh, dah malam? Kerja belum siap!' },
    pemalu: { pagi: 'Oh… s-selamat pagi.', petang: 'Kakak… nak cakap dengan saya?', malam: 'S-saya patut balik rumah dah…' },
    pemimpi: { pagi: 'Pagi! Hari ni aku rasa nasib aku akan berubah!', petang: 'Kau tahu tak, satu hari nanti aku akan jadi orang kaya…', malam: 'Malam ni aku nak mimpi jadi saudagar besar.' },
    kasar: { pagi: 'Apa?', petang: 'Cakap cepat, aku sibuk.', malam: 'Malam-malam ni jangan ganggu aku.' }
  };
  const SP = (o) => o;
  W.NPCD = [
    SP({
      id: 'hamzah', n: 'Tok Penghulu Hamzah', home: 'r1', job: 'Penghulu kampung', per: 'tegas', fam: { isteri: 'bedah' }, kawan: ['wahab', 'kidam'],
      look: { c: 0x2c3e50, h: 0xdddddd, hat: 'cap', hc: 0x1a1a1a },
      bio: 'Memimpin Kampung Timur selama 30 tahun. Kehilangan anak sulungnya dalam runtuhan tanah di Celah Gunung — sejak itu dia berhati-hati dengan orang luar.',
      sch: [[0, 'sleep', 'in'], [6, 'idle', 'home'], [7.5, 'work:lead', 'balai'], [12, 'eat', 'dataran'], [13.5, 'work:lead', 'balai'], [16.5, 'stroll', 'wander'], [18.5, 'chat', 'dataran'], [20, 'idle', 'home'], [21.5, 'sleep', 'in']],
      say: ['Kampung ini kecil, tapi setiap orang di sini ada cerita.', 'Celah Gunung itu baru terbuka selepas gempa bulan lepas. Dulu kami terpisah dari dunia luar.', 'Air terjun kita makin senyap… orang tua-tua kata itu petanda buruk.'],
      work: ['Banyak aduan pagi ni — babi hutan lagi, kincir rosak lagi.', 'Penghulu kena dengar semua orang, walaupun yang mengadu pasal ayam jiran.'],
      rain: 'Hujan begini, kerja di ladang terpaksa ditangguh.', night: 'Malam di kampung kami tenang. Kecuali bila Haris dan Harun belum tidur.',
      lo: 'Aku belum kenal kamu. Buktikan dulu niat kamu baik.', hi: 'Kamu dah macam anak kampung ini sendiri, Waguri.',
      gos: ['Mat Jenin tu baik budaknya… cuma kuat berangan.', 'Bujang si pemburu tu jarang turun ke kampung. Dia lebih kenal hutan dari manusia.']
    }),
    SP({
      id: 'bedah', n: 'Mak Bedah', home: 'r1', job: 'Tukang masak kenduri', per: 'ramah', fam: { suami: 'hamzah' }, kawan: ['senah', 'mona'],
      look: { c: 0xc0392b, h: 0x5d4037, td: 1 },
      bio: 'Isteri Tok Penghulu. Masakan gulai lemaknya terkenal sampai ke seberang gunung. Suka menyuapkan makanan kepada sesiapa yang nampak lapar.',
      sch: [[0, 'sleep', 'in'], [5.5, 'work:cook', 'home'], [8, 'stroll', 'kedai'], [9.5, 'chat', 'dataran'], [11, 'work:cook', 'home'], [14, 'idle', 'home'], [16, 'chat', 'telaga'], [18, 'work:cook', 'home'], [21, 'sleep', 'in']],
      say: ['Kamu kurus sangat ni, nak. Makan lebih sikit!', 'Gulai lemak Mak Bedah ni resipi arwah nenek Mak.', 'Tok Penghulu tu nampak garang, tapi hatinya lembut macam bubur.'],
      work: ['Santan kena perah segar, baru wangi gulainya.', 'Jangan dekat sangat dengan kuali, nanti terpercik!'],
      rain: 'Hujan-hujan ni sedap makan bubur kacang.', night: 'Dah makan malam? Ada lebih gulai dalam periuk.',
      lo: 'Oh, orang baru ya. Selamat datang.', hi: 'Anak Mak Bedah yang baik! Nah, bawa bekal ni.',
      gos: ['Kak Mona dengan Pak Long Kidam tu, bergaduh pasal garam pun boleh jadi romantik.', 'Mak Senah tu tahu semua cerita kampung. Hati-hati cakap depan dia!']
    }),
    SP({
      id: 'seman', n: 'Pak Seman', home: 'r2', job: 'Petani padi bukit', per: 'ramah', fam: { isteri: 'limah', anak: ['puteri', 'amir'] }, kawan: ['kidam', 'jalil'],
      look: { c: 0x6d8b74, h: 0x2a2336, hat: 'straw' },
      bio: 'Mewarisi ladang padi bertingkat dari datuknya. Paling risau tentang babi hutan yang makin berani merosakkan padi.',
      sch: [[0, 'sleep', 'in'], [5.5, 'idle', 'home'], [6.5, 'work:farm', 'ladang'], [12, 'eat', 'home'], [13.5, 'work:farm', 'ladang'], [18, 'chat', 'dataran'], [19.5, 'idle', 'home'], [21, 'sleep', 'in']],
      say: ['Padi bukit ni tak perlu sawah berair, cukup hujan dan tangan yang rajin.', 'Kalau padi menguning, seluruh kampung bergotong-royong menuai.', 'Puteri dan Amir tu nakal sikit, tapi rajin tolong mak dia.'],
      work: ['Tengok jejak ni… babi hutan datang lagi semalam.', 'Petak atas sekali tu paling subur, kena air dari kincir.'],
      rain: 'Alhamdulillah hujan! Padi tengah dahaga.', night: 'Malam-malam aku kadang berjaga di ladang. Babi hutan tu cerdik.',
      lo: 'Kamu dari mana? Jangan pijak batas padi tu.', hi: 'Kalau tak kerana kamu, padi kami habis dimakan babi!',
      gos: ['Bujang kata babi-babi tu ada ketua — taringnya macam besi.', 'Pak Long Kidam tu tukang kincir. Kalau kincir berhenti, air ke ladang pun berhenti.']
    }),
    SP({
      id: 'limah', n: 'Mak Limah', home: 'r2', job: 'Petani & penjual beras', per: 'gopoh', fam: { suami: 'seman', anak: ['puteri', 'amir'] }, kawan: ['bedah', 'esah'],
      look: { c: 0x8e44ad, h: 0x3a2a2a, td: 1 },
      bio: 'Sentiasa tergesa-gesa — pagi ke ladang, tengah hari jual beras, petang kejar anak. Tetapi tak pernah lupa senyum.',
      sch: [[0, 'sleep', 'in'], [5, 'work:cook', 'home'], [7, 'work:farm', 'ladang'], [11, 'work:shop', 'dataran'], [14, 'work:farm', 'ladang'], [17.5, 'idle', 'home'], [21, 'sleep', 'in']],
      say: ['Aduh, beras belum habis tumbuk, anak belum mandi!', 'Beras padi bukit wangi, sekali masak satu kampung bau!', 'Puteri! Amir! Mana pula budak-budak ni…'],
      work: ['Tak sempat! Tak sempat! Tolong pegang bakul ni sekejap!', 'Beras baru, dua ringgit secupak!'],
      rain: 'Alamak, jemuran!', night: 'Budak-budak dah tidur, baru Mak Limah boleh duduk.',
      lo: 'Maaf, maaf, Mak Limah sibuk!', hi: 'Terima kasih tolong keluarga kami, nak!',
      gos: ['Cikgu Aminah tu sabar betul mengajar si kembar.', 'Bidan Kalsom ada ubat untuk semua penyakit — kecuali penyakit malas Mat Jenin!']
    }),
    SP({
      id: 'puteri', n: 'Adik Puteri', home: 'r2', job: 'Kanak-kanak (8 tahun)', per: 'pemalu', fam: { bapa: 'seman', ibu: 'limah', adik: 'amir' }, kawan: ['dayang'],
      look: { c: 0xff7aa8, h: 0x2a2336, s: 0.72 },
      bio: 'Suka memetik bunga di Padang Bunga dan berangan menjadi bidan seperti Bidan Kalsom. Selalu tersesat kerana mengejar rama-rama.',
      sch: [[0, 'sleep', 'in'], [7, 'idle', 'home'], [8, 'work:study', 'balai'], [11.5, 'play', 'wander'], [13, 'eat', 'home'], [15, 'play', 'padang'], [17.5, 'play', 'dataran'], [19, 'idle', 'home'], [20, 'sleep', 'in']],
      say: ['K-kakak suka bunga? Bunga ungu tu paling cantik.', 'Saya nak jadi bidan macam Bidan Kalsom bila besar.', 'Amir tu suka usik saya…'],
      work: ['Cikgu Aminah ajar kami mengira guna biji saga.'],
      rain: 'Saya takut bunyi guruh…', night: 'Mak kata jangan keluar malam. Ada hantu kelembai!',
      lo: '…', hi: 'Kakak Waguri! Saya petik bunga ni untuk kakak!',
      gos: ['Haris dan Harun sorok sesuatu bawah rumah Nek Jah… shhh.']
    }),
    SP({
      id: 'amir', n: 'Adik Amir', home: 'r2', job: 'Kanak-kanak (6 tahun)', per: 'nakal', fam: { bapa: 'seman', ibu: 'limah', kakak: 'puteri' }, kawan: ['haris', 'harun'],
      look: { c: 0x3498db, h: 0x2a2336, s: 0.66, hat: 'cap', hc: 0xe74c3c },
      bio: 'Pengikut setia si kembar Haris dan Harun. Bercita-cita menjadi pemburu hebat seperti Abang Bujang.',
      sch: [[0, 'sleep', 'in'], [7, 'idle', 'home'], [8, 'work:study', 'balai'], [11.5, 'play', 'dataran'], [13, 'eat', 'home'], [14.5, 'play', 'wander'], [18, 'play', 'dataran'], [19, 'idle', 'home'], [20, 'sleep', 'in']],
      say: ['Bang Bujang boleh panah burung dari jauh sekali!', 'Nanti saya besar, saya lawan babi hutan!', 'Kakak ada pedang? Bagi pegang sekejap!'],
      work: ['Belajar tu bosan… nak main!'],
      rain: 'Jom main lumpur!', night: 'Saya tak mengantuk lagi…',
      lo: 'Kakak ni siapa?', hi: 'Kakak Waguri pendekar paling hebat!',
      gos: ['Haris kata dalam gua belakang air terjun ada raksasa batu!']
    }),
    SP({
      id: 'senah', n: 'Mak Senah', home: 'r3', job: 'Pekedai runcit', per: 'kelakar', fam: {}, kawan: ['bedah', 'tijah'],
      look: { c: 0xe67e22, h: 0x5d4037, td: 1 }, shop: 'kedai',
      bio: 'Janda ceria yang membuka Kedai Runcit. Tahu setiap gosip kampung — kadang-kadang sebelum ia berlaku.',
      sch: [[0, 'sleep', 'in'], [6, 'idle', 'home'], [7, 'work:shop', 'kedai'], [12.5, 'eat', 'dataran'], [13.5, 'work:shop', 'kedai'], [19, 'chat', 'dataran'], [21, 'idle', 'home'], [22, 'sleep', 'in']],
      say: ['Kedai Mak Senah ada semua — dari garam sampai gosip!', 'Dulu suami Mak pedagang dari seberang gunung. Sebab tu Mak tahu harga barang luar.', 'Ha, mari, mari! Harga istimewa untuk muka comel!'],
      work: ['Benang emas tinggal sikit. Kak Tijah borong semua!', 'Garam, gula, minyak tanah… pilih!'],
      rain: 'Hujan, kedai lengang. Mari borak dengan Mak!', night: 'Kedai tutup! Esok datang awal, barang baru sampai.',
      lo: 'Hm, orang baru. Bayar tunai ya, tak ada hutang!', hi: 'Untuk kamu, Mak bagi diskaun kawan baik!',
      gos: ['Kau tahu tak, ada orang curi kuih dari kedai Mak minggu lepas. Bertopeng pula tu!', 'Pak Usu Leman tu berjaga malam, tapi selalu tertidur di menara. Jangan cakap Mak yang bagitahu!']
    }),
    SP({
      id: 'tahir', n: 'Pak Tahir', home: 'r4', job: 'Tukang besi', per: 'kasar', fam: { anak: 'azlan' }, kawan: ['kasim', 'bujang'],
      look: { c: 0x4a3b2a, h: 0x1a1414, p: 0x2a2a2a }, shop: 'besi',
      bio: 'Tangannya kasar, katanya pun kasar, tapi tempaannya halus. Hanya dia di lembah ini yang tahu menempa besi dari bijih gua.',
      sch: [[0, 'sleep', 'in'], [6, 'idle', 'home'], [7, 'work:forge', 'besi'], [12, 'eat', 'home'], [13, 'work:forge', 'besi'], [18.5, 'idle', 'home'], [20, 'chat', 'dataran'], [21.5, 'sleep', 'in']],
      say: ['Senjata yang baik bukan untuk berlagak.', 'Bijih besi terbaik ada dalam gua. Tapi tiada siapa berani masuk.', 'Azlan tu nak jadi pendekar. Aku nak dia jadi tukang besi.'],
      work: ['*TANG! TANG!* Jangan berdiri dekat sangat!', 'Bawakan bijih, aku tempa senjata kau jadi lebih tajam.'],
      rain: 'Hujan pun relau aku tetap menyala.', night: 'Kedai tutup. Esok.',
      lo: 'Kalau tak nak beli, jangan kacau.', hi: 'Kau tahu menghargai besi yang baik. Aku hormat kau.',
      gos: ['Wak Kasim boleh buat sampan dalam tiga hari. Aku perlu tiga minggu untuk sebilah keris.']
    }),
    SP({
      id: 'azlan', n: 'Azlan', home: 'r4', job: 'Perantis tukang besi', per: 'pemimpi', fam: { bapa: 'tahir' }, kawan: ['matjenin', 'dayang'],
      look: { c: 0xb03a2e, h: 0x2a2336 },
      bio: 'Anak muda 17 tahun yang berlatih silat secara sembunyi di Wakaf Tebing setiap senja. Ingin membuktikan kepada ayahnya bahawa dia boleh jadi pendekar.',
      sch: [[0, 'sleep', 'in'], [6.5, 'idle', 'home'], [7.5, 'work:forge', 'besi'], [12, 'eat', 'dataran'], [13, 'work:forge', 'besi'], [17, 'work:train', 'wakaf'], [19.5, 'idle', 'home'], [21.5, 'sleep', 'in']],
      say: ['Satu hari nanti aku akan tewaskan Kelembai Batu!', 'Ayah tak faham. Aku bukan nak jadi tukang besi seumur hidup.', 'Kau pandai bertarung? Ajar aku!'],
      work: ['Tiup bara, tiup bara… lagi sikit!'],
      rain: 'Hujan-hujan pun aku tetap berlatih.', night: 'Jangan beritahu ayah aku keluar berlatih tadi.',
      lo: 'Kau siapa? Pendekar dari luar?', hi: 'Kau idola aku, Waguri! Bawa aku bertarung satu hari nanti!',
      gos: ['Dayang tu pandai pasal herba… dan dia selalu senyum pada aku. Agaknya.']
    }),
    SP({
      id: 'aminah', n: 'Cikgu Aminah', home: 'r5', job: 'Guru kampung', per: 'bijak', fam: {}, kawan: ['kalsom', 'nekjah'],
      look: { c: 0x2a9d8f, h: 0x3a2a2a, td: 1 },
      bio: 'Datang dari bandar sepuluh tahun lalu untuk mengajar, dan memilih untuk terus tinggal. Mengajar anak-anak di Balai Raya setiap pagi.',
      sch: [[0, 'sleep', 'in'], [6, 'idle', 'home'], [7.5, 'work:teach', 'balai'], [12, 'eat', 'dataran'], [13, 'idle', 'home'], [15, 'stroll', 'padang'], [17.5, 'chat', 'telaga'], [19, 'idle', 'home'], [22, 'sleep', 'in']],
      say: ['Ilmu itu pelita hidup.', 'Di bandar, orang sibuk. Di sini, orang ada masa untuk satu sama lain.', 'Kanak-kanak di sini bijak — cuma perlu peluang.'],
      work: ['Satu tambah satu… Haris! Jangan baling kapur!', 'Hari ini kita belajar nama-nama bintang.'],
      rain: 'Hujan ialah rahmat. Juga alasan untuk membaca buku.', night: 'Saya sedang menulis buku tentang legenda Kelembai.',
      lo: 'Selamat datang. Jika perlu bantuan, saya di Balai Raya.', hi: 'Kamu pelajar paling baik yang tak pernah duduk dalam kelas saya!',
      gos: ['Nek Jah simpan banyak cerita lama. Dengarlah sebelum terlambat.']
    }),
    SP({
      id: 'kalsom', n: 'Bidan Kalsom', home: 'r6', job: 'Bidan & pengamal herba', per: 'bijak', fam: {}, kawan: ['aminah', 'nekjah'], pupil: 'dayang',
      look: { c: 0x6c5b7b, h: 0xbbbbbb, td: 1 },
      bio: 'Telah menyambut kelahiran hampir semua orang di kampung ini. Ubatnya daripada herba Padang Bunga dan embun pagi.',
      sch: [[0, 'sleep', 'in'], [5, 'work:herb', 'padang'], [8.5, 'work:herb', 'home'], [12, 'eat', 'home'], [14, 'stroll', 'wander'], [16, 'work:herb', 'home'], [19, 'chat', 'dataran'], [20.5, 'sleep', 'in']],
      say: ['Herba dipetik ketika embun belum kering paling mujarab.', 'Badan sihat bermula dari hati yang tenang.', 'Dayang tu bakal jadi bidan yang hebat.'],
      work: ['Daun ini untuk demam, akar itu untuk sakit perut.', 'Jangan sentuh bunga merah itu — beracun!'],
      rain: 'Lepas hujan, cendawan ubat tumbuh di bawah buluh.', night: 'Kalau ada yang sakit malam-malam, ketuk pintu saya.',
      lo: 'Kamu cedera? Mari saya tengok.', hi: 'Saya simpan ubat istimewa untuk kamu.',
      gos: ['Air terjun yang senyap itu… airnya pun makin keruh. Ada sesuatu di hulu.']
    }),
    SP({
      id: 'dayang', n: 'Dayang', home: 'r6', job: 'Perantis bidan', per: 'pemalu', fam: {}, kawan: ['puteri', 'azlan'], guru: 'kalsom',
      look: { c: 0xf4a261, h: 0x2a2336, td: 1 },
      bio: 'Yatim piatu yang dibesarkan Bidan Kalsom. Suka mencatat setiap jenis tumbuhan dalam buku kecilnya.',
      sch: [[0, 'sleep', 'in'], [5, 'work:herb', 'padang'], [9, 'work:herb', 'home'], [12, 'eat', 'dataran'], [13.5, 'stroll', 'padang'], [16.5, 'work:herb', 'home'], [19, 'idle', 'home'], [21, 'sleep', 'in']],
      say: ['B-buku ni ada 214 jenis tumbuhan setakat ni.', 'Bidan Kalsom macam ibu saya sendiri.', 'Azlan selalu cedera berlatih… saya yang balut lukanya.'],
      work: ['Ini daun kaduk. Ini daun sirih. Jangan keliru!'],
      rain: 'Bau tanah lepas hujan… saya suka.', night: 'Saya nak siapkan catatan hari ini.',
      lo: '…Oh. Hai.', hi: 'Kakak, saya namakan bunga baharu ni sempena nama kakak!',
      gos: ['Ada bunga embun yang hanya mekar waktu subuh di Padang Bunga…']
    }),
    SP({
      id: 'daud', n: 'Abang Daud', home: 'r7', job: 'Nelayan Tasik Biru', per: 'kelakar', fam: { isteri: 'yati' }, kawan: ['kasim', 'kidam'],
      look: { c: 0x1f618d, h: 0x2a2336, hat: 'straw' },
      bio: 'Nelayan paling bising di Tasik Biru — katanya untuk "memanggil ikan". Berkahwin dengan Kak Yati yang pendiam; mereka pasangan paling serasi di kampung.',
      sch: [[0, 'sleep', 'in'], [5, 'work:fish', 'jeti'], [11, 'eat', 'home'], [12.5, 'idle', 'home'], [15, 'work:fish', 'jeti'], [19, 'chat', 'dataran'], [21, 'sleep', 'in']],
      say: ['Ikan Tasik Biru ni pandai! Kena cerdik sikit dari dia.', 'Pernah aku dapat ikan sebesar budak! …Okay, sebesar kucing.', 'Kak Yati tu senyap, tapi masakan ikannya juara!'],
      work: ['Shhh… ikan tengah fikir nak makan umpan ke tak.', 'Pagi-pagi ikan lapar, petang-petang ikan merajuk.'],
      rain: 'Hujan ni waktu terbaik memancing! Ikan naik ke permukaan!', night: 'Malam ni bulan penuh, ikan malas makan.',
      lo: 'Kau nelayan juga? Jangan curi tempat aku!', hi: 'Kawan memancing terbaik aku!',
      gos: ['Ada ikan raja di tengah tasik, sisiknya keemasan. Tiada siapa pernah dapat.']
    }),
    SP({
      id: 'yati', n: 'Kak Yati', home: 'r7', job: 'Penenun songket', per: 'pendiam', fam: { suami: 'daud' }, kawan: ['tijah'],
      look: { c: 0xd63384, h: 0x2a2336, td: 1 },
      bio: 'Jarang bercakap, tetapi tenunannya bercerita. Corak "pucuk rebung air terjun" ciptaannya terkenal hingga ke Kerajaan.',
      sch: [[0, 'sleep', 'in'], [6, 'work:cook', 'home'], [8, 'work:weave', 'tenun'], [12, 'eat', 'home'], [13.5, 'work:weave', 'tenun'], [18, 'idle', 'home'], [21, 'sleep', 'in']],
      say: ['…Benang ini dari ulat sutera di pokok sakura.', '…Daud terlalu bising. Tapi saya suka.', '…Setiap corak ada maknanya.'],
      work: ['…(menenun dengan tekun)'],
      rain: '…Hujan baik untuk mewarna benang.', night: '…Selamat malam.',
      lo: '…', hi: '…Kamu kawan. Ambil selendang kecil ini.',
      gos: ['…Kak Tijah lebih tahu tentang benang emas.']
    }),
    SP({
      id: 'nekjah', n: 'Nek Jah', home: 'r8', job: 'Penglipur lara (pencerita)', per: 'bijak', fam: {}, kawan: ['kalsom', 'aminah', 'wahab'],
      look: { c: 0x9b59b6, h: 0xf5f5f5, td: 1, s: 0.9 },
      bio: 'Wanita tertua di kampung (91 tahun). Mengingati zaman sebelum runtuhan Celah Gunung, dan legenda Kelembai Batu yang menyumpah air terjun.',
      sch: [[0, 'sleep', 'in'], [6, 'idle', 'home'], [8, 'chat', 'telaga'], [10, 'idle', 'home'], [16, 'chat', 'dataran'], [18.5, 'idle', 'home'], [20, 'sleep', 'in']],
      say: ['Dulu-dulu, air terjun ini bernyanyi siang malam…', 'Kelembai Batu… sesiapa yang ditegurnya akan menjadi batu.', 'Cu, duduklah. Nenek nak bercerita.'],
      work: ['Nenek dah tua, kerja nenek sekarang bercerita.'],
      rain: 'Masa hujan begini, arwah datuk kamu… eh, bukan, datuk Mat Jenin… suka bersyair.', night: 'Malam bukan masa untuk orang tua merayau, cu.',
      lo: 'Siapa kamu, cu? Mata nenek dah kabur.', hi: 'Kamu cucu kesayangan nenek yang baru!',
      gos: ['Di hutan utara ada kuil lama. Batu-batunya bertulis bahasa yang dah dilupakan.', 'Tiga batu bersurat… satu di puncak helang, satu di tengah air, satu di sarang kelawar.']
    }),
    SP({
      id: 'jalil', n: 'Pak Ngah Jalil', home: 'r16', job: 'Pencari hasil hutan', per: 'pendiam', fam: { adik: 'bujang' }, kawan: ['seman'],
      look: { c: 0x556b2f, h: 0x3a3a3a, hat: 'straw' },
      bio: 'Abang kepada Bujang. Mencari rotan, madu lebah dan damar di hutan. Pernah tersesat tiga hari di Bukit Pasir utara — katanya di seberang sana ada padang pasir tak berpenghujung.',
      sch: [[0, 'sleep', 'in'], [5.5, 'idle', 'home'], [6.5, 'work:forage', 'hutan'], [12, 'eat', 'wakaf'], [13, 'work:forage', 'hutan'], [17.5, 'work:shop', 'dataran'], [19.5, 'idle', 'home'], [21, 'sleep', 'in']],
      say: ['Hutan memberi kalau kita tak tamak.', 'Madu lebah hutan ni manisnya lain.', 'Di seberang Bukit Pasir, angin bawa pasir panas. Salji pula cuma di puncak barat.'],
      work: ['Rotan ini cukup untuk sepuluh bakul.'],
      rain: 'Hujan, lintah keluar. Pakai kasut.', night: 'Hutan malam milik harimau kumbang.',
      lo: 'Hm.', hi: 'Ambil madu ni. Untuk kawan.',
      gos: ['Harimau kumbang turun dekat kampung masa malam. Pak Usu Leman patut berjaga.']
    }),
    SP({
      id: 'tijah', n: 'Kak Tijah', home: 'r10', job: 'Ketua penenun', per: 'gopoh', fam: {}, kawan: ['yati', 'senah'],
      look: { c: 0xf1c40f, h: 0x3a2a2a, td: 1 },
      bio: 'Mengendalikan Rumah Tenun Songket. Sedang menyiapkan songket untuk Raja di Kerajaan — tetapi benang emasnya tidak cukup.',
      sch: [[0, 'sleep', 'in'], [6, 'idle', 'home'], [7, 'work:weave', 'tenun'], [12, 'eat', 'dataran'], [13, 'work:weave', 'tenun'], [18.5, 'chat', 'kedai'], [20, 'idle', 'home'], [22, 'sleep', 'in']],
      say: ['Songket diraja! Kalau siap, kampung kita terkenal!', 'Benang emas! Benang emas! Mana nak cari lagi?', 'Kak Yati tenun corak, Kak Tijah tenun cerita.'],
      work: ['Tolong jangan sentuh kain tu, belum kering!'],
      rain: 'Hujan, warna benang lambat kering!', night: 'Lagi sikit… lagi sikit… siap satu bunga!',
      lo: 'Sibuk ni, sibuk!', hi: 'Kalau songket ni siap, nama kamu kakak sulam di tepinya!',
      gos: ['Mak Senah kata ada saudagar benang di bandar. Tapi jalan ke sana panjang.']
    }),
    SP({
      id: 'leman', n: 'Pak Usu Leman', home: 'r11', job: 'Pengawal malam', per: 'kelakar', fam: {}, kawan: ['senah', 'kasim'],
      look: { c: 0x34495e, h: 0x2a2336, hat: 'cap', hc: 0x2c3e50 },
      bio: 'Berjaga di Menara Tinjau setiap malam. Tidur pada siang hari — dan, menurut Mak Senah, pada malam hari juga.',
      sch: [[0, 'work:guard', 'menara'], [6, 'idle', 'home'], [7, 'sleep', 'in'], [14, 'idle', 'home'], [15, 'chat', 'dataran'], [17, 'eat', 'home'], [19, 'work:guard', 'menara']],
      say: ['Aku tak tidur! Aku… merenung dengan mata tertutup.', 'Dari menara, nampak lampu kampung macam kunang-kunang.', 'Ada bayang besar bergerak dekat air terjun malam tadi…'],
      work: ['Semua aman! …Rasanya.'],
      rain: 'Hujan malam, menara bocor. Aduh.', night: 'Malam aku bertugas! Jangan risau, kampung selamat.',
      lo: 'Siapa tu?! Oh, orang. Fuh.', hi: 'Kawan ronda aku! Jom jaga kampung sama-sama.',
      gos: ['Mak Senah tu cakap aku tidur masa kerja? Dia yang tidur depan kaunter!']
    }),
    SP({
      id: 'matjenin', n: 'Mat Jenin', home: 'r12', job: 'Pemanjat kelapa', per: 'pemimpi', fam: {}, kawan: ['azlan', 'kidam'],
      look: { c: 0xf39c12, h: 0x2a2336 },
      bio: 'Pemuda yang selalu berangan menjadi saudagar kaya. Memanjat pokok kelapa di tepi Tasik Biru — dan pernah jatuh kerana terlalu asyik berangan.',
      sch: [[0, 'sleep', 'in'], [7.5, 'idle', 'home'], [9, 'work:climb', 'jeti'], [12, 'eat', 'wakaf'], [13.5, 'stroll', 'wander'], [16, 'idle', 'wakaf'], [19, 'chat', 'dataran'], [22.5, 'sleep', 'in']],
      say: ['Sepuluh kelapa jadi seratus, seratus jadi kebun, kebun jadi istana!', 'Satu hari nanti aku kahwin dengan puteri raja!', 'Kerja keras? Hmm… berangan pun kerja juga, kan?'],
      work: ['Kelapa ini akan jadi permulaan empayar aku!'],
      rain: 'Hujan pun aku berangan. Lagi syahdu.', night: 'Bintang tu… macam syiling emas.',
      lo: 'Kau saudagar? Nak beli kelapa aku?', hi: 'Kau kawan sejati! Bila aku kaya, kau jadi wazir aku!',
      gos: ['Aku dengar dalam gua ada harta Kelembai. Tapi aku… takut gelap.']
    }),
    SP({
      id: 'esah', n: 'Mak Esah', home: 'r13', job: 'Pembuat kuih', per: 'gopoh', fam: { anak: ['haris', 'harun'] }, kawan: ['limah', 'mona'],
      look: { c: 0x16a085, h: 0x3a2a2a, td: 1 },
      bio: 'Ibu tunggal kepada si kembar Haris dan Harun. Menjual kuih di dataran setiap pagi untuk menyara keluarga.',
      sch: [[0, 'sleep', 'in'], [4.5, 'work:cook', 'home'], [7, 'work:shop', 'dataran'], [11, 'idle', 'home'], [14, 'work:cook', 'home'], [17, 'stroll', 'wander'], [19, 'idle', 'home'], [21, 'sleep', 'in']],
      say: ['Kuih lapis, kuih seri muka, kuih koci! Panas lagi!', 'Haris! Harun! Jangan panjat pokok beringin!', 'Penat? Penat. Tapi anak-anak kena makan.'],
      work: ['Kuih baru angkat dari kukus!'],
      rain: 'Hujan, kuih tak laku. Aduhai.', night: 'Budak berdua tu dah tidur ke belum…',
      lo: 'Nak beli kuih?', hi: 'Kamu dah banyak tolong. Nah, kuih percuma!',
      gos: ['Pencuri bertopeng tu… saya kesian. Mungkin dia lapar.']
    }),
    SP({
      id: 'haris', n: 'Haris', home: 'r13', job: 'Kanak-kanak (10 tahun, kembar sulung)', per: 'nakal', fam: { ibu: 'esah', kembar: 'harun' }, kawan: ['amir'],
      look: { c: 0xe74c3c, h: 0x2a2336, s: 0.76 },
      bio: 'Kembar yang lebih berani (dan lebih nakal). Ketua "Geng Beringin".',
      sch: [[0, 'sleep', 'in'], [7, 'idle', 'home'], [8, 'work:study', 'balai'], [11.5, 'play', 'dataran'], [13, 'eat', 'home'], [14, 'play', 'wander'], [18, 'play', 'dataran'], [19.5, 'idle', 'home'], [20.5, 'sleep', 'in']],
      say: ['Aku Haris, ketua Geng Beringin!', 'Harun tu penakut. Aku tak.', 'Jangan bagitahu Cikgu Aminah apa-apa!'],
      work: ['Belajar? Bosannya…'],
      rain: 'Jom lompat lopak air!', night: 'Kami nak menyelinap tengok wayang kulit!',
      lo: 'Kau siapa? Ahli geng mana?', hi: 'Kau ahli kehormat Geng Beringin!',
      gos: ['Harun kata dia nampak kelembai! Tipu je dia tu.']
    }),
    SP({
      id: 'harun', n: 'Harun', home: 'r13', job: 'Kanak-kanak (10 tahun, kembar bongsu)', per: 'pemalu', fam: { ibu: 'esah', kembar: 'haris' }, kawan: ['puteri'],
      look: { c: 0x2980b9, h: 0x2a2336, s: 0.76 },
      bio: 'Kembar yang pendiam dan suka melukis. Pernah ternampak "mata bercahaya" di balik air terjun.',
      sch: [[0, 'sleep', 'in'], [7, 'idle', 'home'], [8, 'work:study', 'balai'], [11.5, 'play', 'dataran'], [13, 'eat', 'home'], [14, 'idle', 'wakaf'], [18, 'play', 'dataran'], [19.5, 'idle', 'home'], [20.5, 'sleep', 'in']],
      say: ['S-saya lukis air terjun… dan mata merah tu.', 'Haris selalu paksa saya ikut dia.', 'Kakak percaya kelembai wujud?'],
      work: ['Saya suka kelas melukis.'],
      rain: 'Saya suka lukis hujan.', night: 'Saya takut tidur sorang.',
      lo: '…', hi: 'Saya lukis gambar kakak! Nanti saya bagi.',
      gos: ['Loceng Cikgu… err, saya tak tahu apa-apa!']
    }),
    SP({
      id: 'wahab', n: 'Tok Dalang Wahab', home: 'r14', job: 'Dalang wayang kulit', per: 'kelakar', fam: {}, kawan: ['hamzah', 'nekjah'],
      look: { c: 0x7b241c, h: 0xdddddd, hat: 'cap', hc: 0x111111 },
      bio: 'Dalang terakhir di lembah ini. Mempersembahkan wayang kulit di Balai Raya setiap hari keempat dalam seminggu — patung-patungnya diperbuat daripada kulit haiwan buruan.',
      sch: [[0, 'sleep', 'in'], [8, 'idle', 'home'], [9.5, 'work:carve', 'home'], [12, 'eat', 'dataran'], [14, 'work:carve', 'home'], [17, 'chat', 'dataran'], [19.5, 'idle', 'home'], [22.5, 'sleep', 'in']],
      perf: [4, 20, 22.5], /* hari minggu ke-4: persembahan 20:00–22:30 di Balai */
      say: ['Bayang di kelir lebih jujur dari manusia!', 'Malam ni Hikayat Kelembai Batu, jangan lepaskan!', 'Patung Hanuman ni dah tua, kulitnya dah koyak…'],
      work: ['Tebuk… tebuk… ukir halus-halus.'],
      rain: 'Hujan, kelir basah. Persembahan ditangguh!', night: 'Wayang malam ini… atau malam lain. Tengok jadual!',
      lo: 'Penonton baru! Bagus, bagus.', hi: 'Kau penonton paling setia aku!',
      gos: ['Nek Jah tahu versi asal hikayat Kelembai. Versi aku… lebih kelakar.']
    }),
    SP({
      id: 'kasim', n: 'Wak Kasim', home: 'r15', job: 'Tukang kayu & pembuat sampan', per: 'bijak', fam: {}, kawan: ['tahir', 'daud', 'leman'],
      look: { c: 0x795548, h: 0xcccccc, hat: 'straw' },
      bio: 'Membina setiap rumah panggung di kampung ini dengan tangannya sendiri. Kini membina sampan untuk Abang Daud.',
      sch: [[0, 'sleep', 'in'], [6, 'idle', 'home'], [7, 'work:carve', 'jeti'], [12, 'eat', 'home'], [13.5, 'work:carve', 'balai'], [17.5, 'chat', 'dataran'], [19.5, 'idle', 'home'], [21, 'sleep', 'in']],
      say: ['Kayu cengal tahan seratus tahun.', 'Rumah panggung tinggi supaya banjir lalu, rumah kekal.', 'Pasak kayu lebih kuat dari paku, kalau kena caranya.'],
      work: ['Ukur dua kali, potong sekali.'],
      rain: 'Hujan baik — kita tahu bumbung mana yang bocor.', night: 'Mata wak dah tak nampak waktu malam.',
      lo: 'Assalamualaikum, orang muda.', hi: 'Kalau kamu nak rumah sendiri, wak buatkan.',
      gos: ['Pokok beringin di dataran tu lebih tua dari kampung ini sendiri.']
    }),
    SP({
      id: 'bujang', n: 'Bujang', home: 'r16', job: 'Pemburu', per: 'kasar', fam: { abang: 'jalil' }, kawan: ['tahir'],
      look: { c: 0x3e2723, h: 0x111111, p: 0x2d2d2d },
      bio: 'Pemburu terbaik lembah — dan paling tidak suka bercakap. Menjejak babi hutan Taring Besi yang dipercayai menyimpan dendam terhadap kampung.',
      sch: [[0, 'sleep', 'in'], [5, 'work:hunt', 'hutan'], [11, 'idle', 'home'], [13, 'work:hunt', 'ladang'], [17, 'work:train', 'home'], [19, 'eat', 'home'], [20, 'work:hunt', 'ladang'], [23, 'sleep', 'in']],
      say: ['Jejak segar. Tiga ekor. Seekor besar.', 'Babi Taring Besi bukan babi biasa.', 'Busur tak perlu bising. Kau pun begitu.'],
      work: ['Senyap. Kau buat binatang lari.'],
      rain: 'Hujan padam jejak.', night: 'Malam, babi hutan keluar. Aku pun keluar.',
      lo: 'Jangan halang jalan aku.', hi: 'Kau pemburu yang baik. Jarang aku cakap begitu.',
      gos: ['Harimau kumbang turun dari utara. Jangan jalan sorang malam.']
    }),
    SP({
      id: 'kidam', n: 'Pak Long Kidam', home: 'r9', job: 'Penjaga kincir & pengisar padi', per: 'kelakar', fam: { isteri: 'mona' }, kawan: ['seman', 'daud', 'hamzah'],
      look: { c: 0x5d6d7e, h: 0xcccccc, hat: 'straw' },
      bio: 'Menjaga Kincir Air yang mengairi ladang dan mengisar padi. Suka bergurau, kecuali bila kincirnya rosak.',
      sch: [[0, 'sleep', 'in'], [6, 'idle', 'home'], [7, 'work:mill', 'kincir'], [12, 'eat', 'dataran'], [13.5, 'work:mill', 'kincir'], [17.5, 'chat', 'dataran'], [19.5, 'idle', 'home'], [21.5, 'sleep', 'in']],
      say: ['Kincir ni berpusing sejak zaman datuk aku!', 'Air sungai makin perlahan… pelik.', 'Kak Mona aku tu masak nasi lemak paling sedap di dunia. Jangan bagitahu Mak Bedah!'],
      work: ['Bilah kincir ni dah reput. Perlu kayu baru.'],
      rain: 'Hujan! Kincir laju! Ha ha!', night: 'Dengar tu? Bunyi kincir… lagu tidur kampung.',
      lo: 'Kau budak baru? Jangan main dekat kincir!', hi: 'Kawan aku! Nak naik kincir? Gurau je!',
      gos: ['Air terjun senyap, sungai pun perlahan. Mesti ada yang tersumbat di hulu… atau dalam gua.']
    }),
    SP({
      id: 'mona', n: 'Kak Mona', home: 'r9', job: 'Penjual nasi lemak', per: 'ramah', fam: { suami: 'kidam' }, kawan: ['bedah', 'esah'],
      look: { c: 0x27ae60, h: 0x5d4037, td: 1 },
      bio: 'Gerai nasi lemaknya di dataran ialah tempat semua orang berkumpul setiap pagi. Isteri Pak Long Kidam — dan satu-satunya orang yang boleh menyuruhnya diam.',
      sch: [[0, 'sleep', 'in'], [5, 'work:cook', 'home'], [6.5, 'work:shop', 'dataran'], [11, 'idle', 'home'], [15, 'chat', 'telaga'], [17, 'work:cook', 'home'], [20, 'chat', 'dataran'], [21.5, 'sleep', 'in']],
      say: ['Nasi lemak! Sambal pedas, telur mata, ikan bilis!', 'Pak Long tu kalau bercerita, sampai esok tak habis.', 'Makan dulu, kerja kemudian!'],
      work: ['Bungkus satu? Dua? Tiga? Ambillah!'],
      rain: 'Hujan pun orang tetap beratur nasi lemak Kak Mona!', night: 'Esok pagi datang awal, sambal baru!',
      lo: 'Nak nasi lemak, dik?', hi: 'Untuk kamu, sambal lebih dan telur dua!',
      gos: ['Mat Jenin tu kalau kerja sungguh-sungguh, dah lama kaya.']
    })
  ];
  /* item kegemaran (hadiah) */
  W.LIKE = {
    hamzah: ['nasilemak', 'fish'], bedah: ['rempah', 'kelapa'], seman: ['bpadi', 'air'], limah: ['beras', 'garam'], puteri: ['fruit', 'kuih'],
    amir: ['kuih', 'pisang'], senah: ['kuih', 'udang'], tahir: ['arang', 'bijih'], azlan: ['daging', 'sate'], aminah: ['fruit', 'susu'],
    kalsom: ['herba', 'embun'], dayang: ['herba', 'cendawan'], daud: ['umpan', 'fish'], yati: ['benang', 'fruit'], nekjah: ['kuih', 'susu'],
    jalil: ['air', 'daging'], tijah: ['benang', 'kuih'], leman: ['nasilemak', 'kelapa'], matjenin: ['kelapa', 'kuih'], esah: ['tepung', 'egg'],
    haris: ['pisang', 'kuih'], harun: ['fruit', 'kuih'], wahab: ['kulit', 'kuih'], kasim: ['wood', 'nasilemak'], bujang: ['taring', 'daging'],
    kidam: ['wood', 'nasilemak'], mona: ['egg', 'rempah']
  };
})();
