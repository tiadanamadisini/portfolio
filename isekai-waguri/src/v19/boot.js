/* ===== V19 BOOT — sistem preloading profesional (Seksyen 11)
   Aliran: logo → FASA A (aset kritikal, progress sebenar 0–100%) → MENU UTAMA (TERUSKAN / MULA BAHARU / GRAFIK)
           → FASA B (bina dunia + sistem permainan + model + shader, progress sebenar) → semakan kritikal → WORLD READY → MAIN.
   Progress = berat tugasan yang SUDAH siap (kod yang dilaksanakan, bait yang dinyahmampat, sistem yang melaporkan siap).
   Tiada pemasa palsu. Jika tugasan kritikal gagal: skrin ralat + butang RETRY; pemain tidak dibawa masuk ke dunia yang rosak. ===== */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const VER='19.0',SK='waguri_isekai_v1';
const LSg=k=>{try{return localStorage.getItem(k)}catch(e){return null}},LSs=(k,v)=>{try{localStorage.setItem(k,v);return true}catch(e){return false}},LSr=k=>{try{localStorage.removeItem(k)}catch(e){}};
const SSg=k=>{try{return sessionStorage.getItem(k)}catch(e){return null}},SSs=(k,v)=>{try{sessionStorage.setItem(k,v)}catch(e){}},SSr=k=>{try{sessionStorage.removeItem(k)}catch(e){}};
const nRAF=window.requestAnimationFrame.bind(window),nCAF=window.cancelAnimationFrame.bind(window);
const frame=()=>new Promise(r=>{let ok=0;const f=()=>{if(!ok){ok=1;setTimeout(r,0)}};nRAF(f);setTimeout(f,60)});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const now=()=>performance.now();
const fmtB=n=>n>=1048576?(n/1048576).toFixed(2)+' MB':n>=1024?Math.round(n/1024)+' KB':n+' B';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);

const B={v:VER,done:false,phase:'',warn:[],errs:[],jobs:[],cur:null,curErr:null,t0:now(),tA:0,tB:0,mode:null,assets:{},summary:null,checks:[],stageMs:{},holdRAF:false};
window.BOOT19=B;

/* ---------------------------------------------------------------- tahap grafik (5 pilihan, perbezaan ciri sebenar) */
const TIERS=[
 {k:'lite',n:'Biasa',ic:'⚪',d:'Telefon kelas rendah · watak prosedural · tiada pasca-proses · bayang 1K',q:'lo'},
 {k:'biasa',n:'Medium',ic:'🟢',d:'Telefon sederhana · HDR, bloom, AO, sinaran matahari · bayang 2K',q:'md'},
 {k:'sine',n:'High',ic:'🎬',d:'Model GLB Waguri + 23 animasi · gaya anime · cahaya volumetrik',q:'md'},
 {k:'ultra',n:'Ultra',ic:'🔥',d:'Bayang lembut PCSS · FX penuh · jaring rupa bumi padat · bayang 4K',q:'hi'},
 {k:'ext',n:'Extreme',ic:'💎',d:'Supersampling 1.25× · AO resolusi penuh · rumput paling padat',q:'hi'}];
const MOB=(typeof matchMedia==='function'&&matchMedia('(pointer:coarse)').matches)||/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent||'');
const MEM=navigator.deviceMemory||(MOB?4:8);
const REC=MEM<=3?'lite':MEM<=4?'biasa':MOB?'sine':'ultra';
const tierOf=k=>TIERS.find(t=>t.k===k)||null;
let tier=tierOf(LSg('waguri_gfx'))?LSg('waguri_gfx'):REC;
const needGLB=k=>['sine','ultra','ext'].includes(k);

/* ---------------------------------------------------------------- UI */
const U={root:$('b19'),bg:document.querySelector('#b19 .b19-bg'),ld:$('b19ld'),ph:$('b19ph'),pct:$('b19pct'),bar:$('b19bar'),st:$('b19st'),sub:$('b19sub'),tip:$('b19tip'),
 menu:$('b19menu'),gfx:$('b19gfx'),err:$('b19err'),em:$('b19em'),ed:$('b19ed'),ready:$('b19ready'),rp:$('b19rp'),w:$('b19w'),play:$('b19play'),dev:$('b19dev')};
const show=el=>{[U.ld,U.menu,U.gfx,U.err,U.ready].forEach(x=>{if(x)x.hidden=x!==el})};
const TIPS=['<b>Tip:</b> Ketik peta bulat di kanan atas, pilih tempat dan tekan 🚀 Pergi untuk teleport.','<b>Tip:</b> Kerajaan berada di tengah pulau — dikelilingi dua terusan dan 16 jambatan.',
 '<b>Tip:</b> Malam gelap! Ambil 🏮 tanglung di depan rumah sebelum meneroka.','<b>Tip:</b> Tekan ✋ KANAN untuk tukar alat: 🧹 penyapu · 🪓 kapak · 🎣 joran.',
 '<b>Tip:</b> Paya Bakau penuh buaya 🐊 — bawa senjata dan ubat.','<b>Tip:</b> Kemajuan disimpan automatik setiap 4 saat. ⚙ Tetapan → 💾 untuk salin kod sandaran.',
 '<b>Tip:</b> Padang Pasir di timur laut ada portal 🌀 ke Pulau Rahsia.','<b>Tip:</b> Ikut 🌲 Laluan Hutan Jauh sampai ke 3 bendera 🚩 di hujung peta.',
 '<b>Tip:</b> Lanun datang dari Pulau Lanun di tenggara — bina pagar pertahanan!','<b>Tip:</b> Level maksimum ialah 60 (≈100 juta EXP). Misi sampingan ❗ beri EXP besar.'];
