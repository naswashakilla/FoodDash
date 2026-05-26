/* ══════════════════════════════════════════════
   FOOD DASH DELUXE — game.js  v3
   3 Levels | Fixed sizes | Proper gaps
   ══════════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────────────
   CONSTANTS
   ───────────────────────────────────────────── */
const GW = 960, GH = 540;

// Player physics — tuned for 32px tile grid
const GRAVITY    = 800;
const PLAYER_SPD = 240;
const JUMP_VEL   = -560;
const DJUMP_VEL  = -480;

// How many px wide one ground tile is (matches drawGround canvas)
const GT = 48;   // ground tile step
const PT = 48;   // platform tile step

const COLLECTIBLE_POINTS = {
  burger:100, donut:150, lollipop:200,
  icecream:250, cupcake:300, coin:30
};

/* ─────────────────────────────────────────────
   LEVEL DEFINITIONS
   Each level has its own world width, theme
   colours, platform layout, enemy positions,
   food positions, and gap ranges.

   Platform entry: [startX, y, numTiles]
   Gap   entry:    [xStart, xEnd]  (ground missing)
   Enemy entry:    [x, y, type]    type='sushi'|'hotdog'
   Food  entry:    [x, y, type]
   ───────────────────────────────────────────── */
const LEVELS = [

  /* ══ LEVEL 1 — Candy Land ══ */
  {
    id: 1,
    name: 'Candy Land',
    worldW: 3840,
    bgColors: [0, 1, 2],          // bg tile keys
    skyTop: 0x3D1060,
    skyBot: 0x1A0530,

    // ground gaps  [xFrom, xTo]  (must be jumpable: ≤ 160px)
    gaps: [
      [480, 608],
      [960, 1088],
      [1440, 1568],
      [1920, 2016],
      [2400, 2528],
      [2880, 2976],
    ],

    // elevated platforms  [startX, y, tiles]
    // tiles × PT = width. gap between tiles same platform = 0
    // Vertical clearance from ground = GH-y should be ≥ 80
    platforms: [
      [160,  GH-140, 3],
      [400,  GH-200, 2],
      [600,  GH-150, 3],
      [850,  GH-190, 2],
      [1040, GH-140, 3],
      [1200, GH-210, 2],
      [1380, GH-160, 3],
      [1600, GH-140, 2],
      [1750, GH-210, 3],
      [1970, GH-160, 2],
      [2100, GH-200, 3],
      [2320, GH-140, 2],
      [2560, GH-190, 3],
      [2760, GH-150, 2],
      [2980, GH-210, 3],
      [3200, GH-160, 2],
      [3380, GH-140, 3],
      [3600, GH-200, 2],
    ],

    // spikes x positions (on ground)
    spikes: [420, 900, 1350, 1850, 2350, 2800, 3300],

    // enemies [x, y, 'sushi'|'hotdog']
    enemies: [
      [300,  GH-68, 'sushi'],
      [660,  GH-68, 'sushi'],
      [1100, GH-68, 'sushi'],
      [1650, GH-68, 'sushi'],
      [2150, GH-68, 'sushi'],
      [2620, GH-68, 'sushi'],
      [3100, GH-68, 'sushi'],
      [700,  GH-230,'hotdog'],
      [1250, GH-260,'hotdog'],
      [1800, GH-230,'hotdog'],
      [2500, GH-260,'hotdog'],
      [3000, GH-230,'hotdog'],
    ],

    // food [x, y, type]
    food: [
      [200,  GH-170,'burger'],
      [470,  GH-100,'coin'],
      [520,  GH-140,'coin'],
      [570,  GH-100,'coin'],
      [700,  GH-180,'donut'],
      [900,  GH-220,'lollipop'],
      [1000, GH-100,'coin'],
      [1050, GH-130,'coin'],
      [1100, GH-160,'coin'],
      [1280, GH-240,'icecream'],
      [1450, GH-190,'burger'],
      [1650, GH-100,'coin'],
      [1700, GH-140,'coin'],
      [1750, GH-100,'coin'],
      [1850, GH-180,'donut'],
      [2000, GH-240,'cupcake'],
      [2150, GH-230,'lollipop'],
      [2200, GH-100,'coin'],
      [2280, GH-140,'coin'],
      [2450, GH-170,'icecream'],
      [2600, GH-220,'burger'],
      [2800, GH-180,'donut'],
      [2900, GH-100,'coin'],
      [2950, GH-140,'coin'],
      [3050, GH-240,'cupcake'],
      [3250, GH-190,'lollipop'],
      [3450, GH-170,'icecream'],
      [3650, GH-230,'burger'],
    ],
  },

  /* ══ LEVEL 2 — Spicy Kitchen ══ */
  {
    id: 2,
    name: 'Spicy Kitchen',
    worldW: 4480,
    bgColors: [1, 2, 0],
    skyTop: 0x5A1A00,
    skyBot: 0x2A0800,

    gaps: [
      [384,  528],
      [864,  992],
      [1344, 1488],
      [1824, 1952],
      [2304, 2432],
      [2784, 2912],
      [3264, 3392],
      [3744, 3840],
    ],

    platforms: [
      [120,  GH-150, 2],
      [340,  GH-210, 2],
      [530,  GH-160, 3],
      [780,  GH-200, 2],
      [990,  GH-150, 3],
      [1190, GH-220, 2],
      [1380, GH-160, 2],
      [1550, GH-200, 3],
      [1800, GH-150, 2],
      [2000, GH-210, 3],
      [2200, GH-160, 2],
      [2450, GH-200, 3],
      [2660, GH-160, 2],
      [2930, GH-210, 3],
      [3100, GH-150, 2],
      [3400, GH-200, 3],
      [3600, GH-160, 2],
      [3850, GH-210, 3],
      [4050, GH-150, 2],
      [4250, GH-190, 2],
    ],

    spikes: [330, 810, 1290, 1770, 2250, 2730, 3200, 3680, 4100],

    enemies: [
      [250,  GH-68, 'sushi'],
      [580,  GH-68, 'sushi'],
      [1040, GH-68, 'sushi'],
      [1490, GH-68, 'sushi'],
      [1960, GH-68, 'sushi'],
      [2460, GH-68, 'sushi'],
      [2960, GH-68, 'sushi'],
      [3440, GH-68, 'sushi'],
      [3900, GH-68, 'sushi'],
      [4200, GH-68, 'sushi'],
      [600,  GH-240,'hotdog'],
      [1100, GH-260,'hotdog'],
      [1600, GH-240,'hotdog'],
      [2100, GH-270,'hotdog'],
      [2600, GH-240,'hotdog'],
      [3100, GH-260,'hotdog'],
      [3600, GH-240,'hotdog'],
      [4100, GH-260,'hotdog'],
    ],

    food: [
      [160,  GH-180,'burger'],
      [370,  GH-100,'coin'],
      [420,  GH-140,'coin'],
      [470,  GH-100,'coin'],
      [640,  GH-190,'donut'],
      [870,  GH-100,'coin'],
      [910,  GH-140,'coin'],
      [950,  GH-100,'coin'],
      [1050, GH-180,'lollipop'],
      [1260, GH-250,'icecream'],
      [1400, GH-100,'coin'],
      [1450, GH-140,'coin'],
      [1560, GH-230,'cupcake'],
      [1870, GH-100,'coin'],
      [1920, GH-140,'coin'],
      [1970, GH-100,'coin'],
      [2080, GH-240,'burger'],
      [2220, GH-190,'donut'],
      [2470, GH-100,'coin'],
      [2520, GH-140,'coin'],
      [2660, GH-190,'lollipop'],
      [2950, GH-100,'coin'],
      [3000, GH-140,'coin'],
      [3110, GH-180,'icecream'],
      [3420, GH-230,'cupcake'],
      [3630, GH-100,'coin'],
      [3680, GH-140,'coin'],
      [3870, GH-240,'burger'],
      [4080, GH-180,'donut'],
      [4280, GH-220,'cupcake'],
    ],
  },

  /* ══ LEVEL 3 — Sugar Rush ══ */
  {
    id: 3,
    name: 'Sugar Rush',
    worldW: 5120,
    bgColors: [2, 0, 1],
    skyTop: 0x0A3A1A,
    skyBot: 0x051A0A,

    gaps: [
      [384,  512],
      [864,  992],
      [1344, 1472],
      [1824, 1952],
      [2304, 2432],
      [2784, 2912],
      [3264, 3392],
      [3744, 3872],
      [4224, 4320],
      [4704, 4800],
    ],

    platforms: [
      [100,  GH-160, 2],
      [300,  GH-230, 2],
      [510,  GH-170, 3],
      [730,  GH-210, 2],
      [950,  GH-160, 2],
      [1120, GH-230, 3],
      [1330, GH-170, 2],
      [1530, GH-210, 3],
      [1740, GH-160, 2],
      [1960, GH-230, 3],
      [2160, GH-170, 2],
      [2380, GH-210, 3],
      [2590, GH-160, 2],
      [2800, GH-230, 3],
      [3000, GH-170, 2],
      [3200, GH-210, 3],
      [3420, GH-160, 2],
      [3620, GH-230, 3],
      [3830, GH-170, 2],
      [4050, GH-210, 3],
      [4250, GH-160, 2],
      [4500, GH-230, 3],
      [4700, GH-170, 2],
      [4900, GH-210, 2],
    ],

    spikes: [320, 800, 1280, 1760, 2240, 2720, 3200, 3680, 4160, 4640],

    enemies: [
      [200,  GH-68, 'sushi'],
      [560,  GH-68, 'sushi'],
      [1040, GH-68, 'sushi'],
      [1500, GH-68, 'sushi'],
      [1980, GH-68, 'sushi'],
      [2460, GH-68, 'sushi'],
      [2940, GH-68, 'sushi'],
      [3420, GH-68, 'sushi'],
      [3900, GH-68, 'sushi'],
      [4380, GH-68, 'sushi'],
      [4860, GH-68, 'sushi'],
      [560,  GH-250,'hotdog'],
      [1040, GH-270,'hotdog'],
      [1520, GH-250,'hotdog'],
      [2000, GH-270,'hotdog'],
      [2480, GH-250,'hotdog'],
      [2960, GH-270,'hotdog'],
      [3440, GH-250,'hotdog'],
      [3920, GH-270,'hotdog'],
      [4400, GH-250,'hotdog'],
      [4880, GH-270,'hotdog'],
    ],

    food: [
      [150,  GH-190,'cupcake'],
      [370,  GH-100,'coin'],
      [410,  GH-140,'coin'],
      [450,  GH-100,'coin'],
      [600,  GH-200,'icecream'],
      [820,  GH-100,'coin'],
      [860,  GH-140,'coin'],
      [900,  GH-100,'coin'],
      [1010, GH-190,'burger'],
      [1200, GH-260,'donut'],
      [1310, GH-100,'coin'],
      [1370, GH-140,'coin'],
      [1490, GH-240,'lollipop'],
      [1820, GH-100,'coin'],
      [1870, GH-140,'coin'],
      [1970, GH-260,'cupcake'],
      [2130, GH-200,'icecream'],
      [2360, GH-100,'coin'],
      [2420, GH-140,'coin'],
      [2560, GH-190,'burger'],
      [2760, GH-100,'coin'],
      [2820, GH-140,'coin'],
      [2960, GH-260,'donut'],
      [3180, GH-200,'lollipop'],
      [3390, GH-190,'cupcake'],
      [3600, GH-100,'coin'],
      [3660, GH-140,'coin'],
      [3790, GH-260,'icecream'],
      [4030, GH-200,'burger'],
      [4220, GH-100,'coin'],
      [4280, GH-140,'coin'],
      [4460, GH-260,'cupcake'],
      [4680, GH-190,'donut'],
      [4880, GH-230,'lollipop'],
      [5000, GH-200,'icecream'],
    ],
  },
];

