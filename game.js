/* ══════════════════════════════════════════════
   FOOD DASH DELUXE — game.js
   Phaser 3.60 | HD sprites | Parallax | Particles
   ══════════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────────────
   CONSTANTS
   ───────────────────────────────────────────── */
const GW = 960, GH = 540;   // game resolution
const WORLD_W = 6400;        // total level width

const GRAVITY     = 900;
const PLAYER_SPD  = 260;
const JUMP_VEL    = -600;
const DJUMP_VEL   = -520;

const COLLECTIBLE_POINTS = { burger:100, donut:150, lollipop:200, icecream:250, cupcake:300, coin:50 };

/* ─────────────────────────────────────────────
   TINY AUDIO ENGINE (Web Audio API, no files)
   ───────────────────────────────────────────── */
const SFX = (() => {
  let ctx = null;
  const ensure = () => { if(!ctx) ctx = new (window.AudioContext||window.webkitAudioContext)(); return ctx; };
  function play(freq, type='square', dur=0.08, vol=0.18, bend=0){
    try{
      const ac=ensure();
      const osc=ac.createOscillator();
      const gain=ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type=type; osc.frequency.setValueAtTime(freq,ac.currentTime);
      if(bend) osc.frequency.exponentialRampToValueAtTime(freq*bend, ac.currentTime+dur);
      gain.gain.setValueAtTime(vol,ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+dur);
      osc.start(); osc.stop(ac.currentTime+dur);
    }catch(e){}
  }
  return {
    coin:    ()=>{ play(880,'sine',0.06,0.2,1.5); setTimeout(()=>play(1320,'sine',0.06,0.2),60); },
    jump:    ()=>{ play(300,'square',0.12,0.15,1.8); },
    djump:   ()=>{ play(500,'sine',0.1,0.15,1.6); play(700,'sine',0.1,0.1,1.4); },
    stomp:   ()=>{ play(200,'square',0.15,0.25,0.3); play(150,'sawtooth',0.1,0.2,0.2); },
    hurt:    ()=>{ play(200,'sawtooth',0.2,0.3,0.4); },
    win:     ()=>{ [523,659,784,1047].forEach((f,i)=>setTimeout(()=>play(f,'sine',0.3,0.25),i*120)); },
    gameover:()=>{ [400,300,200,150].forEach((f,i)=>setTimeout(()=>play(f,'square',0.25,0.2),i*150)); },
  };
})();

/* ═══════════════════════════════════════════════
   BOOT SCENE
   ═══════════════════════════════════════════════ */
class BootScene extends Phaser.Scene {
  constructor(){ super({key:'BootScene'}); }

  preload(){
    // register all HD canvas textures
    const map = [
      ['player_idle',     drawPlayerHD('idle',1)],
      ['player_walk',     drawPlayerHD('walk',1)],
      ['player_walk2',    drawPlayerHD('walk',-1)],
      ['player_jump',     drawPlayerJump()],
      ['ground',          drawGround()],
      ['platform',        drawPlatform()],
      ['burger',          drawBurger()],
      ['donut',           drawDonut()],
      ['lollipop',        drawLollipop()],
      ['icecream',        drawIceCream()],
      ['cupcake',         drawCupcake()],
      ['coin',            drawCoin()],
      ['hotdog_enemy',    drawHotdog()],
      ['sushi_enemy',     drawSushiEnemy()],
      ['cake',            drawCake()],
      ['bg0',             drawBg(0)],
      ['bg1',             drawBg(1)],
      ['bg2',             drawBg(2)],
      ['cloud',           drawCloud()],
      ['spikes',          drawSpikes()],
      ['p_star',          drawParticleStar()],
      ['p_heart',         drawParticleHeart()],
      ['p_sparkle',       drawParticleSparkle()],
      ['flag',            drawFlag()],
    ];
    for(const [key, canvas] of map){
      this.textures.addCanvas(key, canvas);
    }
  }

  create(){ this.scene.start('MenuScene'); }
}

/* ═══════════════════════════════════════════════
   MENU SCENE
   ═══════════════════════════════════════════════ */
class MenuScene extends Phaser.Scene {
  constructor(){ super({key:'MenuScene'}); }

