/* ============================================================
   Resume chatbot — rule-based Q&A over RESUME data.
   Runs fully client-side: no API keys, works anywhere.
   ============================================================ */

(function () {
  "use strict";

  const win = document.getElementById("chatWindow");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const sugBox = document.getElementById("chatSuggestions");
  const avatarEl = document.getElementById("chatAvatar");
  const titleEl = document.getElementById("chatTitle");

  /* ---------- Theme personas ---------- */
  const PERSONAS = {
    spidey: {
      avatar: "🕷️",
      title: "Web-Assistant",
      greet: "Hey there! 🕸️ Your friendly neighborhood assistant here. Ask me anything about <strong>Dhanush's</strong> education, skills, research or experience — thwip away!"
    },
    batman: {
      avatar: "🦇",
      title: "Alfred",
      greet: "Good evening. I am <strong>Alfred</strong>, keeper of Master Dhanush's records. His education, expertise, research, experience — ask, and it shall be answered."
    },
    pro: {
      avatar: "🤖",
      title: "Dhanush's Assistant",
      greet: "Hello! 👋 I'm Dhanush's resume assistant. Ask me about his <strong>education, skills, research, internships, publications</strong> or how to contact him."
    }
  };

  function currentPersona() {
    const t = document.documentElement.getAttribute("data-theme");
    return PERSONAS[t] || PERSONAS.pro;
  }

  document.addEventListener("themechange", () => {
    const p = currentPersona();
    avatarEl.textContent = p.avatar;
    titleEl.textContent = p.title;
  });

  /* ---------- Helpers ---------- */
  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function addMsg(html, who) {
    const div = document.createElement("div");
    div.className = "msg " + who;
    div.innerHTML = html;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
    return div;
  }

  function showTyping() {
    return addMsg('<span class="typing"><i></i><i></i><i></i></span>', "bot");
  }

  function botReply(html, delay) {
    const t = showTyping();
    setTimeout(() => {
      t.innerHTML = html;
      win.scrollTop = win.scrollHeight;
    }, delay || Math.min(500 + html.length * 2, 1400));
  }

  function list(items) {
    return "<ul>" + items.map(i => "<li>" + i + "</li>").join("") + "</ul>";
  }

  /* ---------- Knowledge base (intents) ---------- */
  const INTENTS = [
    {
      keys: ["hi", "hello", "hey", "greetings", "good morning", "good evening", "yo", "sup"],
      exact: true,
      reply: () => currentPersona().greet
    },
    {
      keys: ["education", "degree", "university", "universities", "study", "studied", "gpa", "grade", "master", "masters", "m.s", "ms ", "bachelor", "btech", "b.tech", "school", "academic"],
      reply: () => "🎓 <strong>Education:</strong>" + list(RESUME.education.map(e =>
        `<strong>${e.degree}</strong> — ${e.school}, ${e.place} (${e.years}) · GPA <strong>${e.gpa}</strong>`
      ))
    },
    {
      keys: ["skill", "skills", "software", "tools", "tool", "aspen", "hysys", "matlab", "gams", "python", "ansys", "fluent", "origin", "imagej", "excel", "simulation", "simulate", "technical", "expertise", "program", "technologies", "tech stack"],
      reply: () => "🛠️ <strong>Technical expertise:</strong>" + list(
        Object.entries(RESUME.skills).map(([k, v]) => `<strong>${k}:</strong> ${v.join(", ")}`)
      )
    },
    {
      keys: ["hydrogen", "photocatalytic", "photocatalysis", "tio2", "reactor", "solar", "h2"],
      reply: () => {
        const r = RESUME.research[2];
        return `⚡ <strong>${r.title}</strong>` + list(r.points);
      }
    },
    {
      keys: ["wastewater", "water", "desalination", "vmd", "med", "msf", "phosphogypsum", "phosphorus", "mec", "membrane", "distillation", "treatment"],
      reply: () => {
        const r = RESUME.research[0];
        return `💧 <strong>${r.title}</strong>` + list(r.points);
      }
    },
    {
      keys: ["milk", "dairy", "milp", "supply chain", "logistics", "procurement", "bmc", "cost reduction"],
      reply: () => {
        const r = RESUME.research[1];
        return `🥛 <strong>${r.title}</strong>` + list(r.points);
      }
    },
    {
      keys: ["research", "projects", "project", "thesis", "work on", "worked on"],
      reply: () => "🔬 <strong>Research experience — 3 major projects:</strong>" + list(RESUME.research.map(r =>
        `<strong>${r.title}</strong> <em>(${r.tags.join(" · ")})</em>`
      )) + "Ask me about any of them — e.g. <em>“tell me about the hydrogen project”</em>."
    },
    {
      keys: ["experience", "internship", "internships", "intern", "job", "jobs", "work history", "sail", "steel", "iit", "indore", "cfd", "coating", "rk metals", "teaching", "assistant", "ta ", "companies", "employment"],
      reply: () => "💼 <strong>Internships & experience:</strong>" + list(RESUME.internships.map(i =>
        `<strong>${i.role}</strong> — ${i.org} <em>(${i.period})</em>`
      )) + "Want details on any role? Just ask!"
    },
    {
      keys: ["publication", "publications", "paper", "papers", "conference", "conferences", "icates", "icats", "published", "glycerol"],
      reply: () => "📚 <strong>Publications & conferences:</strong>" + list(RESUME.publications.map(p =>
        `“${p.title}” — <strong>${p.venue}</strong>`
      ))
    },
    {
      keys: ["language", "languages", "speak", "english", "chinese", "tamil", "mandarin"],
      reply: () => "🗣️ <strong>Languages:</strong> " + RESUME.languages.map(l => `${l.name} (${l.level})`).join(" · ")
    },
    {
      keys: ["contact", "email", "phone", "call", "linkedin", "reach", "hire", "hiring", "connect", "get in touch"],
      reply: () =>
        "📬 <strong>Contact Dhanush:</strong>" + list([
          `Email: <a href="mailto:${RESUME.email}">${RESUME.email}</a>`,
          `Phone: <a href="tel:${RESUME.phone.replace(/[^+\d]/g, "")}">${RESUME.phone}</a>`,
          `LinkedIn: <a href="${RESUME.linkedin}" target="_blank" rel="noopener">dhanush-kumar-772274213</a>`,
          `Location: ${RESUME.location}`
        ])
    },
    {
      keys: ["location", "where", "based", "live", "taiwan", "taichung", "from", "country", "city"],
      reply: () => `📍 Dhanush is based in <strong>${RESUME.location}</strong>, where he's pursuing his M.S. in Chemical Engineering at National Chung Hsing University. He's originally from India (B.Tech at Anna University, Chennai).`
    },
    {
      keys: ["resume", "cv", "download", "pdf", "docx", "copy"],
      reply: () => `📄 You can grab the resume right here: <a href="assets/Dhanush_Kumar_Resume.pdf" download><strong>Download PDF</strong></a> or <a href="assets/Dhanush_Kumar_Resume.docx" download><strong>Word (.docx)</strong></a> — also available in the <a href="#resume">Resume section</a>.`
    },
    {
      keys: ["about", "who", "summary", "yourself", "himself", "introduce", "overview", "profile", "bio"],
      reply: () => `👨‍🔬 <strong>${RESUME.name}</strong> — ${RESUME.title}, ${RESUME.location}.<br><br>${RESUME.summary}`
    },
    {
      keys: ["strength", "strengths", "best at", "good at", "why hire", "why should", "stand out", "unique", "value"],
      reply: () => "💪 <strong>What makes Dhanush stand out:</strong>" + list([
        "<strong>Simulation depth:</strong> Aspen Plus, HYSYS, MATLAB, GAMS & Ansys Fluent across chemical and semiconductor processes",
        "<strong>Proven results:</strong> ~17% supply-chain cost reduction, ~300 mL·h⁻¹·L⁻¹ solar hydrogen output, top M.S. GPA (3.95/4.3)",
        "<strong>Breadth:</strong> steel QA, CFD research, electrochemical coating, teaching — plus 2 conference publications",
        "<strong>Mindset:</strong> data-driven, yield-focused, continuous improvement"
      ])
    },
    {
      keys: ["batman", "spiderman", "spider-man", "spidey", "superhero", "theme", "themes", "dark mode", "gotham", "favorite hero"],
      reply: () => "🦸 Fun fact: this portfolio has <strong>three identities</strong> — bright & bold <strong>Spidey mode</strong> 🕷️, brooding <strong>Gotham mode</strong> 🦇, and a clean <strong>Professional mode</strong> 💼. Switch them from the icons in the top-right corner! Like any good engineer, Dhanush optimizes for every environment."
    },
    {
      keys: ["thank", "thanks", "thx", "great", "awesome", "cool", "nice", "bye", "goodbye"],
      reply: () => "You're welcome! 😊 Anything else you'd like to know? If you'd like to talk to the real Dhanush, <a href=\"mailto:" + RESUME.email + "\">drop him an email</a>."
    }
  ];

  const FALLBACK = () =>
    "Hmm, I don't have that in my files. 🤔 Try asking about:" + list([
      "🎓 Education & GPA", "🛠️ Skills & software", "🔬 Research projects",
      "💼 Internships & experience", "📚 Publications", "📬 Contact info", "📄 Resume download"
    ]);

  /* ---------- Intent matching ---------- */
  function keyMatches(q, key) {
    // whole-word match so "yo" doesn't fire inside "you", "hi" inside "which", etc.
    const escaped = key.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp("\\b" + escaped + "\\b", "i").test(q);
  }

  function answer(text) {
    const q = text.toLowerCase().trim();
    let best = null, bestScore = 0;

    for (const intent of INTENTS) {
      let score = 0;
      for (const k of intent.keys) {
        if (keyMatches(q, k)) score += k.length > 4 ? 2 : 1;
      }
      // greeting only wins when message is short
      if (intent.exact && q.split(/\s+/).length > 4) score = 0;
      if (score > bestScore) { bestScore = score; best = intent; }
    }
    return best ? best.reply() : FALLBACK();
  }

  /* ---------- Suggestions ---------- */
  const SUGGESTIONS = [
    "What's his education?",
    "What software does he use?",
    "Tell me about the hydrogen project",
    "What internships has he done?",
    "Any publications?",
    "How can I contact him?"
  ];

  SUGGESTIONS.forEach(s => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = s;
    b.addEventListener("click", () => send(s));
    sugBox.appendChild(b);
  });

  /* ---------- Send flow ---------- */
  function send(text) {
    if (!text.trim()) return;
    addMsg(esc(text), "user");
    input.value = "";
    botReply(answer(text));
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    send(input.value);
  });

  /* ---------- Boot ---------- */
  const p = currentPersona();
  avatarEl.textContent = p.avatar;
  titleEl.textContent = p.title;
  botReply(p.greet, 600);
})();
