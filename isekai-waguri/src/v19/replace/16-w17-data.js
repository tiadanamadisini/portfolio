/* ===== V19 PETA DUNIA (data): menggantikan grid V17 (yang dijana daripada peta lama).
   Grid ketinggian · kelas kawasan · ketumpatan hutan dijana oleh tools/gen_world.py daripada MASTER MAP
   (reference/master-map.png, 1 piksel = 0.8 m, 1 sel = 1.6 m, 768×512 sel).
   API `W17` dikekalkan (h, cls, fd, col, LOC, mapCanvas, HF, CL, GW, GH, K, OX, OY) supaya semua sistem lama berfungsi. ===== */
window.W17=(function(){
 const D=window.W19D;
 if(!D||!D.buf)throw new Error('Data dunia V19 (W19D) belum dinyahkod oleh pemuat');
 const dv=new DataView(D.buf);
 if(String.fromCharCode(dv.getUint8(0),dv.getUint8(1),dv.getUint8(2),dv.getUint8(3))!=='W19G')throw new Error('Data dunia V19 rosak (tanda W19G tiada)');
 const GW=dv.getUint32(4,true),GH=dv.getUint32(8,true),N=GW*GH;
 if(GW!==D.GW||GH!==D.GH||D.buf.byteLength!==12+N*4)throw new Error('Saiz data dunia V19 tidak sepadan ('+GW+'×'+GH+', '+D.buf.byteLength+' bait)');
 const K=D.K,OX=D.OX,OY=D.OY;
 const HQ=new Uint16Array(D.buf.slice(12,12+N*2)),CL=new Uint8Array(D.buf,12+N*2,N),FQ=new Uint8Array(D.buf,12+N*3,N);
 const HF=new Float32Array(N),FDA=new Float32Array(N),CR=new Float32Array(N),CG=new Float32Array(N),CB=new Float32Array(N);
 /* 0 laut dalam,1 air,2 pasir,3 rumput,4 hutan,5 sawah/ladang,6 batu,7 salji,8 padang pasir,9 lava,10 kampung,11 Kerajaan,12 tanah/jalan,13 basalt gunung berapi */
 const PAL=[[.30,.42,.40],[.45,.52,.42],[.82,.74,.52],[.42,.64,.24],[.24,.42,.15],[.62,.66,.28],[.52,.50,.45],[.93,.95,.98],[.88,.70,.44],[.95,.40,.08],[.56,.50,.40],[.72,.71,.68],[.63,.50,.33],[.20,.19,.21]];
 for(let i=0;i<N;i++){HF[i]=HQ[i]/20-12;const c=CL[i]<14?CL[i]:3;FDA[i]=FQ[i]/255;CR[i]=PAL[c][0];CG[i]=PAL[c][1];CB[i]=PAL[c][2]}
 const smp=(A,x,z,out)=>{const u=(x+OX)/K-.5,v=(z+OY)/K-.5;if(!(u>=0&&v>=0&&u<=GW-1&&v<=GH-1))return out;const i=u|0,j=v|0,fu=u-i,fv=v-j,i1=Math.min(GW-1,i+1),j1=Math.min(GH-1,j+1);
  return(A[j*GW+i]*(1-fu)+A[j*GW+i1]*fu)*(1-fv)+(A[j1*GW+i]*(1-fu)+A[j1*GW+i1]*fu)*fv};
 const nz=(x,z)=>Math.sin(x*.21+Math.sin(z*.17)*1.3)*Math.cos(z*.19-x*.07)*.35+Math.sin(x*.07-z*.05)*.3;
 const h=(x,z)=>{const v=smp(HF,x,z,-9);return v>.6?v+nz(x,z)*Math.min(1,(v-.6)*.8):v};
 const cls=(x,z)=>{const u=Math.round((x+OX)/K-.5),v=Math.round((z+OY)/K-.5);return(u<0||v<0||u>=GW||v>=GH)?0:CL[v*GW+u]};
 const fd=(x,z)=>smp(FDA,x,z,0);
 const col=(x,z,c)=>c.setRGB(smp(CR,x,z,.3),smp(CG,x,z,.42),smp(CB,x,z,.4));
 /* lokasi ikut MASTER MAP [ikon, nama, x, z] */
 const LOC=D.LOC.map(L=>[L.ic,L.n,L.x,L.z]);
 /* gambar peta (MASTER MAP) untuk peta penuh & peta mini */
 let mc=null,ok=0;const img=new Image();
 img.onload=()=>{ok=1;if(mc)mc.getContext('2d').drawImage(img,0,0,1536,1024)};
 img.onerror=()=>console.error('V19 gambar peta gagal dinyahkod');
 try{img.src=D.mapURL||('data:image/jpeg;base64,'+document.getElementById('w17img').textContent.replace(/\s+/g,''))}catch(e){console.error('W17 peta',e)}
 const mapCanvas=()=>{if(!ok)return null;if(!mc){mc=document.createElement('canvas');mc.width=1536;mc.height=1024;mc.getContext('2d').drawImage(img,0,0,1536,1024)}return mc};
 /* penukar koordinat: dunia (m) <-> piksel MASTER MAP */
 const toPx=(x,z)=>[(x+OX)/D.S,(z+OY)/D.S],toW=(px,py)=>[px*D.S-OX,py*D.S-OY];
 return{GW,GH,K,OX,OY,h,cls,fd,col,LOC,mapCanvas,HF,CL,toPx,toW,v:19,img:()=>ok?img:null};
})();