  create(){
    const W=GW, H=GH;
    this._buildBg();

    // ── Animated food items orbiting ──
    const foods=['burger','donut','lollipop','icecream','cupcake','coin'];
    for(let i=0;i<10;i++){
      const img=this.add.image(
        Phaser.Math.Between(60,W-60),
        Phaser.Math.Between(60,H-60),
        foods[i%foods.length]
      ).setAlpha(0.25+Math.random()*0.2).setScale(1.4+Math.random()*0.8);
      this.tweens.add({
        targets:img, y:img.y-Phaser.Math.Between(20,50),
        duration:Phaser.Math.Between(1800,3500), yoyo:true, repeat:-1,
        ease:'Sine.easeInOut', delay:Phaser.Math.Between(0,2000)
      });
      this.tweens.add({
        targets:img, angle:Phaser.Math.Between(-15,15),
        duration:Phaser.Math.Between(2000,4000), yoyo:true, repeat:-1,
        ease:'Sine.easeInOut', delay:Phaser.Math.Between(0,1000)
      });
    }

    // ── Main panel (frosted glass effect) ──
    const panel=this.add.graphics();
    panel.fillStyle(0xFFFFFF,0.12);
    panel.fillRoundedRect(W/2-220,70,440,400,24);
    panel.lineStyle(2,0xFFFFFF,0.3);
    panel.strokeRoundedRect(W/2-220,70,440,400,24);

    // inner glow ring
    const glow=this.add.graphics();
    glow.lineStyle(6,0xFF6B9D,0.15);
    glow.strokeRoundedRect(W/2-224,66,448,408,26);

    // ── Title ──
    this.add.text(W/2,130,'🍔 FOOD DASH',{
      fontFamily:'Fredoka One, cursive', fontSize:'52px',
      fill:'#FFD93D',
      stroke:'#FF6B9D', strokeThickness:4,
      shadow:{blur:20,color:'#FF9F1C',fill:true}
    }).setOrigin(0.5);

    this.add.text(W/2,180,'D E L U X E',{
      fontFamily:'Fredoka One, cursive', fontSize:'20px',
      fill:'#6BCB77', letterSpacing:10
    }).setOrigin(0.5);

    // ── Hi-score ──
    const hi = localStorage.getItem('fooddash_hi')||0;
    this.add.text(W/2,220,`⭐ BEST: ${hi} pts`,{
      fontFamily:'Nunito, sans-serif', fontSize:'16px',
      fontStyle:'bold', fill:'#FFD93D'
    }).setOrigin(0.5);

    // ── Instructions ──
    const lines=[
      ['🎮','Arrow / WASD  Move'],
      ['🚀','Z / Space  Jump (double jump!)'],
      ['💥','Land on enemies to stomp them'],
      ['🌟','Collect food for points'],
      ['🎂','Reach the BIRTHDAY CAKE to win!'],
    ];
    lines.forEach(([icon,text],i)=>{
      this.add.text(W/2-160,265+i*28,`${icon}  ${text}`,{
        fontFamily:'Nunito, sans-serif', fontSize:'15px',
        fontStyle:'bold', fill:'rgba(255,255,255,0.85)'
      });
    });

    // ── Start button ──
    const btnY=430;
    const btnG=this.add.graphics();
    btnG.fillGradientStyle(0xFF6B9D,0xFF6B9D,0xFF9F1C,0xFF9F1C,1);
    btnG.fillRoundedRect(W/2-110,btnY,220,54,14);
    btnG.lineStyle(2,0xFFFFFF,0.5);
    btnG.strokeRoundedRect(W/2-110,btnY,220,54,14);

    const btnTxt=this.add.text(W/2,btnY+27,'▶  PLAY NOW',{
      fontFamily:'Fredoka One, cursive', fontSize:'26px', fill:'#FFFFFF',
      shadow:{blur:8,color:'#AA2200',fill:true}
    }).setOrigin(0.5);

    btnG.setInteractive(new Phaser.Geom.Rectangle(W/2-110,btnY,220,54),Phaser.Geom.Rectangle.Contains);
    btnG.on('pointerover',()=>{ btnG.clear(); btnG.fillGradientStyle(0xFF9F1C,0xFF9F1C,0xFF6B9D,0xFF6B9D,1); btnG.fillRoundedRect(W/2-110,btnY,220,54,14); btnTxt.setScale(1.06); });
    btnG.on('pointerout', ()=>{ btnG.clear(); btnG.fillGradientStyle(0xFF6B9D,0xFF6B9D,0xFF9F1C,0xFF9F1C,1); btnG.fillRoundedRect(W/2-110,btnY,220,54,14); btnTxt.setScale(1); });
    btnG.on('pointerdown',()=>{ SFX.jump(); this.scene.start('GameScene'); });

    this.input.keyboard.once('keydown',()=>{ SFX.jump(); this.scene.start('GameScene'); });

    // pulse the btn
    this.tweens.add({targets:btnTxt, scaleX:1.04, scaleY:1.04, duration:900, yoyo:true, repeat:-1, ease:'Sine.easeInOut'});

    // ── Big cake on the right ──
    const cake=this.add.image(W/2+280,260,'cake').setScale(2.8);
    this.tweens.add({targets:cake, y:245, duration:1200, yoyo:true, repeat:-1, ease:'Sine.easeInOut'});
    this.tweens.add({targets:cake, angle:[-3,3], duration:1600, yoyo:true, repeat:-1, ease:'Sine.easeInOut'});
  }

  _buildBg(){
    // gradient sky
    const sky=this.add.graphics();
    sky.fillGradientStyle(0x2D0A5A,0x2D0A5A,0x1A0530,0x1A0530,1);
    sky.fillRect(0,0,GW,GH);
    // cloud layer
    for(let x=0;x<GW+80;x+=200){
      this.add.image(x,60+Math.random()*80,'cloud').setAlpha(0.15).setScale(1.5+Math.random());
    }
  }
}

/* ═══════════════════════════════════════════════
   GAME SCENE
   ═══════════════════════════════════════════════ */
class GameScene extends Phaser.Scene {
  constructor(){ super({key:'GameScene'}); }