let tipI=Math.floor(Math.random()*TIPS.length);
const nextTip=()=>{if(!U.tip)return;U.tip.style.opacity=0;setTimeout(()=>{U.tip.innerHTML=TIPS[tipI++%TIPS.length];U.tip.style.opacity=1},380)};
nextTip();const tipT=setInterval(nextTip,6500);
if(U.dev)U.dev.textContent=(MOB?'mudah alih':'PC')+' · RAM≈'+MEM+' GB';

/* ---------------------------------------------------------------- penjejak progress (berat tugasan sebenar) */
let PG=null;
function Prog(name,tasks){this.name=name;this.t=tasks.map(x=>Object.assign({f:0,st:0},x));this.W=this.t.reduce((a,x)=>a+x.w,0)||1;this.cur=null;this.lastUI=0;U.ph.textContent=name;}
Prog.prototype.get=function(id){return this.t.find(x=>x.id===id)};
Prog.prototype.start=function(id,sub){const x=this.get(id);if(!x)return;x.st=1;x.t0=now();this.cur=x;this.ui(sub||'',true)};
Prog.prototype.frac=function(id,f,sub){const x=this.get(id);if(!x)return;x.f=Math.max(x.f,Math.min(1,f));this.ui(sub)};
Prog.prototype.done=function(id,sub){const x=this.get(id);if(!x)return;x.f=1;x.st=2;x.ms=now()-(x.t0||now());this.ui(sub,true)};
Prog.prototype.pct=function(){return this.t.reduce((a,x)=>a+x.w*x.f,0)/this.W*100};
Prog.prototype.ui=function(sub,force){const n=now();if(!force&&n-this.lastUI<50)return;this.lastUI=n;const p=Math.min(100,this.pct());
 U.bar.style.width=p.toFixed(1)+'%';U.pct.textContent=Math.floor(p)+'%';if(this.cur)U.st.textContent=this.cur.label;if(sub!=null)U.sub.textContent=sub};

/* ---------------------------------------------------------------- ralat */
let fatalShown=false;
function fatal(title,list,canRetry){
 if(fatalShown)return;fatalShown=true;B.fatal={title,list};
 try{console.error('[BOOT19] GAGAL:',title,list)}catch(e){}
 U.em.textContent=title;U.ed.textContent=list.map(x=>'• '+x).join('\n')+'\n\nPeranti: '+navigator.userAgent+'\nVersi: v'+VER+' · fasa '+B.phase+' · '+Math.round((now()-B.t0)/1000)+' s';
 show(U.err);$('b19retry').hidden=canRetry===false;
}
$('b19retry').onclick=()=>{if(B.phase==='A'){fatalShown=false;B.errs=[];phaseA()}else{SSs('waguri_boot_auto','continue');location.reload()}};
$('b19copy').onclick=()=>{const t=U.ed.textContent;try{navigator.clipboard.writeText(t).then(()=>{$('b19copy').textContent='✅ Disalin'})}catch(e){const r=document.createRange();r.selectNodeContents(U.ed);const s=getSelection();s.removeAllRanges();s.addRange(r)}};
const onErr=e=>{const msg=(e&&e.message)||(e&&e.reason&&e.reason.message)||String(e&&e.reason||e);if(B.cur){if(!B.curErr)B.curErr=msg}else if(!B.done&&B.phase)B.warn.push('Ralat latar: '+msg)};
addEventListener('error',onErr,true);addEventListener('unhandledrejection',onErr);
/* ralat yang ditangkap oleh try/catch lapisan asal (console.error) direkod sebagai amaran semasa loading */
const cerr=console.error.bind(console);console.error=function(){try{if(!B.done&&B.phase){const s=Array.from(arguments).map(a=>a&&a.message?a.message:typeof a==='string'?a:(()=>{try{return JSON.stringify(a)}catch(e){return String(a)}})()).join(' ');B.warn.push((B.cur?'['+B.cur+'] ':'')+s.slice(0,240))}}catch(e){}return cerr.apply(console,arguments)};

