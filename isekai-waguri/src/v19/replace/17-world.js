
/* ===== V8 DUNIA → V17 → V19 PETA DUNIA: dunia dibina semula ikut MASTER MAP (reference/master-map.png, 0.8 m sepiksel).
   Kawasan rumah asal (rangka v1–v16) kekal di kelompok timur (Sawah · Pasar · Camp · Kolam). Jalan, jambatan & Paya Bakau ikut peta. ===== */
const V8=f=>{try{f()}catch(e){console.error('v8',e)}};
const W8={dk:[],rd:[],fd:[],sp:[]};
W8.mm=new THREE.MeshStandardMaterial({vertexColors:true,flatShading:true,roughness:.85});
/* Preserve textured, transparent, emissive and multi-material parts (e.g. gable roofs).
   Baking those parts into one plain material either loses their appearance or crashes. */
W8.merge=(grp,cast)=>{grp.updateMatrixWorld(true);const Pp=[],Cc=[],inv=new THREE.Matrix4().copy(grp.matrixWorld).invert(),rm=[];
 grp.traverse(o=>{const mat=o.material;if(!o.isMesh||!o.geometry||!mat||Array.isArray(mat)||!mat.color||mat.map||mat.normalMap||mat.transparent||mat.opacity<1||o.userData.keep||(mat.emissive&&mat.emissiveIntensity!==0&&mat.emissive.getHex()!==0))return;
  const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld));const a=g.attributes.position.array,c=mat.color,vc=mat.vertexColors&&g.attributes.color;
  for(let i=0;i<a.length;i+=3){const k=i/3;Pp.push(a[i],a[i+1],a[i+2]);Cc.push(c.r*(vc?vc.getX(k):1),c.g*(vc?vc.getY(k):1),c.b*(vc?vc.getZ(k):1))}g.dispose();rm.push(o)});
 rm.forEach(o=>o.parent.remove(o));if(!Pp.length)return null;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(Pp,3));g.setAttribute('color',new THREE.Float32BufferAttribute(Cc,3));g.computeVertexNormals();
 const m=new THREE.Mesh(g,W8.mm);m.castShadow=cast!==false;m.receiveShadow=true;grp.add(m);return m};
