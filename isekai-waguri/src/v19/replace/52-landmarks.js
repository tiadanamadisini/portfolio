
/* ===== V17 → V19 PETA DUNIA (2): mercu tanda di titik sauh MASTER MAP (W19D.A) — Kerajaan + istana, 3 kampung, pelabuhan & kapal, rumah api, runtuhan purba, padang pasir, gunung berapi (lava!), gua, air terjun, teleport, kebun buah, sawah, kandang lembu, pulau ===== */
(function(){'use strict';
when14(()=>typeof W8!=='undefined'&&W8.ter&&W8.SF&&W8.landNear&&W8.sign&&typeof lab==='function'&&typeof cow==='function'&&typeof plM!=='undefined'&&plM.length&&window.W17,()=>{try{build()}catch(e){console.error('V17',e)}});
function build(){
const T=THREE,SF=W8.SF,H=W8.H,WL=W8.WL,LN=W8.landNear,AN19=W19D.A;let sd=1717;const r=()=>(sd=(sd*16807)%2147483647)/2147483647;
const MS=()=>new T.MeshStandardMaterial({color:0xffffff,roughness:.85,flatShading:true});
const inst=(geo,L,cast)=>{if(!L.length)return null;let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9,y1=0;L.forEach(t=>{x0=Math.min(x0,t[0]);x1=Math.max(x1,t[0]);z0=Math.min(z0,t[2]);z1=Math.max(z1,t[2]);y1=Math.max(y1,t[1]+t[4])});
 const g=geo.clone();g.boundingSphere=new T.Sphere(new T.Vector3((x0+x1)/2,y1/2,(z0+z1)/2),Math.hypot(x1-x0,z1-z0)/2+Math.max(25,y1));
 const m=new T.InstancedMesh(g,MS(),L.length),d=new T.Object3D(),c=new T.Color();
 L.forEach((t,i)=>{d.position.set(t[0],t[1],t[2]);d.rotation.set(0,t[6]||0,0);d.scale.set(t[3],t[4],t[5]);d.updateMatrix();m.setMatrixAt(i,d.matrix);m.setColorAt(i,c.set(t[7]==null?0xffffff:t[7]))});
 m.castShadow=cast!==false&&QL!='lo';m.receiveShadow=true;m.userData.v8=1;scene.add(m);return m};
const BOX=new T.BoxGeometry(1,1,1).translate(0,.5,0),PYR=new T.ConeGeometry(.75,1,4).rotateY(Math.PI/4).translate(0,.5,0),CYL=new T.CylinderGeometry(1,1,1,10).translate(0,.5,0),CON=new T.ConeGeometry(1,1,10).translate(0,.5,0),ICO=new T.IcosahedronGeometry(1,0);
const big=(t,x,y,z,s)=>{const c=document.createElement('canvas');c.width=512;c.height=112;const g=c.getContext('2d');g.font='800 46px "Plus Jakarta Sans",system-ui,sans-serif';const tw=Math.min(500,g.measureText(t).width+48);
 g.fillStyle='rgba(15,23,42,.8)';g.beginPath();if(g.roundRect)g.roundRect((512-tw)/2,10,tw,92,46);else g.rect((512-tw)/2,10,tw,92);g.fill();g.fillStyle='#fde68a';g.textAlign='center';g.textBaseline='middle';g.fillText(t,256,58);
 const sp=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),transparent:true,depthWrite:false}));sp.scale.set(s*4.57,s,1);sp.position.set(x,y,z);scene.add(sp);return sp};
/* ---------- rumah (berkelompok, 2 panggilan lukis) ---------- */
const WALL=[0xf3e6d0,0xe8d8b8,0xd9c7a3,0xf5efe0,0xcdb79a,0xbfa58a],ROOF=[0xb8452f,0x2f5fa8,0x8a3b2a,0x3f6fc0,0x6b4a3a,0xc9573a,0x2b3f6b],HB=[],HR=[],HF=[];
/* A level foundation follows the rotated footprint; walls stay above the hillside. */
const house=(x,z,w,d,ry,hh,rc)=>{const cs=Math.cos(ry),sn=Math.sin(ry),ys=[SF(x,z)];for(const u of[-w/2,w/2])for(const v of[-d/2,d/2])ys.push(SF(x+u*cs+v*sn,z-u*sn+v*cs));
 const low=Math.min(...ys)-.3,y=Math.max(...ys)+.03,h=hh||3+r()*1.8;HF.push([x,low,z,w+.12,y-low,d+.12,ry,0x8b8375]);HB.push([x,y,z,w,h+.3,d,ry,WALL[(r()*6)|0]]);HR.push([x,y+h+.3,z,w*1.12,h*.5+1.2,d*1.12,ry,rc!=null?rc:ROOF[(r()*7)|0]]);OB.push({x,z,r:Math.max(w,d)*.55})};
