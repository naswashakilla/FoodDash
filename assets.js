/* ══════════════════════════════════════════════
   FOOD DASH DELUXE — assets.js
   High-resolution canvas-drawn sprites (no images needed)
   ══════════════════════════════════════════════ */
'use strict';

function mkc(w,h){ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; }
function rnd(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }

/* ══ HELPER: rounded rect ══ */
function rr(g,x,y,w,h,r){
  g.beginPath();
  g.moveTo(x+r,y);
  g.lineTo(x+w-r,y); g.quadraticCurveTo(x+w,y,x+w,y+r);
  g.lineTo(x+w,y+h-r); g.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  g.lineTo(x+r,y+h); g.quadraticCurveTo(x,y+h,x,y+h-r);
  g.lineTo(x,y+r); g.quadraticCurveTo(x,y,x+r,y);
  g.closePath();
}

/* ══ HELPER: circle ══ */
function circ(g,x,y,r){ g.beginPath(); g.arc(x,y,r,0,Math.PI*2); g.closePath(); }

/* ════════════════════════════════════════════
   PLAYER — cute round chef with big eyes
   48×56 px, drawn smooth (no pixelArt override)
   ════════════════════════════════════════════ */
function drawPlayerHD(state='idle', dir=1){
  const W=48, H=56;
  const c=mkc(W,H); const g=c.getContext('2d');

  const cx=W/2;

  // ── Shadow ──
  g.fillStyle='rgba(0,0,0,0.18)';
  rr(g,8,H-8,W-16,8,4); g.fill();

  // ── Body ──
  const bodyGrad=g.createLinearGradient(cx-14,18,cx+14,H-14);
  bodyGrad.addColorStop(0,'#5BE8E0');
  bodyGrad.addColorStop(1,'#2DCCC4');
  g.fillStyle=bodyGrad;
  rr(g,cx-14,20,28,30,10); g.fill();

  // body outline
  g.strokeStyle='#1AADAA'; g.lineWidth=1.5;
  rr(g,cx-14,20,28,30,10); g.stroke();

  // ── Belly spot ──
  g.fillStyle='rgba(255,255,255,0.3)';
  rr(g,cx-7,26,14,16,6); g.fill();

  // ── Legs ──
  const legColor='#1A7DB5';
  const legH=12, legW=10, legR=5;
  if(state==='walk'){
    // left leg forward
    g.fillStyle=legColor; rr(g,cx-14,H-legH-2,legW,legH+4,legR); g.fill();
    g.fillStyle='#145E8A'; rr(g,cx+4,H-legH+2,legW,legH,legR); g.fill();
    // shoes
    g.fillStyle='#FF6B9D'; rr(g,cx-16,H-6,14,7,4); g.fill();
    g.fillStyle='#FF4D8D'; rr(g,cx+2,H-4,14,6,4); g.fill();
  } else {
    g.fillStyle=legColor;
    rr(g,cx-14,H-legH-2,legW,legH,legR); g.fill();
    rr(g,cx+4,H-legH-2,legW,legH,legR); g.fill();
    // shoes
    g.fillStyle='#FF6B9D';
    rr(g,cx-16,H-6,14,7,4); g.fill();
    rr(g,cx+2,H-6,14,7,4); g.fill();
  }

  // ── Arms ──
  if(state==='walk'){
    // swing
    g.fillStyle='#5BE8E0'; rr(g,cx-22,22,10,18,5); g.fill();
    g.strokeStyle='#1AADAA'; g.lineWidth=1.5; rr(g,cx-22,22,10,18,5); g.stroke();
    g.fillStyle='#5BE8E0'; rr(g,cx+12,26,10,14,5); g.fill();
    g.strokeStyle='#1AADAA'; rr(g,cx+12,26,10,14,5); g.stroke();
  } else {
    g.fillStyle='#5BE8E0';
    rr(g,cx-22,24,10,14,5); g.fill();
    rr(g,cx+12,24,10,14,5); g.fill();
    g.strokeStyle='#1AADAA'; g.lineWidth=1.5;
    rr(g,cx-22,24,10,14,5); g.stroke();
    rr(g,cx+12,24,10,14,5); g.stroke();
  }

  // ── Head ──
  const headGrad=g.createRadialGradient(cx-4,6,4,cx,10,18);
  headGrad.addColorStop(0,'#7DF2EB');
  headGrad.addColorStop(1,'#3DD8D0');
  g.fillStyle=headGrad;
  circ(g,cx,10,16); g.fill();
  g.strokeStyle='#1AADAA'; g.lineWidth=1.5;
  circ(g,cx,10,16); g.stroke();

  // ── Chef Hat ──
  // brim
  g.fillStyle='#FFFFFF';
  rr(g,cx-14,0,28,6,3); g.fill();
  g.strokeStyle='#E0E0E0'; g.lineWidth=1; rr(g,cx-14,0,28,6,3); g.stroke();
  // puff
  const hatGrad=g.createLinearGradient(cx-9,-14,cx+9,2);
  hatGrad.addColorStop(0,'#FFFFFF');
  hatGrad.addColorStop(1,'#F0F0F0');
  g.fillStyle=hatGrad;
  rr(g,cx-9,-14,18,16,8); g.fill();
  g.strokeStyle='#E0E0E0'; rr(g,cx-9,-14,18,16,8); g.stroke();
  // hat shine
  g.fillStyle='rgba(255,255,255,0.6)';
  rr(g,cx-6,-12,6,6,3); g.fill();

  // ── Eyes ──
  const eyeY=8;
  // whites
  g.fillStyle='#FFFFFF';
  circ(g,cx-6,eyeY,5.5); g.fill();
  circ(g,cx+6,eyeY,5.5); g.fill();
  // pupils
  const pOff = dir>0 ? 1.5 : -1.5;
  g.fillStyle='#1A1A2E';
  circ(g,cx-6+pOff,eyeY+0.5,3); g.fill();
  circ(g,cx+6+pOff,eyeY+0.5,3); g.fill();
  // eye shine
  g.fillStyle='#FFFFFF';
  circ(g,cx-5+pOff,eyeY-1,1.2); g.fill();
  circ(g,cx+7+pOff,eyeY-1,1.2); g.fill();
  // rosy cheeks
  g.fillStyle='rgba(255,107,157,0.35)';
  circ(g,cx-10,14,4); g.fill();
  circ(g,cx+10,14,4); g.fill();

  // ── Smile ──
  g.strokeStyle='#1A6B68'; g.lineWidth=2;
  g.beginPath();
  g.arc(cx,15,5,0.2,Math.PI-0.2);
  g.stroke();

  return c;
}