/* ─────────────────────────────────────────────
   SFX ENGINE
   ───────────────────────────────────────────── */
const SFX = (() => {
  let ctx = null;
  const ensure = () => {
    if(!ctx) ctx = new (window.AudioContext||window.webkitAudioContext)();
    return ctx;
  };
  function play(freq, type='square', dur=0.08, vol=0.18, bend=0){
    try{
      const ac=ensure();
      const osc=ac.createOscillator(), gain=ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type=type; osc.frequency.setValueAtTime(freq,ac.currentTime);
      if(bend) osc.frequency.exponentialRampToValueAtTime(freq*bend,ac.currentTime+dur);
      gain.gain.setValueAtTime(vol,ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+dur);
      osc.start(); osc.stop(ac.currentTime+dur);
    }catch(e){}
  }
  return {
    coin:    ()=>{ play(880,'sine',0.06,0.18,1.5); setTimeout(()=>play(1320,'sine',0.06,0.18),60); },
    jump:    ()=>{ play(320,'square',0.10,0.14,1.9); },
    djump:   ()=>{ play(520,'sine',0.10,0.14,1.6); play(720,'sine',0.08,0.10,1.4); },
    stomp:   ()=>{ play(180,'square',0.15,0.22,0.3); play(140,'sawtooth',0.10,0.18,0.2); },
    hurt:    ()=>{ play(180,'sawtooth',0.18,0.28,0.4); },
    levelup: ()=>{ [523,659,784,1047,1318].forEach((f,i)=>setTimeout(()=>play(f,'sine',0.3,0.22),i*100)); },
    win:     ()=>{ [523,659,784,1047,1318,1568].forEach((f,i)=>setTimeout(()=>play(f,'sine',0.4,0.25),i*110)); },
    gameover:()=>{ [380,280,190,140].forEach((f,i)=>setTimeout(()=>play(f,'square',0.25,0.2),i*160)); },
  };
})();

/* ═══════════════════════════════════════════════
   BOOT SCENE — loads all canvas textures once
   ═══════════════════════════════════════════════ */
class BootScene extends Phaser.Scene {
  constructor(){ super({key:'BootScene'}); }

