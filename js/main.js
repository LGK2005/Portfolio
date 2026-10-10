/* ===================================================================
   LAM GIA KIET - PORTFOLIO CONTROLLER & MODAL MANAGER
   Handles: Filtering, Case Studies, Audio triggers, Hotkeys, Toasts
   =================================================================== */

// Project Deep-Dive Case Study Database
const projectCaseStudies = {
  raider: {
    title: 'Raider Of Horizon',
    badge: '1–4 Player Co-op Extraction Game (MVP)',
    tech: 'Unity • C# • Blender • Unity Terrain Tools • Netcode',
    itchUrl: 'https://monkz-dct.itch.io/raiders-of-horizons',
    youtubeId: 'ztJaN_UT5uU',
    image: 'assets/images/raiders_combat.jpg',
    lead: 'High-stakes cooperative extraction expedition where teams pilot a shared combat vehicle through hostile uncharted alien zones.',
    overview: `Co-developed a high-stakes co-op extraction game shipped on itch.io. The core game loop follows an extraction shooter paradigm: players must scavenge volatile relics, pilot and defend their shared expedition fortress, and safely evacuate through an unstable portal before zone collapse—or forfeit all collected loot upon death.`,
    technicalContributions: [
      {
        area: 'Map & Environment Architecture',
        detail: 'Architected expansive playable expedition zones utilizing Unity Terrain Tools and modular Blender rock formations. Sculpted tactical flow choke points, sightlines, high-ground vantage perches, and boss battle arenas to maximize tension.'
      },
      {
        area: 'Shared Tactical Vehicle Mechanics',
        detail: 'Engineered physics interactions, hardpoint mount stations, and cargo bay inventory systems for the multi-crew expedition rover. The vehicle functions as both defensive cover, mobile respawn beacon, and shared cargo lifeline.'
      },
      {
        area: 'Extraction Loop & Risk-Reward Tuning',
        detail: 'Formulated the session risk mechanics, boss encounter triggers (Void Stalker), and extraction sequence timing to create escalating climaxes during the final countdown.'
      },
      {
        area: 'Performance Optimization & Draw Calls',
        detail: 'Implemented hierarchical LOD groups, occlusion culling, and texture atlas batching across alien terrain to maintain solid 60+ FPS performance on mid-tier hardware (GTX 960 minimum target).'
      }
    ],
    systemSpecs: {
      minGpu: 'GTX 960 / RX 470',
      minRam: '8 GB RAM',
      engine: 'Unity (DirectX 11 / 12)',
      players: '1 - 4 Co-Op'
    }
  },

  chemilab: {
    title: 'ChemiLab – VR Escape-Room Puzzle',
    badge: 'Solo MVP • Meta Quest 3 Standalone',
    tech: 'Unity • C# • Blender • Meta XR SDK • ElevenLabs',
    itchUrl: 'https://lgk205.itch.io/chemilab',
    image: 'assets/images/chemilab_vr.jpg',
    lead: 'Immersive VR chemistry escape room built and optimized from scratch for standalone Meta Quest 3 hardware.',
    overview: `Independently created a solo VR escape-room puzzle game set in a futuristic research laboratory. Players interact with room-scale physical objects, solve stoichiometric balance puzzles, and fuse elemental blocks (e.g. Na + Cl -> NaCl) to bypass emergency lock-downs and progress through security chambers.`,
    technicalContributions: [
      {
        area: 'End-to-End Solo Pipeline',
        detail: 'Engineered the entire gameplay lifecycle: C# interaction architecture, level scripting, 3D asset modeling in Blender, UV unwrapping, and custom procedural sound synthesis with ElevenLabs.'
      },
      {
        area: 'Standalone VR Performance & Mobile GPU Optimization',
        detail: 'Targeted strict Quest 3 standalone budgets (72/90 FPS without thermal throttling). Replaced expensive real-time shadows with baked lightmaps, leveraged a low-poly asset workflow, and minimized dynamic shader complexity.'
      },
      {
        area: 'VFX Profiling & Bottleneck Remediation',
        detail: 'Diagnosed severe frame stuttering caused by overusing particle systems during chemical reaction bursts. Profiling revealed fill-rate saturation; resolved by reducing particle density by 65%, shortening lifetimes, and recycling emitter pools.'
      },
      {
        area: 'Two-Handed Physical VR Grab System',
        detail: 'Implemented spatial grab interactions, snap-to-dock element fusion pedestals, tactile controller haptics, and responsive visual cues to enhance immersion.'
      }
    ],
    systemSpecs: {
      platform: 'Meta Quest 3 (Standalone Android XR)',
      frameRate: 'Stable 72 / 90 FPS',
      pipeline: 'Unity URP & Custom VR Shader Graph',
      role: 'Solo Developer (Code, 3D Art, Sound, Optimization)'
    }
  },

  patchbrief: {
    title: 'PatchBrief – Game Balance Decision Tool',
    badge: 'Studio Game Analytics & Patch Evaluator',
    tech: 'C# • ASP.NET Core • React • TypeScript • LLM • REST API',
    githubUrl: 'https://github.com/dophucduy/AABW26_PatchBrief',
    demoVideo: 'https://github.com/user-attachments/assets/b7b0e133-9919-49d0-b801-c6dfaa07ece9',
    image: 'assets/images/patchbrief_dashboard.jpg',
    lead: 'Decision-support tool for game systems designers combining live match telemetry, design balance rules, and community sentiment.',
    overview: `Led a multidisciplinary hackathon engineering team building a studio-grade decision support pipeline for live-service game designers. Instead of blind automatic balancing, PatchBrief parses millions of telemetry match events and outputs structured risk briefs before patches are deployed to live servers.`,
    technicalContributions: [
      {
        area: '8-Layer Deterministic Pipeline Architecture',
        detail: 'Architected an extensible pipeline: L0 Adapter → L1 Ingest → L2 Semantic → L3 Metric → L4 Context → L5 Impact → L6 Risk → L7 Structured Brief.'
      },
      {
        area: 'Owned Core Pipeline Layers 5–7 in C#',
        detail: 'Developed Layer 5 (Impact & Alignment rule engine detecting high-elo vs casual bracket divergence), Layer 6 (Risk categorization & solution template mapping), and Layer 7 (Structured report generation with deterministic template fallback).'
      },
      {
        area: 'Telemetry & Sentiment Divergence Detection',
        detail: 'Engineered algorithms to detect when community sentiment diverges from raw win/pick telemetry (e.g., perception of over-powered weapons vs statistically balanced outcomes).'
      },
      {
        area: 'Full-Stack Integration',
        detail: 'Connected ASP.NET Core high-throughput backend with a responsive React/TypeScript visualization UI featuring interactive win-rate curves and patch risk matrixes.'
      }
    ],
    systemSpecs: {
      backend: 'C# .NET 10 & ASP.NET Core WebAPI',
      frontend: 'React + TypeScript + Vite',
      architecture: 'Deterministic 8-Layer Pipeline + LLM Fallback',
      role: 'Team Lead & Pipeline Core Engineer (Layers 5-7)'
    }
  }
};

