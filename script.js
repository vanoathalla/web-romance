// ============================================================
//  CONFIG — ganti PIN di sini
// ============================================================
const CORRECT_PIN = '1234';

// ============================================================
//  STATE
// ============================================================
let currentPin = '';
let locked = false;

// ============================================================
//  INTRO ANIMATION (after QR scan, before login)
//  5 different animation types — randomly picked each load (non-repeating)
// ============================================================
const INTRO_TYPES = ['envelope', 'ripple', 'constellation', 'heartbeat', 'scanner'];

function pickIntroType() {
  const lastType = localStorage.getItem('last_intro_type');
  const availableTypes = INTRO_TYPES.filter(t => t !== lastType);
  const chosen = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  localStorage.setItem('last_intro_type', chosen);
  return chosen;
}

function buildIntroContent(type) {
  const el = document.getElementById('intro-content');

  if (type === 'envelope') {
    el.innerHTML = `
      <div class="intro-envelope">
        <div class="intro-envelope-svg">
          <div class="intro-letter"></div>
        </div>
        <p class="intro-env-text">ada sesuatu buat kamu...</p>
        <p class="intro-env-sub">buka pelan-pelan ya ✨</p>
      </div>`;

  } else if (type === 'ripple') {
    el.innerHTML = `
      <div class="intro-ripple-wrap">
        <div class="intro-ripple-center">
          <div class="ripple-ring"></div>
          <div class="ripple-ring"></div>
          <div class="ripple-ring"></div>
          <div class="ripple-core"></div>
        </div>
        <p class="intro-ripple-text">hey, Sayang...</p>
        <p class="intro-ripple-sub">ada surprise nunggu kamu 💜</p>
      </div>`;

  } else if (type === 'constellation') {
    el.innerHTML = `
      <div class="intro-constellation">
        <div class="constellation-svg">
          <div class="c-dot"></div>
          <div class="c-dot"></div>
          <div class="c-dot"></div>
          <div class="c-dot"></div>
          <div class="c-dot"></div>
          <div class="c-dot"></div>
          <div class="c-dot"></div>
          <div class="c-dot"></div>
        </div>
        <p class="intro-const-text">just for you ✦</p>
        <p class="intro-const-sub">unlock untuk lihat surprise-nya 🌙</p>
      </div>`;

  } else if (type === 'heartbeat') {
    el.innerHTML = `
      <div class="intro-heartbeat">
        <div class="intro-heart-container">
          <div class="intro-heart-shape"></div>
          <div class="heart-pulse-ring"></div>
          <div class="heart-pulse-ring ring-delay"></div>
        </div>
        <p class="intro-heart-text">detak jantung untukmu...</p>
        <p class="intro-heart-sub">menyambungkan perasaan kita 💖</p>
      </div>`;

  } else if (type === 'scanner') {
    el.innerHTML = `
      <div class="intro-scanner">
        <div class="scanner-grid">
          <div class="scanner-line"></div>
        </div>
        <p class="intro-scan-text" id="scan-status-text">Memindai kode rahasia...</p>
      </div>`;

    // Dynamic scanning status text
    setTimeout(() => {
      const textEl = document.getElementById('scan-status-text');
      if (textEl) textEl.textContent = 'Kode terverifikasi! ✅';
    }, 1200);
    setTimeout(() => {
      const textEl = document.getElementById('scan-status-text');
      if (textEl) textEl.textContent = 'Membuka rahasia... 🔓';
    }, 2200);
  }
}

