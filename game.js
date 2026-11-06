const c=document.getElementById('game'),ctx=c.getContext('2d');
let W,H,dpr=1,keys={},mouse={x:0,y:0,down:false},paused=false;
const gravity=.55, world={w:2600,h:1200};
let score=0, camera={x:0,y:0};
const player={x:300,y:700,w:34,h:48,vx:0,vy:0,hp:100,ammo:12,weapon:0,cool:0,ground:false,respawn:0};
const weapons=[
 {name:'Pistol',damage:18,rate:18,speed:12,mag:12},
 {name:'SMG',damage:9,rate:5,speed:14,mag:30},
 {name:'Blaster',damage:40,rate:30,speed:10,mag:5}
];
let bots=[
 {x:900,y:500,w:34,h:46,vx:0,vy:0,hp:60,ground:false,dir:-1,cool:50},
 {x:1500,y:350,w:34,h:46,vx:0,vy:0,hp:60,ground:false,dir:1,cool:80},
 {x:2050,y:700,w:34,h:46,vx:0,vy:0,hp:60,ground:false,dir:-1,cool:60}
];
let bullets=[],particles=[],pickups=[
 {x:700,y:500,type:'ammo'},{x:1250,y:700,type:'heal'},{x:1800,y:400,type:'ammo'}
];
const platforms=[
{x:0,y:1050,w:2600,h:150},{x:150,y:850,w:430,h:30},{x:760,y:720,w:360,h:30},
{x:1300,y:850,w:420,h:30},{x:1850,y:650,w:500,h:30},{x:500,y:560,w:300,h:25},
{x:1100,y:470,w:350,h:25},{x:1650,y:430,w:330,h:25},{x:2150,y:300,w:300,h:25}
];
function resize(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}addEventListener('resize',resize);resize();
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key==='p')paused=!paused;if(e.key.toLowerCase()==='r')player.ammo=weapons[player.weapon].mag; if(['1','2','3'].includes(e.key))player.weapon=+e.key-1});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY});addEventListener('mousedown',()=>mouse.down=true);addEventListener('mouseup',()=>mouse.down=false);
function bindTouch(){document.querySelectorAll('#touch button[data-key]').forEach(b=>{let k=b.dataset.key;b.onpointerdown=e=>{e.preventDefault();keys[k]=true};b.onpointerup=b.onpointercancel=()=>keys[k]=false});let f=document.getElementById('fire');f.onpointerdown=()=>mouse.down=true;f.onpointerup=f.onpointercancel=()=>mouse.down=false}bindTouch();
function rectHit(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function collide(o){o.ground=false;for(const p of platforms){if(rectHit(o,p)&&o.vy>=0&&o.y+o.h-o.vy<=p.y+5){o.y=p.y-o.h;o.vy=0;o.ground=true}}if(o.y>world.h){o.y=0;o.vy=0}}
function shoot(x,y,tx,ty,owner){let w=weapons[owner.weapon];if(owner.ammo<=0)return;owner.ammo--;let a=Math.atan2(ty-y,tx-x);bullets.push({x,y,vx:Math.cos(a)*w.speed,vy:Math.sin(a)*w.speed,damage:w.damage,life:100,team:owner===player?'p':'b'});}
function particle(x,y){particles.push({x,y,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,life:20})}
function respawn(){player.x=300;player.y=700;player.hp=100;player.ammo=weapons[player.weapon].mag}
function update(){
if(paused)return;
player.vx=(keys.a?-3.8:0)+(keys.d?3.8:0);if(keys.w&&player.ground){player.vy=-11;keys.w=false}player.vy+=gravity;player.x+=player.vx;player.y+=player.vy;collide(player);player.x=Math.max(0,Math.min(world.w-player.w,player.x));
if(player.cool>0)player.cool--;let w=weapons[player.weapon];if(mouse.down&&player.cool<=0){shoot(player.x+17,player.y+22,mouse.x+camera.x,mouse.y+camera.y,player);player.cool=w.rate}
for(const b of bots){b.vy+=gravity;b.x+=b.dir*1.1;b.y+=b.vy;collide(b);if(b.x<100||b.x>world.w-100)b.dir*=-1;if(--b.cool<=0){b.cool=70+Math.random()*70;shoot(b.x+17,b.y+20,player.x,player.y,b)}}
for(const q of bullets){q.x+=q.vx;q.y+=q.vy;q.life--;for(const b of bots)if(q.team==='p'&&rectHit({x:q.x-3,y:q.y-3,w:6,h:6},b)){b.hp-=q.damage;q.life=0;for(let i=0;i<4;i++)particle(q.x,q.y);if(b.hp<=0){score+=100;b.x=1800+Math.random()*400;b.y=250;b.hp=60}}if(q.team==='b'&&rectHit({x:q.x-3,y:q.y-3,w:6,h:6},player)){player.hp-=q.damage;q.life=0;if(player.hp<=0){score=Math.max(0,score-25);respawn()}}}bullets=bullets.filter(q=>q.life>0&&q.x>-50&&q.x<world.w+50&&q.y>-50&&q.y<world.h+50);
for(const p of pickups){if(Math.hypot(player.x-p.x,player.y-p.y)<45){if(p.type==='heal')player.hp=Math.min(100,player.hp+30);else player.ammo=weapons[player.weapon].mag;p.x=300+Math.random()*2100;p.y=250+Math.random()*600}}
for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.life--}particles=particles.filter(p=>p.life>0);
camera.x=Math.max(0,Math.min(world.w-W,player.x-W/2));camera.y=Math.max(0,Math.min(world.h-H,player.y-H/2))
}
function draw(){
ctx.clearRect(0,0,W,H);ctx.save();ctx.translate(-camera.x,-camera.y);
for(let x=0;x<world.w;x+=100)for(let y=0;y<world.h;y+=100){ctx.fillStyle=((x/100+y/100)%2?'#172b3e':'#15273a');ctx.fillRect(x,y,100,100)}
for(const p of platforms){ctx.fillStyle='#42596c';ctx.fillRect(p.x,p.y,p.w,p.h);ctx.fillStyle='#6c8ba0';ctx.fillRect(p.x,p.y,p.w,5)}
for(const q of pickups){ctx.fillStyle=q.type==='heal'?'#42d66b':'#ffd34e';ctx.beginPath();ctx.arc(q.x,q.y,13,0,Math.PI*2);ctx.fill()}
drawChar(player,'#42a5ff');for(const b of bots)drawChar(b,'#ff5d67');
ctx.fillStyle='#ffe27a';for(const q of bullets){ctx.beginPath();ctx.arc(q.x,q.y,4,0,Math.PI*2);ctx.fill()}
for(const p of particles){ctx.globalAlpha=p.life/20;ctx.fillStyle='#fff';ctx.fillRect(p.x,p.y,3,3);ctx.globalAlpha=1}
ctx.restore();
document.getElementById('hp').textContent=Math.max(0,Math.round(player.hp));document.getElementById('ammo').textContent=player.ammo;document.getElementById('score').textContent=score;
if(paused){ctx.fillStyle='#0008';ctx.fillRect(0,0,W,H);ctx.fillStyle='#fff';ctx.font='32px Arial';ctx.textAlign='center';ctx.fillText('PAUSED',W/2,H/2)}
}
function drawChar(o,color){ctx.fillStyle=color;ctx.fillRect(o.x,o.y,o.w,o.h);ctx.fillStyle='#f3c7a6';ctx.beginPath();ctx.arc(o.x+17,o.y+12,10,0,Math.PI*2);ctx.fill();ctx.fillStyle='#202a34';ctx.fillRect(o.x+8,o.y+25,18,4)}
function loop(){update();draw();requestAnimationFrame(loop)}loop();
