
/* ===== V8 DUNIA (2) → V19: hutan ikut ketumpatan hutan MASTER MAP, papan tanda, label, pin peta, awan, peta (gambar MASTER MAP) ===== */
V8(()=>{
const {sm,lp,inO,RX,LV,H,SF,FD,dk,rd}=W8;
/* ---- geometri pokok (gabung + warna bucu) ---- */
const mg=parts=>{const P=[],Cc=[];parts.forEach(([g0,x,y,z,c,sx,sy,sz])=>{const g=g0.index?g0.toNonIndexed():g0;const m=new THREE.Matrix4().makeScale(sx||1,sy||sx||1,sz||sx||1).setPosition(x,y,z);g.applyMatrix4(m);const p=g.attributes.position.array,cc=new THREE.Color(c);for(let i=0;i<p.length;i+=3){P.push(p[i],p[i+1],p[i+2]);Cc.push(cc.r,cc.g,cc.b)}});
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('color',new THREE.Float32BufferAttribute(Cc,3));g.computeVertexNormals();return g};
const CY=(a,b,h,s,oe)=>new THREE.CylinderGeometry(a,b,h,s,1,!!oe),CO=(r,h,s,oe)=>new THREE.ConeGeometry(r,h,s,1,!!oe),IC=(r,d)=>new THREE.IcosahedronGeometry(r,d||((window.GFX14&&GFX14.q>=3)?1:0));
const GEO={pine:mg([[CY(.17,.3,2.8,5,1),0,1.4,0,0x5a3d26],[CO(2.1,3.4,7,1),0,3.4,0,0x1d5a2a],[CO(1.65,3,7,1),0,5,0,0x246838],[CO(1.15,2.6,6,1),0,6.4,0,0x2c7641]]),
 leaf:mg([[CY(.22,.36,3.4,5,1),0,1.7,0,0x5e4128],[IC(1.9),0,4.6,0,0x3b8a32],[IC(1.5),1.25,4.1,.45,0x327c2b],[IC(1.4),-1.15,4.2,-.5,0x46993a],[IC(1.25),.2,5.6,-.3,0x3f9234]]),
 tall:mg([[CY(.25,.42,5.2,5,1),0,2.6,0,0x6a4a2e],[IC(2.3),0,6.4,0,0x2f7a2f],[IC(1.7),1.5,5.8,.4,0x3a8834],[IC(1.6),-1.3,6,-.6,0x286b2a],[IC(1.3),.3,7.6,0,0x34802f]]),
 bush:mg([[IC(1),0,.75,0,0x3a7f30],[IC(.8),.75,.55,.3,0x438c35],[IC(.7),-.6,.5,-.25,0x35762c]])};
const tm=new THREE.MeshStandardMaterial({vertexColors:true,flatShading:true,roughness:.92});
tm.onBeforeCompile=s=>{s.uniforms.uT=timeU;s.vertexShader='uniform float uT;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nfloat wv=max(position.y-2.2,0.)*.022;transformed.x+=sin(uT*1.15+instanceMatrix[3].x*.13+instanceMatrix[3].z*.09)*wv;transformed.z+=cos(uT*.9+instanceMatrix[3].z*.11)*wv*.7;')};
/* ---- tanam hutan ---- */
V8(()=>{const B=W8.B19,A=W19D.A,cs=({lo:6.4,md:4.6,hi:3.9})[QL],CH=60,bins=new Map(),bridges=dk.filter(b=>b.name!='Jeti'),clear=[[22,-31,6],[53,126,6],[...A.kampung_utara,30],[...A.kampung_timur,30],[...A.kampung_selatan,32],[...A.pantai_barat_town,26],[...A.pulau_kecil_village,14],[...A.kandang_lembu,22],[...A.kebun_buah,24],[...A.runtuhan,28],[...A.portal_desert,9],[...A.portal_rahsia,9],[...A.portal_kerajaan,9],[...A.gua_salji,10],[...A.gua_selatan,10],[...A.air_terjun_top,11],[...A.air_terjun_pool,14],[...A.rumah_api,9],[...A.pulau_lanun_fort,18],[...A.menara_lanun,8],[...A.bukit,6]];W8.clear=clear;
 const col=new THREE.Color();
 for(let x=B.x0+2;x<60;x+=cs)for(let z=B.z0+2;z<B.z1-2;z+=cs){const px=x+R()*cs,pz=z+R()*cs,d=FD(px,pz);if(R()>d)continue;
  let bad=false;for(let i=0;i<rd.length&&!bad;i++){const q=rd[i].R.q(px,pz);if(q&&q.d<rd[i].w/2+2.3)bad=true}if(bad)continue;
  const qr=RX.q(px,pz);if(qr&&qr.d<5.8)continue;if(bridges.some(b=>Math.hypot(px-b.cx,pz-b.cz)<b.L/2+4))continue;if(clear.some(c=>Math.hypot(px-c[0],pz-c[1])<c[2]))continue;
  const h=H(px,pz);if(h>48||h<.55||(px>48&&h<.8))continue;
  const out=px<B.x0||pz<B.z0||pz>B.z1,r=R();let ty;if(out)ty=r<.6?'pine':'leaf';else if(pz>140)ty=r<.55?'leaf':r<.75?'tall':'bush';else if(pz<-182)ty=r<.4?'pine':r<.8?'leaf':r<.9?'tall':'bush';else ty=r<.3?'pine':r<.65?'leaf':r<.88?'tall':'bush';
  const s=(ty=='bush'?.8:.85)+R()*.5,k=Math.floor(px/CH)*1000+Math.floor(pz/CH)+ty;let b=bins.get(k);if(!b)bins.set(k,b={ty,cx:(Math.floor(px/CH)+.5)*CH,cz:(Math.floor(pz/CH)+.5)*CH,m:[]});b.m.push([px,h-.1,pz,s,R()*6.28]);
  if(ty!='bush'){W8.fd.push([px,pz]);if(!out)OB.push({x:px,z:pz,r:.45*s})}}
 const d=new THREE.Object3D();bins.forEach(b=>{const base=GEO[b.ty],g=new THREE.BufferGeometry();for(const k in base.attributes)g.setAttribute(k,base.attributes[k]);g.boundingSphere=new THREE.Sphere(new THREE.Vector3(b.cx,10,b.cz),CH*.75+14);
  const im=new THREE.InstancedMesh(g,tm,b.m.length);b.m.forEach((t,i)=>{d.position.set(t[0],t[1],t[2]);d.rotation.set(0,t[4],0);d.scale.setScalar(t[3]);d.updateMatrix();im.setMatrixAt(i,d.matrix);im.setColorAt(i,col.setRGB(.82+R()*.32,.85+R()*.3,.8+R()*.25))});
  im.castShadow=QL!='lo'&&b.ty!='bush';im.receiveShadow=true;im.userData.v8=1;im.userData.c=[b.cx,b.cz];scene.add(im);W8.tc=(W8.tc||[]);W8.tc.push(im)});W8.treeN=W8.fd.length;
 const FAR=({lo:165,md:215,hi:270})[QL];const _g=window.gtick;window.gtick=function(){_g();const c=camera.position;W8.tc.forEach(m=>{const d=Math.hypot(m.userData.c[0]-c.x,m.userData.c[1]-c.z);m.visible=d<FAR+42})}});
/* ---- papan tanda arah ---- */
const board=(t,flip)=>{const c=document.createElement('canvas');c.width=512;c.height=96;const g=c.getContext('2d');g.fillStyle='#8a5a2b';g.fillRect(0,0,512,96);g.fillStyle='#a8743c';for(let i=0;i<5;i++)g.fillRect(0,i*20+4,512,3);g.strokeStyle='#4a2e18';g.lineWidth=8;g.strokeRect(4,4,504,88);
 g.fillStyle='#fff4d6';g.font='bold 40px system-ui,sans-serif';g.textBaseline='middle';const s=flip?'⬅ '+t:t+' ➜';g.textAlign=flip?'left':'right';g.fillText(s,flip?22:490,50,470);const tx=new THREE.CanvasTexture(c);tx.anisotropy=4;return new THREE.MeshStandardMaterial({map:tx,roughness:.9})};
const sign=(x,z,bs)=>{const g=new THREE.Group(),wd=S(0x5e3f22);g.position.set(x,SF(x,z),z);add(g,CY(.1,.13,2.8,6),wd,0,1.4,0);add(g,CO(.16,.25,6),wd,0,2.92,0);
 bs.forEach(([dx,dz,t],k)=>{const b=new THREE.Group();b.position.y=2.42-k*.46;b.rotation.y=Math.atan2(-dz,dx);add(b,B(1.9,.4,.06),wd,.95,0,0);const f=new THREE.Mesh(new THREE.PlaneGeometry(1.86,.36),board(t,0));f.position.set(.95,0,.035);b.add(f);const bk=new THREE.Mesh(new THREE.PlaneGeometry(1.86,.36),board(t,1));bk.position.set(.95,0,-.035);bk.rotation.y=Math.PI;b.add(bk);g.add(b)});
 scene.add(g);W8.merge(g);W8.sp.push(g)};W8.sign=sign;

/* ---- pin teleport + pancing di jambatan ---- */
V8(()=>{const P0=DS[0];const pin=(a,b,x,z,r)=>{const e=P0.slice();e[0]=a;e[1]=b;e[2]=x;e[3]=z;e[4]=r||0;DS.push(e)};
 /* V19: pin kawasan rumah asal dinamakan semula ikut nama MASTER MAP (kedudukan tidak berubah) */
 const RN={'Sawah Kampung':'Sawah','Camp Atas Bukit':'Camp','Pantai Timur (sunset)':'Pantai Timur','Gunung Selatan':'Puncak'};DS.forEach(d=>{if(RN[d[1]])d[1]=RN[d[1]]});
 pin('🎣','Jeti Memancing',4,35,0);W8.BR.forEach(b=>pin(b[0],b[1],b[2],b[3],0));W17.LOC.forEach(([ic,n,x,z])=>{if(n=='Laluan Hutan Jauh')return;if(DS.some(d=>d[1]===n&&Math.hypot(d[2]-x,d[3]-z)<60))return;const p=W8.landNear(x,z);pin(ic,n,p[0],p[1],0)});
 dk.forEach(b=>{if(b.name=='Jeti')return;ST.push({x:b.cx,z:b.cz,r:Math.max(4,b.L/2+1),v:()=>!zb,lb:()=>GS.rod?'🎣 Memancing di '+b.name:'🎣 Perlu joran (dalam rumah)',tool:'rod',f:()=>zfish(0)})})});
/* ---- awan tambahan di kawasan baru ---- */
V8(()=>{const B=W8.B19;W8.cl=[];for(let i=0;i<26;i++){const c=new THREE.Group();for(let j=0;j<5;j++){const s=new THREE.Mesh(new THREE.SphereGeometry(3+R()*3.5,10,8),clouds.mat);s.position.set(j*4.5-9,R()*2,R()*3);s.scale.y=.6;c.add(s)}c.position.set(B.x0-30+R()*(B.x1-B.x0+60),40+R()*18,B.z0+R()*(B.z1-B.z0));scene.add(c);W8.cl.push(c)}
 const _g=window.gtick;window.gtick=function(){_g();W8.cl.forEach((c,i)=>{c.position.x+=.012+i*.002;if(c.position.x>B.x1+60)c.position.x=B.x0-60})}});
/* ---- peta: gambar peta dunia (ikut lakaran) ---- */
V8(()=>{W8.mapK=W19D.MAPK;window.mapBase=function(){return W17.mapCanvas()};
 const t=setInterval(()=>{try{if(typeof MC!='undefined'&&!MC){const m=mapBase();if(m){MC=m;clearInterval(t)}}else clearInterval(t)}catch(e){clearInterval(t)}},700)});
});