function runIntroCanvas(type) {
  const canvas  = document.getElementById('intro-canvas');
  const ctx     = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];

  if (type === 'envelope') {
    // Slow floating dust particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: .8 + Math.random() * 2.2,
        vx: (Math.random() - .5) * .4,
        vy: -.15 - Math.random() * .5,
        alpha: Math.random() * .6 + .2,
        color: `hsl(${200 + Math.random()*40}, 70%, ${60 + Math.random()*30}%)`
      });
    }

  } else if (type === 'ripple') {
    // Faster streaks radiating outward
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = .5 + Math.random() * 2;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: .5 + Math.random() * 1.5,
        alpha: .7,
        color: `hsl(${195 + Math.random()*30}, 80%, 70%)`
      });
    }

  } else if (type === 'constellation') {
    // Constellation: slow twinkle stars scattered
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: .4 + Math.random() * 1.8,
        vx: 0, vy: 0,
        alpha: Math.random(),
        alphaDir: (Math.random() > .5 ? 1 : -1) * (.005 + Math.random() * .015),
        color: `hsl(${210 + Math.random()*60}, 90%, ${70 + Math.random()*25}%)`
      });
    }

  } else if (type === 'heartbeat') {
    // Floating pink hearts/glow bubbles that drift slowly upwards and fade
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1.5 + Math.random() * 3,
        vx: (Math.random() - .5) * .3,
        vy: -.2 - Math.random() * .6,
        alpha: Math.random() * .5 + .3,
        color: `hsl(${340 + Math.random()*20}, 95%, ${65 + Math.random()*20}%)`
      });
    }

  } else if (type === 'scanner') {
    // Starburst digital matrix particles (pixels) that drift down and sideways
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1 + Math.random() * 2,
        vx: (Math.random() - .5) * 1.5,
        vy: .2 + Math.random() * 1.2,
        alpha: Math.random() * .6 + .4,
        color: `hsl(${190 + Math.random()*40}, 90%, ${70 + Math.random()*20}%)`
      });
    }
  }

  let frame;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (type === 'constellation') {
        p.alpha += p.alphaDir;
        if (p.alpha >= 1 || p.alpha <= 0) p.alphaDir *= -1;
      } else if (type === 'heartbeat' || type === 'scanner') {
        p.alpha -= .002;
        if (p.alpha <= 0) {
          p.alpha = Math.random() * .6 + .4;
          p.x = Math.random() * canvas.width;
          p.y = (type === 'heartbeat') ? canvas.height : 0;
        }
      } else {
        p.alpha -= .004;
      }

      // Wrap or reset
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) {
        if (type === 'heartbeat') {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
          p.alpha = Math.random() * .5 + .3;
        } else {
          p.y = canvas.height;
        }
      }
      if (p.y > canvas.height) {
        if (type === 'envelope') { p.y = canvas.height; p.alpha = .4; }
        else if (type === 'scanner') {
          p.y = 0;
          p.x = Math.random() * canvas.width;
          p.alpha = Math.random() * .6 + .4;
        }
      }
    });
    ctx.globalAlpha = 1;
    frame = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(frame);
}

function showIntro() {
  const overlay = document.getElementById('intro-overlay');
  const type = pickIntroType();

  buildIntroContent(type);
  const stopCanvas = runIntroCanvas(type);

  function revealLogin() {
    overlay.classList.add('fade-out');
    const login = document.getElementById('page-login');
    login.classList.remove('hidden');
    login.offsetHeight;
    login.classList.add('active');

    setTimeout(() => {
      overlay.classList.add('hidden');
      stopCanvas();
    }, 800);
  }

  // Show login page after 3s
  setTimeout(revealLogin, 3000);

  // Safety fallback — if something stalls, force-show login after 6s
  setTimeout(() => {
    const login = document.getElementById('page-login');
    if (!login.classList.contains('active')) {
      revealLogin();
    }
  }, 6000);
}

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Start intro animation immediately
  showIntro();

  // Bind keypad buttons
  document.querySelectorAll('.kbtn[data-n]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      addKeypadRipple(btn, e);
      pressKey(btn.dataset.n);
    });
  });
  document.getElementById('del-btn').addEventListener('click', (e) => {
    addKeypadRipple(document.getElementById('del-btn'), e);
    deleteKey();
  });

  // Setup scroll reveal on main page
  setupReveal();
});

// ============================================================
//  KEYPAD LOGIC
// ============================================================
function pressKey(num) {
  if (locked) return;
  if (currentPin.length >= 4) return;

  currentPin += num;
  updateDots();

  if (currentPin.length === 4) {
    locked = true;
    setTimeout(() => checkPin(), 220);
  }
}

function deleteKey() {
  if (locked) return;
  if (currentPin.length === 0) return;
  currentPin = currentPin.slice(0, -1);
  updateDots();
  hideError();
}

function updateDots() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById('pd' + i);
    if (i < currentPin.length) {
      dot.classList.add('on');
    } else {
      dot.classList.remove('on');
    }
  }
}

function checkPin() {
  if (currentPin === CORRECT_PIN) {
    showBloom();
  } else {
    showError();
    setTimeout(() => {
      currentPin = '';
      updateDots();
      hideError();
      locked = false;
    }, 1300);
  }
}

function showError() {
  const el = document.getElementById('pin-err');
  el.classList.remove('hidden');
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = '';
}

function hideError() {
  document.getElementById('pin-err').classList.add('hidden');
}