const okSpot=(x,z,md)=>{const h=H(x,z);if(h<WL+.8)return false;if(Math.max(Math.abs(H(x+3,z)-H(x-3,z)),Math.abs(H(x,z+3)-H(x,z-3)))>2.4)return false;
 for(const o of W8.rd){const q=o.R.q(x,z);if(q&&q.d<o.w/2+2.6)return false}if(solid(x,z)||W8.swD(x,z)<1.3)return false;for(const t of HB)if(Math.hypot(t[0]-x,t[2]-z)<md)return false;return true};
const village=(x0,z0,n,R,pal)=>{const[cx,cz]=LN(x0,z0);let k=0;for(let t=0;t<n*40&&k<n;t++){const a=r()*6.283,d=6+Math.sqrt(r())*R,x=cx+Math.cos(a)*d,z=cz+Math.sin(a)*d;if(!okSpot(x,z,7.5))continue;house(x,z,4+r()*2.5,4+r()*2.2,Math.atan2(cx-x,cz-z)+(r()<.5?0:Math.PI/2),null,pal?pal[(r()*pal.length)|0]:null);k++}
 const wl=new T.Group();wl.position.set(cx,SF(cx,cz),cz);add(wl,new T.CylinderGeometry(1.1,1.2,1,12),S(0x9aa0a2),0,.5,0);add(wl,new T.CylinderGeometry(.9,.9,.08,12),S(0x3a7fc0),0,.95,0,false);[-1,1].forEach(s=>add(wl,B(.15,2.4,.15),S(0x6b4528),s*.95,1.2,0));add(wl,new T.ConeGeometry(1.5,.8,4),S(0x8a3b2a),0,2.7,0).rotation.y=Math.PI/4;scene.add(wl);W8.merge(wl);OB.push({x:cx,z:cz,r:1.4});return[cx,cz]};
/* ---------- KERAJAAN: tembok berlapis, menara bumbung biru, istana di puncak bukit ---------- */
const WB=[],TW=[],TR=[],CX=AN19.kerajaan[0],CZ=AN19.kerajaan[1],GATES=[0,.68,Math.PI/2,2.53,Math.PI,-2.57,-Math.PI/2,-.585];
const ring=(cx,cz,rx,rz,h,th,n,gates,tE,tR,tH)=>{const P=i=>{const a=i/n*6.2832;return[cx+Math.cos(a)*rx,cz+Math.sin(a)*rz,a]};
 for(let i=0;i<n;i++){const[x0,z0]=P(i),[x1,z1]=P(i+1),am=(i+.5)/n*6.2832;if(gates.some(g=>Math.abs(Math.atan2(Math.sin(am-g),Math.cos(am-g)))<.11))continue;
  const x=(x0+x1)/2,z=(z0+z1)/2,L=Math.hypot(x1-x0,z1-z0),y0=Math.min(SF(x0,z0),SF(x1,z1),SF(x,z))-1.2;WB.push([x,y0,z,L+.5,h+1.2+(SF(x,z)-y0-1.2),th,Math.atan2(-(z1-z0),x1-x0),0xd9d4c7]);for(let s=0;s<=1;s+=.25)OB.push({x:x0+(x1-x0)*s,z:z0+(z1-z0)*s,r:th*.75})}
 for(let i=0;i<n;i+=tE){const[x,z]=P(i),y=SF(x,z)-1;TW.push([x,y,z,tR,tH+1,tR,0,0xe6e1d5]);TR.push([x,y+tH+1,z,tR*1.3,tR*2.4,tR*1.3,0,0x2f5fa8]);OB.push({x,z,r:tR})}
 gates.forEach(g=>[-.14,.14].forEach(o=>{const a=g+o,x=cx+Math.cos(a)*rx,z=cz+Math.sin(a)*rz,y=SF(x,z)-1;TW.push([x,y,z,tR*1.25,tH+4,tR*1.25,0,0xeeeae0]);TR.push([x,y+tH+4,z,tR*1.6,tR*2.8,tR*1.6,0,0x2f5fa8]);OB.push({x,z,r:tR*1.25})}))};