  create(){
    // ── State ──
    this.score       = 0;
    this.lives       = 3;
    this.coins       = 0;
    this.jumpsLeft   = 2;
    this.isAlive     = true;
    this.levelDone   = false;
    this.invincible  = false;
    this.walkFrame   = 0;
    this.walkTimer   = 0;
    this.combo       = 0;
    this.comboTimer  = 0;

    this.cameras.main.setBounds(0,0,WORLD_W,GH);

    this._buildWorld();
    this._buildPlayer();
    this._buildEnemies();
    this._buildCollectibles();
    this._buildHUD();
    this._buildControls();

    this.cameras.main.startFollow(this.player,true,0.08,0.08);
    this.cameras.main.setDeadzone(240,120);
    this.cameras.main.setLerp(0.1,0.1);

    // particle emitter pools
    this.pStars   = this.add.group();
    this.pHearts  = this.add.group();
  }

  /* ══ WORLD BUILD ══ */
  _buildWorld(){
    const H=GH;

    // ── Sky gradient (multiple rects to fake gradient) ──
    for(let y=0;y<GH;y+=4){
      const t=y/GH;
      const r=Math.round(45-t*25), gg=Math.round(10+t*5), b=Math.round(90-t*50);
      this.add.rectangle(WORLD_W/2,y+2,WORLD_W,4,Phaser.Display.Color.GetColor(r,gg,b)).setScrollFactor(0.05);
    }

    // ── Parallax clouds ──
    for(let i=0;i<30;i++){
      const x=Phaser.Math.Between(0,WORLD_W);
      const y=Phaser.Math.Between(40,GH*0.55);
      const scale=0.8+Math.random()*1.4;
      const alpha=0.18+Math.random()*0.22;
      const sf=0.1+Math.random()*0.3;
      this.add.image(x,y,'cloud').setScale(scale).setAlpha(alpha).setScrollFactor(sf);
    }

    // ── Background tile pattern ──
    for(let x=0;x<WORLD_W;x+=64){
      const y0=Math.floor((GH-64)/64)*64;
      for(let y=0;y<=y0;y+=64){
        const key=(Math.floor(x/64)+Math.floor(y/64))%3;
        this.add.image(x+32,y+32,'bg'+key).setScrollFactor(0.6);
      }
    }

    // ── Static groups ──
    this.platforms  = this.physics.add.staticGroup();
    this.spikeGroup = this.physics.add.staticGroup();

    // ── Ground (with gaps) ──
    const GAPS=[
      [700,820],[1500,1640],[2300,2440],[3100,3260],[3900,4020],[4700,4820],[5400,5500]
    ];
    const inGap=(x)=> GAPS.some(([a,b])=>x>a && x<b);
    for(let x=0;x<WORLD_W;x+=64){
      if(!inGap(x)){
        this.platforms.create(x+32,H-20,'ground').setOrigin(0.5).setScale(1,1).refreshBody();
      }
    }

    // ── Platforms ──
    const PLATS=[
      // [x, y, tiles]
      [80,H-120,3],[260,H-170,2],[450,H-130,4],[700,H-100,3],
      [900,H-150,3],[1100,H-200,2],[1200,H-100,4],[1450,H-180,3],
      [1680,H-120,4],[1900,H-200,2],[2050,H-140,3],[2200,H-110,3],
      [2500,H-170,2],[2700,H-120,4],[2900,H-200,3],[3000,H-90,2],
      [3300,H-150,3],[3500,H-200,2],[3650,H-130,4],[3850,H-170,3],
      [4060,H-120,3],[4200,H-200,2],[4380,H-150,4],[4550,H-100,3],
      [4860,H-170,4],[5060,H-120,3],[5250,H-200,2],[5400,H-130,3],
      [5560,H-150,4],[5800,H-100,3],[6000,H-180,4],[6180,H-120,2],
    ];
    for(const [px,py,tw] of PLATS){
      for(let i=0;i<tw;i++){
        this.platforms.create(px+i*64+32,py,'platform').setOrigin(0.5).refreshBody();
      }
    }

    // ── Spikes ──
    const SPIKE_X=[600,640,1400,1440,2200,2240,3000,3040,3800,3840,4600,4640,5300,5340];
    for(const sx of SPIKE_X){
      this.spikeGroup.create(sx+32,H-38,'spikes').setOrigin(0.5).refreshBody();
    }

    // ── Goal cake ──
    this.cakeObj=this.physics.add.staticSprite(WORLD_W-120,H-100,'cake');
    this.cakeObj.setOrigin(0.5,1).refreshBody();
    this.tweens.add({
      targets:this.cakeObj, y:this.cakeObj.y-14, duration:1000,
      yoyo:true, repeat:-1, ease:'Sine.easeInOut'
    });
    this.tweens.add({
      targets:this.cakeObj, angle:[-4,4], duration:1400,
      yoyo:true, repeat:-1, ease:'Sine.easeInOut'
    });

    // goal glow
    this.cakeGlow=this.add.graphics();
    this._drawCakeGlow(0.8);
    this.tweens.add({
      targets:{v:0.8}, v:1.4, duration:900, yoyo:true, repeat:-1,
      onUpdate:(tw,obj)=>this._drawCakeGlow(obj.v)
    });
  }

  _drawCakeGlow(radius){
    this.cakeGlow.clear();
    this.cakeGlow.fillStyle(0xFFD93D,0.08*radius);
    this.cakeGlow.fillCircle(WORLD_W-120, GH-100, 80*radius);
    this.cakeGlow.fillStyle(0xFF9F1C,0.05*radius);
    this.cakeGlow.fillCircle(WORLD_W-120, GH-100, 120*radius);
  }

