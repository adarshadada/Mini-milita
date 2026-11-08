'use strict';
const cv=document.getElementById('c'),g=cv.getContext('2d'),$=id=>document.getElementById(id);
let WW=2800,WH=1100;const VH=520,rnd=Math.random,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const SUPABASE_URL='https://nnjekivahsvdwjjdzisf.supabase.co',SUPABASE_KEY='sb_publishable_3cx0KeGDrm0TY5kdKpgGgg_4pElQRrw';
let W,H,S,VW,DPR=1;
function rs(){DPR=window.devicePixelRatio||1;W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;S=cv.height/VH;VW=cv.width/S}
rs();addEventListener('resize',rs);
// ---- map: [x,y,w,h]
const MAPS=[
{id:'high',n:'Highlands',ww:2800,wh:1100,sky:['#5fb3e8','#d6ecf5'],far:['#9bbdb0','#6f9a85'],sun:'#fff6c8',cloud:'#ffffffcc',pl:['#5aa84a','#46883a','#7a5a3c','#00000026'],kill:0,fric:.75,gp:[[450,1020],[1250,1020],[2050,1020]],
plats:[[0,1040,2800,60],[300,900,300,22],[700,800,260,22],[1100,900,300,22],[1500,780,300,22],[1900,900,260,22],[2250,780,300,22],[500,640,220,22],[1000,600,260,22],[1500,540,260,22],[2000,620,240,22],[150,960,100,80],[1350,960,100,80],[2550,960,100,80],[800,960,60,80]]},
{id:'desert',n:'Desert Dunes',ww:3000,wh:1100,sky:['#f2c46b','#fbe9bf'],far:['#e0b070','#c98f52'],sun:'#fff1b0',cloud:'#fff4d6aa',pl:['#e3c27a','#cfa95c','#b98a4d','#00000022'],kill:0,fric:.75,gp:[[500,1020],[1500,1020],[2500,1020]],
plats:[[0,1040,3000,60],[200,900,260,22],[620,780,300,22],[1050,880,240,22],[1450,740,300,22],[1900,860,260,22],[2300,720,280,22],[2650,880,240,22],[500,600,200,20],[1250,560,260,20],[1750,580,220,20],[2150,540,200,20],[900,960,70,80],[1700,960,70,80]]},
{id:'ice',n:'Frozen Peaks',ww:2800,wh:1100,sky:['#9fd0f0','#eaf6ff'],far:['#c5dff0','#9bc3e0'],sun:'#ffffff',cloud:'#ffffffdd',pl:['#f4fbff','#cfe7f5','#7fb2d6','#ffffff30'],kill:0,fric:.94,gp:[[700,1020],[1700,1020]],
plats:[[0,1040,2800,60],[250,920,260,20],[650,820,240,20],[1050,900,260,20],[1450,760,280,20],[1850,880,260,20],[2200,780,260,20],[450,660,200,18],[900,600,240,18],[1400,540,240,18],[1900,620,220,18],[300,960,80,80],[1250,960,80,80],[2450,960,80,80]]},
{id:'lava',n:'Volcano',ww:2800,wh:1100,sky:['#3a0f14','#a8321c'],far:['#4a1a1a','#2e0f12'],sun:'#ff7a3a',cloud:'#2a1010aa',pl:['#7a7a7a','#4a4a4a','#2e2a2a','#00000040'],kill:1040,liq:['#ff5a1f','#ffb347'],fric:.75,gp:[],
plats:[[100,900,300,22],[520,820,220,22],[860,900,260,22],[1220,780,260,22],[1580,900,260,22],[1940,800,220,22],[2300,900,300,22],[350,660,200,20],[800,600,220,20],[1300,540,240,20],[1800,620,220,20],[2250,640,200,20]]},
{id:'sea',n:'Corsair Seas',ww:3000,wh:1100,sky:['#ff9a5a','#ffe0a8'],far:['#2a6f7a','#1d5059'],sun:'#ffd27a',cloud:'#ffe9c8cc',pl:['#d9ad6a','#b08545','#6b4423','#00000030'],kill:1010,liq:['#2a7fb5','#7fd0f0'],fric:.8,gp:[],
plats:[[150,860,520,24],[250,740,220,20],[360,600,120,16],[1000,880,560,24],[1100,760,240,20],[1180,610,110,16],[1850,860,520,24],[1950,740,230,20],[2060,600,120,16],[700,700,140,18],[1650,720,140,18],[2550,820,300,24],[2650,700,110,18],[0,920,130,24]],
decor:[['hull',140,884,540,90],['hull',990,904,580,90],['hull',1840,884,540,90],['sail',340,620,140,130],['sail',1160,630,140,130],['sail',2050,620,140,130],['mast',407,540,320],['mast',1232,550,330],['mast',2118,540,320],['flag',413,540],['flag',1238,550],['flag',2124,540]]}];
let MAP,MAPD;
function loadMap(id){MAPD=MAPS.find(m=>m.id===id)||MAPS[0];MAP=MAPD.plats;WW=MAPD.ww;WH=MAPD.wh}
loadMap('high');
const WP={
pistol:{n:'Pistol',ab:'PI',dmg:14,rate:16,mag:12,spd:14,spread:.02,rl:55,pel:1,life:60,kick:.3,len:12},
ak:{n:'AK-47',ab:'AK',dmg:9,rate:5,mag:30,spd:15,spread:.06,rl:85,pel:1,life:60,kick:.25,len:24},
shotgun:{n:'Shotgun',ab:'SG',dmg:9,rate:42,mag:6,spd:13,spread:.16,rl:100,pel:7,life:22,kick:2.2,len:24},
sniper:{n:'Sniper',ab:'SN',dmg:75,rate:75,mag:5,spd:32,spread:0,rl:120,pel:1,life:70,kick:3,len:34},
rocket:{n:'Rocket launcher',ab:'RL',dmg:0,rate:70,mag:2,spd:9,spread:0,rl:120,pel:1,life:200,kick:2.5,len:28,rocket:1}};
const D={easy:{aim:.05,jit:.12},normal:{aim:.09,jit:.06},hard:{aim:.16,jit:.025}};
const TYPES=['med','gren','med'],rk=s=>TYPES[(Math.imul((s|0)+1,2654435761)>>>8)%TYPES.length];
let PL=[],B=[],G=[],P=[],EX=[],KF=[],PK=[],me=null,state='menu',T=0,TARGET=15,DIFF=D.normal,sh=0,flash=0,hm=0;
const cam={x:0,y:0};let online=false,lastSlot=-1,SURV=false,wave=0,user=null,god=false,godPref=false,TEAMS=false,outShots=[],dropN=0;const TC=['#2f6fe0','#d9382c'],TN=['Blue','Red'];const addKF=m=>{KF.unshift({t:m,ttl:300});KF.length=Math.min(KF.length,4)};
// ---- sound
let ac;function snd(f,d,t='square',v=.04,f2){try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),n=ac.createGain(),a=ac.currentTime;
o.type=t;o.frequency.setValueAtTime(f,a);o.frequency.exponentialRampToValueAtTime(f2||f/3,a+d);n.gain.setValueAtTime(v,a);n.gain.exponentialRampToValueAtTime(.001,a+d);o.connect(n);n.connect(ac.destination);o.start();o.stop(a+d)}catch(e){}}
const near=o=>!me||Math.abs(o.x-me.x)<800;
// ---- entities
const ov=(a,p)=>a.x<p[0]+p[2]&&a.x+a.w>p[0]&&a.y<p[1]+p[3]&&a.y+a.h>p[1];
const gun=k=>({k,ammo:WP[k].mag,res:WP[k].mag*3}),cw=o=>o.wp[o.cur];
function mk(name,bot,col){return{name,bot,col,x:0,y:0,vx:0,vy:0,w:18,h:34,hp:100,fuel:100,wp:[gun('pistol')],cur:0,aim:0,dir:1,cd:0,rl:0,gren:3,mh:100,mf:100,g0:3,spd:1,rlm:1,dm:1,team:-1,lo:'',av:0,pw:'',pcd:0,arm:0,kills:0,deaths:0,dead:0,rs:0,inv:0,on:0,fl:0,wk:0,jf:0,c:{mx:0,up:0,aim:0,fire:0},ai:{t:0,dir:1,low:0}}}
function spawn(o){let best=null,bd=-1;for(let i=0;i<6;i++){const p=MAP[rnd()*MAP.length|0];if(p[2]<150)continue;const x=p[0]+20+rnd()*(p[2]-60),y=p[1]-40;let d=1e9;
for(const q of PL)if(q!==o&&!q.dead)d=Math.min(d,Math.hypot(q.x-x,q.y-y));if(d>bd){bd=d;best=[x,y]}}
if(!best)best=[100,1000];Object.assign(o,{x:best[0],y:best[1],vx:0,vy:0,hp:o.mh,fuel:o.mf,pcd:0,arm:0,dead:0,inv:120,cur:o.lo?1:0,rl:0,gren:o.g0,wp:o.lo?[gun('pistol'),gun(o.lo)]:[gun('pistol')]})}
function move(o){o.vy=Math.min(o.vy+.45,14);o.x+=o.vx;for(const p of MAP)if(ov(o,p)){o.x=o.vx>0?p[0]-o.w:p[0]+p[2];o.vx=0}
o.on=0;o.y+=o.vy;for(const p of MAP)if(ov(o,p)){if(o.vy>0){o.y=p[1]-o.h;o.on=1}else o.y=p[1]+p[3];o.vy=0}
o.x=clamp(o.x,0,WW-o.w);if(o.y<0){o.y=0;o.vy=Math.max(o.vy,0)}}
function pt(x,y,n,c,sp,l,gv=0){for(let i=0;i<n&&P.length<700;i++)P.push({x,y,vx:(rnd()-.5)*sp,vy:(rnd()-.5)*sp,l:l*(.5+rnd()),m:l,c,g:gv})}
const shake=v=>sh=Math.max(sh,v);
// ---- combat
function fireBullets(o,k,ox,oy,aim,dm=1){const d=WP[k];for(let i=0;i<d.pel;i++){const a=aim+(rnd()-.5)*2*d.spread,l=d.rocket?16:d.len+2;
B.push({x:ox+Math.cos(aim)*l,y:oy+Math.sin(aim)*l,vx:Math.cos(a)*d.spd,vy:Math.sin(a)*d.spd,o,d:d.dmg*dm,l:d.life,r:d.rocket,big:d.dmg>40})}}
function reload(o){const w=cw(o),d=WP[w.k];if(o.rl>0||w.ammo>=d.mag||w.res<=0)return;o.rl=Math.round(d.rl*o.rlm);if(o===me)snd(300,.15,'square',.03,500)}
function swap(o){if(o.dead||o.wp.length<2)return;o.cur=1-o.cur;o.rl=0;o.cd=15}
function gren(o){if(o.dead||o.gren<=0)return;o.gren--;const n={x:o.x+9,y:o.y+10,vx:Math.cos(o.aim)*8+o.vx,vy:Math.sin(o.aim)*8-1.5,t:110,o};G.push(n);if(online&&o===me)send({t:'g',id:myId,x:n.x,y:n.y,vx:n.vx,vy:n.vy})}
function shoot(o){const w=cw(o),d=WP[w.k];if(w.ammo<=0){reload(o);return}w.ammo--;o.cd=d.rate;o.fl=4;
fireBullets(o,w.k,o.x+9,o.y+13,o.aim,o.dm);if(online&&o===me)outShots.push([w.k,+o.x.toFixed(1),+o.y.toFixed(1),+o.aim.toFixed(3),+o.dm.toFixed(2)]);
o.vx-=Math.cos(o.aim)*d.kick;o.vy-=Math.sin(o.aim)*d.kick*.4;
pt(o.x+9,o.y+12,1,'#d9b94a',3,25,.3);
if(near(o)){snd(w.k==='sniper'?160:w.k==='shotgun'?110:220,.12,'sawtooth',.05)}if(o===me)shake(d.kick*1.4);
if(w.ammo<=0)reload(o)}
function hit(q,d,by,kx=0){if(by===me&&q!==me)hm=10;if(q.remote||q.dead||q.inv>0||(q===me&&god))return;q.hp-=d*(q.arm>0?.3:1);q.vx+=kx;if(q===me)flash=14;if(q.hp<=0)die(q,by)}
function die(q,by){q.dead=1;q.rs=q===me?180:150;q.deaths++;const k=by&&by!==q;if(k&&!by.remote)by.kills++;const msg=k?by.name+' killed '+q.name:q.name+' fell';addKF(msg);if(k&&by===me)banner('Eliminated '+q.name);if(online&&q===me)send({t:'d',m:msg,kid:k?by.id:null});
pt(q.x+9,q.y+17,40,'#b00',9,40,.25);pt(q.x+9,q.y+17,14,q.col,7,40,.25);snd(120,.3,'sawtooth',.06,30);

if(k)checkWin()}
function boom(x,y,r,d,by){for(const q of PL){if(q.dead||q.remote||(TEAMS&&q!==by&&q.team===by.team))continue;const cx=q.x+9,cy=q.y+17,dist=Math.hypot(cx-x,cy-y);
if(dist<r){const f=1-dist/r,ux=(cx-x)/(dist||1),uy=(cy-y)/(dist||1);hit(q,d*f,by,ux*f*9);q.vy+=uy*f*9-2*f}}
pt(x,y,50,'#ff9a2e',12,30);pt(x,y,25,'#555',6,55,-.05);EX.push({x,y,r:0,m:r,l:14});shake(14);if(near({x}))snd(90,.45,'sawtooth',.09,25)}
function over(){}
// ---- special powers (rubber-style abilities)
const PW={jab:{n:'Stretch Jab',cd:70,price:2500,d:'Fire a long stretching punch that hits the first enemy in line.'},
rocket:{n:'Rubber Rocket',cd:360,price:5000,d:'Launch a giant fist that explodes on impact.'},
dash:{n:'Elastic Dash',cd:150,price:2000,d:'Snap forward in the direction you aim and dodge hits for a moment.'},
sling:{n:'Sky Sling',cd:200,price:1500,d:'Spring yourself high into the air.'},
armor:{n:'Bounce Armor',cd:600,price:3500,d:'Take 70% less damage for 5 seconds.'}};
let ARMS=[],FT=[],BN={t:'',l:0};const ft=(x,y,t,c)=>FT.push({x,y,t,c,l:60}),banner=t=>{BN.t=t;BN.l=120};
function usePower(o){if(!o||o.dead||state!=='play')return;
if(o===me){if(!o.pw){FT.length=0;ft(o.x+9,o.y-14,'No power equipped. Get one in Shop, then Powers.','#ffb0a0');return}
 if(!POWERS){FT.length=0;ft(o.x+9,o.y-14,'Powers are off in this room','#ffb0a0');return}
 if(o.pcd>0){FT.length=0;ft(o.x+9,o.y-14,'Power ready in '+Math.ceil(o.pcd/60)+'s','#ffd54a');return}}
if(!o.pw||o.pcd>0||!POWERS)return;o.pcd=PW[o.pw].cd;firePower(o,o.pw);
if(online&&o===me)send({t:'pw',id:myId,k:o.pw,x:+o.x.toFixed(1),y:+o.y.toFixed(1),a:+o.aim.toFixed(3)})}
function firePower(o,k){const a=o.aim,ca=Math.cos(a),sa=Math.sin(a),ox=o.x+9,oy=o.y+14;
if(k==='jab'){let ex=ox,ey=oy,t=null;for(let i=0;i<70&&!t;i++){ex+=ca*8;ey+=sa*8;
if(MAP.some(p=>ex>p[0]&&ex<p[0]+p[2]&&ey>p[1]&&ey<p[1]+p[3]))break;
for(const q of PL)if(q!==o&&!q.dead&&!(o.remote&&q.remote)&&!(TEAMS&&q.team===o.team)&&ex>q.x-4&&ex<q.x+q.w+4&&ey>q.y-4&&ey<q.y+q.h+4){t=q;break}}
ARMS.push({o,x2:ex,y2:ey,l:12});pt(ex,ey,8,'#fff',6,14);if(t){hit(t,45,o,ca*5);t.vy-=2;if(o===me)shake(6)}}
else if(k==='rocket'){B.push({x:ox+ca*18,y:oy+sa*18,vx:ca*11,vy:sa*11,o,d:0,l:140,r:1,fist:1,br:120,bd:130})}
else if(k==='dash'&&!o.remote){o.vx=ca*13;o.vy=sa*7-1;o.inv=Math.max(o.inv,25);pt(o.x+9,o.y+17,14,'#fff',8,16)}
else if(k==='sling'&&!o.remote){o.vy=-15;pt(o.x+9,o.y+30,14,'#fff',8,16)}
else if(k==='armor'){o.arm=300;pt(o.x+9,o.y+17,16,'#ffd54a',8,20)}}
// ---- updates
function upd(o){const c=o.c;o.inv>0&&o.inv--;o.pcd>0&&o.pcd--;o.arm>0&&o.arm--;o.fl>0&&o.fl--;o.cd>0&&o.cd--;
o.aim=c.aim;o.dir=Math.cos(o.aim)<0?-1:1;
if(Math.abs(o.vx)<4*o.spd)o.vx+=c.mx*(o.on?.7:.4)*o.spd;o.vx*=o.on&&!c.mx?MAPD.fric:.97;
if(c.up&&o.fuel>0){o.vy=Math.max(o.vy-.85,-6.5);o.fuel-=.7;o.jf=1;if(T%2)pt(o.x+(o.dir>0?5:13),o.y+24,1,'#ffa030',2,14,.1)}
else{o.jf=0;o.fuel=Math.min(o.mf,o.fuel+(o.on?1.4:.12))}
move(o);if(o.on)o.wk+=Math.abs(o.vx)*.15;
if(o.rl>0&&--o.rl===0){const w=cw(o),n=Math.min(WP[w.k].mag-w.ammo,w.res);w.ammo+=n;w.res-=n}
if(c.fire&&o.cd<=0&&o.rl<=0)shoot(o);if(o.y>WH+50||(MAPD.kill&&o.y+o.h>MAPD.kill)){if(o===me&&god){o.y=0;o.vy=0}else hit(o,999,null)}}
function los(a,b){const x1=a.x+9,y1=a.y+13,x2=b.x+9,y2=b.y+13;for(let i=1;i<14;i++){const x=x1+(x2-x1)*i/14,y=y1+(y2-y1)*i/14;for(const p of MAP)if(x>p[0]&&x<p[0]+p[2]&&y>p[1]&&y<p[1]+p[3])return 0}return 1}
function ai(o){const c=o.c,a=o.ai;let t=null,bd=1e9;for(const q of PL)if(q!==o&&!q.dead&&!(TEAMS&&q.team===o.team)){const d=Math.hypot(q.x-o.x,q.y-o.y);if(d<bd){bd=d;t=q}}
c.fire=0;c.up=0;c.mx=0;if(!t)return;
const dx=t.x-o.x,dy=t.y-o.y;let df=Math.atan2(dy-4,dx)-o.aim;df=Math.atan2(Math.sin(df),Math.cos(df));c.aim=o.aim+df*DIFF.aim+(rnd()-.5)*DIFF.jit;
const see=los(o,t);if(--a.t<=0){a.t=40+rnd()*80;a.dir=rnd()<.5?-1:1}
if(see){c.mx=bd>320?Math.sign(dx):bd<140?-Math.sign(dx):a.dir*.7;c.fire=bd<650&&Math.abs(df)<.2?1:0}else c.mx=Math.sign(dx)||1;
if(dy<-40&&o.fuel>8)c.up=1;if(Math.abs(o.vx)<.4&&c.mx&&o.fuel>5)c.up=1;
if(o.fuel<10)a.low=1;if(o.fuel>50)a.low=0;if(a.low)c.up=0;if(MAPD.kill&&o.y+o.h>MAPD.kill-110&&o.fuel>5)c.up=1;
if(see&&bd>150&&bd<400&&rnd()<.004)gren(o);
if(cw(o).k==='pistol'&&o.wp.length>1&&rnd()<.02)swap(o);
if(o.pw&&o.pcd<=0){if(o.pw==='armor'){if(o.hp<55)usePower(o)}else if(see&&Math.abs(df)<.15&&bd<520&&rnd()<.03)usePower(o)}
const wq=cw(o),need=o.hp<45?p=>p.k==='med':(wq.ammo+wq.res<25?p=>p.k==='ammo':null);
if(need){let m=null,md=900;for(const p of PK)if(!p.t&&need(p)){const d=Math.abs(p.x-o.x)+Math.abs(p.y-o.y);if(d<md){md=d;m=p}}
if(m){c.mx=Math.sign(m.x-o.x);if(m.y<o.y-20&&o.fuel>8)c.up=1}}}
function spawnAirdrop(slot){const h=Math.imul(slot+7,2654435761)>>>8,cand=MAP.filter(p=>p[2]>=140),pl=cand[h%cand.length],x=pl[0]+20+((h>>>3)%Math.max(1,pl[2]-64));
PK.push({x,y:-50,w:24,h:18,vx:0,vy:0,on:0,k:'ammo',t:0,drop:1,ttl:2400,air:1,id:'a'+slot});addKF('Ammo drop incoming')}
function take(q,p){if(p.k==='ammo'){let need=q.gren<5;for(const w of q.wp){const m=WP[w.k].mag;if(w.ammo<m||w.res<m*3)need=true}if(!need)return 0;
for(const w of q.wp){const m=WP[w.k].mag;w.ammo=m;w.res=m*3}q.gren=Math.min(5,q.gren+2);q.rl=0;if(q===me)snd(500,.1,'square',.04,900);return 1}
if(p.k==='med'){if(q.hp>=q.mh)return 0;q.hp=Math.min(q.mh,q.hp+50);return 1}
if(p.k==='gren'){if(q.gren>=5)return 0;q.gren=Math.min(5,q.gren+2);return 1}
const h=q.wp.find(w=>w.k===p.k);if(h){h.res+=WP[p.k].mag*2}else if(q.wp.length<2){q.wp.push(gun(p.k));q.cur=1;q.rl=0}else{q.wp[q.cur]=gun(p.k);q.rl=0}
if(q===me)snd(500,.1,'square',.04,900);return 1}
function tick(){T++;{const sl=Math.floor(Date.now()/20000);if(sl!==lastSlot){if(lastSlot>=0&&AIRDROP)spawnAirdrop(sl);lastSlot=sl}}if(god&&!canGod()){god=false;$('god').checked=false;$('godSw').hidden=true;addKF('Admin power expired')}
if(god&&me&&!me.dead)me.hp=me.mh;pctl();
for(const o of PL){if(o.remote){remoteStep(o);continue}if(o.dead){if(!SURV&&--o.rs<=0)spawn(o);continue}if(o.bot)ai(o);upd(o)}
for(const b of B){for(let s=0;s<3&&b.l>0;s++){b.x+=b.vx/3;b.y+=b.vy/3;if(b.x<0||b.x>WW||b.y>WH||b.y<-100){b.l=0;break}
let hw=0;for(const p of MAP)if(b.x>p[0]&&b.x<p[0]+p[2]&&b.y>p[1]&&b.y<p[1]+p[3]){hw=1;break}
if(hw){b.l=0;if(b.r)boom(b.x-b.vx/3,b.y-b.vy/3,b.br||95,b.bd||110,b.o);else pt(b.x,b.y,5,'#ffd27a',4,12);break}
for(const q of PL)if(q!==b.o&&!q.dead&&!(b.o.remote&&q.remote)&&!(TEAMS&&q.team===b.o.team)&&b.x>q.x&&b.x<q.x+q.w&&b.y>q.y&&b.y<q.y+q.h){b.l=0;if(b.r)boom(b.x,b.y,b.br||95,b.bd||110,b.o);else{hit(q,b.d*(b.y<q.y+9?1.5:1),b.o,b.vx*.05);pt(b.x,b.y,6,'#c00',4,20,.2)}break}}
b.l--;if(b.r)pt(b.x,b.y,1,'#bbb',1.5,20)}
B=B.filter(b=>b.l>0);
for(const n of G){n.vy+=.4;const bx={x:n.x-3,y:n.y-3,w:6,h:6};n.x+=n.vx;bx.x=n.x-3;if(MAP.some(p=>ov(bx,p))){n.x-=n.vx;n.vx*=-.5}
n.y+=n.vy;bx.y=n.y-3;bx.x=n.x-3;if(MAP.some(p=>ov(bx,p))){n.y-=n.vy;n.vy*=-.45;n.vx*=.8}if(--n.t<=0)boom(n.x,n.y,105,95,n.o)}
G=G.filter(n=>n.t>0);
for(const p of PK){if(p.air){p.y+=1.4;if(MAP.some(q=>ov(p,q))||p.y>WH){p.air=0;p.vy=0}}else move(p);if(p.y>WH+60)p.gone=1;if(p.t>0){if(--p.t===0)p.k=rk(p.seed+=7);continue}if(p.drop&&--p.ttl<0){p.gone=1;continue}
for(const q of PL)if(!q.dead&&!q.remote&&ov(q,[p.x,p.y,p.w,p.h])&&take(q,p)){if(q===me)ft(p.x,p.y-10,p.k==='med'?'+ Health':p.k==='gren'?'+ Grenades':'Ammo refilled',p.k==='med'?'#6bff8a':'#ffcf4a');if(p.drop)p.gone=1;else p.t=800;if(online)send({t:'k',id:p.id});break}}
PK=PK.filter(p=>!p.gone);
for(const p of P){p.vx*=.98;p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.l--}P=P.filter(p=>p.l>0);
for(const e of EX){e.r+=(e.m-e.r)*.35;e.l--}EX=EX.filter(e=>e.l>0);
for(const a of ARMS)a.l--;ARMS=ARMS.filter(a=>a.l>0);for(const f of FT)f.l--;FT=FT.filter(f=>f.l>0);BN.l>0&&BN.l--;for(const k of KF)k.ttl--;KF=KF.filter(k=>k.ttl>0);
const tx=clamp(me.x+9-VW/2+Math.cos(me.aim)*60,0,Math.max(0,WW-VW)),ty=clamp(me.y-VH/2+60+Math.sin(me.aim)*40,0,WH-VH);cam.x+=(tx-cam.x)*.1;cam.y+=(ty-cam.y)*.1;
netTick();sh*=.88;flash>0&&flash--;hm>0&&hm--}
// ---- input
const key={};let mx=0,my=0,md=0,touchUse=false;const tp={};
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT')return;key[e.code]=1;if(e.code==='KeyF')toggleFS();if(e.code==='KeyV'&&VOICE.on)$('mute').click();if(e.code==='KeyU'&&canGod()&&state==='play'){god=!god;godPref=god;$('god').checked=god}if(!me||state!=='play')return;if(e.code==='KeyG')gren(me);if(e.code==='KeyR')reload(me);if(e.code==='KeyQ')swap(me);if(e.code==='KeyE')usePower(me);if(e.code==='Space'||e.code.startsWith('Arrow'))e.preventDefault()});
addEventListener('keyup',e=>key[e.code]=0);
cv.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){if(e.button===0)md=1;if(e.button===2&&me&&state==='play')usePower(me);return}touchUse=true;const s=e.clientX<W/2?'L':'R';
if(!tp[s]){tp[s]={id:e.pointerId,ox:e.clientX,oy:e.clientY,x:e.clientX,y:e.clientY};cv.setPointerCapture&&cv.setPointerCapture(e.pointerId)}});
cv.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){mx=e.clientX;my=e.clientY;return}for(const s in tp)if(tp[s].id===e.pointerId){tp[s].x=e.clientX;tp[s].y=e.clientY}});
const pu=e=>{if(e.pointerType==='mouse'){md=0;return}for(const s in tp)if(tp[s].id===e.pointerId)delete tp[s]};
cv.addEventListener('pointerup',pu);cv.addEventListener('pointercancel',pu);
cv.addEventListener('contextmenu',e=>e.preventDefault());
[['bG',()=>gren(me)],['bS',()=>swap(me)],['bR',()=>reload(me)],['bP',()=>usePower(me)]].forEach(([id,f])=>{$(id).onpointerdown=e=>{e.preventDefault();touchUse=true;if(state==='play')f()}});
function pctl(){const c=me.c;let m=(key.KeyD||key.ArrowRight?1:0)-(key.KeyA||key.ArrowLeft?1:0),up=!!(key.KeyW||key.Space||key.ArrowUp),fire=!!md,aim=null;
if(!touchUse)aim=Math.atan2(cam.y+my*DPR/S-(me.y+13),cam.x+mx*DPR/S-(me.x+9));
const L=tp.L,R=tp.R;if(L){const dx=L.x-L.ox,dy=L.y-L.oy;m=Math.abs(dx)>10?clamp(dx/50,-1,1):0;up=dy<-25}
if(R){const dx=R.x-R.ox,dy=R.y-R.oy,l=Math.hypot(dx,dy);if(l>8)aim=Math.atan2(dy,dx);fire=l>45}
c.mx=m;c.up=up;c.fire=fire;if(aim!==null)c.aim=aim}
// ---- drawing
function bg(){g.setTransform(1,0,0,1,0,0);const gr=g.createLinearGradient(0,0,0,cv.height);gr.addColorStop(0,MAPD.sky[0]);gr.addColorStop(1,MAPD.sky[1]);g.fillStyle=gr;g.fillRect(0,0,cv.width,cv.height);
g.setTransform(S,0,0,S,0,0);g.fillStyle=MAPD.sun;g.beginPath();g.arc(VW-110,80,34,0,7);g.fill();
g.fillStyle=MAPD.cloud;for(let i=0;i<9;i++){const L=VW+400,x=((i*330-cam.x*.15)%L+L)%L-200,y=40+(i*53)%150;g.beginPath();g.ellipse(x,y,50,16,0,0,7);g.ellipse(x+30,y-8,34,14,0,0,7);g.fill()}
[[.2,MAPD.far[0],470],[.4,MAPD.far[1],500]].forEach(([f,col,base])=>{g.fillStyle=col;const by=base-cam.y*.25,o=cam.x*f,k=Math.floor(o/260);
for(let i=-1;i<VW/260+2;i++){const idx=i+k,h=90+(((idx*7919)%60)+60)%60,bx=i*260-(o%260);g.beginPath();g.moveTo(bx-30,by+40);g.lineTo(bx+130,by-h);g.lineTo(bx+290,by+40);g.fill()}g.fillRect(0,by+30,VW,600)})}
function plat(p){const xs=Math.max(p[0],cam.x-30),xe=Math.min(p[0]+p[2],cam.x+VW+30);if(xe<=xs||p[1]>cam.y+VH+60||p[1]+p[3]<cam.y)return;
const PC=MAPD.pl;g.fillStyle=PC[2];g.fillRect(xs,p[1],xe-xs,p[3]);g.fillStyle=PC[0];g.fillRect(xs,p[1],xe-xs,7);g.fillStyle=PC[1];g.fillRect(xs,p[1]+7,xe-xs,3);
g.fillStyle=PC[3];const y1=Math.min(p[1]+p[3],cam.y+VH+20);for(let y=p[1]+16;y<y1;y+=16)for(let x=Math.floor(xs/32)*32+((y/16)%2?16:0);x<xe;x+=32)if(x>=p[0]&&x+12<=p[0]+p[2])g.fillRect(x,y,12,4)}
function drawGrenade(c,x,y,s,rot){c.save();c.translate(x,y);c.rotate(rot||0);c.scale(s,s);
c.fillStyle='#3f5d2b';c.beginPath();c.ellipse(0,2,8,9.5,0,0,7);c.fill();
c.strokeStyle='#26401a';c.lineWidth=1.2;c.beginPath();c.moveTo(-8,2);c.lineTo(8,2);c.moveTo(0,-7.5);c.lineTo(0,11.5);c.moveTo(-5.5,-3);c.quadraticCurveTo(0,0,5.5,-3);c.moveTo(-5.5,7);c.quadraticCurveTo(0,10,5.5,7);c.stroke();
c.fillStyle='#ffffff33';c.beginPath();c.ellipse(-3,-1,2,4,0,0,7);c.fill();
c.fillStyle='#8a8f94';c.fillRect(-3.5,-11,7,4.5);c.strokeStyle='#8a8f94';c.lineWidth=2;c.beginPath();c.moveTo(3.5,-9);c.quadraticCurveTo(10,-10,10,-3);c.stroke();
c.strokeStyle='#d8c88a';c.lineWidth=1.3;c.beginPath();c.arc(-6,-10,3,0,7);c.stroke();c.restore()}
const OWNER='wagleadarsha12@gmail.com';
const RANKS=[{n:'Recruit',x:0},{n:'Private',x:100},{n:'Corporal',x:300},{n:'Sergeant',x:600},{n:'Lieutenant',x:1000},{n:'Captain',x:1600},{n:'Major',x:2400},{n:'Colonel',x:3500},{n:'General',x:5000},{n:'Legend',x:7500}];
const rankIdx=xp=>{let r=0;RANKS.forEach((k,i)=>{if(xp>=k.x)r=i});return r};
const myRank=()=>isAdmin()?99:rankIdx(UP.xp||0);
function drawRank(c,x,y,r,idx){c.save();
if(idx===99){c.fillStyle='#ffd54a';c.beginPath();c.arc(x,y,r,0,7);c.fill();c.strokeStyle='#7a5a00';c.lineWidth=1;c.stroke();c.fillStyle='#7a3b00';c.beginPath();c.moveTo(x-r*.6,y+r*.4);c.lineTo(x-r*.6,y-r*.4);c.lineTo(x-r*.25,y);c.lineTo(x,y-r*.55);c.lineTo(x+r*.25,y);c.lineTo(x+r*.6,y-r*.4);c.lineTo(x+r*.6,y+r*.4);c.closePath();c.fill()}
else{c.fillStyle=idx>=9?'#4fd8ff':idx>=7?'#ffd54a':idx>=4?'#c8d0d8':idx>=1?'#c9803a':'#7d8a6a';c.beginPath();c.arc(x,y,r,0,7);c.fill();c.fillStyle='#10160a';c.font='bold '+Math.round(r*1.25)+'px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(idx+1,x,y+.5)}c.restore()}
function drawFT(){for(const f of FT){g.globalAlpha=Math.min(1,f.l/20);g.fillStyle=f.c;g.font='bold 13px sans-serif';g.textAlign='center';g.fillText(f.t,f.x,f.y-(60-f.l)*.6)}g.globalAlpha=1}
function drawDecor(){for(const d of MAPD.decor||[]){const x=d[1],y=d[2];
if(d[0]==='hull'){g.fillStyle='#4a2f17';g.beginPath();g.moveTo(x,y);g.lineTo(x+d[3],y);g.lineTo(x+d[3]-50,y+d[4]);g.lineTo(x+50,y+d[4]);g.closePath();g.fill();g.fillStyle='#00000030';g.fillRect(x+30,y+30,d[3]-60,4);g.fillRect(x+45,y+55,d[3]-90,4)}
else if(d[0]==='mast'){g.fillStyle='#4a2f17';g.fillRect(x,y,6,d[3])}
else if(d[0]==='sail'){const w=d[3],h=d[4];g.fillStyle='#f3ead0';g.strokeStyle='#bfae82';g.lineWidth=2;g.beginPath();g.moveTo(x,y);g.lineTo(x+w,y+4);g.quadraticCurveTo(x+w+12,y+h/2,x+w-4,y+h);g.lineTo(x+2,y+h-6);g.quadraticCurveTo(x-10,y+h/2,x,y);g.fill();g.stroke()}
else if(d[0]==='flag'){g.fillStyle='#111';g.fillRect(x,y,34,22);g.fillStyle='#fff';g.beginPath();g.arc(x+17,y+9,5,0,7);g.fill();g.fillRect(x+8,y+16,18,2.5)}}}
function drawFx(){for(const a of ARMS){const sk=(AV[a.o.av|0]||AV[0]).s,ox=a.o.x+9,oy=a.o.y+14;g.strokeStyle=sk;g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(ox,oy);g.lineTo(a.x2,a.y2);g.stroke();g.lineCap='butt';g.fillStyle=sk;g.beginPath();g.arc(a.x2,a.y2,8,0,7);g.fill();g.strokeStyle='#0003';g.lineWidth=1.5;g.stroke()}
const k=MAPD.kill;if(!k)return;const x0=cam.x-20,x1=cam.x+VW+20,c=MAPD.liq;
g.fillStyle=c[0]+'cc';g.beginPath();g.moveTo(x0,WH+120);for(let x=x0;x<=x1;x+=16)g.lineTo(x,k+Math.sin((x+T*2)*.03)*5);g.lineTo(x1,WH+120);g.closePath();g.fill();
g.fillStyle=c[1]+'55';g.beginPath();g.moveTo(x0,WH+120);for(let x=x0;x<=x1;x+=16)g.lineTo(x,k+10+Math.sin((x-T*3)*.02)*6);g.lineTo(x1,WH+120);g.closePath();g.fill()}
function drawP(o){if(o.dead)return;const d=o.dir,w=cw(o),L=WP[w.k].len,sw=o.on?Math.sin(o.wk)*7:3;g.save();g.translate(o.x+9,o.y);if(o.inv>0&&T%8<4)g.globalAlpha=.4;
if(o===me?god:o.god){g.strokeStyle='rgba(120,220,255,'+(.55+.3*Math.sin(T*.15))+')';g.lineWidth=2;g.beginPath();g.ellipse(0,18,17,25,0,0,7);g.stroke()}
if(o.arm>0){g.strokeStyle='rgba(255,213,74,.85)';g.lineWidth=3;g.beginPath();g.ellipse(0,18,20,28,0,0,7);g.stroke()}
if(o===me?isAdmin():o.rk===99){g.fillStyle='#ffd54a';g.beginPath();g.moveTo(-6,-6);g.lineTo(-6,-13);g.lineTo(-3,-9);g.lineTo(0,-15);g.lineTo(3,-9);g.lineTo(6,-13);g.lineTo(6,-6);g.closePath();g.fill()}
g.fillStyle='#555';g.fillRect(d>0?-13:7,8,6,15);
if(o.jf){g.fillStyle='#ff9a2e';const fx=d>0?-10:10,fl=9+rnd()*8;g.beginPath();g.moveTo(fx-3,23);g.lineTo(fx+3,23);g.lineTo(fx,23+fl);g.fill()}
g.strokeStyle='#222';g.lineWidth=4;g.beginPath();g.moveTo(-3,24);g.lineTo(-3+sw,34);g.moveTo(3,24);g.lineTo(3-sw,34);g.stroke();
const av=AV[o.av|0]||AV[0];g.fillStyle=TEAMS?o.col:av.b;g.fillRect(-7,8,14,17);headGfx(g,av,d);
g.translate(0,14);g.rotate(o.aim);if(d<0)g.scale(1,-1);
g.fillStyle='#222';g.fillRect(2,-3,L,5);g.fillStyle='#444';g.fillRect(2,-3,L*.4,8);g.strokeStyle=av.s;g.lineWidth=3;g.beginPath();g.moveTo(0,0);g.lineTo(9,0);g.stroke();
if(o.fl>0){g.fillStyle='#ffe27a';g.beginPath();g.arc(L+6,0,5,0,7);g.fill()}
g.restore();
if(o!==me){g.fillStyle='#0008';g.fillRect(o.x-2,o.y-9,22,4);g.fillStyle=o.col;g.fillRect(o.x-1,o.y-8,20*Math.max(0,o.hp)/100,2);g.fillStyle=o.rk===99?'#ffd54a':TEAMS?TC[o.team]:'#fff';g.font='bold 10px sans-serif';g.textAlign='center';if(o.rk!=null)drawRank(g,o.x+9-g.measureText(o.name).width/2-8,o.y-16,5,o.rk);g.fillText(o.name,o.x+9,o.y-13)}
if((o===me?VOICE.me:VOICE.talk[o.id]||0)>T-14){g.fillStyle='#4cff7a';g.beginPath();g.arc(o.x+9,o.y-(o===me?10:25),3.5,0,7);g.fill()}}
function world(){const sx=(rnd()-.5)*sh,sy=(rnd()-.5)*sh;g.setTransform(S,0,0,S,0,0);g.translate(-cam.x+sx,-cam.y+sy);
drawDecor();MAP.forEach(plat);
for(const p of PK){if(p.t>0)continue;const y=p.y+(p.drop?0:Math.sin(T*.08+p.x)*2);
if(p.k==='gren'){g.fillStyle='#ffd54a30';g.beginPath();g.arc(p.x+10,y+8,12,0,7);g.fill();drawGrenade(g,p.x+10,y+8,1.1,Math.sin(T*.05+p.x)*.2);continue}
if(p.k==='ammo'){if(p.air){const cx=p.x+12;g.fillStyle='#e8e2c8';g.beginPath();g.arc(cx,y-22,26,Math.PI,0);g.closePath();g.fill();g.fillStyle='#d9382c';g.beginPath();g.moveTo(cx,y-22);g.arc(cx,y-22,26,Math.PI*1.34,Math.PI*1.66);g.closePath();g.fill();
g.strokeStyle='#555';g.lineWidth=1;g.beginPath();g.moveTo(cx-26,y-22);g.lineTo(cx-12,y);g.moveTo(cx+26,y-22);g.lineTo(cx+12,y);g.moveTo(cx,y-22);g.lineTo(cx,y);g.stroke()}
g.fillStyle='#6b4a22';g.fillRect(p.x,y,24,18);g.fillStyle='#ffcf4a';g.fillRect(p.x,y+7,24,4);g.strokeStyle='#222';g.lineWidth=1.5;g.strokeRect(p.x,y,24,18);g.fillStyle='#222';for(let i=0;i<3;i++)g.fillRect(p.x+5+i*6,y+2,3,4);continue}
g.fillStyle='#f4f4f4';g.fillRect(p.x,y,20,16);g.strokeStyle='#222';g.lineWidth=1.5;g.strokeRect(p.x,y,20,16);g.fillStyle='#d22';g.fillRect(p.x+8,y+3,4,10);g.fillRect(p.x+5,y+6,10,4)}
for(const o of PL)drawP(o);drawFx();drawFT();
for(const b of B){if(b.fist){const ox=b.o.x+9,oy=b.o.y+14,sk=(AV[b.o.av|0]||AV[0]).s;g.strokeStyle=sk;g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(ox,oy);g.lineTo(b.x,b.y);g.stroke();g.lineCap='butt';g.fillStyle=sk;g.beginPath();g.arc(b.x,b.y,9,0,7);g.fill();g.strokeStyle='#0003';g.lineWidth=1.5;g.stroke();continue}if(b.r){g.fillStyle='#ddd';g.fillRect(b.x-5,b.y-2,10,4);g.fillStyle='#e33';g.fillRect(b.x+(b.vx>0?3:-5),b.y-2,3,4)}else{g.strokeStyle=b.big?'#fff':'#ffe27a';g.lineWidth=b.big?2.5:1.8;g.beginPath();g.moveTo(b.x-b.vx*1.3,b.y-b.vy*1.3);g.lineTo(b.x,b.y);g.stroke()}}
for(const n of G){drawGrenade(g,n.x,n.y,.7,T*.2*(n.vx>=0?1:-1));if(n.t<35&&n.t%8<4){g.fillStyle='#ff3b30aa';g.beginPath();g.arc(n.x,n.y,9,0,7);g.fill()}}
for(const e of EX){g.fillStyle=`rgba(255,${150+e.l*6},50,${e.l/20})`;g.beginPath();g.arc(e.x,e.y,e.r,0,7);g.fill()}
for(const p of P){g.globalAlpha=Math.min(1,p.l/p.m*1.5);g.fillStyle=p.c;g.fillRect(p.x,p.y,3,3)}g.globalAlpha=1}
function rr(x,y,w,h,r,f){g.fillStyle=f;g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();g.fill()}
const nameCol=n=>{const o=PL.find(q=>q.name===n);return o?(o===me?'#ffd54a':o.col):'#fff'};
function bar(x,y,w,h,v,c1,c2){rr(x,y,w,h,h/2,'#00000080');const fw=Math.max(0,Math.min(1,v))*(w-2);if(fw>1){const gr=g.createLinearGradient(x,0,x+w,0);gr.addColorStop(0,c1);gr.addColorStop(1,c2);rr(x+1,y+1,Math.max(h-2,fw),h-2,(h-2)/2,gr)}}
function drawGunIcon(k,x,y,s){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#d8c88a';
if(k==='pistol'){g.fillRect(-10,-4,18,6);g.fillRect(-6,2,6,9)}
else if(k==='ak'){g.fillRect(-18,-3,36,5);g.fillRect(-22,-4,8,9);g.fillRect(-2,2,5,11);g.fillRect(6,2,8,3)}
else if(k==='shotgun'){g.fillRect(-18,-4,38,3);g.fillRect(-18,0,32,3);g.fillRect(-23,-4,9,9)}
else if(k==='sniper'){g.fillRect(-20,-2,42,4);g.fillRect(-4,-9,11,4);g.fillRect(-25,-3,9,9)}
else{g.fillRect(-17,-6,32,10);g.fillStyle='#ff9a2e';g.fillRect(15,-6,5,10)}g.restore()}
function drawPowerIcon(k,cx,cy,col){g.strokeStyle=col;g.fillStyle=col;g.lineWidth=3;g.lineCap='round';g.beginPath();
if(k==='jab'){g.moveTo(cx-10,cy);g.lineTo(cx+3,cy);g.stroke();g.beginPath();g.arc(cx+8,cy,5,0,7);g.fill()}
else if(k==='rocket'){g.moveTo(cx-11,cy);g.lineTo(cx-3,cy);g.stroke();g.beginPath();g.arc(cx+3,cy,8,0,7);g.fill()}
else if(k==='dash'){g.moveTo(cx-9,cy-7);g.lineTo(cx-2,cy);g.lineTo(cx-9,cy+7);g.moveTo(cx+1,cy-7);g.lineTo(cx+8,cy);g.lineTo(cx+1,cy+7);g.stroke()}
else if(k==='sling'){g.moveTo(cx,cy+9);g.lineTo(cx,cy-9);g.moveTo(cx-6,cy-3);g.lineTo(cx,cy-9);g.lineTo(cx+6,cy-3);g.stroke()}
else{g.moveTo(cx-8,cy-8);g.lineTo(cx+8,cy-8);g.lineTo(cx+8,cy+1);g.quadraticCurveTo(cx+8,cy+8,cx,cy+11);g.quadraticCurveTo(cx-8,cy+8,cx-8,cy+1);g.closePath();g.stroke()}g.lineCap='butt'}
function hud(){g.setTransform(DPR,0,0,DPR,0,0);if(state==='menu'||!me)return;const PN='#141b0ec4',small=W<640;
if(me.hp/me.mh<.3&&!me.dead){const gr=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.85);gr.addColorStop(0,'rgba(200,0,0,0)');gr.addColorStop(1,'rgba(200,0,0,'+(.25+.15*Math.sin(T*.2))+')');g.fillStyle=gr;g.fillRect(0,0,W,H)}
if(flash>0){g.fillStyle=`rgba(200,0,0,${flash/45})`;g.fillRect(0,0,W,H)}
const av=AV[me.av|0]||AV[0],hpf=me.hp/me.mh,lowhp=hpf<.3&&T%30<15,ff=me.fuel/me.mf;
rr(10,10,220,62,14,PN);
g.save();g.beginPath();g.arc(41,41,22,0,7);g.clip();g.fillStyle='#ffffff14';g.fillRect(19,19,44,44);g.translate(41,34);g.scale(1.7,1.7);headGfx(g,av,1);g.restore();
g.strokeStyle=god?'#7fe3ff':TEAMS?TC[me.team]:'#ff9a2e';g.lineWidth=2.5;g.beginPath();g.arc(41,41,22,0,7);g.stroke();
g.textAlign='left';g.fillStyle='#fff';g.font='bold 12px sans-serif';drawRank(g,81,22,7,myRank());g.fillStyle=isAdmin()?'#ffd54a':'#fff';g.fillText(me.name.slice(0,12),92,26);
bar(74,32,148,12,hpf,lowhp?'#ff9a90':'#e5483a',lowhp?'#ff3b30':'#ff7a5a');
g.fillStyle='#fff';g.font='bold 9px sans-serif';g.textAlign='right';g.fillText(Math.max(0,Math.ceil(me.hp)),218,41);
bar(74,50,148,8,ff,ff<.2?'#ff7a3a':'#f0b429',ff<.2?'#ff3b30':'#ffd45a');
const tt=[0,0];if(TEAMS)for(const o of PL)if(o.team>=0)tt[o.team]+=o.kills;
const s=[...PL].sort((a,b)=>TEAMS?(a.team-b.team||b.kills-a.kills):b.kills-a.kills),sw=small?152:178,sx=W-sw-10,rows=Math.min(s.length,small?4:7),sh2=32+rows*18;rr(sx,10,sw,sh2,14,PN);
g.textAlign='left';g.font='11px sans-serif';g.fillStyle='#cfc79f';g.fillText(SURV?'Wave '+wave+', your kills '+me.kills:TEAMS?'Blue '+tt[0]+'   Red '+tt[1]+'   to '+TARGET:(online?'Room '+roomCode+', ':'')+'first to '+TARGET,sx+12,28);
s.slice(0,rows).forEach((o,i)=>{const y=50+i*18;if(o===me)rr(sx+6,y-13,sw-12,17,6,'#ffd54a24');g.textAlign='left';g.fillStyle='#ffffff70';g.font='10px sans-serif';g.fillText(i+1,sx+12,y);
g.fillStyle=o.col;g.fillRect(sx+25,y-9,8,8);g.fillStyle=o===me?'#ffd54a':'#fff';g.font='bold 12px sans-serif';g.fillText(o.name.slice(0,9),sx+39,y);if(o===me||o.rk!=null)drawRank(g,sx+sw-36,y-4,6,o===me?myRank():o.rk);g.textAlign='right';g.fillText(o.kills,sx+sw-12,y)});
g.font='bold 12px sans-serif';KF.forEach((k,i)=>{const y=34+sh2+i*21,m=k.t.split(' killed ');g.globalAlpha=Math.min(1,k.ttl/60);g.textAlign='left';
if(m.length===2){const w1=g.measureText(m[0]).width,wm=g.measureText(' killed ').width,w2=g.measureText(m[1]).width,tw=w1+wm+w2+18;rr(W-12-tw,y-13,tw,19,9,PN);let x=W-12-tw+9;g.fillStyle=nameCol(m[0]);g.fillText(m[0],x,y);x+=w1;g.fillStyle='#cfc79f';g.fillText(' killed ',x,y);x+=wm;g.fillStyle=nameCol(m[1]);g.fillText(m[1],x,y)}
else{const tw=g.measureText(k.t).width+18;rr(W-12-tw,y-13,tw,19,9,PN);g.fillStyle='#fff';g.fillText(k.t,W-12-tw+9,y)}});g.globalAlpha=1;
const bw=small?100:150,bh=bw*.45,bx=W/2-bw/2,k=bw/WW;rr(bx,8,bw,bh,8,PN);g.fillStyle='#8fd18a';
for(const p of MAP)g.fillRect(bx+p[0]*k,8+p[1]*k,Math.max(1.5,p[2]*k),Math.max(1.5,p[3]*k));
for(const p of PK)if(p.k==='ammo'&&!p.t){g.fillStyle='#ffcf4a';g.fillRect(bx+p.x*k-2,8+p.y*k-2,4,4)}
for(const o of PL)if(!o.dead){g.fillStyle=o===me?'#fff':o.col;g.fillRect(bx+o.x*k-1.5,8+o.y*k-1.5,3,3)}
g.strokeStyle='#ffffff55';g.lineWidth=1;g.strokeRect(bx+cam.x*k,8+cam.y*k,VW*k,VH*k);
const sec=Math.floor(T/60);g.fillStyle='#ffffffb0';g.font='bold 11px sans-serif';g.textAlign='center';g.fillText(Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0'),W/2,8+bh+15);
const w=cw(me),d=WP[w.k],pc=me.pw?PW[me.pw]:null,dh=54,dy=H-dh-10,gw=76,ww=small?190:236,pw2=118,gap=8,tot=gw+gap+ww+gap+pw2;let dx=W/2-tot/2;
if(god){rr(W/2-48,dy-30,96,22,8,PN);g.fillStyle='#7fe3ff';g.font='bold 11px sans-serif';g.textAlign='center';g.fillText('UNKILLABLE',W/2,dy-15)}
if(!isAdmin()&&tempLeft()>0){const tl=Math.ceil(tempLeft());rr(W/2-62,dy-56,124,22,8,PN);g.fillStyle='#ffd54a';g.font='bold 11px sans-serif';g.textAlign='center';g.fillText('TEMP ADMIN '+Math.floor(tl/60)+':'+String(tl%60).padStart(2,'0'),W/2,dy-41)}
rr(dx,dy,gw,dh,14,PN);drawGrenade(g,dx+24,dy+28,1.2,0);g.fillStyle='#fff';g.font='bold 17px sans-serif';g.textAlign='left';g.fillText('x '+me.gren,dx+43,dy+34);
dx+=gw+gap;rr(dx,dy,ww,dh,14,PN);drawGunIcon(w.k,dx+31,dy+25,1.1);g.textAlign='left';g.font='bold 11px sans-serif';g.fillStyle='#d8c88a';g.fillText(d.n,dx+64,dy+19);
g.textAlign='right';g.font='bold 26px sans-serif';g.fillStyle=me.rl>0?'#ff9a2e':w.ammo<=Math.max(2,d.mag*.2)?'#ff6a5a':'#fff';g.fillText(me.rl>0?'..':w.ammo,dx+ww-54,dy+31);g.font='13px sans-serif';g.fillStyle='#cfc79f';g.fillText('/ '+w.res,dx+ww-12,dy+31);
if(me.rl>0)bar(dx+64,dy+38,ww-78,7,1-me.rl/d.rl,'#ff9a2e','#ffd45a');else bar(dx+64,dy+38,ww-78,7,w.ammo/d.mag,'#cfc79f','#ffffff');
dx+=ww+gap;rr(dx,dy,pw2,dh,14,PN);if(!pc){g.textAlign='left';g.fillStyle='#d8c88a';g.font='bold 11px sans-serif';g.fillText('No power',dx+12,dy+23);g.fillStyle='#cfc79f';g.font='10px sans-serif';g.fillText('Equip one in Shop',dx+12,dy+39)}
if(pc){const cx=dx+31,cy=dy+27,cd=me.pcd>0;g.fillStyle='#0006';g.beginPath();g.arc(cx,cy,20,0,7);g.fill();
g.strokeStyle=cd?'#ff9a2e':'#7fe3ff';g.lineWidth=3;g.beginPath();g.arc(cx,cy,20,-Math.PI/2,-Math.PI/2+Math.PI*2*(cd?1-me.pcd/pc.cd:1));g.stroke();
drawPowerIcon(me.pw,cx,cy,cd?'#ffb870':'#bff2ff');g.textAlign='left';g.font='bold 11px sans-serif';g.fillStyle='#d8c88a';g.fillText(pc.n.split(' ')[1]||pc.n,dx+58,dy+23);g.font='11px sans-serif';g.fillStyle=cd?'#ff9a2e':'#7fe3ff';g.fillText(cd?Math.ceil(me.pcd/60)+'s':touchUse?'Ready':'Press E',dx+58,dy+39)}
if(BN.l>0){g.globalAlpha=Math.min(1,BN.l/30);g.textAlign='center';g.font='bold 24px sans-serif';g.lineWidth=4;g.strokeStyle='#000b';g.strokeText(BN.t,W/2,H*.4);g.fillStyle='#fff';g.fillText(BN.t,W/2,H*.4);g.globalAlpha=1}
if(me.dead){g.fillStyle='#0000004d';g.fillRect(0,0,W,H);g.fillStyle='#fff';g.font='bold 26px sans-serif';g.textAlign='center';if(!SURV)g.fillText('Respawning in '+Math.ceil(me.rs/60),W/2,H/2)}
if(!touchUse){g.strokeStyle=hm>0?'#f33':'#fff';g.lineWidth=2;g.beginPath();g.arc(mx,my,8,0,7);g.moveTo(mx-13,my);g.lineTo(mx-5,my);g.moveTo(mx+5,my);g.lineTo(mx+13,my);g.moveTo(mx,my-13);g.lineTo(mx,my-5);g.moveTo(mx,my+5);g.lineTo(mx,my+13);g.stroke()}
for(const s2 in tp){const t=tp[s2];let dx2=t.x-t.ox,dy2=t.y-t.oy;const l=Math.hypot(dx2,dy2);if(l>50){dx2*=50/l;dy2*=50/l}
g.strokeStyle='#ffffff66';g.lineWidth=3;g.beginPath();g.arc(t.ox,t.oy,50,0,7);g.stroke();g.fillStyle='#ffffff99';g.beginPath();g.arc(t.ox+dx2,t.oy+dy2,20,0,7);g.fill()}}
// ---- network (Supabase Realtime broadcast, publishable key only)
const myId=Math.random().toString(36).slice(2,10);let sb=null,ch=null,roomCode='lobby';
const send=p=>{if(ch)try{ch.send({type:'broadcast',event:'e',payload:p})}catch(e){}};
function sendState(){const c=cw(me),f=(v,n)=>+v.toFixed(n);send({t:'s',id:myId,n:me.name,c:me.col,x:f(me.x,1),y:f(me.y,1),vx:f(me.vx,2),vy:f(me.vy,2),a:f(me.aim,3),h:Math.round(me.hp/me.mh*100),tm:me.team,gd:god?1:0,av:me.av,rk:myRank(),d:me.dead,k:me.kills,dd:me.deaths,w:c.k,jf:me.jf,on:me.on,inv:me.inv>0?1:0,sh:outShots.length?outShots:undefined});outShots=[]}
function mkRemote(id,n,c){const o=mk(n,0,c);o.remote=1;o.id=id;o.seen=performance.now();o.dead=1;o.tx=0;o.ty=0;return o}
function remoteStep(o){o.fl>0&&o.fl--;o.arm>0&&o.arm--;if(o.dead)return;if(performance.now()-o.seen>250){o.vx=0;o.vy=0}
o.tx+=o.vx;o.ty+=o.vy;o.x+=(o.tx-o.x)*.3;o.y+=(o.ty-o.y)*.3;if(Math.abs(o.tx-o.x)>250){o.x=o.tx;o.y=o.ty}
if(o.on)o.wk+=Math.abs(o.vx)*.15;if(o.jf&&T%2)pt(o.x+(o.dir>0?5:13),o.y+24,1,'#ffa030',2,14,.1)}
function onMsg(p){if(state!=='play'||!p||!me)return;
if(p.t==='s'){if(p.id===myId)return;let o=PL.find(q=>q.id===p.id);
if(!o){o=mkRemote(p.id,p.n,p.c);o.x=o.tx=p.x;o.y=o.ty=p.y;PL.push(o);addKF(p.n+' joined')}
if(p.d&&!o.dead){pt(o.x+9,o.y+17,40,'#b00',9,40,.25);pt(o.x+9,o.y+17,14,o.col,7,40,.25)}
if(o.dead&&!p.d){o.x=p.x;o.y=p.y}
Object.assign(o,{god:!!p.gd,av:p.av|0,rk:p.rk,name:p.n,team:p.tm==null?-1:p.tm,col:TEAMS&&p.tm>=0?TC[p.tm]:p.c,tx:p.x,ty:p.y,vx:p.vx,vy:p.vy,aim:p.a,hp:p.h,dead:p.d,kills:p.k,deaths:p.dd,jf:p.jf,on:p.on,inv:p.inv?9999:0,wp:[{k:p.w,ammo:0,res:0}],cur:0,seen:performance.now()});
o.dir=Math.cos(o.aim)<0?-1:1;if(p.sh)for(const q of p.sh){fireBullets(o,q[0],q[1]+9,q[2]+13,q[3],Math.min(1.5,q[4]||1));o.fl=4}}
else if(p.t==='pw'){const o=PL.find(q=>q.id===p.id);if(o){o.aim=p.a;o.x=p.x;o.y=p.y;firePower(o,p.k)}}
else if(p.t==='vj'){if(VOICE.on&&p.id!==myId){send({t:'vh',id:myId});vclose(p.id);vconsider(p.id)}}
else if(p.t==='vh'){if(VOICE.on&&p.id!==myId)vconsider(p.id)}
else if(p.t==='vs')vsignal(p)
else if(p.t==='vl')vclose(p.id)
else if(p.t==='d'){addKF(p.m);if(p.kid===myId)me.kills++}
else if(p.t==='k'){const k=PK.find(x=>x.id===p.id);if(k&&!k.t&&!k.gone){if(k.drop)k.gone=1;else k.t=800}}
else if(p.t==='p'){PK.push({x:p.x,y:p.y,w:20,h:16,vx:0,vy:0,k:p.k,t:0,on:0,drop:1,ttl:900,id:p.id})}
else if(p.t==='g'){const o=PL.find(q=>q.id===p.id);if(o)G.push({x:p.x,y:p.y,vx:p.vx,vy:p.vy,t:110,o})}}
function netTick(){voiceTick();if(online){if(T%6===0)sendState();const now=performance.now();
PL=PL.filter(o=>{if(o.remote&&now-o.seen>5000){addKF(o.name+' left');vclose(o.id);return false}return true})}
checkWin()}
function leave(){closeRoom()}
// ---- voice chat (WebRTC peer-to-peer; signalling goes over the same Supabase channel)
const VOICE={on:false,stream:null,pcs:{},aud:{},muted:false,talk:{},me:0,an:{},q:[],qt:null,ac:null};
const ICE={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]};
function vsig(to,k,d){VOICE.q.push({t:'vs',to,from:myId,k,d});if(!VOICE.qt)VOICE.qt=setInterval(()=>{const m=VOICE.q.shift();if(m)send(m);else{clearInterval(VOICE.qt);VOICE.qt=null}},100)}
function watch(id,stream){try{VOICE.ac=VOICE.ac||new(window.AudioContext||window.webkitAudioContext)();const an=VOICE.ac.createAnalyser();an.fftSize=256;VOICE.ac.createMediaStreamSource(stream).connect(an);VOICE.an[id]={an,buf:new Uint8Array(an.fftSize)}}catch(e){}}
function voiceTick(){if(!VOICE.on||T%6)return;for(const id in VOICE.an){const a=VOICE.an[id];a.an.getByteTimeDomainData(a.buf);let m=0;for(const v of a.buf)m=Math.max(m,Math.abs(v-128));
if(m>10&&!(id==='me'&&VOICE.muted)){if(id==='me')VOICE.me=T;else VOICE.talk[id]=T}}}
function vpeer(id){let pc=VOICE.pcs[id];if(pc)return pc;pc=new RTCPeerConnection(ICE);VOICE.pcs[id]=pc;
VOICE.stream.getTracks().forEach(t=>pc.addTrack(t,VOICE.stream));
pc.ontrack=e=>{let a=VOICE.aud[id];if(!a){a=document.createElement('audio');a.autoplay=true;a.playsInline=true;document.body.appendChild(a);VOICE.aud[id]=a}a.srcObject=e.streams[0];a.play&&a.play().catch(()=>{});watch(id,e.streams[0])};
pc.onconnectionstatechange=()=>{if(pc.connectionState==='failed'||pc.connectionState==='closed')vclose(id)};return pc}
function waitIce(pc){return new Promise(res=>{if(pc.iceGatheringState==='complete')return res();const to=setTimeout(res,2500);pc.addEventListener('icegatheringstatechange',()=>{if(pc.iceGatheringState==='complete'){clearTimeout(to);res()}})})}
async function vconsider(id){if(!VOICE.on||id===myId||VOICE.pcs[id])return;try{const pc=vpeer(id);
if(myId<id){const o=await pc.createOffer();await pc.setLocalDescription(o);await waitIce(pc);vsig(id,'offer',pc.localDescription.sdp)}}catch(e){vclose(id)}}
async function vsignal(p){if(!VOICE.on||p.to!==myId)return;const id=p.from;try{
if(p.k==='offer'){const pc=vpeer(id);await pc.setRemoteDescription({type:'offer',sdp:p.d});const an=await pc.createAnswer();await pc.setLocalDescription(an);await waitIce(pc);vsig(id,'answer',pc.localDescription.sdp)}
else if(p.k==='answer'){const pc=VOICE.pcs[id];if(pc&&pc.signalingState==='have-local-offer')await pc.setRemoteDescription({type:'answer',sdp:p.d})}}catch(e){vclose(id)}}
function vclose(id){const pc=VOICE.pcs[id];if(pc){try{pc.close()}catch(e){}delete VOICE.pcs[id]}const a=VOICE.aud[id];if(a){a.srcObject=null;a.remove();delete VOICE.aud[id]}delete VOICE.an[id];delete VOICE.talk[id]}
async function voiceJoin(){if(!navigator.mediaDevices||!window.RTCPeerConnection){addKF('Voice chat is not supported here');$('vc').checked=false;return}
try{VOICE.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}})}catch(e){addKF('Microphone blocked or unavailable');$('vc').checked=false;return}
VOICE.on=true;VOICE.muted=false;$('mute').hidden=false;$('mute').textContent='Mute';watch('me',VOICE.stream);send({t:'vj',id:myId});addKF('Voice chat on')}
function voiceLeave(notify){if(!VOICE.on)return;if(notify)send({t:'vl',id:myId});Object.keys(VOICE.pcs).forEach(vclose);if(VOICE.stream)VOICE.stream.getTracks().forEach(t=>t.stop());
VOICE.stream=null;VOICE.on=false;delete VOICE.an.me;$('mute').hidden=true;$('vc').checked=false}
$('vc').onchange=()=>{if($('vc').checked)voiceJoin();else voiceLeave(true);$('vc').blur()};
$('mute').onclick=()=>{VOICE.muted=!VOICE.muted;if(VOICE.stream)VOICE.stream.getAudioTracks().forEach(t=>t.enabled=!VOICE.muted);$('mute').textContent=VOICE.muted?'Unmute':'Mute'};
// ---- fullscreen
function toggleFS(){const d=document,e=d.documentElement;if(d.fullscreenElement||d.webkitFullscreenElement){(d.exitFullscreen||d.webkitExitFullscreen).call(d)}else enterFS()}
function enterFS(){const d=document,e=d.documentElement;if(d.fullscreenElement||d.webkitFullscreenElement)return;const f=e.requestFullscreen||e.webkitRequestFullscreen;
if(f){try{const r=f.call(e,{navigationUI:'hide'});r&&r.catch&&r.catch(()=>{})}catch(x){}}
try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{})}catch(x){}}
// ---- flow
const COLS=['#d9382c','#2f9e44','#e8890c','#8e44ad','#16a2b8','#c2a21a','#2f6fe0'];let mode='solo';
function beginMatch(isOnline,cfg,team){if(!cfg)cfg={mode:$('gm').value,map:$('mp').value,kills:+$('kt').value,powers:true,airdrop:true};const name=($('name').value.trim()||'Soldier').slice(0,12);try{localStorage.setItem('jm-name',name)}catch(e){}
online=isOnline;loadMap(cfg.map);SURV=cfg.mode==='surv';TEAMS=cfg.mode==='tdm'||SURV;TARGET=cfg.kills;POWERS=cfg.powers!==false;AIRDROP=cfg.airdrop!==false;DIFF=D[$('df').value];
const L=UP.lv,mt=TEAMS?(isOnline?Math.max(0,team|0):0):-1;
PL=[me=mk(name,0,TEAMS?TC[mt]:isOnline?COLS[parseInt(myId,36)%COLS.length]:'#2f6fe0')];
Object.assign(me,{team:mt,mh:100+15*L.hp,mf:100+15*L.fuel,spd:1+.06*L.spd,dm:1+.06*L.dmg,rlm:1-.1*L.rl,g0:3+L.gren});
const gk=owns('guns',INV.gun)?INV.gun:'';Object.assign(me,{pw:POWERS&&owns('powers',INV.power)?INV.power:'',lo:gk,av:Math.max(0,AV.findIndex(a=>a.id===INV.avatar&&owns('avatars',a.id)))});
const names=['Rex','Vex','Kilo','Nova','Zed'],cols=['#d9382c','#2f9e44','#e8890c','#8e44ad','#16a2b8'];
if(!isOnline&&!SURV)for(let i=0;i<+$('nb').value;i++){const b=mk(names[i],1,TEAMS?TC[i%2?0:1]:cols[i]);b.team=TEAMS?(i%2?0:1):-1;b.lo=['ak','shotgun','ak','sniper','rocket'][i%5];b.av=(i*3+1)%AV.length;b.pw=['jab','rocket','','armor','jab'][i%5];PL.push(b)}
B=[];G=[];P=[];EX=[];KF=[];PK=[];T=0;outShots=[];ARMS=[];FT=[];BN.l=0;lastSlot=-1;PL.forEach(spawn);if(SURV){wave=0;nextWave()}
const pk=(x,y,i)=>PK.push({x,y,w:20,h:16,vx:0,vy:0,on:0,k:rk(i),seed:i,id:'h'+i,t:0});
MAP.forEach((p,i)=>{if(i>0&&p[2]>=200)pk(p[0]+p[2]/2-10,p[1]-16,i)});MAPD.gp.forEach((q,i)=>pk(q[0],q[1],100+i));
cam.x=clamp(me.x-VW/2,0,Math.max(0,WW-VW));cam.y=clamp(me.y-VH/2,0,WH-VH);
$('menu').hidden=true;$('room').hidden=true;$('end').hidden=true;$('tools').hidden=false;god=canGod()&&godPref;$('godSw').hidden=!canGod();$('vcSw').hidden=!isOnline;$('god').checked=god;$('msg').textContent='';$('play').disabled=false;state='play';banner(SURV?'Survive':'Fight')}
// ---- rooms: browse, create, set the rules in a waiting room, then play together
const RMODES=[['ffa','Free for all','Everyone for themselves'],['tdm','Team deathmatch','Blue against Red']];
let RM=null,lobby=null,lobbyReady=false,lobbyPending=null,POWERS=true,AIRDROP=true;
const rndId=()=>Math.random().toString(36).slice(2,8);
const defaultCfg=()=>({mode:'ffa',map:'high',kills:15,powers:true,airdrop:true,max:8});
function setMsg(t){$('msg').textContent=t}
function setBusy(v){$('mkRoom').disabled=v;$('qp').disabled=v}
let pendingJoin=(location.hash.match(/room=([a-z0-9]{4,20})/i)||[])[1]||null,lobbyErr='';
function subscribeWithTimeout(ch,ms){return new Promise(res=>{let done=false;const t=setTimeout(()=>{if(!done){done=true;res('TIMEOUT')}},ms);
 ch.subscribe(st=>{if(done)return;if(st==='SUBSCRIBED'||st==='CHANNEL_ERROR'||st==='TIMED_OUT'||st==='CLOSED'){done=true;clearTimeout(t);res(st)}})})}