ring(CX,CZ,AN19.wall_r,AN19.wall_r,7,2.2,104,GATES,6,2.4,10);
ring(AN19.istana[0],AN19.istana[1],AN19.citadel_r,AN19.citadel_r,8,2,44,[Math.PI/2,-Math.PI/2,0,Math.PI],4,2.2,12);
{const pg=new T.Group(),px=AN19.istana[0],pz=AN19.istana[1],py=Math.min(SF(px-14,pz-10),SF(px+14,pz+10),SF(px,pz));pg.position.set(px,py-.8,pz);const st=S(0xf3efe6),bl=S(0x2f5fa8),gd=S(0xe8b931);
 add(pg,B(30,14,22),st,0,7,0);add(pg,B(20,8,15),st,0,18,0);add(pg,new T.CylinderGeometry(5,5.6,34,14),st,0,17,0);add(pg,new T.ConeGeometry(6.6,15,14),bl,0,41.5,0);add(pg,new T.ConeGeometry(.6,5,6),gd,0,51,0);
 [[-15,-11],[15,-11],[-15,11],[15,11],[-9,11],[9,11],[0,-11]].forEach(([x,z],i)=>{const rr=i<4?3.2:2.3,hh=i<4?25:19;add(pg,new T.CylinderGeometry(rr,rr*1.08,hh,12),st,x,hh/2,z);add(pg,new T.ConeGeometry(rr*1.3,rr*2.8,12),bl,x,hh+rr*1.4,z)});
 add(pg,B(6,8,1),S(0x4a3a2a),0,4,11.1);for(let i=0;i<8;i++)add(pg,B(1.2,2,.3),S(0x6fb7e9),-12+i*3.4,10,11.2,false);scene.add(pg);W8.merge(pg);OB.push([px-16,pz-12,px+16,pz+11.6]);
 big('🏰 Istana Kerajaan',px,py+60,pz,7)}
for(let t=0,k=0;t<6000&&k<240;t++){const a=r()*6.283,f=.46+r()*.48,x=CX+Math.cos(a)*AN19.wall_r*f,z=CZ+Math.sin(a)*AN19.wall_r*f;if(Math.hypot(x-AN19.istana[0],z-AN19.istana[1])<AN19.citadel_r+7||GATES.some(g=>{const d=Math.atan2(Math.sin(a-g),Math.cos(a-g));return Math.abs(d)<1.2&&Math.abs(Math.sin(d))*AN19.wall_r*f<5.5})||!okSpot(x,z,6))continue;house(x,z,3.6+r()*2.6,3.6+r()*2.4,Math.atan2(CX-x,CZ-z),4+r()*3,[0x2f5fa8,0x3f6fc0,0xb8452f,0x2b3f6b][(r()*4)|0]);k++}
/* ---------- kampung, pelabuhan, pantai ---------- */
const KU=village(...AN19.kampung_utara,26,36),KT=village(...AN19.kampung_timur,24,34),KS=village(...AN19.kampung_selatan,26,36),PB=village(...AN19.pantai_barat_town,22,30,[0xb8452f,0x2f5fa8]),PBr=village(...AN19.pulau_kecil_village,10,14,[0xc9573a,0x3f6fc0]),PL=village(...AN19.pulau_lanun_fort,10,30,[0x3a2a1e,0x2e2218,0x46444d]);
/* jeti + kapal */
const SHIPS=[],DOCK=(x,z,ax,az,L,nm)=>{const g=new T.Group(),ry=Math.atan2(ax,az);g.position.set(x+ax*L/2,WL+.75,z+az*L/2);g.rotation.y=ry;add(g,B(2.6,.24,L),S(0xb07d45),0,0,0);for(let k=-L/2+1;k<L/2;k+=2.2)[-1,1].forEach(s=>add(g,new T.CylinderGeometry(.13,.15,2.4,6),S(0x5e3f22),s*1.15,-1,k));scene.add(g);W8.merge(g);
 W8.dk.push({cx:x+ax*L/2,cz:z+az*L/2,ax,az,L,W:2.6,h0:WL+.75,h1:WL+.75,name:nm});ST.push({x:x+ax*L*.8,z:z+az*L*.8,r:4,v:()=>!zb,lb:()=>GS.rod?'🎣 Memancing di '+nm:'🎣 Perlu joran (dalam rumah)',tool:'rod',f:()=>zfish(0)})};
const ship=(x,z,ry,sail,hull)=>{const g=new T.Group();g.position.set(x,WL-.25,z);g.rotation.y=ry;add(g,B(3.2,1.7,10),S(hull),0,.8,0);add(g,new T.ConeGeometry(1.6,3,4),S(hull),0,.8,6.4).rotation.set(Math.PI/2,Math.PI/4,0);add(g,B(3,.15,9.6),S(0xb8915a),0,1.7,0);
 add(g,new T.CylinderGeometry(.14,.18,9,6),S(0x5a3a22),0,6,0);add(g,B(4.8,4.2,.1),S(sail),0,6.8,.3);add(g,B(3.4,2.6,.1),S(sail),0,6.3,-3.2);scene.add(g);W8.merge(g);g.userData.y0=g.position.y;SHIPS.push(g);return g};
