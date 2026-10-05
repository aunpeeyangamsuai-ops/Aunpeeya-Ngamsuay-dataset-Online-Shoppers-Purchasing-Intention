const MN={2:'ก.พ.',3:'มี.ค.',5:'พ.ค.',6:'มิ.ย.',7:'ก.ค.',8:'ส.ค.',9:'ก.ย.',10:'ต.ค.',11:'พ.ย.',12:'ธ.ค.'};
const VN={Returning_Visitor:'ลูกค้าเก่า',New_Visitor:'ลูกค้าใหม่',Other:'อื่น ๆ'};
let MET='n';const F={m:new Set(),v:new Set(),r:new Set(),b:new Set(),br:null};
const fmt=d3.format(','),pct=d3.format('.1%'),tip=d3.select('#tip');
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
function pass(d,ex){
 if(ex!=='m'&&F.m.size&&!F.m.has(d.m))return false;
 if(ex!=='v'&&F.v.size&&!F.v.has(d.v))return false;
 if(ex!=='r'&&F.r.size&&!F.r.has(d.r))return false;

 if(ex!=='b'&&F.b.size&&!F.b.has(d.b))return false;
 if(ex!=='br'&&F.br&&!(d.d>=F.br[0]&&d.d<=F.br[1]&&d.p>=F.br[2]&&d.p<=F.br[3]))return false;
 return true}
const rows=ex=>DATA.filter(d=>pass(d,ex));
function showTip(e,h){tip.html(h).style('opacity',1).style('left',Math.min(e.clientX+14,innerWidth-190)+'px').style('top',e.clientY+14+'px')}
const hideTip=()=>tip.style('opacity',0);
function toggle(k,v){F[k].has(v)?F[k].delete(v):F[k].add(v);update()}
function agg(rs,key){return d3.rollups(rs,g=>({n:g.length,b:d3.sum(g,x=>x.b)}),d=>d[key])}

function drawMonthly(){
 const svg=d3.select('#c1'),W=620,H=360,m={t:16,r:46,b:30,l:46};svg.attr('viewBox',`0 0 ${W} ${H}`).selectAll('*').remove();
 const a=new Map(agg(rows('m'),'m')),ms=Object.keys(MN).map(Number);
 const x=d3.scaleBand(ms,[m.l,W-m.r]).padding(.25),
 val=k=>a.get(k)?.[MET]||0,y=d3.scaleLinear([0,d3.max(ms,val)||1],[H-m.b,m.t]).nice(),
 y2=d3.scaleLinear([0,Math.max(.01,d3.max(ms,k=>a.get(k)?a.get(k).b/a.get(k).n:0))],[H-m.b,m.t]).nice();
 svg.append('g').attr('class','axis').attr('transform',`translate(0,${H-m.b})`).call(d3.axisBottom(x).tickFormat(k=>MN[k]).tickSizeOuter(0));
 svg.append('g').attr('class','axis').attr('transform',`translate(${m.l},0)`).call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('~s')));
 svg.append('g').attr('class','axis').attr('transform',`translate(${W-m.r},0)`).call(d3.axisRight(y2).ticks(5).tickFormat(d3.format('.0%')));
 const bars=svg.selectAll('.hit').data(ms).join('rect').attr('class','hit').attr('tabindex',0).attr('role','button')
  .attr('aria-label',k=>`${MN[k]} ${a.get(k)?.n||0} เซสชัน`).attr('x',k=>x(k)).attr('width',x.bandwidth())
  .attr('y',k=>y(val(k))).attr('height',k=>y(0)-y(val(k))).attr('rx',3)
  .attr('fill',k=>F.m.has(k)?'var(--sel)':'var(--bar)')
  .on('click',(e,k)=>toggle('m',k)).on('keydown',(e,k)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle('m',k)}})
  .on('mousemove',(e,k)=>{const v=a.get(k)||{n:0,b:0};showTip(e,`${MN[k]}<br>${fmt(v.n)} เซสชัน · ซื้อ ${v.n?pct(v.b/v.n):'-'}`)}).on('mouseleave',hideTip);
 if(!reduce&&!drawMonthly.done){drawMonthly.done=1;bars.attr('y',y(0)).attr('height',0).transition().duration(800).delay((k,i)=>i*70).ease(d3.easeBounceOut).attr('y',k=>y(val(k))).attr('height',k=>y(0)-y(val(k)))}
 const pts=ms.filter(k=>a.get(k)).map(k=>[x(k)+x.bandwidth()/2,y2(a.get(k).b/a.get(k).n)]);
 svg.append('path').attr('d',d3.line()(pts)).attr('fill','none').attr('stroke','var(--buy)').attr('stroke-width',2.5).style('pointer-events','none');
 svg.selectAll('circle').data(pts).join('circle').attr('cx',p=>p[0]).attr('cy',p=>p[1]).attr('r',4).attr('fill','var(--buy)').style('pointer-events','none')}

