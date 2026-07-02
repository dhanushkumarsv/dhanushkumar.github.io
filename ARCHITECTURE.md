# THE PROCESS NEXUS — Architecture & Design Document

> A cinematic, explorable 3D industrial world — the portfolio of **Dhanush Kumar S V**,
> Chemical Engineering graduate researcher (National Chung Hsing University, Taiwan).
>
> Not a webpage. A place. The visitor lands in darkness above a futuristic
> process-engineering city in the year 2045 and flies between eight living
> facilities, each one a chapter of the portfolio.

---

## 1. Project Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Next.js 16 (App Router, static export → GitHub Pages)                   │
│                                                                          │
│  /            → ExperienceApp (client-only, dynamic import, no SSR)      │
│  /resume      → 2D print-ready dossier (accessibility + PDF fallback)    │
│                                                                          │
│  ┌──────────────────────┐      ┌──────────────────────────────────────┐  │
│  │  DOM LAYER (React)   │      │  WEBGL LAYER (React Three Fiber v9)  │  │
│  │  Framer Motion       │      │  three.js r180 + drei + postfx       │  │
│  │  ─ LoadingScreen     │      │  ─ CameraRig (GSAP flight system)    │  │
│  │  ─ IntroOverlay      │◄────►│  ─ Atmosphere (fog/lights/HDR env)   │  │
│  │  ─ HUD + Dock        │      │  ─ World (city, spire, pipes)        │  │
│  │  ─ SectionPanels ×8  │      │  ─ 8 District facilities             │  │
│  │  ─ HelpOverlay       │      │  ─ GPU particles / steam / shaders   │  │
│  │  ─ CursorGlow        │      │  ─ EffectComposer (bloom, DoF, CA)   │  │
│  └──────────┬───────────┘      └──────────────────┬───────────────────┘  │
│             │        ┌───────────────────┐        │                      │
│             └───────►│  ZUSTAND STORE    │◄───────┘                      │
│                      │  phase machine    │                               │
│                      │  active district  │                               │
│                      │  quality tier     │                               │
│                      │  audio prefs      │                               │
│                      └────────┬──────────┘                               │
│                               │                                          │
│              ┌────────────────┴───────────────┐                          │
│              │ SUPPORT SYSTEMS (framework-free)│                         │
│              │ audio.ts  — WebAudio synth      │                         │
│              │ flight.ts — GSAP bézier flights │                         │
│              │ pointer.ts— shared mutable state│                         │
│              │ quality.ts— adaptive perf tiers │                         │
│              └────────────────────────────────┘                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**State machine** (single source of truth in `src/store/experience.ts`):

```
boot ──(ENTER pressed / audio unlocked)──► intro ──(timeline ends or SKIP)──► explore
                                                                                │
                                            ┌───────────────────────────────────┤
                                            ▼                                   ▼
                                   activeDistrict = id                 activeDistrict = null
                                   (flight → arrive → panel)           (flight → overview)
```

**Data flow rules**

- Per-frame values (camera, pointer, shader time) **never** touch React state —
  they live in refs/`pointerState` and are read inside `useFrame`.
- The store changes only on discrete events (click, arrival, tier change), so
  React re-renders stay rare and the frame loop stays hot.
- All portfolio copy lives in **one file**: `src/content/portfolio.ts`.

## 2. Folder Structure

```
├── ARCHITECTURE.md               ← this document
├── next.config.ts                ← output:'export' for GitHub Pages
├── .github/workflows/deploy.yml  ← build + deploy to Pages on push to main
├── public/
│   ├── profile.jpg               ← real photo (used in HUD + resume)
│   ├── .nojekyll  · robots.txt · google-site-verification
└── src/
    ├── app/
    │   ├── layout.tsx            ← metadata, fonts, viewport
    │   ├── page.tsx              ← dynamic(ssr:false) → ExperienceApp
    │   ├── globals.css           ← Tailwind 4 theme + HUD design system
    │   └── resume/page.tsx       ← print-ready 2D dossier
    ├── content/portfolio.ts      ← ALL personal data (edit here)
    ├── store/experience.ts       ← zustand state machine
    ├── lib/
    │   ├── districts.ts          ← world layout + camera shots + intro path
    │   ├── flight.ts             ← GSAP quadratic-bézier camera flights
    │   ├── audio.ts              ← procedural WebAudio engine (music + sfx)
    │   ├── quality.ts            ← perf tiers + device detection
    │   ├── pointer.ts            ← shared mutable pointer state
    │   └── textures.ts           ← procedural canvas textures (glow, windows)
    ├── shaders/index.ts          ← all GLSL (sky, particles, steam, flow…)
    ├── hooks/
    │   ├── useMediaQuery.ts
    │   └── useNavigationControls.ts  ← wheel / keys / swipe navigation
    └── components/
        ├── ExperienceApp.tsx     ← client root, composes everything
        ├── canvas/               ← Scene, CameraRig, Effects, Atmosphere
        ├── world/                ← Ground, SkyDome, CityScape, NexusSpire,
        │   │                        PipeNetwork, AmbientParticles, World
        │   ├── elements/         ← Steam, DistrictBeacon, common (materials)
        │   └── districts/        ← ResearchCenter, AspenLab, HydrogenPlant,
        │                            MembraneFacility, DistillationTower,
        │                            InnovationLibrary, ControlRoom, CommsHub
        └── ui/                   ← LoadingScreen, IntroOverlay, Hud,
            │                        NavigationDock, SectionPanel, HelpOverlay,
            │                        CursorGlow, Fallback
            └── panels/           ← 8 content panels + shared kit
```