const toWater=(x,z)=>{let b=null;for(let d=4;d<60&&!b;d+=2)for(let a=0;a<6.283;a+=.3){const px=x+Math.cos(a)*d,pz=z+Math.sin(a)*d;if(H(px,pz)<WL-1.2){b=[a,d];break}}return b};
[[PB,'Jeti Pelabuhan',5,0x8a5a2b,0xf5f0e1],[KS,null,0],[(()=>{const c=AN19.tasik_biru;for(let d=8;d<90;d+=2){const z=c[1]-d;if(H(c[0],z)>WL+.9)return[c[0],z+1]}return c})(),'Jeti Tasik Biru',1,0x8a5a2b,0xffffff]].forEach(([c,nm,ns,hc,sc])=>{if(!nm)return;const w=toWater(c[0],c[1]);if(!w)return;const ax=Math.cos(w[0]),az=Math.sin(w[0]),sx=c[0]+ax*(w[1]-5),sz=c[1]+az*(w[1]-5);
 for(let i=0;i<ns;i++){const o=(i-(ns-1)/2)*9;DOCK(sx-az*o,sz+ax*o,ax,az,16,nm);if(i<2||ns==1)ship(sx-az*o+ax*24+az*4,sz+ax*o+az*24-ax*4,Math.atan2(ax,az)+.3,sc,hc)}});
/* rumah api Pantai Barat */
const LH=LN(...AN19.rumah_api),ly=SF(LH[0],LH[1]),lg=new T.Group();lg.position.set(LH[0],ly-.3,LH[1]);for(let i=0;i<5;i++)add(lg,new T.CylinderGeometry(2.1-i*.22,2.3-i*.22,3,12),S(i%2?0xc0392b:0xf5f5f5),0,1.5+i*3,0);
add(lg,new T.CylinderGeometry(1.5,1.5,2.2,12),S(0x2b2b2b),0,16.1,0);const lamp=add(lg,new T.SphereGeometry(1.05,12,10),G(0xfff3b0,0xffd24a,1.2),0,16.2,0,false);lamp.userData.keep=1;add(lg,new T.ConeGeometry(2,1.8,12),S(0xc0392b),0,18.1,0);scene.add(lg);W8.merge(lg);OB.push({x:LH[0],z:LH[1],r:2.6});
const LL=new T.PointLight(0xffe08a,0,70);LL.position.set(LH[0],ly+16.5,LH[1]);scene.add(LL);
/* ---------- Kandang Lembu (barat) ---------- */
const COWS=[];{const[cx,cz]=LN(...AN19.kandang_lembu),y=SF(cx,cz),F=[];for(let x=-12;x<=12;x+=2)[-8,8].forEach(z=>F.push([cx+x,SF(cx+x,cz+z),cz+z,.16,1.3,.16,0,0x8a6238]));for(let z=-8;z<=8;z+=2)[-12,12].forEach(x=>F.push([cx+x,SF(cx+x,cz+z),cz+z,.16,1.3,.16,0,0x8a6238]));inst(BOX,F);
 const bn=new T.Group();bn.position.set(cx,y-.2,cz-12.5);add(bn,B(9,4,6.5),S(0xa8442f),0,2,0);const br=gable(9.6,7.4,2.6,[S(0xd9b99b),S(0x5a3a22)]);br.position.y=4;bn.add(br);add(bn,B(2.4,3,.1),S(0xf3e6d0),0,1.5,3.3);scene.add(bn);W8.merge(bn);OB.push([cx-4.8,cz-15.9,cx+4.8,cz-9.1]);
 for(let i=0;i<6;i++){const c=cow(),x=cx-8+r()*16,z=cz-5+r()*10;c.position.set(x,SF(x,z),z);c.rotation.y=r()*6.28;scene.add(c);COWS.push(c)}
 ST.push({x:cx,z:cz+9.5,r:4,lb:()=>'🥛 Perah susu lembu',f(){if(Date.now()<(W8.ms17||0))return tip('🐄 Lembu sedang rehat, tunggu sekejap');if(!use(3))return;W8.ms17=Date.now()+45000;gain(IT.susu?'susu':'egg',2);tip('🥛 Dapat 2 '+(IT.susu?'susu':'telur')+'!');hud();save()}})}
