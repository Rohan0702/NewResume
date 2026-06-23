(function spawnMotes(){
  const container = document.getElementById('particles');
  for(let i=0;i<28;i++){
    const m = document.createElement('div');
    m.className = 'mote';
    const size = 2 + Math.random()*5;
    m.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;
      animation-duration:${12+Math.random()*18}s;
      animation-delay:${-Math.random()*20}s;
    `;
    container.appendChild(m);
  }
})();

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      const fills = e.target.querySelectorAll('.skill-bar-fill');
      fills.forEach(f=>{ f.style.width = f.dataset.width; });
      observer.unobserve(e.target);
    }
  });
},{threshold:0.15});

document.querySelectorAll('.reveal,.reveal-left,.reveal-right')
  .forEach(el=>observer.observe(el));

document.querySelectorAll('.skill-bar-fill').forEach(f=>{
  const sectionObserver = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ f.style.width=f.dataset.width; sectionObserver.unobserve(f);}
    });
  },{threshold:0.5});
  sectionObserver.observe(f);
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{
  let current = '';
  sections.forEach(s=>{
    if(window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a=>{
    a.style.color = a.getAttribute('href') === '#'+current
      ? 'var(--gold-light)' : '';
  });
});

(function addGems(){
  const ring = document.querySelector('.orbit-ring');
  if(!ring) return;
  [0,120,240].forEach(deg=>{
    const g = document.createElement('div');
    g.className='gem';
    g.style.cssText=`
      transform:rotate(${deg}deg) translate(0,-60px);
      margin:-5px 0 0 -5px;
    `;
    const w = document.createElement('div');
    w.style.cssText=`
      position:absolute;top:50%;left:50%;width:0;height:0;
      animation:spin-slow ${10+deg/30}s linear infinite;
    `;
    w.appendChild(g);
    ring.parentElement.appendChild(w);
  });
})();

document.querySelectorAll('.stagger').forEach(parent=>{
  [...parent.children].forEach((child,i)=>{
    child.style.setProperty('--i',i);
  });
});

(function portfolioPlayEffect(){
  const cat = document.querySelector('.cat-trigger');
  const count = document.querySelector('.race-count');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let laps = 0;
  let racing = false;

  function updateCount(){
    count.textContent = String(laps).padStart(3, '0');
  }

  function popMeow(x, y){
    const pop = document.createElement('span');
    pop.className = 'meow-pop';
    pop.textContent = 'MEOW';
    pop.style.setProperty('--pop-x', `${x}px`);
    pop.style.setProperty('--pop-y', `${y}px`);
    document.body.appendChild(pop);
    window.setTimeout(()=>pop.remove(), 900);
  }

  function meow(event){
    if(!cat) return;
    cat.classList.add('is-meowing');
    const rect = cat.getBoundingClientRect();
    const x = event?.clientX || rect.left + rect.width / 2;
    const y = event?.clientY || rect.top;
    popMeow(x, y);
    window.setTimeout(()=>cat.classList.remove('is-meowing'), 260);
  }

  function launchRace(){
    if(racing) return;
    racing = true;
    laps += 1;
    updateCount();
    document.body.classList.remove('race-running');
    void document.body.offsetWidth;
    document.body.classList.add('race-running');
    window.setTimeout(()=>{
      document.body.classList.remove('race-running');
      racing = false;
    }, prefersReducedMotion ? 250 : 1500);
  }

  if(cat){
    cat.addEventListener('click', meow);
  }

  window.addEventListener('keydown', event=>{
    if(event.key === 'Shift' && !event.repeat){
      launchRace();
    }
  });

  window.addEventListener('pointermove', event=>{
    document.body.style.setProperty('--x', `${event.clientX}px`);
    document.body.style.setProperty('--y', `${event.clientY}px`);
  }, {passive:true});
})();
