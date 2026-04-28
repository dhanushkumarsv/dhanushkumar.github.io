"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Laptop, Cpu, LineChart, FileText, BrainCircuit, X, Loader2 } from "lucide-react";

const skillCategories = [
  {
    title: "Process Simulation",
    icon: Laptop,
    skills: ["Aspen Plus", "Aspen HYSYS", "MATLAB", "GAMS"]
  },
  {
    title: "Process Integration",
    icon: Cpu,
    skills: ["Electrochemical coating", "Surface process modeling", "Yield optimization"]
  },
  {
    title: "Data Analysis",
    icon: LineChart,
    skills: ["Origin", "Excel", "ImageJ", "Python (basic)"]
  },
  {
    title: "Documentation",
    icon: FileText,
    skills: ["Process flow reports", "Design of experiments", "Technical writing"]
  }
];

export default function Expertise() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenAI = async (skill: string) => {
    setSelectedSkill(skill);
    setIsLoading(true);
    setAiExplanation("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: `Explain Dhanush's expertise in "${skill}". Tell what it is, where it is used, and specifically what Dhanush does with it in his chemical engineering projects.` 
        })
      });
      const data = await res.json();
      setAiExplanation(data.reply);
    } catch (error) {
      setAiExplanation("Error connecting to AI. Please ensure GEMINI_API_KEY is set in Vercel.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="expertise" className="py-24 bg-zinc-950 relative border-y border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">Technical Expertise</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
            A comprehensive overview of my technical capabilities in chemical engineering, computational modeling, and research methodology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900/40 border border-zinc-800 p-10 rounded-[2rem] hover:bg-zinc-900/60 transition-all duration-300 group"
            >
              <div className="flex items-center mb-8">
                <div className="p-4 bg-zinc-800 text-primary rounded-2xl mr-5 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-black/20">
                  <category.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{category.title}</h3>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {category.skills.map(skill => (
                  <button 
                    key={skill} 
                    onClick={() => handleOpenAI(skill)}
                    className="px-5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-medium text-zinc-300 hover:border-primary/60 hover:text-primary transition-all flex items-center group/btn shadow-sm"
                  >
                    {skill}
                    <div className="ml-2 w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover/btn:bg-primary transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSkill(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full -mr-16 -mt-16" />
              
              <button 
                onClick={() => setSelectedSkill(null)}
                className="absolute top-8 right-8 p-2.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center mb-8">
                <div className="p-3 bg-primary/10 text-primary rounded-xl mr-4">
                  <BrainCircuit size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-1">AI Insights</p>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{selectedSkill}</h3>
                </div>
              </div>
              
              <div className="text-zinc-300 text-lg leading-relaxed min-h-[120px]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Loader2 size={40} className="animate-spin text-primary mb-6" />
                    <p className="text-sm font-medium text-zinc-500 animate-pulse uppercase tracking-widest">Generating Analysis...</p>
                  </div>
                ) : (
                  <p>{aiExplanation}</p>
                )}
              </div>

              <div className="mt-10 pt-8 border-t border-zinc-800 flex justify-end">
                <button 
                  onClick={() => setSelectedSkill(null)}
                  className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-colors"
                >
                  Close Analysis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