## 3. Technology Stack

| Layer            | Choice                              | Why                                                          |
| ---------------- | ----------------------------------- | ------------------------------------------------------------ |
| Framework        | **Next.js 16** (App Router)         | Static export → free GitHub Pages hosting, route splitting   |
| 3D               | **three.js r180 + R3F v9 + drei**   | Declarative scene graph, React 19 compatible                 |
| Post-processing  | **@react-three/postprocessing v3**  | Bloom, depth of field, chromatic aberration, vignette, grain |
| Camera animation | **GSAP 3**                          | Frame-accurate bézier flight timelines, killable mid-flight  |
| UI animation     | **Framer Motion 11**                | Panel choreography, AnimatePresence exits                    |
| Styling          | **Tailwind CSS 4**                  | CSS-first `@theme` design tokens                             |
| State            | **Zustand 5**                       | Transient reads via `getState()` inside the frame loop       |
| Audio            | **Raw WebAudio** (zero assets)      | Fully synthesized score + SFX → no downloads, instant load   |
| Language         | **TypeScript strict**               | Refactor safety across 60+ modules                           |

**Deliberate constraint — zero binary 3D assets.** Every structure is procedural
geometry, every texture is generated on a canvas, every sound is synthesized.
The whole world ships as code (~a few hundred KB gzipped), loads in seconds,
and never breaks from a missing CDN model.

## 4. Development Roadmap

| Phase | Deliverable                                                        |
| ----- | ------------------------------------------------------------------ |
| P0    | Plan (this doc), repo cleanup, configs, design tokens               |
| P1    | Core engine: store, quality tiers, flight math, audio, shaders      |
| P2    | Atmosphere: sky dome, fog, HDR env, reflective ground, grid         |
| P3    | City: instanced skyline, Nexus spire, pipe ring, particles, steam   |
| P4    | Eight districts with bespoke animated machinery + beacons           |
| P5    | Cinematic intro, camera rig, navigation (wheel/keys/touch/dock)     |
| P6    | HUD + 8 content panels (interactive PFD, VMD animation, dossier)    |
| P7    | Resume route, accessibility fallbacks, reduced motion               |
| P8    | Build, browser smoke test, adaptive perf pass, Pages deploy         |

## 5. Scene Breakdown

World: a 300 m circular caldera of dark reflective ground under a night sky
with aurora. A central landmark (the **Nexus Spire**) anchors eight facilities
on a 36 m ring, all linked by a glowing pipeline that visibly transports fluid.

| # | District (portfolio section)                   | Signature set-piece                                                                     | Accent    |
| - | ---------------------------------------------- | ---------------------------------------------------------------------------------------| --------- |
| — | **Nexus Spire** (landmark)                     | 30 m spire, counter-rotating halo rings, sky beam, orbiting drones                      | cyan      |
| 1 | **Research Center** → research projects        | Glass dome, slowly tumbling molecule hologram, orbital rings                            | `#22d3ee` |
| 2 | **Aspen Plus Laboratory** → simulation work    | Roof-top holographic flowsheet: feed → mixer → flash → vacuum column, streams animate   | `#a78bfa` |
| 3 | **Hydrogen Energy Plant** → H₂ + supply chain  | Electrolyzer racks, bubbling photoreactor column, storage spheres, spinning turbine     | `#34d399` |
| 4 | **Membrane Distillation Facility** → VMD/MED   | Cut-away VMD module: hot feed pipe, membrane core, vapor crossing to condenser coil     | `#38bdf8` |
| 5 | **Distillation Tower** → technical skills      | 20 m column, 5 sight-glass trays with rising bubbles, reboiler glow, reflux loop, steam | `#fbbf24` |
| 6 | **Innovation Library** → publications & education | Double helix of floating data slabs orbiting a light core                            | `#fb7185` |
| 7 | **Control Room** → dossier & downloads         | Curved wall of live animated telemetry screens, rotating radar                          | `#fb923c` |
| 8 | **Communication Hub** → contact                | Lattice antenna, expanding signal rings, blinking beacon                                | `#e879f9` |

Ambient layer everywhere: GPU dust motes that **flee the cursor**, six steam
columns, 120-tower instanced skyline with lit windows, aviation lights,
volumetric light shafts, moon + aurora + procedural starfield.

## 6. Animation Timeline

**Intro cinematic (~15 s, skippable, letterboxed):**