/* ---------- Kebun Buah ---------- */
{const[cx,cz]=LN(...AN19.kebun_buah),A=[],Bq=[];for(let i=-3;i<=3;i++)for(let j=-2;j<=2;j++){const x=cx+i*6+(r()-.5),z=cz+j*6+(r()-.5);if(H(x,z)<WL+.7)continue;const y=SF(x,z);A.push([x,y-.2,z,.28,2.4,.28,0,0x6b4a2e]);Bq.push([x,y+3.2,z,2.1,1.7,2.1,r()*6,[0xf4a6c6,0xf7c0d8,0x5fae4a,0xe88fb4][(i+j+9)%4]]);OB.push({x,z,r:.5})}
 inst(CYL,A);inst(ICO,Bq);ST.push({x:cx,z:cz,r:7,lb:()=>'🍎 Petik buah',f(){if(Date.now()<(W8.kb17||0))return tip('🍎 Buah belum masak, tunggu sekejap');if(!use(2))return;W8.kb17=Date.now()+40000;gain('fruit',3);ev('forage',3);ev('fruit',3);tip('🍎 Petik 3 buah!');hud();save()}})}
/* ---------- Sawah Padi (teres) ---------- */
{const[cx,cz]=LN(...AN19.sawah_padi),M=[],Wt=[],Rc=[];for(let i=-1;i<=1;i++)for(let j=-2;j<=1;j++){const x=cx+i*11,z=cz+j*8.5+4;if(H(x,z)<WL+.6)continue;const y=Math.max(SF(x-5,z-3.5),SF(x+5,z+3.5),SF(x,z))-.1;M.push([x,y-1.4,z,10,1.6,7.6,0,0x6b5a3a]);Wt.push([x,y+.2,z,9.4,.04,7,0,0x86c5d6]);for(let k=0;k<14;k++)Rc.push([x-4+(k%7)*1.3,y+.2,z-2.4+((k/7)|0)*4.8,.14,.7+r()*.3,.14,0,(i+j)%2?0x9ccc3c:0xe3c13f])}
 inst(BOX,M,false);inst(BOX,Wt,false);inst(CON,Rc,false);ST.push({x:cx,z:cz,r:9,lb:()=>'🌾 Tuai padi sawah',f(){if(Date.now()<(W8.sp17||0))return tip('🌾 Padi belum menguning, tunggu sekejap');if(!use(4))return;W8.sp17=Date.now()+60000;gain('beras',2);ev('padi');tip('🌾 Tuai padi! +2 beras 🍚');hud();save()}})}
/* ---------- Runtuhan Purba ---------- */
{const[cx,cz]=LN(...AN19.runtuhan),C=[],Wr=[];for(let i=0;i<4;i++)for(let j=0;j<6;j++){if(r()<.22)continue;const x=cx-10+i*6.5,z=cz-14+j*5.5,h=r()<.35?1+r()*2:4+r()*5;C.push([x,SF(x,z)-.4,z,.9,h,.9,0,0xd8c7a0]);OB.push({x,z,r:1})}
 for(let k=0;k<7;k++){const x=cx+(r()-.5)*36,z=cz+(r()-.5)*34;Wr.push([x,SF(x,z)-.5,z,3+r()*5,1+r()*2.6,1.2,r()*3,0xc9b48a])}
 [[-2.2],[2.2]].forEach(([o])=>C.push([cx+o,SF(cx+o,cz-20)-.3,cz-20,1,7,1,0,0xe0d2ae]));Wr.push([cx,SF(cx,cz-20)+6.4,cz-20,6,1,1.4,0,0xe0d2ae]);inst(CYL,C);inst(BOX,Wr);
 ST.push({x:cx,z:cz,r:8,lb:()=>'🏛 Cari artifak purba',f(){if(GS.rp17===GS.day)return tip('🏛 Tiada lagi artifak hari ini — datang esok');busy('🔍 Menggali runtuhan…',3,()=>{GS.rp17=GS.day;GS.coin+=40;tip('🏺 Jumpa artifak purba! Dijual RM40');hud();save()})}})}
/* ---------- Padang Pasir: kaktus ---------- */
{const K=[];for(let t=0;t<900&&K.length<150;t++){const x=AN19.desert[0]+(r()*2-1)*AN19.desert_r,z=AN19.desert[1]+(r()*2-1)*AN19.desert_r;if(W17.cls(x,z)!=8||H(x,z)<1)continue;const y=SF(x,z)-.2,h=2.2+r()*2.4;K.push([x,y,z,.42,h,.42,0,0x3f8f3a],[x+.75,y+h*.45,z,.26,h*.4,.26,0,0x4a9a40],[x+.38,y+h*.45,z,.75,.26,.26,0,0x4a9a40]);OB.push({x,z,r:.6})}inst(CYL,K)}
/* ---------- teleport (ikon 🌀 dalam peta) ---------- */
const PORT=[],portal=(x,z)=>{const p=LN(x,z),y=SF(p[0],p[1]),g=new T.Group();g.position.set(p[0],y,p[1]);const rg=new T.Mesh(new T.TorusGeometry(2.4,.32,10,32),G(0x7df9ff,0x22d3ee,1.1));rg.position.y=3.2;g.add(rg);
 const dk=new T.Mesh(new T.CircleGeometry(2.2,32),new T.MeshBasicMaterial({color:0x6ee7ff,transparent:true,opacity:.45,side:T.DoubleSide,depthWrite:false}));dk.position.y=3.2;g.add(dk);add(g,new T.CylinderGeometry(3.2,3.6,.5,16),S(0x8a8fa0),0,.1,0);scene.add(g);PORT.push(g);
 ST.push({x:p[0],z:p[1],r:4,lb:()=>'🌀 Teleport — pilih destinasi',f(){try{mpOpen(1)}catch(e){}}});lab('🌀 Teleport',p[0],y+6.6,p[1])};