function drawBars(id,key,label){
 const svg=d3.select(id),rs=rows(key),a=agg(rs,key).sort((p,q)=>q[1].n-p[1].n);
 const rh=28,m={t:4,r:70,b:4,l:78},W=420,H=a.length*rh+m.t+m.b;svg.attr('viewBox',`0 0 ${W} ${H}`).selectAll('*').remove();
 const x=d3.scaleLinear([0,.4],[m.l,W-m.r]);
 const g=svg.selectAll('g').data(a,d=>d[0]).join('g').attr('transform',(d,i)=>`translate(0,${m.t+i*rh})`);
 g.append('text').attr('x',m.l-8).attr('y',rh/2+4).attr('text-anchor','end').text(d=>label(d[0]));
 g.append('rect').attr('class','hit').attr('tabindex',0).attr('role','button').attr('aria-label',d=>label(d[0]))
  .attr('x',m.l).attr('y',3).attr('height',rh-8).attr('rx',3).attr('width',d=>Math.max(2,x(Math.min(.4,d[1].b/d[1].n))-m.l))
  .attr('fill',d=>F[key].has(d[0])?'var(--sel)':'var(--buy)').attr('opacity',d=>F[key].size&&!F[key].has(d[0])?.45:1)
  .on('click',(e,d)=>toggle(key,d[0])).on('keydown',(e,d)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(key,d[0])}})
  .on('mousemove',(e,d)=>showTip(e,`${label(d[0])}<br>${fmt(d[1].n)} เซสชัน · ซื้อ ${pct(d[1].b/d[1].n)}`)).on('mouseleave',hideTip);
 g.append('text').attr('x',d=>x(Math.min(.4,d[1].b/d[1].n))+6).attr('y',rh/2+4).text(d=>pct(d[1].b/d[1].n))}

const sc={W:1100,H:420,m:{t:10,r:16,b:40,l:54}};let brush,bg,qt;
const X=d3.scaleSymlog().constant(2).domain([0,1200]).range([sc.m.l,sc.W-sc.m.r]),
 Y=d3.scaleSymlog().constant(5).domain([0,400]).range([sc.H-sc.m.b,sc.m.t]);
function setupScatter(){
 const svg=d3.select('#c4').attr('viewBox',`0 0 ${sc.W} ${sc.H}`);
 svg.append('g').attr('class','axis').attr('transform',`translate(0,${sc.H-sc.m.b})`).call(d3.axisBottom(X).tickValues([0,1,5,15,60,240,1000]).tickFormat(d=>d+' นาที'));
 svg.append('g').attr('class','axis').attr('transform',`translate(${sc.m.l},0)`).call(d3.axisLeft(Y).tickValues([0,5,20,50,100,300]));
 bg=svg.append('g');
 brush=d3.brush().extent([[sc.m.l,sc.m.t],[sc.W-sc.m.r,sc.H-sc.m.b]]).on('end',e=>{
  if(!e.sourceEvent)return;const s=e.selection;
  F.br=s?[X.invert(s[0][0]),X.invert(s[1][0]),Y.invert(s[1][1]),Y.invert(s[0][1])]:null;update()});
 bg.call(brush);bg.select('.overlay').on('mousemove.t',e=>{const[px,py]=d3.pointer(e,svg.node()),d=qt&&qt.find(px,py,14);d?showTip(e,`${d.d} นาที · page value ${d.p}<br>${d.b?'ซื้อ':'ไม่ซื้อ'}`):hideTip()}).on('mouseleave.t',hideTip);
 bg.select('.selection').attr('fill',css('--sel')).attr('fill-opacity',.12).attr('stroke',css('--sel'))}
function drawScatter(t=1){
 const cv=document.getElementById('cv'),box=document.getElementById('sc'),w=box.clientWidth,k=w/sc.W,dpr=devicePixelRatio||1;
 cv.width=w*dpr;cv.height=sc.H*k*dpr;cv.style.width=w+'px';cv.style.height=sc.H*k+'px';
 const c=cv.getContext('2d');c.scale(dpr*k,dpr*k);
 qt=d3.quadtree().x(d=>X(d.d)).y(d=>Y(d.p)).addAll(rows('br'));
 const buy=css('--buy'),no=css('--no'),rs=rows('br'),inb=d=>!F.br||(d.d>=F.br[0]&&d.d<=F.br[1]&&d.p>=F.br[2]&&d.p<=F.br[3]);
 for(const pass2 of [0,1])for(const d of rs){if(d.b!==pass2)continue;
  c.globalAlpha=(inb(d)?.55:.08)*t;c.fillStyle=d.b?buy:no;c.beginPath();c.arc(X(d.d),Y(d.p)-(1-d3.easeBackOut(t))*70,2.6,0,6.283);c.fill()}}

