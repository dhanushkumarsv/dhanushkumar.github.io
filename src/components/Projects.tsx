"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Beaker, Factory, Zap, MapPin, X, BrainCircuit, Loader2 } from "lucide-react";

const projects = [
  {
    id: "glycerol-purification",
    title: "Location Selection & Glycerol Purification Simulation",
    subtitle: "ArcGIS Pro & Aspen Plus Integration",
    icon: MapPin,
    points: [
      "Optimized plant location across 135 sites in North Sulawesi using ArcGIS Pro, selecting Bitung City for logistics efficiency.",
      "Simulated a multi-stage purification process in Aspen Plus involving HCl mixing, flash separation, and vacuum distillation.",
      "Achieved 97.16% glycerol purity from crude feedstock, processing 6,867 kg/h with an optimal distillate-to-feed ratio of 0.866."
    ]
  },
  {
    id: "vmd-med",
    title: "Hybrid VMD-MED / MSF-MED Process Modeling",
    subtitle: "Phosphogypsum Wastewater Treatment",
    icon: Beaker,
    points: [
      "Designed a computational framework for phosphorus recovery and water purification using MEC-VMD-MED hybrid systems.",
      "Achieved 90% phosphorus removal efficiency and 99.99% salt rejection, producing high-quality reusable distillate.",
      "Reduced thermal energy consumption by 25-35% using effective latent heat reuse across multiple distillation effects."
    ]
  },
  {
    id: "gams-optimization",
    title: "MILP-Based Optimization of Cooperative Dairy Supply Chain",
    subtitle: "GAMS & CPLEX Mathematical Modeling",
    icon: Factory,
    points: [
      "Formulated a Mixed-Integer Linear Programming (MILP) model in GAMS to minimize logistics costs in Tamil Nadu, India.",
      "Optimized a network of 10 villages and 5 bulk milk coolers, reducing daily logistics costs to ₹12 million.",
      "Achieved 90% milk collection within strict 4-hour time windows while simultaneously monitoring and reducing GHG emissions."
    ]
  },
  {
    id: "hydrogen-production",
    title: "Breakthrough Hydrogen Production via Photocatalysis",
    subtitle: "Sustainable Energy Research",
    icon: Zap,
    points: [
      "Designed and fabricated a 4L trapezoidal acrylic photoreactor for solar-driven hydrogen production from sulphuric wastewater.",
      "Achieved a maximum output of 300 mL/h per liter using activated TiO2 catalyst under direct solar irradiation.",
      "Optimized process variables including 0.2g catalyst dose and 0.2M sulphide concentration for peak reaction efficiency."
    ]
  }
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenProjectAI = async (proj: typeof projects[0]) => {
    setSelectedProject(proj);
    setIsLoading(true);
    setAiAnalysis("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: `Dhanush worked on a project titled "${proj.title}". Subtitle: "${proj.subtitle}". Detailed points: ${proj.points.join(". ")}. Act as an expert reviewer and explain clearly the objective of this project, the results achieved (using numbers like 97.16% or ₹12 million), and the overall impact.` 
        })
      });
      const data = await res.json();
      setAiAnalysis(data.reply);
    } catch (error) {
      setAiAnalysis("Error connecting to AI. Please ensure GEMINI_API_KEY is set in Vercel.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="projects" className="py-24 bg-background relative border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-foreground">Research & Projects</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Technical initiatives combining computational modeling, process simulation, and experimental validation to solve complex engineering challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((proj, i) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-accent/30 dark:bg-zinc-900/30 border border-border p-8 md:p-10 rounded-[2.5rem] group hover:bg-accent/50 dark:hover:bg-zinc-900/50 transition-all duration-500 relative overflow-hidden flex flex-col h-full shadow-sm"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-32 -mt-32" />
              
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="w-16 h-16 bg-background dark:bg-zinc-800 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-black/5">
                  <proj.icon size={32} />
                </div>
                <button 
                  onClick={() => handleOpenProjectAI(proj)}
                  className="p-3 bg-background dark:bg-zinc-800 text-primary border border-border rounded-xl hover:bg-primary hover:text-white transition-all shadow-md flex items-center gap-2 group/ai"
                >
                  <BrainCircuit size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">AI Deep Dive</span>
                </button>
              </div>
              
              <div className="flex-grow relative z-10">
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
                  {proj.title}
                </h3>
                <p className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-6">{proj.subtitle}</p>
                
                <ul className="space-y-4">
                  {proj.points.map((point, j) => (
                    <li key={j} className="text-muted-foreground text-sm leading-relaxed flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mr-3 mt-1.5 flex-shrink-0" />
                      <p>{point}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50 relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Chemical Engineering</span>
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/80 dark:bg-black/95 backdrop-blur-2xl" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-2xl bg-background dark:bg-zinc-900 border border-border rounded-[3rem] p-10 md:p-12 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-10 right-10 p-3 rounded-full bg-accent dark:bg-zinc-800 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="mb-10">
                <div className="flex items-center text-primary mb-4">
                  <BrainCircuit size={32} className="mr-3" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">AI Research Insights</span>
                </div>
                <h4 className="text-3xl font-bold text-foreground mb-1 leading-tight tracking-tight">{selectedProject.title}</h4>
                <p className="text-primary font-bold text-sm uppercase tracking-widest">{selectedProject.subtitle}</p>
              </div>
              
              <div className="text-foreground dark:text-zinc-300 text-lg leading-relaxed space-y-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 size={48} className="animate-spin text-primary mb-6" />
                    <p className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-[0.2em]">Synthesizing Project Impact...</p>
                  </div>
                ) : (
                  <div className="prose dark:prose-invert prose-lg max-w-none">
                    <p>{aiAnalysis}</p>
                  </div>
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-border flex justify-end">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl shadow-primary/20"
                >
                  Close Insights
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
