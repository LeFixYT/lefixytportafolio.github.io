document.addEventListener('DOMContentLoaded', () => {
  initPanels();
  initIntro();
  initQuickTour();
  initStars();
  initWeather();
  initThemeSwitcher();
  initMusicPlayer();
  initReveal();
  initEasterEggs();
  initYouTubeEasterEgg();
  initMobileMenu();
});

function initPanels() {
  const buttons = document.querySelectorAll('[data-target]');
  const panels = document.querySelectorAll('.panel');

  const activate = (target) => {
    const panel = document.querySelector(`[data-panel="${target}"]`);
    if (!panel) return;

    panels.forEach(p =>
      p.classList.toggle('active', p.dataset.panel === target)
    );

    document.querySelectorAll('.nav-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.target === target)
    );

    panel.scrollTop = 0;

    panel.querySelectorAll('.reveal').forEach(el => {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });

    history.replaceState(null, '', `#${target}`);
    window.lefixActivatePanel = activate;
    playClickSound();
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      activate(btn.dataset.target);
    });
  });

  const initial = location.hash.replace('#', '');

  if (
    initial &&
    document.querySelector(`[data-panel="${initial}"]`)
  ) {
    activate(initial);
  }

  window.lefixActivatePanel = activate;
}


/* =========================
   INTRO / VERIFICATION
========================= */

function initIntro() {
  const overlay = document.getElementById('intro-overlay');
  const loader = document.getElementById('intro-loader');
  const verify = document.getElementById('intro-verify');
  const checkbox = document.getElementById('human-check');
  const enter = document.getElementById('verify-enter');

  if (!overlay) return;

  setTimeout(() => {
    if (loader) loader.style.display = 'none';
    if (verify) verify.style.display = 'block';
  }, 1000);

  if (!enter) return;

  enter.addEventListener('click', () => {
    if (!checkbox || !checkbox.checked) return;

    overlay.classList.add('hidden');

    const audio = document.getElementById('mp-audio');

    if (audio) {
      audio.play().catch(() => {});
    }

    const play = document.getElementById('mp-play');
    const pause = document.getElementById('mp-pause');

    if (play && pause) {
      play.style.display = 'none';
      pause.style.display = 'block';
    }

    playClickSound();
    setTimeout(() => window.dispatchEvent(new Event('lefix:show-tour-prompt')), 550);
  });
}