function lobbyJoin(){if(lobbyReady)return Promise.resolve(true);if(lobbyPending)return lobbyPending;const sc=getSB();if(!sc||!user)return Promise.resolve(false);
 lobbyErr='';lobby=sc.channel('jm-lobby',{config:{presence:{key:myId}}});lobby.on('presence',{event:'sync'},()=>renderRooms());
 lobbyPending=subscribeWithTimeout(lobby,10000).then(st=>{if(st==='SUBSCRIBED'){lobbyReady=true;renderRooms();return true}
  lobbyErr=st==='TIMEOUT'?'The online service did not respond.':'Supabase Realtime rejected the lobby. Check that Realtime is enabled for your project.';lobbyPending=null;renderRooms();return false});
 return lobbyPending}
function lobbyConnect(){lobbyJoin()}
function lobbyLeave(){if(RM)return;if(lobby){try{getSB().removeChannel(lobby)}catch(e){}}lobby=null;lobbyReady=false;lobbyPending=null}
function roomsNow(){const st=lobbyReady&&lobby?lobby.presenceState():{},out=[];for(const k in st)for(const m of (st[k]||[])){if(m&&m.room)out.push(m)}return out.sort((a,b)=>(b.count||0)-(a.count||0))}
function renderRooms(){const box=$('roomList');if(!box)return;
 if(!user){box.innerHTML='<div class="room empty">Sign in with an account to play online.</div>';return}
 if(!lobbyReady){box.innerHTML='<div class="room empty">'+(lobbyErr?esc(lobbyErr)+' You can still play with invite links.':'Connecting to the lobby...')+'</div>';return}
 const rs=roomsNow();
 box.innerHTML=rs.length?rs.map(r=>{const full=r.count>=r.max,mp=(MAPS.find(m=>m.id===r.map)||MAPS[0]).n;
  return '<div class="room"><div class="ri"><b>'+esc(r.name)+'</b><span>'+esc(mp)+' / '+(r.mode==='tdm'?'Team deathmatch':'Free for all')+' / first to '+r.kills+'</span></div><span class="cnt">'+r.count+'/'+r.max+'</span><button class="chip" data-id="'+esc(r.room)+'"'+(full?' disabled':'')+'>'+(full?'Full':'Join')+'</button></div>'}).join('')
  :'<div class="room empty">No open rooms yet. Create one, then send the invite link to friends.</div>';
 box.querySelectorAll('button[data-id]').forEach(b=>b.onclick=()=>{const r=rs.find(x=>x.room===b.dataset.id);if(r){enterFS();openRoom(r.room,r.name,false)}})}
