// --- click sound ---
const clickAudio = document.getElementById('click-audio');

function unlock() {
  const p = clickAudio.play();                     
  if (p && typeof p.then === 'function') {
    p.then(() => {                                 
      clickAudio.pause();
      clickAudio.currentTime = 0;
    }).finally(() => {
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('touchstart', unlock);
    });
  } else {
    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('touchstart', unlock);
  }
}
document.addEventListener('pointerdown', unlock, { once: true });
document.addEventListener('touchstart', unlock, { once: true });

document.addEventListener('click', (e) => {
  if (e.button && e.button !== 0) return;
  const el = e.target.closest('a, button, [role="button"], [data-click-sound]');
  if (!el) return;

  try {
    clickAudio.pause();            
    clickAudio.currentTime = 0;
    clickAudio.volume = 0.7;
    clickAudio.play().catch(() => {});
  } catch {}
});

// ======= Mobile nav toggle =======
const btn = document.querySelector('.nav-toggle');
const drawer = document.getElementById('m-drawer');
btn?.addEventListener('click', () => {
  const open = drawer.getAttribute('data-open') === 'true';
  drawer.setAttribute('data-open', String(!open));
  btn.setAttribute('aria-expanded', String(!open));
});

// ======= PNG sequence loop (Homepage-1..4.png) =======
const frameEl = document.getElementById('house-frame');
const basePath = 'assets/images/';
const frames = ['Homepage-1.png','Homepage-2.png','Homepage-3.png','Homepage-4.png'];
const fps = 2; // chỉnh 6–12 tùy cảm giác

// Preload để không bị nháy
const cache = [];
frames.forEach(name => { const img = new Image(); img.src = basePath + name; cache.push(img); });

let i = 0;
function tick(){
  if (!frameEl) return;
  frameEl.src = basePath + frames[i];
  i = (i + 1) % frames.length;
  setTimeout(tick, 1000 / fps);
}
tick();

window.addEventListener('load', () => {
  document.getElementById('loading-screen').classList.add('hidden');
});

document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');

    
    if(href && !href.startsWith('#') && !href.startsWith('javascript:')){
      e.preventDefault(); 
      const loading = document.getElementById('loading-screen');
      loading.classList.remove('hidden');

      setTimeout(() => {
        window.location.href = href;
      }, 2000);
    }
  });
});


// ===== About page logic =====
(function(){
  const bg = document.getElementById('about-bg');
  if(!bg) return; // không ở trang about thì thôi

  // 1) Loop About-1.png <-> About-2.png
  const base = 'assets/images/';
  const seq = ['About-1.png','About-2.png'];
  const cache = seq.map(n => { const i = new Image(); i.src = base+n; return i; });
  let k = 0;
  const fps = 2; // chậm, kiểu “nhân viên chớp mắt”
  function loop(){
    bg.src = base + seq[k];
    k = (k + 1) % seq.length;
    setTimeout(loop, 1000 / fps);
  }
  loop();

  // 2) Mở/đóng sheet About-3
  const openBtn = document.getElementById('about-open');
  const overlay = document.getElementById('about-overlay');
  const scene   = document.getElementById('about-scene');

  function openSheet(){
    overlay.setAttribute('data-open','true');
    overlay.setAttribute('aria-hidden','false');
    scene.classList.add('dim');             // làm mờ nền
  }
  function closeSheet(){
    overlay.setAttribute('data-open','false');
    overlay.setAttribute('aria-hidden','true');
    scene.classList.remove('dim');
  }

  openBtn?.addEventListener('click', openSheet);

  // Click ra ngoài sheet để đóng
  overlay?.addEventListener('click', (e)=>{
    const sheet = overlay.querySelector('.sheet');
    if(!sheet) return;
    if(!sheet.contains(e.target)) closeSheet();
  });

  // ESC để đóng (nếu có bàn phím)
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && overlay?.getAttribute('data-open') === 'true') closeSheet();
  });
})();

// Toggle nav giữ nguyên…

// Loading khi click link (có 2s delay như em)
document.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    e.preventDefault();

    // hiện loading nếu có
    const loading = document.getElementById('loading-screen');
    if (loading) loading.classList.remove('hidden');

    // đóng drawer/overlay để không chắn click
    const drawer = document.getElementById('m-drawer');
    drawer?.setAttribute('data-open','false');
    const ov = document.getElementById('about-overlay');
    ov?.setAttribute('data-open','false');
    document.body.classList.remove('modal-open');

    setTimeout(() => { window.location.href = href; }, 2000);
  });
});