/* =========================
   QUICK TOUR
========================= */
function initQuickTour() {
  const prompt = document.getElementById('tour-prompt');
  const overlay = document.getElementById('tour-overlay');
  const yes = document.getElementById('tour-yes');
  const no = document.getElementById('tour-no');
  const skip = document.getElementById('tour-skip');
  const spotlight = document.getElementById('tour-spotlight');
  const card = document.getElementById('tour-card');
  const title = document.getElementById('tour-title');
  const description = document.getElementById('tour-description');
  const kicker = document.getElementById('tour-kicker');
  const count = document.getElementById('tour-step-count');
  const progress = document.getElementById('tour-progress-bar');
  const beat = document.getElementById('tour-beat');
  const flash = document.getElementById('tour-step-flash');
  const tourYoutube = document.getElementById('tour-youtube-player');
  const localAudio = document.getElementById('mp-audio');
  const playButton = document.getElementById('mp-play');
  const pauseButton = document.getElementById('mp-pause');
  const replayButton = document.getElementById('tour-replay');

  if (!prompt || !overlay || !yes || !no || !spotlight) return;

  const steps = [
    {panel:'home', selector:'.hero-copy', kicker:'01 · INICIO', title:'Aquí empieza todo.', description:'Aquí encontrarás quién es LeFix, qué hago y accesos rápidos a mis proyectos y contacto.', duration:5600},
    {panel:'home', selector:'.visual-card', kicker:'02 · IDENTIDAD', title:'Esta es mi identidad.', description:'Aquí verás mi avatar, mi estilo visual y una pequeña representación de cómo trabajo.', duration:5000},
    {panel:'home', selector:'.stats-row', kicker:'03 · EXPERIENCIA', title:'Aquí están mis números.', description:'Aquí encontrarás experiencia, jugadores, traducciones y soporte resumidos de un vistazo.', duration:5000},
    {panel:'services', selector:'.services-grid', kicker:'04 · SERVICIOS', title:'Aquí encontrarás lo que puedo hacer.', description:'Servicios de configuración, plugins, traducciones, tiendas, sistemas y optimización para servidores.', duration:5800},
    {panel:'plugins', selector:'.skills-layout', kicker:'05 · SKILLS', title:'Aquí están mis herramientas.', description:'Aquí encontrarás mis conocimientos, tecnologías, plugins y sistemas con los que trabajo.', duration:5200},
    {panel:'projects', selector:'.project-feature', kicker:'06 · PROYECTOS', title:'Aquí puedes ver mis trabajos.', description:'Aquí encontrarás proyectos destacados, resultados y ejemplos de lo que he construido.', duration:5600},
    {panel:'workflow', selector:'.process-grid', kicker:'07 · PROCESO', title:'Aquí verás cómo trabajo.', description:'Aquí encontrarás el proceso: idea, presupuesto, configuración, entrega y soporte.', duration:5000},
    {panel:'contact', selector:'.contact-layout', kicker:'08 · CONTACTO', title:'Aquí puedes encontrarme.', description:'Aquí encontrarás Discord, email y GitHub para hablar conmigo y empezar tu proyecto.', duration:5800}
  ];

  let running = false;
  let timer = null;
  let beatTimer = null;
  let stepIndex = 0;
  let focused = null;
  let localWasPlaying = false;
  let tourVariant = 0;
  const BEAT_MS = 520;

  const TOUR_VARIANTS = [
    { id: 'L7b9FMWFlVI', start: 62, label: 'Tour 1 · Intro', watch: 'https://www.youtube.com/watch?v=L7b9FMWFlVI&t=62s' },
    { id: 'scyHVh-WTK0', start: 0, label: 'Tour 2 · Special', watch: 'https://www.youtube.com/watch?v=scyHVh-WTK0' },
    { id: 'OPChpZbJWQ4', start: 0, label: 'Tour 3 · Final', watch: 'https://www.youtube.com/watch?v=OPChpZbJWQ4' }
  ];

  let tourPlayerReady = false;
  let tourPlayerFailed = false;
  let tourLoadToken = 0;

  // YouTube puede restringir la inserción de algunos vídeos.
  // No intentamos sustituir el vídeo elegido automáticamente: el tour debe
  // permanecer en el vídeo seleccionado y nunca cambiarlo por otro.
  function buildTourVideoUrl(variant) {
    const origin = encodeURIComponent(window.location.origin);
    const start = Number(variant.start || 0);
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      start: String(start),
      controls: '0',
      rel: '0',
      playsinline: '1',
      modestbranding: '1',
      enablejsapi: '1',
      cc_load_policy: '0',
      iv_load_policy: '3',
      origin: window.location.origin
    });
    return `https://www.youtube-nocookie.com/embed/${variant.id}?${params.toString()}`;
  }

  function showPrompt() {
    if (running) return;
    prompt.classList.add('open');
    prompt.setAttribute('aria-hidden','false');
  }

  function hidePrompt() {
    prompt.classList.remove('open');
    prompt.setAttribute('aria-hidden','true');
  }

  function clearFocus() {
    if (focused) {
      focused.classList.remove('tour-focus','tour-focus-beat');
      focused = null;
    }
    spotlight.style.left = '-9999px';
    spotlight.style.top = '-9999px';
    spotlight.style.width = '0px';
    spotlight.style.height = '0px';
  }

  function positionSpotlight(el) {
    const r = el.getBoundingClientRect();
    const pad = Math.min(26, Math.max(12, Math.round(Math.min(r.width,r.height || 100)*0.035)));
    const left = Math.max(8, r.left-pad);
    const top = Math.max(8, r.top-pad);
    const width = Math.min(window.innerWidth-left-8, r.width+pad*2);
    const height = Math.min(window.innerHeight-top-8, r.height+pad*2);
    spotlight.style.left = `${left}px`;
    spotlight.style.top = `${top}px`;
    spotlight.style.width = `${width}px`;
    spotlight.style.height = `${height}px`;
    spotlight.style.borderRadius = getComputedStyle(el).borderRadius || '22px';
  }

  function updateSpotlight() {
    if (focused) positionSpotlight(focused);
  }

  function spawnParticles() {
    const layer = document.getElementById('tour-particles');
    if (!layer) return;
    layer.innerHTML = '';
    const rect = focused?.getBoundingClientRect();
    const cx = rect ? ((rect.left + rect.width/2) / window.innerWidth) * 100 : 50;
    const cy = rect ? ((rect.top + rect.height/2) / window.innerHeight) * 100 : 45;
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('i');
      p.className = 'tour-particle';
      p.style.left = `${Math.max(4,Math.min(96,cx+(Math.random()-.5)*10))}%`;
      p.style.top = `${Math.max(4,Math.min(96,cy+(Math.random()-.5)*10))}%`;
      p.style.setProperty('--dx', `${(Math.random()-.5)*45}vw`);
      p.style.setProperty('--dy', `${(Math.random()-.5)*35}vh`);
      p.style.setProperty('--delay', `${Math.random()*.12}s`);
      layer.appendChild(p);
    }
  }

  function pulseBeat() {
    beat?.classList.remove('pulse');
    if (beat) { void beat.offsetWidth; beat.classList.add('pulse'); }
    card?.classList.remove('beat');
    if (card) { void card.offsetWidth; card.classList.add('beat'); }
    flash?.classList.remove('pulse');
    if (flash) { void flash.offsetWidth; flash.classList.add('pulse'); }
    if (focused) {
      focused.classList.remove('tour-focus-beat');
      void focused.offsetWidth;
      focused.classList.add('tour-focus-beat');
    }
  }

  function postYoutube(command, args=[]) {
    if (!tourYoutube?.contentWindow) return;
    try {
      tourYoutube.contentWindow.postMessage(JSON.stringify({event:'command',func:command,args}), '*');
    } catch (_) {}
  }

  function loadTourVariant() {
    if (!tourYoutube) return;
    const variant = TOUR_VARIANTS[tourVariant];
    tourLoadToken++;
    tourPlayerFailed = false;
    tourPlayerReady = false;
    tourYoutube.dataset.loaded = '0';
    tourYoutube.src = buildTourVideoUrl(variant);
    tourYoutube.dataset.loaded = '1';
  }

  function showTourEmbedFallback(){
    // Intencionadamente vacío. Nunca cambiamos el vídeo seleccionado por otro.
  }

  function startTourSoundtrack() {
    loadTourVariant();
    const variant = TOUR_VARIANTS[tourVariant];
    setTimeout(() => {
      if (!running) return;
      if (variant.start) postYoutube('seekTo',[variant.start,true]);
      postYoutube('setVolume',[65]);
      postYoutube('playVideo');
      setTimeout(() => { if (running) postYoutube('unMute'); }, 700);
    }, 900);
  }

  function stopTourSoundtrack() {
    postYoutube('pauseVideo');
  }

  function finish() {
    clearTimeout(timer);
    clearInterval(beatTimer);
    stopTourSoundtrack();
    clearFocus();
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('tour-running');
    if (localWasPlaying && localAudio) {
      localAudio.play().catch(() => {});
      if (playButton) playButton.style.display='none';
      if (pauseButton) pauseButton.style.display='block';
    }
    if (window.lefixActivatePanel) window.lefixActivatePanel('home');
    stepIndex = 0;
    running = false;
    showEasterToast(`✨ Tour ${tourVariant + 1}/3 completado. Pulsa ↻ para repetirlo.`);
  }

  function showStep(index) {
    if (!running) return;
    if (index >= steps.length) { finish(); return; }
    stepIndex = index;
    const step = steps[index];
    clearFocus();
    if (window.lefixActivatePanel) window.lefixActivatePanel(step.panel);

    // Give the panel one frame to render before measuring it.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!running) return;
      const el = document.querySelector(`[data-panel="${step.panel}"] ${step.selector}`);
      if (!el) { timer = setTimeout(() => showStep(index+1), step.duration); return; }
      focused = el;
      focused.classList.add('tour-focus');
      el.scrollIntoView({behavior:'instant', block:'center', inline:'center'});
      positionSpotlight(el);
      spawnParticles();

      title.textContent = step.title;
      description.textContent = step.description;
      kicker.textContent = step.kicker;
      count.textContent = `${String(index+1).padStart(2,'0')} / ${String(steps.length).padStart(2,'0')}`;
      progress.style.width = `${((index+1)/steps.length)*100}%`;
      card?.classList.remove('step-in');
      void card?.offsetWidth;
      card?.classList.add('step-in');
      pulseBeat();
      timer = setTimeout(() => showStep(index+1), step.duration);
    }));
  }

  function start() {
    hidePrompt();
    // The first entrance uses variant 1. Every later replay advances to the next video.
    if (running === false && window.lefixTourStartedOnce) {
      tourVariant = (tourVariant + 1) % TOUR_VARIANTS.length;
    }
    window.lefixTourStartedOnce = true;
    running = true;
    localWasPlaying = !!localAudio && !localAudio.paused;
    if (localAudio) localAudio.pause();
    if (playButton) playButton.style.display='block';
    if (pauseButton) pauseButton.style.display='none';
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('tour-running');
    startTourSoundtrack();
    clearInterval(beatTimer);
    beatTimer = setInterval(pulseBeat, BEAT_MS);
    pulseBeat();
    showStep(0);
  }

  // No fallback automático: si YouTube rechaza el embed, el vídeo seleccionado
  // permanece seleccionado y el tour continúa sin cambiar a otro vídeo.

  yes.addEventListener('click', start);
  no.addEventListener('click', () => { hidePrompt(); replayButton?.classList.add('show'); });
  replayButton?.addEventListener('click', showPrompt);
  skip?.addEventListener('click', finish);
  window.addEventListener('resize', updateSpotlight);
  window.addEventListener('scroll', updateSpotlight, true);
  window.addEventListener('lefix:show-tour-prompt', showPrompt);
  window.addEventListener('lefix:replay-tour', () => { if (!running) showPrompt(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (prompt.classList.contains('open')) hidePrompt();
      if (running) finish();
    }
  });
}


