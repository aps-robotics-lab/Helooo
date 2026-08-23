const $=(s,p=document)=>p.querySelector(s); const $$=(s,p=document)=>[...p.querySelectorAll(s)];
const header=$('.site-header'), menu=$('.menu'), links=$('.navlinks');
window.addEventListener('scroll',()=>header?.classList.toggle('scrolled',scrollY>20));
menu?.addEventListener('click',()=>links?.classList.toggle('open'));
$$('.navlinks a').forEach(a=>a.addEventListener('click',()=>links?.classList.remove('open')));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});
$$('.fade-up').forEach(e=>io.observe(e));