  /* ══ PLAYER ══ */
  _buildPlayer(){
    this.player=this.physics.add.sprite(100,GH-120,'player_idle');
    this.player.setCollideWorldBounds(false);
    this.player.setGravityY(GRAVITY-600);
    this.player.setDragX(1200);
    this.player.setDepth(20);
    this.player.setScale(1.1);

    // land → restore double jump
    this.physics.add.collider(this.player,this.platforms,()=>{
      if(this.jumpsLeft<2) this.jumpsLeft=2;
    });

    // spikes
    this.physics.add.overlap(this.player,this.spikeGroup,()=>{
      if(!this.invincible) this._hurtPlayer();
    });

    // cake
    this.physics.add.overlap(this.player,this.cakeObj,()=>{
      if(!this.levelDone) this._winLevel();
    });

    // trail emitter (fancy dust)
    this.trailTimer=0;
  }

  /* ══ ENEMIES ══ */
  _buildEnemies(){
    const H=GH;
    this.enemies=this.physics.add.group();

    // Sushi walkers
    const SUSHI_X=[300,560,800,1050,1300,1580,1900,2100,2400,2700,3000,
                   3300,3600,3900,4200,4500,4800,5100,5400,5700,6000];
    for(const ex of SUSHI_X){
      const e=this.enemies.create(ex,H-60,'sushi_enemy');
      e.setVelocityX(Math.random()>0.5?70:-70);
      e.setCollideWorldBounds(true).setBounceX(1);
      e.enemyType='ground';
      e.setDepth(10).setScale(1.05);
      e.hp=1;
    }

    // Flying hotdogs
    const HOTDOG_DATA=[
      [500,H-220],[850,H-280],[1200,H-240],[1700,H-260],[2100,H-220],
      [2600,H-300],[3000,H-240],[3400,H-200],[3800,H-280],[4200,H-240],
      [4700,H-220],[5200,H-280],[5700,H-240],[6100,H-200],
    ];
    for(const [fx,fy] of HOTDOG_DATA){
      const e=this.enemies.create(fx,fy,'hotdog_enemy');
      e.setVelocityX(Math.random()>0.5?90:-90);
      e.setGravityY(-GRAVITY+100);
      e.setCollideWorldBounds(true).setBounceX(1);
      e.enemyType='fly';
      e.baseY=fy; e.waveOffset=Math.random()*Math.PI*2;
      e.setDepth(10).setScale(1.05);
      e.hp=1;
    }

    this.physics.add.collider(this.enemies,this.platforms);

    // player ↔ enemy
    this.physics.add.overlap(this.player,this.enemies,(player,enemy)=>{
      if(this.invincible) return;
      const stomping=player.body.velocity.y>80 && player.y<enemy.y-8;
      if(stomping){ this._stompEnemy(enemy); }
      else { this._hurtPlayer(); }
    });
  }

  /* ══ COLLECTIBLES ══ */
  _buildCollectibles(){
    const H=GH;
    this.collectibles=this.physics.add.staticGroup();

    const types=['burger','donut','lollipop','icecream','cupcake'];
    // coins densely placed
    const COIN_PATTERNS=[
      // arcs over gaps
      ...[710,720,730,740,750,760,770,780,790].map((x,i)=>[x, H-80-Math.sin(i/8*Math.PI)*80, 'coin']),
      ...[1510,1520,1530,1540,1550,1560,1570,1580].map((x,i)=>[x, H-80-Math.sin(i/7*Math.PI)*80, 'coin']),
      ...[2310,2320,2330,2340,2350,2360,2370].map((x,i)=>[x, H-80-Math.sin(i/6*Math.PI)*80, 'coin']),
    ];

    // regular food items spread across level
    const FOOD_POS=[
      [120,H-140],[280,H-120],[480,H-150],[750,H-130],[960,H-170],[1130,H-220],
      [1250,H-120],[1500,H-200],[1720,H-140],[1960,H-220],[2100,H-160],[2280,H-130],
      [2550,H-190],[2750,H-140],[2980,H-220],[3060,H-110],[3350,H-170],[3560,H-220],
      [3700,H-150],[3900,H-190],[4100,H-140],[4250,H-220],[4430,H-170],[4600,H-120],
      [4900,H-190],[5100,H-140],[5300,H-220],[5450,H-150],[5620,H-170],[5860,H-120],
      [6050,H-200],[6220,H-140],
    ];

    // place food
    FOOD_POS.forEach(([cx,cy],i)=>{
      const type=types[i%types.length];
      const item=this.collectibles.create(cx,cy,type);
      item.itemType=type; item.pointVal=COLLECTIBLE_POINTS[type];
      item.setDepth(8).setScale(1.1);
      this.tweens.add({
        targets:item, y:cy-10, duration:800+i*30,
        yoyo:true, repeat:-1, ease:'Sine.easeInOut'
      });
      this.tweens.add({
        targets:item, angle:[-6,6], duration:1200+i*20,
        yoyo:true, repeat:-1, ease:'Sine.easeInOut'
      });
    });

    // place coins
    COIN_PATTERNS.forEach(([cx,cy,type])=>{
      const item=this.collectibles.create(cx,cy,type);
      item.itemType='coin'; item.pointVal=COLLECTIBLE_POINTS.coin;
      item.setDepth(8).setScale(0.9);
      this.tweens.add({
        targets:item, y:cy-6, duration:600,
        yoyo:true, repeat:-1, ease:'Sine.easeInOut',
        delay:Math.random()*400
      });
      this.tweens.add({
        targets:item, angle:360, duration:2000,
        repeat:-1, ease:'Linear'
      });
    });

    this.physics.add.overlap(this.player,this.collectibles,(_p,item)=>this._collectItem(item));
  }