portal(...AN19.portal_desert);portal(...AN19.portal_rahsia);portal(...AN19.portal_kerajaan);
/* ---------- gua ---------- */
const cave=(x,z,nm,col)=>{const p=LN(x,z),y=SF(p[0],p[1]);let bx=0,bz=1,bh=-1e9;for(let a=0;a<6.28;a+=.3){const h=H(p[0]+Math.cos(a)*7,p[1]+Math.sin(a)*7);if(h>bh){bh=h;bx=Math.cos(a);bz=Math.sin(a)}}
 const g=new T.Group();g.position.set(p[0]+bx*2,y-.2,p[1]+bz*2);g.rotation.y=Math.atan2(-bx,-bz);g.add(new T.Mesh(new T.CircleGeometry(3.2,20,0,Math.PI),new T.MeshBasicMaterial({color:0x06060a,side:T.DoubleSide})));
 for(let i=0;i<10;i++){const a=i/9*Math.PI;add(g,new T.DodecahedronGeometry(1.1+r()*.8),S(col),Math.cos(a)*3.6,Math.sin(a)*3.6,-.4)}scene.add(g);
 ST.push({x:p[0],z:p[1],r:5,lb:()=>'🔦 Terokai '+nm,f(){const k='gua17_'+nm;if(GS[k]===GS.day)return tip('🕳 '+nm+' sudah diterokai hari ini — datang esok');busy('🔦 Meneroka '+nm+'…',3,()=>{GS[k]=GS.day;const L=[['garam',3],['cendawan',2],['herba',2],['wood',3]],q=L[(Math.random()*L.length)|0];gain(q[0],q[1]);GS.coin+=25;tip('💎 Jumpa '+q[1]+' '+(IC[q[0]]||'')+' + RM25 dalam gua!');hud();save()})}})};
cave(...AN19.gua_salji,'Gua Salji',0xdfe7ef);cave(...AN19.gua_selatan,'Gua Selatan',0x6f7173);
/* ---------- air terjun ---------- */
const MIST=[];const fall=(px,pz)=>{let b=null;for(let d=3;d<30&&!b;d+=1)for(let a=0;a<6.283;a+=.15){const x=px+Math.cos(a)*d,z=pz+Math.sin(a)*d,h=H(x,z);if(h>5){b={a,x,z,h};break}}if(!b||!W4.wt)return;
 const ax=Math.cos(b.a),az=Math.sin(b.a),top=b.h+.4,hg=top-WL,m=new T.Mesh(new T.PlaneGeometry(8,hg),new T.MeshBasicMaterial({map:W4.wt,transparent:true,opacity:.85,side:T.DoubleSide,depthWrite:false}));
 m.position.set(b.x-ax*1.3,WL+hg/2,b.z-az*1.3);m.rotation.y=Math.atan2(ax,az);scene.add(m);W8.falls19=(W8.falls19||[]);W8.falls19.push([b.x,b.z,+top.toFixed(1)]);
 /* V19: kolam mata air di atas tebing — sumber air dari kawasan tinggi */
 {const sp=new T.Mesh(new T.CircleGeometry(4.2,24),new T.MeshStandardMaterial({color:0x3aa0e0,roughness:.12,metalness:.1,transparent:true,opacity:.88}));sp.rotation.x=-Math.PI/2;sp.position.set(b.x+ax*4.5,top-.25,b.z+az*4.5);scene.add(sp)}for(let i=0;i<6;i++){const s=new T.Sprite(new T.SpriteMaterial({color:0xffffff,transparent:true,opacity:.25,depthWrite:false}));s.scale.set(4,4,1);s.userData.p=[b.x-ax*3,b.z-az*3,i];scene.add(s);MIST.push(s)}};