/* ---------------------------------------------------------------- penyahmampat gzip dengan progress bait sebenar */
function b64u8(s){s=s.replace(/\s+/g,'');const bin=atob(s),n=bin.length,u=new Uint8Array(n);for(let i=0;i<n;i++)u[i]=bin.charCodeAt(i);return u}
async function gunzipP(u8,onP){
 if(typeof DecompressionStream==='undefined')throw new Error('Pelayar/WebView tiada DecompressionStream (perlukan Chrome 80+)');
 if(u8[0]!==0x1f||u8[1]!==0x8b)throw new Error('bukan data gzip (aset rosak)');
 const isz=(u8[u8.length-4]|u8[u8.length-3]<<8|u8[u8.length-2]<<16|u8[u8.length-1]<<24)>>>0;
 const rd=new Blob([u8]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();const parts=[];let got=0,lt=0;
 for(;;){const{value,done}=await rd.read();if(done)break;parts.push(value);got+=value.byteLength;const n=now();if(onP&&n-lt>40){lt=n;onP(got,isz);await frame()}}
 if(isz&&got%4294967296!==isz)throw new Error('saiz nyahmampat tidak sepadan ('+got+' ≠ '+isz+')');
 const out=new Uint8Array(got);let o=0;for(const p of parts){out.set(p,o);o+=p.byteLength}onP&&onP(got,isz);return out.buffer}
function decodeImg(url){return new Promise((res,rej)=>{const im=new Image();im.onload=()=>{(im.decode?im.decode().catch(()=>{}):Promise.resolve()).then(()=>res(im))};im.onerror=()=>rej(new Error('imej gagal dinyahkod'));im.src=url})}
function blobURL(u8,type){return URL.createObjectURL(new Blob([u8],{type}))}
/* cache aset: dikongsi dengan pemuat asal (WGM.parse & NPC15) supaya aset dinyahkod SEKALI sahaja */
B.assets={};
window.__W19A={take(id,len){const a=B.assets[id];if(a&&a.raw&&(!len||a.len===len)){const r=a.raw;a.raw=null;a.used=1;return r}return null}};

/* ---------------------------------------------------------------- tugasan aset */
async function taskWorld(){
 const D=window.W19D;if(!D||!D.gz)throw new Error('Data grid dunia V19 tiada dalam fail');
 if(D.buf)return;const u8=b64u8(D.gz);
 D.buf=await gunzipP(u8,(g,t)=>PG.frac('world',t?g/t:0,'Grid ketinggian & kawasan · '+fmtB(g)+' / '+fmtB(t)));D.gz=null;
 const dv=new DataView(D.buf);if(String.fromCharCode(dv.getUint8(0),dv.getUint8(1),dv.getUint8(2),dv.getUint8(3))!=='W19G')throw new Error('Data grid dunia rosak');
}
async function taskMap(){
 if(window.W19D&&W19D.mapURL)return;const el=$('w17img');if(!el)throw new Error('Gambar MASTER MAP tiada');
 const u8=b64u8(el.textContent);PG.frac('map',.4,'MASTER MAP · JPEG '+fmtB(u8.length));const url=blobURL(u8,'image/jpeg');const im=await decodeImg(url);
 if(im.naturalWidth!==1536||im.naturalHeight!==1024)throw new Error('Saiz MASTER MAP salah: '+im.naturalWidth+'×'+im.naturalHeight);
 W19D.mapURL=url;W19D.mapImg=im;if(U.bg){U.bg.style.backgroundImage='url('+url+')';U.bg.classList.add('b19-on')}
}
async function taskGz(id,label){
 if(B.assets[id]&&(B.assets[id].raw||B.assets[id].used))return;const el=$(id);if(!el)throw new Error(label+': data terbenam tiada');
 const s=el.textContent.replace(/\s+/g,'');const u8=b64u8(s);
 const raw=await gunzipP(u8,(g,t)=>PG.frac(id,t?g/t:0,label+' · '+fmtB(g)+' / '+fmtB(t)));
 B.assets[id]={raw,len:s.length,bytes:raw.byteLength};
}
async function taskImgEl(id,label){
 const el=$(id);if(!el)throw new Error(label+': data terbenam tiada');const u8=b64u8(el.textContent);const im=await decodeImg(blobURL(u8,'image/jpeg'));
 B.assets[id]={img:im,w:im.naturalWidth,h:im.naturalHeight};PG.frac(id,1,label+' · '+im.naturalWidth+'×'+im.naturalHeight);
}
function taskDevice(){
 const c=document.createElement('canvas');let gl=null;try{gl=c.getContext('webgl2')||c.getContext('webgl')||c.getContext('experimental-webgl')}catch(e){}
 if(!gl)throw new Error('WebGL tidak tersedia pada peranti ini. Kemas kini Android System WebView / Chrome, atau aktifkan pecutan perkakasan.');
 const mt=gl.getParameter(gl.MAX_TEXTURE_SIZE);B.gpu={webgl2:typeof WebGL2RenderingContext!=='undefined'&&gl instanceof WebGL2RenderingContext,maxTex:mt};
 try{const ext=gl.getExtension('WEBGL_debug_renderer_info');if(ext)B.gpu.name=String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL))}catch(e){}
 try{const l=gl.getExtension('WEBGL_lose_context');if(l)l.loseContext()}catch(e){}
 if(typeof DecompressionStream==='undefined')throw new Error('WebView terlalu lama: tiada DecompressionStream (perlukan Chrome/WebView 80+)');
 let ls=false;try{localStorage.setItem('waguri_boot_t','1');localStorage.removeItem('waguri_boot_t');ls=true}catch(e){}
 if(!ls)B.warn.push('Storan tempatan tidak tersedia — kemajuan TIDAK akan disimpan');
 return (B.gpu.webgl2?'WebGL2':'WebGL1')+' · tekstur maks '+mt+(B.gpu.name?' · '+B.gpu.name:'');
}
function readSave(){
 const raw=LSg(SK);B.saveRaw=raw;B.summary=null;B.saveBad=false;
 if(!raw)return 'Tiada simpanan — permainan baharu';
 try{const j=JSON.parse(raw);if(!j||typeof j!=='object'||Array.isArray(j))throw new Error('format');
  const I=v=>Number.isFinite(+v)?Math.floor(+v):0;
  B.summary={day:Math.max(1,I(j.day)),lvl:I(j.plv),coin:I(j.coin),mq:I(j.lv),keys:Object.keys(j).length,bytes:raw.length};
  return 'Simpanan sah · Hari '+B.summary.day+' · Level '+B.summary.lvl+' · '+fmtB(raw.length);
 }catch(e){B.saveBad=true;return 'Simpanan ROSAK — tidak boleh diteruskan'}
}
const backups=()=>['_bak19','_bak18','_bak15'].map(s=>SK+s).filter(k=>{const v=LSg(k);if(!v)return false;try{const j=JSON.parse(v);return j&&typeof j==='object'}catch(e){return false}});

