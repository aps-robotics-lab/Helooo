const nav=document.getElementById('nav'), menu=document.getElementById('menu'), links=document.getElementById('links');
window.addEventListener('scroll',()=>nav?.classList.toggle('scrolled',scrollY>20));
menu?.addEventListener('click',()=>links.classList.toggle('open'));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>links?.classList.remove('open')));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.section,.card,.people article,.ops article,.journey div,.messages').forEach(x=>io.observe(x));