/* ════════════════════════════════════════════
   JUMP frame
   ════════════════════════════════════════════ */
function drawPlayerJump(){
  const c=drawPlayerHD('idle');
  // overwrite legs spread
  const g=c.getContext('2d');
  const W=48,H=56,cx=W/2;
  g.clearRect(0,H-22,W,22);
  // shadow smaller
  g.fillStyle='rgba(0,0,0,0.1)';
  rr(g,12,H-7,W-24,6,3); g.fill();
  // legs spread
  g.fillStyle='#1A7DB5';
  rr(g,cx-18,H-18,10,14,5); g.fill();
  rr(g,cx+8,H-18,10,14,5); g.fill();
  g.fillStyle='#FF6B9D';
  rr(g,cx-20,H-6,14,7,4); g.fill();
  rr(g,cx+6,H-6,14,7,4); g.fill();
  return c;
}

/* ════════════════════════════════════════════
   GROUND TILE — layered cake slice / brownie
   64×40 px
   ════════════════════════════════════════════ */
function drawGround(){
  const c=mkc(64,40); const g=c.getContext('2d');

  // base layer (dark chocolate)
  const bg=g.createLinearGradient(0,12,0,40);
  bg.addColorStop(0,'#8B5E3C');
  bg.addColorStop(1,'#5C3317');
  g.fillStyle=bg; g.fillRect(0,12,64,28);

  // mid layer (caramel)
  const mid=g.createLinearGradient(0,6,0,14);
  mid.addColorStop(0,'#C88B3A');
  mid.addColorStop(1,'#A0692A');
  g.fillStyle=mid; g.fillRect(0,6,64,8);

  // top icing
  const ice=g.createLinearGradient(0,0,0,8);
  ice.addColorStop(0,'#FFF5E4');
  ice.addColorStop(1,'#FFE0B2');
  g.fillStyle=ice; g.fillRect(0,0,64,8);

  // icing drips
  const drips=[[4,6,7],[14,7,5],[26,5,8],[38,8,6],[50,6,7]];
  for(const [dx,dy,dw] of drips){
    g.fillStyle='#FFF5E4';
    rr(g,dx,dy,dw,8,3); g.fill();
  }

  // chocolate chips
  g.fillStyle='#3B1F0A';
  [[8,20,5],[20,28,4],[34,18,5],[48,25,4],[56,15,5]].forEach(([cx,cy,r])=>{
    circ(g,cx,cy,r); g.fill();
  });

  // sprinkles
  const sprColors=['#FF6B9D','#FFD93D','#6BCB77','#4D96FF'];
  [[10,14],[22,10],[40,16],[54,12],[30,22],[46,10]].forEach(([sx,sy],i)=>{
    g.fillStyle=sprColors[i%sprColors.length];
    g.save(); g.translate(sx,sy); g.rotate(Math.PI/4);
    g.fillRect(-1,-3,2,6); g.restore();
  });

  // top edge highlight
  g.fillStyle='rgba(255,255,255,0.5)'; g.fillRect(0,0,64,2);

  return c;
}

/* ════════════════════════════════════════════
   PLATFORM — macaron / candy wafer, 64×20
   ════════════════════════════════════════════ */
function drawPlatform(){
  const c=mkc(64,20); const g=c.getContext('2d');

  // base
  const grad=g.createLinearGradient(0,0,0,20);
  grad.addColorStop(0,'#FFB7E0');
  grad.addColorStop(0.5,'#FF8CC8');
  grad.addColorStop(1,'#E06AB0');
  g.fillStyle=grad; rr(g,0,0,64,20,8); g.fill();

  // top highlight
  g.fillStyle='rgba(255,255,255,0.45)';
  rr(g,4,2,56,7,5); g.fill();

  // bottom shadow
  g.fillStyle='rgba(0,0,0,0.12)';
  rr(g,2,14,60,5,4); g.fill();

  // outline
  g.strokeStyle='#C04898'; g.lineWidth=1.5;
  rr(g,0,0,64,20,8); g.stroke();

  // little dots
  g.fillStyle='rgba(255,255,255,0.6)';
  [12,28,44].forEach(x=>{ circ(g,x,10,2); g.fill(); });

  return c;
}