function drawDonut(){
 const svg=d3.select('#c5').attr('viewBox','0 0 460 210');svg.selectAll('*').remove();
 const rs=rows('b'),n=rs.length,b=d3.sum(rs,d=>d.b),data=[{k:1,l:'ซื้อ',v:b},{k:0,l:'ไม่ซื้อ',v:n-b}];
 const arc=d3.arc().innerRadius(58).outerRadius(94).cornerRadius(3).padAngle(.02),g=svg.append('g').attr('transform','translate(115,105)');
 g.selectAll('path').data(d3.pie().value(d=>d.v).sort(null)(data)).join('path').attr('class','hit').attr('tabindex',0).attr('role','button')
  .attr('aria-label',p=>p.data.l).attr('d',arc).attr('fill',p=>p.data.k?'var(--buy)':'var(--no)')
  .attr('opacity',p=>F.b.size&&!F.b.has(p.data.k)?.35:1).attr('stroke',p=>F.b.has(p.data.k)?'var(--sel)':'none').attr('stroke-width',3)
  .on('click',(e,p)=>toggle('b',p.data.k)).on('keydown',(e,p)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle('b',p.data.k)}})
  .on('mousemove',(e,p)=>showTip(e,`${p.data.l}<br>${fmt(p.data.v)} เซสชัน · ${n?pct(p.data.v/n):'-'}`)).on('mouseleave',hideTip);
 g.append('text').attr('text-anchor','middle').attr('y',4).style('font-size','22px').style('font-weight','700').style('fill','var(--ink)').text(n?pct(b/n):'-');
 g.append('text').attr('text-anchor','middle').attr('y',24).text('อัตราการซื้อ');
 data.forEach((d,i)=>{const y=85+i*34;
  svg.append('circle').attr('cx',250).attr('cy',y-4).attr('r',6).attr('fill',d.k?'var(--buy)':'var(--no)');
  svg.append('text').attr('x',264).attr('y',y).style('fill','var(--ink)').style('font-size','14px').text(`${d.l} ${fmt(d.v)} (${n?pct(d.v/n):'-'})`)})}
function drawHeat(){
 const svg=d3.select('#c6'),vs=Object.keys(VN),ms=Object.keys(MN).map(Number),W=900,m={t:6,l:84,r:6,b:26},ch=46,H=m.t+vs.length*ch+m.b;
 svg.attr('viewBox',`0 0 ${W} ${H}`).selectAll('*').remove();
 const x=d3.scaleBand(ms,[m.l,W-m.r]).padding(.08),y=d3.scaleBand(vs,[m.t,H-m.b]).padding(.08);
 const A=new Map(d3.rollups(DATA,g=>({n:g.length,b:d3.sum(g,d=>d.b)}),d=>d.m+'|'+d.v)),
 col=d3.scaleSequential(d3.interpolateRgb(css('--heat0'),css('--buy'))).domain([0,.4]),
 cells=ms.flatMap(mo=>vs.map(v=>({mo,v,...(A.get(mo+'|'+v)||{n:0,b:0})})));
 svg.append('g').attr('class','axis').attr('transform',`translate(0,${H-m.b})`).call(d3.axisBottom(x).tickFormat(k=>MN[k]).tickSize(0)).select('path').remove();
 svg.append('g').attr('class','axis').attr('transform',`translate(${m.l},0)`).call(d3.axisLeft(y).tickFormat(k=>VN[k]).tickSize(0)).select('path').remove();
 const g=svg.selectAll('g.c').data(cells).join('g').attr('class','c');
 g.append('rect').attr('class','hit').attr('tabindex',0).attr('role','button').attr('aria-label',d=>`${MN[d.mo]} ${VN[d.v]}`)
  .attr('x',d=>x(d.mo)).attr('y',d=>y(d.v)).attr('width',x.bandwidth()).attr('height',y.bandwidth()).attr('rx',4)
  .attr('fill',d=>d.n?col(Math.min(.4,d.b/d.n)):'none').attr('stroke',d=>F.m.has(d.mo)&&F.v.has(d.v)?'var(--sel)':d.n?'none':'var(--line)').attr('stroke-width',3)
  .on('click',(e,d)=>{F.m=new Set([d.mo]);F.v=new Set([d.v]);update()}).on('keydown',(e,d)=>{if(e.key==='Enter'){F.m=new Set([d.mo]);F.v=new Set([d.v]);update()}})
  .on('mousemove',(e,d)=>showTip(e,`${MN[d.mo]} · ${VN[d.v]}<br>${fmt(d.n)} เซสชัน · ซื้อ ${d.n?pct(d.b/d.n):'-'}`)).on('mouseleave',hideTip);
 g.append('text').attr('x',d=>x(d.mo)+x.bandwidth()/2).attr('y',d=>y(d.v)+y.bandwidth()/2+4).attr('text-anchor','middle').style('fill',d=>d.n&&d3.lab(col(Math.min(.4,d.b/d.n))).l<62?'#fff':'#10241A').style('pointer-events','none').text(d=>d.n>=15?d3.format('.0%')(d.b/d.n):'')}
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function setNum(id,v,f){const el=document.getElementById(id),from=el._v||0;el._v=v;
 d3.select(el).transition().duration(reduce?0:500).tween('n',()=>{const i=d3.interpolateNumber(from,v);return t=>{el.textContent=f(i(t))}})}
