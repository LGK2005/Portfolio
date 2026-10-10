# Lam Gia Kiet — Game Developer Engineer Portfolio

> **Gameplay Systems • Unity (C#) • Standalone VR Optimization (Meta Quest 3) • Co-Op Action**

Welcome to the official portfolio repository of **Lam Gia Kiet**, Software Engineering undergraduate at **FPT University** and Game Developer Engineer based in Ho Chi Minh City, Vietnam.

---

## 🎮 Shipped Projects & Case Studies

### 1. [Raider Of Horizon](https://monkz-dct.itch.io/raiders-of-horizons)
*1–4 Player Co-Op Extraction Expedition Game (MVP)*
- **Engine & Tools:** Unity, C#, Blender, Unity Terrain Tools
- **Role & Contributions:**
  - Designed playable expedition zones using Unity Terrain Tools & custom Blender models; shaped exploration flow and combat arenas.
  - Engineered physics and interactions for the shared armored tactical vehicle (mobile fortress, cargo inventory, mounted weapon hardpoints).
  - Designed the high-stakes extraction loop, Void Stalker boss encounters, and defined PC hardware performance profiles.
- **Links:** [Itch.io Page](https://monkz-dct.itch.io/raiders-of-horizons) • [Gameplay Video](https://www.youtube.com/watch?v=ztJaN_UT5uU)

### 2. ChemiLab VR
*Standalone VR Escape-Room Puzzle Game (Solo MVP)*
- **Engine & Target:** Unity, Meta Quest 3 (Standalone Android XR), Blender, ElevenLabs
- **Role & Contributions:**
  - Targeted strict Meta Quest 3 standalone budget to maintain a rock-solid **72/90 FPS** without thermal throttling using baked lighting and low-poly assets.
  - Profiling & VFX: Diagnosed and resolved fill-rate saturation from particle systems by reducing emitter density by 65% and recycling particle pools.
  - Solo full-cycle development: C# interaction scripts, 3D lab environment in Blender, and procedural audio synthesis.
- **Link:** [Itch.io Page](https://lgk205.itch.io/chemilab)

### 3. [PatchBrief](https://github.com/dophucduy/AABW26_PatchBrief)
*Game Balance Decision Tool & Telemetry Engine*
- **Tech Stack:** C#, ASP.NET Core, React, TypeScript, LLM
- **Role:** Team Lead & Pipeline Core Engineer
- **Contributions:**
  - Owned Layers 5–7 of an 8-layer deterministic pipeline:
    - **L5 (Impact & Alignment):** C# rule engine evaluating player bracket divergence (Bronze to Diamond).
    - **L6 (Risk Framing):** Classification of gameplay risks and solution-path templates.
    - **L7 (Report Synthesis):** Structured JSON + Markdown generation with LLM inference and deterministic template fallback.
- **Link:** [GitHub Repository](https://github.com/dophucduy/AABW26_PatchBrief)

---

## ⚡ Technical Skills Matrix

- **Game Development:** Unity (C#), Meta Quest 3 VR, Blender (3D modeling & texture baking), Unity Terrain Tools, Unity Profiler, Standalone VR Optimization.
- **Programming Languages:** C# (.NET), Java (Core / OOP concepts), SQL, TypeScript / JavaScript.
- **Cloud & Infrastructure:** AWS (CDK, Lambda, S3, Athena, CloudFront, DynamoDB) — AWS FCJ Alum, Lotus Hackathon (Top 21 Raw / Top 17 AWS Track).
- **Languages:** English (IELTS 6.5), Vietnamese (Native).

---

## 🚀 Running Locally

The portfolio is built with modern vanilla web standards (HTML5, CSS3, ES6 JavaScript) and native Web Audio API synthesis without external framework bloat.

1. Clone the repository:
   ```bash
   git clone https://github.com/LGK2005/Portfolio.git
   cd Portfolio
   ```
2. Start any local static server:
   ```bash
   python -m http.server 8080
   # or
   npx serve .
   ```
3. Open `http://localhost:8080` in your web browser.

---

## 📬 Contact Information

- **Email:** [lamgiakiet.2005@gmail.com](mailto:lamgiakiet.2005@gmail.com)
- **Phone / Zalo:** (+84) 886659957
- **LinkedIn:** [linkedin.com/in/lam-kiet-b79560304](https://www.linkedin.com/in/lam-kiet-b79560304/)
- **Resume:** Included in repository as `Lam_Gia_Kiet_Resume.pdf`