/* =========================
   STAR BACKGROUND
========================= */

function initStars() {
  const canvas = document.getElementById('stars-bg');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  let stars = [];

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    stars = Array.from(
      { length: 110 },
      () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        s: Math.random() * 0.25 + 0.04
      })
    );
  };

  const draw = () => {
    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.fillStyle = 'rgba(255,255,255,.75)';

    stars.forEach(star => {
      ctx.beginPath();

      ctx.arc(
        star.x,
        star.y,
        star.r,
        0,
        Math.PI * 2
      );

      ctx.fill();

      star.y += star.s;

      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });

    requestAnimationFrame(draw);
  };

  resize();

  window.addEventListener('resize', resize);

  draw();
}


/* =========================
   WEATHER / PARTICLES
========================= */

function initWeather() {
  const layer = document.querySelector('.snow-layer');

  if (!layer) return;

  layer.innerHTML = '';

  /* Navidad */

  if (document.body.classList.contains('theme-xmas')) {

    for (let i = 0; i < 80; i++) {

      const element = document.createElement('i');

      element.className = 'snowflake';

      element.style.left =
        Math.random() * 100 + '%';

      element.style.animationDelay =
        Math.random() * 8 + 's';

      element.style.animationDuration =
        4 + Math.random() * 5 + 's';

      element.style.opacity =
        0.2 + Math.random() * 0.7;

      layer.appendChild(element);
    }
  }

  /* Halloween */

  if (
    document.body.classList.contains(
      'theme-halloween'
    )
  ) {

    for (let i = 0; i < 45; i++) {

      const element =
        document.createElement('i');

      element.className =
        'halloween-spark';

      element.style.left =
        Math.random() * 100 + '%';

      element.style.animationDelay =
        Math.random() * 3 + 's';

      element.style.animationDuration =
        2 + Math.random() * 2 + 's';

      layer.appendChild(element);
    }
  }
}