/* ---------------------------------------------------------------- tahap: kod permainan yang tidak dilaksanakan sehingga pemuat memanggilnya */
const STAGES=Array.from(document.querySelectorAll('script[type="text/x-waguri19"]')).map(el=>({el,i:+el.dataset.i,name:el.dataset.name,label:el.dataset.label,ph:el.dataset.ph,crit:el.dataset.crit==='1',w:+el.dataset.w||1,bytes:el.textContent.length}));
B.STAGES=STAGES.map(s=>({i:s.i,name:s.name,ph:s.ph,crit:s.crit,w:s.w,bytes:s.bytes}));
let prof={};try{prof=JSON.parse(LSg('waguri_boot_prof19')||'{}')||{}}catch(e){}
const pw=(k,d)=>prof[k]!=null?Math.max(1,Math.min(600,Math.round(prof[k]/25))):d;
const wOf=s=>Math.max(1,Math.round(prof[s.name]!=null?Math.min(400,prof[s.name]/25):s.w));
const AFTER={};  /* cangkuk selepas tahap tertentu */
function runStage(s){
 B.cur=s.name;B.curErr=null;const t=now();
 const sc=document.createElement('script');sc.text=s.el.textContent+'\n//# sourceURL=waguri19/'+s.i+'-'+s.name+'.js';
 try{document.head.appendChild(sc)}catch(e){B.curErr=B.curErr||e.message}
 sc.remove();s.el.textContent='';      /* bebaskan memori teks sumber */
 const ms=now()-t;B.stageMs[s.name]=Math.round(ms);
 const err=B.curErr;B.cur=null;
 if(err){if(s.crit)throw new Error('Sistem kritikal "'+s.label+'" gagal: '+err);B.warn.push('['+s.label+'] '+err)}
 if(AFTER[s.name])try{AFTER[s.name]()}catch(e){B.warn.push('cangkuk '+s.name+': '+e.message)}
}

/* ---------------------------------------------------------------- FASA A: aset kritikal */
async function phaseA(){
 B.phase='A';show(U.ld);const tA=now();
 const eng=STAGES.filter(s=>s.ph==='A');const glb=needGLB(tier);
 PG=new Prog('Memuatkan aset kritikal',[
  {id:'dev',label:'Memeriksa peranti & WebGL',w:2},
  ...eng.map(s=>({id:'st:'+s.name,label:s.label,w:wOf(s)})),
  {id:'font',label:'Memuatkan fon',w:2},
  {id:'world',label:'Menyahkod data dunia (Loading World)',w:6},
  {id:'map',label:'Menyahkod MASTER MAP',w:4},
  ...(glb?[{id:'wgm14',label:'Menyahkod model 3D Waguri (GLB)',w:16},{id:'wnp15',label:'Menyahkod model penduduk 3D (Preparing NPC)',w:12},{id:'wnp15t',label:'Menyahkod tekstur penduduk (Loading Textures)',w:4}]:[]),
  {id:'save',label:'Membaca & mengesahkan data simpanan',w:2}]);
 try{
  PG.start('dev');await frame();const dv=taskDevice();PG.done('dev',dv);await frame();
  for(const s of eng){if(!s.el.textContent){PG.done('st:'+s.name);continue}PG.start('st:'+s.name,'Kod '+fmtB(s.bytes));await frame();runStage(s);PG.done('st:'+s.name,s.label+' · '+B.stageMs[s.name]+' ms');}
  if(typeof THREE==='undefined'||!THREE.WebGLRenderer)throw new Error('Enjin 3D (three.js) gagal dimuatkan');
  PG.start('font');try{if(document.fonts&&document.fonts.load){await Promise.race([Promise.all([document.fonts.load("800 16px 'Plus Jakarta Sans'"),document.fonts.load("500 14px 'Plus Jakarta Sans'")]),sleep(4000)])}}catch(e){B.warn.push('Fon: '+e.message)}PG.done('font','Plus Jakarta Sans');
  PG.start('world');await taskWorld();PG.done('world','Grid '+W19D.GW+'×'+W19D.GH+' · '+fmtB(W19D.buf.byteLength));
  PG.start('map');await taskMap();PG.done('map','MASTER MAP 1536×1024');
  if(glb){PG.start('wgm14');await taskGz('wgm14','Model Waguri');PG.done('wgm14','Model Waguri · '+fmtB(B.assets.wgm14.bytes));
   PG.start('wnp15');await taskGz('wnp15','Penduduk 3D');PG.done('wnp15','20 reka bentuk · '+fmtB(B.assets.wnp15.bytes));
   PG.start('wnp15t');await taskImgEl('wnp15t','Tekstur');PG.done('wnp15t')}
  PG.start('save');const sv=readSave();PG.done('save',sv);
 }catch(e){return fatal('Aset kritikal gagal dimuatkan',[(PG.cur?PG.cur.label+': ':'')+e.message],true)}
 B.tA=Math.round(now()-tA);U.st.textContent='Aset sedia';U.sub.textContent='Fasa A siap dalam '+(B.tA/1000).toFixed(1)+' s';await sleep(250);
 const auto=SSg('waguri_boot_auto');if(auto){SSr('waguri_boot_auto');return phaseB(auto==='new'?'new':'continue')}
 menu();
}