fall(...AN19.air_terjun_top);{const L=W17.LOC.find(l=>l[1]==='Air Terjun Barat');if(L)fall(L[2],L[3])}
/* ---------- gunung berapi: lava, cahaya, asap · bahaya! ---------- */
const CR=[AN19.kawah[0],AN19.kawah[1]],CY=H(CR[0],CR[1]);const LVm=new T.Mesh(new T.CircleGeometry(9,24),new T.MeshBasicMaterial({color:0xff5a1a,fog:false}));LVm.rotation.x=-Math.PI/2;LVm.position.set(CR[0],CY+.7,CR[1]);scene.add(LVm);
const VL=new T.PointLight(0xff5a1a,2,110);VL.position.set(CR[0],CY+9,CR[1]);scene.add(VL);
const sc=document.createElement('canvas');sc.width=sc.height=64;{const g=sc.getContext('2d'),gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64)}
const SMK=[];for(let i=0;i<12;i++){const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(sc),color:0x555555,transparent:true,opacity:.5,depthWrite:false}));s.userData.i=i;scene.add(s);SMK.push(s)}
/* ---------- Pulau Lanun: kubu gelap + kapal lanun · pulau-pulau ---------- */
{const[cx,cz]=LN(...AN19.pulau_lanun_fort),A=[],Rf=[];[[-9,-7],[9,-7],[-9,7],[9,7]].forEach(([x,z])=>{const X=cx+x,Z=cz+z;A.push([X,SF(X,Z)-.5,Z,2.4,11,2.4,0,0x3b3a42]);Rf.push([X,SF(X,Z)+10.5,Z,3,4,3,0,0x1a1a1f]);OB.push({x:X,z:Z,r:2.4})});
 [[0,-7,18,0],[0,7,18,0],[-9,0,14,1],[9,0,14,1]].forEach(([x,z,L,v])=>{const X=cx+x,Z=cz+z;A.push([X,SF(X,Z)-.5,Z,v?1.6:L,6,v?L:1.6,0,0x46444d])});inst(BOX,A);inst(CON,Rf);
 const w=toWater(cx,cz);if(w){const ax=Math.cos(w[0]),az=Math.sin(w[0]);ship(cx+ax*(w[1]+10),cz+az*(w[1]+10),w[0],0x1b1b1b,0x3a2a1e);ship(cx+ax*(w[1]+12)-az*14,cz+az*(w[1]+12)+ax*14,w[0]+.8,0x1b1b1b,0x2e2218)}}
const tree=(x,z,c,s)=>{const y=SF(x,z);return[[x,y-.2,z,.3*s,2.6*s,.3*s,0,0x7a5a3a],[x,y+2.6*s,z,1.9*s,1.6*s,1.9*s,r()*6,c]]};
{const A=[],Bq=[];const put=(x0,z0,n,R,cols)=>{for(let i=0,k=0;i<n*20&&k<n;i++){const x=x0+(r()-.5)*R*2,z=z0+(r()-.5)*R*2;if(H(x,z)<WL+.8)continue;const t=tree(x,z,cols[k%cols.length],.9+r()*.4);A.push(t[0]);Bq.push(t[1]);OB.push({x,z,r:.5});k++}};
 put(...AN19.pulau_kecil_village,9,18,[0x3f9a3a,0x5fae4a]);put(...AN19.portal_rahsia,12,16,[0xf4a6c6,0xe88fb4,0xf7c0d8]);inst(CYL,A);inst(ICO,Bq)}
inst(BOX,WB);inst(CYL,TW);inst(CON,TR);inst(BOX,HF);inst(BOX,HB);inst(PYR,HR);
/* ---------- papan tanda & label nama tempat ---------- */
try{const PX=(px,py)=>W17.toW(px,py);W8.sign(19,-31,[[0,-1,'🌳 Hutan Utara · 🏘 Kampung Timur'],[0,1,'🛒 Pasar · 🏠 Rumah']]);W8.sign(...PX(752,648),[[0,-1,'🏰 Istana Kerajaan'],[0,1,'🏘 Kampung Selatan'],[1,0,'💧 Tasik Biru · 🏖 Pantai Timur (rumah)']]);
 W8.sign(KS[0]+9,KS[1]+9,[[-1,.5,'🌲 Hutan Selatan · 🕳 Gua Selatan'],[1,.4,'💧 Tasik Sunyi · 🏔 Gunung Selatan'],[0,-1,'🏰 Kerajaan']]);W8.sign(-70,-17,[[-1,-1,'💦 Air Terjun · 🏘 Kampung Timur'],[-1,.3,'🐊 Paya Bakau · 🏰 Kerajaan']]);
 W8.sign(...PX(488,456),[[-1,.4,'🍎 Kebun · 🐄 Kandang · 🏖 Pantai Barat'],[1,0,'🏰 Kerajaan']]);W8.sign(...PX(1000,476),[[1,0,'💦 Air Terjun · 🐊 Paya Bakau'],[0,1,'💧 Tasik Biru'],[-1,0,'🏰 Kerajaan']]);
 W8.sign(...PX(752,226),[[0,-1,'🏘 Kampung Utara · 🌲 Laluan Hutan Jauh'],[0,1,'🏰 Kerajaan']])}catch(e){console.error(e)}