  preload(){
    const map = [
      ['player_idle',  drawPlayerHD('idle',1)],
      ['player_walk',  drawPlayerHD('walk',1)],
      ['player_walk2', drawPlayerHD('walk',-1)],
      ['player_jump',  drawPlayerJump()],
      ['ground',       drawGround()],
      ['platform',     drawPlatform()],
      ['burger',       drawBurger()],
      ['donut',        drawDonut()],
      ['lollipop',     drawLollipop()],
      ['icecream',     drawIceCream()],
      ['cupcake',      drawCupcake()],
      ['coin',         drawCoin()],
      ['hotdog_enemy', drawHotdog()],
      ['sushi_enemy',  drawSushiEnemy()],
      ['cake',         drawCake()],
      ['bg0',          drawBg(0)],
      ['bg1',          drawBg(1)],
      ['bg2',          drawBg(2)],
      ['cloud',        drawCloud()],
      ['spikes',       drawSpikes()],
      ['p_star',       drawParticleStar()],
      ['p_heart',      drawParticleHeart()],
      ['p_sparkle',    drawParticleSparkle()],
      ['chili',        drawChili()],
      ['sugar_bullet', drawSugarBullet()],
    ];
    for(const [key,canvas] of map){
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
    // gradient sky
    const sky=this.add.graphics();
    sky.fillGradientStyle(0x3D1060,0x3D1060,0x1A0530,0x1A0530,1);
    sky.fillRect(0,0,GW,GH);

    // floating cloud decos
    for(let i=0;i<8;i++){
      this.add.image(
        Phaser.Math.Between(0,GW), Phaser.Math.Between(30,GH*0.5), 'cloud'
      ).setAlpha(0.12).setScale(1+Math.random());
    }

    // floating food
    const foods=['burger','donut','lollipop','icecream','cupcake'];
    for(let i=0;i<12;i++){
      const img=this.add.image(
        Phaser.Math.Between(40,GW-40),
        Phaser.Math.Between(40,GH-40),
        foods[i%foods.length]
      ).setAlpha(0.2).setScale(0.9+Math.random()*0.6);
      this.tweens.add({targets:img, y:img.y-Phaser.Math.Between(18,42),
        duration:Phaser.Math.Between(2000,3800),yoyo:true,repeat:-1,ease:'Sine.easeInOut',
        delay:Phaser.Math.Between(0,2000)});
    }

    // frosted panel
    const px=GW/2-210, py=50, pw=420, ph=GH-100;
    const panel=this.add.graphics();
    panel.fillStyle(0xFFFFFF,0.08);
    panel.fillRoundedRect(px,py,pw,ph,22);
    panel.lineStyle(2,0xFFFFFF,0.25);
    panel.strokeRoundedRect(px,py,pw,ph,22);

    // title
    this.add.text(GW/2,110,'🍔 Food Dash',{
      fontFamily:'Fredoka One,cursive', fontSize:'54px',
      fill:'#FFD93D', stroke:'#FF6B9D', strokeThickness:4,
      shadow:{blur:18,color:'#FF9F1C',fill:true}
    }).setOrigin(0.5);
    this.add.text(GW/2,165,'D E L U X E',{
      fontFamily:'Fredoka One,cursive', fontSize:'20px',
      fill:'#6BCB77', letterSpacing:10
    }).setOrigin(0.5);

    // hi-score
    const hi=localStorage.getItem('fooddash_hi')||0;
    this.add.text(GW/2,205,`⭐ BEST: ${parseInt(hi).toLocaleString()} pts`,{
      fontFamily:'Nunito,sans-serif', fontSize:'16px',
      fontStyle:'bold', fill:'#FFD93D'
    }).setOrigin(0.5);

    // instructions
    [
      ['🕹️','Arrow / WASD — Move'],
      ['🚀','Z / Space — Jump  (double jump!)'],
      ['👟','Land on enemies to stomp'],
      ['🍩','Collect food & coins for points'],
      ['🎂','Reach the Birthday Cake to win!'],
    ].forEach(([icon,txt],i)=>{
      this.add.text(GW/2-150, 250+i*32,`${icon}  ${txt}`,{
        fontFamily:'Nunito,sans-serif', fontSize:'15px',
        fontStyle:'bold', fill:'rgba(255,255,255,0.88)'
      });
    });

    // level select buttons
    this.add.text(GW/2,415,'SELECT LEVEL',{
      fontFamily:'Fredoka One,cursive', fontSize:'18px', fill:'rgba(255,255,255,0.6)'
    }).setOrigin(0.5);

    const levelColors=[
      [0xFF6B9D,0xCC2060],
      [0xFF9F1C,0xCC6000],
      [0x6BCB77,0x30A040],
    ];
    LEVELS.forEach((lv,i)=>{
      const bx=GW/2-160+i*160, by=440;
      const [c1,c2]=levelColors[i];
      const g=this.add.graphics();
      g.fillGradientStyle(c1,c1,c2,c2,1);
      g.fillRoundedRect(bx-58,by,116,44,10);
      g.lineStyle(1.5,0xFFFFFF,0.3);
      g.strokeRoundedRect(bx-58,by,116,44,10);
      const lbl=this.add.text(bx,by+22,`Lv ${lv.id}: ${lv.name}`,{
        fontFamily:'Fredoka One,cursive', fontSize:'13px', fill:'#FFF',
        wordWrap:{width:100}, align:'center'
      }).setOrigin(0.5);
      g.setInteractive(new Phaser.Geom.Rectangle(bx-58,by,116,44),Phaser.Geom.Rectangle.Contains);
      g.on('pointerover',()=>{ lbl.setScale(1.08); g.setAlpha(0.85); });
      g.on('pointerout', ()=>{ lbl.setScale(1);    g.setAlpha(1); });
      g.on('pointerdown',()=>{
        SFX.jump();
        this.scene.start('GameScene',{levelIdx:i, score:0});
      });
    });

    // big cake
    const cake=this.add.image(GW/2+280,250,'cake').setScale(2.2);
    this.tweens.add({targets:cake,y:236,duration:1200,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});

    // press any key → level 1
    this.input.keyboard.once('keydown',()=>{ SFX.jump(); this.scene.start('GameScene',{levelIdx:0,score:0}); });
  }
}

/* ═══════════════════════════════════════════════
   GAME SCENE
   ═══════════════════════════════════════════════ */
class GameScene extends Phaser.Scene {
  constructor(){ super({key:'GameScene'}); }

  init(data){
    this.levelIdx    = data.levelIdx  ?? 0;
    this.totalScore  = data.score     ?? 0;  // carry score across levels
  }

  create(){
    this.lvDef = LEVELS[this.levelIdx];

    // per-level state
    this.score     = this.totalScore;
    this.lives     = data_lives ?? 3;         // persist lives across levels
    this.coins     = 0;
    this.jumpsLeft = 2;
    this.isAlive   = true;
    this.levelDone = false;
    this.invincible= false;
    this.walkFrame = 0;
    this.walkTimer = 0;
    this.combo     = 0;
    this.comboTimer= 0;
    this.trailTimer= 0;

    const WW = this.lvDef.worldW;
    this.cameras.main.setBounds(0, 0, WW, GH);

    this._buildWorld(WW);
    this._buildPlayer();
    this._buildEnemies();
    this._buildCollectibles();
    this._buildHUD();
    this._buildControls();

    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setDeadzone(220, 100);

    // ── Dynamic Level Hazards ──
    this.fallingHazards = this.physics.add.group({ allowGravity: true });
    this.physics.add.collider(this.fallingHazards, this.platforms, (hazard, platform) => {
      this._burst(hazard.x, hazard.y, 'p_sparkle', 4);
      hazard.destroy();
    });
    this.physics.add.overlap(this.player, this.fallingHazards, (player, hazard) => {
      this._hurtPlayer();
      hazard.destroy();
    });

    this.projectiles = this.physics.add.group({ allowGravity: false, immovable: true });
    this.physics.add.overlap(this.player, this.projectiles, (player, proj) => {
      this._hurtPlayer();
      proj.destroy();
    });

    if(this.levelIdx === 1) { // Level 2: Spicy Kitchen
      this.chiliTimer = this.time.addEvent({
        delay: 3000,
        callback: this._spawnChili,
        callbackScope: this,
        loop: true
      });
    }

    // level banner
    this._showBanner(`LEVEL ${this.lvDef.id} — ${this.lvDef.name}`);
  }

  /* ── show big level name banner ── */
  _showBanner(txt){
    const bg=this.add.rectangle(GW/2,GH/2,GW,70,0x000000,0.7).setScrollFactor(0).setDepth(400);
    const t=this.add.text(GW/2,GH/2,txt,{
      fontFamily:'Fredoka One,cursive', fontSize:'36px', fill:'#FFD93D',
      stroke:'#FF6B9D', strokeThickness:3
    }).setOrigin(0.5).setScrollFactor(0).setDepth(401);
    this.tweens.add({targets:[bg,t], alpha:0, duration:600, delay:1800,
      onComplete:()=>{ bg.destroy(); t.destroy(); }});
  }