function inviteUrl(id){return location.href.split('#')[0]+'#room='+id}
function joinPending(){if(!pendingJoin||!user)return;const id=pendingJoin;pendingJoin=null;setMode('online');setTimeout(()=>openRoom(id,'Room',false),0)}
function createRoom(){enterFS();if(!user){setMsg('Sign in with an account (not guest) to play online.');return}openRoom(rndId(),(user.username+"'s room").slice(0,20),true,defaultCfg())}
function quickPlay(){enterFS();const rs=roomsNow().filter(r=>r.count<r.max);if(rs.length)openRoom(rs[0].room,rs[0].name,false);else createRoom()}
async function openRoom(id,name,isHost,cfg){
 if(!window.supabase){setMsg('Online play needs an internet connection.');return}
 if(!user){setMsg('Sign in with an account (not guest) to play online.');return}
 if(RM)closeRoom();
 setMsg((isHost?'Creating ':'Joining ')+name+'...');setBusy(true);
 lobbyJoin();
 const c2=getSB().channel('jm-room-'+id,{config:{broadcast:{self:false},presence:{key:myId}}});
 const R={id,name,host:isHost,ch:c2,cfg:Object.assign(defaultCfg(),cfg||{}),members:[],sawHost:false,team:-1};
 RM=R;roomCode=name;
 c2.on('presence',{event:'sync'},roomSync);
 c2.on('broadcast',{event:'e'},m=>onMsg(m.payload));
 c2.on('broadcast',{event:'r'},m=>roomMsg(m.payload));
 const st=await subscribeWithTimeout(c2,10000);
 if(RM!==R)return;
 if(st!=='SUBSCRIBED'){closeRoom();setBusy(false);setMsg(st==='TIMEOUT'?'The online service did not respond. Check your connection and try again.':'Could not open the room. Check that Supabase Realtime is enabled for your project.');return}
 ch=c2;online=true;R.team=pickTeam(R);
 try{await c2.track(myPayload())}catch(e){}
 setBusy(false);roomSync();showRoom();
 if(location.hash)history.replaceState(null,'',location.pathname+location.search);
 if(isHost)setMsg(lobbyReady?'':'Room is open, but the room list is offline. Share the invite link instead.');
 else setTimeout(()=>{if(RM===R&&!R.sawHost)leaveRoom('No host is in that room right now. Ask them to open it and send you the link again.')},7000)}
