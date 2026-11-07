'use strict';
const cv=document.getElementById('c'),g=cv.getContext('2d'),$=id=>document.getElementById(id);
const WW=2800,WH=1100,VH=520,rnd=Math.random,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let W,H,S,VW,DPR=1;
function rs(){DPR=window.devicePixelRatio||1;W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;S=cv.height/VH;VW=cv.width/S}
rs();addEventListener('resize',rs);
// ---- map: [x,y,w,h]
const MAP=[[0,1040,WW,60],[300,900,300,22],[700,800,260,22],[1100,900,300,22],[1500,780,300,22],[1900,900,260,22],[2250,780,300,22],
[500,640,220,22],[1000,600,260,22],[1500,540,260,22],[2000,620,240,22],[150,960,100,80],[1350,960,100,80],[2550,960,100,80],[800,960,60,80]];
const WP={
pistol:{n:'Pistol',ab:'PI',dmg:14,rate:16,mag:12,spd:14,spread:.02,rl:55,pel:1,life:60,kick:.3,len:12},
ak:{n:'AK-47',ab:'AK',dmg:9,rate:5,mag:30,spd:15,spread:.06,rl:85,pel:1,life:60,kick:.25,len:24},
shotgun:{n:'Shotgun',ab:'SG',dmg:9,rate:42,mag:6,spd:13,spread:.16,rl:100,pel:7,life:22,kick:2.2,len:24},
sniper:{n:'Sniper',ab:'SN',dmg:75,rate:75,mag:5,spd:32,spread:0,rl:120,pel:1,life:70,kick:3,len:34},
rocket:{n:'Rocket launcher',ab:'RL',dmg:0,rate:70,mag:2,spd:9,spread:0,rl:120,pel:1,life:200,kick:2.5,len:28,rocket:1}};
const D={easy:{aim:.05,jit:.12},normal:{aim:.09,jit:.06},hard:{aim:.16,jit:.025}};
const TYPES=['ak','shotgun','sniper','rocket','med','gren','ak','med'],rk=()=>TYPES[rnd()*TYPES.length|0];
let PL=[],B=[],G=[],P=[],EX=[],KF=[],PK=[],me=null,state='menu',T=0,TARGET=15,DIFF=D.normal,sh=0,flash=0,hm=0;
const cam={x:0,y:0};
// ---- sound
let ac;function snd(f,d,t='square',v=.04,f2){try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),n=ac.createGain(),a=ac.currentTime;
o.type=t;o.frequency.setValueAtTime(f,a);o.frequency.exponentialRampToValueAtTime(f2||f/3,a+d);n.gain.setValueAtTime(v,a);n.gain.exponentialRampToValueAtTime(.001,a+d);o.connect(n);n.connect(ac.destination);o.start();o.stop(a+d)}catch(e){}}
const near=o=>!me||Math.abs(o.x-me.x)<800;
// ---- entities
const ov=(a,p)=>a.x<p[0]+p[2]&&a.x+a.w>p[0]&&a.y<p[1]+p[3]&&a.y+a.h>p[1];
const gun=k=>({k,ammo:WP[k].mag,res:WP[k].mag*3}),cw=o=>o.wp[o.cur];
function mk(name,bot,col){return{name,bot,col,x:0,y:0,vx:0,vy:0,w:18,h:34,hp:100,fuel:100,wp:[gun('pistol')],cur:0,aim:0,dir:1,cd:0,rl:0,gren:3,kills:0,deaths:0,dead:0,rs:0,inv:0,on:0,fl:0,wk:0,jf:0,c:{mx:0,up:0,aim:0,fire:0},ai:{t:0,dir:1,low:0}}}
function spawn(o){let best=null,bd=-1;for(let i=0;i<6;i++){const p=MAP[rnd()*MAP.length|0];if(p[2]<150)continue;const x=p[0]+20+rnd()*(p[2]-60),y=p[1]-40;let d=1e9;
for(const q of PL)if(q!==o&&!q.dead)d=Math.min(d,Math.hypot(q.x-x,q.y-y));if(d>bd){bd=d;best=[x,y]}}
if(!best)best=[100,1000];Object.assign(o,{x:best[0],y:best[1],vx:0,vy:0,hp:100,fuel:100,dead:0,inv:120,cur:0,rl:0,gren:3,wp:[gun('pistol')]})}
function move(o){o.vy=Math.min(o.vy+.45,14);o.x+=o.vx;for(const p of MAP)if(ov(o,p)){o.x=o.vx>0?p[0]-o.w:p[0]+p[2];o.vx=0}
o.on=0;o.y+=o.vy;for(const p of MAP)if(ov(o,p)){if(o.vy>0){o.y=p[1]-o.h;o.on=1}else o.y=p[1]+p[3];o.vy=0}
o.x=clamp(o.x,0,WW-o.w);if(o.y<0){o.y=0;o.vy=Math.max(o.vy,0)}}
function pt(x,y,n,c,sp,l,gv=0){for(let i=0;i<n&&P.length<700;i++)P.push({x,y,vx:(rnd()-.5)*sp,vy:(rnd()-.5)*sp,l:l*(.5+rnd()),m:l,c,g:gv})}
const shake=v=>sh=Math.max(sh,v);
// ---- combat
function reload(o){const w=cw(o),d=WP[w.k];if(o.rl>0||w.ammo>=d.mag||w.res<=0)return;o.rl=d.rl;if(o===me)snd(300,.15,'square',.03,500)}
function swap(o){if(o.dead||o.wp.length<2)return;o.cur=1-o.cur;o.rl=0;o.cd=15}
function gren(o){if(o.dead||o.gren<=0)return;o.gren--;G.push({x:o.x+9,y:o.y+10,vx:Math.cos(o.aim)*8+o.vx,vy:Math.sin(o.aim)*8-1.5,t:110,o})}
function shoot(o){const w=cw(o),d=WP[w.k];if(w.ammo<=0){reload(o);return}w.ammo--;o.cd=d.rate;o.fl=4;
for(let i=0;i<d.pel;i++){const a=o.aim+(rnd()-.5)*2*d.spread,l=d.rocket?16:d.len+2;
B.push({x:o.x+9+Math.cos(o.aim)*l,y:o.y+13+Math.sin(o.aim)*l,vx:Math.cos(a)*d.spd,vy:Math.sin(a)*d.spd,o,d:d.dmg,l:d.life,r:d.rocket,big:d.dmg>40})}
o.vx-=Math.cos(o.aim)*d.kick;o.vy-=Math.sin(o.aim)*d.kick*.4;
pt(o.x+9,o.y+12,1,'#d9b94a',3,25,.3);
if(near(o)){snd(w.k==='sniper'?160:w.k==='shotgun'?110:220,.12,'sawtooth',.05)}if(o===me)shake(d.kick*1.4);
if(w.ammo<=0)reload(o)}
function hit(q,d,by,kx=0){if(q.dead||q.inv>0)return;q.hp-=d;q.vx+=kx;if(q===me)flash=14;if(by===me&&q!==me)hm=10;if(q.hp<=0)die(q,by)}
function die(q,by){q.dead=1;q.rs=q===me?180:150;q.deaths++;const k=by&&by!==q;if(k)by.kills++;
KF.unshift({t:k?by.name+' killed '+q.name:q.name+' fell',ttl:300});KF.length=Math.min(KF.length,4);
pt(q.x+9,q.y+17,40,'#b00',9,40,.25);pt(q.x+9,q.y+17,14,q.col,7,40,.25);snd(120,.3,'sawtooth',.06,30);
const w=cw(q);if(w.k!=='pistol')PK.push({x:q.x,y:q.y+14,w:20,h:16,vx:0,vy:0,k:w.k,t:0,on:0,drop:1,ttl:900});
if(k&&by.kills>=TARGET)over(by)}
function boom(x,y,r,d,by){for(const q of PL){if(q.dead)continue;const cx=q.x+9,cy=q.y+17,dist=Math.hypot(cx-x,cy-y);
if(dist<r){const f=1-dist/r,ux=(cx-x)/(dist||1),uy=(cy-y)/(dist||1);hit(q,d*f,by,ux*f*9);q.vy+=uy*f*9-2*f}}
pt(x,y,50,'#ff9a2e',12,30);pt(x,y,25,'#555',6,55,-.05);EX.push({x,y,r:0,m:r,l:14});shake(14);if(near({x}))snd(90,.45,'sawtooth',.09,25)}
function over(w){state='over';$('end').hidden=false;$('endt').textContent=(w===me?'Victory! ':w.name+' wins. ')+'Your K/D: '+me.kills+'/'+me.deaths}
// ---- updates
function upd(o){const c=o.c;o.inv>0&&o.inv--;o.fl>0&&o.fl--;o.cd>0&&o.cd--;
o.aim=c.aim;o.dir=Math.cos(o.aim)<0?-1:1;
if(Math.abs(o.vx)<4)o.vx+=c.mx*(o.on?.7:.4);o.vx*=o.on&&!c.mx?.75:.97;
if(c.up&&o.fuel>0){o.vy=Math.max(o.vy-.85,-6.5);o.fuel-=.7;o.jf=1;if(T%2)pt(o.x+(o.dir>0?5:13),o.y+24,1,'#ffa030',2,14,.1)}
else{o.jf=0;o.fuel=Math.min(100,o.fuel+(o.on?1.4:.12))}
move(o);if(o.on)o.wk+=Math.abs(o.vx)*.15;
if(o.rl>0&&--o.rl===0){const w=cw(o),n=Math.min(WP[w.k].mag-w.ammo,w.res);w.ammo+=n;w.res-=n}
if(c.fire&&o.cd<=0&&o.rl<=0)shoot(o);if(o.y>WH+50)hit(o,999,null)}
function los(a,b){const x1=a.x+9,y1=a.y+13,x2=b.x+9,y2=b.y+13;for(let i=1;i<14;i++){const x=x1+(x2-x1)*i/14,y=y1+(y2-y1)*i/14;for(const p of MAP)if(x>p[0]&&x<p[0]+p[2]&&y>p[1]&&y<p[1]+p[3])return 0}return 1}
function ai(o){const c=o.c,a=o.ai;let t=null,bd=1e9;for(const q of PL)if(q!==o&&!q.dead){const d=Math.hypot(q.x-o.x,q.y-o.y);if(d<bd){bd=d;t=q}}
c.fire=0;c.up=0;c.mx=0;if(!t)return;
const dx=t.x-o.x,dy=t.y-o.y;let df=Math.atan2(dy-4,dx)-o.aim;df=Math.atan2(Math.sin(df),Math.cos(df));c.aim=o.aim+df*DIFF.aim+(rnd()-.5)*DIFF.jit;
const see=los(o,t);if(--a.t<=0){a.t=40+rnd()*80;a.dir=rnd()<.5?-1:1}
if(see){c.mx=bd>320?Math.sign(dx):bd<140?-Math.sign(dx):a.dir*.7;c.fire=bd<650&&Math.abs(df)<.2?1:0}else c.mx=Math.sign(dx)||1;
if(dy<-40&&o.fuel>8)c.up=1;if(Math.abs(o.vx)<.4&&c.mx&&o.fuel>5)c.up=1;
if(o.fuel<10)a.low=1;if(o.fuel>50)a.low=0;if(a.low)c.up=0;
if(see&&bd>150&&bd<400&&rnd()<.004)gren(o);
if(cw(o).k==='pistol'&&o.wp.length>1&&rnd()<.02)swap(o);
const need=o.hp<45?p=>p.k==='med':o.wp.length<2?p=>p.k!=='med'&&p.k!=='gren':null;
if(need){let m=null,md=900;for(const p of PK)if(!p.t&&need(p)){const d=Math.abs(p.x-o.x)+Math.abs(p.y-o.y);if(d<md){md=d;m=p}}
if(m){c.mx=Math.sign(m.x-o.x);if(m.y<o.y-20&&o.fuel>8)c.up=1}}}
function take(q,p){if(p.k==='med'){if(q.hp>=100)return 0;q.hp=Math.min(100,q.hp+50);return 1}
if(p.k==='gren'){if(q.gren>=5)return 0;q.gren=Math.min(5,q.gren+2);return 1}
const h=q.wp.find(w=>w.k===p.k);if(h){h.res+=WP[p.k].mag*2}else if(q.wp.length<2){q.wp.push(gun(p.k));q.cur=1;q.rl=0}else{q.wp[q.cur]=gun(p.k);q.rl=0}
if(q===me)snd(500,.1,'square',.04,900);return 1}
function tick(){T++;pctl();
for(const o of PL){if(o.dead){if(--o.rs<=0)spawn(o);continue}if(o.bot)ai(o);upd(o)}
for(const b of B){for(let s=0;s<3&&b.l>0;s++){b.x+=b.vx/3;b.y+=b.vy/3;if(b.x<0||b.x>WW||b.y>WH||b.y<-100){b.l=0;break}
let hw=0;for(const p of MAP)if(b.x>p[0]&&b.x<p[0]+p[2]&&b.y>p[1]&&b.y<p[1]+p[3]){hw=1;break}
if(hw){b.l=0;if(b.r)boom(b.x-b.vx/3,b.y-b.vy/3,95,110,b.o);else pt(b.x,b.y,5,'#ffd27a',4,12);break}
for(const q of PL)if(q!==b.o&&!q.dead&&b.x>q.x&&b.x<q.x+q.w&&b.y>q.y&&b.y<q.y+q.h){b.l=0;if(b.r)boom(b.x,b.y,95,110,b.o);else{hit(q,b.d*(b.y<q.y+9?1.5:1),b.o,b.vx*.05);pt(b.x,b.y,6,'#c00',4,20,.2)}break}}
b.l--;if(b.r)pt(b.x,b.y,1,'#bbb',1.5,20)}
B=B.filter(b=>b.l>0);
for(const n of G){n.vy+=.4;const bx={x:n.x-3,y:n.y-3,w:6,h:6};n.x+=n.vx;bx.x=n.x-3;if(MAP.some(p=>ov(bx,p))){n.x-=n.vx;n.vx*=-.5}
n.y+=n.vy;bx.y=n.y-3;bx.x=n.x-3;if(MAP.some(p=>ov(bx,p))){n.y-=n.vy;n.vy*=-.45;n.vx*=.8}if(--n.t<=0)boom(n.x,n.y,105,95,n.o)}
G=G.filter(n=>n.t>0);
for(const p of PK){move(p);if(p.t>0){if(--p.t===0)p.k=rk();continue}if(p.drop&&--p.ttl<0){p.gone=1;continue}
for(const q of PL)if(!q.dead&&ov(q,[p.x,p.y,p.w,p.h])&&take(q,p)){if(p.drop)p.gone=1;else p.t=800;break}}
PK=PK.filter(p=>!p.gone);
for(const p of P){p.vx*=.98;p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.l--}P=P.filter(p=>p.l>0);
for(const e of EX){e.r+=(e.m-e.r)*.35;e.l--}EX=EX.filter(e=>e.l>0);
for(const k of KF)k.ttl--;KF=KF.filter(k=>k.ttl>0);
const tx=clamp(me.x+9-VW/2+Math.cos(me.aim)*60,0,Math.max(0,WW-VW)),ty=clamp(me.y-VH/2+60+Math.sin(me.aim)*40,0,WH-VH);cam.x+=(tx-cam.x)*.1;cam.y+=(ty-cam.y)*.1;
sh*=.88;flash>0&&flash--;hm>0&&hm--}
// ---- input
const key={};let mx=0,my=0,md=0,touchUse=false;const tp={};
addEventListener('keydown',e=>{key[e.code]=1;if(!me||state!=='play')return;if(e.code==='KeyG')gren(me);if(e.code==='KeyR')reload(me);if(e.code==='KeyQ'||e.code==='KeyE')swap(me);if(e.code==='Space'||e.code.startsWith('Arrow'))e.preventDefault()});
addEventListener('keyup',e=>key[e.code]=0);
cv.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){if(e.button===0)md=1;return}touchUse=true;const s=e.clientX<W/2?'L':'R';
if(!tp[s]){tp[s]={id:e.pointerId,ox:e.clientX,oy:e.clientY,x:e.clientX,y:e.clientY};cv.setPointerCapture&&cv.setPointerCapture(e.pointerId)}});
cv.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){mx=e.clientX;my=e.clientY;return}for(const s in tp)if(tp[s].id===e.pointerId){tp[s].x=e.clientX;tp[s].y=e.clientY}});
const pu=e=>{if(e.pointerType==='mouse'){md=0;return}for(const s in tp)if(tp[s].id===e.pointerId)delete tp[s]};
cv.addEventListener('pointerup',pu);cv.addEventListener('pointercancel',pu);
cv.addEventListener('contextmenu',e=>e.preventDefault());
[['bG',()=>gren(me)],['bS',()=>swap(me)],['bR',()=>reload(me)]].forEach(([id,f])=>{$(id).onpointerdown=e=>{e.preventDefault();touchUse=true;if(state==='play')f()}});
function pctl(){const c=me.c;let m=(key.KeyD||key.ArrowRight?1:0)-(key.KeyA||key.ArrowLeft?1:0),up=!!(key.KeyW||key.Space||key.ArrowUp),fire=!!md,aim=null;
if(!touchUse)aim=Math.atan2(cam.y+my*DPR/S-(me.y+13),cam.x+mx*DPR/S-(me.x+9));
const L=tp.L,R=tp.R;if(L){const dx=L.x-L.ox,dy=L.y-L.oy;m=Math.abs(dx)>10?clamp(dx/50,-1,1):0;up=dy<-25}
if(R){const dx=R.x-R.ox,dy=R.y-R.oy,l=Math.hypot(dx,dy);if(l>8)aim=Math.atan2(dy,dx);fire=l>45}
c.mx=m;c.up=up;c.fire=fire;if(aim!==null)c.aim=aim}
// ---- drawing
function bg(){g.setTransform(1,0,0,1,0,0);const gr=g.createLinearGradient(0,0,0,cv.height);gr.addColorStop(0,'#5fb3e8');gr.addColorStop(1,'#d6ecf5');g.fillStyle=gr;g.fillRect(0,0,cv.width,cv.height);
g.setTransform(S,0,0,S,0,0);g.fillStyle='#fff6c8';g.beginPath();g.arc(VW-110,80,34,0,7);g.fill();
g.fillStyle='#ffffffcc';for(let i=0;i<9;i++){const L=VW+400,x=((i*330-cam.x*.15)%L+L)%L-200,y=40+(i*53)%150;g.beginPath();g.ellipse(x,y,50,16,0,0,7);g.ellipse(x+30,y-8,34,14,0,0,7);g.fill()}
[[.2,'#9bbdb0',470],[.4,'#6f9a85',500]].forEach(([f,col,base])=>{g.fillStyle=col;const by=base-cam.y*.25,o=cam.x*f,k=Math.floor(o/260);
for(let i=-1;i<VW/260+2;i++){const idx=i+k,h=90+(((idx*7919)%60)+60)%60,bx=i*260-(o%260);g.beginPath();g.moveTo(bx-30,by+40);g.lineTo(bx+130,by-h);g.lineTo(bx+290,by+40);g.fill()}g.fillRect(0,by+30,VW,600)})}
function plat(p){const xs=Math.max(p[0],cam.x-30),xe=Math.min(p[0]+p[2],cam.x+VW+30);if(xe<=xs||p[1]>cam.y+VH+60||p[1]+p[3]<cam.y)return;
g.fillStyle='#7a5a3c';g.fillRect(xs,p[1],xe-xs,p[3]);g.fillStyle='#5aa84a';g.fillRect(xs,p[1],xe-xs,7);g.fillStyle='#46883a';g.fillRect(xs,p[1]+7,xe-xs,3);
g.fillStyle='#00000026';const y1=Math.min(p[1]+p[3],cam.y+VH+20);for(let y=p[1]+16;y<y1;y+=16)for(let x=Math.floor(xs/32)*32+((y/16)%2?16:0);x<xe;x+=32)if(x>=p[0]&&x+12<=p[0]+p[2])g.fillRect(x,y,12,4)}
function drawP(o){if(o.dead)return;const d=o.dir,w=cw(o),L=WP[w.k].len,sw=o.on?Math.sin(o.wk)*7:3;g.save();g.translate(o.x+9,o.y);if(o.inv>0&&T%8<4)g.globalAlpha=.4;
g.fillStyle='#555';g.fillRect(d>0?-13:7,8,6,15);
if(o.jf){g.fillStyle='#ff9a2e';const fx=d>0?-10:10,fl=9+rnd()*8;g.beginPath();g.moveTo(fx-3,23);g.lineTo(fx+3,23);g.lineTo(fx,23+fl);g.fill()}
g.strokeStyle='#222';g.lineWidth=4;g.beginPath();g.moveTo(-3,24);g.lineTo(-3+sw,34);g.moveTo(3,24);g.lineTo(3-sw,34);g.stroke();
g.fillStyle=o.col;g.fillRect(-7,8,14,17);g.fillStyle='#f1c27d';g.beginPath();g.arc(0,5,6,0,7);g.fill();
g.fillStyle='#3d4a2e';g.beginPath();g.arc(0,4,6.8,Math.PI,0);g.fill();g.fillStyle='#000';g.fillRect(d*2.5,4,2,2);
g.translate(0,14);g.rotate(o.aim);if(d<0)g.scale(1,-1);
g.fillStyle='#222';g.fillRect(2,-3,L,5);g.fillStyle='#444';g.fillRect(2,-3,L*.4,8);g.strokeStyle='#f1c27d';g.lineWidth=3;g.beginPath();g.moveTo(0,0);g.lineTo(9,0);g.stroke();
if(o.fl>0){g.fillStyle='#ffe27a';g.beginPath();g.arc(L+6,0,5,0,7);g.fill()}
g.restore();
if(o!==me){g.fillStyle='#0008';g.fillRect(o.x-2,o.y-9,22,4);g.fillStyle=o.col;g.fillRect(o.x-1,o.y-8,20*Math.max(0,o.hp)/100,2);g.fillStyle='#fff';g.font='10px sans-serif';g.textAlign='center';g.fillText(o.name,o.x+9,o.y-13)}}
function world(){const sx=(rnd()-.5)*sh,sy=(rnd()-.5)*sh;g.setTransform(S,0,0,S,0,0);g.translate(-cam.x+sx,-cam.y+sy);
MAP.forEach(plat);
for(const p of PK){if(p.t>0)continue;const y=p.y+(p.drop?0:Math.sin(T*.08+p.x)*2);g.fillStyle=p.k==='med'?'#f4f4f4':p.k==='gren'?'#4a5a3a':'#a8782f';g.fillRect(p.x,y,20,16);g.strokeStyle='#222';g.lineWidth=1.5;g.strokeRect(p.x,y,20,16);
if(p.k==='med'){g.fillStyle='#d22';g.fillRect(p.x+8,y+3,4,10);g.fillRect(p.x+5,y+6,10,4)}else{g.fillStyle='#fff';g.font='bold 9px sans-serif';g.textAlign='center';g.fillText(p.k==='gren'?'GR':WP[p.k].ab,p.x+10,y+11)}}
for(const o of PL)drawP(o);
for(const b of B){if(b.r){g.fillStyle='#ddd';g.fillRect(b.x-5,b.y-2,10,4);g.fillStyle='#e33';g.fillRect(b.x+(b.vx>0?3:-5),b.y-2,3,4)}else{g.strokeStyle=b.big?'#fff':'#ffe27a';g.lineWidth=b.big?2.5:1.8;g.beginPath();g.moveTo(b.x-b.vx*1.3,b.y-b.vy*1.3);g.lineTo(b.x,b.y);g.stroke()}}
for(const n of G){g.fillStyle=n.t%20<10?'#3d5a2a':'#c33';g.beginPath();g.arc(n.x,n.y,5,0,7);g.fill()}
for(const e of EX){g.fillStyle=`rgba(255,${150+e.l*6},50,${e.l/20})`;g.beginPath();g.arc(e.x,e.y,e.r,0,7);g.fill()}
for(const p of P){g.globalAlpha=Math.min(1,p.l/p.m*1.5);g.fillStyle=p.c;g.fillRect(p.x,p.y,3,3)}g.globalAlpha=1}
function hud(){g.setTransform(DPR,0,0,DPR,0,0);if(state==='menu'||!me)return;
if(flash>0){g.fillStyle=`rgba(200,0,0,${flash/40})`;g.fillRect(0,0,W,H)}
const bar=(x,y,w,v,c)=>{g.fillStyle='#0009';g.fillRect(x,y,w,11);g.fillStyle=c;g.fillRect(x+1,y+1,(w-2)*Math.max(0,v)/100,9)};
bar(12,12,130,me.hp,'#e5483a');bar(12,27,130,me.fuel,'#f0b429');
const w=cw(me),d=WP[w.k];g.fillStyle='#fff';g.font='bold 13px sans-serif';g.textAlign='left';g.fillText(d.n+'  '+(me.rl>0?'reloading...':w.ammo+' / '+w.res)+'   Grenades '+me.gren,12,56);
g.textAlign='right';const s=[...PL].sort((a,b)=>b.kills-a.kills);g.font='bold 13px sans-serif';
s.forEach((o,i)=>{g.fillStyle=o===me?'#ffd54a':'#fff';g.fillText(o.name+'  '+o.kills,W-12,20+i*16)});
g.fillStyle='#ffffffaa';g.font='11px sans-serif';g.fillText('First to '+TARGET,W-12,20+s.length*16);
KF.forEach((k,i)=>{g.globalAlpha=Math.min(1,k.ttl/60);g.fillStyle='#fff';g.fillText(k.t,W-12,46+s.length*16+i*14)});g.globalAlpha=1;
const bw=W>560?150:100,bh=bw*.45,bx=W/2-bw/2,k=bw/WW;g.fillStyle='#0007';g.fillRect(bx,8,bw,bh);g.fillStyle='#8fd18a';
for(const p of MAP)g.fillRect(bx+p[0]*k,8+p[1]*k,Math.max(1.5,p[2]*k),Math.max(1.5,p[3]*k));
for(const o of PL)if(!o.dead){g.fillStyle=o===me?'#fff':o.col;g.fillRect(bx+o.x*k-1.5,8+o.y*k-1.5,3,3)}
if(me.dead){g.fillStyle='#fff';g.font='bold 22px sans-serif';g.textAlign='center';g.fillText('Respawning in '+Math.ceil(me.rs/60),W/2,H/2)}
if(!touchUse){const c=hm>0?'#f33':'#fff';g.strokeStyle=c;g.lineWidth=2;g.beginPath();g.arc(mx,my,8,0,7);g.moveTo(mx-13,my);g.lineTo(mx-5,my);g.moveTo(mx+5,my);g.lineTo(mx+13,my);g.moveTo(mx,my-13);g.lineTo(mx,my-5);g.moveTo(mx,my+5);g.lineTo(mx,my+13);g.stroke()}
for(const s2 in tp){const t=tp[s2];let dx=t.x-t.ox,dy=t.y-t.oy;const l=Math.hypot(dx,dy);if(l>50){dx*=50/l;dy*=50/l}
g.strokeStyle='#ffffff77';g.lineWidth=3;g.beginPath();g.arc(t.ox,t.oy,50,0,7);g.stroke();g.fillStyle='#ffffff99';g.beginPath();g.arc(t.ox+dx,t.oy+dy,20,0,7);g.fill()}}
// ---- flow
function start(){const nb=+$('nb').value;DIFF=D[$('df').value];TARGET=+$('kt').value;
const names=['Rex','Vex','Kilo','Nova','Zed'],cols=['#d9382c','#2f9e44','#e8890c','#8e44ad','#16a2b8'];
PL=[me=mk('You',0,'#2f6fe0')];for(let i=0;i<nb;i++)PL.push(mk(names[i],1,cols[i]));
B=[];G=[];P=[];EX=[];KF=[];PK=[];T=0;kills0();PL.forEach(spawn);
MAP.forEach((p,i)=>{if(i>0&&p[2]>=200)PK.push({x:p[0]+p[2]/2-10,y:p[1]-16,w:20,h:16,vx:0,vy:0,on:0,k:rk(),t:0})});
[450,1250,2050].forEach(x=>PK.push({x,y:1020,w:20,h:16,vx:0,vy:0,on:0,k:rk(),t:0}));
cam.x=clamp(me.x-VW/2,0,Math.max(0,WW-VW));cam.y=clamp(me.y-VH/2,0,WH-VH);
$('menu').hidden=true;$('end').hidden=true;state='play'}
function kills0(){for(const o of PL){o.kills=0;o.deaths=0}}
$('play').onclick=start;$('again').onclick=()=>{$('end').hidden=true;$('menu').hidden=false;state='menu';PL=[];me=null};
let last=0,acc=0;function frame(t){requestAnimationFrame(frame);acc+=Math.min(100,t-last);last=t;
while(acc>=16.67){acc-=16.67;if(state==='play')tick()}
bg();if(PL.length)world();hud()}
requestAnimationFrame(frame);
  
