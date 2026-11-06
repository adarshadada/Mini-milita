const c=document.getElementById("game"),ctx=c.getContext("2d");
let W,H,scale=1,playing=false,botsOn=true,last=0,keys={},mouse={x:0,y:0,down:false},kills=0;
const world={w:2200,h:900},cam={x:0,y:0};
let player,bullets=[],enemies=[],particles=[],platforms=[],grenades=[];
const touch={x:0,y:0,active:false,fire:false};

function resize(){W=c.width=innerWidth;H=c.height=innerHeight;scale=Math.min(W/1100,H/600);if(!playing)drawMenuBg()}
addEventListener("resize",resize);resize();
addEventListener("keydown",e=>{keys[e.key.toLowerCase()]=1;if(e.key===" "||e.key.toLowerCase()==="w")e.preventDefault()});
addEventListener("keyup",e=>keys[e.key.toLowerCase()]=0);
c.addEventListener("mousemove",e=>{mouse.x=e.clientX;mouse.y=e.clientY});
c.addEventListener("mousedown",()=>mouse.down=true);addEventListener("mouseup",()=>mouse.down=false);

const $=id=>document.getElementById(id);
$("play").onclick=start;
$("bots").onclick=()=>{botsOn=!botsOn;$("bots").textContent="BOTS: "+(botsOn?"ON":"OFF")};

function start(){
 $("menu").style.display="none";$("hud").hidden=false;$("touch").hidden=false;playing=true;kills=0;
 platforms=[
  {x:0,y:820,w:2200,h:80},{x:220,y:650,w:300,h:25},{x:760,y:540,w:280,h:25},
  {x:1250,y:650,w:330,h:25},{x:1740,y:500,w:300,h:25},{x:520,y:390,w:240,h:25},
  {x:1020,y:320,w:260,h:25},{x:1510,y:350,w:180,h:25}
 ];
 player={x:180,y:700,vx:0,vy:0,w:34,h:50,hp:100,ammo:30,cool:0,ground:false,dir:1,grenades:3,respawn:0};
 enemies=[];bullets=[];particles=[];grenades=[];
 if(botsOn)for(let i=0;i<5;i++)spawnBot(500+i*300,700);
 requestAnimationFrame(loop);
}