function pickTeam(R){if(R.cfg.mode!=='tdm')return -1;const c=[0,0];for(const m of R.members)if(m.key!==myId&&(m.team===0||m.team===1))c[m.team]++;return c[0]<=c[1]?0:1}
function myPayload(){const R=RM,p={name:($('name').value.trim()||'Soldier').slice(0,12),team:R.team};if(R.host){p.host=true;p.cfg=R.cfg;p.roomName=R.name}return p}
function roomSync(){const R=RM;if(!R||!R.ch)return;const st=R.ch.presenceState(),mem=[];let hostHere=false,cfg=null,rn=null;
 for(const k in st)for(const m of (st[k]||[])){const x=Object.assign({key:k},m);mem.push(x);if(x.host){hostHere=true;if(x.cfg)cfg=x.cfg;if(x.roomName)rn=x.roomName}}
 R.members=mem;if(hostHere)R.sawHost=true;
 if(!R.host){if(cfg)R.cfg=cfg;if(rn)R.name=rn;if(R.sawHost&&!hostHere){leaveRoom('The host left the room');return}}
 else publishLobby();
 if(state==='room')renderRoom()}
function publishLobby(){const R=RM;if(!R||!R.host||!lobbyReady||!lobby)return;
 try{lobby.track({room:R.id,name:R.name,mode:R.cfg.mode,map:R.cfg.map,kills:R.cfg.kills,count:Math.max(1,R.members.length),max:R.cfg.max})}catch(e){}}