/* ════════════════════════════════════════════
   BURGER — 40×34, juicy & detailed
   ════════════════════════════════════════════ */
function drawBurger(){
  const c=mkc(40,34); const g=c.getContext('2d');

  // top bun
  const bunTop=g.createRadialGradient(20,6,2,20,8,18);
  bunTop.addColorStop(0,'#FFCC80'); bunTop.addColorStop(1,'#E08020');
  g.fillStyle=bunTop;
  g.beginPath(); g.ellipse(20,12,18,12,0,0,Math.PI*2); g.fill();
  g.strokeStyle='#C05010'; g.lineWidth=1.2;
  g.beginPath(); g.ellipse(20,12,18,12,0,0,Math.PI*2); g.stroke();

  // sesame seeds
  g.fillStyle='#FFF5DC';
  [[13,6],[22,4],[29,8]].forEach(([sx,sy])=>{ g.beginPath(); g.ellipse(sx,sy,3,2,0.3,0,Math.PI*2); g.fill(); });

  // lettuce
  g.fillStyle='#48D460'; rr(g,2,18,36,5,2); g.fill();
  g.fillStyle='#2EBF46';
  [6,14,22,30].forEach(x=>{ g.beginPath(); g.arc(x,18,4,Math.PI,0); g.fill(); });

  // cheese
  g.fillStyle='#FFD700'; rr(g,3,22,34,4,1); g.fill();
  g.fillStyle='#FFB800';
  // cheese drip corners
  [5,35].forEach(x=>{ rr(g,x,22,4,6,2); g.fill(); });

  // patty
  const pattyG=g.createLinearGradient(0,24,0,30);
  pattyG.addColorStop(0,'#8B4513'); pattyG.addColorStop(1,'#5C2D0A');
  g.fillStyle=pattyG; rr(g,2,24,36,7,3); g.fill();
  g.strokeStyle='#3B1A05'; g.lineWidth=1; rr(g,2,24,36,7,3); g.stroke();

  // bottom bun
  const bunBot=g.createLinearGradient(0,29,0,34);
  bunBot.addColorStop(0,'#FFCC80'); bunBot.addColorStop(1,'#E08020');
  g.fillStyle=bunBot; rr(g,3,29,34,5,3); g.fill();

  // shine on top bun
  g.fillStyle='rgba(255,255,255,0.4)';
  g.beginPath(); g.ellipse(14,8,7,3,-.3,0,Math.PI*2); g.fill();

  return c;
}

/* ════════════════════════════════════════════
   DONUT — 36×36, glazed & sprinkled
   ════════════════════════════════════════════ */
function drawDonut(){
  const c=mkc(36,36); const g=c.getContext('2d');
  const cx=18, cy=18, ro=15, ri=6;

  // shadow
  g.fillStyle='rgba(0,0,0,0.15)';
  g.beginPath(); g.ellipse(cx,cy+3,ro,5,0,0,Math.PI*2); g.fill();

  // dough (ring)
  g.fillStyle='#E8A86A';
  circ(g,cx,cy,ro); g.fill();
  g.fillStyle='#F5D199';
  circ(g,cx,cy,ro);
  // cut hole
  g.globalCompositeOperation='destination-out';
  circ(g,cx,cy,ri); g.fill();
  g.globalCompositeOperation='source-over';

  // outline
  g.strokeStyle='#C07840'; g.lineWidth=1.5;
  circ(g,cx,cy,ro); g.stroke();

  // pink glaze on top
  g.fillStyle='#FF85B3';
  g.save();
  g.beginPath(); g.arc(cx,cy,ro,0,Math.PI*2);
  g.arc(cx,cy,ri,Math.PI*2,0,true);
  g.clip();
  const glazeG=g.createRadialGradient(cx-2,cy-4,2,cx,cy,ro);
  glazeG.addColorStop(0,'#FFB3D1');
  glazeG.addColorStop(0.6,'#FF6BAF');
  glazeG.addColorStop(1,'#E0508A');
  g.fillStyle=glazeG;
  rr(g,cx-ro,cy-ro,ro*2,ro*1.2,4); g.fill();
  g.restore();

  // re-cut hole
  g.globalCompositeOperation='destination-out';
  circ(g,cx,cy,ri); g.fill();
  g.globalCompositeOperation='source-over';

  // sprinkles
  const sprCol=['#FFD93D','#6BCB77','#4D96FF','#FF9F1C','#B48EFF'];
  const sAngles=[0.3,1.0,1.8,2.6,3.5,4.2,5.1];
  sAngles.forEach((a,i)=>{
    const sr=10;
    const sx=cx+Math.cos(a)*sr, sy=cy+Math.sin(a)*sr;
    g.fillStyle=sprCol[i%sprCol.length];
    g.save(); g.translate(sx,sy); g.rotate(a+0.5);
    g.fillRect(-1,-3,2,6); g.restore();
  });

  // glaze shine
  g.fillStyle='rgba(255,255,255,0.45)';
  g.save();
  g.beginPath(); g.arc(cx,cy,ro,0,Math.PI*2);
  g.arc(cx,cy,ri,Math.PI*2,0,true);
  g.clip();
  g.beginPath(); g.ellipse(cx-5,cy-7,6,3,-0.4,0,Math.PI*2); g.fill();
  g.restore();

  // re-cut hole
  g.globalCompositeOperation='destination-out';
  circ(g,cx,cy,ri); g.fill();
  g.globalCompositeOperation='source-over';

  return c;
}

