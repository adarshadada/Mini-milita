*{box-sizing:border-box}
html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#141b0e;color:#f1ead0;font-family:"Trebuchet MS",system-ui,sans-serif;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;overscroll-behavior:none}
canvas{position:fixed;inset:0;width:100vw;height:100vh;height:100dvh;touch-action:none;cursor:none;display:block}
#menu,#end{position:fixed;inset:0;display:grid;place-items:center;background:radial-gradient(ellipse at top,#2c3d20,#141b0e 70%);z-index:4;padding:max(12px,env(safe-area-inset-top)) 12px;overflow:auto}
.card{display:grid;grid-template-columns:1.1fr 1fr;gap:28px;width:100%;max-width:880px;background:#1d2616;border:1px solid #4a5a36;border-radius:12px;padding:28px}
.card.one{grid-template-columns:1fr;max-width:420px;text-align:center}
.side{display:flex;flex-direction:column;gap:14px;justify-content:center}
h1{margin:0;font-family:"Arial Black",Impact,sans-serif;font-size:clamp(1.8rem,5vw,3rem);line-height:1;color:#ff9a2e;letter-spacing:-.02em}
.lead{margin:0;font-size:1.05rem;line-height:1.5;color:#e4dcbc}
.help{margin:0;font-size:.85rem;line-height:1.5;color:#b9b18c}
.help dt{font-weight:700;color:#d8c88a;margin-top:8px}.help dd{margin:2px 0 0}
.form{display:flex;flex-direction:column;gap:12px}
.tabs{display:grid;grid-template-columns:1fr 1fr;background:#141b0e;border-radius:8px;padding:3px}
.tabs button{font:inherit;font-weight:700;padding:9px;border:0;border-radius:6px;background:none;color:#b9b18c;cursor:pointer}
.tabs button.on{background:#3a4a2a;color:#fff}
label{display:flex;justify-content:space-between;align-items:center;gap:14px;font-size:.95rem}
input,select{font:inherit;padding:8px 10px;background:#141b0e;color:#f1ead0;border:1px solid #4a5a36;border-radius:6px;min-width:130px;-webkit-user-select:text;user-select:text}
input:focus,select:focus{outline:2px solid #ff9a2e;outline-offset:1px}
#soloOpts,#onOpts{display:flex;flex-direction:column;gap:12px}
.note{margin:0;font-size:.82rem;line-height:1.4;color:#b9b18c}
.card button{font:inherit;cursor:pointer}
#play,#again{font-weight:700;font-size:1.1rem;padding:13px;background:#ff9a2e;color:#141b0e;border:0;border-radius:8px}
#play:hover,#again:hover,#play:focus-visible,#again:focus-visible{background:#ffb85c;outline:none}
#play:disabled{opacity:.6;cursor:wait}
.ghost{padding:9px;background:none;color:#d8c88a;border:1px solid #4a5a36;border-radius:8px}
.ghost:hover{background:#26331c}
#msg{margin:0;min-height:1.2em;font-size:.85rem;color:#ffb85c}
#tools{position:fixed;left:calc(10px + env(safe-area-inset-left,0px));top:62px;z-index:3;display:flex;gap:6px}
#tools button{font:inherit;font-size:12px;padding:6px 10px;background:#1d2616c0;color:#f1ead0;border:1px solid #4a5a36;border-radius:6px;cursor:pointer}
#tools button:hover{background:#3a4a2a}
#touch{display:none;position:fixed;right:calc(14px + env(safe-area-inset-right,0px));top:36%;z-index:3;flex-direction:column;gap:10px}
#touch button{width:76px;height:42px;border-radius:8px;border:1px solid #d8c88a;background:#1d2616cc;color:#fff;font:inherit;font-size:13px;font-weight:700;touch-action:none}
#touch button:active{background:#ff9a2e;color:#141b0e}
@media (pointer:coarse){#touch{display:flex}canvas{cursor:default}}
@media (max-width:700px),(max-height:430px){.card{grid-template-columns:1fr 1fr;gap:16px;padding:16px}.lead{font-size:.9rem}.help{font-size:.75rem}h1{font-size:1.7rem}.form{gap:8px}input,select{padding:5px 8px}}
@media (max-width:520px) and (orientation:portrait){.card{grid-template-columns:1fr}}
#rot{display:none;position:fixed;inset:0;z-index:9;background:#141b0e;place-items:center;text-align:center;font-size:1.4rem;padding:20px}
@media (orientation:portrait) and (pointer:coarse){#rot{display:grid}}
[hidden]{display:none!important}
erType==='mouse'){md=0;return}for(const s in tp)if(tp[s].id===e.pointerId)delete tp[s]};
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
  