function roomCfg(patch){const R=RM;if(!R||!R.host)return;Object.assign(R.cfg,patch);if(patch.mode==='tdm'&&R.team<0)R.team=0;
 try{R.ch.track(myPayload())}catch(e){}publishLobby();renderRoom()}
function setRoomTeam(t){const R=RM;if(!R)return;R.team=t;try{R.ch.track(myPayload())}catch(e){}renderRoom()}
function roomMsg(p){if(p&&p.t==='start'&&RM&&!RM.host)startOnline(p.cfg)}
function startOnline(cfg){const R=RM;if(!R)return;enterFS();beginMatch(true,cfg,cfg.mode==='tdm'?Math.max(0,R.team):-1)}
function resetMatch(){PL=[];me=null;B=[];G=[];P=[];EX=[];KF=[];PK=[];FT=[];ARMS=[];BN.l=0}
function closeRoom(){const R=RM;if(!R)return;RM=null;
 try{voiceLeave(true)}catch(e){}
 try{if(R.host&&lobbyReady&&lobby)lobby.untrack()}catch(e){}
 try{R.ch.untrack()}catch(e){}
 try{getSB().removeChannel(R.ch)}catch(e){}
 ch=null;online=false}
function leaveRoom(msg){closeRoom();resetMatch();state='menu';$('room').hidden=true;$('end').hidden=true;$('tools').hidden=true;$('menu').hidden=false;$('play').disabled=false;setBusy(false);setMsg(msg||'');if(mode==='online'){lobbyConnect();renderRooms()}}
function toMenu(){leaveRoom('')}
function showRoom(){state='room';$('menu').hidden=true;$('end').hidden=true;$('tools').hidden=true;$('room').hidden=false;renderRoom()}
function backToRoom(){if(!RM){toMenu();return}voiceLeave(true);resetMatch();$('end').hidden=true;$('tools').hidden=true;$('vcSw').hidden=true;showRoom()}
function renderRoom(){const R=RM;if(!R||$('room').hidden)return;
 $('rName').textContent=R.name;$('rLink').value=inviteUrl(R.id);
 $('rSub').textContent=R.host?'You are the host. Set the rules, then start when your friends are in.':'The host sets the rules. Pick a team if the mode has teams.';
 const mem=R.members.slice().sort((a,b)=>(b.host?1:0)-(a.host?1:0));
 $('rCount').textContent=mem.length+'/'+R.cfg.max;
 $('rPlayers').innerHTML=mem.length?mem.map(m=>'<div class="pl"><span>'+esc(m.name||'Soldier')+(m.key===myId?' (you)':'')+'</span><span>'+(m.host?'<i class="tag host">Host</i>':'')+(R.cfg.mode==='tdm'&&(m.team===0||m.team===1)?'<i class="tag t'+m.team+'">'+(m.team===0?'Blue':'Red')+'</i>':'')+'</span></div>').join(''):'<div class="pl"><span>Waiting for players</span></div>';
 $('rTeams').hidden=R.cfg.mode!=='tdm';$('tBlue').classList.toggle('on',R.team===0);$('tRed').classList.toggle('on',R.team===1);
 const h=R.host;$('rRename').disabled=!h;if(document.activeElement!==$('rRename'))$('rRename').value=R.name;
 $('rKills').value=String(R.cfg.kills);$('rMax').value=String(R.cfg.max);$('rPow').checked=!!R.cfg.powers;$('rAir').checked=!!R.cfg.airdrop;
 ['rKills','rMax','rPow','rAir'].forEach(i=>$(i).disabled=!h);
 $('rMode').classList.toggle('locked',!h);$('rMap').classList.toggle('locked',!h);
 $('rMode').querySelectorAll('.tile').forEach(b=>b.classList.toggle('on',b.dataset.v===R.cfg.mode));
 $('rMap').querySelectorAll('.tile').forEach(b=>b.classList.toggle('on',b.dataset.v===R.cfg.map));
 $('rStart').hidden=!h;$('rWait').textContent=h?'':'Waiting for the host to start the match.'}
