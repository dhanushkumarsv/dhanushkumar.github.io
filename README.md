# Dhanush Kumar S V — Portfolio

A three-identity portfolio for a Process Engineer:

| Theme | Vibe | Trigger |
|-------|------|---------|
| 🕷️ **Spidey** | Bright red/blue, comic halftone dots, web corners | Top-right spider icon |
| 🦇 **Gotham** | Dark knight — near-black, bat-yellow, skyline & bat-signal | Top-right bat icon |
| 💼 **Professional** | Clean, classic serif + navy/teal | Top-right briefcase icon |

Your theme choice is remembered between visits (localStorage).

## Features
- **Theme switcher** in the top-right corner — every color, font, decoration and even the chatbot's personality changes (Alfred answers in Gotham mode).
- **Resume section** — downloads for PDF and Word (`assets/`).
- **Resume chatbot** — 100% client-side Q&A about education, skills, research, internships, publications, contact. No API keys, works offline.
- **Fully responsive** — desktop, tablet and mobile (hamburger nav).
- Animated particles, scroll reveals, typewriter hero, animated stat counters. Respects `prefers-reduced-motion`.

## Run locally
Just open `index.html` in a browser, or serve it:

```
python -m http.server 8087
```

then visit http://localhost:8087

## Deploy (free options)
- **GitHub Pages**: push this folder to a repo → Settings → Pages → deploy from branch.
- **Netlify / Vercel**: drag-and-drop the folder — it's a fully static site, no build step.

## Updating the resume
Replace `assets/Dhanush_Kumar_Resume.pdf` / `.docx`, and edit `js/resume-data.js`
so the chatbot's answers stay in sync.