  /* ══ HUD ══ */
  _buildHUD(){
    // background pill
    const hud=this.add.graphics().setScrollFactor(0).setDepth(200);
    hud.fillStyle(0x000000,0.45);
    hud.fillRoundedRect(10,10,300,50,12);
    hud.lineStyle(1.5,0xFFFFFF,0.2);
    hud.strokeRoundedRect(10,10,300,50,12);

    this.scoreTxt=this.add.text(24,18,'SCORE  0',{
      fontFamily:'Fredoka One, cursive', fontSize:'20px', fill:'#FFD93D',
      shadow:{blur:6,color:'#FF9F1C',fill:true}
    }).setScrollFactor(0).setDepth(201);

    this.livesTxt=this.add.text(24,37,'❤️ ❤️ ❤️',{
      fontFamily:'Nunito, sans-serif', fontSize:'16px', fontStyle:'bold', fill:'#FF6B9D'
    }).setScrollFactor(0).setDepth(201);

    // coin display
    const coinHud=this.add.graphics().setScrollFactor(0).setDepth(200);
    coinHud.fillStyle(0x000000,0.45);
    coinHud.fillRoundedRect(GW-160,10,150,36,10);
    this.add.image(GW-148,28,'coin').setScrollFactor(0).setDepth(201).setScale(0.9);
    this.coinTxt=this.add.text(GW-130,18,'× 0',{
      fontFamily:'Fredoka One, cursive', fontSize:'18px', fill:'#FFD93D'
    }).setScrollFactor(0).setDepth(201);

    // combo display (hidden initially)
    this.comboTxt=this.add.text(GW/2,80,'',{
      fontFamily:'Fredoka One, cursive', fontSize:'32px', fill:'#FF9F1C',
      stroke:'#FFFFFF', strokeThickness:3,
      shadow:{blur:10,color:'#FF6B9D',fill:true}
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);

    // progress bar at top
    this.progressBg=this.add.graphics().setScrollFactor(0).setDepth(200);
    this.progressBg.fillStyle(0x000000,0.4);
    this.progressBg.fillRoundedRect(GW/2-160,10,320,12,6);
    this.progressBar=this.add.graphics().setScrollFactor(0).setDepth(201);
    this.add.image(GW/2+160+14,16,'cake').setScrollFactor(0).setDepth(201).setScale(0.5);
    this.add.text(GW/2-160-14,10,'🏁',{fontSize:'16px'}).setScrollFactor(0).setDepth(201);
  }

  _updateHUD(){
    this.scoreTxt.setText(`SCORE  ${this.score.toLocaleString()}`);
    const hearts=['💀','❤️','❤️ ❤️','❤️ ❤️ ❤️'];
    this.livesTxt.setText(hearts[Math.max(0,this.lives)]||'💀');
    this.coinTxt.setText(`× ${this.coins}`);

    // progress bar
    const prog=Math.min(1, this.player.x / (WORLD_W-200));
    this.progressBar.clear();
    this.progressBar.fillStyle(0x6BCB77,1);
    this.progressBar.fillRoundedRect(GW/2-160,10,320*prog,12,6);
    this.progressBar.fillStyle(0xFFFFFF,0.3);
    this.progressBar.fillRoundedRect(GW/2-160,10,320*prog,4,{tl:6,tr:0,bl:0,br:0});
  }

  /* ══ CONTROLS ══ */
  _buildControls(){
    this.cursors=this.input.keyboard.createCursorKeys();
    this.wKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.zKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.spaceKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  /* ══ ACTIONS ══ */
  _stompEnemy(enemy){
    this.combo++;
    this.comboTimer=120;
    const pts=50*this.combo;
    this.score+=pts;
    this._showScorePopup(enemy.x, enemy.y-20, `+${pts}`, this.combo>2?'#FF6B9D':'#FFD93D');
    this._spawnParticles(enemy.x, enemy.y, 'p_star', 8, '#FFD93D');
    this.player.setVelocityY(-400);
    SFX.stomp();
    // squish tween
    this.tweens.add({targets:enemy, scaleY:0, scaleX:2, alpha:0, duration:200,
      onComplete:()=>enemy.destroy()});
    this._updateHUD();
  }

  _collectItem(item){
    const pts=item.pointVal;
    this.score+=pts;
    if(item.itemType==='coin') this.coins++;
    this._showScorePopup(item.x, item.y-20, `+${pts}`, '#FFD93D');
    const pKey=item.itemType==='coin'?'p_star':'p_heart';
    this._spawnParticles(item.x, item.y, pKey, 5, '#FF6B9D');
    SFX.coin();
    // pop tween
    this.tweens.add({targets:item, scaleX:1.8, scaleY:1.8, alpha:0, duration:200,
      onComplete:()=>item.destroy()});
    this._updateHUD();
  }

  _hurtPlayer(){
    if(this.invincible||!this.isAlive) return;
    this.lives--;
    this.combo=0;
    this._updateHUD();
    this.invincible=true;
    this.player.setVelocityY(-400);
    this.player.setVelocityX(this.player.flipX?250:-250);
    SFX.hurt();
    this.cameras.main.shake(300,0.012);
    // screen flash red
    const flash=this.add.rectangle(GW/2,GH/2,GW,GH,0xFF0000,0.35).setScrollFactor(0).setDepth(300);
    this.tweens.add({targets:flash,alpha:0,duration:300,onComplete:()=>flash.destroy()});
    // flash player
    this.tweens.add({
      targets:this.player, alpha:0, duration:80, yoyo:true, repeat:10,
      onComplete:()=>{ this.player.setAlpha(1); this.invincible=false; }
    });
    if(this.lives<=0){
      this.time.delayedCall(800,()=>this._gameOver());
    }
  }

  _winLevel(){
    this.levelDone=true; this.isAlive=false;
    const hi=parseInt(localStorage.getItem('fooddash_hi')||0);
    if(this.score>hi) localStorage.setItem('fooddash_hi',this.score);
    SFX.win();
    this.cameras.main.shake(600,0.018);
    // massive confetti
    for(let i=0;i<60;i++){
      this.time.delayedCall(i*40,()=>{
        this._spawnParticles(
          this.cakeObj.x+Phaser.Math.Between(-80,80),
          this.cakeObj.y+Phaser.Math.Between(-80,80),
          ['p_star','p_heart','p_sparkle'][i%3],6,'#FFD93D'
        );
      });
    }
    // flash white
    const flash=this.add.rectangle(GW/2,GH/2,GW,GH,0xFFFFFF,0.6).setScrollFactor(0).setDepth(300);
    this.tweens.add({targets:flash,alpha:0,duration:500,onComplete:()=>flash.destroy()});
    this.time.delayedCall(2200,()=>this.scene.start('WinScene',{score:this.score,coins:this.coins}));
  }

  _gameOver(){
    this.isAlive=false;
    SFX.gameover();
    this.cameras.main.shake(400,0.02);
    this.time.delayedCall(1400,()=>this.scene.start('GameOverScene',{score:this.score}));
  }

  /* ══ PARTICLES ══ */
  _spawnParticles(x,y,key,count,tint){
    for(let i=0;i<count;i++){
      const s=this.add.image(x,y,key).setDepth(50).setScale(0.9+Math.random()*0.6);
      this.tweens.add({
        targets:s,
        x:x+Phaser.Math.Between(-70,70),
        y:y+Phaser.Math.Between(-80,20),
        alpha:0, scaleX:0, scaleY:0,
        duration:400+Math.random()*300,
        ease:'Power2',
        onComplete:()=>s.destroy()
      });
    }
  }

  /* ══ SCORE POPUP ══ */
  _showScorePopup(x,y,text,color='#FFD93D'){
    const t=this.add.text(x,y,text,{
      fontFamily:'Fredoka One, cursive', fontSize:'22px', fill:color,
      stroke:'#000000', strokeThickness:3
    }).setOrigin(0.5).setDepth(60);
    this.tweens.add({
      targets:t, y:y-60, alpha:0, scaleX:1.4, scaleY:1.4,
      duration:700, ease:'Power2',
      onComplete:()=>t.destroy()
    });
  }

  /* ══ UPDATE ══ */
  update(time, delta){
    if(!this.isAlive) return;

    const player=this.player;
    const onGround=player.body.blocked.down;

    // ── Horizontal ──
    const goLeft  = this.cursors.left.isDown  || this.aKey.isDown;
    const goRight = this.cursors.right.isDown || this.dKey.isDown;

    if(goLeft){
      player.setVelocityX(-PLAYER_SPD);
      player.setFlipX(true);
      player.setTexture(onGround?'player_walk':'player_jump');
    } else if(goRight){
      player.setVelocityX(PLAYER_SPD);
      player.setFlipX(false);
      player.setTexture(onGround?'player_walk':'player_jump');
    } else {
      player.setTexture(onGround?'player_idle':'player_jump');
    }

    // walk animation cycle (alternate walk/walk2)
    if((goLeft||goRight) && onGround){
      this.walkTimer+=delta;
      if(this.walkTimer>140){
        this.walkTimer=0;
        this.walkFrame=1-this.walkFrame;
        player.setTexture(this.walkFrame?'player_walk':'player_walk2');
      }
    }

    // ── Jump ──
    const jumpJust =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.wKey) ||
      Phaser.Input.Keyboard.JustDown(this.zKey) ||
      Phaser.Input.Keyboard.JustDown(this.spaceKey);

    if(jumpJust){
      if(onGround){
        player.setVelocityY(JUMP_VEL);
        this.jumpsLeft=1;
        SFX.jump();
        this._spawnParticles(player.x, player.y+20,'p_sparkle',3,'#FFFFFF');
      } else if(this.jumpsLeft>0){
        player.setVelocityY(DJUMP_VEL);
        this.jumpsLeft--;
        SFX.djump();
        this._spawnParticles(player.x, player.y+10,'p_sparkle',5,'#6BCB77');
      }
    }

    // ── Combo timer ──
    if(this.comboTimer>0){
      this.comboTimer-=delta/16;
      if(this.combo>1){
        this.comboTxt.setText(`COMBO ×${this.combo}!`).setAlpha(1);
        this.tweens.add({targets:this.comboTxt,scaleX:1.1,scaleY:1.1,duration:80,yoyo:true});
      }
      if(this.comboTimer<=0){
        this.combo=0;
        this.tweens.add({targets:this.comboTxt,alpha:0,duration:200});
      }
    }

    // ── Flying enemies wave ──
    this.enemies.getChildren().forEach(e=>{
      if(e.enemyType==='fly'){
        e.y=e.baseY+Math.sin(time*0.0016+e.waveOffset)*40;
        e.body.reset(e.x,e.y);
        // face movement direction
        if(e.body.velocity.x>0) e.setFlipX(false);
        else e.setFlipX(true);
      } else {
        if(e.body.velocity.x>0) e.setFlipX(false);
        else e.setFlipX(true);
      }
    });

    // ── Fall into pit ──
    if(player.y>GH+80){
      this._hurtPlayer();
      if(this.lives>0){
        player.setPosition(100, GH-120);
        player.setVelocity(0,0);
      }
    }

    // ── World bounds for enemies ──
    this.enemies.getChildren().forEach(e=>{
      if(e.x<40) e.setVelocityX(Math.abs(e.body.velocity.x));
      if(e.x>WORLD_W-40) e.setVelocityX(-Math.abs(e.body.velocity.x));
    });

    // ── Dust trail when running ──
    if((goLeft||goRight) && onGround){
      this.trailTimer+=delta;
      if(this.trailTimer>80){
        this.trailTimer=0;
        const d=this.add.image(player.x+Phaser.Math.Between(-6,6), player.y+20,'p_sparkle')
          .setAlpha(0.4).setScale(0.5).setDepth(5);
        this.tweens.add({targets:d,alpha:0,scaleX:0,scaleY:0,y:d.y+10,duration:280,onComplete:()=>d.destroy()});
      }
    } else { this.trailTimer=80; }

    this._updateHUD();
  }
}

/* ═══════════════════════════════════════════════
   GAME OVER SCENE
   ═══════════════════════════════════════════════ */
class GameOverScene extends Phaser.Scene {
  constructor(){ super({key:'GameOverScene'}); }
  init(d){ this.finalScore=d.score||0; }