// UI Initialization
document.addEventListener('DOMContentLoaded', () => {
  initAudioInteractions();
  initProjectFiltering();
  initModalManager();
  initContactForm();
  initScanlineToggle();
  initHotkeys();
  initNavScroll();
});

// Sound Triggers on Interactive Elements
function initAudioInteractions() {
  const interactiveSelector = 'a, button, .filter-btn, .project-card, .skill-card, .icon-btn';
  document.querySelectorAll(interactiveSelector).forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (window.soundEngine) window.soundEngine.playHover();
    });
    el.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playClick();
    });
  });

  const muteBtn = document.getElementById('muteToggleBtn');
  const audioPulse = document.getElementById('audioPulse');
  if (muteBtn) {
    // Initial state check
    const isMuted = localStorage.getItem('lgk_audio_muted') === 'true';
    if (isMuted && audioPulse) {
      audioPulse.classList.add('muted');
      muteBtn.classList.remove('is-active');
    }

    muteBtn.addEventListener('click', () => {
      if (!window.soundEngine) return;
      const muted = window.soundEngine.toggleMute();
      if (audioPulse) {
        if (muted) audioPulse.classList.add('muted');
        else audioPulse.classList.remove('muted');
      }
      showToast(muted ? 'Audio FX Muted' : 'Audio FX Enabled', 'volume');
    });
  }
}