/* ════════════════════════════════════════════
   STAR COIN — 28×28
   ════════════════════════════════════════════ */
function drawCoin(){
  const c=mkc(28,28); const g=c.getContext('2d');
  const cx=14,cy=14;

  // glow
  const gl=g.createRadialGradient(cx,cy,4,cx,cy,14);
  gl.addColorStop(0,'rgba(255,230,50,0.8)');
  gl.addColorStop(1,'rgba(255,180,0,0)');
  g.fillStyle=gl; circ(g,cx,cy,14); g.fill();

  // coin body
  const cg=g.createRadialGradient(cx-2,cy-2,2,cx,cy,11);
  cg.addColorStop(0,'#FFE94D');
  cg.addColorStop(0.7,'#FFB800');
  cg.addColorStop(1,'#E07800');
  g.fillStyle=cg; circ(g,cx,cy,11); g.fill();
  g.strokeStyle='#C06000'; g.lineWidth=1.5;
  circ(g,cx,cy,11); g.stroke();

  // star
  g.fillStyle='#FFD700';
  g.strokeStyle='#E07800'; g.lineWidth=0.8;
  g.beginPath();
  for(let i=0;i<5;i++){
    const a=i*Math.PI*2/5-Math.PI/2;
    const ia=a+Math.PI/5;
    i===0?g.moveTo(cx+Math.cos(a)*7,cy+Math.sin(a)*7):g.lineTo(cx+Math.cos(a)*7,cy+Math.sin(a)*7);
    g.lineTo(cx+Math.cos(ia)*3.5,cy+Math.sin(ia)*3.5);
  }
  g.closePath();
  g.fillStyle='#FFFDE0'; g.fill(); g.stroke();

  // shine
  g.fillStyle='rgba(255,255,255,0.55)';
  g.beginPath(); g.ellipse(cx-3,cy-4,4,2.5,-0.5,0,Math.PI*2); g.fill();

  return c;
}

/* ════════════════════════════════════════════
   LOLLIPOP — 28×52
   ════════════════════════════════════════════ */
function drawLollipop(){
  const c=mkc(28,52); const g=c.getContext('2d');

  // stick
  const sg=g.createLinearGradient(12,24,16,52);
  sg.addColorStop(0,'#E8E8E8'); sg.addColorStop(1,'#BDBDBD');
  g.fillStyle=sg; rr(g,12,26,4,26,2); g.fill();
  g.strokeStyle='#AAAAAA'; g.lineWidth=0.8;
  rr(g,12,26,4,26,2); g.stroke();

  // candy body
  const cx=14,cy=14,r=13;
  const cg=g.createRadialGradient(cx-3,cy-3,2,cx,cy,r);
  cg.addColorStop(0,'#FF9ED8'); cg.addColorStop(0.6,'#FF5BAF'); cg.addColorStop(1,'#CC2080');
  g.fillStyle=cg; circ(g,cx,cy,r); g.fill();
  g.strokeStyle='#AA1060'; g.lineWidth=1.5; circ(g,cx,cy,r); g.stroke();

  // swirl stripes
  g.strokeStyle='rgba(255,255,255,0.55)'; g.lineWidth=3;
  g.lineCap='round';
  for(let i=0;i<4;i++){
    const a=i*Math.PI/2;
    g.beginPath();
    g.arc(cx,cy,7,a,a+Math.PI/2);
    g.stroke();
  }

  // shine
  g.fillStyle='rgba(255,255,255,0.5)';
  g.beginPath(); g.ellipse(cx-4,cy-5,5,3,-0.4,0,Math.PI*2); g.fill();

  return c;
}

/* ════════════════════════════════════════════
   ICE CREAM — 30×46
   ════════════════════════════════════════════ */
function drawIceCream(){
  const c=mkc(30,46); const g=c.getContext('2d');
  const cx=15;

  // cone
  g.fillStyle='#E8A860';
  g.beginPath();
  g.moveTo(4,22); g.lineTo(26,22); g.lineTo(15,44); g.closePath();
  g.fill();
  g.strokeStyle='#B87030'; g.lineWidth=1.2;
  g.beginPath();
  g.moveTo(4,22); g.lineTo(26,22); g.lineTo(15,44); g.closePath(); g.stroke();
  // cone grid
  g.strokeStyle='rgba(0,0,0,0.1)'; g.lineWidth=0.8;
  g.beginPath(); g.moveTo(10,22); g.lineTo(14,40); g.stroke();
  g.beginPath(); g.moveTo(20,22); g.lineTo(16,40); g.stroke();
  g.beginPath(); g.moveTo(5,26); g.lineTo(25,26); g.stroke();
  g.beginPath(); g.moveTo(7,32); g.lineTo(23,32); g.stroke();

  // scoop 1 (bottom)
  const s1=g.createRadialGradient(cx-1,18,3,cx,18,12);
  s1.addColorStop(0,'#FFB3D1'); s1.addColorStop(1,'#FF7BAD');
  g.fillStyle=s1; circ(g,cx,18,12); g.fill();
  g.strokeStyle='#E0508A'; g.lineWidth=1.2; circ(g,cx,18,12); g.stroke();

  // scoop 2 (top)
  const s2=g.createRadialGradient(cx+1,7,2,cx,8,9);
  s2.addColorStop(0,'#B8FFD4'); s2.addColorStop(1,'#5BE8A0');
  g.fillStyle=s2; circ(g,cx,8,9); g.fill();
  g.strokeStyle='#30C070'; g.lineWidth=1.2; circ(g,cx,8,9); g.stroke();

  // cherry
  g.fillStyle='#FF2244'; circ(g,cx,0,4); g.fill();
  g.strokeStyle='#AA0022'; g.lineWidth=1; circ(g,cx,0,4); g.stroke();
  // stem
  g.strokeStyle='#228B22'; g.lineWidth=1.5;
  g.beginPath(); g.moveTo(cx,0); g.quadraticCurveTo(cx+4,-4,cx+2,-8); g.stroke();

  // shines
  g.fillStyle='rgba(255,255,255,0.45)';
  g.beginPath(); g.ellipse(cx-4,14,4,2.5,-0.3,0,Math.PI*2); g.fill();
  g.beginPath(); g.ellipse(cx-2,5,3,2,-0.3,0,Math.PI*2); g.fill();

  return c;
}