/* ---------------------------------------------------------------- MENU UTAMA */
function menu(){
 B.phase='M';const s=B.summary,bk=backups();
 const cont=s?'<button class="b19-btn b19-pri" id="b19c"><span>▶ TERUSKAN<small>CONTINUE · Hari '+s.day+' · Level '+s.lvl+' · RM '+s.coin.toLocaleString('en-US')+' · Misi utama '+(s.mq+1)+'</small></span><b>›</b></button>'
  :'<button class="b19-btn" id="b19c" disabled><span>▶ TERUSKAN<small>'+(B.saveBad?'Simpanan rosak — tidak boleh diteruskan':'Tiada simpanan lagi')+'</small></span></button>';
 const t=tierOf(tier);
 U.menu.innerHTML=cont+
  '<button class="b19-btn'+(s?'':' b19-pri')+'" id="b19n"><span>✨ MULA BAHARU<small>START GAME · bermula di rumah Waguri, Pantai Timur</small></span><b>›</b></button>'+
  '<button class="b19-btn" id="b19g"><span>⚙ GRAFIK: '+t.ic+' '+t.n+'<small>'+t.d+'</small></span><b>›</b></button>'+
  (B.saveBad&&bk.length?'<button class="b19-btn" id="b19r"><span>🛟 PULIHKAN SANDARAN<small>'+bk.length+' sandaran automatik ditemui</small></span><b>›</b></button>':'');
 show(U.menu);
 $('b19c').onclick=()=>{if(s)phaseB('continue')};
 $('b19n').onclick=()=>s?confirmNew():phaseB('new');
 $('b19g').onclick=gfxMenu;
 if($('b19r'))$('b19r').onclick=()=>{const v=LSg(bk[0]);if(v){LSs(SK+'_rosak19',B.saveRaw||'');LSs(SK,v);readSave();menu()}};
 setTimeout(()=>{const b=$('b19c');(b&&!b.disabled?b:$('b19n')).focus()},50);
}
function confirmNew(){
 const s=B.summary;
 U.menu.innerHTML='<h2>Mula permainan baharu?</h2><p style="font-size:12px;color:#cbd5e1;margin:0 0 6px;text-align:left">Simpanan sekarang (Hari '+s.day+' · Level '+s.lvl+' · RM '+s.coin.toLocaleString('en-US')+') akan disandarkan sebagai <b>Sandaran v19</b> sebelum dipadam, dan boleh dipulihkan melalui ⚙ Tetapan → 💾 Sandaran.</p>'+
  '<div class="b19-row"><button class="b19-btn b19-pri" id="b19y">Ya, mula baharu</button><button class="b19-btn" id="b19x">Batal</button></div>';
 $('b19y').onclick=()=>phaseB('new');$('b19x').onclick=menu;$('b19x').focus();
}
function gfxMenu(){
 U.gfx.innerHTML='<h2>⚙ Tahap grafik</h2>'+TIERS.map((t,i)=>'<button class="b19-btn'+(t.k===tier?' b19-on':'')+'" data-k="'+t.k+'"><span>'+(i+1)+'. '+t.ic+' '+t.n+(t.k===REC?'<em class="b19-rec">Disyorkan</em>':'')+'<small>'+t.d+'</small></span><b>'+(t.k===tier?'✓':'')+'</b></button>').join('')+
  '<button class="b19-btn" id="b19gb" style="justify-content:center">‹ Kembali</button>';
 show(U.gfx);
 U.gfx.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{tier=b.dataset.k;gfxMenu()});
 $('b19gb').onclick=menu;
}

