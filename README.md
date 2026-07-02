# THE PROCESS NEXUS

> The cinematic 3D portfolio of **Dhanush Kumar S V** — chemical engineering
> graduate researcher. Not a webpage: a living industrial world set in 2045,
> where eight animated facilities each hold one chapter of the portfolio.

**Live:** https://dhanushkumarsv.github.io · **2D dossier:** `/resume/`

![stack](https://img.shields.io/badge/Next.js%2016-black) ![stack](https://img.shields.io/badge/React%20Three%20Fiber%209-black) ![stack](https://img.shields.io/badge/GSAP-black) ![stack](https://img.shields.io/badge/Tailwind%204-black) ![stack](https://img.shields.io/badge/TypeScript-black)

## The world

| Facility | Portfolio section |
| --- | --- |
| 01 Research Center | Research programs (VMD-MED, glycerol, H₂, MILP) |
| 02 Aspen Plus Laboratory | Interactive process flowsheet + simulation toolkit |
| 03 Hydrogen Energy Plant | Photocatalytic H₂ + supply-chain optimization |
| 04 Membrane Distillation Facility | Animated VMD cross-section + hybrid MED research |
| 05 Distillation Tower | Technical skills, sorted by tray |
| 06 Innovation Library | Education, publications, milestones |
| 07 Control Room | Experience dossier, vCard + printable CV |
| 08 Communication Hub | Contact channels + mail composer |

Everything is procedural — geometry, textures, even the ambient score and
sound effects are synthesized in code. No 3D model or audio files exist in
this repository. See [ARCHITECTURE.md](ARCHITECTURE.md) for the full design
document (camera system, shaders, performance tiers, animation timeline).

## Controls

`scroll / swipe` tour the ring · `click beacons` fly in · `1–8` jump ·
`0 / Esc` overview · `M` mute · `H` help. Quality auto-adapts (PERF / BAL /
CINE) and can be pinned from the HUD.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export → ./out
```

## Deploy (GitHub Pages)

Pushes to `main` run `.github/workflows/deploy.yml`, which builds the static
export and publishes it with the official Pages actions.

**One-time setup:** repository → *Settings → Pages → Build and deployment →
Source: “GitHub Actions”.*

## Edit the content

All portfolio copy — profile, projects, flowsheet, skills, education,
experience, links — lives in **`src/content/portfolio.ts`**. Change the data;
the world, the panels, and the printable dossier all update together.

Tuning knobs elsewhere:

- `src/lib/districts.ts` — world layout, camera shots, intro path
- `src/lib/quality.ts` — performance tiers
- `src/lib/audio.ts` — the generative score (chords, tempo, sfx)
- `src/app/globals.css` — design tokens (colors, fonts)