/* ════════════════════════════════════════════
   CUPCAKE — 36×38
   ════════════════════════════════════════════ */
function drawCupcake(){
  const c=mkc(36,38); const g=c.getContext('2d');
  const cx=18;

  // cup
  const cupG=g.createLinearGradient(0,20,0,38);
  cupG.addColorStop(0,'#FF9F1C'); cupG.addColorStop(1,'#E07010');
  g.fillStyle=cupG;
  g.beginPath();
  g.moveTo(6,20); g.lineTo(2,38); g.lineTo(34,38); g.lineTo(30,20); g.closePath();
  g.fill();
  g.strokeStyle='#C05A00'; g.lineWidth=1.2;
  g.beginPath();
  g.moveTo(6,20); g.lineTo(2,38); g.lineTo(34,38); g.lineTo(30,20); g.closePath(); g.stroke();
  // cup stripes
  g.strokeStyle='rgba(255,255,255,0.3)'; g.lineWidth=1.2;
  [10,18,26].forEach(x=>{
    g.beginPath(); g.moveTo(x,20); g.lineTo(x-2,38); g.stroke();
  });

  // frosting
  const frG=g.createRadialGradient(cx-2,14,3,cx,16,14);
  frG.addColorStop(0,'#FFE0F0'); frG.addColorStop(1,'#FF6BAF');
  g.fillStyle=frG;
  g.beginPath();
  g.moveTo(4,22);
  g.bezierCurveTo(0,14,4,6,cx,4);
  g.bezierCurveTo(32,6,36,14,32,22);
  g.closePath(); g.fill();
  g.strokeStyle='#D04080'; g.lineWidth=1.2; g.stroke();

  // frosting swirl
  g.strokeStyle='rgba(255,255,255,0.4)'; g.lineWidth=2; g.lineCap='round';
  g.beginPath(); g.arc(cx,14,5,Math.PI,0); g.stroke();
  g.beginPath(); g.arc(cx,11,3,Math.PI*1.2,Math.PI*0.2); g.stroke();

  // cherry on top
  g.fillStyle='#FF2244'; circ(g,cx,3,4); g.fill();
  g.strokeStyle='#AA0022'; g.lineWidth=1; circ(g,cx,3,4); g.stroke();
  g.fillStyle='rgba(255,255,255,0.5)';
  g.beginPath(); g.ellipse(cx-1,1.5,2,1.2,0,0,Math.PI*2); g.fill();

  // shine
  g.fillStyle='rgba(255,255,255,0.35)';
  g.beginPath(); g.ellipse(cx-5,14,4,2.5,-0.3,0,Math.PI*2); g.fill();

  return c;
}

/* ════════════════════════════════════════════
   ENEMY — Angry Hotdog (flying), 52×22
   ════════════════════════════════════════════ */
function drawHotdog(){
  const c=mkc(52,28); const g=c.getContext('2d');

  // wings
  g.fillStyle='rgba(255,220,100,0.7)';
  // left wing
  g.beginPath(); g.ellipse(8,12,12,7,-.4,0,Math.PI*2); g.fill();
  g.strokeStyle='rgba(200,160,0,0.8)'; g.lineWidth=1; g.stroke();
  // right wing
  g.beginPath(); g.ellipse(44,12,12,7,.4,0,Math.PI*2); g.fill(); g.stroke();

  // bun body
  const bunG=g.createRadialGradient(26,12,4,26,14,18);
  bunG.addColorStop(0,'#FFCC80'); bunG.addColorStop(1,'#D4813A');
  g.fillStyle=bunG;
  rr(g,4,6,44,16,8); g.fill();
  g.strokeStyle='#A05010'; g.lineWidth=1.5; rr(g,4,6,44,16,8); g.stroke();

  // sausage
  const sauG=g.createLinearGradient(0,10,0,20);
  sauG.addColorStop(0,'#E55050'); sauG.addColorStop(1,'#A02020');
  g.fillStyle=sauG; rr(g,6,10,40,10,5); g.fill();
  g.strokeStyle='#801010'; g.lineWidth=1; rr(g,6,10,40,10,5); g.stroke();

  // mustard zigzag
  g.strokeStyle='#FFD700'; g.lineWidth=2; g.lineCap='round';
  g.beginPath();
  g.moveTo(10,15); g.lineTo(16,12); g.lineTo(22,15); g.lineTo(28,12);
  g.lineTo(34,15); g.lineTo(40,12);
  g.stroke();

  // angry face
  // eyes (red angry)
  g.fillStyle='#FFEECC';
  circ(g,36,9,4); g.fill();
  circ(g,44,9,4); g.fill();
  g.fillStyle='#CC0000';
  circ(g,37,9,2.5); g.fill();
  circ(g,45,9,2.5); g.fill();
  // angry brows
  g.strokeStyle='#660000'; g.lineWidth=1.8;
  g.beginPath(); g.moveTo(33,6); g.lineTo(40,7.5); g.stroke();
  g.beginPath(); g.moveTo(42,7.5); g.lineTo(49,6); g.stroke();
  // grumpy mouth
  g.strokeStyle='#660000'; g.lineWidth=1.5;
  g.beginPath(); g.arc(41,13,3,0.3,Math.PI-.3); g.stroke();

  return c;
}