W17.LOC.forEach(([ic,n,x,z])=>{if(n=='Rumah Api')return;const pk=/Gunung|Kawasan/.test(n);let px=x,pz=z;if(pk){let bh=-1e9;for(let i=0;i<60;i++){const qx=x+(r()-.5)*60,qz=z+(r()-.5)*60,h=H(qx,qz);if(h>bh){bh=h;px=qx;pz=qz}}}
 big(ic+' '+n,px,H(px,pz)+(pk?10:n=='Kerajaan'?20:13),pz,n=='Kerajaan'?6:pk?6:3.6)});
/* ---------- rumput: jangan tumbuh atas air, pasir, batu, kampung ---------- */
try{if(W8.gmask&&W8.gmT){const g=W8.gmask.getContext('2d');g.fillStyle='#000';for(let z=-104;z<250;z+=2)for(let x=-216;x<72;x+=2){if(W8.inO(x,z))continue;const c=W17.cls(x,z);if(H(x,z)<.45||c==2||c>=6)g.fillRect(x+216,z+104,2,2)}W8.gmT.needsUpdate=true}}catch(e){}
try{const t=SEA&&SEA.m&&SEA.m.normalMap;if(t)t.repeat.multiplyScalar(6.9)}catch(e){}
const SKY=scene.children.find(o=>o.isMesh&&o.geometry&&o.geometry.parameters&&o.geometry.parameters.radius>=250);
/* ---------- gelung ---------- */
let hT=0,lc=0,cur='';
const _g=window.gtick;window.gtick=function(){_g();try{const t=performance.now()/1000,c=camera.position;if(SKY)SKY.position.set(c.x,0,c.z);if(typeof stars!='undefined'&&stars)stars.position.set(c.x,0,c.z);
 PORT.forEach((p,i)=>{p.children[0].rotation.z=t*1.5+i;p.children[1].material.opacity=.35+Math.sin(t*3+i)*.15});SHIPS.forEach((s,i)=>{s.position.y=s.userData.y0+Math.sin(t*1.2+i)*.08;s.rotation.z=Math.sin(t*.9+i)*.025});
 COWS.forEach((cw,i)=>{const h=cw.userData.h;if(h)h.rotation.x=.35+Math.sin(t*1.8+i)*.12});MIST.forEach(s=>{const u=s.userData.p,p=(t*.25+u[2]/6)%1;s.position.set(u[0]+Math.sin(u[2]*2.1)*1.5,WL+.6+p*3,u[1]+Math.cos(u[2]*1.7)*1.5);s.material.opacity=.3*(1-p)});
 VL.intensity=1.8+Math.sin(t*3)*.4;LVm.material.color.setHSL(.04+Math.sin(t*2)*.012,1,.52);SMK.forEach(s=>{const i=s.userData.i,p=(t*.07+i/12)%1;s.position.set(CR[0]+Math.sin(i*2.3+t*.2)*4*p,CY+4+p*42,CR[1]+Math.cos(i*1.7)*4*p);s.scale.setScalar(6+p*26);s.material.opacity=.55*(1-p)});
 LL.intensity=(typeof stars!='undefined'&&stars?stars.material.opacity:0)*2.6;
 if(Math.hypot(P.x-CR[0],P.z-CR[1])<10&&P.y>CY-3){const n=Date.now();if(n-hT>900){hT=n;hurt(7);tip('🔥 Lava panas! Keluar dari kawah sekarang!')}}
 const n=Date.now();if(n-lc>1500){lc=n;let b=null,bd=48;for(const L of W17.LOC){const d=Math.hypot(P.x-L[2],P.z-L[3]);if(d<bd){bd=d;b=L}}const k=b?b[1]:'';if(k!==cur){cur=k;if(b)tip('📍 '+b[0]+' '+b[1])}}}catch(e){}};
try{if(!localStorage.getItem('waguri_v19')){localStorage.setItem('waguri_v19','1');setTimeout(()=>tip('🗺 Dunia dibina semula ikut peta master! Buka peta → pilih tempat → 🚀 Pergi'),4000)}}catch(e){}
W17.ok=1;W8.KS=KS;W8.KU=KU;W8.KT=KT;console.log('V19 peta dunia siap');
}})();