/* ---------------------------------------------------------------- FASA B: bina dunia & sistem */
const CHECK_WAIT=[  /* sistem tak segerak yang mesti melaporkan siap sebelum WORLD READY: [id, label, syarat, kritikal, perlu?] */
 ['w17','Mercu tanda MASTER MAP (Kerajaan, kampung, pelabuhan, gua…)',()=>window.W17&&W17.ok,1],
 ['v9','Haiwan, lampu jalan & ternakan',()=>typeof V9X!=='undefined'&&V9X.AN,1],
 ['paya','Paya Bakau & Laluan Hutan Jauh',()=>window.SW14&&SW14.ok,1],
 ['rpg','Level & misi utama',()=>window.RPG14&&RPG14.ok,1],
 ['qs','Misi sampingan & penduduk',()=>window.QS14&&QS14.ok,1],
 ['cb','Sistem pertempuran',()=>window.CB14&&CB14.ok,1],
 ['fish','Memancing',()=>window.FISH14&&FISH14.ok,1],
 ['evt','Acara kampung',()=>window.EVT14&&EVT14.ok,0],
 ['lanun','Lanun & pertahanan',()=>window.LANUN14&&LANUN14.ok,0],
 ['glb','Model 3D Waguri + animasi',()=>window.G14&&G14.ready,1,()=>window.GFX14&&GFX14.glb],
 ['npc3d','Model penduduk 3D',()=>window.NPC15&&NPC15.ok,1,()=>window.GFX14&&GFX14.glb],
];
async function phaseB(mode){
 B.phase='B';B.mode=mode;show(U.ld);const tB=now();
 const t=tierOf(tier)||tierOf(REC);LSs('waguri_gfx',t.k);LSs('waguri_q',t.q);
 if(mode==='new'&&B.saveRaw){LSs(SK+'_bak19',B.saveRaw);LSr(SK)}
 const st=STAGES.filter(s=>s.ph==='B'),glb=needGLB(t.k);
 const waits=CHECK_WAIT;
 PG=new Prog(mode==='new'?'Memulakan dunia baharu':'Memuatkan dunia & simpanan',[
  ...(glb?[{id:'assets',label:'Menyemak aset grafik '+t.n,w:6}]:[]),
  ...st.map(s=>({id:'st:'+s.name,label:s.label,w:wOf(s)})),
  {id:'sys',label:'Memulakan sistem permainan (Initializing Game Systems)',w:pw('__sys',320)},
  {id:'shd',label:'Menyusun shader & bahan (Loading Textures)',w:pw('__shd',20)},
  {id:'warm',label:'Memanaskan GPU di kawasan permulaan',w:pw('__warm',60)},
  {id:'chk',label:'Mengesahkan sistem kritikal',w:3}]);
 try{
  if(glb){PG.start('assets');if(!B.assets.wgm14||(!B.assets.wgm14.raw&&!B.assets.wgm14.used))await taskGz('wgm14','Model Waguri');PG.frac('assets',.6);
   if(!B.assets.wnp15||(!B.assets.wnp15.raw&&!B.assets.wnp15.used))await taskGz('wnp15','Penduduk 3D');if(!B.assets.wnp15t)await taskImgEl('wnp15t','Tekstur');PG.done('assets')}
  /* tahan gelung permainan sehingga semua kod dilaksanakan (urutan deterministik) */
  const q=[];B.holdRAF=true;window.requestAnimationFrame=function(cb){if(B.holdRAF){q.push(cb);return 0}return nRAF(cb)};
  for(const s of st){PG.start('st:'+s.name,'Kod '+fmtB(s.bytes));await frame();runStage(s);PG.done('st:'+s.name,s.label+' · '+B.stageMs[s.name]+' ms')}
  B.holdRAF=false;window.requestAnimationFrame=nRAF;q.splice(0).forEach(cb=>nRAF(cb));
  /* sistem tak segerak: when14 + bendera siap */
  PG.start('sys');const T0=now(),LIM=180000;let lastN=-1;
  for(;;){const jobs=B.jobs,jd=jobs.filter(j=>j.done).length,need=waits.filter(w=>!w[4]||w[4]()),ok=need.filter(w=>{try{return!!w[2]()}catch(e){return false}});
   const tot=jobs.length+need.length,dn=jd+ok.length;PG.frac('sys',tot?dn/tot:1,'Sistem siap '+dn+'/'+tot+(now()-T0>8000?' · '+Math.round((now()-T0)/1000)+' s':''));
   const pend=need.filter(w=>!ok.includes(w));
   if(jd===jobs.length&&!pend.length)break;
   if(dn!==lastN){lastN=dn;if(pend[0])U.st.textContent='Menunggu: '+pend[0][1]}
   const deadJ=jobs.filter(j=>j.done===-1);
   if(now()-T0>LIM||deadJ.length){const crit=pend.filter(w=>w[3]).map(w=>w[1]+' — tidak melaporkan siap');const dj=deadJ.map(j=>'Penantian tamat masa: '+j.cond);
    if(crit.length||dj.length)throw new Error('Sistem tidak siap:\n'+crit.concat(dj).join('\n'));pend.forEach(w=>B.warn.push(w[1]+' belum siap'));break}
   await sleep(120)}
  PG.done('sys');
  /* shader: susun semua bahan yang kelihatan sebelum main */
  PG.start('shd');await frame();try{const c0=renderer.info.programs?renderer.info.programs.length:0;renderer.compile(scene,camera);PG.done('shd',(renderer.info.programs?renderer.info.programs.length:0)+' program shader ('+c0+' sebelum)')}catch(e){B.warn.push('compile: '+e.message);PG.done('shd')}
  PG.start('warm');for(let i=0;i<4;i++){await frame();PG.frac('warm',(i+1)/4,'Bingkai '+(i+1)+'/4 · '+(renderer.info.render.calls)+' panggilan lukis')}PG.done('warm');
  PG.start('chk');await frame();const res=verify();B.checks=res;const bad=res.filter(r=>!r.ok&&r.crit);
  if(bad.length)throw new Error('Semakan kritikal gagal:\n'+bad.map(r=>r.n+' — '+r.d).join('\n'));
  PG.done('chk',res.filter(r=>r.ok).length+'/'+res.length+' semakan lulus');
 }catch(e){B.holdRAF=false;window.requestAnimationFrame=nRAF;return fatal('Dunia tidak dapat dimuatkan dengan selamat',String(e.message).split('\n'),true)}
 B.tB=Math.round(now()-tB);
 try{const pr={};STAGES.forEach(s=>{if(B.stageMs[s.name]!=null)pr[s.name]=B.stageMs[s.name]});['sys','shd','warm'].forEach(k=>{const x=PG.get(k);if(x&&x.ms!=null)pr['__'+k]=Math.round(x.ms)});LSs('waguri_boot_prof19',JSON.stringify(pr))}catch(e){}
 ready();
}