$('rMode').innerHTML=RMODES.map(m=>'<button class="tile" data-v="'+m[0]+'"><b>'+m[1]+'</b><span>'+m[2]+'</span></button>').join('');
$('rMap').innerHTML=MAPS.map(m=>'<button class="tile map" data-v="'+m.id+'" style="--a:'+m.sky[0]+';--b:'+m.sky[1]+';--c:'+m.far[1]+'"><i></i><b>'+m.n+'</b></button>').join('');
$('rMode').onclick=e=>{const b=e.target.closest('.tile');if(b&&RM&&RM.host)roomCfg({mode:b.dataset.v})};
$('rMap').onclick=e=>{const b=e.target.closest('.tile');if(b&&RM&&RM.host)roomCfg({map:b.dataset.v})};
$('rKills').onchange=()=>roomCfg({kills:+$('rKills').value});
$('rMax').onchange=()=>roomCfg({max:+$('rMax').value});
$('rPow').onchange=()=>roomCfg({powers:$('rPow').checked});
$('rAir').onchange=()=>roomCfg({airdrop:$('rAir').checked});
$('rRename').onchange=()=>{if(RM&&RM.host){RM.name=($('rRename').value.trim()||RM.name).slice(0,20);roomCfg({})}};
$('tBlue').onclick=()=>setRoomTeam(0);$('tRed').onclick=()=>setRoomTeam(1);
$('rStart').onclick=()=>{const R=RM;if(!R||!R.host)return;const cfg=Object.assign({},R.cfg);try{R.ch.send({type:'broadcast',event:'r',payload:{t:'start',cfg}})}catch(e){}startOnline(cfg)};
$('rLeave').onclick=()=>leaveRoom('');
$('rCopy').onclick=async()=>{const t=$('rLink').value;let ok=false;
 if(navigator.share){try{await navigator.share({title:'Jetpack Militia',text:'Join my room',url:t});return}catch(e){}}
 try{await navigator.clipboard.writeText(t);ok=true}catch(e){$('rLink').select();try{ok=document.execCommand('copy')}catch(x){}}
 $('rCopy').textContent=ok?'Link copied':'Press Ctrl+C to copy';setTimeout(()=>$('rCopy').textContent='Copy invite link',1600)};