/* ════════════════════════════════════════════
   ENEMY — Sushi Roll (ground walker), 38×32
   ════════════════════════════════════════════ */
function drawSushiEnemy(){
  const c=mkc(38,32); const g=c.getContext('2d');
  const cx=19;

  // shadow
  g.fillStyle='rgba(0,0,0,0.15)';
  g.beginPath(); g.ellipse(cx,31,14,4,0,0,Math.PI*2); g.fill();

  // nori (outer ring)
  const noriG=g.createRadialGradient(cx-2,13,4,cx,14,14);
  noriG.addColorStop(0,'#4A5240'); noriG.addColorStop(1,'#252E20');
  g.fillStyle=noriG; circ(g,cx,14,14); g.fill();
  g.strokeStyle='#1A2018'; g.lineWidth=1.5; circ(g,cx,14,14); g.stroke();

  // rice (inner)
  g.fillStyle='#F8F5EC'; circ(g,cx,14,10); g.fill();

  // salmon topping face
  const salG=g.createRadialGradient(cx,10,3,cx,12,10);
  salG.addColorStop(0,'#FFA0A0'); salG.addColorStop(1,'#FF6060');
  g.fillStyle=salG;
  g.beginPath(); g.arc(cx,14,10,Math.PI,0); g.fill();
  g.strokeStyle='#DD4040'; g.lineWidth=1; g.stroke();

  // angry face on rice
  // eyes
  g.fillStyle='#FFFFFF'; circ(g,cx-4,14,4); g.fill(); circ(g,cx+4,14,4); g.fill();
  g.fillStyle='#1A1A1A'; circ(g,cx-4,14.5,2.5); g.fill(); circ(g,cx+4,14.5,2.5); g.fill();
  // angry brow
  g.strokeStyle='#880000'; g.lineWidth=1.8;
  g.beginPath(); g.moveTo(cx-7,11); g.lineTo(cx-1,12.5); g.stroke();
  g.beginPath(); g.moveTo(cx+1,12.5); g.lineTo(cx+7,11); g.stroke();
  // grumpy mouth
  g.strokeStyle='#660000'; g.lineWidth=1.5;
  g.beginPath(); g.arc(cx,19,3,0.2,Math.PI-0.2); g.stroke();

  // nori band decoration
  g.strokeStyle='rgba(255,255,255,0.15)'; g.lineWidth=1;
  circ(g,cx,14,11.5); g.stroke();

  // legs
  g.fillStyle='#1A2018';
  rr(g,cx-9,26,6,6,3); g.fill();
  rr(g,cx+3,26,6,6,3); g.fill();
  // feet
  g.fillStyle='#2A3828';
  rr(g,cx-11,30,10,4,3); g.fill();
  rr(g,cx+1,30,10,4,3); g.fill();

  return c;
}

/* ════════════════════════════════════════════
   SPIKES — 64×24, candy triangles
   ════════════════════════════════════════════ */
function drawSpikes(){
  const c=mkc(64,24); const g=c.getContext('2d');

  for(let i=0;i<4;i++){
    const x=i*16;
    // base
    const spG=g.createLinearGradient(x,24,x+8,0);
    spG.addColorStop(0,'#9B4DCA'); spG.addColorStop(1,'#D580FF');
    g.fillStyle=spG;
    g.beginPath(); g.moveTo(x,24); g.lineTo(x+8,0); g.lineTo(x+16,24); g.closePath(); g.fill();
    g.strokeStyle='#6B22A0'; g.lineWidth=1.2;
    g.beginPath(); g.moveTo(x,24); g.lineTo(x+8,0); g.lineTo(x+16,24); g.closePath(); g.stroke();
    // highlight
    g.fillStyle='rgba(255,255,255,0.3)';
    g.beginPath(); g.moveTo(x+8,0); g.lineTo(x+5,12); g.lineTo(x+8,4); g.closePath(); g.fill();
  }
  return c;
}

/* ════════════════════════════════════════════
   CAKE (GOAL) — 60×72
   ════════════════════════════════════════════ */