/* ---------------------------------------------------------------- semakan kritikal (syarat penerimaan Seksyen 11) */
function verify(){
 const R=[],ck=(n,crit,f)=>{let ok=false,d='';try{const r=f();ok=r===true||(r&&r.ok);d=r&&r.d||''}catch(e){d=e.message}R.push({n,crit:!!crit,ok:!!ok,d})};
 const fin=v=>typeof v==='number'&&isFinite(v);
 ck('Watak utama dimuatkan',1,()=>({ok:typeof player!=='undefined'&&player&&player.parent===scene,d:'player dalam adegan'}));
 ck('Model & animasi watak',1,()=>{if(window.GFX14&&GFX14.glb){const n=G14&&G14.act?Object.keys(G14.act).length:0,need=['Biasa','Jalan','Lari','Berenang','Lompat'];return{ok:G14.ready&&n>=20&&need.every(k=>G14.act[k]),d:'GLB · '+n+' animasi'}}return{ok:!!(legL&&legR&&armL&&armR),d:'model prosedural (tahap '+(GFX14&&GFX14.lv)+')'}});
 ck('Rupa bumi kawasan permulaan',1,()=>{const g=W8.ter&&W8.ter.geometry,n=g?g.attributes.position.count:0;return{ok:n>20000&&fin(W8.SF(P.x,P.z)),d:n+' bucu'}});
 ck('Pemain berdiri di atas tanah',1,()=>{const g=(window.gY2||gY)(P.x,P.z);return{ok:fin(P.y)&&fin(g)&&Math.abs(P.y-g)<3,d:'y='+(+P.y).toFixed(2)+' tanah='+(+g).toFixed(2)}});
 ck('Bangunan, jalan, jambatan',1,()=>({ok:W8.rd.length>=20&&W8.dk.length>=10&&!!roofG,d:W8.rd.length+' jalan · '+W8.dk.length+' jambatan/jeti'}));
 ck('Sungai & air terjun',1,()=>({ok:!!(W8.RX&&W8.RX.n>10&&W8.wm),d:'sungai '+W8.RX.n+' titik'}));
 ck('Pelanggaran (collision) & interaksi',1,()=>({ok:OB.length>200&&ST.length>40&&typeof solid==='function',d:OB.length+' halangan · '+ST.length+' titik interaksi'}));
 ck('NPC penting & rutin',1,()=>{const tk=QS14&&QS14.npc&&QS14.npc('Tok Ketua');return{ok:npcs.length>=20&&!!tk,d:npcs.length+' NPC bernama · Tok Ketua '+(tk?'ada':'TIADA')}});
 ck('Sistem misi',1,()=>({ok:Q.length>=50&&QS14.SQ.length>=20&&RPG14.ok,d:Q.length+' misi utama · '+QS14.SQ.length+' sampingan'}));
 ck('Inventori & ekonomi',1,()=>({ok:!!(GS&&GS.inv&&typeof GS.coin==='number'&&Object.keys(IT).length>=40),d:Object.keys(IT).length+' jenis barang · RM'+GS.coin}));
 ck('Pertempuran',1,()=>({ok:!!(CB14&&CB14.ok&&Object.keys(CB14.SPEC).length>=8),d:Object.keys(CB14.SPEC).length+' jenis musuh'}));
 ck('Kamera',1,()=>({ok:camera&&camera.isPerspectiveCamera&&fin(camera.position.x)&&fin(camera.position.y),d:'FOV '+camera.fov}));
 ck('Kawalan skrin sentuh',1,()=>{const js=$('js'),jp=$('jp');return{ok:!!(js&&jp&&getComputedStyle(js).display!=='none'),d:'kayu bedik & butang lompat'}});
 ck('Data simpanan dibaca & disahkan',1,()=>{const s=B.summary;if(B.mode==='continue'&&s)return{ok:GS.day>=s.day&&GS.day<=s.day+1&&(GS.plv||0)===s.lvl&&GS.coin>=0,d:'Hari '+GS.day+' · Level '+(GS.plv||0)+' (fail: Hari '+s.day+' · Level '+s.lvl+')'};return{ok:GS.day>=1,d:'permainan baharu · Hari '+GS.day}});
 ck('Pencahayaan & tetapan grafik',1,()=>({ok:!!(sun&&hemi&&renderer&&window.GFX14&&GFX14.lv===tier),d:'tahap '+(GFX14&&GFX14.names[GFX14.lv])}));
 ck('Peta dalam game (MASTER MAP)',1,()=>({ok:!!(W17.v===19&&W17.mapCanvas()),d:'1536×1024 · '+W17.LOC.length+' lokasi'}));
 ck('Semua lokasi asal wujud',0,()=>{const miss=(W19D.LOC||[]).filter(L=>!W17.LOC.some(l=>l[1]===L.n));return{ok:!miss.length,d:miss.length?'hilang: '+miss.map(m=>m.n).join(', '):W19D.LOC.length+' lokasi'}});
 return R;
}

