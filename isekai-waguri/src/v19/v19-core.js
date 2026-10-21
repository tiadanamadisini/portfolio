/* ===== V19 TERAS: berita versi · alat semakan peta (tangkapan top-down dunia 3D) =====
   MAPV19.topdown() merender seluruh dunia dari atas dengan kamera ortografik yang sejajar dengan MASTER MAP
   (1 piksel imej = 1 piksel peta = 0.8 m) supaya boleh ditindih separa lut sinar dengan gambar asal. ===== */
(function(){
'use strict';
window.V19NEWS='🗺 <b>Dunia dibina semula ikut peta master</b> — Kerajaan dengan dua terusan & 16 jambatan, kampung, gunung, padang pasir, gunung berapi & semua pulau di kedudukan peta<br>⏳ <b>Skrin loading sebenar</b> + menu utama (TERUSKAN / MULA BAHARU)<br>⚙ 5 tahap grafik: Biasa · Medium · High · Ultra · Extreme<br>';
addEventListener('waguri:play',()=>{try{
 if(typeof GS==='undefined'||!GS.v15n||GS.v19n)return;GS.v19n=1;save();
 setTimeout(()=>{try{if(window.QS14&&!QS14.dlgOpen&&!(window.EVT14&&EVT14.cur))QS14.dlg('Tok Ketua','🧓','<b>Kediaman Isekai Waguri v19!</b><br>'+V19NEWS,null,[['Jom main!',null,1]])}catch(e){}},2500);
}catch(e){console.error('v19 berita',e)}});

const MAPV19={};window.MAPV19=MAPV19;
/* render top-down: px/py = saiz imej (lalai 1536×1024 = MASTER MAP) */
MAPV19.topdown=function(o){o=o||{};const D=W19D,Wd=o.w||1536,Ht=o.h||1024,b=D.bounds;
 const cam=new THREE.OrthographicCamera(b.x0,b.x1,-b.z0,-b.z1,1,900);cam.position.set(0,500,0);cam.up.set(0,0,-1);cam.lookAt(0,0,0);
 /* ortho: kiri=x0 kanan=x1; atas peta (z0) di atas imej */
 cam.left=b.x0;cam.right=b.x1;cam.top=-b.z0;cam.bottom=-b.z1;cam.updateProjectionMatrix();
 const hide=[],vis=[];
 scene.traverse(m=>{if(m.isSprite||m.isPoints||(m.isMesh&&m.geometry&&m.geometry.parameters&&m.geometry.parameters.radius>=250)){if(m.visible){hide.push(m);m.visible=false}}});
 (W8.cl||[]).forEach(c=>{if(c.visible){hide.push(c);c.visible=false}});(typeof clouds!=='undefined'?clouds:[]).forEach(c=>{if(c.visible){hide.push(c);c.visible=false}});
 (W8.tc||[]).forEach(m=>{if(!m.visible){vis.push(m);m.visible=true}});
 const fog=scene.fog;scene.fog=null;const sz=new THREE.Vector2();renderer.getSize(sz);const pr=renderer.getPixelRatio();
 const rt=new THREE.WebGLRenderTarget(Wd,Ht,{depthBuffer:true});rt.texture.encoding=renderer.outputEncoding;
 renderer.setRenderTarget(rt);renderer.setClearColor(0x0a2a4a,1);renderer.clear();renderer.render(scene,cam);
 const px=new Uint8Array(Wd*Ht*4);renderer.readRenderTargetPixels(rt,0,0,Wd,Ht,px);renderer.setRenderTarget(null);rt.dispose();
 scene.fog=fog;hide.forEach(m=>m.visible=true);vis.forEach(m=>m.visible=false);
 const c=document.createElement('canvas');c.width=Wd;c.height=Ht;const g=c.getContext('2d'),id=g.createImageData(Wd,Ht);
 for(let y=0;y<Ht;y++){const s=(Ht-1-y)*Wd*4;id.data.set(px.subarray(s,s+Wd*4),y*Wd*4)}g.putImageData(id,0,0);
 return c.toDataURL('image/png')};
/* data semakan: lokasi, jalan, jambatan dan ketinggian dunia sebenar (dibaca daripada fungsi permainan) */
MAPV19.probe=function(){const out={loc:[],bridges:[],roads:[],flags:{}};
 W19D.LOC.forEach(L=>{const pin=(typeof DS!=='undefined'?DS:[]).find(d=>d[1]===L.n);const h=W8.SF(L.x,L.z);
  out.loc.push({n:L.n,x:L.x,z:L.z,h:+h.toFixed(2),wet:h<W8.WL-.2,pin:pin?[+pin[2].toFixed(1),+pin[3].toFixed(1)]:null,cls:W17.cls(L.x,L.z)})});
 (W8.dk||[]).forEach(b=>out.bridges.push({n:b.name,x:+b.cx.toFixed(1),z:+b.cz.toFixed(1),L:+b.L.toFixed(1)}));
 (W8.rd||[]).forEach(o=>{let wet=0,n=0;for(let i=0;i<o.R.n;i+=2){n++;const x=o.R.X[i],z=o.R.Z[i];if(W8.H(x,z)<W8.WL+.1&&W8.onDk(x,z)==null)wet++}out.roads.push({n:o.name,pts:o.R.n,wetNoBridge:wet,samples:n})});
 for(const k in W19D.FLAGS){const f=W19D.FLAGS[k];out.flags[k]={x:f[0],z:f[1],h:+W8.SF(f[0],f[1]).toFixed(2)}}
 out.falls=W8.falls19||[];out.player={x:P.x,z:P.z,y:P.y};out.house=[0,0];return out};
/* kebolehcapaian: BFS grid 2 m dari pintu rumah (0,9). Jalan kaki = darat/air cetek + jambatan, cerun ikut peraturan stpX
   (naik > 3.5 m setiap 1 m disekat). Berenang = semua sel termasuk laut. Hasil: grid kod (0 tak capai,1 kaki,2 renang sahaja) */
MAPV19.reach=function(step){step=step||2;const b=W19D.bounds,nx=Math.floor((b.x1-b.x0)/step),nz=Math.floor((b.z1-b.z0)/step),N=nx*nz,WL=W8.WL;
 const Hh=new Float32Array(N);for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const x=b.x0+(i+.5)*step,z=b.z0+(j+.5)*step;Hh[j*nx+i]=W8.SF(x,z)}
 const land=k=>Hh[k]>WL-.5,dry=k=>Hh[k]>WL,idx=(x,z)=>{const i=Math.floor((x-b.x0)/step),j=Math.floor((z-b.z0)/step);return(i<0||j<0||i>=nx||j>=nz)?-1:j*nx+i};
 const bfs=(ok,edge)=>{const R=new Uint8Array(N),q=new Int32Array(N);let h=0,t=0;const s=idx(0,9);R[s]=1;q[t++]=s;
  while(h<t){const k=q[h++],i=k%nx,j=(k/nx)|0;const nb=[i>0?k-1:-1,i<nx-1?k+1:-1,j>0?k-nx:-1,j<nz-1?k+nx:-1];
   for(const n of nb){if(n<0||R[n]||!ok(n))continue;if(edge&&!edge(k,n))continue;R[n]=1;q[t++]=n}}return R};
 const foot=bfs(land,(a,c)=>Hh[c]-Hh[a]<=3.5*step),swim=bfs(()=>true,(a,c)=>!land(c)||Hh[c]-Hh[a]<=3.5*step);
 const code=new Uint8Array(N);for(let k=0;k<N;k++)code[k]=foot[k]?1:swim[k]?2:0;
 const at=(x,z,r)=>{r=r||8;let best=0;for(let dz=-r;dz<=r;dz+=step)for(let dx=-r;dx<=r;dx+=step){const k=idx(x+dx,z+dz);if(k<0)continue;const c=code[k];if(c===1)return 1;if(c===2)best=2}return best};
 const loc=W19D.LOC.map(L=>({n:L.n,r:at(L.x,L.z,10)}));let s='';for(let k=0;k<N;k++)s+=String.fromCharCode(48+code[k]+(dry(k)?0:3));
 return{nx,nz,step,loc,grid:s,footCells:foot.reduce((a,v)=>a+v,0),landCells:Hh.reduce((a,v)=>a+(v>WL-.5),0),dryCells:Hh.reduce((a,v)=>a+(v>WL),0)}};
})();
