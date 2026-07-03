/* ============================================================
   Portfolio interactions: theme switching, nav, animations
   ============================================================ */

(function () {
  "use strict";

  const root = document.documentElement;
  const THEMES = ["spidey", "batman", "pro"];

  /* ---------------- Theme switching ---------------- */
  const themeBtns = document.querySelectorAll("[data-set-theme]");

  function applyTheme(theme, save = true) {
    if (!THEMES.includes(theme)) theme = "pro";
    root.setAttribute("data-theme", theme);
    themeBtns.forEach(b => b.classList.toggle("active", b.dataset.setTheme === theme));
    if (save) { try { localStorage.setItem("dk-theme", theme); } catch (e) { /* private mode */ } }
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
  }

  themeBtns.forEach(btn =>
    btn.addEventListener("click", () => applyTheme(btn.dataset.setTheme))
  );

  let saved = null;
  try { saved = localStorage.getItem("dk-theme"); } catch (e) { /* ignore */ }
  applyTheme(saved || "pro", false);

  /* ---------------- Navbar ---------------- */
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    })
  );

  /* Active link highlighting */
  const sections = document.querySelectorAll("section[id], footer[id]");
  const linkMap = {};
  navLinks.querySelectorAll("a").forEach(a => { linkMap[a.getAttribute("href").slice(1)] = a; });

  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting && linkMap[en.target.id]) {
        Object.values(linkMap).forEach(a => a.classList.remove("active"));
        linkMap[en.target.id].classList.add("active");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(s => spy.observe(s));

  /* ---------------- Scroll reveal ---------------- */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        revealObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

  /* ---------------- Animated counters ---------------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const dur = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        animateCount(en.target);
        countObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach(el => countObs.observe(el));

  /* ---------------- Typewriter ---------------- */
  const roles = [
    "Process Engineer",
    "Simulation Specialist",
    "Optimization Enthusiast",
    "Chemical Engineer",
    "Researcher"
  ];
  const tw = document.getElementById("typewriter");
  let roleIdx = 0, charIdx = 0, deleting = false;

  function typeLoop() {
    const word = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(typeLoop, 1700);
        tw.textContent = word.slice(0, charIdx);
        return;
      }
    } else {
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    tw.textContent = word.slice(0, charIdx);
    setTimeout(typeLoop, deleting ? 45 : 90);
  }
  typeLoop();

  /* ---------------- Particle canvas (theme-aware) ---------------- */
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const PALETTES = {
    spidey: { dots: ["#e62429", "#2456c9"], line: "36, 86, 201", lineAlpha: 0.14 },
    batman: { dots: ["#f5c518", "#4a5468"], line: "245, 197, 24", lineAlpha: 0.08 },
    pro:    { dots: ["#0f5c8c", "#0e8f7e"], line: "15, 92, 140", lineAlpha: 0.10 }
  };

  let particles = [];
  let palette = PALETTES.pro;
  let W = 0, H = 0, rafId = null;

  function resize() {
    const hero = document.getElementById("hero");
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function initParticles() {
    const count = Math.min(70, Math.floor(W / 18));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.2 + 0.8,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      c: palette.dots[Math.floor(Math.random() * palette.dots.length)]
    }));
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = 0.55;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = dx * dx + dy * dy;
        if (dist < 130 * 130) {
          ctx.globalAlpha = palette.lineAlpha * (1 - dist / (130 * 130));
          ctx.strokeStyle = "rgb(" + palette.line + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(drawFrame);
  }

  function restartParticles() {
    if (rafId) cancelAnimationFrame(rafId);
    resize();
    const theme = root.getAttribute("data-theme");
    palette = PALETTES[theme] || PALETTES.pro;
    initParticles();
    if (!reduceMotion) drawFrame();
    else { // draw one static frame
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c; ctx.globalAlpha = 0.5; ctx.fill();
      });
      ctx.globalAlpha = 1;
    }
  }

  window.addEventListener("resize", restartParticles);
  document.addEventListener("themechange", restartParticles);
  restartParticles();
})();