  create(){
    const W=GW, H=GH;

    // bg
    const bg=this.add.graphics();
    bg.fillGradientStyle(0x1A0530,0x1A0530,0x3D0A0A,0x3D0A0A,1);
    bg.fillRect(0,0,W,H);

    // fading particles
    for(let i=0;i<20;i++){
      const p=this.add.image(Phaser.Math.Between(0,W),Phaser.Math.Between(0,H),'p_sparkle')
        .setAlpha(0.3).setScale(Math.random()*1.5+0.5);
      this.tweens.add({targets:p,y:p.y-H,duration:Phaser.Math.Between(4000,8000),repeat:-1,delay:Math.random()*4000});
    }

    const panel=this.add.graphics();
    panel.fillStyle(0xFFFFFF,0.08);
    panel.fillRoundedRect(W/2-200,H/2-170,400,340,20);
    panel.lineStyle(2,0xFF6B6B,0.5);
    panel.strokeRoundedRect(W/2-200,H/2-170,400,340,20);

    this.add.text(W/2,H/2-120,'💀 GAME OVER',{
      fontFamily:'Fredoka One, cursive', fontSize:'46px',
      fill:'#FF6B6B', stroke:'#800000', strokeThickness:3,
      shadow:{blur:15,color:'#FF0000',fill:true}
    }).setOrigin(0.5);

    this.add.text(W/2,H/2-55,`SCORE:  ${this.finalScore.toLocaleString()}`,{
      fontFamily:'Fredoka One, cursive', fontSize:'30px', fill:'#FFD93D'
    }).setOrigin(0.5);

    const hi=localStorage.getItem('fooddash_hi')||0;
    this.add.text(W/2,H/2-15,`BEST:  ${parseInt(hi).toLocaleString()}`,{
      fontFamily:'Nunito, sans-serif', fontSize:'18px', fontStyle:'bold', fill:'#6BCB77'
    }).setOrigin(0.5);

    this._btn(W/2, H/2+60, '↩  TRY AGAIN', 0xFF5555, 0xCC1111, ()=>this.scene.start('GameScene'));
    this._btn(W/2, H/2+125, '🏠  MAIN MENU', 0x5555AA, 0x2222AA, ()=>this.scene.start('MenuScene'));
    this.input.keyboard.once('keydown',()=>this.scene.start('GameScene'));
  }

