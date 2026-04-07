document.addEventListener('DOMContentLoaded', () => {
  initPanels();
  initMusicPlayer();
  initWeather();
  initThemeSwitcher();
  playClickSound();
  initIntroGate();

  const hat = document.querySelector('.decor-hat');
  if (hat && document.body.classList.contains('theme-xmas')){
    hat.classList.add('visible','hat-hero');
  }
});

function initPanels(){
  const panels = document.querySelectorAll('.panel');
  const navBtns = document.querySelectorAll('.nav-btn');
  const hat = document.querySelector('.decor-hat');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;

      panels.forEach(p => p.classList.remove('active', 'panel-anim-enter'));
      navBtns.forEach(b => b.classList.remove('active'));

      const targetPanel = document.querySelector(`[data-panel="${target}"]`);
      if (!targetPanel) return;

      targetPanel.classList.add('active');
      void targetPanel.offsetWidth;
      targetPanel.classList.add('panel-anim-enter');
      btn.classList.add('active');
      playClickSound();

      if (hat){
        hat.classList.remove(
          'visible',
          'hat-hero',
          'hat-about',
          'hat-plugins',
          'hat-projects',
          'hat-contact',
          'hat-workflow'
        );

        if (document.body.classList.contains('theme-xmas')){
          if (target === 'home')          hat.classList.add('visible','hat-hero');
          else if (target === 'about')    hat.classList.add('visible','hat-about');
          else if (target === 'plugins')  hat.classList.add('visible','hat-plugins');
          else if (target === 'projects') hat.classList.add('visible','hat-projects');
          else if (target === 'contact')  hat.classList.add('visible','hat-contact');
          else if (target === 'workflow')  hat.classList.add('visible','hat-workflow');
        }
      }
    });
  });
}

function initMusicPlayer(){
  const audio  = document.getElementById('mp-audio');
  const canvas = document.getElementById('mp-visualizer');
  if (!audio || !canvas) return;

  const playBtn      = document.getElementById('mp-play');
  const pauseBtn     = document.getElementById('mp-pause');
  const prevBtn      = document.getElementById('mp-prev');
  const nextBtn      = document.getElementById('mp-next');
  const seekSlider   = document.getElementById('mp-seek');
  const volumeSlider = document.getElementById('mp-volume');
  const timeLabel    = document.getElementById('mp-time');
  const titleLabel   = document.getElementById('mp-title');
  const seekProgress   = document.querySelector('.mp-seek-progress');
  const volumeProgress = document.querySelector('.mp-volume-progress');

audio.volume = 0.05;
volumeSlider.value = 0.05;
if (volumeProgress){
volumeProgress.style.width = `5%`;
}

  let currentTrack = 0;

  const tracks = [
    'audio/chill1.mp3',
    'audio/chill2.mp3'
  ];

  const trackNames = [
    'Musica 🎶',
    'Musica 🎶'
  ];

  playBtn.addEventListener('click', () => {
    audio.play();
    playBtn.style.display  = 'none';
    pauseBtn.style.display = 'flex';
    playClickSound();
  });

  pauseBtn.addEventListener('click', () => {
    audio.pause();
    playBtn.style.display  = 'flex';
    pauseBtn.style.display = 'none';
    playClickSound();
  });

  seekSlider.addEventListener('input', () => {
    if (!audio.duration) return;
    audio.currentTime = seekSlider.value;
    const progressPercent = (seekSlider.value / audio.duration) * 100;
    if (seekProgress){
      seekProgress.style.width = `${progressPercent}%`;
    }
  });

  volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
    const volPercent = volumeSlider.value * 100;
    if (volumeProgress){
      volumeProgress.style.width = `${volPercent}%`;
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    if (!audio.duration) return;
    seekSlider.max = Math.floor(audio.duration);
    const duration = formatTime(audio.duration);
    timeLabel.textContent = `0:00 / ${duration}`;
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const current  = Math.floor(audio.currentTime);
    const duration = Math.floor(audio.duration);
    seekSlider.value = current;
    const progressPercent = (current / duration) * 100;
    if (seekProgress){
      seekProgress.style.width = `${progressPercent}%`;
    }
    const currentStr  = formatTime(audio.currentTime);
    const durationStr = formatTime(audio.duration);
    timeLabel.textContent = `${currentStr} / ${durationStr}`;
  });

  prevBtn.addEventListener('click', () => changeTrack(-1));
  nextBtn.addEventListener('click', () => changeTrack(1));

  function changeTrack(direction){
    currentTrack = (currentTrack + direction + tracks.length) % tracks.length;
    audio.src = tracks[currentTrack];
    titleLabel.textContent = trackNames[currentTrack];
    audio.load();
    audio.play();
    playBtn.style.display  = 'none';
    pauseBtn.style.display = 'flex';
    playClickSound();
  }

  function formatTime(seconds){
    const s = isNaN(seconds) ? 0 : seconds;
    const mins = Math.floor(s / 60) || 0;
    const secs = Math.floor(s % 60) || 0;
    return `${mins}:${secs.toString().padStart(2,'0')}`;
  }
}

