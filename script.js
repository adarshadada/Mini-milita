'use strict';
const cv=document.getElementById('c'),g=cv.getContext('2d'),$=id=>document.getElementById(id);
const WW=2800,WH=1100,VH=520,rnd=Math.random,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const SUPABASE_URL='https://nnjekivahsvdwjjdzisf.supabase.co',SUPABASE_KEY='sb_publishable_3cx0KeGDrm0TY5kdKpgGgg_4pElQRrw';
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
const TYPES=['med','gren','med'],rk=s=>TYPES[(Math.imul((s|0)+1,2654435761)>>>8)%TYPES.length];
let PL=[],B=[],G=[],P=[],EX=[],KF=[],PK=[],me=null,state='menu',T=0,TARGET=15,DIFF=D.normal,sh=0,flash=0,hm=0;
const cam={x:0,y:0};let online=false,user=null,god=false,godPref=false,TEAMS=false,outShots=[],dropN=0;const TC=['#2f6fe0','#d9382c'],TN=['Blue','Red'];const addKF=m=>{KF.unshift({t:m,ttl:300});KF.length=Math.min(KF.length,4)};
// ---- sound
let ac;function snd(f,d,t='square',v=.04,f2){try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),n=ac.createGain(),a=ac.currentTime;
o.type=t;o.frequency.setValueAtTime(f,a);o.frequency.exponentialRampToValueAtTime(f2||f/3,a+d);n.gain.setValueAtTime(v,a);n.gain.exponentialRampToValueAtTime(.001,a+d);o.connect(n);n.connect(ac.destination);o.start();o.stop(a+d)}catch(e){}}
const near=o=>!me||Math.abs(o.x-me.x)<800;
// ---- entities
const ov=(a,p)=>a.x<p[0]+p[2]&&a.x+a.w>p[0]&&a.y<p[1]+p[3]&&a.y+a.h>p[1];
const gun=k=>({k,ammo:WP[k].mag,res:WP[k].mag*3}),cw=o=>o.wp[o.cur];
function mk(name,bot,col){return{name,bot,col,x:0,y:0,vx:0,vy:0,w:18,h:34,hp:100,fuel:100,wp:[gun('pistol')],cur:0,aim:0,dir:1,cd:0,rl:0,gren:3,mh:100,mf:100,g0:3,spd:1,rlm:1,dm:1,team:-1,lo:'',av:0,kills:0,deaths:0,dead:0,rs:0,inv:0,on:0,fl:0,wk:0,jf:0,c:{mx:0,up:0,aim:0,fire:0},ai:{t:0,dir:1,low:0}}}
function spawn(o){let best=null,bd=-1;for(let i=0;i<6;i++){const p=MAP[rnd()*MAP.length|0];if(p[2]<150)continue;const x=p[0]+20+rnd()*(p[2]-60),y=p[1]-40;let d=1e9;
for(const q of PL)if(q!==o&&!q.dead)d=Math.min(d,Math.hypot(q.x-x,q.y-y));if(d>bd){bd=d;best=[x,y]}}
if(!best)best=[100,1000];Object.assign(o,{x:best[0],y:best[1],vx:0,vy:0,hp:o.mh,fuel:o.mf,dead:0,inv:120,cur:o.lo?1:0,rl:0,gren:o.g0,wp:o.lo?[gun('pistol'),gun(o.lo)]:[gun('pistol')]})}
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
function hit(q,d,by,kx=0){if(by===me&&q!==me)hm=10;if(q.remote||q.dead||q.inv>0||(q===me&&god))return;q.hp-=d;q.vx+=kx;if(q===me)flash=14;if(q.hp<=0)die(q,by)}
function die(q,by){q.dead=1;q.rs=q===me?180:150;q.deaths++;const k=by&&by!==q;if(k&&!by.remote)by.kills++;const msg=k?by.name+' killed '+q.name:q.name+' fell';addKF(msg);if(online&&q===me)send({t:'d',m:msg,kid:k?by.id:null});
pt(q.x+9,q.y+17,40,'#b00',9,40,.25);pt(q.x+9,q.y+17,14,q.col,7,40,.25);snd(120,.3,'sawtooth',.06,30);

if(k)checkWin()}
function boom(x,y,r,d,by){for(const q of PL){if(q.dead||q.remote||(TEAMS&&q!==by&&q.team===by.team))continue;const cx=q.x+9,cy=q.y+17,dist=Math.hypot(cx-x,cy-y);
if(dist<r){const f=1-dist/r,ux=(cx-x)/(dist||1),uy=(cy-y)/(dist||1);hit(q,d*f,by,ux*f*9);q.vy+=uy*f*9-2*f}}
pt(x,y,50,'#ff9a2e',12,30);pt(x,y,25,'#555',6,55,-.05);EX.push({x,y,r:0,m:r,l:14});shake(14);if(near({x}))snd(90,.45,'sawtooth',.09,25)}
function over(){}
// ---- updates
function upd(o){const c=o.c;o.inv>0&&o.inv--;o.fl>0&&o.fl--;o.cd>0&&o.cd--;
o.aim=c.aim;o.dir=Math.cos(o.aim)<0?-1:1;
if(Math.abs(o.vx)<4*o.spd)o.vx+=c.mx*(o.on?.7:.4)*o.spd;o.vx*=o.on&&!c.mx?.75:.97;
if(c.up&&o.fuel>0){o.vy=Math.max(o.vy-.85,-6.5);o.fuel-=.7;o.jf=1;if(T%2)pt(o.x+(o.dir>0?5:13),o.y+24,1,'#ffa030',2,14,.1)}
else{o.jf=0;o.fuel=Math.min(o.mf,o.fuel+(o.on?1.4:.12))}
move(o);if(o.on)o.wk+=Math.abs(o.vx)*.15;
if(o.rl>0&&--o.rl===0){const w=cw(o),n=Math.min(WP[w.k].mag-w.ammo,w.res);w.ammo+=n;w.res-=n}
if(c.fire&&o.cd<=0&&o.rl<=0)shoot(o);if(o.y>WH+50){if(o===me&&god){o.y=0;o.vy=0}else hit(o,999,null)}}
function los(a,b){const x1=a.x+9,y1=a.y+13,x2=b.x+9,y2=b.y+13;for(let i=1;i<14;i++){const x=x1+(x2-x1)*i/14,y=y1+(y2-y1)*i/14;for(const p of MAP)if(x>p[0]&&x<p[0]+p[2]&&y>p[1]&&y<p[1]+p[3])return 0}return 1}
function ai(o){const c=o.c,a=o.ai;let t=null,bd=1e9;for(const q of PL)if(q!==o&&!q.dead&&!(TEAMS&&q.team===o.team)){const d=Math.hypot(q.x-o.x,q.y-o.y);if(d<bd){bd=d;t=q}}
c.fire=0;c.up=0;c.mx=0;if(!t)return;
const dx=t.x-o.x,dy=t.y-o.y;let df=Math.atan2(dy-4,dx)-o.aim;df=Math.atan2(Math.sin(df),Math.cos(df));c.aim=o.aim+df*DIFF.aim+(rnd()-.5)*DIFF.jit;
const see=los(o,t);if(--a.t<=0){a.t=40+rnd()*80;a.dir=rnd()<.5?-1:1}
if(see){c.mx=bd>320?Math.sign(dx):bd<140?-Math.sign(dx):a.dir*.7;c.fire=bd<650&&Math.abs(df)<.2?1:0}else c.mx=Math.sign(dx)||1;
if(dy<-40&&o.fuel>8)c.up=1;if(Math.abs(o.vx)<.4&&c.mx&&o.fuel>5)c.up=1;
if(o.fuel<10)a.low=1;if(o.fuel>50)a.low=0;if(a.low)c.up=0;
if(see&&bd>150&&bd<400&&rnd()<.004)gren(o);
if(cw(o).k==='pistol'&&o.wp.length>1&&rnd()<.02)swap(o);
const need=o.hp<45?p=>p.k==='med':null;
if(need){let m=null,md=900;for(const p of PK)if(!p.t&&need(p)){const d=Math.abs(p.x-o.x)+Math.abs(p.y-o.y);if(d<md){md=d;m=p}}
if(m){c.mx=Math.sign(m.x-o.x);if(m.y<o.y-20&&o.fuel>8)c.up=1}}}
function take(q,p){if(p.k==='med'){if(q.hp>=q.mh)return 0;q.hp=Math.min(q.mh,q.hp+50);return 1}
if(p.k==='gren'){if(q.gren>=5)return 0;q.gren=Math.min(5,q.gren+2);return 1}
const h=q.wp.find(w=>w.k===p.k);if(h){h.res+=WP[p.k].mag*2}else if(q.wp.length<2){q.wp.push(gun(p.k));q.cur=1;q.rl=0}else{q.wp[q.cur]=gun(p.k);q.rl=0}
if(q===me)snd(500,.1,'square',.04,900);return 1}
function tick(){T++;if(god&&me&&!me.dead)me.hp=me.mh;pctl();
for(const o of PL){if(o.remote){remoteStep(o);continue}if(o.dead){if(--o.rs<=0)spawn(o);continue}if(o.bot)ai(o);upd(o)}
for(const b of B){for(let s=0;s<3&&b.l>0;s++){b.x+=b.vx/3;b.y+=b.vy/3;if(b.x<0||b.x>WW||b.y>WH||b.y<-100){b.l=0;break}
let hw=0;for(const p of MAP)if(b.x>p[0]&&b.x<p[0]+p[2]&&b.y>p[1]&&b.y<p[1]+p[3]){hw=1;break}
if(hw){b.l=0;if(b.r)boom(b.x-b.vx/3,b.y-b.vy/3,95,110,b.o);else pt(b.x,b.y,5,'#ffd27a',4,12);break}
for(const q of PL)if(q!==b.o&&!q.dead&&!(b.o.remote&&q.remote)&&!(TEAMS&&q.team===b.o.team)&&b.x>q.x&&b.x<q.x+q.w&&b.y>q.y&&b.y<q.y+q.h){b.l=0;if(b.r)boom(b.x,b.y,95,110,b.o);else{hit(q,b.d*(b.y<q.y+9?1.5:1),b.o,b.vx*.05);pt(b.x,b.y,6,'#c00',4,20,.2)}break}}
b.l--;if(b.r)pt(b.x,b.y,1,'#bbb',1.5,20)}
B=B.filter(b=>b.l>0);
for(const n of G){n.vy+=.4;const bx={x:n.x-3,y:n.y-3,w:6,h:6};n.x+=n.vx;bx.x=n.x-3;if(MAP.some(p=>ov(bx,p))){n.x-=n.vx;n.vx*=-.5}
n.y+=n.vy;bx.y=n.y-3;bx.x=n.x-3;if(MAP.some(p=>ov(bx,p))){n.y-=n.vy;n.vy*=-.45;n.vx*=.8}if(--n.t<=0)boom(n.x,n.y,105,95,n.o)}
G=G.filter(n=>n.t>0);
for(const p of PK){move(p);if(p.t>0){if(--p.t===0)p.k=rk(p.seed+=7);continue}if(p.drop&&--p.ttl<0){p.gone=1;continue}
for(const q of PL)if(!q.dead&&!q.remote&&ov(q,[p.x,p.y,p.w,p.h])&&take(q,p)){if(p.drop)p.gone=1;else p.t=800;if(online)send({t:'k',id:p.id});break}}
PK=PK.filter(p=>!p.gone);
for(const p of P){p.vx*=.98;p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.l--}P=P.filter(p=>p.l>0);
for(const e of EX){e.r+=(e.m-e.r)*.35;e.l--}EX=EX.filter(e=>e.l>0);
for(const k of KF)k.ttl--;KF=KF.filter(k=>k.ttl>0);
const tx=clamp(me.x+9-VW/2+Math.cos(me.aim)*60,0,Math.max(0,WW-VW)),ty=clamp(me.y-VH/2+60+Math.sin(me.aim)*40,0,WH-VH);cam.x+=(tx-cam.x)*.1;cam.y+=(ty-cam.y)*.1;
netTick();sh*=.88;flash>0&&flash--;hm>0&&hm--}
// ---- input
const key={};let mx=0,my=0,md=0,touchUse=false;const tp={};
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT')return;key[e.code]=1;if(e.code==='KeyF')toggleFS();if(e.code==='KeyU'&&isAdmin()&&state==='play'){god=!god;godPref=god;$('god').checked=god}if(!me||state!=='play')return;if(e.code==='KeyG')gren(me);if(e.code==='KeyR')reload(me);if(e.code==='KeyQ'||e.code==='KeyE')swap(me);if(e.code==='Space'||e.code.startsWith('Arrow'))e.preventDefault()});
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
if(o===me?god:o.god){g.strokeStyle='rgba(120,220,255,'+(.55+.3*Math.sin(T*.15))+')';g.lineWidth=2;g.beginPath();g.ellipse(0,18,17,25,0,0,7);g.stroke()}
g.fillStyle='#555';g.fillRect(d>0?-13:7,8,6,15);
if(o.jf){g.fillStyle='#ff9a2e';const fx=d>0?-10:10,fl=9+rnd()*8;g.beginPath();g.moveTo(fx-3,23);g.lineTo(fx+3,23);g.lineTo(fx,23+fl);g.fill()}
g.strokeStyle='#222';g.lineWidth=4;g.beginPath();g.moveTo(-3,24);g.lineTo(-3+sw,34);g.moveTo(3,24);g.lineTo(3-sw,34);g.stroke();
const av=AV[o.av|0]||AV[0];g.fillStyle=TEAMS?o.col:av.b;g.fillRect(-7,8,14,17);headGfx(g,av,d);
g.translate(0,14);g.rotate(o.aim);if(d<0)g.scale(1,-1);
g.fillStyle='#222';g.fillRect(2,-3,L,5);g.fillStyle='#444';g.fillRect(2,-3,L*.4,8);g.strokeStyle=av.s;g.lineWidth=3;g.beginPath();g.moveTo(0,0);g.lineTo(9,0);g.stroke();
if(o.fl>0){g.fillStyle='#ffe27a';g.beginPath();g.arc(L+6,0,5,0,7);g.fill()}
g.restore();
if(o!==me){g.fillStyle='#0008';g.fillRect(o.x-2,o.y-9,22,4);g.fillStyle=o.col;g.fillRect(o.x-1,o.y-8,20*Math.max(0,o.hp)/100,2);g.fillStyle=TEAMS?TC[o.team]:'#fff';g.font='bold 10px sans-serif';g.textAlign='center';g.fillText(o.name,o.x+9,o.y-13)}}
function world(){const sx=(rnd()-.5)*sh,sy=(rnd()-.5)*sh;g.setTransform(S,0,0,S,0,0);g.translate(-cam.x+sx,-cam.y+sy);
MAP.forEach(plat);
for(const p of PK){if(p.t>0)continue;const y=p.y+(p.drop?0:Math.sin(T*.08+p.x)*2);g.fillStyle=p.k==='med'?'#f4f4f4':p.k==='gren'?'#4a5a3a':'#a8782f';g.fillRect(p.x,y,20,16);g.strokeStyle='#222';g.lineWidth=1.5;g.strokeRect(p.x,y,20,16);
if(p.k==='med'){g.fillStyle='#d22';g.fillRect(p.x+8,y+3,4,10);g.fillRect(p.x+5,y+6,10,4)}else{g.fillStyle='#fff';g.font='bold 9px sans-serif';g.textAlign='center';g.fillText(p.k==='gren'?'GR':WP[p.k].ab,p.x+10,y+11)}}
for(const o of PL)drawP(o);
for(const b of B){if(b.r){g.fillStyle='#ddd';g.fillRect(b.x-5,b.y-2,10,4);g.fillStyle='#e33';g.fillRect(b.x+(b.vx>0?3:-5),b.y-2,3,4)}else{g.strokeStyle=b.big?'#fff':'#ffe27a';g.lineWidth=b.big?2.5:1.8;g.beginPath();g.moveTo(b.x-b.vx*1.3,b.y-b.vy*1.3);g.lineTo(b.x,b.y);g.stroke()}}
for(const n of G){g.fillStyle=n.t%20<10?'#3d5a2a':'#c33';g.beginPath();g.arc(n.x,n.y,5,0,7);g.fill()}
for(const e of EX){g.fillStyle=`rgba(255,${150+e.l*6},50,${e.l/20})`;g.beginPath();g.arc(e.x,e.y,e.r,0,7);g.fill()}
for(const p of P){g.globalAlpha=Math.min(1,p.l/p.m*1.5);g.fillStyle=p.c;g.fillRect(p.x,p.y,3,3)}g.globalAlpha=1}
function rr(x,y,w,h,r,f){g.fillStyle=f;g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();g.fill()}
function hud(){g.setTransform(DPR,0,0,DPR,0,0);if(state==='menu'||!me)return;const PN='#141b0eb8';
if(flash>0){g.fillStyle=`rgba(200,0,0,${flash/40})`;g.fillRect(0,0,W,H)}
const bar=(x,y,w,v,c,l)=>{g.fillStyle='#fff';g.font='bold 10px sans-serif';g.textAlign='left';g.fillText(l,x,y+8);g.fillStyle='#0006';g.fillRect(x+34,y,w,9);g.fillStyle=c;g.fillRect(x+35,y+1,(w-2)*Math.max(0,v)/100,7)};
rr(10,10,176,40,8,PN);bar(18,16,124,me.hp/me.mh*100,'#e5483a','HP');bar(18,30,124,me.fuel/me.mf*100,'#f0b429','FUEL');
if(god){rr(194,10,100,24,6,PN);g.fillStyle='#7fe3ff';g.font='bold 11px sans-serif';g.textAlign='center';g.fillText('UNKILLABLE',244,26)}
const w=cw(me),d=WP[w.k],pw=210,px=W/2-pw/2,py=H-58;rr(px,py,pw,48,8,PN);
g.textAlign='left';g.font='bold 12px sans-serif';g.fillStyle='#d8c88a';g.fillText(d.n,px+12,py+19);g.fillStyle='#fff';g.fillText('Grenades '+me.gren,px+12,py+38);
g.textAlign='right';g.font='bold 24px sans-serif';g.fillStyle=me.rl>0?'#ff9a2e':'#fff';g.fillText(w.ammo,px+pw-58,py+33);g.font='13px sans-serif';g.fillStyle='#cfc79f';g.fillText('/ '+w.res,px+pw-12,py+33);
if(me.rl>0){g.fillStyle='#ff9a2e';g.fillRect(px+8,py+43,(pw-16)*(1-me.rl/d.rl),2)}
const tt=[0,0];if(TEAMS)for(const o of PL)if(o.team>=0)tt[o.team]+=o.kills;const s=[...PL].sort((a,b)=>TEAMS?(a.team-b.team||b.kills-a.kills):b.kills-a.kills),sw=164,sx=W-sw-10,sh2=26+s.length*17;rr(sx,10,sw,sh2,8,PN);
g.textAlign='left';g.font='11px sans-serif';g.fillStyle='#cfc79f';g.fillText(TEAMS?'Blue '+tt[0]+'   Red '+tt[1]+'   to '+TARGET:(online?'Room '+roomCode+', ':'')+'first to '+TARGET,sx+10,26);
s.forEach((o,i)=>{const y=44+i*17;g.fillStyle=o.col;g.fillRect(sx+10,y-9,8,8);g.fillStyle=o===me?'#ffd54a':'#fff';g.font='bold 12px sans-serif';g.textAlign='left';g.fillText(o.name.slice(0,12),sx+24,y);g.textAlign='right';g.fillText(o.kills,sx+sw-10,y)});
g.font='12px sans-serif';g.textAlign='right';KF.forEach((k,i)=>{g.globalAlpha=Math.min(1,k.ttl/60);g.fillStyle='#fff';g.fillText(k.t,W-12,28+sh2+i*15)});g.globalAlpha=1;
const bw=W>560?150:100,bh=bw*.45,bx=W/2-bw/2,k=bw/WW;rr(bx,8,bw,bh,6,PN);g.fillStyle='#8fd18a';
for(const p of MAP)g.fillRect(bx+p[0]*k,8+p[1]*k,Math.max(1.5,p[2]*k),Math.max(1.5,p[3]*k));
for(const o of PL)if(!o.dead){g.fillStyle=o===me?'#fff':o.col;g.fillRect(bx+o.x*k-1.5,8+o.y*k-1.5,3,3)}
if(me.dead){g.fillStyle='#fff';g.font='bold 22px sans-serif';g.textAlign='center';g.fillText('Respawning in '+Math.ceil(me.rs/60),W/2,H/2)}
if(!touchUse){g.strokeStyle=hm>0?'#f33':'#fff';g.lineWidth=2;g.beginPath();g.arc(mx,my,8,0,7);g.moveTo(mx-13,my);g.lineTo(mx-5,my);g.moveTo(mx+5,my);g.lineTo(mx+13,my);g.moveTo(mx,my-13);g.lineTo(mx,my-5);g.moveTo(mx,my+5);g.lineTo(mx,my+13);g.stroke()}
for(const s2 in tp){const t=tp[s2];let dx=t.x-t.ox,dy=t.y-t.oy;const l=Math.hypot(dx,dy);if(l>50){dx*=50/l;dy*=50/l}
g.strokeStyle='#ffffff77';g.lineWidth=3;g.beginPath();g.arc(t.ox,t.oy,50,0,7);g.stroke();g.fillStyle='#ffffff99';g.beginPath();g.arc(t.ox+dx,t.oy+dy,20,0,7);g.fill()}}
// ---- network (Supabase Realtime broadcast, publishable key only)
const myId=Math.random().toString(36).slice(2,10);let sb=null,ch=null,roomCode='lobby';
const send=p=>{if(ch)try{ch.send({type:'broadcast',event:'e',payload:p})}catch(e){}};
function sendState(){const c=cw(me),f=(v,n)=>+v.toFixed(n);send({t:'s',id:myId,n:me.name,c:me.col,x:f(me.x,1),y:f(me.y,1),vx:f(me.vx,2),vy:f(me.vy,2),a:f(me.aim,3),h:Math.round(me.hp/me.mh*100),tm:me.team,gd:god?1:0,av:me.av,d:me.dead,k:me.kills,dd:me.deaths,w:c.k,jf:me.jf,on:me.on,inv:me.inv>0?1:0,sh:outShots.length?outShots:undefined});outShots=[]}
function mkRemote(id,n,c){const o=mk(n,0,c);o.remote=1;o.id=id;o.seen=performance.now();o.dead=1;o.tx=0;o.ty=0;return o}
function remoteStep(o){o.fl>0&&o.fl--;if(o.dead)return;if(performance.now()-o.seen>250){o.vx=0;o.vy=0}
o.tx+=o.vx;o.ty+=o.vy;o.x+=(o.tx-o.x)*.3;o.y+=(o.ty-o.y)*.3;if(Math.abs(o.tx-o.x)>250){o.x=o.tx;o.y=o.ty}
if(o.on)o.wk+=Math.abs(o.vx)*.15;if(o.jf&&T%2)pt(o.x+(o.dir>0?5:13),o.y+24,1,'#ffa030',2,14,.1)}
function onMsg(p){if(state!=='play'||!p||!me)return;
if(p.t==='s'){if(p.id===myId)return;let o=PL.find(q=>q.id===p.id);
if(!o){o=mkRemote(p.id,p.n,p.c);o.x=o.tx=p.x;o.y=o.ty=p.y;PL.push(o);addKF(p.n+' joined')}
if(p.d&&!o.dead){pt(o.x+9,o.y+17,40,'#b00',9,40,.25);pt(o.x+9,o.y+17,14,o.col,7,40,.25)}
if(o.dead&&!p.d){o.x=p.x;o.y=p.y}
Object.assign(o,{god:!!p.gd,av:p.av|0,name:p.n,team:p.tm==null?-1:p.tm,col:TEAMS&&p.tm>=0?TC[p.tm]:p.c,tx:p.x,ty:p.y,vx:p.vx,vy:p.vy,aim:p.a,hp:p.h,dead:p.d,kills:p.k,deaths:p.dd,jf:p.jf,on:p.on,inv:p.inv?9999:0,wp:[{k:p.w,ammo:0,res:0}],cur:0,seen:performance.now()});
o.dir=Math.cos(o.aim)<0?-1:1;if(p.sh)for(const q of p.sh){fireBullets(o,q[0],q[1]+9,q[2]+13,q[3],Math.min(1.5,q[4]||1));o.fl=4}}
else if(p.t==='d'){addKF(p.m);if(p.kid===myId)me.kills++}
else if(p.t==='k'){const k=PK.find(x=>x.id===p.id);if(k&&!k.t&&!k.gone){if(k.drop)k.gone=1;else k.t=800}}
else if(p.t==='p'){PK.push({x:p.x,y:p.y,w:20,h:16,vx:0,vy:0,k:p.k,t:0,on:0,drop:1,ttl:900,id:p.id})}
else if(p.t==='g'){const o=PL.find(q=>q.id===p.id);if(o)G.push({x:p.x,y:p.y,vx:p.vx,vy:p.vy,t:110,o})}}
function netTick(){if(online){if(T%6===0)sendState();const now=performance.now();
PL=PL.filter(o=>{if(o.remote&&now-o.seen>5000){addKF(o.name+' left');return false}return true})}
checkWin()}
function leave(){online=false;if(ch&&sb){try{sb.removeChannel(ch)}catch(e){}}ch=null}
// ---- fullscreen
function toggleFS(){const d=document,e=d.documentElement;if(d.fullscreenElement||d.webkitFullscreenElement){(d.exitFullscreen||d.webkitExitFullscreen).call(d)}else enterFS()}
function enterFS(){const d=document,e=d.documentElement;if(d.fullscreenElement||d.webkitFullscreenElement)return;const f=e.requestFullscreen||e.webkitRequestFullscreen;
if(f){try{const r=f.call(e,{navigationUI:'hide'});r&&r.catch&&r.catch(()=>{})}catch(x){}}
try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{})}catch(x){}}
// ---- flow
const COLS=['#d9382c','#2f9e44','#e8890c','#8e44ad','#16a2b8','#c2a21a','#2f6fe0'];let mode='solo';
function beginMatch(isOnline){const name=($('name').value.trim()||'Soldier').slice(0,12);try{localStorage.setItem('jm-name',name)}catch(e){}
online=isOnline;TEAMS=$('gm').value==='tdm';TARGET=isOnline?(TEAMS?20:15):+$('kt').value;DIFF=D[$('df').value];
const L=UP.lv,mt=TEAMS?(isOnline?+$('tm').value:0):-1;
PL=[me=mk(name,0,TEAMS?TC[mt]:isOnline?COLS[parseInt(myId,36)%COLS.length]:'#2f6fe0')];
Object.assign(me,{team:mt,mh:100+15*L.hp,mf:100+15*L.fuel,spd:1+.06*L.spd,dm:1+.06*L.dmg,rlm:1-.1*L.rl,g0:3+L.gren});
const gk=owns('guns',INV.gun)?INV.gun:'';Object.assign(me,{lo:gk,av:Math.max(0,AV.findIndex(a=>a.id===INV.avatar&&owns('avatars',a.id)))});
const names=['Rex','Vex','Kilo','Nova','Zed'],cols=['#d9382c','#2f9e44','#e8890c','#8e44ad','#16a2b8'];
if(!isOnline)for(let i=0;i<+$('nb').value;i++){const b=mk(names[i],1,TEAMS?TC[i%2?0:1]:cols[i]);b.team=TEAMS?(i%2?0:1):-1;b.lo=['ak','shotgun','ak','sniper','rocket'][i%5];b.av=(i*3+1)%AV.length;PL.push(b)}
B=[];G=[];P=[];EX=[];KF=[];PK=[];T=0;outShots=[];PL.forEach(spawn);
const pk=(x,y,i)=>PK.push({x,y,w:20,h:16,vx:0,vy:0,on:0,k:rk(i),seed:i,id:'h'+i,t:0});
MAP.forEach((p,i)=>{if(i>0&&p[2]>=200)pk(p[0]+p[2]/2-10,p[1]-16,i)});[450,1250,2050].forEach((x,i)=>pk(x,1020,100+i));
cam.x=clamp(me.x-VW/2,0,Math.max(0,WW-VW));cam.y=clamp(me.y-VH/2,0,WH-VH);
$('menu').hidden=true;$('end').hidden=true;$('tools').hidden=false;god=isAdmin()&&godPref;$('godSw').hidden=!isAdmin();$('god').checked=god;$('msg').textContent='';$('play').disabled=false;state='play'}
function startOnline(){const msg=$('msg');if(!window.supabase){msg.textContent='Online play needs an internet connection.';return}
if(!user){msg.textContent='Sign in with an account (not guest) to play online.';return}
roomCode=($('room').value||'lobby').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,12)||'lobby';
msg.textContent='Connecting to room '+roomCode+'...';$('play').disabled=true;
try{sb=getSB();
ch=sb.channel('jm-'+roomCode+($('gm').value==='tdm'?'t':'f'),{config:{broadcast:{self:false}}});
ch.on('broadcast',{event:'e'},m=>onMsg(m.payload)).subscribe(st=>{
if(st==='SUBSCRIBED'&&state==='menu')beginMatch(true);
else if((st==='CHANNEL_ERROR'||st==='TIMED_OUT')&&state==='menu'){msg.textContent='Could not connect. Check your connection and try again.';leave();$('play').disabled=false}
else if((st==='CLOSED'||st==='CHANNEL_ERROR')&&state==='play'&&online)addKF('Connection lost')})
}catch(e){msg.textContent='Could not connect.';$('play').disabled=false;leave()}}
function toMenu(){leave();state='menu';PL=[];me=null;B=[];G=[];$('end').hidden=true;$('tools').hidden=true;$('menu').hidden=false;$('play').disabled=false}
function setMode(m){mode=m;$('tSolo').classList.toggle('on',m==='solo');$('tOn').classList.toggle('on',m==='online');$('soloOpts').hidden=m!=='solo';$('onOpts').hidden=m==='solo'}
$('tSolo').onclick=()=>setMode('solo');$('tOn').onclick=()=>setMode('online');
$('play').onclick=()=>{enterFS();mode==='solo'?beginMatch(false):startOnline()};
$('fsBtn').onclick=toggleFS;$('fs').onclick=toggleFS;$('quit').onclick=toMenu;$('again').onclick=toMenu;
try{$('name').value=localStorage.getItem('jm-name')||''}catch(e){}
// ---- win check, credits, upgrades
function checkWin(){if(state!=='play')return;let w=null,tw=-1;
if(TEAMS){const t=[0,0];for(const o of PL)if(o.team>=0)t[o.team]+=o.kills;tw=t[0]>=TARGET?0:t[1]>=TARGET?1:-1;if(tw<0)return}
else{w=PL.find(o=>o.kills>=TARGET);if(!w)return}
state='over';const won=TEAMS?me.team===tw:w===me,cr=me.kills*10+(won?50:15);award(cr,me.kills,won);
$('endt').textContent=TEAMS?TN[tw]+' team wins':(won?'Victory':w.name+' wins');
$('endsub').textContent=(won?'Victory. ':'Defeat. ')+'Your kills/deaths: '+me.kills+'/'+me.deaths+'. You earned '+cr+' credits.';$('end').hidden=false}
const UPGS=[{k:'hp',n:'Body armor',d:'+15 max health per level'},{k:'fuel',n:'Jetpack tank',d:'+15 max fuel per level'},{k:'spd',n:'Combat boots',d:'+6% move speed per level'},
{k:'dmg',n:'Gunnery',d:'+6% weapon damage per level'},{k:'rl',n:'Quick hands',d:'10% faster reload per level'},{k:'gren',n:'Grenade bag',d:'+1 starting grenade per level'}];
let UP={cr:100,lv:{hp:0,fuel:0,spd:0,dmg:0,rl:0,gren:0}};
try{const v=JSON.parse(localStorage.getItem('jm-up'));if(v&&v.lv){UP.cr=+v.cr||0;Object.assign(UP.lv,v.lv)}}catch(e){}
const saveUP=()=>{if(user)return;try{localStorage.setItem('jm-up',JSON.stringify(UP))}catch(e){}};
const addCredits=n=>{UP.cr+=n;saveUP();upLabel()};
function upLabel(){$('upBtn').textContent='Shop ('+(isAdmin()?'unlimited':UP.cr)+' credits)'}
function renderUps(){$('cr').textContent=isAdmin()?'Unlimited':UP.cr;$('upgList').innerHTML=UPGS.map(u=>{const l=UP.lv[u.k],c=(l+1)*50;
return '<div class="uc"><div class="un">'+u.n+'</div><div class="ud">'+u.d+'</div><div class="pips">'+'<i class="on"></i>'.repeat(l)+'<i></i>'.repeat(5-l)+'</div><button data-k="'+u.k+'"'+(l>=5||(!isAdmin()&&UP.cr<c)?' disabled':'')+'>'+(l>=5?'Maxed out':'Upgrade for '+c)+'</button></div>'}).join('');
$('upgList').querySelectorAll('button').forEach(b=>b.onclick=async()=>{const k=b.dataset.k,l=UP.lv[k],c=(l+1)*50;if(l>=5)return;
if(user){b.disabled=true;const r=await getSB().rpc('buy_upgrade',{p_key:k});if(r.error){$('umsg').textContent=r.error.message;return}$('umsg').textContent='';setUser(r.data);upLabel();renderUpg()}
else if(UP.cr>=c){UP.cr-=c;UP.lv[k]++;saveUP();upLabel();renderUpg()}})}
$('upBtn').onclick=()=>{renderUpg();$('menu').hidden=true;$('end').hidden=true;$('upg').hidden=false};
$('upBack').onclick=()=>{$('upg').hidden=true;$('menu').hidden=false};
$('endUp').onclick=()=>{toMenu();$('upBtn').onclick()};
$('gm').onchange=()=>{$('tmRow').hidden=$('gm').value!=='tdm'};upLabel();
// ---- shop: guns and avatars
const GUNP={ak:300,shotgun:400,sniper:600,rocket:900};
const AV=[{id:'recruit',n:'Recruit',p:0,b:'#2f6fe0',h:'#3d4a2e',s:'#f1c27d',a:'helm'},{id:'woodland',n:'Woodland',p:150,b:'#4c6b2f',h:'#3f5a28',s:'#e0b080',a:'camo'},
{id:'desert',n:'Desert Fox',p:150,b:'#c9a45c',h:'#e6d3a3',s:'#d9a066',a:'turban'},{id:'frost',n:'Frostbite',p:200,b:'#9fc7e8',h:'#7f9fba',s:'#f1c9b0',a:'fur'},
{id:'shadow',n:'Shadow',p:300,b:'#23232b',h:'#16161c',s:'#f1c27d',a:'ninja'},{id:'buccaneer',n:'Buccaneer',p:350,b:'#7a2b2b',h:'#1a1a1a',s:'#e8b887',a:'pirate'},
{id:'bolt',n:'Bolt',p:400,b:'#8a949c',h:'#b5bec6',s:'#8a949c',a:'robot'},{id:'paladin',n:'Paladin',p:450,b:'#aeb7c0',h:'#c9d1d8',s:'#f1c27d',a:'knight'},
{id:'cosmonaut',n:'Cosmonaut',p:500,b:'#e8eef2',h:'#dfe9f0',s:'#f1c27d',a:'astro'},{id:'imp',n:'Imp',p:600,b:'#7d1f1f',h:'#b02a2a',s:'#d23a3a',a:'demon'},
{id:'midas',n:'Midas',p:800,b:'#d4a82a',h:'#f2c93c',s:'#f1c27d',a:'gold'},{id:'monarch',n:'Monarch',p:1000,b:'#5b2a86',h:'#f2c93c',s:'#f1c27d',a:'crown'}];
let INV={guns:[],avatars:['recruit'],gun:'',avatar:'recruit'},shopTab='up';
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
function renderUpg(){shopTab==='gun'?renderGuns():shopTab==='av'?renderAvs():renderUps()}
async function shopBuy(kind,id,price){const m=t=>$('umsg').textContent=t;
if(user){const r=await getSB().rpc('buy_item',{p_kind:kind,p_id:id});if(r.error){m(r.error.message);return}setUser(r.data)}
else{if(UP.cr<price){m('Not enough credits.');return}UP.cr-=price;INV[kind].push(id);saveUP();saveINV()}
m('');upLabel();renderUpg()}
async function shopEquip(kind,id){if(user){const r=await getSB().rpc('equip_item',{p_kind:kind,p_id:id});if(r.error){$('umsg').textContent=r.error.message;return}setUser(r.data)}
else{INV[kind==='guns'?'gun':'avatar']=id;saveINV()}renderUpg()}
function renderGuns(){$('cr').textContent=isAdmin()?'Unlimited':UP.cr;
$('upgList').innerHTML=Object.keys(GUNP).map(k=>{const d=WP[k],o=owns('guns',k),eq=INV.gun===k,a=o?(eq?'un':'eq'):'buy';
return '<div class="uc"><div class="un">'+d.n+'</div><div class="ud">'+(d.rocket?'Explosive blast':'Damage '+d.dmg+(d.pel>1?' x'+d.pel:''))+', '+d.mag+' per magazine, '+(d.rate<=6?'rapid':d.rate<=20?'fast':'slow')+' fire</div><button data-k="'+k+'" data-a="'+a+'"'+(a==='buy'&&!isAdmin()&&UP.cr<GUNP[k]?' disabled':'')+'>'+(a==='buy'?'Buy for '+GUNP[k]:eq?'Equipped (tap to remove)':'Equip')+'</button></div>'}).join('');
$('upgList').querySelectorAll('button').forEach(b=>b.onclick=()=>{const k=b.dataset.k,a=b.dataset.a;if(a==='buy')shopBuy('guns',k,GUNP[k]);else shopEquip('guns',a==='un'?'':k)})}
function renderAvs(){$('cr').textContent=isAdmin()?'Unlimited':UP.cr;
$('upgList').innerHTML=AV.map((v,i)=>{const o=owns('avatars',v.id),eq=INV.avatar===v.id,a=o?(eq?'eq0':'eq'):'buy';
return '<div class="uc"><canvas class="av" width="64" height="96" data-i="'+i+'"></canvas><div class="un">'+v.n+'</div><button data-k="'+v.id+'" data-p="'+v.p+'" data-a="'+a+'"'+(a==='eq0'||(a==='buy'&&!isAdmin()&&UP.cr<v.p)?' disabled':'')+'>'+(a==='buy'?'Buy for '+v.p:eq?'Equipped':'Equip')+'</button></div>'}).join('');
$('upgList').querySelectorAll('canvas.av').forEach(c=>avPreview(c,AV[+c.dataset.i]));
$('upgList').querySelectorAll('button').forEach(b=>b.onclick=()=>{if(b.dataset.a==='buy')shopBuy('avatars',b.dataset.k,+b.dataset.p);else shopEquip('avatars',b.dataset.k)})}
$('shopTabs').querySelectorAll('button').forEach(b=>b.onclick=()=>{shopTab=b.dataset.t;$('shopTabs').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));$('umsg').textContent='';renderUpg()});
// ---- accounts (Supabase Auth + server-side profile; all money changes happen in SQL functions)
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function getSB(){return sb||(sb=window.supabase?window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{realtime:{params:{eventsPerSecond:25}}}):null)}
function isAdmin(){return !!(user&&user.is_admin)}
function setUser(p){user=p;INV=Object.assign({guns:[],avatars:['recruit'],gun:'',avatar:'recruit'},p.inventory||{});UP.lv=Object.assign({hp:0,fuel:0,spd:0,dmg:0,rl:0,gren:0},p.upgrades);UP.cr=+p.credits}
function award(cr,k,won){if(user){if(!isAdmin())getSB().rpc('claim_match',{p_kills:k,p_won:won}).then(r=>{if(r.data){setUser(r.data);upLabel()}})}else{UP.cr+=cr;saveUP()}upLabel()}
async function loadProfile(session){const r=await getSB().from('profiles').select('*').eq('id',session.user.id).maybeSingle();
if(r.error||!r.data){$('amsg').textContent='Profile not found. Run supabase.sql in your Supabase project first.';return false}setUser(r.data);return true}
function showMenu(){$('auth').hidden=true;$('menu').hidden=false;
$('who').textContent=user?'Signed in as '+user.username+(user.is_admin?' (admin)':''):'Guest: progress is saved on this device only.';
$('admBtn').hidden=!isAdmin();$('outBtn').textContent=user?'Sign out':'Sign in';$('name').readOnly=!!user;if(user)$('name').value=user.username;upLabel()}
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
async function loadPlayers(){const r=await getSB().from('profiles').select('email,username,credits').order('created_at');
$('plistBox').innerHTML=r.error?esc(r.error.message):(r.data||[]).map(p=>'<div class="pl" data-e="'+esc(p.email)+'"><span>'+esc(p.username)+(p.email.endsWith('@players.jetpack.game')?'':' ('+esc(p.email)+')')+'</span><b>'+esc(p.credits)+'</b></div>').join('');
$('plistBox').querySelectorAll('.pl').forEach(d=>d.onclick=()=>{$('admTo').value=d.dataset.e})}
$('admBtn').onclick=()=>{$('menu').hidden=true;$('adm').hidden=false;$('admMsg').textContent='';loadPlayers();loadCodes()};
$('admBack').onclick=()=>{$('adm').hidden=true;$('menu').hidden=false};
$('admSend').onclick=async()=>{const e=$('admTo').value.trim(),a=Math.floor(+$('admAmt').value),m=t=>$('admMsg').textContent=t;
if(!e||!(a>0)){m('Enter a player email and an amount above 0.');return}
const r=await getSB().rpc('admin_transfer',{p_email:e,p_amount:a});m(r.error?r.error.message:'Sent '+a+' credits to '+e+'.');loadPlayers()};
// ---- unkillable switch (admin only)
try{godPref=localStorage.getItem('jm-god')==='1'}catch(e){}
$('god').onchange=()=>{god=isAdmin()&&$('god').checked;godPref=god;try{localStorage.setItem('jm-god',god?'1':'0')}catch(e){}$('god').blur()};
// ---- redeem codes (validated and paid out by SQL functions)
$('redeem').onclick=async()=>{const c=$('codeIn').value.trim(),m=t=>$('umsg').textContent=t;if(!user){m('Sign in with an account to redeem codes.');return}if(!c){m('Enter a code.');return}
const r=await getSB().rpc('redeem_code',{p_code:c});if(r.error){m(r.error.message);return}setUser(r.data);$('codeIn').value='';upLabel();renderUpg();m('Code redeemed. Credits added.')};
async function loadCodes(){const r=await getSB().from('codes').select('code,credits,max_uses,uses').order('created_at',{ascending:false});
$('codeBox').innerHTML=r.error?esc(r.error.message):(r.data||[]).map(c=>'<div class="pl" data-c="'+esc(c.code)+'"><span>'+esc(c.code)+' ('+esc(c.credits)+' credits)</span><b>'+esc(c.uses)+'/'+esc(c.max_uses)+' used</b></div>').join('')||'<div class="pl"><span>No codes yet.</span></div>';
$('codeBox').querySelectorAll('[data-c]').forEach(d=>d.onclick=()=>{$('codeIn').value=d.dataset.c;$('admMsg').textContent='Code '+d.dataset.c+' selected. Copy it from the box.'})}
$('admMk').onclick=async()=>{const cr=Math.floor(+$('admCr').value),u=Math.floor(+$('admUses').value)||1,m=t=>$('admMsg').textContent=t;if(!(cr>0)){m('Enter credits above 0.');return}
const r=await getSB().rpc('admin_create_code',{p_code:$('admCode').value.trim()||null,p_credits:cr,p_max_uses:u});
m(r.error?r.error.message:'Created code '+r.data+' for '+cr+' credits, '+u+' use(s).');if(!r.error)$('admCode').value='';loadCodes()};
(async()=>{try{const sc=getSB();if(sc){const r=await sc.auth.getSession();if(r.data&&r.data.session&&await loadProfile(r.data.session)){showMenu();return}}}catch(e){}$('auth').hidden=false})();
let last=0,acc=0;function frame(t){requestAnimationFrame(frame);acc+=Math.min(100,t-last);last=t;
while(acc>=16.67){acc-=16.67;if(state==='play')tick()}
bg();if(PL.length)world();hud()}
requestAnimationFrame(frame);
