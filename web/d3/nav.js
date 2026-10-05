// แถบเมนูนำทาง: ไฮไลต์หัวข้อที่กำลังดูอยู่ (scrollspy)
(function(){
 const box=document.querySelector('.nav .links');if(!box)return;
 const links=[...box.querySelectorAll('a')],secs=links.map(a=>document.querySelector(a.getAttribute('href')));
 let cur=-1,tick=false,clicked=null;
 function spy(){
  tick=false;let i=0;
  secs.forEach((s,k)=>{if(s&&s.getBoundingClientRect().top<=140)i=k});
  if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)i=secs.length-1;
  if(clicked!==null)i=clicked;
  if(i===cur)return;cur=i;
  links.forEach((a,k)=>{a.classList.toggle('active',k===i);k===i?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current')});
  box.scrollTo({left:links[i].offsetLeft-box.clientWidth/2+links[i].offsetWidth/2,behavior:'smooth'});
 }
 addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(spy)}},{passive:true});
 links.forEach((a,k)=>a.addEventListener('click',()=>{clicked=k;spy()}));
 ['wheel','touchstart','keydown'].forEach(ev=>addEventListener(ev,()=>{clicked=null},{passive:true}));
 addEventListener('resize',spy);spy();
})();