function drawCake(){
  const c=mkc(60,80); const g=c.getContext('2d');
  const cx=30;

  // plate
  const plateG=g.createLinearGradient(0,72,0,80);
  plateG.addColorStop(0,'#E8E8E8'); plateG.addColorStop(1,'#C8C8C8');
  g.fillStyle=plateG; rr(g,2,72,56,8,4); g.fill();
  g.strokeStyle='#AAAAAA'; g.lineWidth=1; rr(g,2,72,56,8,4); g.stroke();

  // layer 3 (bottom, pink)
  const l3G=g.createLinearGradient(0,48,0,72);
  l3G.addColorStop(0,'#FF8FB0'); l3G.addColorStop(1,'#E06090');
  g.fillStyle=l3G; rr(g,4,48,52,24,4); g.fill();
  g.strokeStyle='#C04070'; g.lineWidth=1.2; rr(g,4,48,52,24,4); g.stroke();

  // layer 3 middle stripe (cream)
  g.fillStyle='#FFF5E4'; rr(g,4,57,52,6,2); g.fill();

  // layer 2 (yellow)
  const l2G=g.createLinearGradient(0,26,0,50);
  l2G.addColorStop(0,'#FFE566'); l2G.addColorStop(1,'#FFBB00');
  g.fillStyle=l2G; rr(g,8,26,44,24,4); g.fill();
  g.strokeStyle='#CC8800'; g.lineWidth=1.2; rr(g,8,26,44,24,4); g.stroke();

  // layer 2 middle stripe
  g.fillStyle='#FFF5E4'; rr(g,8,35,44,6,2); g.fill();

  // layer 1 (top, mint)
  const l1G=g.createLinearGradient(0,8,0,28);
  l1G.addColorStop(0,'#A8F0C0'); l1G.addColorStop(1,'#50CC80');
  g.fillStyle=l1G; rr(g,14,8,32,22,4); g.fill();
  g.strokeStyle='#30A060'; g.lineWidth=1.2; rr(g,14,8,32,22,4); g.stroke();

  // frosting drips
  const drips=[
    [6,48,8,10],[14,48,6,8],[24,48,8,12],[34,48,6,8],[44,48,8,10],[52,48,6,7],
    [10,26,7,9],[18,26,5,7],[28,26,7,10],[36,26,5,7],[44,26,7,8],
  ];
  g.fillStyle='rgba(255,245,228,0.9)';
  drips.forEach(([dx,dy,dw,dh])=>{ rr(g,dx,dy,dw,dh,3); g.fill(); });

  // candles
  const candleData=[[cx-10,4,8,'#FF6BAF','#FF2288'],[cx,0,8,'#6BDAFF','#1188CC'],[cx+10,6,8,'#FFD700','#FF8C00']];
  candleData.forEach(([canX,canY,canH,c1,c2])=>{
    const cg=g.createLinearGradient(canX-3,canY,canX+3,canY+canH);
    cg.addColorStop(0,c1); cg.addColorStop(1,c2);
    g.fillStyle=cg; rr(g,canX-3,canY,6,canH,2); g.fill();
    g.strokeStyle=c2; g.lineWidth=0.8; rr(g,canX-3,canY,6,canH,2); g.stroke();
    // flame
    const flamG=g.createRadialGradient(canX,canY-2,0,canX,canY-1,5);
    flamG.addColorStop(0,'#FFFDE0'); flamG.addColorStop(0.5,'#FFB800'); flamG.addColorStop(1,'rgba(255,100,0,0)');
    g.fillStyle=flamG;
    g.beginPath(); g.ellipse(canX,canY-2,4,6,0,0,Math.PI*2); g.fill();
    // inner flame white
    g.fillStyle='rgba(255,255,220,0.8)';
    g.beginPath(); g.ellipse(canX,canY,1.5,3,0,0,Math.PI*2); g.fill();
  });

  // stars decoration on layers
  [
    [cx-16,58],[cx+4,56],[cx-4,60],
    [cx-10,38],[cx+10,36],[cx,40],
  ].forEach(([sx,sy])=>{
    g.fillStyle='rgba(255,255,255,0.55)';
    for(let i=0;i<5;i++){
      const a=i*Math.PI*2/5-Math.PI/2;
      const ia=a+Math.PI/5;
      i===0?g.moveTo(sx+Math.cos(a)*4,sy+Math.sin(a)*4):g.lineTo(sx+Math.cos(a)*4,sy+Math.sin(a)*4);
      g.lineTo(sx+Math.cos(ia)*2,sy+Math.sin(ia)*2);
    }
    g.closePath(); g.fill();
  });

  // layer highlights
  g.fillStyle='rgba(255,255,255,0.2)';
  rr(g,6,48,52,6,4); g.fill();
  rr(g,10,26,44,5,4); g.fill();
  rr(g,16,8,32,5,4); g.fill();

  return c;
}

/* ════════════════════════════════════════════
   BACKGROUND TILES (3 gradient variants)
   64×64 each
   ════════════════════════════════════════════ */
function drawBg(variant){
  const c=mkc(64,64); const g=c.getContext('2d');
  const palettes=[
    ['#FFD6E8','#FFC2DC'],
    ['#FFE8C2','#FFD8A8'],
    ['#D6EEFF','#C2E4FF'],
  ];
  const [c1,c2]=palettes[variant%3];
  const grad=g.createLinearGradient(0,0,64,64);
  grad.addColorStop(0,c1); grad.addColorStop(1,c2);
  g.fillStyle=grad; g.fillRect(0,0,64,64);

  // subtle dot pattern
  g.fillStyle='rgba(255,255,255,0.3)';
  for(let x=8;x<64;x+=16) for(let y=8;y<64;y+=16){ circ(g,x,y,1.5); g.fill(); }
  return c;
}

