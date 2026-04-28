"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Beaker, Factory, Zap, X, BrainCircuit, Loader2 } from "lucide-react";

const projects = [
  {
    id: "vmd-med",
    title: "Hybrid VMD-MED / MSF-MED Process Modeling",
    subtitle: "Phosphogypsum Wastewater Treatment",
    icon: Beaker,
    points: [
      "Modeled hybrid VMD-MED and MSF-MED systems for phosphogypsum wastewater purification using process simulation.",
      "Integrated microbial electrochemical cell (MEC) for enhanced phosphorus recovery and energy-efficient treatment.",
      "Performed process optimization and energy analysis to improve water recovery, phosphorus yield, and overall system efficiency."
    ]
  },
  {
    id: "gams-optimization",
    title: "MILP-Based Optimization of Cooperative Dairy Milk Supply Chain",
    subtitle: "Supply Chain Integration",
    icon: Factory,
    points: [
      "Formulated a GAMS-based MILP model for integrated village-BMC-plant milk procurement under capacity, flow balance, and service constraints.",
      "Conducted sensitivity and scenario analyses on BMC capacity and penalty parameters to evaluate cost-service trade-offs.",
      "Achieved ~17% total cost reduction, up to ~30% decrease in unserved milk, and identified key capacity thresholds."
    ]
  },
  {
    id: "hydrogen-production",
    title: "Hydrogen Production using the Photocatalytic Method",
    subtitle: "Sustainable Energy Generation",
    icon: Zap,
    points: [
      "Designed and built a 4 L trapezoidal photocatalytic reactor for solar-driven hydrogen production from sulphuric wastewater.",
      "Achieved ~300 mL h-1 L-1 hydrogen production using TiO2 photocatalyst under direct sunlight.",
      "Optimized catalyst loading and sulphide concentration to maximize hydrogen yield and process efficiency."
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
          message: `Dhanush worked on a project titled "${proj.title}". Subtitle: "${proj.subtitle}". Detailed points: ${proj.points.join(". ")}. Act as an expert reviewer and explain clearly the objective of this project, the results achieved, and the overall impact of this work.` 
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
    <section id="projects" className="py-24 bg-black relative border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white text-center">Research & Projects</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg text-center leading-relaxed">
            A selection of my core research initiatives, combining experimental validation with advanced process simulation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10">
          {projects.map((proj, i) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900/30 border border-zinc-800 p-8 md:p-12 rounded-[2.5rem] group hover:bg-zinc-900/50 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-32 -mt-32" />
              
              <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-800 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl">
                    <proj.icon size={32} />
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight group-hover:text-primary transition-colors">{proj.title}</h3>
                      <p className="text-zinc-500 font-medium text-lg">{proj.subtitle}</p>
                    </div>
                    <button 
                      onClick={() => handleOpenProjectAI(proj)}
                      className="inline-flex items-center px-6 py-3 bg-white text-black rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-lg"
                    >
                      AI Analysis <ArrowUpRight size={18} className="ml-2" />
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-1 gap-4">
                    {proj.points.map((point, j) => (
                      <div key={j} className="flex items-start text-zinc-400 text-base md:text-lg leading-relaxed">
                        <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary mr-4 flex-shrink-0" />
                        <p>{point}</p>
                      </div>
                    ))}
                  </div>
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
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 md:p-14 shadow-2xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-10 right-10 p-3 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="mb-10">
                <div className="flex items-center text-primary mb-4">
                  <BrainCircuit size={32} className="mr-3" />
                  <span className="text-sm font-black uppercase tracking-[0.3em]">AI Research Review</span>
                </div>
                <h4 className="text-3xl font-bold text-white mb-2 leading-tight tracking-tight">{selectedProject.title}</h4>
                <p className="text-zinc-500 text-lg font-medium">{selectedProject.subtitle}</p>
              </div>
              
              <div className="text-zinc-300 text-lg leading-relaxed space-y-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 size={48} className="animate-spin text-primary mb-6" />
                    <p className="text-sm font-bold text-zinc-500 animate-pulse uppercase tracking-[0.2em]">Deep Learning Analysis in Progress...</p>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-lg max-w-none">
                    <p>{aiAnalysis}</p>
                  </div>
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-zinc-800 flex justify-between items-center">
                <p className="text-xs text-zinc-600 font-medium italic">Analyzed by Gemini Pro v2.0</p>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-primary/20"
                >
                  Close Detailed View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