// ============================================================
//  KEYPAD RIPPLE EFFECT
// ============================================================
function addKeypadRipple(btn, e) {
  const rect = btn.getBoundingClientRect();
  const x = (e.clientX || e.touches?.[0]?.clientX || rect.left + rect.width/2) - rect.left;
  const y = (e.clientY || e.touches?.[0]?.clientY || rect.top + rect.height/2) - rect.top;
  const ripple = document.createElement('span');
  ripple.className = 'kbtn-ripple';
  const size = Math.max(rect.width, rect.height);
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x - size/2}px;top:${y - size/2}px;`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
}

// ============================================================
//  BLOOM ANIMATION — flower burst + petal rain
// ============================================================
const FLOWERS = ['🌸','🌹','🌺','🌻','🌷','🌼','💐','🌸','🌹','🌸'];
const PETALS  = ['🌸','🌹','🌷','🌼','🌺','💮','🏵️'];

function showBloom() {
  const overlay = document.getElementById('bloom-overlay');
  overlay.classList.remove('hidden');
  overlay.style.opacity = '1';

  buildFlowerBurst();
  buildPetalRain();

  // Fade out after 2.4s, then show main page
  setTimeout(() => {
    overlay.classList.add('fade-out');
    showPageMain();
    setTimeout(() => {
      overlay.classList.add('hidden');
      overlay.classList.remove('fade-out');
      overlay.style.opacity = '';
    }, 600);
  }, 2400);
}

function buildFlowerBurst() {
  const container = document.getElementById('flower-burst');
  container.innerHTML = '';

  const W  = window.innerWidth;
  const H  = window.innerHeight;
  const cx = W / 2;
  const cy = H / 2;
  const count = 40;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'fb-flower';

    const angle  = (i / count) * 360;
    const dist   = 80 + Math.random() * (Math.min(W, H) * 0.42);
    const tx     = Math.cos(angle * Math.PI / 180) * dist;
    const ty     = Math.sin(angle * Math.PI / 180) * dist;
    const sz     = 1.8 + Math.random() * 2.8;
    const dur    = 0.45 + Math.random() * 0.5;
    const delay  = Math.random() * 0.9;
    const r0     = Math.random() * 360;
    const r1     = r0 + 40 + Math.random() * 60;
    const r2     = r1 + 10 + Math.random() * 30;
    const flower = FLOWERS[i % FLOWERS.length];

    el.textContent = flower;
    el.style.cssText = `
      left:${cx}px; top:${cy}px;
      --tx:${tx}px; --ty:${ty}px;
      --sz:${sz}rem;
      font-size:${sz}rem;
      --dur:${dur}s; --delay:${delay}s;
      --r0:${r0}deg; --r1:${r1}deg; --r2:${r2}deg;
      animation-delay:${delay}s;
    `;
    container.appendChild(el);
  }

  // Second wave — bigger flowers near center
  for (let i = 0; i < 8; i++) {
    const el = document.createElement('div');
    el.className = 'fb-flower';
    const angle = (i / 8) * 360;
    const dist  = 20 + Math.random() * 60;
    const tx    = Math.cos(angle * Math.PI / 180) * dist;
    const ty    = Math.sin(angle * Math.PI / 180) * dist;
    const sz    = 3.5 + Math.random() * 2;
    const delay = 0.5 + Math.random() * 0.4;

    el.textContent = FLOWERS[i % FLOWERS.length];
    el.style.cssText = `
      left:${cx}px; top:${cy}px;
      --tx:${tx}px; --ty:${ty}px;
      font-size:${sz}rem;
      --dur:0.6s; --delay:${delay}s;
      --r0:0deg; --r1:20deg; --r2:10deg;
      animation-delay:${delay}s;
    `;
    container.appendChild(el);
  }
}

function buildPetalRain() {
  const container = document.getElementById('petal-rain');
  container.innerHTML = '';

  for (let i = 0; i < 30; i++) {
    const el = document.createElement('div');
    el.className = 'petal';
    const left  = Math.random() * 100;
    const sz    = 1.2 + Math.random() * 1.6;
    const dur   = 2.2 + Math.random() * 2.5;
    const delay = 0.4 + Math.random() * 2.8;
    const px    = (Math.random() - .5) * 120;
    const pr    = 120 + Math.random() * 300;
    const petal = PETALS[i % PETALS.length];

    el.textContent = petal;
    el.style.cssText = `
      left:${left}%;
      font-size:${sz}rem;
      --pd:${dur}s; --pdelay:${delay}s;
      --px:${px}px; --pr:${pr}deg; --pr2:${pr + 120}deg;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
    `;
    container.appendChild(el);
  }
}

// ============================================================
//  AMBIENT FLOATING PARTICLES (main page background)
// ============================================================
function initAmbientParticles() {
  const container = document.getElementById('ambient-particles');
  if (!container) return;
  const COLORS = [
    'rgba(90,159,212,VAL)',
    'rgba(192,132,252,VAL)',
    'rgba(255,143,171,VAL)',
    'rgba(255,214,102,VAL)',
    'rgba(144,200,245,VAL)',
  ];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('div');
    el.className = 'amb-particle';
    const size  = 4 + Math.random() * 10;
    const left  = Math.random() * 100;
    const dur   = 6 + Math.random() * 10;
    const delay = Math.random() * 8;
    const rise  = 80 + Math.random() * 120;
    const alpha = 0.15 + Math.random() * 0.3;
    const col   = COLORS[i % COLORS.length].replace('VAL', alpha.toFixed(2));
    el.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      bottom:${Math.random() * 40}%;
      background:${col};
      --amb-alpha:${alpha};
      --amb-rise:-${rise}px;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      filter: blur(${size > 10 ? 2 : 1}px);
    `;
    container.appendChild(el);
  }
}