// ===== About page logic =====
(function(){
  const bg = document.getElementById('about-bg');
  if(!bg) return;

  // loop About-1..2
  const base = 'assets/images/';
  const seq = ['About-1.png','About-2.png'];
  seq.forEach(n => { const i = new Image(); i.src = base+n; });
  let k = 0, fps = 2;
  (function loop(){
    bg.src = base + seq[k];
    k = (k + 1) % seq.length;
    setTimeout(loop, 1000 / fps);
  })();

  // open/close sheet
  const openBtn = document.getElementById('about-open');
  const overlay = document.getElementById('about-overlay');
  const scene   = document.getElementById('about-scene');

  function openSheet(){
    overlay.setAttribute('data-open','true');
    overlay.setAttribute('aria-hidden','false');
    scene.classList.add('dim');
    document.body.classList.add('modal-open');
  }
  function closeSheet(){
    overlay.setAttribute('data-open','false');
    overlay.setAttribute('aria-hidden','true');
    scene.classList.remove('dim');
    document.body.classList.remove('modal-open');
  }

  openBtn?.addEventListener('click', openSheet);
  overlay?.addEventListener('click', (e)=>{
    const sheet = overlay.querySelector('.sheet');
    if(sheet && !sheet.contains(e.target)) closeSheet();
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && overlay?.getAttribute('data-open') === 'true') closeSheet();
  });
})();

document.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.href;                       // dùng URL tuyệt đối
    if (!href) return;

    const isHash     = link.getAttribute('href').startsWith('#');
    const isJs       = link.getAttribute('href').startsWith('javascript:');
    const isMailto   = link.getAttribute('href').startsWith('mailto:');
    const isNewTab   = link.target === '_blank';
    const isExternal = link.origin !== window.location.origin;

    // -> Link ngoài / _blank / mailto: để mặc định (mở tab mới), KHÔNG show loading, KHÔNG delay
    if (isHash || isJs || isMailto || isNewTab || isExternal) return;

    // -> Nội bộ: show loading + delay
    e.preventDefault();
    const loading = document.getElementById('loading-screen') || (()=> {
      const el = document.createElement('div');
      el.id = 'loading-screen';
      el.className = 'hidden';
      el.innerHTML = '<img src="assets/images/loading-icon.gif" alt="Loading...">';
      document.body.appendChild(el);
      return el;
    })();
    loading.classList.remove('hidden');

    // đóng drawer/overlay cho sạch
    document.getElementById('m-drawer')?.setAttribute('data-open','false');
    document.getElementById('about-overlay')?.setAttribute('data-open','false');
    document.body.classList.remove('modal-open');

    setTimeout(() => { window.location.href = href; }, 2000);
  });
});

// ===== Artworks: grayscale theo độ xa gần (mobile/tablet) =====
(function(){
  const scene = document.querySelector('.artworks-scene');
  if(!scene) return;

  const isDesktopHover = window.matchMedia("(min-width:1024px) and (hover:hover) and (pointer:fine)").matches;
  if (isDesktopHover) return;

  const imgs = document.querySelectorAll('.art-card .thumb img');
  if (!imgs.length) return;

  const visible = new Set();
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      const img = e.target;
      if (e.isIntersecting){
        visible.add(img);
      } else {
        visible.delete(img);
        img.style.setProperty('--gray', '100%'); 
      }
    });
    update();
  }, { root: null, threshold: 0, rootMargin: "15% 0px 15% 0px" });

  imgs.forEach(img => { img.style.setProperty('--gray','100%'); io.observe(img); });

  function update(){
    const mid = window.innerHeight / 2;

    visible.forEach(img=>{
      const r = img.getBoundingClientRect();
      const imgMid = r.top + r.height/2;

      if (r.top >= 0 && r.bottom <= window.innerHeight){
        img.style.setProperty('--gray','0%');
        return;
      }

      const dist = Math.abs(imgMid - mid);
      const maxDist = (window.innerHeight / 2) + (r.height / 2);
      const gray = Math.min(100, Math.round((dist / maxDist) * 100));
      img.style.setProperty('--gray', `${gray}%`);
    });
  }

  window.addEventListener('scroll', update, { passive:true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
})();

