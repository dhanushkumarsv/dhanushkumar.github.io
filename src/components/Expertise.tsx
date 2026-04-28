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
    <section id="expertise" className="py-24 bg-black/40 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-heading font-bold mb-4">Technical Expertise</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            My technical foundation bridges chemical engineering principles with advanced computational modeling. Click any skill for an AI-powered breakdown.
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
              className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl group"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-primary/20 text-primary rounded-xl mr-4 group-hover:scale-110 transition-transform">
                  <category.icon size={24} />
                </div>
                <h3 className="text-2xl font-bold">{category.title}</h3>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {category.skills.map(skill => (
                  <button 
                    key={skill} 
                    onClick={() => handleOpenAI(skill)}
                    className="px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm font-medium text-gray-300 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center group/btn"
                  >
                    {skill}
                    <BrainCircuit size={14} className="ml-2 opacity-0 group-hover/btn:opacity-100 transition-opacity text-primary" />
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
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl z-10"
            >
              <button 
                onClick={() => setSelectedSkill(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center mb-6 text-primary">
                <BrainCircuit size={28} className="mr-3" />
                <h3 className="text-2xl font-heading font-bold">Skill Breakdown</h3>
              </div>
              
              <h4 className="text-xl font-semibold mb-4 text-white">{selectedSkill}</h4>
              
              <div className="text-gray-400 min-h-[100px]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 size={32} className="animate-spin text-primary mb-4" />
                    <p className="text-sm animate-pulse">AI is analyzing expertise...</p>
                  </div>
                ) : (
                  <p className="leading-relaxed">{aiExplanation}</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