  _btn(cx,cy,label,c1,c2,cb){
    const g=this.add.graphics();
    g.fillGradientStyle(c1,c1,c2,c2,1);
    g.fillRoundedRect(cx-110,cy-22,220,44,12);
    g.lineStyle(1.5,0xFFFFFF,0.25); g.strokeRoundedRect(cx-110,cy-22,220,44,12);
    const t=this.add.text(cx,cy,label,{
      fontFamily:'Fredoka One, cursive', fontSize:'22px', fill:'#FFFFFF'
    }).setOrigin(0.5);
    g.setInteractive(new Phaser.Geom.Rectangle(cx-110,cy-22,220,44),Phaser.Geom.Rectangle.Contains);
    g.on('pointerover',()=>t.setScale(1.08));
    g.on('pointerout', ()=>t.setScale(1));
    g.on('pointerdown',cb);
    return g;
  }
}

/* ═══════════════════════════════════════════════
   WIN SCENE
   ═══════════════════════════════════════════════ */
class WinScene extends Phaser.Scene {
  constructor(){ super({key:'WinScene'}); }
  init(d){ this.finalScore=d.score||0; this.coins=d.coins||0; }

  create(){
    const W=GW, H=GH;

    // rainbow gradient bg
    const bg=this.add.graphics();
    bg.fillGradientStyle(0x0A3A1A,0x0A3A1A,0x2D0A5A,0x2D0A5A,1);
    bg.fillRect(0,0,W,H);

    // confetti rain
    for(let i=0;i<50;i++){
      const keys=['p_star','p_heart','p_sparkle'];
      const s=this.add.image(
        Phaser.Math.Between(0,W),
        Phaser.Math.Between(-60,H),
        keys[i%keys.length]
      ).setScale(Math.random()*1.5+0.6).setAlpha(0.8)
       .setTint([0xFFD93D,0xFF6B9D,0x6BCB77,0x4D96FF][i%4]);
      this.tweens.add({
        targets:s, y:H+40, duration:Phaser.Math.Between(1500,4000),
        delay:Math.random()*3000, repeat:-1, ease:'Linear'
      });
      this.tweens.add({targets:s,x:s.x+Phaser.Math.Between(-60,60),duration:Phaser.Math.Between(2000,4000),yoyo:true,repeat:-1});
    }

    // panel
    const panel=this.add.graphics();
    panel.fillStyle(0xFFFFFF,0.1);
    panel.fillRoundedRect(W/2-230,H/2-190,460,380,22);
    panel.lineStyle(2.5,0xFFD93D,0.7);
    panel.strokeRoundedRect(W/2-230,H/2-190,460,380,22);

    // big cake
    const cake=this.add.image(W/2,H/2-120,'cake').setScale(3);
    this.tweens.add({targets:cake,y:H/2-134,duration:900,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    this.tweens.add({targets:cake,angle:[-6,6],duration:1200,yoyo:true,repeat:-1});

    this.add.text(W/2,H/2-30,'🎉  YOU WIN!  🎉',{
      fontFamily:'Fredoka One, cursive', fontSize:'46px',
      fill:'#FFD93D', stroke:'#FF6B9D', strokeThickness:4,
      shadow:{blur:20,color:'#FF9F1C',fill:true}
    }).setOrigin(0.5);

    this.add.text(W/2,H/2+20,`SCORE:  ${this.finalScore.toLocaleString()}`,{
      fontFamily:'Fredoka One, cursive', fontSize:'28px', fill:'#FFFFFF'
    }).setOrigin(0.5);

    this.add.text(W/2,H/2+54,`COINS COLLECTED: ${this.coins} 🪙`,{
      fontFamily:'Nunito, sans-serif', fontSize:'17px', fontStyle:'bold', fill:'#FFD93D'
    }).setOrigin(0.5);

    const hi=parseInt(localStorage.getItem('fooddash_hi')||0);
    if(this.finalScore>=hi){
      const newBest=this.add.text(W/2,H/2+84,'★  NEW BEST SCORE!  ★',{
        fontFamily:'Fredoka One, cursive', fontSize:'22px', fill:'#6BCB77',
        shadow:{blur:10,color:'#00FF88',fill:true}
      }).setOrigin(0.5);
      this.tweens.add({targets:newBest,scaleX:1.06,scaleY:1.06,duration:600,yoyo:true,repeat:-1});
    }

    this._btn(W/2-70, H/2+140,'▶  PLAY AGAIN',0x6BCB77,0x30A040,()=>this.scene.start('GameScene'));
    this._btn(W/2+90, H/2+140,'🏠  MENU',0x4D96FF,0x1A60CC,()=>this.scene.start('MenuScene'));
  }

  _btn(cx,cy,label,c1,c2,cb){
    const w=label.length*11+40;
    const g=this.add.graphics();
    g.fillGradientStyle(c1,c1,c2,c2,1);
    g.fillRoundedRect(cx-w/2,cy-20,w,40,10);
    g.lineStyle(1.5,0xFFFFFF,0.3); g.strokeRoundedRect(cx-w/2,cy-20,w,40,10);
    const t=this.add.text(cx,cy,label,{
      fontFamily:'Fredoka One, cursive', fontSize:'18px', fill:'#FFFFFF'
    }).setOrigin(0.5);
    g.setInteractive(new Phaser.Geom.Rectangle(cx-w/2,cy-20,w,40),Phaser.Geom.Rectangle.Contains);
    g.on('pointerover',()=>t.setScale(1.1));
    g.on('pointerout',()=>t.setScale(1));
    g.on('pointerdown',()=>{ SFX.jump(); cb(); });
    return g;
  }
}

/* ═══════════════════════════════════════════════
   PHASER CONFIG
   ═══════════════════════════════════════════════ */
const config = {
  type: Phaser.AUTO,
  width: GW,
  height: GH,
  parent: 'phaser-game',
  backgroundColor: '#2D0A5A',
  pixelArt: false,           // smooth HD rendering
  antialias: true,
  roundPixels: false,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: GRAVITY },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, GameScene, GameOverScene, WinScene],
};

const game = new Phaser.Game(config);