/* =========================
   THEME SWITCHER
========================= */

function initThemeSwitcher() {
  const button = document.querySelector('[data-theme-cycle]');
  const themes = ['default','aurora','galaxy','cyberpunk','inferno','ocean','sakura','toxic','bloodmoon','frozen','xmas','halloween','sunset','emerald'];
  let index = 0;

  const saved = localStorage.getItem('lefix-theme');
  if (saved && themes.includes(saved)) {
    index = themes.indexOf(saved);
    applyTheme(saved, false);
  }

  if (!button) return;
  button.addEventListener('click', () => {
    index = (index + 1) % themes.length;
    applyTheme(themes[index], true);
  });
}

function applyTheme(theme, save = true) {
  const themes = ['default','aurora','galaxy','cyberpunk','inferno','ocean','sakura','toxic','bloodmoon','frozen','xmas','halloween','sunset','emerald'];
  if (!themes.includes(theme)) theme = 'default';

  document.body.classList.remove(...themes.map(t => `theme-${t}`));
  document.body.classList.add(`theme-${theme}`);

  if (save) localStorage.setItem('lefix-theme', theme);
  initWeather();

  const names = { default:'Default', aurora:'Aurora', galaxy:'Galaxy', cyberpunk:'Cyberpunk', inferno:'Inferno', ocean:'Ocean', sakura:'Sakura', toxic:'Toxic', bloodmoon:'Blood Moon', frozen:'Frozen', xmas:'Christmas', halloween:'Halloween', sunset:'Sunset', emerald:'Emerald' };
}