function initWeather(){
  const layer = document.querySelector('.snow-layer');
  if (!layer) return;

  layer.innerHTML = '';

  const body = document.body;

  if (body.classList.contains('theme-xmas')){
    const snowflakes = 150;
    for (let i = 0; i < snowflakes; i++){
      const flake = document.createElement('div');
      flake.className = 'snowflake';
      flake.style.left = Math.random() * 100 + '%';
      flake.style.animationDelay = Math.random() * 10 + 's';
      flake.style.animationDuration = (Math.random() * 3 + 5) + 's';
      flake.style.opacity = Math.random();
      flake.style.fontSize = (Math.random() * 0.5 + 0.3) + 'rem';
      layer.appendChild(flake);
    }

  } else if (body.classList.contains('theme-halloween')){
    const sparks = 90;
    for (let i = 0; i < sparks; i++){
      const spark = document.createElement('div');
      spark.className = 'halloween-spark';
      spark.style.left = Math.random() * 100 + '%';
      spark.style.animationDelay = Math.random() * 3 + 's';
      spark.style.animationDuration = (Math.random() * 1.5 + 1.2) + 's';
      spark.style.opacity = 0.3 + Math.random() * 0.5;
      layer.appendChild(spark);
    }

  } else {
    const drops = 80;
    for (let i = 0; i < drops; i++){
      const drop = document.createElement('div');
      drop.className = 'raindrop';
      drop.style.left = Math.random() * 100 + '%';
      drop.style.animationDelay = Math.random() * 5 + 's';
      drop.style.animationDuration = (Math.random() * 0.8 + 0.9) + 's';
      drop.style.opacity = 0.35 + Math.random() * 0.4;
      drop.style.height = (Math.random() * 25 + 25) + 'px';
      layer.appendChild(drop);
    }
  }
}

