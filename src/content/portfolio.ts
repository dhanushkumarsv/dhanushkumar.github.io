/**
 * ─────────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT — the single file to edit.
 *  Every panel, the resume page, and the SEO metadata read from here.
 * ─────────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "Dhanush Kumar S V",
  role: "Process Engineer",
  discipline: "Chemical Engineering · Graduate Researcher",
  location: "Taichung, Taiwan",
  email: "dhanushkumar795@gmail.com",
  phone: "+886-0909505486",
  photo: "/profile.jpg",
  summary:
    "Process engineer skilled in process simulation, optimization, and manufacturing improvement. Experienced in Aspen Plus, Aspen HYSYS, MATLAB and GAMS for modeling chemical processes — from hybrid membrane desalination to photocatalytic hydrogen production and supply-chain optimization.",
  availability:
    "Open to opportunities and collaborations in process engineering, simulation, and manufacturing optimization.",
  links: {
    github: "https://github.com/dhanushkumarsv",
    linkedin: "https://www.linkedin.com/in/dhanush-kumar-772274213",
    blog: "https://dhanushkumarsv.blogspot.com",
    website: "https://dhanushkumarsv.github.io",
  },
};

/* ── Research projects (Research Center) ─────────────────────── */

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  points: string[];
  metrics: { value: string; label: string }[];
  tags: string[];
}

export const projects: Project[] = [
  {
    id: "vmd-med",
    title: "Hybrid VMD-MED / MSF-MED Process Modeling",
    subtitle: "Phosphogypsum Wastewater Treatment",
    points: [
      "Designed a computational framework for phosphorus recovery and water purification using MEC-VMD-MED hybrid systems.",
      "Achieved 90% phosphorus removal efficiency and 99.99% salt rejection, producing high-quality reusable distillate.",
      "Reduced thermal energy consumption by 25–35% using effective latent heat reuse across multiple distillation effects.",
    ],
    metrics: [
      { value: "99.99%", label: "salt rejection" },
      { value: "90%", label: "P recovery" },
      { value: "−35%", label: "thermal energy" },
    ],
    tags: ["Membrane Distillation", "MED", "Desalination", "Modeling"],
  },
  {
    id: "glycerol",
    title: "Location Selection & Glycerol Purification Simulation",
    subtitle: "ArcGIS Pro & Aspen Plus Integration",
    points: [
      "Optimized plant location across 135 candidate sites in North Sulawesi using ArcGIS Pro, selecting Bitung City for logistics efficiency.",
      "Simulated a multi-stage purification train in Aspen Plus: HCl mixing, flash separation, and vacuum distillation.",
      "Achieved 97.16% glycerol purity from crude feedstock at 6,867 kg/h with an optimal distillate-to-feed ratio of 0.866.",
    ],
    metrics: [
      { value: "97.16%", label: "product purity" },
      { value: "6,867", label: "kg/h capacity" },
      { value: "135", label: "sites screened" },
    ],
    tags: ["Aspen Plus", "ArcGIS Pro", "Vacuum Distillation"],
  },
  {
    id: "hydrogen",
    title: "Breakthrough Hydrogen Production via Photocatalysis",
    subtitle: "Sustainable Energy Research",
    points: [
      "Designed and fabricated a 4 L trapezoidal acrylic photoreactor for solar-driven hydrogen production from sulphide wastewater.",
      "Achieved a maximum output of 300 mL/h per liter using activated TiO₂ catalyst under direct solar irradiation.",
      "Optimized process variables — 0.2 g catalyst dose and 0.2 M sulphide concentration — for peak reaction efficiency.",
    ],
    metrics: [
      { value: "300", label: "mL H₂ /h·L" },
      { value: "4 L", label: "photoreactor" },
      { value: "TiO₂", label: "catalyst" },
    ],
    tags: ["Green Hydrogen", "Photocatalysis", "Reactor Design"],
  },
  {
    id: "milp",
    title: "MILP Optimization of a Cooperative Dairy Supply Chain",
    subtitle: "GAMS & CPLEX Mathematical Modeling",
    points: [
      "Formulated a Mixed-Integer Linear Programming model in GAMS to minimize logistics costs across Tamil Nadu, India.",
      "Optimized a network of 10 villages and 5 bulk-milk coolers, reducing daily logistics cost to ₹12 million.",
      "Achieved 90% collection within strict 4-hour freshness windows while monitoring and reducing GHG emissions.",
    ],
    metrics: [
      { value: "₹12M", label: "daily cost optimum" },
      { value: "90%", label: "in 4 h windows" },
      { value: "15", label: "network nodes" },
    ],
    tags: ["MILP", "GAMS", "CPLEX", "Supply Chain"],
  },
];

/* ── Aspen Plus Laboratory — interactive flowsheet data ──────── */