| t (s)      | Camera                                   | Overlay                            |
| ---------- | ---------------------------------------- | ---------------------------------- |
| 0 – 4      | High orbit (0,170,300) → dive to 80 m    | Name card: DHANUSH KUMAR S V       |
| 4 – 8.4    | Sweep right flank across skyline         | “WELCOME TO THE PROCESS NEXUS”     |
| 8.4 – 12.6 | Low pass, left arc through steam         | “8 FACILITIES · ONE ENGINEER”      |
| 12.6 – 15.6| Settle into overview shot                | HUD fades in, letterbox retracts   |

**Continuous machine loops (all districts always alive):** halo rings 0.05–0.4
rad/s · turbine 1.6 rad/s · radar 0.7 rad/s · bubbles rise-wrap 1.4 s · signal
rings 3 s expand/fade ×3 staggered · pipeline stripes scroll 0.9 uv/s · steam
particle life 4–8 s · molecule tumble two-axis · library helix 0.12 rad/s with
per-slab bob · screen telemetry re-randomizes every beat.

**District flight:** 2.6 s `power3.inOut` quadratic bézier whose control point
lifts with distance (arc = 2 + 0.12·d, capped) and bends laterally — the camera
*banks* between districts instead of tracking straight lines. Letterbox bars
close during flight; a synthesized whoosh doppler accompanies it; panel opens
on arrival.

## 7. Camera System

- `FlightState { pos, tgt, fov }` — mutable vectors owned by the rig, tweened
  by GSAP, consumed every frame. React never re-renders for camera motion.
- **Flights:** quadratic bézier position + lerped look-target + fov ramp.
  Retargetable mid-flight (new click kills the tween and departs from the
  current pose — no snapping).
- **Idle life:** two incommensurate sine drifts (0.24 / 0.31 Hz) so the camera
  breathes; amplitude eases toward zero while transitioning.
- **Parallax:** pointer NDC → smoothed camera-space translate (±1.4 m), applied
  *after* lookAt so orientation stays stable — a dolly, not a shake.
- **Shots:** every district defines a hand-tuned shot (distance 15–22 m, height
  6.5–12 m, lateral offset alternating sides, fov 46–55) computed radially from
  the ring so each arrival composes differently.

## 8. UI / UX Plan

**Design language — “GLASS FOUNDRY”:** deep void `#04060c`, cyan ion `#67e8f9`,
per-district accent hues; Orbitron for display type, Rajdhani for HUD text;
frosted glass panels with corner brackets, 1 px scanlines, letterboxing during
cinematics; every label uppercase with wide tracking, like a plant DCS from 2045.

- **Boot:** reactor-core loader with staged status lines
  (“PRESSURIZING PIPELINES…”), ENTER button doubles as the audio unlock,
  plus a “2D dossier” escape hatch for non-WebGL visitors.
- **Navigate:** scroll / swipe cycles districts · click glowing beacons ·
  dock (bottom) jumps anywhere · keys `1–8`, arrows, `Esc` overview, `M` mute,
  `H` help. First visit auto-opens a help card once.
- **Read:** glass side panel (bottom sheet on mobile) with animated content:
  interactive Aspen flowsheet (clickable unit ops), animated VMD cross-section,
  supply-chain diagram, skill bars, dossier timeline, vCard + print-PDF
  downloads, mailto composer.
- **Hear:** generative ambient score (Am9→Fmaj7→Cmaj7→G6 pads through a
  synthesized hall), independent music/SFX toggles, volume persistence.
- **Access:** `/resume` is a complete no-WebGL portfolio; `prefers-reduced-motion`
  shortens the intro and stills the idle drift; WebGL-fail shows a graceful
  fallback card.

## 9. Performance Strategy

Three adaptive tiers, auto-detected (device memory, cores, pointer type,
viewport) and auto-degrading via drei `PerformanceMonitor`; user can pin a tier
in the HUD.

| Tier          | DPR cap | Particles | Reflections    | Shadows | Post FX                     |
| ------------- | ------- | --------- | -------------- | ------- | --------------------------- |
| `performance` | 1.0     | 1 600     | off (matte)    | off     | none                        |
| `balanced`    | 1.5     | 5 000     | 512 px planar  | 1024 px | bloom + vignette + grain    |
| `cinematic`   | 2.0     | 9 000     | 1024 px planar | 2048 px | + DoF + chromatic aberration|

Techniques: instancing (skyline = 2 draw calls for 128 towers; bubbles, steam,
slabs, particles all instanced or single-buffer) · shared unit geometries and
cached materials · shader-side animation (zero per-frame attribute uploads for
particles/steam/pipes) · `frameloop` stays hot but React re-renders ~never ·
canvas mounts behind the boot screen so shaders compile before reveal · route
split keeps `/resume` free of three.js · fog culls the far city naturally ·
static export, no runtime image optimization, fonts swap-loaded.

---

*Everything below `src/content/portfolio.ts` is data. Change the data, keep the world.*