function spawnBot(x,y){enemies.push({x,y,vx:0,vy:0,w:34,h:50,hp:100,cool:Math.random()*1.5,dir:-1,ground:false})}
function rectHit(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function gravity(o,dt){
 o.vy+=1200*dt;o.x+=o.vx*dt;o.y+=o.vy*dt;o.ground=false;
 for(const p of platforms)if(rectHit(o,p)&&o.vy>=0&&o.y+o.h-o.vy*dt<=p.y+5){o.y=p.y-o.h;o.vy=0;o.ground=true}
 o.x=Math.max(0,Math.min(world.w-o.w,o.x));
}
function aim(){
 const wx=mouse.x/scale+cam.x,wy=mouse.y/scale+cam.y;
 return Math.atan2(wy-(player.y+20),wx-(player.x+17));
}
function shoot(o,a,owner){
 const speed=900;bullets.push({x:o.x+o.w/2,y:o.y+20,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:4,owner});
}
function update(dt){
 if(player.respawn>0){player.respawn-=dt;if(player.respawn<=0){player.x=180;player.y=700;player.hp=100;player.ammo=30}return}
 let dx=(keys.a||keys.arrowleft?-1:0)+(keys.d||keys.arrowright?1:0);
 if(touch.active)dx=touch.x;
 player.vx=dx*300;
 if((keys.w||keys.arrowup||keys[" "]||touch.jump)&&player.ground){player.vy=-520;keys[" "]=0;touch.jump=false}
 player.dir=Math.cos(aim())>=0?1:-1;
 player.cool-=dt;
 if((mouse.down||touch.fire)&&player.cool<=0&&player.ammo>0){shoot(player,aim(),"p");player.ammo--;player.cool=.11}
 if((keys.g||touch.grenade)&&player.grenades>0){grenades.push({x:player.x+17,y:player.y+20,vx:player.dir*500,vy:-400,t:1.2,owner:"p"});player.grenades--;keys.g=0;touch.grenade=false}
 gravity(player,dt);
 for(const e of enemies){
  const d=player.x-e.x;
  e.vx=Math.sign(d)*120;e.dir=Math.sign(d)||1;e.cool-=dt;
  if(Math.abs(d)<700&&e.cool<=0){shoot(e,Math.atan2(player.y-e.y,d),e);e.cool=1.0+Math.random()*.7}
  gravity(e,dt);
 }
 for(let i=bullets.length-1;i>=0;i--){
  const b=bullets[i];b.x+=b.vx*dt;b.y+=b.vy*dt;
  if(b.x<0||b.x>world.w||b.y<0||b.y>world.h){bullets.splice(i,1);continue}
  let hit=false;
  if(b.owner==="p")for(const e of enemies)if(rectHit({x:b.x-2,y:b.y-2,w:4,h:4},e)){e.hp-=34;hit=true;if(e.hp<=0){kills++;spawnBot(1900+Math.random()*200,700)}break}
  else if(rectHit({x:b.x-2,y:b.y-2,w:4,h:4},player)){player.hp-=15;hit=true;if(player.hp<=0){player.respawn=2}}
  if(hit)bullets.splice(i,1);
 }
 for(let i=grenades.length-1;i>=0;i--){let g=grenades[i];g.vy+=900*dt;g.x+=g.vx*dt;g.y+=g.vy*dt;g.t-=dt;
  if(g.y+8>820){g.y=812;g.vy*=-.35;g.vx*=.7}
  if(g.t<=0){for(const e of enemies)if(Math.hypot(e.x-g.x,e.y-g.y)<150)e.hp-=80;if(Math.hypot(player.x-g.x,player.y-g.y)<90)player.hp-=20;grenades.splice(i,1)}
 }
 for(let i=enemies.length-1;i>=0;i--)if(enemies[i].hp<=0)enemies.splice(i,1);
 cam.x=Math.max(0,Math.min(world.w-W/scale,player.x-W/scale/2));
 cam.y=Math.max(0,Math.min(world.h-H/scale,player.y-H/scale/2));
 $("stats").textContent=`HP ${Math.max(0,player.hp)} | AMMO ${player.ammo} | GRENADES ${player.grenades} | KILLS ${kills}`;
 $("msg").textContent=player.respawn>0?"RESPAWNING...":"";
}
function draw(){
 ctx.setTransform(scale,0,0,scale,0,0);ctx.clearRect(0,0,W/scale,H/scale);
 ctx.fillStyle="#151a20";ctx.fillRect(0,0,W/scale,H/scale);
 ctx.save();ctx.translate(-cam.x,-cam.y);
 for(const p of platforms){ctx.fillStyle="#38434c";ctx.fillRect(p.x,p.y,p.w,p.h);ctx.fillStyle="#69757d";ctx.fillRect(p.x,p.y,p.w,5)}
 drawActor(player,true);for(const e of enemies)drawActor(e,false);
 ctx.fillStyle="#ffd34d";for(const b of bullets)ctx.beginPath(),ctx.arc(b.x,b.y,b.r,0,Math.PI*2),ctx.fill();
 for(const g of grenades){ctx.fillStyle="#777";ctx.beginPath();ctx.arc(g.x,g.y,9,0,Math.PI*2);ctx.fill()}
 ctx.restore();
}
function drawActor(o,me){
 ctx.fillStyle=me?"#35b8ff":"#ef5350";ctx.fillRect(o.x,o.y,o.w,o.h);
 ctx.fillStyle="#f1c27d";ctx.beginPath();ctx.arc(o.x+17,o.y+12,12,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#222";ctx.fillRect(o.x+(o.dir>0?24:-8),o.y+20,18,5);
 ctx.fillStyle="#222";ctx.fillRect(o.x+6,o.y+35,7,15);ctx.fillRect(o.x+21,o.y+35,7,15);
 ctx.fillStyle="#111";ctx.fillRect(o.x,o.y-10,o.w,4);ctx.fillStyle="#4caf50";ctx.fillRect(o.x,o.y-10,o.w*Math.max(0,o.hp)/100,4);
}
function loop(t){if(!playing)return;let dt=Math.min(.033,(t-last)/1000||0);last=t;update(dt);draw();requestAnimationFrame(loop)}
function drawMenuBg(){ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle="#111";ctx.fillRect(0,0,W,H)}
$("jump").ontouchstart=e=>{e.preventDefault();touch.jump=true};
$("fire").ontouchstart=e=>{e.preventDefault();touch.fire=true};$("fire").ontouchend=()=>touch.fire=false;
$("grenade").ontouchstart=e=>{e.preventDefault();touch.grenade=true};
$("move").ontouchmove=e=>{const r=e.currentTarget.getBoundingClientRect(),t=e.touches[0];touch.active=true;touch.x=Math.max(-1,Math.min(1,(t.clientX-(r.left+r.width/2))/(r.width/2)))};
$("move").ontouchend=()=>{touch.active=false;touch.x=0};