export interface FlowsheetNode {
  id: string;
  label: string;
  kind: "feed" | "mixer" | "flash" | "column" | "product";
  detail: string;
  x: number; // 0–100 viewBox coordinates
  y: number;
}

export const aspenFlowsheet: {
  title: string;
  nodes: FlowsheetNode[];
  streams: { from: string; to: string; label?: string }[];
  results: { value: string; label: string }[];
} = {
  title: "Crude Glycerol Purification — Aspen Plus (RadFrac)",
  nodes: [
    {
      id: "feed",
      label: "CRUDE FEED",
      kind: "feed",
      detail:
        "Crude glycerol from biodiesel transesterification — 6,867 kg/h feed basis with methanol, water, salts and soap impurities.",
      x: 11,
      y: 55,
    },
    {
      id: "mixer",
      label: "HCl MIXER",
      kind: "mixer",
      detail:
        "Acidification with HCl splits soaps into free fatty acids and salts, preparing the crude for phase separation.",
      x: 32,
      y: 55,
    },
    {
      id: "flash",
      label: "FLASH DRUM",
      kind: "flash",
      detail:
        "Flash separation removes light ends — methanol and part of the water — before the tower, cutting reboiler duty downstream.",
      x: 52,
      y: 38,
    },
    {
      id: "column",
      label: "VACUUM TOWER",
      kind: "column",
      detail:
        "Vacuum distillation (RadFrac) at reduced pressure keeps glycerol below its decomposition temperature. Optimal distillate-to-feed ratio: 0.866.",
      x: 74,
      y: 50,
    },
    {
      id: "product",
      label: "GLYCEROL 97%",
      kind: "product",
      detail:
        "Purified glycerol at 97.16 wt% — technical grade, suitable for pharmaceutical-grade upgrading.",
      x: 89,
      y: 30,
    },
  ],
  streams: [
    { from: "feed", to: "mixer" },
    { from: "mixer", to: "flash" },
    { from: "flash", to: "column" },
    { from: "column", to: "product", label: "distillate" },
  ],
  results: [
    { value: "97.16%", label: "glycerol purity" },
    { value: "0.866", label: "D:F ratio" },
    { value: "6,867 kg/h", label: "throughput" },
  ],
};

export const simulationToolkit = [
  {
    tool: "Aspen Plus",
    use: "Flowsheeting, RadFrac columns, flash separation, sensitivity analysis, convergence troubleshooting",
  },
  {
    tool: "Aspen HYSYS",
    use: "Hydrocarbon and utility process modeling, thermodynamic package selection",
  },
  {
    tool: "GAMS / CPLEX",
    use: "MILP formulation — objective functions, constraints, network optimization",
  },
  {
    tool: "MATLAB",
    use: "Process models, parameter estimation, data reduction for experiments",
  },
];

/* ── Hydrogen Energy Plant — supply chain data ───────────────── */

export const hydrogenChain = {
  intro:
    "Two research threads converge here: solar photocatalytic hydrogen generation from sulphide wastewater, and mathematical supply-chain optimization — together a template for a green-hydrogen value chain.",
  steps: [
    {
      id: "solar",
      label: "Solar Input",
      detail: "Direct solar irradiation drives the photocatalytic reaction — no external power demand.",
    },
    {
      id: "reactor",
      label: "TiO₂ Photoreactor",
      detail: "4 L trapezoidal acrylic reactor; activated TiO₂ splits H₂S-laden wastewater, peaking at 300 mL H₂ per hour per liter.",
    },
    {
      id: "storage",
      label: "Storage",
      detail: "Buffered gas storage decouples intermittent solar production from steady demand.",
    },
    {
      id: "network",
      label: "Network Optimization",
      detail: "MILP methodology (GAMS/CPLEX) sites facilities and routes flows — proven on a 15-node dairy network with time-window constraints.",
    },
    {
      id: "demand",
      label: "Clean Demand",
      detail: "Delivered green hydrogen for fuel, feedstock, and grid balancing — with GHG emissions tracked along the chain.",
    },
  ],
  stats: [
    { value: "300 mL/h·L", label: "peak H₂ yield" },
    { value: "0.2 g", label: "optimal catalyst dose" },
    { value: "0.2 M", label: "sulphide concentration" },
    { value: "GHG ↓", label: "tracked emissions" },
  ],
};

/* ── Membrane Distillation Facility ──────────────────────────── */

export const membraneResearch = {
  intro:
    "Vacuum membrane distillation (VMD) hybridized with multi-effect distillation (MED) turns phosphogypsum leachate into reusable water — recovering phosphorus on the way.",
  mechanism: [
    "Hot saline feed flows across a hydrophobic membrane; only vapor crosses.",
    "Vacuum on the permeate side lowers the boiling point and drives flux.",
    "Latent heat is reused across MED effects, cutting thermal demand 25–35%.",
    "Non-volatile salts and phosphorus stay behind — 99.99% rejection.",
  ],
  stats: [
    { value: "99.99%", label: "salt rejection" },
    { value: "90%", label: "phosphorus removal" },
    { value: "25–35%", label: "energy saved" },
  ],
};

