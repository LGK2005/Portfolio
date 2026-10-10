/* ===================================================================
   LAM GIA KIET - PROJECT HORIZON: ROVER ENGINE LAB
   Interactive Canvas 2D Game Simulation & Gameplay Engine
   Demonstrates: Physics, Particle Systems, Game-Feel, Profiling HUD
   =================================================================== */

(function () {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // DOM HUD References
  const fpsDisplay = document.getElementById('hudFps');
  const entityDisplay = document.getElementById('hudEntities');
  const speedDisplay = document.getElementById('hudSpeed');
  const shieldBar = document.getElementById('hudShieldFill');
  const relicsDisplay = document.getElementById('hudRelics');
  const shakeSlider = document.getElementById('shakeIntensity');
  const particleSlider = document.getElementById('particleMult');
  const resetBtn = document.getElementById('resetGameBtn');

  // Game Settings & Tuning
  let shakeMultiplier = 1.0;
  let particleMultiplier = 1.0;
  let screenShake = 0;

  if (shakeSlider) {
    shakeSlider.addEventListener('input', (e) => {
      shakeMultiplier = parseFloat(e.target.value) / 50;
    });
  }
  if (particleSlider) {
    particleSlider.addEventListener('input', (e) => {
      particleMultiplier = parseFloat(e.target.value) / 50;
    });
  }

  // Handle Resize & Canvas Resizing
  let width = 0;
  let height = 0;
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Input State
  const keys = {
    w: false, a: false, s: false, d: false,
    ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false,
    space: false
  };

  const mouse = {
    x: width / 2,
    y: height / 2,
    down: false
  };

  window.addEventListener('keydown', (e) => {
    if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight', ' '].includes(e.key)) {
      if (document.activeElement === canvas || canvas.getBoundingClientRect().top < window.innerHeight && canvas.getBoundingClientRect().bottom > 0) {
        if (e.key === ' ') e.preventDefault();
      }
    }
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = true;
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
    if (e.key === ' ') keys.space = true;
  });

  window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = false;
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
    if (e.key === ' ') keys.space = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
      mouse.down = true;
      fireBullet();
    }
  });

  canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0) mouse.down = false;
  });

  // Touch Support for Mobile
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.down = true;
    }
  }, { passive: false });

  canvas.addEventListener('touchend', () => {
    mouse.down = false;
  });

  // Game Entities
  const rover = {
    x: width / 2,
    y: height / 2,
    vx: 0,
    vy: 0,
    angle: 0,
    targetAngle: 0,
    speed: 0,
    maxSpeed: 6.2,
    acceleration: 0.28,
    friction: 0.93,
    turnSpeed: 0.08,
    size: 26,
    shield: 100,
    relics: 0,
    fireCooldown: 0,
    turretAngle: 0
  };

  let bullets = [];
  let particles = [];
  let enemies = [];
  let relics = [];

  function spawnEnemies() {
    while (enemies.length < 5) {
      const edge = Math.floor(Math.random() * 4);
      let x, y;
      if (edge === 0) { x = Math.random() * width; y = -30; }
      else if (edge === 1) { x = width + 30; y = Math.random() * height; }
      else if (edge === 2) { x = Math.random() * width; y = height + 30; }
      else { x = -30; y = Math.random() * height; }

      enemies.push({
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        hp: 3,
        size: 16,
        color: '#ff3366',
        speed: 1.2 + Math.random() * 0.8
      });
    }
  }

  function spawnRelics() {
    while (relics.length < 7) {
      relics.push({
        x: 40 + Math.random() * (width - 80),
        y: 40 + Math.random() * (height - 80),
        size: 10,
        pulse: Math.random() * Math.PI,
        value: 100
      });
    }
  }

  function resetGame() {
    rover.x = width / 2;
    rover.y = height / 2;
    rover.vx = 0;
    rover.vy = 0;
    rover.shield = 100;
    rover.relics = 0;
    bullets = [];
    particles = [];
    enemies = [];
    relics = [];
    spawnEnemies();
    spawnRelics();
    if (window.soundEngine) window.soundEngine.playClick();
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetGame);
  }

  // Shooting Logic
  function fireBullet() {
    if (rover.fireCooldown > 0) return;
    rover.fireCooldown = 11; // 11 frames cooldown

    // Left and Right barrels
    const barrelOffset = 10;
    const muzzleDist = 18;
    const angle = rover.turretAngle;

    [-1, 1].forEach((dir) => {
      const bx = rover.x + Math.cos(angle) * muzzleDist + Math.cos(angle + Math.PI/2) * (dir * barrelOffset);
      const by = rover.y + Math.sin(angle) * muzzleDist + Math.sin(angle + Math.PI/2) * (dir * barrelOffset);

      bullets.push({
        x: bx,
        y: by,
        vx: Math.cos(angle) * 11 + rover.vx * 0.3,
        vy: Math.sin(angle) * 11 + rover.vy * 0.3,
        life: 55
      });

      // Muzzle spark
      spawnSparks(bx, by, angle, 4, '#00f0ff');
    });

    // Screen Shake & Sound
    screenShake = Math.max(screenShake, 3 * shakeMultiplier);
    if (window.soundEngine) window.soundEngine.playLaser();
  }

  function spawnSparks(x, y, baseAngle, count, color) {
    const finalCount = Math.round(count * particleMultiplier);
    for (let i = 0; i < finalCount; i++) {
      const spread = (Math.random() - 0.5) * 1.2;
      const speed = 1.5 + Math.random() * 3.5;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(baseAngle + spread) * speed,
        vy: Math.sin(baseAngle + spread) * speed,
        life: 18 + Math.random() * 15,
        maxLife: 30,
        color: color || '#00f0ff',
        size: 2.2
      });
    }
  }

  function spawnExplosion(x, y, color) {
    const count = Math.round(24 * particleMultiplier);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 5.5;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 25 + Math.random() * 20,
        maxLife: 45,
        color: color || '#ff9900',
        size: 3 + Math.random() * 2.5
      });
    }
    screenShake = Math.max(screenShake, 8 * shakeMultiplier);
    if (window.soundEngine) window.soundEngine.playExplosion();
  }

  // FPS Profiler
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 60;
  let fpsTimer = 0;

  // Main Simulation Loop
  function gameLoop(now) {
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    // Frame Counting
    frameCount++;
    fpsTimer += dt;
    if (fpsTimer >= 0.5) {
      fps = Math.round(frameCount / fpsTimer);
      frameCount = 0;
      fpsTimer = 0;
      if (fpsDisplay) fpsDisplay.textContent = fps;
      if (entityDisplay) entityDisplay.textContent = 1 + enemies.length + relics.length + bullets.length + particles.length;
      if (speedDisplay) speedDisplay.textContent = Math.round(rover.speed * 12);
      if (relicsDisplay) relicsDisplay.textContent = rover.relics;
      if (shieldBar) shieldBar.style.width = rover.shield + '%';
    }

    // Update Input & Physics
    update(dt);

    // Render Canvas
    render();

    requestAnimationFrame(gameLoop);
  }

  function update(dt) {
    if (rover.fireCooldown > 0) rover.fireCooldown--;

    if (mouse.down) {
      fireBullet();
    }

    // Rover Movement Logic
    const forward = keys.w || keys.ArrowUp;
    const backward = keys.s || keys.ArrowDown;
    const turnLeft = keys.a || keys.ArrowLeft;
    const turnRight = keys.d || keys.ArrowRight;

    if (turnLeft) rover.angle -= rover.turnSpeed;
    if (turnRight) rover.angle += rover.turnSpeed;

    if (forward) {
      rover.vx += Math.cos(rover.angle) * rover.acceleration;
      rover.vy += Math.sin(rover.angle) * rover.acceleration;

      // Exhaust thruster particles
      if (Math.random() < 0.65 * particleMultiplier) {
        const exX = rover.x - Math.cos(rover.angle) * 18;
        const exY = rover.y - Math.sin(rover.angle) * 18;
        spawnSparks(exX, exY, rover.angle + Math.PI, 1, '#00e5ff');
      }
    } else if (backward) {
      rover.vx -= Math.cos(rover.angle) * (rover.acceleration * 0.5);
      rover.vy -= Math.sin(rover.angle) * (rover.acceleration * 0.5);
    }

    // Apply Friction
    rover.vx *= rover.friction;
    rover.vy *= rover.friction;
    rover.speed = Math.hypot(rover.vx, rover.vy);

    // Apply Position
    rover.x += rover.vx;
    rover.y += rover.vy;

    // Boundary Wrap
    if (rover.x < 0) rover.x = width;
    if (rover.x > width) rover.x = 0;
    if (rover.y < 0) rover.y = height;
    if (rover.y > height) rover.y = 0;

    // Turret follows mouse cursor
    rover.turretAngle = Math.atan2(mouse.y - rover.y, mouse.x - rover.x);

    // Update Bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.x += b.vx;
      b.y += b.vy;
      b.life--;

      // Check collision with enemies
      for (let j = enemies.length - 1; j >= 0; j--) {
        const e = enemies[j];
        const dist = Math.hypot(b.x - e.x, b.y - e.y);
        if (dist < e.size + 4) {
          e.hp--;
          spawnSparks(b.x, b.y, Math.atan2(b.vy, b.vx) + Math.PI, 6, '#ff3366');
          b.life = 0;
          if (e.hp <= 0) {
            spawnExplosion(e.x, e.y, '#ff3366');
            enemies.splice(j, 1);
            rover.relics += 50;
          }
          break;
        }
      }

      if (b.life <= 0 || b.x < 0 || b.x > width || b.y < 0 || b.y > height) {
        bullets.splice(i, 1);
      }
    }

    // Update Enemies (seek player)
    spawnEnemies();
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      const angle = Math.atan2(rover.y - e.y, rover.x - e.x);
      e.vx = Math.cos(angle) * e.speed;
      e.vy = Math.sin(angle) * e.speed;
      e.x += e.vx;
      e.y += e.vy;

      // Check collision with rover
      const dist = Math.hypot(rover.x - e.x, rover.y - e.y);
      if (dist < rover.size / 2 + e.size) {
        rover.shield = Math.max(0, rover.shield - 12);
        screenShake = Math.max(screenShake, 10 * shakeMultiplier);
        spawnExplosion(e.x, e.y, '#ff3366');
        enemies.splice(i, 1);
        if (window.soundEngine) window.soundEngine.playExplosion();
      }
    }

    // Update Relics (Collect)
    spawnRelics();
    for (let i = relics.length - 1; i >= 0; i--) {
      const r = relics[i];
      r.pulse += 0.06;
      const dist = Math.hypot(rover.x - r.x, rover.y - r.y);
      if (dist < rover.size / 2 + r.size + 10) {
        rover.relics += r.value;
        rover.shield = Math.min(100, rover.shield + 10);
        spawnSparks(r.x, r.y, 0, 15, '#00ffcc');
        if (window.soundEngine) window.soundEngine.playRelicCollect();
        relics.splice(i, 1);
      }
    }

    // Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      p.vx *= 0.96;
      p.vy *= 0.96;
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Screen Shake Decay
    if (screenShake > 0) {
      screenShake *= 0.88;
      if (screenShake < 0.2) screenShake = 0;
    }
  }

  function render() {
    ctx.save();

    // Clear Screen
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, width, height);

    // Apply Screen Shake
    if (screenShake > 0) {
      const sx = (Math.random() - 0.5) * screenShake * 2;
      const sy = (Math.random() - 0.5) * screenShake * 2;
      ctx.translate(sx, sy);
    }

    // Draw Tactical Grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 45;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Relics (Ancient Shards)
    relics.forEach((r) => {
      ctx.save();
      ctx.translate(r.x, r.y);
      const scale = 1 + Math.sin(r.pulse) * 0.15;
      ctx.scale(scale, scale);

      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.strokeStyle = '#00f0ff';
      ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(0, -r.size);
      ctx.lineTo(r.size, 0);
      ctx.lineTo(0, r.size);
      ctx.lineTo(-r.size, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    });

    // Draw Enemies (Void Drones)
    enemies.forEach((e) => {
      ctx.save();
      ctx.translate(e.x, e.y);
      const angle = Math.atan2(e.vy, e.vx);
      ctx.rotate(angle);

      ctx.shadowColor = '#ff3366';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ff3366';

      ctx.beginPath();
      ctx.moveTo(e.size, 0);
      ctx.lineTo(-e.size, -e.size * 0.7);
      ctx.lineTo(-e.size * 0.4, 0);
      ctx.lineTo(-e.size, e.size * 0.7);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    // Draw Bullets (Plasma Projectiles)
    bullets.forEach((b) => {
      ctx.save();
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Particles
    particles.forEach((p) => {
      ctx.save();
      const alpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Rover (Chassis & Turret)
    ctx.save();
    ctx.translate(rover.x, rover.y);

    // Chassis Shadow & Glow
    ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
    ctx.shadowBlur = 15;

    // Hull (Rotates with rover.angle)
    ctx.save();
    ctx.rotate(rover.angle);

    // Tread lines
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-18, -15, 36, 7);
    ctx.fillRect(-18, 8, 36, 7);

    // Armored Body
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.roundRect(-15, -11, 30, 22, 4);
    ctx.fill();

    // Armor Plate
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.roundRect(-10, -8, 18, 16, 2);
    ctx.fill();
    ctx.restore();

    // Turret (Rotates independently toward mouse)
    ctx.save();
    ctx.rotate(rover.turretAngle);

    // Barrels
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(4, -8, 14, 4);
    ctx.fillRect(4, 4, 14, 4);

    // Turret Dome
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Shield Aura
    if (rover.shield > 0) {
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 + (rover.shield / 100) * 0.25})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, rover.size + 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();

    ctx.restore();
  }

  // Initialize
  spawnEnemies();
  spawnRelics();
  requestAnimationFrame(gameLoop);
})();