  /* ════════════════════════════════════════════
     WORLD
     ════════════════════════════════════════════ */
  _buildWorld(WW){
    const H=GH, lv=this.lvDef;

    // sky gradient
    const sky=this.add.graphics();
    sky.fillGradientStyle(lv.skyTop,lv.skyTop,lv.skyBot,lv.skyBot,1);
    sky.fillRect(0,0,WW,H);

    // parallax clouds
    for(let i=0;i<Math.ceil(WW/240);i++){
      const x=i*240+Phaser.Math.Between(-40,40);
      const y=Phaser.Math.Between(30,H*0.5);
      this.add.image(x,y,'cloud')
        .setAlpha(0.14+Math.random()*0.14)
        .setScale(1+Math.random()*1.2)
        .setScrollFactor(0.18+Math.random()*0.14);
    }

    // background tiles (checkerboard, 3 colours)
    const [bk0,bk1,bk2]=lv.bgColors;
    for(let x=0;x<WW;x+=64){
      for(let y=0;y<H;y+=64){
        const k=(Math.floor(x/64)+Math.floor(y/64))%3;
        this.add.image(x+32,y+32,'bg'+[bk0,bk1,bk2][k]).setScrollFactor(0.55);
      }
    }

    // static physics groups
    this.platforms  = this.physics.add.staticGroup();
    this.spikeGroup = this.physics.add.staticGroup();

    // ── Ground (with gaps) ──
    const inGap = x => lv.gaps.some(([a,b])=> x+GT > a && x < b);
    for(let x=0; x<WW; x+=GT){
      if(!inGap(x)){
        // stack 2 tiles tall so player can't fall through on small platforms
        const g=this.platforms.create(x+GT/2, H-GT/2, 'ground');
        g.setOrigin(0.5).setScale(GT/64, 1).refreshBody();
      }
    }

    // ── Elevated platforms ──
    for(const [px,py,numTiles] of lv.platforms){
      for(let i=0;i<numTiles;i++){
        const p=this.platforms.create(px+i*PT+PT/2, py, 'platform');
        p.setOrigin(0.5).setScale(PT/64, 1).refreshBody();
      }
    }

    // ── Spikes ──
    this.movingSpikes = [];
    this.movingSpikeGroup = this.physics.add.group({ allowGravity: false, immovable: true });

    for(const sx of lv.spikes){
      if(this.levelIdx === 2) { // Level 3: Sugar Rush (horizontal moving spikes)
        const s = this.movingSpikeGroup.create(sx+32, H-GT-12, 'spikes');
        s.setOrigin(0.5).setScale(1,1);
        s.setTint(0x00FFCC); // Neon cyan
        s.startX = sx + 32;
        s.moveRange = 64; // horizontal move range
        s.moveDirection = Math.random() > 0.5 ? 1 : -1;
        s.moveSpeed = 1.2; // pixels per update
        this.movingSpikes.push(s);
      } else {
        const s = this.spikeGroup.create(sx+32, H-GT-12, 'spikes');
        s.setOrigin(0.5).setScale(1,1).refreshBody();
        if(this.levelIdx === 1) { // Level 2: Spicy Kitchen (fiery orange tint)
          s.setTint(0xFF5500);
        }
      }
    }

    // ── Goal cake (end of level) ──
    const cakeX = WW-100;
    this.cakeObj = this.physics.add.staticSprite(cakeX, H-GT-36, 'cake');
    this.cakeObj.setOrigin(0.5,1).setScale(1.1).refreshBody();
    this.tweens.add({targets:this.cakeObj, y:this.cakeObj.y-10,
      duration:950, yoyo:true, repeat:-1, ease:'Sine.easeInOut'});

    // cake glow
    this.cakeGlow=this.add.graphics();
    const drawGlow=(r)=>{
      this.cakeGlow.clear();
      this.cakeGlow.fillStyle(0xFFD93D,0.07);
      this.cakeGlow.fillCircle(cakeX, H-GT-60, 70*r);
    };
    drawGlow(1);
    this.tweens.add({targets:{v:0.9}, v:1.3, duration:1000, yoyo:true, repeat:-1,
      onUpdate:(tw,o)=>drawGlow(o.v)});
  }

  /* ════════════════════════════════════════════
     PLAYER
     ════════════════════════════════════════════ */
  _buildPlayer(){
    // scale=0.62 makes the 48px sprite ≈30px tall — fits nicely in 48px tile gap
    this.player = this.physics.add.sprite(80, GH-120, 'player_idle');
    this.player.setScale(0.62);
    this.player.setCollideWorldBounds(false);
    this.player.setGravityY(GRAVITY - 600);
    this.player.setDragX(1400);
    this.player.setDepth(20);
    // shrink physics body to match visual size
    this.player.body.setSize(28, 42).setOffset(10, 8);

    this.physics.add.collider(this.player, this.platforms, ()=>{
      this.jumpsLeft=2;
    });
    this.physics.add.overlap(this.player, this.spikeGroup, ()=>{
      if(!this.invincible) this._hurtPlayer();
    });
    this.physics.add.overlap(this.player, this.movingSpikeGroup, ()=>{
      if(!this.invincible) this._hurtPlayer();
    });
    this.physics.add.overlap(this.player, this.cakeObj, ()=>{
      if(!this.levelDone) this._completeLevel();
    });
  }

  /* ════════════════════════════════════════════
     ENEMIES
     ════════════════════════════════════════════ */
  _buildEnemies(){
    this.enemies=this.physics.add.group();

    for(const [ex,ey,type] of this.lvDef.enemies){
      const key = type==='hotdog' ? 'hotdog_enemy' : 'sushi_enemy';
      const e=this.enemies.create(ex, ey, key);
      e.setScale(0.72);
      e.enemyType = type==='hotdog' ? 'fly' : 'ground';

      // Set base speeds depending on the level
      let groundSpd = 65;
      let flySpd = 85;
      if(this.levelIdx === 1) { // Level 2
        groundSpd = 100;
        flySpd = 120;
      } else if(this.levelIdx === 2) { // Level 3
        groundSpd = 140;
        flySpd = 155;
      }

      if(e.enemyType==='ground'){
        e.setVelocityX(Math.random()>0.5 ? groundSpd : -groundSpd);
        e.setCollideWorldBounds(true).setBounceX(1);
        e.body.setSize(30,24).setOffset(4,8);
        e.baseSpeed = groundSpd;
      } else {
        // flying — counteract gravity
        e.setVelocityX(Math.random()>0.5 ? flySpd : -flySpd);
        e.setGravityY(-GRAVITY+100);
        e.setCollideWorldBounds(true).setBounceX(1);
        e.body.setSize(40,14).setOffset(4,4);
        e.baseY=ey;
        e.waveOffset=Math.random()*Math.PI*2;
        e.baseSpeed = flySpd;
        e.lastShotTime = 0;
      }
      e.setDepth(12);
    }

    this.physics.add.collider(this.enemies, this.platforms);

    this.physics.add.overlap(this.player, this.enemies, (pl, en)=>{
      if(this.invincible) return;
      const stomping = pl.body.velocity.y > 80 && pl.y < en.y - 6;
      if(stomping) this._stompEnemy(en);
      else         this._hurtPlayer();
    });
  }

  /* ════════════════════════════════════════════
     COLLECTIBLES
     ════════════════════════════════════════════ */
  _buildCollectibles(){
    this.collectibles=this.physics.add.staticGroup();

    for(const [cx,cy,type] of this.lvDef.food){
      const isCoin = type==='coin';
      const item=this.collectibles.create(cx, cy, type);
      item.itemType=type;
      item.pointVal=COLLECTIBLE_POINTS[type];
      item.setScale(isCoin ? 0.72 : 0.82).setDepth(10);

      this.tweens.add({targets:item, y:cy-9,
        duration:700+Math.random()*400, yoyo:true, repeat:-1, ease:'Sine.easeInOut',
        delay:Math.random()*600});
      if(isCoin){
        this.tweens.add({targets:item, angle:360, duration:1800, repeat:-1, ease:'Linear'});
      }
    }

    this.physics.add.overlap(this.player, this.collectibles, (_p,item)=>this._collectItem(item));
  }