/* =========================
   MUSIC PLAYER
========================= */

function initMusicPlayer() {
  const audio = document.getElementById('mp-audio');
  if (!audio) return;

  const play = document.getElementById('mp-play');
  const pause = document.getElementById('mp-pause');
  const prev = document.getElementById('mp-prev');
  const next = document.getElementById('mp-next');
  const seek = document.getElementById('mp-seek');
  const volume = document.getElementById('mp-volume');
  const mute = document.getElementById('mp-mute');
  const time = document.getElementById('mp-time');
  const title = document.getElementById('mp-title');
  const progress = document.querySelector('.mp-seek-progress');
  // Playlist original del proyecto: se conservan únicamente las dos pistas que ya tenía LeFix.
  const tracks = [
    ['audio/chill1.mp3', 'Música · Chill 01'],
    ['audio/chill2.mp3', 'Música · Chill 02']
  ];
  let current = 0;
  let previousVolume = 0.05;

  const formatTime = seconds => {
    seconds = isFinite(seconds) ? seconds : 0;
    const minutes = Math.floor(seconds / 60);
    const secs = String(Math.floor(seconds % 60)).padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const updateMuteIcon = () => {
    if (!mute) return;
    mute.textContent = audio.volume === 0 ? '🔇' : audio.volume < 0.5 ? '🔉' : '🔊';
    mute.title = audio.volume === 0 ? 'Activar sonido' : 'Silenciar';
  };

  const setVolume = value => {
    const v = Math.max(0, Math.min(1, Number(value) || 0));
    audio.volume = v;
    if (volume) volume.value = v;
    if (v > 0) previousVolume = v;
    updateMuteIcon();
  };

  setVolume(0.05);

  window.addEventListener('lefix:pause-local-music', () => {
    audio.pause();
    if (pause) pause.style.display = 'none';
    if (play) play.style.display = 'grid';
  });

  const loadTrack = autoPlay => {
    audio.src = tracks[current][0];
    if (title) title.textContent = tracks[current][1];
    audio.load();
    if (autoPlay) audio.play().catch(() => {});
  };

  play?.addEventListener('click', () => {
    audio.play().catch(() => {});
    if (play) play.style.display = 'none';
    if (pause) pause.style.display = 'grid';
    playClickSound();
  });

  pause?.addEventListener('click', () => {
    audio.pause();
    if (pause) pause.style.display = 'none';
    if (play) play.style.display = 'grid';
    playClickSound();
  });

  prev?.addEventListener('click', () => {
    current = (current - 1 + tracks.length) % tracks.length;
    loadTrack(true);
  });

  next?.addEventListener('click', () => {
    current = (current + 1) % tracks.length;
    loadTrack(true);
  });

  volume?.addEventListener('input', () => setVolume(volume.value));

  mute?.addEventListener('click', () => {
    if (audio.volume > 0) {
      previousVolume = audio.volume;
      setVolume(0);
    } else {
      setVolume(previousVolume || 0.05);
    }
  });

  seek?.addEventListener('input', () => {
    if (audio.duration) audio.currentTime = Number(seek.value);
  });

  audio.addEventListener('loadedmetadata', () => {
    if (seek) seek.max = Math.floor(audio.duration || 0);
    if (time) time.textContent = `0:00 / ${formatTime(audio.duration)}`;
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    if (seek) seek.value = Math.floor(audio.currentTime);
    if (progress) progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    if (time) time.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  });

  audio.addEventListener('play', () => {
    if (play) play.style.display = 'none';
    if (pause) pause.style.display = 'grid';
  });

  audio.addEventListener('pause', () => {
    if (pause) pause.style.display = 'none';
    if (play) play.style.display = 'grid';
  });

  audio.addEventListener('volumechange', updateMuteIcon);

  audio.addEventListener('ended', () => {
    current = (current + 1) % tracks.length;
    loadTrack(true);
  });
}


/* =========================
   EASTER EGGS
========================= */
function showEasterToast(message) {
  let toast = document.getElementById('easter-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'easter-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.__lefixToastTimer);
  window.__lefixToastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function initEasterEggs() {
  const brand = document.querySelector('.brand');
  const footerSecret = document.getElementById('footer-secret');
  const avatar = document.querySelector('.avatar-hero');
  const statNodes = document.querySelectorAll('.stat-value, .hero-stat, [data-secret-stat]');
  const modal = document.getElementById('easter-ad-modal');
  const closeBtn = document.getElementById('easter-ad-close');
  const goBtn = document.getElementById('easter-ad-go');

  let brandClicks = 0;
  let avatarClicks = 0;
  let footerClicks = 0;
  let brandTimer, avatarTimer, footerTimer;

  const RICKROLL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

  const openAd = () => {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('easter-modal-open');
    playClickSound();
  };

  const closeAd = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('easter-modal-open');
  };

  closeBtn?.addEventListener('click', closeAd);
  modal?.addEventListener('click', e => {
    if (e.target.matches('[data-close-easter]')) closeAd();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAd();
  });
  goBtn?.addEventListener('click', () => {
    closeAd();
    window.open(RICKROLL, '_blank', 'noopener,noreferrer');
  });

  // 1) Logo: 5 clics = código de descuento.
  brand?.addEventListener('click', () => {
    brandClicks++;
    clearTimeout(brandTimer);
    brandTimer = setTimeout(() => { brandClicks = 0; }, 1800);
    if (brandClicks === 5) {
      brandClicks = 0;
      showEasterToast('🎁 PROMO SECRETA · Código LEFIX5 · 5% de descuento');
      navigator.clipboard?.writeText('LEFIX5').catch(() => {});
    }
  });

  // 2) Avatar: 3 clics abre el popup falso; ya no hay redirección instantánea.
  avatar?.addEventListener('click', () => {
    avatarClicks++;
    clearTimeout(avatarTimer);
    avatarTimer = setTimeout(() => { avatarClicks = 0; }, 1500);
    if (avatarClicks === 3) {
      avatarClicks = 0;
      openAd();
    }
  });

  // 3) Footer: ahora funciona con un clic y además tiene un segundo nivel con 3 clics.
  footerSecret?.addEventListener('click', () => {
    footerClicks++;
    clearTimeout(footerTimer);
    footerTimer = setTimeout(() => { footerClicks = 0; }, 1600);
    if (footerClicks === 1) {
      showEasterToast('👀 Has encontrado el rincón secreto...');
    }
    if (footerClicks === 3) {
      footerClicks = 0;
      openAd();
    }
  });

  // 4) Doble clic en una estadística = mensaje troll.
  statNodes.forEach(node => {
    node.addEventListener('dblclick', () => {
      showEasterToast('📊 ESTADÍSTICA ALTERADA · +9999 aura temporal');
      node.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.16) rotate(-2deg)' },
        { transform: 'scale(1)' }
      ], { duration: 500, easing: 'ease-out' });
    });
  });

  // 5) Konami code: cambia temporalmente al tema Cyberpunk.
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let keyIndex = 0;
  document.addEventListener('keydown', e => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === konami[keyIndex]) {
      keyIndex++;
      if (keyIndex === konami.length) {
        keyIndex = 0;
        applyTheme('cyberpunk', true);
        showEasterToast('⚡ CYBER MODE ACTIVADO · LeFix.exe online');
      }
    } else {
      keyIndex = 0;
    }
  });

  // 6) Triple clic en el reproductor = pista secreta.
  const player = document.querySelector('.music-player');
  let musicClicks = 0, musicTimer;
  player?.addEventListener('click', () => {
    musicClicks++;
    clearTimeout(musicTimer);
    musicTimer = setTimeout(() => { musicClicks = 0; }, 900);
    if (musicClicks === 3) {
      musicClicks = 0;
      showEasterToast('🎵 LeFix Radio · has encontrado el canal secreto');
    }
  });

  // 7) Ctrl + Alt + L = sorpresa.
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      showEasterToast('🕵️ LEFIX SECRET MODE · Nada que ver aquí...');
      document.body.classList.toggle('secret-mode');
    }
  });
}