V8(()=>{
const sm=t=>t<=0?0:t>=1?1:t*t*(3-2*t),lp=(a,b,t)=>a+(b-a)*t,WL=-.35;
const OR={x0:-97,x1:64,z0:-43,z1:123},inO=(x,z)=>x>=OR.x0&&x<=OR.x1&&z>=OR.z0&&z<=OR.z1,
 dOR=(x,z)=>Math.hypot(Math.max(OR.x0-x,0,x-OR.x1),Math.max(OR.z0-z,0,z-OR.z1));
Object.assign(W8,{sm,lp,inO,dOR,OR,WL});const B19=W19D.bounds;window.XN=B19.x0+6;window.XM=B19.x1-6;window.ZN=B19.z0+6;window.ZX=B19.z1-6;W8.B19=B19;
/* paya bakau: ikut MASTER MAP — sepanjang sungai Air Terjun, barat kelompok timur */
const SW={cx:-158,cz:86,rx:32,rz:15,ax:.379,az:.926,L:.3,on:true};W8.SW=SW;
const swD=(x,z)=>{const dx=x-SW.cx,dz=z-SW.cz;return Math.hypot((dx*SW.ax+dz*SW.az)/SW.rx,(-dx*SW.az+dz*SW.ax)/SW.rz)};
const swM=(x,z)=>SW.on?1-sm((swD(x,z)-.8)/.32):0;
const swN=(x,z)=>Math.max(0,Math.min(1,.5+.5*(Math.sin(x*.21+Math.sin(z*.17)*1.7)*Math.cos(z*.23-x*.07)*.62+Math.sin(x*.53+z*.41)*.25+Math.sin(x*1.1-z*.9)*.13)));
const swH=(x,z)=>SW.L-.95+1.22*swN(x,z);Object.assign(W8,{swD,swM,swN,swH});
const gYo=gY;
const PLY=(pts,pad)=>{const n=pts.length,X=new Float32Array(n),Z=new Float32Array(n),S=new Float32Array(n);
 for(let i=0;i<n;i++){X[i]=pts[i][0];Z[i]=pts[i][1];if(i)S[i]=S[i-1]+Math.hypot(X[i]-X[i-1],Z[i]-Z[i-1])}
 const C=16,G=new Map(),K=(a,b)=>a*4099+b;
 for(let i=0;i<n-1;i++){const x0=Math.floor((Math.min(X[i],X[i+1])-pad)/C),x1=Math.floor((Math.max(X[i],X[i+1])+pad)/C),z0=Math.floor((Math.min(Z[i],Z[i+1])-pad)/C),z1=Math.floor((Math.max(Z[i],Z[i+1])+pad)/C);
  for(let a=x0;a<=x1;a++)for(let b=z0;b<=z1;b++){const k=K(a,b);let l=G.get(k);if(!l)G.set(k,l=[]);l.push(i)}}
 const o={X,Z,S,n,L:S[n-1],pts};
 o.q=(x,z)=>{const l=G.get(K(Math.floor(x/C),Math.floor(z/C)));if(!l)return null;let bd=1e18,bi=0,bt=0;
  for(let j=0;j<l.length;j++){const i=l[j],ax=X[i],az=Z[i],dx=X[i+1]-ax,dz=Z[i+1]-az;let t=((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz||1);t=t<0?0:t>1?1:t;const ex=x-ax-t*dx,ez=z-az-t*dz,d=ex*ex+ez*ez;if(d<bd){bd=d;bi=i;bt=t}}
  return{d:Math.sqrt(bd),i:bi,t:bt}};
 o.v=(A,q)=>A[q.i]+(A[q.i+1]-A[q.i])*q.t;
 o.tan=i=>{const a=Math.max(0,i-1),b=Math.min(n-1,i+1),dx=X[b]-X[a],dz=Z[b]-Z[a],l=Math.hypot(dx,dz)||1;return[dx/l,dz/l]};
 return o};
const dnA=(c,s)=>dn(c,s).map(p=>[p.x,p.z]);
const segX=(ax,az,bx,bz,cx,cz,dx,dz)=>{const r1=bx-ax,r2=bz-az,s1=dx-cx,s2=dz-cz,den=r1*s2-r2*s1;if(Math.abs(den)<1e-9)return null;const t=((cx-ax)*s2-(cz-az)*s1)/den,u=((cx-ax)*r2-(cz-az)*r1)/den;return t>=0&&t<=1&&u>=0&&u<=1?{t,u}:null};
const cross=(A,Bp)=>{for(let i=0;i<A.length-1;i++)for(let j=0;j<Bp.length-1;j++){const r=segX(A[i][0],A[i][1],A[i+1][0],A[i+1][1],Bp[j][0],Bp[j][1],Bp[j+1][0],Bp[j+1][1]);if(r)return{x:lp(A[i][0],A[i+1][0],r.t),z:lp(A[i][1],A[i+1][1],r.t),i,t:r.t,j,u:r.u}}return null};
W8.PLY=PLY;W8.dnA=dnA;
/* ---- tanah: grid ketinggian dari gambar peta; kawasan rumah asal (OR) kekal & dicantum lembut ---- */
const Tn=(x,z)=>W17.h(x,z);
const Hn0=(x,z)=>{if(inO(x,z))return gYo(x,z);const w=sm(dOR(x,z)/22),n=Tn(x,z);return w>=1?n:lp(gYo(x,z),n,w)};
const Hn=(x,z)=>{const h=Hn0(x,z);if(!SW.on)return h;const m=swM(x,z);return m>0?lp(h,swH(x,z),m):h};
/* ---- sungai gunung: dari camp atas bukit turun ke Tasik Sunyi ---- */
const RXc=[[-68,54],[-69.5,59],[-71,65.5],[-73,72],[-79,78],[-88,83],[-97,88],[-106,95],[-118,99],[-132,99],[-146,96],[-160,92]];
const RX=PLY(dnA(RXc,1.5),36),LV=new Float32Array(RX.n),RMP2=RMP.map(p=>[p[0],p[1]]),c1=cross(RX.pts,RMP2),rampY=(x,z)=>ramp(x,z)[1];
const sB1=c1?RX.S[c1.i]+(RX.S[c1.i+1]-RX.S[c1.i])*c1.t:12,yB1=c1?rampY(c1.x,c1.z):16,L1=Math.min(15,yB1-1.45);
for(let i=0;i<RX.n;i++){const s=RX.S[i];let L=s<sB1?lp(20.32,L1,sm(s/sB1)):L1-(s-sB1)*.055;
 if(s>sB1+3){const x=RX.X[i],z=RX.Z[i],[tx,tz]=RX.tan(i),hm=(a,b)=>ramp(a,b)[0]<11?1e9:Hn(a,b),m=Math.min(Hn(x,z),hm(x-tz*3.5,z+tx*3.5),hm(x+tz*3.5,z-tx*3.5))-.9;if(m<L)L=m}
 const e=RX.L-s;if(e<30)L=Math.min(L,WL+.04+e*.25);
 if(i)L=Math.min(L,LV[i-1]);LV[i]=Math.max(WL+.04,L)}
const carve=(x,z,h)=>{const q=RX.q(x,z);if(!q||q.d>34||(q.i==0&&q.t<=0))return h;const L=RX.v(LV,q),d=q.d;
 if(d<2.2)return Math.min(h,L-.9);if(d<3.6)return Math.min(h,lp(L-.9,L+.3,sm((d-2.2)/1.4)));
 if(inO(x,z)&&ramp(x,z)[0]<4.5)return h;
 let hb=Math.min(h,L+.3+1.25*Math.min(d-3.6,6.4)+1.8*Math.max(0,d-10));if(d<10)hb=lp(Math.max(hb,L+.3),hb,sm((d-7)/3));return hb};
Object.assign(W8,{RX,LV,Hn,Tn});
/* ---- jalan utama ikut peta ---- */
const mkRoad=(name,ctrl,w,col,win)=>{const pts=dnA(ctrl,2),R=PLY(pts,w/2+w*.9+8),n=R.n,Y=new Float32Array(n),Yn=new Float32Array(n);
 for(let i=0;i<n;i++)Yn[i]=Math.max(WL+.55,Hn(R.X[i],R.Z[i]));
 for(let i=0;i<n;i++){if(inO(R.X[i],R.Z[i])){Y[i]=Yn[i];continue}let s=0,c=0;for(let k=-win;k<=win;k++){const j=i+k;if(j<0||j>=n)continue;const wt=1-Math.abs(k)/(win+1);s+=Yn[j]*wt;c+=wt}Y[i]=s/c}
 const o={name,R,Y,w,col};W8.rd.push(o);return o};
const flat=(o,x,z,h)=>{if(h<WL+.15)return h;const q=o.R.q(x,z);if(!q)return h;const hw=o.w/2,sh=o.w*.9+2.2;if(q.d>hw+sh)return h;const k=(1-sm((q.d-hw)/sh))*sm(dOR(x,z)/5);return k<=0?h:lp(h,o.R.v(o.Y,q),k)};
/* V19: rangkaian jalan dijejak daripada MASTER MAP (tools/world_ref.py) */
const RD19=W19D.ROADS.map(r=>mkRoad(r.n,r.p,r.w,r.c,r.t==='d'?8:5));
const TJ=mkRoad(W19D.TRAIL.n,W19D.TRAIL.p,W19D.TRAIL.w,W19D.TRAIL.c,5);mkRoad(W19D.TRAIL2.n,W19D.TRAIL2.p,W19D.TRAIL2.w,W19D.TRAIL2.c,5);
const RR=RD19.find(o=>o.name==='Jalan Diraja Timur')||RD19[0],TR=RD19.find(o=>o.name==='Jalan Diraja Selatan')||RD19[0];
W8.TJ=TJ;W8.RR=RR;W8.TR=TR;
/* indeks ruang gabungan: H() hanya meratakan jalan yang berdekatan (40+ jalan tidak melambatkan pembinaan) */
const RIX=new Map(),RCs=24,rk=(a,b)=>a*8191+b,NOR=[];
W8.rd.forEach((o,k)=>{const R=o.R,pad=o.w/2+o.w*.9+3;for(let i=0;i<R.n-1;i++){const x0=Math.floor((Math.min(R.X[i],R.X[i+1])-pad)/RCs),x1=Math.floor((Math.max(R.X[i],R.X[i+1])+pad)/RCs),z0=Math.floor((Math.min(R.Z[i],R.Z[i+1])-pad)/RCs),z1=Math.floor((Math.max(R.Z[i],R.Z[i+1])+pad)/RCs);
 for(let a=x0;a<=x1;a++)for(let b=z0;b<=z1;b++){const kk=rk(a,b);let l=RIX.get(kk);if(!l)RIX.set(kk,l=[]);if(l[l.length-1]!==k)l.push(k)}}});
W8.rdNear=(x,z)=>RIX.get(rk(Math.floor(x/RCs),Math.floor(z/RCs)))||NOR;
const H=(x,z)=>{let h=Hn(x,z);if(!inO(x,z)){const L=W8.rdNear(x,z);for(let i=0;i<L.length;i++)h=flat(W8.rd[L[i]],x,z,h)}return carve(x,z,h)};
const onDk=(x,z)=>{const D=W8.dk;for(let i=0;i<D.length;i++){const b=D[i],dx=x-b.cx,dz=z-b.cz,u=dx*b.ax+dz*b.az,v=-dx*b.az+dz*b.ax;if(u>-b.L/2&&u<b.L/2&&v>-b.W/2&&v<b.W/2)return lp(b.h0,b.h1,(u+b.L/2)/b.L)+.16}return null};
const SF=(x,z)=>{const d=zb?null:onDk(x,z);return d!=null?d:H(x,z)};
const landNear=(x,z)=>{for(let r=0;r<44;r+=1.5)for(let a=0;a<6.283;a+=r?Math.min(.8,2/r):7){const px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r,h=H(px,pz);if(h>WL+.6&&Math.abs(H(px+1.5,pz)-h)<1.3&&Math.abs(H(px,pz+1.5)-h)<1.3&&!solid(px,pz))return[px,pz]}return[x,z]};
Object.assign(W8,{H,SF,onDk,carve,landNear});
window.stpX=(x0,z0,x1,z1)=>{const d=Math.hypot(x1-x0,z1-z0);return d>1e-6&&SF(x1,z1)-SF(x0,z0)>3.5*d};
/* ---- jambatan ---- */
const mkBridge=(cx,cz,ax,az,L,W,h0,h1,name)=>{const g=new THREE.Group();g.rotation.order='YXZ';g.rotation.y=Math.atan2(ax,az);g.rotation.x=-Math.atan2(h1-h0,L);g.position.set(cx,(h0+h1)/2,cz);
 const wd=S(0x8a5a2b),wd2=S(0x5e3f22),pl=S(0xb07d45);add(g,B(W,.3,L),pl,0,0,0);
 for(let k=-L/2+.45;k<L/2;k+=.9)add(g,B(W+.04,.05,.07),wd2,0,.16,k,false);
 [-1,1].forEach(s=>{add(g,B(.2,.3,L+.2),wd,s*(W/2-.1),.25,0);add(g,B(.14,.12,L+.2),wd,s*(W/2-.1),1.08,0);for(let k=-L/2+.2;k<=L/2+.01;k+=(L-.4)/Math.max(2,Math.round(L/2.2)))add(g,B(.18,1,.18),wd,s*(W/2-.1),.62,k)});
 const q=RX.q(cx,cz),bed=q&&q.d<5?RX.v(LV,q)-1:Math.min(h0,h1)-3,ym=(h0+h1)/2,sg=new THREE.Group();
 [-1,1].forEach(s=>[-.18,.18].forEach(f=>{const px=cx+ax*f*L-az*s*(W/2-.3),pz=cz+az*f*L+ax*s*(W/2-.3),hh2=Math.max(.5,ym-bed);add(sg,new THREE.CylinderGeometry(.22,.26,hh2,7),wd2,px,bed+hh2/2,pz)}));
 scene.add(g);W8.merge(g);scene.add(sg);W8.merge(sg);
 W8.dk.push({cx,cz,ax,az,L,W,h0,h1,name});lab('🌉 '+name,cx,Math.max(h0,h1)+3.4,cz)};
const bridgeOn=(o,name,yf)=>{const c=cross(o.R.pts,RX.pts);if(!c)return null;const i=c.i,[ax,az]=o.R.tan(i),yAt=(x,z)=>{if(yf)return yf(x,z);const q=o.R.q(x,z);return q?o.R.v(o.Y,q):H(x,z)};
 const ext=sg=>{let e=3.5;for(;e<12;e+=.5){const x=c.x+ax*e*sg,z=c.z+az*e*sg;if(H(x,z)>=yAt(x,z)-.35)break}return Math.min(12,e+.8)};
 const e0=ext(-1),e1=ext(1),L=e0+e1,mx=c.x+ax*(e1-e0)/2,mz=c.z+az*(e1-e0)/2,h0=yAt(c.x-ax*e0,c.z-az*e0),h1=yAt(c.x+ax*e1,c.z+az*e1);
 mkBridge(mx,mz,ax,az,L,o.w+1.2,h0,h1,name);return{x:c.x,z:c.z}};
const BR=[];W8.BR=BR;
V8(()=>{if(c1){const j=c1.j,dx=RMP2[j+1][0]-RMP2[j][0],dz=RMP2[j+1][1]-RMP2[j][1],l=Math.hypot(dx,dz),o={R:{pts:[[c1.x-dx/l*9,c1.z-dz/l*9],[c1.x+dx/l*9,c1.z+dz/l*9]],tan:()=>[dx/l,dz/l]},w:6};
 o.R.q=()=>null;const b=bridgeOn(o,'Jambatan Camp',rampY);if(b)BR.push(['🌉','Jambatan Camp',b.x,b.z])}});
/* jambatan automatik di setiap tempat jalan melintasi air (sungai keliling Kerajaan, tasik) */
V8(()=>{const AN=Object.entries(W19D.BR).map(([n,p])=>[n,p[0],p[1]]),PINB=new Set(['Jambatan Hutan','Jambatan Jalan Baru','Jambatan Paya Bakau','Jambatan Pulau Lanun','Jambatan Larangan','Jambatan Utara','Jambatan Selatan']),used={};let n=0;
 W8.rd.forEach(o=>{const R=o.R,wet=i=>Hn(R.X[i],R.Z[i])<WL+.12;let i=1;
  while(i<R.n-1){if(!wet(i)){i++;continue}let a=i;while(i<R.n-1&&wet(i))i++;const b=i,s0=Math.max(0,a-1),s1=Math.min(R.n-1,b),len=R.S[s1]-R.S[s0];if(len<1||len>80||inO(R.X[a],R.Z[a]))continue;
   const e0=Math.max(0,s0-1),e1=Math.min(R.n-1,s1+1),x0=R.X[e0],z0=R.Z[e0],x1=R.X[e1],z1=R.Z[e1],L=Math.hypot(x1-x0,z1-z0),ax=(x1-x0)/L,az=(z1-z0)/L,cx=(x0+x1)/2,cz=(z0+z1)/2;
   let nm=null;for(const q of AN)if(!used[q[0]]&&Math.hypot(cx-q[1],cz-q[2])<26){nm=q[0];break}if(nm)used[nm]=1;else nm=o.name.replace('Jalan','Jambatan').replace('Laluan','Jambatan')+' '+(++n);
   mkBridge(cx,cz,ax,az,L,o.w+1.2,Math.max(WL+.7,o.Y[e0]),Math.max(WL+.7,o.Y[e1]),nm);if(used[nm]&&PINB.has(nm))BR.push(['🌉',nm,cx,cz])}})});
/* jeti kolam memancing */
V8(()=>{const wd=S(0x8a5a2b),pl=S(0xb07d45),g=new THREE.Group();g.position.set(4,.42,41.6);add(g,B(2.4,.22,9),pl);for(let k=-4.2;k<=4.2;k+=.75)add(g,B(2.45,.05,.07),S(0x5e3f22),0,.12,k,false);
 [-1,1].forEach(s=>{for(let k=-4;k<=4.01;k+=2)add(g,new THREE.CylinderGeometry(.13,.15,1.6),wd,s*1.05,-.55,k)});add(g,B(.12,.9,.12),wd,1.1,.5,4.4);add(g,B(.12,.9,.12),wd,-1.1,.5,4.4);add(g,B(2.3,.1,.1),wd,0,.92,4.4);
 scene.add(g);W8.merge(g);W8.dk.push({cx:4,cz:41.6,ax:0,az:1,L:9,W:2.4,h0:.42,h1:.42,name:'Jeti'});lab('🎣 Jeti Memancing',4,3.2,38)});
/* ---- jaring permukaan: halus di kawasan tengah (rumput 3D), sederhana di seluruh peta, kasar di laut luar ---- */
const QS=({lo:4.4,md:3.6,hi:3.0})[QL],QF=({lo:2.6,md:2.0,hi:1.6})[QL];
const axis=segs=>{const v=[];segs.forEach(([a,b,s])=>{const n=Math.max(1,Math.round((b-a)/s));for(let i=0;i<n;i++)v.push(a+(b-a)*i/n)});v.push(segs[segs.length-1][1]);return v};
const XS=axis([[B19.x0-90,B19.x0-4,10],[B19.x0-4,-216,QS],[-216,72,QF],[72,B19.x1+4,QS],[B19.x1+4,B19.x1+90,10]]),ZS=axis([[B19.z0-90,B19.z0-4,10],[B19.z0-4,-104,QS],[-104,250,QF],[250,B19.z1+4,QS],[B19.z1+4,B19.z1+90,10]]),NX=XS.length,NZ=ZS.length,NV=NX*NZ;
const HG=new Float32Array(NV);for(let j=0;j<NZ;j++)for(let i=0;i<NX;i++)HG[j*NX+i]=H(XS[i],ZS[j]);
Object.assign(W8,{XS,ZS,HG,NX,NZ,QS});
/* kepadatan hutan ikut kawasan peta */
const FD0=(x,z)=>{if(inO(x,z)||x>52)return 0;return W17.fd(x,z)*(.78+.22*Math.sin(x*.09+z*.05)*Math.cos(z*.07-x*.03))*sm(dOR(x,z)/10)};
const FD=(x,z)=>{const m=swM(x,z);return m>=.999?0:FD0(x,z)*(1-m)};
W8.FD=FD;
const OLD=[[[[-43,21],[57,21]],10],[[[19,-27],[19,17]],8],[[[56,15],[56,122]],7],[NBD.map(p=>[p.x,p.z]),7],[dnA([[-43,21],[-50,14],[-58,4],[-64,-6],[-68,-13]],2),5]].map(([p,w])=>({R:PLY(p.length>1?p:[p[0],p[0]],w),w}));
W8.OLD=OLD;
const TG=new Map(),tk=(x,z)=>Math.floor(x/6)*997+Math.floor(z/6);trees.forEach(o=>{const g=o.f.parent;if(g){const k=tk(g.position.x,g.position.z);TG.set(k,(TG.get(k)||0)+1)}});
const tden=(x,z)=>{let s=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)s+=TG.get(tk(x+a*6,z+b*6))||0;return Math.min(1,s/7)};
V8(()=>{const pos=new Float32Array(NV*3),col=new Float32Array(NV*3),uv=new Float32Array(NV*2),C=THREE.Color,c=new C(),t=new C(),o2=new C(),
 gA=new C(.40,.66,.22),gB=new C(.28,.55,.15),gD=new C(.62,.63,.30),ff=new C(.21,.36,.12),fb=new C(.34,.29,.15),rk=new C(.50,.48,.42),rk2=new C(.36,.35,.31),sd=new C(.80,.70,.48),ws=new C(.60,.51,.34),dt=new C(.60,.47,.30),md=new C(.42,.34,.21),sn=new C(.93,.95,.98),bed=new C(.36,.42,.40),dp=new C(.16,.24,.30);
 for(let j=0;j<NZ;j++)for(let i=0;i<NX;i++){const k=j*NX+i,x=XS[i],z=ZS[j],h=HG[k];pos[k*3]=x;pos[k*3+1]=h;pos[k*3+2]=z;uv[k*2]=x/3.2;uv[k*2+1]=z/3.2;
  const il=Math.max(0,i-1),ir=Math.min(NX-1,i+1),jd=Math.max(0,j-1),ju=Math.min(NZ-1,j+1),sx=(HG[j*NX+ir]-HG[j*NX+il])/(XS[ir]-XS[il]),sz=(HG[ju*NX+i]-HG[jd*NX+i])/(ZS[ju]-ZS[jd]),sl=Math.hypot(sx,sz);
  const n1=.5+.5*Math.sin(x*.045+Math.sin(z*.031)*2)*Math.cos(z*.052-x*.013),n2=.5+.5*Math.sin(x*.21+z*.17)*Math.sin(z*.23-x*.11),w=sm(dOR(x,z)/22);
  /* warna kawasan baharu (ikut gambar) */
  W17.col(x,z,o2);o2.multiplyScalar(.92+.16*n2);if(h>.6)o2.lerp(t.copy(gA).lerp(gB,n1),.12);
  const c19=W17.cls(x,z),vol=c19===9||c19===13;o2.lerp(rk2,sm((sl-.95)/.7)*(vol?.15:.7));if(!vol)o2.lerp(sn,sm((h-42)/12)*.9);if(h<WL)o2.copy(bed).lerp(dp,sm((WL-h)/5));else if(h<.7)o2.lerp(sd,.55);
  if(w<1){/* warna asal kawasan rumah */
   c.copy(gA).lerp(gB,n1*.85+n2*.15);c.lerp(gD,sm((n1-.62)/.3)*.3);const f=inO(x,z)?tden(x,z)*.8:0;if(f>0)c.lerp(t.copy(ff).lerp(fb,n2*.5),f*.75);
   c.lerp(rk,sm((h-24)/12)*.85);c.lerp(rk2,sm((sl-.85)/.6)*.8);
   if(x>53){const rp=.93+.07*Math.sin(z*1.1+x*.45+Math.sin(z*.13)*3)+.04*(n2-.5);t.copy(sd).lerp(ws,sm((h+.05)/-.3)*.9+sm((x-63)/3)*.35).multiplyScalar(rp);c.lerp(t,sm((x-53)/4))}
   c.multiplyScalar(.94+.12*n2);c.lerp(o2,w)}else c.copy(o2);
  {const swm=swM(x,z);if(swm>0)c.lerp(t.setRGB(.19,.2,.1).lerp(md,.3),swm*.82)}
  let dr=1e9;{const L=W8.rdNear(x,z);for(let ii=0;ii<L.length;ii++){const o=W8.rd[L[ii]],q=o.R.q(x,z);if(q){const e=q.d-o.w/2;if(e<dr)dr=e}}}if(w<1)for(const o of OLD){const q=o.R.q(x,z);if(q){const e=q.d-o.w/2;if(e<dr)dr=e}}
  if(dr<1.6&&h>WL+.1)c.lerp(dt,(1-sm((dr+.4)/2))*.85);
  const qr=RX.q(x,z);let dw=qr?qr.d:1e9;if(w<1)dw=Math.min(dw,dPL(x,z,RVD[0]),dPL(x,z,RVD[1]));if(dw<6.5)c.lerp(md,sm((6.5-dw)/3.2)*.7);
  col[k*3]=c.r;col[k*3+1]=c.g;col[k*3+2]=c.b}
 const idx=new Uint32Array((NX-1)*(NZ-1)*6);let p=0;for(let j=0;j<NZ-1;j++)for(let i=0;i<NX-1;i++){const a=j*NX+i,b=a+1,d=a+NX,e=d+1;idx[p++]=a;idx[p++]=d;idx[p++]=b;idx[p++]=b;idx[p++]=d;idx[p++]=e}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));g.setIndex(new THREE.BufferAttribute(idx,1));g.computeVertexNormals();g.computeBoundingSphere();
 const cv=document.createElement('canvas');cv.width=cv.height=256;const x2=cv.getContext('2d'),im=x2.createImageData(256,256);let s=11;const rr=()=>(s=(s*16807)%2147483647)/2147483647;
 for(let y=0;y<256;y++)for(let x=0;x<256;x++){const v=200+30*Math.sin(x*.098)*Math.sin(y*.098)+rr()*40-12,o=(y*256+x)*4;im.data[o]=im.data[o+1]=im.data[o+2]=Math.max(0,Math.min(255,v));im.data[o+3]=255}
 x2.putImageData(im,0,0);for(let n=0;n<900;n++){const a=rr()*6.28,l=2+rr()*5,x=rr()*256,y=rr()*256;x2.strokeStyle='rgba('+(rr()<.5?'255,255,255':'0,0,0')+','+(.06+rr()*.1)+')';x2.lineWidth=1;x2.beginPath();x2.moveTo(x,y);x2.lineTo(x+Math.cos(a)*l*.3,y-l);x2.stroke()}
 const tx=new THREE.CanvasTexture(cv);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,map:tx}));m.receiveShadow=true;m.userData.v8=1;scene.add(m);W8.ter=m;
 const om=scene.children.find(o=>o.geometry&&o.geometry.type=='PlaneGeometry'&&o.geometry.parameters.width==300);if(om)om.visible=false;
 /* laut kini mengelilingi seluruh benua */
 const se=SEA&&scene.children.find(o=>o.isMesh&&o.material===SEA.m);if(se){se.geometry.dispose();se.geometry=new THREE.PlaneGeometry(3800,3400);se.position.set(-480,WL,-10)}
 if(SEA&&SEA.f){SEA.f.geometry.dispose();SEA.f.geometry=new THREE.PlaneGeometry(2.2,226);SEA.f.position.z=68}});