  /* ════════════════════════════════════════════
     HUD
     ════════════════════════════════════════════ */
  _buildHUD(){
    const z=201;

    // score panel
    const sp=this.add.graphics().setScrollFactor(0).setDepth(200);
    sp.fillStyle(0x000000,0.5); sp.fillRoundedRect(10,10,220,52,12);
    sp.lineStyle(1.5,0xFFFFFF,0.18); sp.strokeRoundedRect(10,10,220,52,12);

    this.scoreTxt=this.add.text(22,16,'SCORE  0',{
      fontFamily:'Fredoka One,cursive', fontSize:'19px', fill:'#FFD93D',
      shadow:{blur:5,color:'#FF9F1C',fill:true}
    }).setScrollFactor(0).setDepth(z);

    this.livesTxt=this.add.text(22,37,'❤️ ❤️ ❤️',{
      fontFamily:'Nunito,sans-serif', fontSize:'15px', fontStyle:'bold', fill:'#FF6B9D'
    }).setScrollFactor(0).setDepth(z);

    // level badge
    const lbadge=this.add.graphics().setScrollFactor(0).setDepth(200);
    lbadge.fillStyle(0x000000,0.5); lbadge.fillRoundedRect(10,68,220,28,8);
    this.add.text(22,74,`LEVEL ${this.lvDef.id}: ${this.lvDef.name}`,{
      fontFamily:'Nunito,sans-serif', fontSize:'13px', fontStyle:'bold', fill:'rgba(255,255,255,0.75)'
    }).setScrollFactor(0).setDepth(z);

    // coin panel
    const cp=this.add.graphics().setScrollFactor(0).setDepth(200);
    cp.fillStyle(0x000000,0.5); cp.fillRoundedRect(GW-150,10,140,36,10);
    this.add.image(GW-138,28,'coin').setScrollFactor(0).setDepth(z).setScale(0.65);
    this.coinTxt=this.add.text(GW-122,16,'× 0',{
      fontFamily:'Fredoka One,cursive', fontSize:'17px', fill:'#FFD93D'
    }).setScrollFactor(0).setDepth(z);

    // combo text
    this.comboTxt=this.add.text(GW/2,72,'',{
      fontFamily:'Fredoka One,cursive', fontSize:'30px', fill:'#FF9F1C',
      stroke:'#FFFFFF', strokeThickness:3,
      shadow:{blur:8,color:'#FF6B9D',fill:true}
    }).setOrigin(0.5).setScrollFactor(0).setDepth(z).setAlpha(0);

    // progress bar (bottom)
    const pb=this.add.graphics().setScrollFactor(0).setDepth(200);
    pb.fillStyle(0x000000,0.45); pb.fillRoundedRect(GW/2-160,GH-22,320,14,7);
    this.add.text(GW/2-164,GH-26,'🏁',{fontSize:'14px'}).setScrollFactor(0).setDepth(z);
    this.add.image(GW/2+170,GH-15,'cake').setScrollFactor(0).setDepth(z).setScale(0.38);
    this.progressBar=this.add.graphics().setScrollFactor(0).setDepth(201);
  }

  _updateHUD(){
    this.scoreTxt.setText(`SCORE  ${this.score.toLocaleString()}`);
    const h=['💀','❤️','❤️ ❤️','❤️ ❤️ ❤️'];
    this.livesTxt.setText(h[Math.max(0,this.lives)]||'💀');
    this.coinTxt.setText(`× ${this.coins}`);

    const prog=Math.min(1, this.player.x/(this.lvDef.worldW-150));
    this.progressBar.clear();
    this.progressBar.fillStyle(0x6BCB77,1);
    this.progressBar.fillRoundedRect(GW/2-160,GH-22,320*prog,14,7);
    this.progressBar.fillStyle(0xFFFFFF,0.25);
    this.progressBar.fillRoundedRect(GW/2-160,GH-22,320*prog,5,{tl:7,tr:0,bl:0,br:0});
  }