/* ── Distillation Tower — skills ─────────────────────────────── */

export interface SkillGroup {
  title: string;
  skills: { name: string; level: number }[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Process Simulation",
    skills: [
      { name: "Aspen Plus", level: 92 },
      { name: "Aspen HYSYS", level: 80 },
      { name: "MATLAB", level: 82 },
      { name: "GAMS / CPLEX", level: 78 },
    ],
  },
  {
    title: "Data & Analysis",
    skills: [
      { name: "Origin", level: 85 },
      { name: "Excel", level: 90 },
      { name: "ImageJ", level: 72 },
      { name: "Python", level: 55 },
    ],
  },
  {
    title: "Engineering Practice",
    skills: [
      { name: "Design of Experiments", level: 80 },
      { name: "Process Flow Reports", level: 88 },
      { name: "Technical Writing", level: 86 },
      { name: "ArcGIS Pro", level: 70 },
    ],
  },
  {
    title: "Process Integration",
    skills: [
      { name: "Electrochemical Coating", level: 74 },
      { name: "Surface Process Modeling", level: 72 },
      { name: "Yield Optimization", level: 84 },
      { name: "CFD Fundamentals", level: 68 },
    ],
  },
];

export const languages = [
  { name: "Tamil", level: "Native" },
  { name: "English", level: "Fluent" },
  { name: "Chinese", level: "Basic" },
];

/* ── Innovation Library — education, publications ────────────── */

export const education = [
  {
    degree: "M.S. in Chemical Engineering",
    school: "National Chung Hsing University",
    location: "Taichung, Taiwan",
    date: "2024 — Present",
    gpa: "GPA 3.95 / 4.3",
  },
  {
    degree: "B.Tech in Chemical Engineering",
    school: "Anna University",
    location: "Chennai, India",
    date: "2019 — 2023",
    gpa: "GPA 7.84 / 10",
  },
];

export const publications = [
  {
    venue: "ICATES 2024",
    title:
      "Location Selection and Purification Process Simulation for a Glycerol Plant",
    kind: "Conference Paper",
  },
  {
    venue: "ICATES 2023",
    title: "Production of Hydrogen Gas Using Photo-catalytic Method",
    kind: "Conference Paper",
  },
];

export const milestones = [
  "Graduate teaching assistant for process simulation (Aspen Plus) and optimization (GAMS) at NCHU.",
  "Two international conference presentations (ICATES 2023, 2024).",
  "Designed and fabricated a working 4 L solar photoreactor as an undergraduate.",
  "Cross-domain modeling: desalination, energy, logistics, and surface engineering.",
];

/* ── Control Room — experience dossier ───────────────────────── */

export const experience = [
  {
    role: "University Teaching Assistant",
    company: "National Chung Hsing University, Taiwan",
    date: "Sep 2025 — Dec 2025",
    points: [
      "Guided students in process simulation using Aspen Plus, troubleshooting modeling and convergence issues.",
      "Supported design and optimization of chemical processes through hands-on simulation exercises.",
      "Assisted in teaching optimization concepts using GAMS, including constraints and objective functions.",
    ],
  },
  {
    role: "Quality Assurance Trainee",
    company: "Steel Authority of India Limited (SAIL), Salem",
    date: "Oct 2022 — Nov 2022",
    points: [
      "Analyzed production data from hot and cold rolling lines to identify factors affecting steel yield and quality.",
      "Investigated manufacturing defects and contributed to root-cause analysis for process improvement.",
    ],
  },
  {
    role: "CFD Research Intern",
    company: "Indian Institute of Technology, Indore",
    date: "Nov 2021 — Jan 2022",
    points: [
      "Performed computational fluid dynamics analysis for chemical processes, learning parameter optimization and reporting techniques.",
    ],
  },
  {
    role: "Surface Coating Intern",
    company: "RK Metals",
    date: "Aug 2021",
    points: [
      "Studied electrochemical coating and metallization methods used in industrial surface treatment.",
      "Evaluated coating performance factors including thickness, adhesion, and corrosion resistance.",
    ],
  },
];

/** vCard payload for the “save contact” download. */
export function buildVCard(): string {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${profile.name}`,
    "N:S V;Dhanush Kumar;;;",
    `TITLE:${profile.role}`,
    `EMAIL;TYPE=INTERNET:${profile.email}`,
    `TEL;TYPE=CELL:${profile.phone}`,
    `ADR;TYPE=WORK:;;${profile.location};;;;`,
    `URL:${profile.links.website}`,
    `NOTE:${profile.discipline}`,
    "END:VCARD",
  ].join("\r\n");
}