// ============================================================
//  CUSTOM MUSIC PLAYER
// ============================================================
function initMusicPlayer() {
  const audio    = document.getElementById('song-audio');
  const playBtn  = document.getElementById('mp-play-btn');
  const icon     = document.getElementById('mp-play-icon');
  const fill     = document.getElementById('mp-progress-fill');
  const progress = document.getElementById('mp-progress-bg');
  const current  = document.getElementById('mp-current');
  const duration = document.getElementById('mp-duration');
  const disc     = document.querySelector('.mp-disc');
  const eq       = document.getElementById('mp-eq');

  if (!audio || !playBtn) return;

  function fmt(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  audio.addEventListener('loadedmetadata', () => {
    duration.textContent = fmt(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    fill.style.width = pct + '%';
    current.textContent = fmt(audio.currentTime);
  });

  audio.addEventListener('ended', () => {
    icon.textContent = '▶';
    disc.classList.remove('playing');
    eq.classList.remove('active');
  });

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {});
      icon.textContent = '⏸';
      disc.classList.add('playing');
      eq.classList.add('active');
    } else {
      audio.pause();
      icon.textContent = '▶';
      disc.classList.remove('playing');
      eq.classList.remove('active');
    }
  });

  // Scrub on click
  progress.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = progress.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });
}

// ============================================================
//  PAGE TRANSITION
// ============================================================
function showPageMain() {
  const login = document.getElementById('page-login');
  const main  = document.getElementById('page-main');

  login.classList.remove('active');
  login.classList.add('hidden');

  main.classList.remove('hidden');
  main.offsetHeight;
  main.classList.add('active');

  setTimeout(() => checkReveal(), 100);
  initMusicPlayer();
  setTimeout(() => initAmbientParticles(), 800);
}

// ============================================================
//  SCROLL REVEAL
// ============================================================
function setupReveal() {
  const scroll = document.getElementById('main-scroll');
  if (!scroll) return;
  scroll.addEventListener('scroll', checkReveal, { passive: true });
}

function checkReveal() {
  const scroll = document.getElementById('main-scroll');
  if (!scroll) return;

  const threshold = window.innerHeight * 0.88;

  // All reveal variants
  scroll.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < threshold && rect.bottom > 0) {
      el.classList.add('visible');
    }
  });

  // Polaroid flip-open
  scroll.querySelectorAll('.pol-flip:not(.pol-open)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < threshold && rect.bottom > 0) {
      el.classList.add('pol-open');
    }
  });

  // Birthday letter staggered reveal
  scroll.querySelectorAll('.letter-trigger:not(.letter-revealed)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < threshold && rect.bottom > 0) {
      el.classList.add('letter-revealed');
    }
  });

  // Footer confetti
  const footer = document.querySelector('.page-footer');
  if (footer) {
    const rect = footer.getBoundingClientRect();
    if (rect.top < threshold && !footer.dataset.confetti) {
      footer.classList.add('visible');
      spawnFooterConfetti();
    }
  }
}

// ============================================================
//  FOOTER CONFETTI
// ============================================================
function spawnFooterConfetti() {
  const footer = document.querySelector('.page-footer');
  if (!footer || footer.dataset.confetti) return;
  footer.dataset.confetti = '1';
  const COLORS = ['#c084fc','#5a9fd4','#ff8fab','#ffe566','#90e0a0'];
  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const size  = 5 + Math.random() * 7;
    const left  = 10 + Math.random() * 80;
    const dur   = 0.8 + Math.random() * 0.8;
    const delay = Math.random() * 0.6;
    const rot   = 180 + Math.random() * 360;
    const shape = Math.random() > 0.5 ? '50%' : '2px';
    el.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      top:0;
      background:${COLORS[i % COLORS.length]};
      border-radius:${shape};
      --cr:${rot}deg;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
    `;
    footer.appendChild(el);
  }
}