;let intro=!reduce;
function anim(el,c,delay){el.classList.remove(c);void el.offsetWidth;el.style.animationDelay=(delay||0)+'ms';el.classList.add(c)}
const POP=['ติ๊ง!','+1 🛒','หยิบใส่ตะกร้า','ลดราคา!','สแกนแล้ว'];
function pop(x,y){if(reduce)return;const el=document.createElement('div');el.className='pop';el.textContent=POP[Math.floor(Math.random()*POP.length)];el.style.left=x+'px';el.style.top=y+'px';document.body.appendChild(el);el.addEventListener('animationend',()=>el.remove())}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('.hit'))pop(e.clientX,e.clientY)});
const ALL=d3.sum(DATA,d=>d.b)/DATA.length;
function insight(n,b){const el=document.getElementById('insight');
 if(!n){el.textContent='ไม่มีเซสชันตรงกับตัวกรองนี้ ลองกด "ล้างตัวกรอง"';return}
 const r=b/n,any=F.m.size||F.v.size||F.r.size||F.b.size||F.br;
 el.textContent=any?`กลุ่มที่เลือกมีอัตราการซื้อ ${pct(r)} ซึ่ง${r>=ALL?'สูง':'ต่ำ'}กว่าค่าเฉลี่ยรวม (${pct(ALL)}) ประมาณ ${(r>=ALL?r/ALL:ALL/Math.max(r,1e-9)).toFixed(1)} เท่า`:`ค่าเฉลี่ยรวมอยู่ที่ ${pct(ALL)} ลองคลิกกราฟหรือลากเลือกบนแผนภาพกระจายเพื่อเปรียบเทียบกลุ่มต่าง ๆ`}
function chips(){
 const el=d3.select('#chips');el.selectAll('*').remove();let any=false;
 F.m.forEach(v=>{any=true;el.append('span').attr('class','chip').text('เดือน '+MN[v])});
 F.v.forEach(v=>{any=true;el.append('span').attr('class','chip').text(VN[v])});
 F.r.forEach(v=>{any=true;el.append('span').attr('class','chip').text('ภูมิภาค '+v)});
 F.b.forEach(v=>{any=true;el.append('span').attr('class','chip').text(v?'ซื้อ':'ไม่ซื้อ')});
 if(F.br){any=true;el.append('span').attr('class','chip').text('เลือกบนแผนภาพกระจาย')}
 if(!any)el.append('span').attr('class','hint').text('ยังไม่ได้กรอง กำลังแสดงทุกเซสชัน');
 document.getElementById('reset').disabled=!any}
function update(){
 const rs=rows(null),n=rs.length,b=d3.sum(rs,d=>d.b);
 setNum('k1',n,fmt);setNum('k2',b,fmt);setNum('k3',n?b/n:0,pct);setNum('k4',n?d3.mean(rs,d=>d.p):0,d3.format('.2f'));insight(n,b);setNum('cb',b,fmt);anim(cartb,'bounce');document.querySelectorAll('.kpi').forEach((k,i)=>anim(k,'swing',i*70));
 chips();drawMonthly();drawBars('#c2','v',k=>VN[k]);drawBars('#c3','r',k=>'ภูมิภาค '+k);drawDonut();drawHeat();drawScatter(intro?0:1)}
reset.onclick=()=>{F.m.clear();F.v.clear();F.r.clear();F.b.clear();F.br=null;bg.call(brush.move,null);update()};
theme.onclick=()=>{const r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;r.dataset.theme=dark?'light':'dark';update()};
[mn,mb].forEach(bt=>bt.onclick=()=>{MET=bt===mn?'n':'b';mn.setAttribute('aria-pressed',MET==='n');mb.setAttribute('aria-pressed',MET==='b');update()});
cartb.onclick=()=>anim(cartrun,'go');
setupScatter();update();anim(cartrun,'go');
if(intro){const tm=d3.timer(el=>{const t=Math.min(1,el/1200);drawScatter(t);if(t>=1){intro=false;tm.stop()}})}
addEventListener('resize',()=>drawScatter(intro?0:1));
matchMedia('(prefers-color-scheme:dark)').addEventListener('change',()=>{update()});