// Project Filtering
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'grid';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Case Study Modal Manager
function initModalManager() {
  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalDynamicContent');
  const closeBtn = document.getElementById('modalCloseBtn');
  if (!modal || !modalContent) return;

  window.openProjectModal = function (projectId) {
    const data = projectCaseStudies[projectId];
    if (!data) return;

    if (window.soundEngine) window.soundEngine.playOpenModal();

    let mediaEmbedHtml = '';
    if (data.youtubeId) {
      mediaEmbedHtml = `
        <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:12px; margin-bottom:1.5rem; border:1px solid rgba(0,240,255,0.3);">
          <iframe style="position:absolute; top:0; left:0; width:100%; height:100%;" 
            src="https://www.youtube.com/embed/${data.youtubeId}?autoplay=0" 
            title="${data.title} Gameplay Video" frameborder="0" allowfullscreen>
          </iframe>
        </div>
      `;
    } else if (data.image) {
      mediaEmbedHtml = `
        <div style="border-radius:12px; overflow:hidden; margin-bottom:1.5rem; border:1px solid rgba(0,240,255,0.3); max-height:380px;">
          <img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover; display:block;">
        </div>
      `;
    }

    const contributionsHtml = data.technicalContributions.map(c => `
      <div style="margin-bottom:1rem; padding:0.9rem; background:rgba(255,255,255,0.03); border-radius:8px; border-left:3px solid #00f0ff;">
        <strong style="color:#00f0ff; display:block; font-size:0.95rem; margin-bottom:0.25rem;">${c.area}</strong>
        <p style="font-size:0.88rem; color:#cbd5e1; line-height:1.55;">${c.detail}</p>
      </div>
    `).join('');

    const specRows = Object.entries(data.systemSpecs).map(([key, val]) => `
      <div style="display:flex; justify-content:space-between; padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06); font-family:var(--font-mono); font-size:0.8rem;">
        <span style="color:#94a3b8; text-transform:uppercase;">${key}</span>
        <span style="color:#00f0ff; font-weight:600;">${val}</span>
      </div>
    `).join('');

    let actionLinks = '';
    if (data.itchUrl) {
      actionLinks += `<a href="${data.itchUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Play on Itch.io →</a>`;
    }
    if (data.githubUrl) {
      actionLinks += `<a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">GitHub Repository →</a>`;
    }
    if (data.demoVideo && !data.youtubeId) {
      actionLinks += `<a href="${data.demoVideo}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">View Demo Clip →</a>`;
    }

    modalContent.innerHTML = `
      <div style="margin-bottom:1rem;">
        <span class="project-type-label">${data.badge}</span>
        <h2 style="font-size:2rem; font-weight:800; margin:0.3rem 0 0.5rem;">${data.title}</h2>
        <p style="color:#f59e0b; font-size:0.92rem; font-family:var(--font-mono);">${data.tech}</p>
      </div>

      ${mediaEmbedHtml}

      <div style="margin-bottom:1.75rem;">
        <h4 style="font-size:1.1rem; color:#fff; margin-bottom:0.6rem;">Executive Summary</h4>
        <p style="font-size:0.95rem; color:#94a3b8; line-height:1.65;">${data.overview}</p>
      </div>

      <div style="margin-bottom:1.75rem;">
        <h4 style="font-size:1.1rem; color:#fff; margin-bottom:0.85rem;">Technical & Engineering Architecture</h4>
        ${contributionsHtml}
      </div>

      <div style="margin-bottom:2rem; background:rgba(10,16,26,0.7); border:1px solid rgba(0,240,255,0.2); border-radius:10px; padding:1rem 1.25rem;">
        <h5 style="color:#fff; font-size:0.9rem; margin-bottom:0.75rem;">Technical Specification Sheet</h5>
        ${specRows}
      </div>

      <div style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
        ${actionLinks}
        <button class="btn btn-secondary btn-sm" onclick="closeProjectModal()">Close Spec</button>
      </div>
    `;

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  window.closeProjectModal = function () {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
    // Stop any playing iframe
    modalContent.innerHTML = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeProjectModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProjectModal();
  });
}

// Contact Form Simulation & Email Copy
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const message = document.getElementById('contactMessage').value;

      if (!name || !email) {
        showToast('Please fill out name and email.', 'warning');
        return;
      }

      showToast(`Thank you, ${name}! Message dispatched successfully.`, 'check');
      form.reset();
    });
  }

  // Copy Email Button
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('lamgiakiet.2005@gmail.com').then(() => {
        showToast('Email copied: lamgiakiet.2005@gmail.com', 'copy');
      }).catch(() => {
        showToast('lamgiakiet.2005@gmail.com', 'copy');
      });
    });
  }
}

// Scanlines Overlay Toggle
function initScanlineToggle() {
  const toggleBtn = document.getElementById('scanlineToggleBtn');
  const overlay = document.getElementById('scanlinesOverlay');
  if (toggleBtn && overlay) {
    toggleBtn.addEventListener('click', () => {
      overlay.classList.toggle('is-disabled');
      const isDisabled = overlay.classList.contains('is-disabled');
      showToast(isDisabled ? 'CRT Scanlines: OFF' : 'CRT Scanlines: ON', 'display');
    });
  }
}

// Keyboard Shortcuts
function initHotkeys() {
  window.addEventListener('keydown', (e) => {
    // Avoid triggering when user is typing in form inputs
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    const key = e.key.toLowerCase();
    if (key === 'm') {
      const muteBtn = document.getElementById('muteToggleBtn');
      if (muteBtn) muteBtn.click();
    } else if (key === 'g') {
      const gameSection = document.getElementById('game-lab');
      if (gameSection) gameSection.scrollIntoView({ behavior: 'smooth' });
    } else if (key === 'r') {
      const resumeLink = document.getElementById('navResumeLink');
      if (resumeLink) {
        showToast('Downloading Lam_Gia_Kiet_Resume.pdf', 'download');
        window.open('Lam_Gia_Kiet_Resume.pdf', '_blank');
      }
    } else if (key === 'c') {
      const contactSec = document.getElementById('contact');
      if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
    } else if (key === 'escape') {
      if (window.closeProjectModal) window.closeProjectModal();
    }
  });
}

// Navbar Scroll Highlight
function initNavScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(sec => {
      const sectionHeight = sec.offsetHeight;
      const sectionTop = sec.offsetTop - 120;
      const sectionId = sec.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

// Toast Notification Engine
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color:#00f0ff; font-weight:bold;">▶</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