function initStars(){
  const canvas = document.getElementById('stars-bg');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const stars = [];
  const numStars = 200;
  
  for(let i = 0; i < numStars; i++){
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      speed: Math.random() * 0.5 + 0.1
    });
  }
  
  function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fill();
      
      star.y += star.speed;
      if(star.y > canvas.height){
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function initThemeSwitcher(){
  const themeButtons = document.querySelectorAll('.theme-btn');
  const body = document.body;
  
  body.classList.add('theme-default');
  
  themeButtons.forEach(btn => {
const hat = document.querySelector('.decor-hat');

btn.addEventListener('click', () => {
  const theme = btn.dataset.theme;

  body.classList.remove('theme-default', 'theme-xmas', 'theme-halloween');
  themeButtons.forEach(b => b.classList.remove('active'));

  body.classList.add(`theme-${theme}`);
  btn.classList.add('active');
  initWeather();
  playClickSound();

  if (hat){
    if (theme !== 'xmas'){
      hat.classList.remove(
        'visible',
        'hat-hero',
        'hat-about',
        'hat-plugins',
        'hat-projects',
        'hat-contact',
        'hat-workflow'
      );
    } else {
      const activePanel = document.querySelector('.panel.active');
      hat.classList.remove(
        'hat-hero','hat-about','hat-plugins','hat-projects','hat-contact'
      );
      if (activePanel?.dataset.panel === 'home')        hat.classList.add('visible','hat-hero');
      else if (activePanel?.dataset.panel === 'about')  hat.classList.add('visible','hat-about');
      else if (activePanel?.dataset.panel === 'plugins')hat.classList.add('visible','hat-plugins');
      else if (activePanel?.dataset.panel === 'projects')hat.classList.add('visible','hat-projects');
      else if (activePanel?.dataset.panel === 'contact') hat.classList.add('visible','hat-contact');
      else if (activePanel?.dataset.panel === 'workflow') hat.classList.add('visible','hat-workflow');
    }
  }
});
  });
}

let audioUnlocked = false;

function unlockUiAudio(){
const clickSound = document.getElementById('ui-click');
if (!clickSound) return;

if (clickSound.muted) clickSound.muted = false;
clickSound.volume = 1;
audioUnlocked = true;
}

function playClickSound(){
const clickSound = document.getElementById('ui-click');
if (!clickSound) return;

if (clickSound.muted) clickSound.muted = false;
clickSound.volume = 1;
clickSound.currentTime = 0;

const playPromise = clickSound.play();
if (playPromise && typeof playPromise.catch === 'function') {
playPromise.catch(() => {});
}
}

function initIntroGate(){
  const overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  const loader = document.getElementById('intro-loader');
  const verify = document.getElementById('intro-verify');
  const checkbox = document.getElementById('human-check');
  const btnEnter = document.getElementById('verify-enter');

  let unlocked = false;

  function showVerify(){
    if (!loader || !verify) return;
    loader.style.display = 'none';
    verify.style.display = 'block';
  }

function unlock(){
  if (unlocked) return;
  if (!checkbox.checked) return; 
  unlocked = true;
  overlay.classList.add('hidden');
  playClickSound();

  const audio = document.getElementById('mp-audio');
  const playBtn = document.getElementById('mp-play');
  const pauseBtn = document.getElementById('mp-pause');

  if (audio){
    audio.play().catch(() => {});
  }

  if (playBtn && pauseBtn){
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'flex';
  }
}

  setTimeout(showVerify, 2200);

  btnEnter.addEventListener('click', unlock);
}

(function(){
  const audio = document.getElementById('mp-audio');
  const canvas = document.getElementById('mp-visualizer');
  if (!audio || !canvas) return;
  const ctx2d = canvas.getContext('2d');
  let audioCtx, analyser, source, dataArray, animationId;

  function setupAudioContext(){
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = canvas.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function draw(){
    animationId = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    const w = canvas.width;
    const h = canvas.height;
    const barWidth = 4;
    const gap = 2;
    const step = Math.ceil(dataArray.length / Math.floor(w / (barWidth + gap)));

    ctx2d.clearRect(0, 0, w, h);

    const color = getComputedStyle(document.body).getPropertyValue('--mp-vis-color') || '#2563eb';
    ctx2d.fillStyle = color.trim();

    let x = 0;
    for (let i = 0; i < dataArray.length; i += step){
      const v = dataArray[i] / 255;
      const barHeight = v * h;
      ctx2d.shadowBlur = 12;
      ctx2d.shadowColor = color.trim();
      ctx2d.fillRect(x, h - barHeight, barWidth, barHeight);
      x += barWidth + gap;
    }
  }

  function startVisualizer(){
    setupAudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (!animationId) draw();
  }

  function stopVisualizer(){
    if (animationId){
      cancelAnimationFrame(animationId);
      animationId = null;
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  audio.addEventListener('play', startVisualizer);
  audio.addEventListener('pause', stopVisualizer);
  audio.addEventListener('ended', stopVisualizer);
})();