/* ---------------------------------------------------------------- WORLD READY */
function ready(){
 B.phase='R';clearInterval(tipT);
 const ws=Array.from(new Set(B.warn));B.warnU=ws;
 U.rp.textContent='Dunia siap dalam '+((B.tA+B.tB)/1000).toFixed(1)+' s · '+STAGES.length+' modul · '+B.checks.filter(c=>c.ok).length+'/'+B.checks.length+' semakan lulus · '+(B.mode==='new'?'permainan baharu':'simpanan dipulihkan');
 if(ws.length){U.w.hidden=false;U.w.querySelector('summary').textContent='⚠ '+ws.length+' amaran (sistem pilihan — permainan selamat dimainkan)';U.w.querySelector('ul').innerHTML=ws.slice(0,40).map(x=>'<li>'+esc(x)+'</li>').join('')}
 show(U.ready);U.play.focus();
 const go=()=>{if(B.done)return;B.done=true;try{if(B.gsT0){GS.t=B.gsT0.t;GS.day=B.gsT0.day;if(typeof hud==='function')hud()}}catch(e){}B.tPlay=Math.round(now()-B.t0);U.root.classList.add('b19-out');setTimeout(()=>{U.root.remove()},800);
  try{if(typeof tip==='function')tip(B.mode==='new'?'✨ Selamat datang ke Kediaman Isekai Waguri!':'▶ Selamat kembali, Waguri!')}catch(e){}
  try{dispatchEvent(new Event('waguri:play'))}catch(e){}};
 U.play.onclick=go;addEventListener('keydown',function k(e){if(B.phase==='R'&&!B.done&&(e.key==='Enter'||e.key===' ')){e.preventDefault();go();removeEventListener('keydown',k)}});
}

/* ---------------------------------------------------------------- cangkuk selepas tahap */
AFTER.gfx14=()=>{
 /* nama 5 tahap grafik seperti diminta: Biasa · Medium · High · Ultra · Extreme (kunci simpanan asal dikekalkan) */
 TIERS.forEach(t=>{GFX14.names[t.k]=t.ic+' '+t.n;GFX14.desc[t.k]=t.d});
 /* when14 dijejak: setiap penantian ialah tugasan sebenar dalam progress */
 window.when14=function(cond,fn,ms){const job={done:0,cond:String(cond).replace(/\s+/g,' ').slice(0,140),t0:now()};B.jobs.push(job);let t=0;
  (function w(){let ok=false;try{ok=!!cond()}catch(e){}if(ok){job.done=1;job.ms=Math.round(now()-job.t0);try{fn()}catch(e){console.error('V14',e)}}else if(t++<600)setTimeout(w,ms||250);else job.done=-1})()};
};
AFTER.teras=()=>{
 /* masa dunia tidak 'berjalan' semasa loading: nilai dari simpanan dipulihkan bila pemain tekan MAIN */
 try{B.gsT0={t:GS.t,day:GS.day}}catch(e){}
 const g0=window.gameInputBlocked;window.gameInputBlocked=function(){return !B.done||g0.apply(this,arguments)};
};

/* ---------------------------------------------------------------- mula */
const go0=()=>{U.root.hidden=false;phaseA()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go0,{once:true});else go0();
})();