/* =========================
   YOUTUBE EASTER EGG
========================= */
function initYouTubeEasterEgg(){
  const modal = document.getElementById('youtube-easter-modal');
  const frame = document.getElementById('youtube-easter-frame');
  const input = document.getElementById('youtube-easter-url');
  const load = document.getElementById('youtube-easter-load');
  const close = document.getElementById('youtube-easter-close');
  const openYoutube = document.getElementById('youtube-easter-open');
  const playerTitle = document.getElementById('mp-title');
  const status = document.getElementById('youtube-easter-status');
  const list = document.getElementById('youtube-track-list');

  if (!modal || !frame || !input || !load) return;

  // Start with a normal watch URL that is known to resolve as a standard YouTube video.
  // Individual owners can still change embedding permissions later.
  const FEATURED_URL = 'https://youtu.be/sDMxQF18yvA?si=sayktiD408Nd6RMa';
  const DEFAULT_URL = FEATURED_URL;
  let loadTimer = null;

  // YouTube links selected for the LeFix Phonk Radio.
  // They remain external embeds/links; the site does not download or re-host copyrighted audio.
  const YT_TRACKS = [
    ['🎵 Phonk · Track 01', 'https://youtu.be/sDMxQF18yvA?si=sayktiD408Nd6RMa'],
    ['🔥 Phonk · Track 02', 'https://www.youtube.com/watch?v=fmDMd9CuuVs&list=RDfmDMd9CuuVs&start_radio=1'],
    ['💜 Phonk · Track 03', 'https://www.youtube.com/watch?v=NPVUYlDCNCs&list=RDMM&index=19']
  ];

  function normalize(raw){
    const value = String(raw || '').trim();
    if (!value) return null;
    try {
      if (/^[A-Za-z0-9_-]{11}$/.test(value)) return {id:value, list:''};
      const u = new URL(value);
      const host = u.hostname.replace(/^www\./,'').toLowerCase();
      let id = '';
      let listId = u.searchParams.get('list') || '';

      if (host === 'youtu.be') {
        id = u.pathname.split('/').filter(Boolean)[0] || '';
      } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
        id = u.searchParams.get('v') || '';
        if (!id) {
          const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/);
          if (m) id = m[1];
        }
      }

      // RD* is YouTube's generated Mix/Radio list. Treat it as a video link first;
      // embedding the generated mix as a playlist is unreliable.
      if (listId.startsWith('RD')) listId = '';
      if (!id && !listId) return null;
      return {id, list:listId};
    } catch {
      return null;
    }
  }

  function watchUrl(raw){
    try {
      const u = new URL(raw);
      return u.toString();
    } catch {
      if (/^[A-Za-z0-9_-]{11}$/.test(String(raw).trim())) {
        return `https://www.youtube.com/watch?v=${String(raw).trim()}`;
      }
      return null;
    }
  }

  function buildEmbed(parsed){
    if (!parsed) return null;
    const base = 'https://www.youtube-nocookie.com/embed/';
    const params = new URLSearchParams({
      autoplay: '1',
      playsinline: '1',
      rel: '0',
      modestbranding: '1',
      cc_load_policy: '0',
      iv_load_policy: '3'
    });
    if (parsed.list) {
      params.set('list', parsed.list);
      return `${base}videoseries?${params.toString()}`;
    }
    if (!parsed.id) return null;
    return `${base}${encodeURIComponent(parsed.id)}?${params.toString()}`;
  }

  function setStatus(text, error=false){
    if (!status) return;
    status.textContent = text;
    status.classList.toggle('error', error);
  }

  function open(url=DEFAULT_URL){
    // YouTube takes audio priority: stop the portfolio music immediately.
    const localAudio = document.getElementById('mp-audio');
    const mpPlay = document.getElementById('mp-play');
    const mpPause = document.getElementById('mp-pause');
    if (localAudio && !localAudio.paused) localAudio.pause();
    if (mpPlay) mpPlay.style.display = 'grid';
    if (mpPause) mpPause.style.display = 'none';

    const parsed = normalize(url);
    const watch = watchUrl(url);
    const embed = buildEmbed(parsed);
    if (!parsed || !watch || !embed){
      setStatus('❌ Ese enlace no parece ser un enlace válido de YouTube.', true);
      return;
    }

    input.value = watch;
    if (openYoutube) openYoutube.href = watch;
    // YouTube and the local Chill player must never play at the same time.
    window.dispatchEvent(new Event('lefix:pause-local-music'));
    setStatus('⏳ Cargando YouTube…');
    frame.src = 'about:blank';
    clearTimeout(loadTimer);

    requestAnimationFrame(() => {
      frame.src = embed;
    });

    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('youtube-modal-open');

    // If Brave/extension/network blocks the embedded player, give a useful fallback
    // instead of leaving a black spinner forever.
    loadTimer = setTimeout(() => {
      setStatus('⚠️ Si sigue negro, este navegador o el vídeo está bloqueando la inserción. Usa «Abrir en YouTube ↗».', true);
    }, 6500);
  }

  function closeModal(){
    clearTimeout(loadTimer);
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    frame.src = 'about:blank';
    document.body.classList.remove('youtube-modal-open');
  }

  load.addEventListener('click', () => open(input.value));
  close?.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target.matches('[data-close-youtube]')) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  playerTitle?.addEventListener('dblclick', () => open(DEFAULT_URL));
  window.addEventListener('lefix:open-youtube', e => open(e.detail?.url || DEFAULT_URL));

  // Render the curated YouTube Phonk shelf.
  if (list) {
    list.innerHTML = '';
    YT_TRACKS.forEach(([name, url], index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'youtube-track-item';
      button.innerHTML = `<span>${name}</span><b>${index === 0 ? '★' : '▶'}</b>`;
      button.addEventListener('click', () => open(url));
      list.appendChild(button);
    });
  }
}

/* =========================
   REVEAL ANIMATIONS
========================= */

function initReveal() {

  document
    .querySelectorAll('.reveal')
    .forEach(element => {

      element.addEventListener(
        'animationend',
        () => {
          element.style.opacity = 1;
        }
      );

    });
}


/* =========================
   CLICK SOUND
========================= */

function playClickSound() {

  const audio =
    document.getElementById('ui-click');

  if (!audio) return;

  audio.currentTime = 0;

  audio.volume = 0.45;

  audio.play().catch(() => {});
}