function setMode(m){mode=m;$('solTiles').hidden=m==='online';$('tSolo').classList.toggle('on',m==='solo');$('tOn').classList.toggle('on',m==='online');$('soloOpts').hidden=m!=='solo';$('onOpts').hidden=m==='solo';$('play').hidden=m!=='solo';$('msg').textContent='';if(m==='online'&&$('gm').value==='surv')pickTile('gm','ffa');if(m==='online'){lobbyConnect();renderRooms()}else lobbyLeave()}
$('tSolo').onclick=()=>setMode('solo');$('tOn').onclick=()=>setMode('online');
$('play').onclick=()=>{enterFS();beginMatch(false)};$('mkRoom').onclick=createRoom;$('qp').onclick=quickPlay;
$('fsBtn').onclick=toggleFS;$('fs').onclick=toggleFS;$('quit').onclick=()=>{if(RM&&online)backToRoom();else toMenu()};$('again').onclick=()=>{if(RM)backToRoom();else toMenu()};
try{$('name').value=localStorage.getItem('jm-name')||''}catch(e){}
// ---- win check, credits, upgrades
function nextWave(){wave++;PL=PL.filter(o=>!o.bot);const n=Math.min(1+wave,7),nm=['Rex','Vex','Kilo','Nova','Zed'];
for(let i=0;i<n;i++){const b=mk(nm[i%5]+(wave>1?' '+wave:''),1,TC[1]);Object.assign(b,{team:1,mh:100+8*wave,lo:['ak','shotgun','ak','sniper','rocket'][(i+wave)%5],av:(i*3+wave)%AV.length,pw:['jab','rocket','','armor','jab'][(i+wave)%5]});PL.push(b);spawn(b)}
if(wave>1){me.hp=Math.min(me.mh,me.hp+40);me.gren=Math.min(5,me.gren+1)}addKF('Wave '+wave);banner('Wave '+wave)}
function checkWin(){if(state!=='play')return;
if(SURV){if(me.dead){state='over';const cr=me.kills*10+wave*20;award(cr,me.kills,wave>=5);$('endt').textContent='Game over';
$('endsub').textContent='You reached wave '+wave+' with '+me.kills+' kills. You earned '+cr+' credits and '+(me.kills*10+(wave>=5?60:20))+' XP.';$('end').hidden=false}
else if(!PL.some(o=>o.bot&&!o.dead))nextWave();return}
let w=null,tw=-1;
if(TEAMS){const t=[0,0];for(const o of PL)if(o.team>=0)t[o.team]+=o.kills;tw=t[0]>=TARGET?0:t[1]>=TARGET?1:-1;if(tw<0)return}
else{w=PL.find(o=>o.kills>=TARGET);if(!w)return}
state='over';const won=TEAMS?me.team===tw:w===me,cr=me.kills*10+(won?50:15);award(cr,me.kills,won);
$('endt').textContent=TEAMS?TN[tw]+' team wins':(won?'Victory':w.name+' wins');
$('endsub').textContent=(won?'Victory. ':'Defeat. ')+'Your kills/deaths: '+me.kills+'/'+me.deaths+'. You earned '+cr+' credits and '+(me.kills*10+(won?60:20))+' XP.';$('end').hidden=false}
const UPGS=[{k:'hp',n:'Body armor',d:'+15 max health per level'},{k:'fuel',n:'Jetpack tank',d:'+15 max fuel per level'},{k:'spd',n:'Combat boots',d:'+6% move speed per level'},
{k:'dmg',n:'Gunnery',d:'+6% weapon damage per level'},{k:'rl',n:'Quick hands',d:'10% faster reload per level'},{k:'gren',n:'Grenade bag',d:'+1 starting grenade per level'}];
let UP={cr:100,xp:0,lv:{hp:0,fuel:0,spd:0,dmg:0,rl:0,gren:0}};
try{const v=JSON.parse(localStorage.getItem('jm-up'));if(v&&v.lv){UP.cr=+v.cr||0;UP.xp=+v.xp||0;Object.assign(UP.lv,v.lv)}}catch(e){}
const saveUP=()=>{if(user)return;try{localStorage.setItem('jm-up',JSON.stringify(UP))}catch(e){}};
const addCredits=n=>{UP.cr+=n;saveUP();upLabel()};
function upLabel(){accountChip()}
function accountChip(){const i=Math.max(0,AV.findIndex(a=>a.id===INV.avatar&&owns('avatars',a.id)));avPreview($('chipAv'),AV[i]);
$('chipName').textContent=user?user.username:'Guest';$('chipCr').textContent=isAdmin()?'Unlimited credits':UP.cr+' credits';
const ri=myRank(),xp=UP.xp||0,rc=$('chipRk').getContext('2d');rc.clearRect(0,0,28,28);drawRank(rc,14,14,12,ri);
$('chipRank').textContent=(ri===99?'Mr God':RANKS[ri].n+', '+xp+' XP')+(tempLeft()>0&&!isAdmin()?', temp admin':'');$('chipRank').style.color=ri===99?'#ffd54a':'';
let pct=1;if(ri!==99&&RANKS[ri+1]){const a=RANKS[ri].x,b=RANKS[ri+1].x;pct=(xp-a)/(b-a)}$('xpFill').style.width=Math.round(pct*100)+'%'}
function renderUps(){$('cr').textContent=isAdmin()?'Unlimited':UP.cr;$('upgList').innerHTML=UPGS.map(u=>{const l=UP.lv[u.k],c=(l+1)*250;
return '<div class="uc"><div class="un">'+u.n+'</div><div class="ud">'+u.d+'</div><div class="pips">'+'<i class="on"></i>'.repeat(l)+'<i></i>'.repeat(5-l)+'</div><button data-k="'+u.k+'"'+(l>=5||(!isAdmin()&&UP.cr<c)?' disabled':'')+'>'+(l>=5?'Maxed out':'Upgrade for '+c)+'</button></div>'}).join('');
$('upgList').querySelectorAll('button').forEach(b=>b.onclick=async()=>{const k=b.dataset.k,l=UP.lv[k],c=(l+1)*250;if(l>=5)return;
if(user){b.disabled=true;const r=await getSB().rpc('buy_upgrade',{p_key:k});if(r.error){$('umsg').textContent=r.error.message;return}$('umsg').textContent='';setUser(r.data);upLabel();renderUpg()}
else if(UP.cr>=c){UP.cr-=c;UP.lv[k]++;saveUP();upLabel();renderUpg()}})}
$('upBtn').onclick=()=>{renderUpg();$('menu').hidden=true;$('end').hidden=true;$('upg').hidden=false};
$('upBack').onclick=()=>{$('upg').hidden=true;$('menu').hidden=false;upLabel()};
$('endUp').onclick=()=>{toMenu();$('upBtn').onclick()};
$('mp').onchange=()=>loadMap($('mp').value);
// ---- shop: guns and avatars
const GUNP={ak:1500,shotgun:2000,sniper:3000,rocket:4500};
const AV=[{id:'recruit',n:'Recruit',p:0,b:'#2f6fe0',h:'#3d4a2e',s:'#f1c27d',a:'helm'},{id:'woodland',n:'Woodland',p:750,b:'#4c6b2f',h:'#3f5a28',s:'#e0b080',a:'camo'},
{id:'desert',n:'Desert Fox',p:750,b:'#c9a45c',h:'#e6d3a3',s:'#d9a066',a:'turban'},{id:'frost',n:'Frostbite',p:1000,b:'#9fc7e8',h:'#7f9fba',s:'#f1c9b0',a:'fur'},
{id:'shadow',n:'Shadow',p:1500,b:'#23232b',h:'#16161c',s:'#f1c27d',a:'ninja'},{id:'buccaneer',n:'Buccaneer',p:1750,b:'#7a2b2b',h:'#1a1a1a',s:'#e8b887',a:'pirate'},
{id:'bolt',n:'Bolt',p:2000,b:'#8a949c',h:'#b5bec6',s:'#8a949c',a:'robot'},{id:'paladin',n:'Paladin',p:2250,b:'#aeb7c0',h:'#c9d1d8',s:'#f1c27d',a:'knight'},
{id:'cosmonaut',n:'Cosmonaut',p:2500,b:'#e8eef2',h:'#dfe9f0',s:'#f1c27d',a:'astro'},{id:'imp',n:'Imp',p:3000,b:'#7d1f1f',h:'#b02a2a',s:'#d23a3a',a:'demon'},
{id:'midas',n:'Midas',p:4000,b:'#d4a82a',h:'#f2c93c',s:'#f1c27d',a:'gold'},{id:'monarch',n:'Monarch',p:5000,b:'#5b2a86',h:'#f2c93c',s:'#f1c27d',a:'crown'}];
let INV={guns:[],avatars:['recruit'],powers:[],gun:'',avatar:'recruit',power:''},shopTab='up';
try{const v=JSON.parse(localStorage.getItem('jm-inv'));if(v)INV=Object.assign(INV,v)}catch(e){}
const saveINV=()=>{if(user)return;try{localStorage.setItem('jm-inv',JSON.stringify(INV))}catch(e){}};
function owns(k,id){return isAdmin()||INV[k].includes(id)}
function headGfx(c,av,d){const a=av.a;
if(a==='robot'){c.fillStyle=av.h;c.fillRect(-7,-2,14,13);c.fillStyle='#e33';c.fillRect(d*2-4,3,3,3);c.fillRect(d*2+1,3,3,3);c.strokeStyle=av.h;c.lineWidth=1.5;c.beginPath();c.moveTo(0,-2);c.lineTo(0,-8);c.stroke();c.fillStyle='#e33';c.beginPath();c.arc(0,-9,2,0,7);c.fill();return}
c.fillStyle=av.s;c.beginPath();c.arc(0,5,6,0,7);c.fill();
if(a==='ninja'){c.fillStyle=av.h;c.beginPath();c.arc(0,5,6.6,0,7);c.fill();c.fillStyle=av.s;c.fillRect(-5,3,10,3);c.fillStyle='#fff';c.fillRect(d*2-1,4,2,1.5);return}
if(a==='astro'){c.fillStyle=av.h;c.beginPath();c.arc(0,4,6.8,Math.PI,0);c.fill();c.fillStyle='#cfe8f5aa';c.beginPath();c.arc(0,5,8.5,0,7);c.fill();c.strokeStyle='#fff';c.lineWidth=2;c.stroke();c.fillStyle='#000';c.fillRect(d*2.5,4,2,2);return}
if(a==='pirate'){c.fillStyle=av.h;c.beginPath();c.moveTo(-9,2);c.lineTo(0,-8);c.lineTo(9,2);c.closePath();c.fill();c.fillStyle='#fff';c.fillRect(-1,-3,2,2);c.fillStyle='#000';c.fillRect(d*2.5-1,3,4,4);return}
if(a==='crown'){c.fillStyle='#f2c93c';c.beginPath();c.moveTo(-6,1);c.lineTo(-6,-6);c.lineTo(-3,-2);c.lineTo(0,-7);c.lineTo(3,-2);c.lineTo(6,-6);c.lineTo(6,1);c.closePath();c.fill();c.fillStyle='#000';c.fillRect(d*2.5,4,2,2);return}
c.fillStyle=av.h;c.beginPath();c.arc(0,4,6.8,Math.PI,0);c.fill();
if(a==='camo'){c.fillStyle='#2a3d1a';[[-4,0],[0,-2],[4,1],[2,2]].forEach(p=>c.fillRect(p[0],p[1],3,2))}
else if(a==='turban'){c.beginPath();c.ellipse(0,0,8,5,0,0,7);c.fill()}
else if(a==='fur'){c.fillStyle='#fff';for(let x=-6;x<=6;x+=4){c.beginPath();c.arc(x,4,2.6,0,7);c.fill()}}
else if(a==='knight'){c.fillStyle='#222';c.fillRect(d>0?-1:-6,3,7,2);c.fillStyle='#d33';c.fillRect(-1.5,-8,3,5)}
else if(a==='demon'){c.fillStyle='#3a0f0f';c.beginPath();c.moveTo(-6,-1);c.lineTo(-9,-9);c.lineTo(-3,-3);c.moveTo(6,-1);c.lineTo(9,-9);c.lineTo(3,-3);c.fill()}
else if(a==='gold'){c.fillStyle='#fff8';c.fillRect(-4,-1,3,2)}
c.fillStyle='#000';c.fillRect(d*2.5,4,2,2)}
function avPreview(cn,av){const c=cn.getContext('2d');c.clearRect(0,0,cn.width,cn.height);c.save();c.translate(cn.width/2,26);c.scale(2,2);
c.strokeStyle='#222';c.lineWidth=4;c.beginPath();c.moveTo(-3,24);c.lineTo(-3,34);c.moveTo(3,24);c.lineTo(3,34);c.stroke();c.fillStyle='#555';c.fillRect(-13,8,6,15);c.fillStyle=av.b;c.fillRect(-7,8,14,17);headGfx(c,av,1);c.restore()}
function renderUpg(){shopTab==='gun'?renderGuns():shopTab==='av'?renderAvs():shopTab==='pw'?renderPows():renderUps()}
async function shopBuy(kind,id,price){const m=t=>$('umsg').textContent=t;
if(user){const r=await getSB().rpc('buy_item',{p_kind:kind,p_id:id});if(r.error){m(r.error.message);return}setUser(r.data)}
else{if(UP.cr<price){m('Not enough credits.');return}UP.cr-=price;INV[kind].push(id);saveUP();saveINV()}
m('');upLabel();renderUpg()}
async function shopEquip(kind,id){if(user){const r=await getSB().rpc('equip_item',{p_kind:kind,p_id:id});if(r.error){$('umsg').textContent=r.error.message;return}setUser(r.data)}
else{INV[kind==='guns'?'gun':kind==='powers'?'power':'avatar']=id;saveINV()}renderUpg()}
function renderGuns(){$('cr').textContent=isAdmin()?'Unlimited':UP.cr;
$('upgList').innerHTML=Object.keys(GUNP).map(k=>{const d=WP[k],o=owns('guns',k),eq=INV.gun===k,a=o?(eq?'un':'eq'):'buy';
return '<div class="uc"><div class="un">'+d.n+'</div><div class="ud">'+(d.rocket?'Explosive blast':'Damage '+d.dmg+(d.pel>1?' x'+d.pel:''))+', '+d.mag+' per magazine, '+(d.rate<=6?'rapid':d.rate<=20?'fast':'slow')+' fire</div><button data-k="'+k+'" data-a="'+a+'"'+(a==='buy'&&!isAdmin()&&UP.cr<GUNP[k]?' disabled':'')+'>'+(a==='buy'?'Buy for '+GUNP[k]:eq?'Equipped (tap to remove)':'Equip')+'</button></div>'}).join('');
$('upgList').querySelectorAll('button').forEach(b=>b.onclick=()=>{const k=b.dataset.k,a=b.dataset.a;if(a==='buy')shopBuy('guns',k,GUNP[k]);else shopEquip('guns',a==='un'?'':k)})}
function renderPows(){$('cr').textContent=isAdmin()?'Unlimited':UP.cr;
$('upgList').innerHTML=Object.keys(PW).map(k=>{const d=PW[k],o=owns('powers',k),eq=INV.power===k,a=o?(eq?'un':'eq'):'buy';
return '<div class="uc"><div class="un">'+d.n+'</div><div class="ud">'+d.d+' Cooldown '+(d.cd/60)+'s.</div><button data-k="'+k+'" data-a="'+a+'"'+(a==='buy'&&!isAdmin()&&UP.cr<d.price?' disabled':'')+'>'+(a==='buy'?'Buy for '+d.price:eq?'Equipped (tap to remove)':'Equip')+'</button></div>'}).join('');
$('upgList').querySelectorAll('button').forEach(b=>b.onclick=()=>{const k=b.dataset.k,a=b.dataset.a;if(a==='buy')shopBuy('powers',k,PW[k].price);else shopEquip('powers',a==='un'?'':k)})}
function renderAvs(){$('cr').textContent=isAdmin()?'Unlimited':UP.cr;
$('upgList').innerHTML=AV.map((v,i)=>{const o=owns('avatars',v.id),eq=INV.avatar===v.id,a=o?(eq?'eq0':'eq'):'buy';
return '<div class="uc"><canvas class="av" width="64" height="96" data-i="'+i+'"></canvas><div class="un">'+v.n+'</div><button data-k="'+v.id+'" data-p="'+v.p+'" data-a="'+a+'"'+(a==='eq0'||(a==='buy'&&!isAdmin()&&UP.cr<v.p)?' disabled':'')+'>'+(a==='buy'?'Buy for '+v.p:eq?'Equipped':'Equip')+'</button></div>'}).join('');
$('upgList').querySelectorAll('canvas.av').forEach(c=>avPreview(c,AV[+c.dataset.i]));
$('upgList').querySelectorAll('button').forEach(b=>b.onclick=()=>{if(b.dataset.a==='buy')shopBuy('avatars',b.dataset.k,+b.dataset.p);else shopEquip('avatars',b.dataset.k)})}
$('shopTabs').querySelectorAll('button').forEach(b=>b.onclick=()=>{shopTab=b.dataset.t;$('shopTabs').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));$('umsg').textContent='';renderUpg()});
// ---- accounts (Supabase Auth + server-side profile; all money changes happen in SQL functions)
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function getSB(){return sb||(sb=window.supabase?window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{realtime:{params:{eventsPerSecond:25}}}):null)}
function isAdmin(){return !!(user&&user.is_admin&&String(user.email||'').toLowerCase()===OWNER)}
function tempLeft(){return user&&user.admin_until?Math.max(0,(new Date(user.admin_until)-Date.now())/1000):0}
function canGod(){return isAdmin()||tempLeft()>0}
function setUser(p){user=p;INV=Object.assign({guns:[],avatars:['recruit'],powers:[],gun:'',avatar:'recruit',power:''},p.inventory||{});UP.lv=Object.assign({hp:0,fuel:0,spd:0,dmg:0,rl:0,gren:0},p.upgrades);UP.cr=+p.credits;UP.xp=+p.xp||0}
function award(cr,k,won){const xg=k*10+(won?60:20),before=rankIdx(UP.xp||0);
if(user){if(!isAdmin())getSB().rpc('claim_match',{p_kills:k,p_won:won}).then(r=>{if(r.data){setUser(r.data);upLabel();const a=rankIdx(UP.xp);if(a>before)$('endsub').textContent+=' Rank up: '+RANKS[a].n+'!'}})}
else{UP.cr+=cr;UP.xp=(UP.xp||0)+xg;saveUP();const a=rankIdx(UP.xp);if(a>before)setTimeout(()=>{$('endsub').textContent+=' Rank up: '+RANKS[a].n+'!'},0)}upLabel()}
async function loadProfile(session){const r=await getSB().from('profiles').select('*').eq('id',session.user.id).maybeSingle();
if(r.error||!r.data){$('amsg').textContent='Profile not found. Run supabase.sql in your Supabase project first.';return false}setUser(r.data);return true}
function showMenu(){$('auth').hidden=true;$('menu').hidden=false;
$('who').textContent=user?(user.is_admin?'Admin account':'Signed in'):'Progress saves on this device only';
$('admBtn').hidden=!isAdmin();$('outBtn').textContent=user?'Sign out':'Sign in';$('name').readOnly=!!user;if(user)$('name').value=user.username;upLabel();joinPending()}
async function doAuth(signup){const sc=getSB(),am=t=>$('amsg').textContent=t;if(!sc){am('Signing in needs an internet connection.');return}
const raw=$('aemail').value.trim(),isMail=raw.includes('@'),name=isMail?'':raw.replace(/[^A-Za-z0-9_]/g,'').slice(0,12),pw=$('apass').value;
if(!isMail&&name.length<3){am('A username needs 3 to 12 letters, numbers or underscores.');return}
if(pw.length<6){am('Your password needs at least 6 characters.');return}
const email=isMail?raw:name.toLowerCase()+'@players.jetpack.game';
am('Working...');const r=signup?await sc.auth.signUp({email,password:pw,options:{data:{username:isMail?($('auser').value.trim()||raw.split('@')[0]).slice(0,12):name}}}):await sc.auth.signInWithPassword({email,password:pw});
if(r.error){am(/invalid login/i.test(r.error.message)?'Wrong username/email or password.':/already/i.test(r.error.message)?'That username or email is already taken.':r.error.message);return}
if(!r.data.session){am(isMail?'Account created. Check your email to confirm it, then sign in.':'Username accounts need "Confirm email" turned off in your Supabase Auth settings.');return}
if(await loadProfile(r.data.session))showMenu()}
$('aIn').onclick=()=>doAuth(false);$('aUp').onclick=()=>doAuth(true);$('apass').onkeydown=e=>{if(e.key==='Enter')doAuth(false)};
$('guest').onclick=()=>{user=null;showMenu()};
$('outBtn').onclick=async()=>{if(user){try{await getSB().auth.signOut()}catch(e){}location.reload()}else{$('menu').hidden=true;$('auth').hidden=false}};
let admTarget=null,gTab='cr';
async function loadPlayers(){const r=await getSB().from('profiles').select('email,username,credits,xp,admin_until').order('created_at');
const box=$('plistBox');box.innerHTML=r.error?esc(r.error.message):(r.data||[]).map(p=>{const live=p.admin_until&&new Date(p.admin_until)>Date.now();
return '<div class="pl'+(p.email===admTarget?' sel':'')+'" data-e="'+esc(p.email)+'" data-n="'+esc(p.username)+'"><span>'+esc(p.username)+' <i>'+esc(RANKS[rankIdx(+p.xp||0)].n)+(live?', temp admin':'')+'</i></span><b>'+esc(p.credits)+'</b></div>'}).join('');
box.querySelectorAll('.pl').forEach(d=>d.onclick=()=>{admTarget=d.dataset.e;$('admSel').textContent=d.dataset.n;box.querySelectorAll('.pl').forEach(x=>x.classList.toggle('sel',x===d))})}
function renderGifts(){const b=$('gBody'),chip=(l,a)=>'<button class="gc" data-a="'+a+'">'+esc(l)+'</button>';let h='';
if(gTab==='cr')h=[100,500,1000,5000,10000,50000].map(n=>chip(n.toLocaleString()+' credits','cr:'+n)).join('');
else if(gTab==='gun')h=Object.keys(GUNP).map(k=>chip(WP[k].n,'gun:'+k)).join('');
else if(gTab==='av')h=AV.filter(a=>a.p>0).map(a=>chip(a.n,'av:'+a.id)).join('');
else if(gTab==='up')h=UPGS.map(u=>chip(u.n+' +1 level','up:'+u.k)).join('');
else h=[1,2,5,10,30].map(n=>chip(n+(n===1?' minute':' minutes'),'ta:'+n)).join('')+chip('Revoke now','rv:0');
b.innerHTML=h;b.querySelectorAll('.gc').forEach(x=>x.onclick=()=>giveGift(x.dataset.a))}
async function giveGift(a){const m=t=>$('admMsg').textContent=t;if(!admTarget){m('Pick a player first.');return}
const [k,v]=a.split(':'),sc=getSB();let r;
if(k==='cr')r=await sc.rpc('admin_transfer',{p_email:admTarget,p_amount:+v});
else if(k==='gun')r=await sc.rpc('gift_item',{p_target:admTarget,p_kind:'guns',p_id:v});
else if(k==='av')r=await sc.rpc('gift_item',{p_target:admTarget,p_kind:'avatars',p_id:v});
else if(k==='up')r=await sc.rpc('gift_upgrade',{p_target:admTarget,p_key:v,p_levels:1});
else if(k==='ta')r=await sc.rpc('gift_admin',{p_target:admTarget,p_minutes:+v});
else r=await sc.rpc('revoke_admin',{p_target:admTarget});
m(r.error?r.error.message:'Sent to '+$('admSel').textContent+'.');loadPlayers()}
$('gTabs').onclick=e=>{const b=e.target.closest('button');if(!b)return;gTab=b.dataset.g;$('gTabs').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));renderGifts()};
$('admBtn').onclick=()=>{admTarget=null;$('admSel').textContent='nobody yet';$('menu').hidden=true;$('adm').hidden=false;$('admMsg').textContent='';renderGifts();loadPlayers();loadCodes()};
$('admBack').onclick=()=>{$('adm').hidden=true;$('menu').hidden=false};
// ---- keep gifts, credits and temp admin time fresh
async function refreshProfile(){if(!user)return;try{const r=await getSB().from('profiles').select('*').eq('id',user.id).maybeSingle();
if(r.data){const had=canGod();setUser(r.data);upLabel();if(canGod()&&!had&&state==='play'){$('godSw').hidden=false;addKF('Temporary admin power granted')}}}catch(e){}}
setInterval(refreshProfile,15000);
// ---- unkillable switch (admin only)
try{godPref=localStorage.getItem('jm-god')==='1'}catch(e){}
$('god').onchange=()=>{god=canGod()&&$('god').checked;godPref=god;try{localStorage.setItem('jm-god',god?'1':'0')}catch(e){}$('god').blur()};
// ---- redeem codes (validated and paid out by SQL functions)
$('redeem').onclick=async()=>{const c=$('codeIn').value.trim(),m=t=>$('umsg').textContent=t;if(!user){m('Sign in with an account to redeem codes.');return}if(!c){m('Enter a code.');return}
const r=await getSB().rpc('redeem_code',{p_code:c});if(r.error){m(r.error.message);return}setUser(r.data);$('codeIn').value='';upLabel();renderUpg();m('Code redeemed. Credits added.')};
async function loadCodes(){const r=await getSB().from('codes').select('code,credits,max_uses,uses').order('created_at',{ascending:false});
$('codeBox').innerHTML=r.error?esc(r.error.message):(r.data||[]).map(c=>'<div class="pl" data-c="'+esc(c.code)+'"><span>'+esc(c.code)+' ('+esc(c.credits)+' credits)</span><b>'+esc(c.uses)+'/'+esc(c.max_uses)+' used</b></div>').join('')||'<div class="pl"><span>No codes yet.</span></div>';
$('codeBox').querySelectorAll('[data-c]').forEach(d=>d.onclick=()=>{$('codeIn').value=d.dataset.c;$('admMsg').textContent='Code '+d.dataset.c+' selected. Copy it from the box.'})}
$('admMk').onclick=async()=>{const cr=Math.floor(+$('admCr').value),u=Math.floor(+$('admUses').value)||1,m=t=>$('admMsg').textContent=t;if(!(cr>0)){m('Enter credits above 0.');return}
const r=await getSB().rpc('admin_create_code',{p_code:$('admCode').value.trim()||null,p_credits:cr,p_max_uses:u});
m(r.error?r.error.message:'Created code '+r.data+' for '+cr+' credits, '+u+' use(s).');if(!r.error)$('admCode').value='';loadCodes()};
(async()=>{try{const sc=getSB();if(sc){const r=await sc.auth.getSession();if(r.data&&r.data.session&&await loadProfile(r.data.session)){showMenu();return}}}catch(e){}$('auth').hidden=false;if(pendingJoin)$('amsg').textContent='Sign in to join the invited room.'})();
// ---- menu tiles
const MODES=[['ffa','Free for all','Everyone for themselves'],['tdm','Team deathmatch','Blue against Red'],['surv','Survival waves','Solo. Hold out as long as you can']];
function syncTiles(){[['gm','gmTiles'],['mp','mpTiles']].forEach(([sel,box])=>$(box).querySelectorAll('.tile').forEach(b=>b.classList.toggle('on',b.dataset.v===$(sel).value)))}
function pickTile(sel,v){$(sel).value=v;if($(sel).onchange)$(sel).onchange();syncTiles()}
$('gmTiles').innerHTML=MODES.map(m=>'<button class="tile" data-v="'+m[0]+'"><b>'+m[1]+'</b><span>'+m[2]+'</span></button>').join('');
$('mpTiles').innerHTML=MAPS.map(m=>'<button class="tile map" data-v="'+m.id+'" style="--a:'+m.sky[0]+';--b:'+m.sky[1]+';--c:'+m.far[1]+'"><i></i><b>'+m.n+'</b></button>').join('');
$('gmTiles').onclick=e=>{const b=e.target.closest('.tile');if(!b)return;if(mode==='online'&&b.dataset.v==='surv'){$('msg').textContent='Survival is solo only.';return}$('msg').textContent='';pickTile('gm',b.dataset.v)};
$('mpTiles').onclick=e=>{const b=e.target.closest('.tile');if(b)pickTile('mp',b.dataset.v)};
syncTiles();
let last=0,acc=0;function frame(t){requestAnimationFrame(frame);acc+=Math.min(100,t-last);last=t;
while(acc>=16.67){acc-=16.67;if(state==='play')tick()}
if(state==='menu')cam.x+=.4;bg();if(PL.length)world();hud()}
requestAnimationFrame(frame);