/* ════════════════════════════════════════════
   CLOUD (parallax deco) — 80×36
   ════════════════════════════════════════════ */
function drawCloud(){
  const c=mkc(80,36); const g=c.getContext('2d');
  g.fillStyle='rgba(255,255,255,0.85)';
  [[20,22,20],[38,16,26],[58,22,18],[38,28,30]].forEach(([cx,cy,r])=>{
    circ(g,cx,cy,r); g.fill();
  });
  g.fillStyle='rgba(255,255,255,0.4)';
  [[22,16,8],[42,12,10],[56,18,7]].forEach(([cx,cy,r])=>{
    circ(g,cx,cy,r); g.fill();
  });
  return c;
}

/* ════════════════════════════════════════════
   PARTICLES
   ════════════════════════════════════════════ */
function drawParticleStar(){
  const c=mkc(12,12); const g=c.getContext('2d');
  const cx=6,cy=6;
  g.fillStyle='#FFD93D';
  for(let i=0;i<5;i++){
    const a=i*Math.PI*2/5-Math.PI/2;
    const ia=a+Math.PI/5;
    i===0?g.moveTo(cx+Math.cos(a)*5,cy+Math.sin(a)*5):g.lineTo(cx+Math.cos(a)*5,cy+Math.sin(a)*5);
    g.lineTo(cx+Math.cos(ia)*2.5,cy+Math.sin(ia)*2.5);
  }
  g.closePath(); g.fill();
  g.strokeStyle='#E09000'; g.lineWidth=0.8; g.stroke();
  return c;
}

function drawParticleHeart(){
  const c=mkc(12,12); const g=c.getContext('2d');
  g.fillStyle='#FF6B9D';
  g.beginPath();
  g.moveTo(6,10);
  g.bezierCurveTo(2,8,0,5,0,3);
  g.bezierCurveTo(0,1,2,0,3,0);
  g.bezierCurveTo(4,0,5,1,6,2);
  g.bezierCurveTo(7,1,8,0,9,0);
  g.bezierCurveTo(10,0,12,1,12,3);
  g.bezierCurveTo(12,5,10,8,6,10);
  g.closePath(); g.fill();
  return c;
}

function drawParticleSparkle(){
  const c=mkc(10,10); const g=c.getContext('2d');
  g.strokeStyle='#FFFFFF'; g.lineWidth=1.5; g.lineCap='round';
  [[5,0,5,10],[0,5,10,5],[1,1,9,9],[9,1,1,9]].forEach(([x1,y1,x2,y2])=>{
    g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2,y2); g.stroke();
  });
  return c;
}

/* ════════════════════════════════════════════
   SCORE POPUP (+100 etc.)
   Drawn on the fly in GameScene, no texture needed
   ════════════════════════════════════════════ */

/* ════════════════════════════════════════════
   CHECKPOINT FLAG — 20×48
   ════════════════════════════════════════════ */
function drawFlag(){
  const c=mkc(20,48); const g=c.getContext('2d');
  // pole
  g.fillStyle='#AAAAAA'; rr(g,9,2,2,46,1); g.fill();
  // flag
  g.fillStyle='#6BCB77';
  g.beginPath(); g.moveTo(11,2); g.lineTo(20,8); g.lineTo(11,14); g.closePath(); g.fill();
  g.strokeStyle='#30A040'; g.lineWidth=1; g.stroke();
  return c;
}

/* ════════════════════════════════════════════
   LEVEL 2 FALLING HAZARD — Curvy Hot Chili Pepper
   ════════════════════════════════════════════ */
function drawChili(){
  const W=24, H=32;
  const c=mkc(W,H); const g=c.getContext('2d');
  const cx=W/2;
  
  // draw a curved red chili pepper
  g.fillStyle='#FF3300';
  g.beginPath();
  g.moveTo(cx-6, 10);
  g.quadraticCurveTo(cx, 8, cx+6, 10);
  g.quadraticCurveTo(cx+8, 20, cx, 28);
  g.quadraticCurveTo(cx-4, 20, cx-6, 10);
  g.closePath();
  g.fill();
  
  // green stem
  g.strokeStyle='#228B22'; g.lineWidth=2.5;
  g.beginPath();
  g.moveTo(cx, 10);
  g.quadraticCurveTo(cx-2, 4, cx-6, 3);
  g.stroke();
  
  // shine
  g.fillStyle='rgba(255,255,255,0.4)';
  g.beginPath();
  g.ellipse(cx-2, 14, 2, 5, 0.2, 0, Math.PI*2);
  g.fill();
  return c;
}

/* ════════════════════════════════════════════
   LEVEL 3 PROJECTILE — Neon Sugar Bullet
   ════════════════════════════════════════════ */
function drawSugarBullet(){
  const W=16, H=16;
  const c=mkc(W,H); const g=c.getContext('2d');
  const cx=W/2, cy=H/2;
  
  // glow
  const gl=g.createRadialGradient(cx,cy,2,cx,cy,8);
  gl.addColorStop(0,'rgba(0,255,255,1)');
  gl.addColorStop(1,'rgba(0,255,255,0)');
  g.fillStyle=gl; circ(g,cx,cy,8); g.fill();
  
  // core
  g.fillStyle='#FFFFFF'; circ(g,cx,cy,3); g.fill();
  return c;
}