  /* ════════════════════════════════════════════
     CONTROLS
     ════════════════════════════════════════════ */
  _buildControls(){
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wKey    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dKey    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.zKey    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.spKey   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  /* ════════════════════════════════════════════
     ACTIONS
     ════════════════════════════════════════════ */
  _stompEnemy(en){
    this.combo++;
    this.comboTimer=140;
    const pts=50*this.combo;
    this.score+=pts;
    this._popup(en.x, en.y-20, `+${pts}`, this.combo>2?'#FF6B9D':'#FFD93D');
    this._burst(en.x, en.y, 'p_star', 7);
    this.player.setVelocityY(-380);
    SFX.stomp();
    this.tweens.add({targets:en, scaleY:0.05, scaleX:1.8, alpha:0, duration:180,
      onComplete:()=>en.destroy()});
    this._updateHUD();
  }

  _collectItem(item){
    this.score   += item.pointVal;
    if(item.itemType==='coin') this.coins++;
    this._popup(item.x, item.y-22, `+${item.pointVal}`, '#FFD93D');
    this._burst(item.x, item.y, item.itemType==='coin'?'p_star':'p_heart', 5);
    SFX.coin();
    this.tweens.add({targets:item, scaleX:1.7, scaleY:1.7, alpha:0, duration:200,
      onComplete:()=>item.destroy()});
    this._updateHUD();
  }

  _hurtPlayer(){
    if(this.invincible||!this.isAlive) return;
    this.lives--;
    this.combo=0;
    this._updateHUD();
    this.invincible=true;
    SFX.hurt();
    this.cameras.main.shake(280, 0.01);
    // red flash
    const flash=this.add.rectangle(GW/2,GH/2,GW,GH,0xFF0000,0.32).setScrollFactor(0).setDepth(300);
    this.tweens.add({targets:flash,alpha:0,duration:280,onComplete:()=>flash.destroy()});
    this.player.setVelocityY(-340);
    this.player.setVelocityX(this.player.flipX ? 240:-240);
    this.tweens.add({targets:this.player,alpha:0,duration:90,yoyo:true,repeat:9,
      onComplete:()=>{ this.player.setAlpha(1); this.invincible=false; }});
    if(this.lives<=0) this.time.delayedCall(700,()=>this._gameOver());
  }

  _spawnChili() {
    if(!this.isAlive || this.levelDone) return;
    // Spawn just ahead of the player's view
    const spawnX = this.player.x + Phaser.Math.Between(220, 360);
    // Ensure we don't spawn past the end of the level
    if(spawnX > this.lvDef.worldW - 150) return;

    // Create warning graphics (vertical line + caution indicator)
    const line = this.add.graphics().setDepth(150);
    
    // Create warning text at the bottom area where the player's eyes are focused
    const textY = GH - 160;
    const warnText = this.add.text(spawnX, textY, '⚠️ DROP', {
      fontFamily: 'Fredoka One,cursive',
      fontSize: '14px',
      fill: '#FF3300',
      stroke: '#FFFFFF',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(151);

    // Blinking effect
    let blinkState = true;
    const timer = this.time.addEvent({
      delay: 150,
      repeat: 6,
      callback: () => {
        blinkState = !blinkState;
        warnText.setVisible(blinkState);
        line.clear();
        if (blinkState) {
          line.lineStyle(2, 0xFF3300, 0.6);
          // Draw dashed vertical caution line
          for (let y = 0; y < GH; y += 20) {
            line.lineBetween(spawnX, y, spawnX, y + 10);
          }
        }
      },
      callbackScope: this
    });

    // Spawn chili when the warning sequence finishes (approx 1 second)
    this.time.delayedCall(1050, () => {
      warnText.destroy();
      line.destroy();
      timer.destroy();

      if (this.isAlive && !this.levelDone) {
        const chili = this.fallingHazards.create(spawnX, -20, 'chili');
        chili.setScale(0.85);
        chili.setGravityY(350); // falls with gravity
        chili.setAngularVelocity(Phaser.Math.Between(100, 250)); // spinning!

        // Auto destroy if it somehow falls out of bounds
        this.time.delayedCall(4000, () => {
          if (chili.active) chili.destroy();
        });
      }
    });
  }

  _shootProjectile(e) {
    if(!this.isAlive || this.levelDone) return;
    // Create a sugar bullet
    const proj = this.projectiles.create(e.x, e.y, 'sugar_bullet');
    proj.setScale(1.1);

    // Calculate angle towards player
    const angle = Phaser.Math.Angle.Between(e.x, e.y, this.player.x, this.player.y);
    const speed = 240;
    proj.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    // Mini visual effect on shoot
    this._burst(e.x, e.y, 'p_sparkle', 2);

    // Auto destroy after 3.5 seconds
    this.time.delayedCall(3500, () => {
      if(proj.active) proj.destroy();
    });
  }

  _completeLevel(){
    this.levelDone=true; this.isAlive=false;
    SFX.levelup();
    this.cameras.main.shake(500,0.014);

    // confetti burst
    for(let i=0;i<40;i++){
      this.time.delayedCall(i*45,()=>{
        this._burst(
          this.cakeObj.x+Phaser.Math.Between(-70,70),
          this.cakeObj.y+Phaser.Math.Between(-60,60),
          ['p_star','p_heart','p_sparkle'][i%3], 5
        );
      });
    }

    // flash
    const flash=this.add.rectangle(GW/2,GH/2,GW,GH,0xFFFFFF,0.5).setScrollFactor(0).setDepth(300);
    this.tweens.add({targets:flash,alpha:0,duration:500,onComplete:()=>flash.destroy()});

    const hiKey='fooddash_hi';
    const hi=parseInt(localStorage.getItem(hiKey)||0);
    if(this.score>hi) localStorage.setItem(hiKey,this.score);

    const nextIdx=this.levelIdx+1;
    if(nextIdx < LEVELS.length){
      // go to next level
      data_lives=this.lives;   // persist lives
      this.time.delayedCall(2000,()=>{
        this.scene.start('LevelClearScene',{
          levelIdx: this.levelIdx,
          nextIdx:  nextIdx,
          score:    this.score,
          coins:    this.coins,
        });
      });
    } else {
      // all levels done → win screen
      this.time.delayedCall(2000,()=>{
        this.scene.start('WinScene',{score:this.score,coins:this.coins});
      });
    }
  }

  _gameOver(){
    this.isAlive=false;
    SFX.gameover();
    this.cameras.main.shake(350,0.018);
    this.time.delayedCall(1200,()=>{
      data_lives=3; // reset
      this.scene.start('GameOverScene',{score:this.score,levelIdx:this.levelIdx});
    });
  }

  /* ── particles & popups ── */
  _burst(x,y,key,n){
    for(let i=0;i<n;i++){
      const s=this.add.image(x,y,key).setDepth(50).setScale(0.8+Math.random()*0.7);
      this.tweens.add({
        targets:s,
        x:x+Phaser.Math.Between(-65,65),
        y:y+Phaser.Math.Between(-70,15),
        alpha:0, scaleX:0, scaleY:0,
        duration:380+Math.random()*280,
        ease:'Power2',
        onComplete:()=>s.destroy()
      });
    }
  }

  _popup(x,y,text,color='#FFD93D'){
    const t=this.add.text(x,y,text,{
      fontFamily:'Fredoka One,cursive', fontSize:'21px',
      fill:color, stroke:'#000000', strokeThickness:2
    }).setOrigin(0.5).setDepth(60);
    this.tweens.add({targets:t,y:y-55,alpha:0,
      duration:650,ease:'Power2',onComplete:()=>t.destroy()});
  }

  /* ════════════════════════════════════════════
     UPDATE LOOP
     ════════════════════════════════════════════ */
  update(time,delta){
    if(!this.isAlive) return;

    const pl=this.player;
    const onGround=pl.body.blocked.down;

    const goL = this.cursors.left.isDown  || this.aKey.isDown;
    const goR = this.cursors.right.isDown || this.dKey.isDown;

    if(goL){
      pl.setVelocityX(-PLAYER_SPD);
      pl.setFlipX(true);
    } else if(goR){
      pl.setVelocityX(PLAYER_SPD);
      pl.setFlipX(false);
    }

    // texture cycling
    if(!onGround){
      pl.setTexture('player_jump');
    } else if(goL||goR){
      this.walkTimer+=delta;
      if(this.walkTimer>150){
        this.walkTimer=0;
        this.walkFrame=1-this.walkFrame;
        pl.setTexture(this.walkFrame?'player_walk':'player_walk2');
      }
    } else {
      pl.setTexture('player_idle');
    }

    // jump
    const jumpJust =
      Phaser.Input.Keyboard.JustDown(this.cursors.up)||
      Phaser.Input.Keyboard.JustDown(this.wKey)||
      Phaser.Input.Keyboard.JustDown(this.zKey)||
      Phaser.Input.Keyboard.JustDown(this.spKey);

    if(jumpJust){
      if(onGround){
        pl.setVelocityY(JUMP_VEL);
        this.jumpsLeft=1;
        SFX.jump();
        this._burst(pl.x,pl.y+14,'p_sparkle',3);
      } else if(this.jumpsLeft>0){
        pl.setVelocityY(DJUMP_VEL);
        this.jumpsLeft--;
        SFX.djump();
        this._burst(pl.x,pl.y+10,'p_sparkle',5);
      }
    }

    // combo timer
    if(this.comboTimer>0){
      this.comboTimer-=delta/16;
      if(this.combo>1){
        this.comboTxt.setText(`COMBO ×${this.combo}!`).setAlpha(1);
      }
      if(this.comboTimer<=0){
        this.combo=0;
        this.tweens.add({targets:this.comboTxt,alpha:0,duration:200});
      }
    }

    // flying & ground enemies updates with custom AI and cleanup
    this.enemies.getChildren().forEach(e=>{
      // Cleanup out of bounds enemies falling into pits
      if (e.y > GH + 100) {
        e.destroy();
        return;
      }

      if(e.enemyType==='fly'){
        let waveAmp = 38;
        let waveFreq = 0.0018;
        if(this.levelIdx === 1) {
          waveAmp = 50;
          waveFreq = 0.0022;
        } else if(this.levelIdx === 2) {
          waveAmp = 60;
          waveFreq = 0.0026;
        }
        e.y=e.baseY+Math.sin(time*waveFreq+e.waveOffset)*waveAmp;
        e.body.reset(e.x,e.y);

        // Level 3 flying enemy shoots neon candy projectiles
        if(this.levelIdx === 2) {
          const dist = Phaser.Math.Distance.Between(pl.x, pl.y, e.x, e.y);
          if(dist < 380 && time - (e.lastShotTime || 0) > 1800) {
            e.lastShotTime = time;
            this._shootProjectile(e);
          }
        }
      } else if(e.enemyType==='ground') {
        // Level 2 ground enemy: Jumps reactively if player is close
        if(this.levelIdx === 1) {
          const dist = Phaser.Math.Distance.Between(pl.x, pl.y, e.x, e.y);
          if(dist < 180 && e.body.blocked.down && Math.random() < 0.02) {
            e.setVelocityY(-230);
          }
        }
        // Level 3 ground enemy: Charges at player
        else if(this.levelIdx === 2) {
          const dist = Phaser.Math.Distance.Between(pl.x, pl.y, e.x, e.y);
          if(dist < 260) {
            // charge in direction of player
            const dir = pl.x < e.x ? -1 : 1;
            e.setVelocityX(dir * 220);
            e.setTint(0xFF5555); // Red glow when angry charging
          } else {
            // standard speed, keep direction
            const currentDir = e.body.velocity.x < 0 ? -1 : 1;
            e.setVelocityX(currentDir * e.baseSpeed);
            e.clearTint();
          }
        }
      }
      e.setFlipX(e.body.velocity.x<0);
    });

    // Flicker Level 2 fiery spikes to look hot!
    if(this.levelIdx === 1 && this.spikeGroup) {
      this.spikeGroup.getChildren().forEach(s => {
        s.setAlpha(0.85 + Math.random() * 0.15);
      });
    }

    // Update moving spikes in Level 3
    if(this.levelIdx === 2 && this.movingSpikes) {
      this.movingSpikes.forEach(s => {
        s.x += s.moveSpeed * s.moveDirection;
        if(Math.abs(s.x - s.startX) > s.moveRange) {
          s.moveDirection *= -1; // Reverse direction
          s.x = s.startX + s.moveRange * s.moveDirection;
        }
        s.body.x = s.x - s.body.halfWidth;
      });
    }

    // pit death
    if(pl.y > GH+60){
      this._hurtPlayer();
      if(this.lives>0){
        pl.setPosition(80,GH-120);
        pl.setVelocity(0,0);
      }
    }

    // enemy world clamp
    this.enemies.getChildren().forEach(e=>{
      if(e.x<30) e.setVelocityX(Math.abs(e.body.velocity.x));
      if(e.x>this.lvDef.worldW-30) e.setVelocityX(-Math.abs(e.body.velocity.x));
    });

    // dust trail
    if((goL||goR)&&onGround){
      this.trailTimer+=delta;
      if(this.trailTimer>90){
        this.trailTimer=0;
        const d=this.add.image(pl.x+Phaser.Math.Between(-5,5),pl.y+16,'p_sparkle')
          .setAlpha(0.35).setScale(0.4).setDepth(5);
        this.tweens.add({targets:d,alpha:0,scaleX:0,scaleY:0,y:d.y+8,
          duration:260,onComplete:()=>d.destroy()});
      }
    } else { this.trailTimer=88; }

    this._updateHUD();
  }
}

/* lives persist across levels using a global */
let data_lives = 3;

/* ═══════════════════════════════════════════════
   LEVEL CLEAR SCENE  (between levels)
   ═══════════════════════════════════════════════ */
class LevelClearScene extends Phaser.Scene {
  constructor(){ super({key:'LevelClearScene'}); }
  init(d){
    this.fromLvIdx = d.levelIdx;
    this.nextIdx   = d.nextIdx;
    this.score     = d.score||0;
    this.coins     = d.coins||0;
  }

  create(){
    const W=GW,H=GH;
    const lv=LEVELS[this.fromLvIdx];
    const next=LEVELS[this.nextIdx];

    // gradient bg
    const bg=this.add.graphics();
    bg.fillGradientStyle(0x0A3A60,0x0A3A60,0x050A20,0x050A20,1);
    bg.fillRect(0,0,W,H);

    // stars confetti
    for(let i=0;i<35;i++){
      const s=this.add.image(Phaser.Math.Between(0,W),Phaser.Math.Between(-40,H),'p_star')
        .setScale(Math.random()*1.4+0.5).setAlpha(0.75)
        .setTint([0xFFD93D,0xFF6B9D,0x6BCB77,0x4D96FF][i%4]);
      this.tweens.add({targets:s,y:H+30,duration:Phaser.Math.Between(1800,3800),
        delay:Math.random()*2000,repeat:-1,ease:'Linear'});
    }

    // frosted panel
    const panel=this.add.graphics();
    panel.fillStyle(0xFFFFFF,0.09);
    panel.fillRoundedRect(W/2-230,H/2-190,460,380,22);
    panel.lineStyle(2,0xFFD93D,0.6);
    panel.strokeRoundedRect(W/2-230,H/2-190,460,380,22);

    this.add.text(W/2,H/2-148,'✅  LEVEL CLEAR!',{
      fontFamily:'Fredoka One,cursive', fontSize:'42px',
      fill:'#6BCB77', stroke:'#003300', strokeThickness:3,
      shadow:{blur:14,color:'#00FF88',fill:true}
    }).setOrigin(0.5);

    this.add.text(W/2,H/2-100,`Level ${lv.id}: ${lv.name}`,{
      fontFamily:'Nunito,sans-serif', fontSize:'20px', fontStyle:'bold', fill:'rgba(255,255,255,0.7)'
    }).setOrigin(0.5);

    this.add.text(W/2,H/2-58,`SCORE:  ${this.score.toLocaleString()}`,{
      fontFamily:'Fredoka One,cursive', fontSize:'30px', fill:'#FFD93D'
    }).setOrigin(0.5);

    this.add.text(W/2,H/2-18,`COINS:  ${this.coins} 🪙`,{
      fontFamily:'Nunito,sans-serif', fontSize:'18px', fontStyle:'bold', fill:'#FFD93D'
    }).setOrigin(0.5);

    // next level preview
    const nx=this.add.graphics();
    nx.fillStyle(0xFFFFFF,0.07);
    nx.fillRoundedRect(W/2-150,H/2+20,300,80,12);
    nx.lineStyle(1.5,0x4D96FF,0.5);
    nx.strokeRoundedRect(W/2-150,H/2+20,300,80,12);
    this.add.text(W/2,H/2+40,'NEXT UP',{
      fontFamily:'Nunito,sans-serif', fontSize:'12px',
      fontStyle:'bold', fill:'rgba(255,255,255,0.5)', letterSpacing:4
    }).setOrigin(0.5);
    this.add.text(W/2,H/2+68,`Level ${next.id}: ${next.name}`,{
      fontFamily:'Fredoka One,cursive', fontSize:'22px', fill:'#4D96FF'
    }).setOrigin(0.5);

    // continue button
    const by=H/2+130;
    const bg2=this.add.graphics();
    bg2.fillGradientStyle(0x6BCB77,0x6BCB77,0x30A040,0x30A040,1);
    bg2.fillRoundedRect(W/2-120,by,240,50,12);
    bg2.lineStyle(1.5,0xFFFFFF,0.3); bg2.strokeRoundedRect(W/2-120,by,240,50,12);
    const t=this.add.text(W/2,by+25,'▶  CONTINUE',{
      fontFamily:'Fredoka One,cursive', fontSize:'26px', fill:'#FFFFFF'
    }).setOrigin(0.5);
    bg2.setInteractive(new Phaser.Geom.Rectangle(W/2-120,by,240,50),Phaser.Geom.Rectangle.Contains);
    bg2.on('pointerover',()=>t.setScale(1.08));
    bg2.on('pointerout', ()=>t.setScale(1));
    bg2.on('pointerdown',()=>{
      SFX.jump();
      this.scene.start('GameScene',{levelIdx:this.nextIdx, score:this.score});
    });
    this.tweens.add({targets:t,scaleX:1.04,scaleY:1.04,duration:800,yoyo:true,repeat:-1});

    this.input.keyboard.once('keydown',()=>{
      SFX.jump();
      this.scene.start('GameScene',{levelIdx:this.nextIdx, score:this.score});
    });
  }
}

/* ═══════════════════════════════════════════════
   GAME OVER SCENE
   ═══════════════════════════════════════════════ */
class GameOverScene extends Phaser.Scene {
  constructor(){ super({key:'GameOverScene'}); }
  init(d){ this.finalScore=d.score||0; this.levelIdx=d.levelIdx||0; }

  create(){
    const W=GW,H=GH;
    const bg=this.add.graphics();
    bg.fillGradientStyle(0x3D0A0A,0x3D0A0A,0x1A0530,0x1A0530,1);
    bg.fillRect(0,0,W,H);

    for(let i=0;i<18;i++){
      const s=this.add.image(Phaser.Math.Between(0,W),Phaser.Math.Between(0,H),'p_sparkle')
        .setAlpha(0.2).setScale(Math.random()*1.5+0.5);
      this.tweens.add({targets:s,y:s.y-H,duration:Phaser.Math.Between(5000,9000),repeat:-1,delay:Math.random()*5000});
    }

    const panel=this.add.graphics();
    panel.fillStyle(0xFFFFFF,0.07);
    panel.fillRoundedRect(W/2-210,H/2-175,420,350,22);
    panel.lineStyle(2,0xFF4444,0.5);
    panel.strokeRoundedRect(W/2-210,H/2-175,420,350,22);

    this.add.text(W/2,H/2-130,'💀  GAME OVER',{
      fontFamily:'Fredoka One,cursive', fontSize:'46px',
      fill:'#FF5555', stroke:'#660000', strokeThickness:3,
      shadow:{blur:14,color:'#FF0000',fill:true}
    }).setOrigin(0.5);

    this.add.text(W/2,H/2-72,`Reached Level ${this.levelIdx+1}`,{
      fontFamily:'Nunito,sans-serif', fontSize:'17px', fontStyle:'bold', fill:'rgba(255,255,255,0.6)'
    }).setOrigin(0.5);

    this.add.text(W/2,H/2-36,`SCORE:  ${this.finalScore.toLocaleString()}`,{
      fontFamily:'Fredoka One,cursive', fontSize:'30px', fill:'#FFD93D'
    }).setOrigin(0.5);

    const hi=localStorage.getItem('fooddash_hi')||0;
    this.add.text(W/2,H/2+4,`BEST:  ${parseInt(hi).toLocaleString()}`,{
      fontFamily:'Nunito,sans-serif', fontSize:'17px', fontStyle:'bold', fill:'#6BCB77'
    }).setOrigin(0.5);

    this._btn(W/2,H/2+70,'↩  TRY SAME LEVEL',0xFF5555,0xAA1111,()=>{
      data_lives=3;
      this.scene.start('GameScene',{levelIdx:this.levelIdx,score:0});
    });
    this._btn(W/2,H/2+130,'🏠  MAIN MENU',0x4455AA,0x2233AA,()=>{
      data_lives=3;
      this.scene.start('MenuScene');
    });

    this.input.keyboard.once('keydown',()=>{
      data_lives=3;
      this.scene.start('GameScene',{levelIdx:this.levelIdx,score:0});
    });
  }

  _btn(cx,cy,label,c1,c2,cb){
    const w=220,h=46;
    const g=this.add.graphics();
    g.fillGradientStyle(c1,c1,c2,c2,1);
    g.fillRoundedRect(cx-w/2,cy-h/2,w,h,12);
    g.lineStyle(1.5,0xFFFFFF,0.2); g.strokeRoundedRect(cx-w/2,cy-h/2,w,h,12);
    const t=this.add.text(cx,cy,label,{
      fontFamily:'Fredoka One,cursive', fontSize:'21px', fill:'#FFF'
    }).setOrigin(0.5);
    g.setInteractive(new Phaser.Geom.Rectangle(cx-w/2,cy-h/2,w,h),Phaser.Geom.Rectangle.Contains);
    g.on('pointerover',()=>t.setScale(1.08)); g.on('pointerout',()=>t.setScale(1));
    g.on('pointerdown',()=>{ SFX.jump(); cb(); });
  }
}

/* ═══════════════════════════════════════════════
   WIN SCENE  (all levels complete)
   ═══════════════════════════════════════════════ */
class WinScene extends Phaser.Scene {
  constructor(){ super({key:'WinScene'}); }
  init(d){ this.finalScore=d.score||0; this.coins=d.coins||0; }

  create(){
    const W=GW,H=GH;
    const bg=this.add.graphics();
    bg.fillGradientStyle(0x0A3A1A,0x0A3A1A,0x2D0A5A,0x2D0A5A,1);
    bg.fillRect(0,0,W,H);

    // confetti
    for(let i=0;i<55;i++){
      const keys=['p_star','p_heart','p_sparkle'];
      const s=this.add.image(Phaser.Math.Between(0,W),Phaser.Math.Between(-60,H),keys[i%3])
        .setScale(Math.random()*1.4+0.5).setAlpha(0.8)
        .setTint([0xFFD93D,0xFF6B9D,0x6BCB77,0x4D96FF,0xFF9F1C][i%5]);
      this.tweens.add({targets:s,y:H+40,duration:Phaser.Math.Between(1600,4000),
        delay:Math.random()*3000,repeat:-1,ease:'Linear'});
      this.tweens.add({targets:s,x:s.x+Phaser.Math.Between(-50,50),
        duration:Phaser.Math.Between(1500,3500),yoyo:true,repeat:-1});
    }

    const panel=this.add.graphics();
    panel.fillStyle(0xFFFFFF,0.1);
    panel.fillRoundedRect(W/2-240,H/2-200,480,400,24);
    panel.lineStyle(2.5,0xFFD93D,0.75);
    panel.strokeRoundedRect(W/2-240,H/2-200,480,400,24);

    const cake=this.add.image(W/2,H/2-130,'cake').setScale(2.6);
    this.tweens.add({targets:cake,y:H/2-145,duration:950,yoyo:true,repeat:-1});
    this.tweens.add({targets:cake,angle:[-5,5],duration:1300,yoyo:true,repeat:-1});

    this.add.text(W/2,H/2-40,'🎉  ALL LEVELS CLEAR!',{
      fontFamily:'Fredoka One,cursive', fontSize:'38px',
      fill:'#FFD93D', stroke:'#FF6B9D', strokeThickness:3,
      shadow:{blur:18,color:'#FF9F1C',fill:true}
    }).setOrigin(0.5);

    this.add.text(W/2,H/2+12,`TOTAL SCORE:  ${this.finalScore.toLocaleString()}`,{
      fontFamily:'Fredoka One,cursive', fontSize:'27px', fill:'#FFFFFF'
    }).setOrigin(0.5);

    this.add.text(W/2,H/2+46,`🪙 COINS:  ${this.coins}`,{
      fontFamily:'Nunito,sans-serif', fontSize:'18px', fontStyle:'bold', fill:'#FFD93D'
    }).setOrigin(0.5);

    const hi=parseInt(localStorage.getItem('fooddash_hi')||0);
    if(this.finalScore>=hi){
      const nb=this.add.text(W/2,H/2+80,'⭐  NEW BEST SCORE!  ⭐',{
        fontFamily:'Fredoka One,cursive', fontSize:'22px', fill:'#6BCB77',
        shadow:{blur:10,color:'#00FF88',fill:true}
      }).setOrigin(0.5);
      this.tweens.add({targets:nb,scaleX:1.06,scaleY:1.06,duration:700,yoyo:true,repeat:-1});
    }

    // buttons side-by-side
    this._btn(W/2-90,H/2+148,'▶  PLAY AGAIN',0x6BCB77,0x30A040,()=>{
      data_lives=3;
      this.scene.start('GameScene',{levelIdx:0,score:0});
    });
    this._btn(W/2+90,H/2+148,'🏠  MENU',0x4D96FF,0x1A60CC,()=>{
      data_lives=3;
      this.scene.start('MenuScene');
    });
  }

  _btn(cx,cy,label,c1,c2,cb){
    const w=label.length*10+44, h=44;
    const g=this.add.graphics();
    g.fillGradientStyle(c1,c1,c2,c2,1);
    g.fillRoundedRect(cx-w/2,cy-h/2,w,h,10);
    g.lineStyle(1.5,0xFFFFFF,0.25); g.strokeRoundedRect(cx-w/2,cy-h/2,w,h,10);
    const t=this.add.text(cx,cy,label,{
      fontFamily:'Fredoka One,cursive', fontSize:'18px', fill:'#FFFFFF'
    }).setOrigin(0.5);
    g.setInteractive(new Phaser.Geom.Rectangle(cx-w/2,cy-h/2,w,h),Phaser.Geom.Rectangle.Contains);
    g.on('pointerover',()=>t.setScale(1.1)); g.on('pointerout',()=>t.setScale(1));
    g.on('pointerdown',()=>{ SFX.jump(); cb(); });
  }
}

/* ═══════════════════════════════════════════════
   PHASER CONFIG
   ═══════════════════════════════════════════════ */
const config = {
  type: Phaser.AUTO,
  width: GW, height: GH,
  parent: 'phaser-game',
  backgroundColor: '#2D0A5A',
  pixelArt: false,
  antialias: true,
  physics: {
    default: 'arcade',
    arcade: { gravity:{y:GRAVITY}, debug:false },
  },
  scene: [BootScene, MenuScene, GameScene, LevelClearScene, GameOverScene, WinScene],
};

const game = new Phaser.Game(config);