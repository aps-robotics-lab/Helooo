(() => {
  document.documentElement.classList.add('nova-ui');
  const progress=document.createElement('div'); progress.className='nova-progress'; document.body.appendChild(progress);
  const cursor=document.createElement('div'); cursor.className='nova-cursor';
  const dot=document.createElement('div'); dot.className='nova-cursor-dot'; document.body.append(cursor,dot);
  let tx=innerWidth/2,ty=innerHeight/2,cx=tx,cy=ty;
  const move=e=>{tx=e.clientX;ty=e.clientY;document.body.style.setProperty('--mx',tx+'px');document.body.style.setProperty('--my',ty+'px')};
  addEventListener('pointermove',move,{passive:true});
  function raf(){cx+=(tx-cx)*.16;cy+=(ty-cy)*.16;cursor.style.left=cx+'px';cursor.style.top=cy+'px';dot.style.left=tx+'px';dot.style.top=ty+'px';requestAnimationFrame(raf)} raf();
  document.querySelectorAll('a,button,input,select,textarea,.arena-card,.team-size-card,.event-option-card').forEach(el=>{el.addEventListener('mouseenter',()=>{cursor.style.width='34px';cursor.style.height='34px';cursor.style.background='rgba(92,236,255,.06)'});el.addEventListener('mouseleave',()=>{cursor.style.width='18px';cursor.style.height='18px';cursor.style.background='transparent'})});
  const items=[...document.querySelectorAll('section,article,.form-section,.arena-card,.rule-card,.rules-grid article,.side-card,.origin-grid,.phase-strip>div')];
  items.forEach((el,i)=>{el.classList.add('reveal');el.style.transitionDelay=Math.min(i%7*45,270)+'ms'});
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -40px'}); items.forEach(x=>io.observe(x));
  addEventListener('scroll',()=>{const h=document.documentElement;progress.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';},{passive:true});
  document.querySelectorAll('a[href]').forEach(a=>{const href=a.getAttribute('href'); if(!href||href.startsWith('#')||href.startsWith('http')||href.startsWith('mailto:')||a.target==='_blank')return; a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();const t=document.createElement('div');t.className='page-transition';document.body.appendChild(t);setTimeout(()=>location.href=href,430)})});
  document.querySelectorAll('.arena-card,.rule-card,.rules-grid article,.side-card').forEach(card=>{card.addEventListener('pointermove',e=>{if(innerWidth<900)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg) translateY(-6px)`});card.addEventListener('pointerleave',()=>card.style.transform='')});
  addEventListener('load',()=>setTimeout(()=>document.body.classList.add('nova-ready'),80));
})();