/* ---- reben jalan & sungai gunung ---- */
const rib=(pts,w,yf,mat,skip)=>{const P=[],I=[];let n=0;for(let i=0;i<pts.length;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1,nx=-dz/l*w/2,nz=dx/l*w/2,x=pts[i][0],z=pts[i][1];
 if(skip&&skip(x,z)){n=0;continue}P.push(x+nx,yf(x+nx,z+nz,i),z+nz,x-nx,yf(x-nx,z-nz,i),z-nz);const k=P.length/3-2;if(n)I.push(k-2,k-1,k,k-1,k+1,k);n++}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setIndex(I);g.computeVertexNormals();const m=new THREE.Mesh(g,mat);m.receiveShadow=true;scene.add(m);return m};
V8(()=>{const mk=c=>new THREE.MeshStandardMaterial({color:c,roughness:1,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
 /* V19: reben jalan digabung ikut warna (3–4 panggilan lukis, bukan 40+) */
 {const ribInto=(P,I,pts,w,yf,skip)=>{let n=0;for(let i=0;i<pts.length;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1,nx=-dz/l*w/2,nz=dx/l*w/2,x=pts[i][0],z=pts[i][1];
   if(skip(x,z)){n=0;continue}P.push(x+nx,yf(x+nx,z+nz),z+nz,x-nx,yf(x-nx,z-nz),z-nz);const k=P.length/3-2;if(n)I.push(k-2,k-1,k,k-1,k+1,k);n++}};
  const byC=new Map();W8.rd.forEach(o=>{let l=byC.get(o.col);if(!l)byC.set(o.col,l=[]);l.push(o)});
  byC.forEach((L,c)=>{const P=[],I=[];L.forEach(o=>ribInto(P,I,o.R.pts,o.w,(x,z)=>H(x,z)+.06,(x,z)=>onDk(x,z)!=null||Hn(x,z)<WL+.12));if(!I.length)return;
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setIndex(I);g.computeVertexNormals();const me=new THREE.Mesh(g,mk(c));me.receiveShadow=true;me.userData.road19=1;scene.add(me)})}
 const wm=new THREE.MeshStandardMaterial({color:0x2f86e0,roughness:.1,metalness:.15,transparent:true,opacity:.9,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 const RP=RX.pts.filter((p,i)=>RX.S[i]>.6);rib(RP,6.4,(x,z,i)=>LV[i+RX.pts.length-RP.length]+.02,wm);W8.wm=wm;
 const im=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1,0),S(0x6b6f72),400),d=new THREE.Object3D();let n=0;
 for(let i=2;i<RX.n-1&&n<400;i+=2){const[tx,tz]=RX.tan(i),L=LV[i];for(const sg of[-1,1]){const o=sg*(3.2+R()*.9),x=RX.X[i]-tz*o,z=RX.Z[i]+tx*o,s=.35+R()*.6;d.position.set(x,Math.max(H(x,z),L)+.05,z);d.scale.set(s,s*.6,s);d.rotation.set(R(),R()*6,0);d.updateMatrix();im.setMatrixAt(n++,d.matrix)}}
 im.count=n;im.castShadow=QL!='lo';im.userData.v8=1;im.frustumCulled=false;scene.add(im)});
/* ---- bersihkan pokok/rumput asal di laluan & sungai baru ---- */
const near=(x,z)=>{if(!inO(x,z))return false;for(const o of W8.rd){const q=o.R.q(x,z);if(q&&q.d<o.w/2+1.6)return true}const q=RX.q(x,z);return!!(q&&q.d<8&&!(q.i==0&&q.t<=0))};
W8.near=near;
V8(()=>{trees.forEach(o=>{const g=o.f.parent;if(g&&near(g.position.x,g.position.z))g.visible=false});for(let i=OB.length-1;i>=0;i--){const o=OB[i];if(o&&o.r&&o.r<1.6&&!o.rx&&near(o.x,o.z))OB.splice(i,1)}
 const mx=new THREE.Matrix4(),v=new THREE.Vector3();scene.children.forEach(m=>{if(!m.isInstancedMesh||m.userData.v8)return;let ch=0;for(let i=0;i<m.count;i++){m.getMatrixAt(i,mx);v.setFromMatrixPosition(mx);if(near(v.x,v.z)){mx.makeScale(0,0,0);m.setMatrixAt(i,mx);ch=1}}if(ch)m.instanceMatrix.needsUpdate=true})});
/* ---- tanah: tetapkan semula ketinggian (gY2) + berenang di laut, sungai & tasik ---- */
const _g0=window.gY2;
window.gY2=function(x,z){if(!zb){const d=onDk(x,z);if(d!=null){W4.sw=false;return d}}
 const q=RX.q(x,z);if(q&&q.d<3&&!(q.i==0&&q.t<=0)&&!zb){const L=RX.v(LV,q);if(L>WL+.3||inO(x,z)){W4.sw=true;W4.wl=L;return L-.9}}
 if(inO(x,z)){const g=_g0(x,z);if(W4.sw)return g;return(q&&q.d<34)?H(x,z):g}
 const h=H(x,z);if(!zb&&h<WL-.55){W4.sw=true;W4.wl=WL;return WL-.9}W4.sw=false;return h};
/* kamera tak masuk bukit */
V8(()=>{const _g=window.gtick;window.gtick=function(){_g();const c=camera.position,h=SF(c.x,c.z)+.7;if(c.y<h)c.y=h}});
});
