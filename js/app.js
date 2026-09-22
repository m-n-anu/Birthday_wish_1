/**
 * Seamless Light-Themed Celebration Engine
 * - Natural button-free continuous scroll
 * - Fine metallic foil confetti & continuous elegant floating balloons
 * - Realistic pneumatic party popper physical acoustics
 * - Grand formal gallery frame swinging in from top-right corner
 */

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // DOM REFERENCES
  // =========================================================================
  const scrollContainer = document.getElementById('scroll-container');
  const sections = document.querySelectorAll('.page-section');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = soundToggleBtn ? soundToggleBtn.querySelector('.sound-icon') : null;
  const confettiCanvas = document.getElementById('confetti-canvas');
  const ambientCanvas = document.getElementById('ambient-canvas');
  const balloonsContainer = document.getElementById('balloons-container');
  const welcomeEditorial = document.querySelector('.welcome-editorial-group');
  const finaleConfettiCanvas = document.getElementById('finale-confetti-canvas');
  const finaleBalloonsContainer = document.getElementById('finale-balloons-container');
  const finaleExitBtn = document.getElementById('finale-exit-btn');
  const countdownValue = document.getElementById('countdown-value');
  const countdownLabel = document.getElementById('countdown-label');
  const openingScrollCue = document.getElementById('opening-scroll-cue');
  const audioLaunchOverlay = document.getElementById('audio-launch-overlay');
  const audioLaunchButton = document.getElementById('audio-launch-button');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const celebrationMusic = new Audio('assets/Unwrapping_the_Sunday_Cake.bgm.mp3');
  celebrationMusic.loop = true;
  celebrationMusic.volume = 1;

  function startCelebrationMusic() {
    celebrationMusic.volume = 1;
    celebrationMusic.play().catch(() => {
      // Browser autoplay restrictions are retried by the next user interaction.
    });
  }

  function stopCelebrationMusic() {
    celebrationMusic.pause();
    celebrationMusic.currentTime = 0;
  }

  // Keep the opening moment undisturbed for ten seconds before enabling the story scroll.
  if (scrollContainer && countdownValue) {
    let storyUnlocked = false;
    let remaining = 10;
    const scrollKeys = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']);
    const blockScroll = (event) => {
      if (!storyUnlocked) event.preventDefault();
    };
    const blockScrollKeys = (event) => {
      if (!storyUnlocked && scrollKeys.has(event.key)) event.preventDefault();
    };

    scrollContainer.classList.add('scroll-locked');
    scrollContainer.addEventListener('wheel', blockScroll, { passive: false });
    scrollContainer.addEventListener('touchmove', blockScroll, { passive: false });
    document.addEventListener('keydown', blockScrollKeys, true);

    const countdownTimer = window.setInterval(() => {
      remaining -= 1;
      countdownValue.textContent = String(Math.max(0, remaining));
      if (remaining <= 0) {
        window.clearInterval(countdownTimer);
        if (countdownLabel) countdownLabel.textContent = 'The journey is ready';
        countdownValue.hidden = true;
        if (openingScrollCue) openingScrollCue.hidden = false;
        storyUnlocked = true;
        scrollContainer.classList.remove('scroll-locked');
        startCelebrationMusic();
        scrollContainer.removeEventListener('wheel', blockScroll);
        scrollContainer.removeEventListener('touchmove', blockScroll);
        document.removeEventListener('keydown', blockScrollKeys, true);
      }
    }, 1000);
  }

  if (finaleExitBtn) {
    finaleExitBtn.addEventListener('click', () => {
      stopCelebrationMusic();
      window.close();
      window.setTimeout(() => {
        if (!window.closed) {
          finaleExitBtn.textContent = 'You can close this tab now';
          finaleExitBtn.disabled = true;
        }
      }, 150);
    });
  }

  // =========================================================================
  // CHANGE THESE IMAGE FILES  (replace files in /assets — no layout edits needed)
  // CHANGE THE MESSAGES AND NAME BELOW
  // =========================================================================
  const birthdayPersonName = ''; // e.g. "Anu"

  const newBirthdayImages = {
    slide1: {
      photo1: 'assets/Pasted Image1.1.jpg',
      photo2: 'assets/Pasted Image 2.1.2.jpg',
      background: 'assets/Pasted Image1.background.jpg',
      message: 'Some moments become memories before we even realize it.'
    },
    slide2: {
      photo1: 'assets/Pasted Image 2.2.2.jpg',
      photo2: 'assets/Pasted Image2.1.jpg',
      background: 'assets/pasted image2.background.jpg',
      message: 'A collection of little moments that made the journey brighter.'
    },
    slide3: {
      photo1: 'assets/Pasted Image3.3.jpg',
      photo2: 'assets/Pasted Image3.1.jpg',
      background: 'assets/Pasted Image 2.3.2.jpg',
      message: 'The best memories are the ones that stay quietly with us.'
    },
    slide4: {
      photo1: 'assets/Pasted Image4.1.jpg',
      photo2: 'assets/Pasted Image 2.4.2.jpg',
      background: 'assets/Pasted Image.4.background.jpg',
      message: 'The best memories are the ones that stay quietly with us.'
    },
    final: {
      photo: 'assets/Pasted Image5.1.jpg'
    }
  };

  const PLACEHOLDER_PHOTO = 'assets/default-photo.svg';

  function resolveMemoryPath(key) {
    const [slide, field] = key.split('.');
    return (newBirthdayImages[slide] && newBirthdayImages[slide][field]) || PLACEHOLDER_PHOTO;
  }

  document.querySelectorAll('[data-memory-key]').forEach((img) => {
    const src = resolveMemoryPath(img.dataset.memoryKey);
    img.src = src;
    img.addEventListener('error', () => {
      if (img.classList.contains('memory-bg-img')) {
        img.style.display = 'none';
        return;
      }
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = '1';
      img.src = PLACEHOLDER_PHOTO;
    });
  });

  document.querySelectorAll('[data-memory-msg]').forEach((el) => {
    const slide = el.dataset.memoryMsg;
    if (newBirthdayImages[slide] && newBirthdayImages[slide].message) {
      el.textContent = newBirthdayImages[slide].message;
    }
  });

  const finaleNameEl = document.getElementById('finale-name');
  if (finaleNameEl) {
    finaleNameEl.textContent = birthdayPersonName;
    finaleNameEl.hidden = !birthdayPersonName;
  }

  // =========================================================================
  // 1. UNLOCK AUDIO ON NATURAL INTERACTION (SCROLL, TOUCH, KEY)
  // =========================================================================
  let audioUnlocked = false;
  let openingPopPlayed = false;

  function unlockAudio() {
    if (audioUnlocked) return Promise.resolve(window.birthdayAudio && window.birthdayAudio.ctx);
    if (window.birthdayAudio) {
      return window.birthdayAudio.init().then((ctx) => {
      // Pre-warm: play a zero-gain silent buffer so the audio graph is ready
      // This eliminates the ~200–400 ms cold-start latency on first real sound
      if (ctx && ctx.state === 'running') {
        const silentBuf = ctx.createBuffer(1, 1, ctx.sampleRate);
        const silentSrc = ctx.createBufferSource();
        silentSrc.buffer = silentBuf;
        silentSrc.connect(ctx.destination);
        silentSrc.start(0);
      }
      audioUnlocked = Boolean(ctx && ctx.state === 'running');
      return ctx;
      });
    }
    return Promise.resolve(null);
  }

  window.addEventListener('scroll', unlockAudio, { passive: true, once: true });
  scrollContainer.addEventListener('scroll', unlockAudio, { passive: true, once: true });
  document.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
  document.addEventListener('click', unlockAudio, { once: true });
  document.addEventListener('wheel', unlockAudio, { passive: true, once: true });
  document.addEventListener('keydown', unlockAudio, { once: true });
  window.addEventListener('load', () => {
    unlockAudio().then((ctx) => {
      if (ctx && window.birthdayAudio && !openingPopPlayed) {
        openingPopPlayed = true;
        window.birthdayAudio.playPopperSound();
      }
    });
  }, { once: true });
  document.addEventListener('pointerdown', () => {
    unlockAudio();
  }, { passive: true, once: true });

  if (audioLaunchButton) {
    audioLaunchButton.addEventListener('click', () => {
      unlockAudio().then((ctx) => {
        if (ctx && window.birthdayAudio && !openingPopPlayed) {
          openingPopPlayed = true;
          window.birthdayAudio.playPopperSound();
        }
        if (audioLaunchOverlay) audioLaunchOverlay.classList.add('is-dismissed');
      });
    }, { once: true });
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      unlockAudio();
      if (!window.birthdayAudio) return;
      const isMuted = window.birthdayAudio.toggleMute();
      if (isMuted) {
        celebrationMusic.muted = true;
        soundToggleBtn.classList.add('muted');
        if (soundIcon) soundIcon.textContent = '🔇';
        soundToggleBtn.title = 'Sound: Muted';
      } else {
        celebrationMusic.muted = false;
        celebrationMusic.volume = 1;
        soundToggleBtn.classList.remove('muted');
        if (soundIcon) soundIcon.textContent = '🔊';
        soundToggleBtn.title = 'Sound: On';
      }
    });
  }

  // =========================================================================
  // 2. RESIZE CANVASES
  // =========================================================================
  const ambientCtx = ambientCanvas.getContext('2d');

  function resizeCanvases() {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
    if (confettiCanvas) {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
    if (finaleConfettiCanvas) {
      finaleConfettiCanvas.width = window.innerWidth;
      finaleConfettiCanvas.height = window.innerHeight;
    }
  }
  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();

  // =========================================================================
  // 3. AMBIENT SUNLIGHT GLIMMER & DUST PARTICLES
  // =========================================================================
  class SunbeamDustSystem {
    constructor(ctx, width, height) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.particles = [];
      this.init();
    }

    init() {
      this.particles = [];
      const count = Math.min(38, Math.floor(this.width / 35));
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * 2 + 0.8,
          baseAlpha: Math.random() * 0.4 + 0.15,
          alpha: 0.25,
          speedY: -(Math.random() * 0.25 + 0.1),
          speedX: (Math.random() - 0.5) * 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.008
        });
      }
    }

    updateAndDraw() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      for (let p of this.particles) {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha = p.baseAlpha + Math.sin(Date.now() * p.twinkleSpeed) * 0.15;

        if (p.y < -10) {
          p.y = this.height + 10;
          p.x = Math.random() * this.width;
        }
        if (p.x < 0) p.x = this.width;
        if (p.x > this.width) p.x = 0;

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(212, 175, 55, ${Math.max(0.04, p.alpha)})`;
        this.ctx.fill();
      }
    }
  }

  const ambientSystem = new SunbeamDustSystem(ambientCtx, window.innerWidth, window.innerHeight);
  function renderAmbient() {
    if (prefersReducedMotion) {
      ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
      return;
    }
    ambientSystem.width = ambientCanvas.width;
    ambientSystem.height = ambientCanvas.height;
    ambientSystem.updateAndDraw();
    requestAnimationFrame(renderAmbient);
  }
  renderAmbient();

  // =========================================================================
  // 4. METALLIC FOIL CONFETTI ENGINE (CHAMPAGNE, GOLD & ROSE GOLD)
  // =========================================================================
  class MetallicConfettiEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas ? canvas.getContext('2d') : null;
      this.particles = [];
      this.isRunning = false;
      // High-end luxury metallic palette
      this.colors = [
        '#d4af37', '#e5be75', '#c59b48', '#f2e3c6',
        '#e0a899', '#fbf9f5', '#b8860b', '#dfc28d'
      ];
    }

    fireCelebrationBurst(count = 65) {
      if (!this.canvas || !this.ctx) return;
      const w = this.canvas.width;
      const h = this.canvas.height;

      this.spawnFlakes(w * 0.15, h * 0.85, -60, count);
      this.spawnFlakes(w * 0.85, h * 0.85, -120, count);

      if (!this.isRunning) {
        this.isRunning = true;
        this.loop();
      }
    }

    spawnFlakes(originX, originY, angleDeg, count) {
      const baseRad = (angleDeg * Math.PI) / 180;
      for (let i = 0; i < count; i++) {
        const spread = (Math.random() - 0.5) * 0.65;
        const angle = baseRad + spread;
        const velocity = Math.random() * 18 + 12;

        this.particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          sizeX: Math.random() * 9 + 5,
          sizeY: Math.random() * 6 + 3,
          gravity: 0.32,
          drag: 0.965,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          wobble: Math.random() * 10,
          wobbleSpeed: Math.random() * 0.09 + 0.04,
          opacity: 1,
          decay: Math.random() * 0.005 + 0.003
        });
      }
    }

    loop() {
      if (!this.ctx || !this.canvas) return;
      if (this.particles.length === 0) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.isRunning = false;
        return;
      }

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;
        p.opacity -= p.decay;

        if (p.opacity <= 0 || p.y > this.canvas.height + 40) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillStyle = p.color;

        // Elegant metallic foil 3D rotation
        const scaleY = Math.cos(p.wobble);
        this.ctx.fillRect(-p.sizeX / 2, (-p.sizeY / 2) * scaleY, p.sizeX, p.sizeY * Math.abs(scaleY));
        this.ctx.restore();
      }

      requestAnimationFrame(() => this.loop());
    }
  }

  const confettiEngine = new MetallicConfettiEngine(confettiCanvas);
  const finaleConfettiEngine = new MetallicConfettiEngine(finaleConfettiCanvas);

  // =========================================================================
  // 5. CONTINUOUS FLOATING BALLOONS SYSTEM
  // =========================================================================
  const balloonStyles = [
    { bg: 'radial-gradient(circle at 35% 30%, #fffcf5, #f1e2ca 65%, #cbb18a 100%)', knot: '#cbb18a' }, // Pearl Champagne
    { bg: 'radial-gradient(circle at 35% 30%, #fdf8ee, #e8d0a0 65%, #b69255 100%)', knot: '#b69255' }, // Soft Gold
    { bg: 'radial-gradient(circle at 35% 30%, #faf3f0, #e6c8be 65%, #ba8a7c 100%)', knot: '#ba8a7c' }, // Rose Quartz
    { bg: 'radial-gradient(circle at 35% 30%, #f2f7f4, #cde0d5 65%, #8fa89b 100%)', knot: '#8fa89b' }, // Muted Eucalyptus
    { bg: 'radial-gradient(circle at 35% 30%, #ffffff, #eae6dd 65%, #beb8ab 100%)', knot: '#beb8ab' }  // Translucent Silk
  ];

  let balloonInterval = null;
  let balloonsEnabled = false;
  let balloonHost = balloonsContainer;
  let finaleBurstInterval = null;

  function createSingleBalloon() {
    if (!balloonHost || !balloonsEnabled) return;

    const balloon = document.createElement('div');
    balloon.className = 'balloon';

    const styleData = balloonStyles[Math.floor(Math.random() * balloonStyles.length)];
    balloon.style.background = styleData.bg;
    balloon.style.borderColor = styleData.knot;

    const scale = Math.random() * 0.35 + 0.85;
    const keepSides = balloonHost.classList.contains('finale-balloons');
    const leftPercent = keepSides
      ? (Math.random() < 0.5 ? Math.random() * 16 + 2 : Math.random() * 16 + 82)
      : Math.random() * 84 + 8;
    const duration = Math.random() * 3.5 + 7.5;
    const swayAmp = (Math.random() - 0.5) * 60;

    balloon.style.left = `${leftPercent}%`;
    balloon.style.transform = `scale(${scale})`;

    balloon.animate([
      {
        transform: `scale(${scale}) translateY(0) translateX(0)`,
        opacity: 0
      },
      {
        opacity: 0.95,
        offset: 0.12
      },
      {
        transform: `scale(${scale}) translateY(-65vh) translateX(${swayAmp}px)`,
        opacity: 0.95,
        offset: 0.65
      },
      {
        transform: `scale(${scale}) translateY(-135vh) translateX(${-swayAmp * 0.7}px)`,
        opacity: 0
      }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fill: 'forwards'
    });

    balloonHost.appendChild(balloon);

    setTimeout(() => {
      balloon.remove();
    }, duration * 1000 + 200);
  }

  function startContinuousBalloons(container) {
    if (prefersReducedMotion) return;
    balloonHost = container || balloonsContainer;
    balloonsEnabled = true;
    if (balloonInterval) return;

    const isFinale = balloonHost.classList.contains('finale-balloons');
    const initialCount = isFinale ? 30 : 9;
    const spawnDelay = isFinale ? 90 : 260;
    const repeatDelay = isFinale ? 280 : 950;

    for (let i = 0; i < initialCount; i++) {
      setTimeout(() => {
        if (balloonsEnabled) createSingleBalloon();
      }, i * spawnDelay);
    }

    balloonInterval = setInterval(() => {
      if (balloonsEnabled) {
        createSingleBalloon();
      }
    }, repeatDelay);
  }

  function stopContinuousBalloons() {
    balloonsEnabled = false;
    if (balloonInterval) {
      clearInterval(balloonInterval);
      balloonInterval = null;
    }
    document.querySelectorAll('.balloons-container .balloon').forEach((balloon) => balloon.remove());
  }

  function startFinaleCelebration() {
    if (prefersReducedMotion) return;
    unlockAudio();
    startContinuousBalloons(finaleBalloonsContainer);
    finaleConfettiEngine.fireCelebrationBurst(32);
    if (window.birthdayAudio) {
      window.birthdayAudio.playPopperSound();
    }
    if (finaleBurstInterval) return;
    finaleBurstInterval = setInterval(() => {
      finaleConfettiEngine.fireCelebrationBurst(22);
    }, 3200);
  }

  function stopFinaleCelebration() {
    if (finaleBurstInterval) {
      clearInterval(finaleBurstInterval);
      finaleBurstInterval = null;
    }
  }

  // =========================================================================
  // 6. INTERSECTION OBSERVER & SECTION ENTRY TRIGGERS
  // =========================================================================
  const sectionTriggers = {
    1: false,
    2: false,
    3: false
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const section = entry.target;
      const pageNum = parseInt(section.dataset.page);

      if (entry.isIntersecting) {
        section.classList.add('in-view');

        if (pageNum === 2) {
          unlockAudio();
          startContinuousBalloons(balloonsContainer);
          if (window.birthdayAudio) {
            window.birthdayAudio.playPopperSound();
          }
          if (!prefersReducedMotion) {
            confettiEngine.fireCelebrationBurst();
          }
        } else if (pageNum === 9) {
          startFinaleCelebration();
        } else {
          stopContinuousBalloons();
          stopFinaleCelebration();
        }

        if (pageNum === 3) {
          // Page 3: Reset and replay the swinging frame animation every time visited!
          const frameAssembly = document.getElementById('swinging-frame-assembly');
          if (frameAssembly) {
            frameAssembly.classList.remove('animate-swing');
            void frameAssembly.offsetWidth; // Trigger DOM reflow
            frameAssembly.classList.add('animate-swing');
          }
          if (window.birthdayAudio) {
            window.birthdayAudio.playSwingingFrameSound();
          }
        }
      } else {
        // Leaving section: remove in-view to reset state
        section.classList.remove('in-view');

        if (pageNum === 2) {
          stopContinuousBalloons();
        } else if (pageNum === 9) {
          stopContinuousBalloons();
          stopFinaleCelebration();
        } else if (pageNum === 3) {
          const frameAssembly = document.getElementById('swinging-frame-assembly');
          if (frameAssembly) {
            frameAssembly.classList.remove('animate-swing');
          }
        }
      }
    });
  }, {
    root: scrollContainer,
    threshold: 0.5
  });

  sections.forEach(sec => observer.observe(sec));

  // =========================================================================
  // 7. SEAMLESS SCROLL MATCH-AND-MOVE CONTINUITY
  // =========================================================================
  const storyMorphLayers = document.querySelectorAll('.memory-morph-layer, .finale-morph-layer');

  function updateStoryMorph() {
    if (prefersReducedMotion || !scrollContainer) return;
    const st = scrollContainer.scrollTop;
    const vh = scrollContainer.clientHeight || window.innerHeight;

    storyMorphLayers.forEach((layer) => {
      const section = layer.closest('.page-section');
      if (!section) return;
      const rel = (st - section.offsetTop) / vh;
      let opacity = 1;
      let scale = 1;
      let ty = 0;
      let blur = 0;

      if (rel > 0) {
        const p = Math.min(1, rel);
        opacity = 1 - p * 0.45;
        scale = 1 - p * 0.05;
        ty = -p * 36;
        blur = p * 3.5;
      } else if (rel < 0 && rel > -1.05) {
        const p = Math.min(1, -rel);
        opacity = 1 - p * 0.18;
        scale = 0.97 + (1 - p) * 0.03;
        ty = p * 28;
      }

      layer.style.opacity = String(Math.max(0.4, opacity));
      layer.style.transform = `translateY(${ty}px) scale(${scale})`;
      layer.style.filter = blur ? `blur(${blur}px)` : 'none';
    });
  }

  let storyMorphFrame = null;
  scrollContainer.addEventListener('scroll', () => {
    const scrollY = scrollContainer.scrollTop;
    const windowH = window.innerHeight;

    if (welcomeEditorial && scrollY <= windowH) {
      const progress = Math.min(1, Math.max(0, scrollY / windowH));
      welcomeEditorial.style.transform = `translateY(${progress * 50}px)`;
      welcomeEditorial.style.opacity = `${1 - progress * 1.3}`;
    }
    if (!storyMorphFrame) {
      storyMorphFrame = requestAnimationFrame(() => {
        updateStoryMorph();
        storyMorphFrame = null;
      });
    }
  }, { passive: true });
  updateStoryMorph();

  // =========================================================================
  // 8. SECTION 4: CLOTHESLINE TWINE & 6 ROYAL POLAROIDS ENGINE
  // =========================================================================
  const polaroidCarousel = document.getElementById('polaroid-carousel');
  const polaroidItems = document.querySelectorAll('.polaroid-item');
  const carouselPrevBtn = document.getElementById('carousel-prev');
  const carouselNextBtn = document.getElementById('carousel-next');

  const msgBox = document.getElementById('polaroid-message-box');
  const msgChapter = document.getElementById('polaroid-msg-chapter');
  const msgTitle = document.getElementById('polaroid-msg-title');
  const msgBody = document.getElementById('polaroid-msg-body');

  const polaroidMessages = {
    1: {
      chapter: "CHAPTER 01",
      title: "Golden Beginnings",
      body: '"Where laughter and unforgettable memories first took root, sparking a bond that grows richer with every passing season."'
    },
    2: {
      chapter: "CHAPTER 02",
      title: "Memorable Internals",
      body: '"Quiet afternoon sunshine, peaceful horizons, and reflecting on efforts of calculations and fierce tension among them"'
    },
    3: {
      chapter: "CHAPTER 03",
      title: "Unchangeable Embarrasments",
      body: '"Becoming the cause of genuine smiles in the face of many people by appearing in DP\'s"'
    },
    4: {
      chapter: "CHAPTER 04",
      title: "Unknown Peeking Results",
      body: '"The curiosity of knowing something may lead to the disturbance of privacy of others in secret places :)"'
    },
    5: {
      chapter: "CHAPTER 05",
      title: "Pure Laughter",
      body: '"The inside jokes, roaring laughs, and crazy memories that turn ordinary days into pure magic."'
    },
    6: {
      chapter: "CHAPTER 06",
      title: "Timeless Legacy",
      body: '"some moments and habits turn out to be a legacy and signatures by notorious photographers"'
    },
    7: {
      chapter: "CHAPTER 07",
      title: "Overenthusiastic Photographers",
      body: '"never forget to capture the famous and rich people in their rich moments. some termed as papz"'
    },
    8: {
      chapter: "CHAPTER 08",
      title: "Mindblowing BTS",
      body: '"efforts and fun involved among the planning of certain set of events"'
    },
    9: {
      chapter: "CHAPTER 09",
      title: "Endless Adventures",
      body: '"To every spontaneous road trip, every hidden path discovered, and stories yet unwritten in all poisonous environments"'
    },
    10: {
      chapter: "CHAPTER 10",
      title: "Forever Celebrated",
      body: '"May this milestone mark the dawn of your most magnificent, joyful, and triumphant chapter."'
    }
  };

  let currentCenterIndex = 1;

  // Initialize individual tilts on non-center polaroids
  polaroidItems.forEach(item => {
    const tilt = item.dataset.tilt || '0';
    item.style.setProperty('--tilt', `${tilt}deg`);
  });

  function updateActivePolaroidMessage(index) {
    if (index === currentCenterIndex) return;
    currentCenterIndex = index;

    // Play subtle peg sway sound
    if (window.birthdayAudio) {
      window.birthdayAudio.playPegSwaySound();
    }

    // Fade transition message
    if (msgBox) {
      msgBox.style.opacity = '0';
      msgBox.style.transform = 'translateY(10px)';

      setTimeout(() => {
        const data = polaroidMessages[index] || polaroidMessages[1];
        if (msgChapter) msgChapter.textContent = data.chapter;
        if (msgTitle) msgTitle.textContent = data.title;
        if (msgBody) msgBody.textContent = data.body;

        msgBox.style.opacity = '1';
        msgBox.style.transform = 'translateY(0)';
      }, 220);
    }
  }

  function detectCenterPolaroid() {
    if (!polaroidCarousel) return;

    const containerCenter = polaroidCarousel.scrollLeft + polaroidCarousel.clientWidth / 2;
    let closestItem = null;
    let closestDistance = Infinity;

    polaroidItems.forEach(item => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(containerCenter - itemCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = item;
      }
    });

    if (closestItem) {
      const newIndex = parseInt(closestItem.dataset.index);

      polaroidItems.forEach(item => {
        const isCurrent = (item === closestItem);
        item.classList.toggle('is-center', isCurrent);
      });

      updateActivePolaroidMessage(newIndex);
    }
  }

  let scrollThrottle = null;
  if (polaroidCarousel) {
    polaroidCarousel.addEventListener('scroll', () => {
      if (!scrollThrottle) {
        scrollThrottle = requestAnimationFrame(() => {
          detectCenterPolaroid();
          scrollThrottle = null;
        });
      }
    }, { passive: true });

    // Center polaroid 1 in the carousel only — do not use scrollIntoView
    // (that also scrolls the main page down to the polaroid section)
    const initialItem = document.querySelector('.polaroid-item[data-index="1"]');
    if (initialItem) {
      const itemCenter = initialItem.offsetLeft + initialItem.offsetWidth / 2;
      polaroidCarousel.scrollLeft = Math.max(0, itemCenter - polaroidCarousel.clientWidth / 2);
      detectCenterPolaroid();
    }
  }

  if (scrollContainer) {
    scrollContainer.scrollTop = 0;
  }

  // Chevron Controls
  if (carouselPrevBtn) {
    carouselPrevBtn.addEventListener('click', () => {
      const targetIndex = Math.max(1, currentCenterIndex - 1);
      const targetItem = document.querySelector(`.polaroid-item[data-index="${targetIndex}"]`);
      if (targetItem) {
        targetItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  }

  if (carouselNextBtn) {
    carouselNextBtn.addEventListener('click', () => {
      const targetIndex = Math.min(polaroidItems.length, currentCenterIndex + 1);
      const targetItem = document.querySelector(`.polaroid-item[data-index="${targetIndex}"]`);
      if (targetItem) {
        targetItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  }

  // Direct Click on Polaroid Centers It
  polaroidItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // If clicking directly on upload overlay, let upload handle it
      if (e.target.closest('.polaroid-upload-overlay')) return;
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });

  // Custom Image Upload on each Polaroid
  const photoFrames = document.querySelectorAll('.polaroid-photo-frame');
  photoFrames.forEach(frame => {
    const fileInput = frame.querySelector('.polaroid-file-input');
    const img = frame.querySelector('.polaroid-img');

    frame.addEventListener('click', (e) => {
      // If clicked the upload overlay
      if (e.target.closest('.polaroid-upload-overlay')) {
        e.stopPropagation();
        if (fileInput) fileInput.click();
      }
    });

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && img) {
          const reader = new FileReader();
          reader.onload = (event) => {
            img.src = event.target.result;
            if (window.birthdayAudio) {
              window.birthdayAudio.playPegSwaySound();
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });

  document.querySelectorAll('.memory-frame-inner, .royal-inner-mat').forEach((frame) => {
    const fileInput = frame.querySelector('.memory-file-input');
    const img = frame.querySelector('.memory-photo, .royal-photo');
    frame.addEventListener('click', (e) => {
      if (e.target.closest('.memory-upload-overlay') && fileInput) {
        e.stopPropagation();
        fileInput.click();
      }
    });
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && img) {
          const reader = new FileReader();
          reader.onload = (event) => {
            img.src = event.target.result;
            img.style.display = '';
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });

  window.addEventListener('load', () => {
    if (scrollContainer) scrollContainer.scrollTop = 0;
  });

});
