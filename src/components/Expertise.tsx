"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, X } from "lucide-react";

const skills = [
  { id: "aspen", title: "Aspen Plus", desc: "Advanced process simulation for chemical manufacturing." },
  { id: "gams", title: "GAMS", desc: "Mathematical optimization and modeling." },
  { id: "optimization", title: "Optimization", desc: "Improving process efficiency and yield." },
  { id: "supply-chain", title: "Supply Chain", desc: "Logistics and raw material procurement modeling." },
  { id: "wastewater", title: "Wastewater Treatment", desc: "VMD-MED & MSF-MED process modeling." },
  { id: "hydrogen", title: "Hydrogen Systems", desc: "Photocatalytic reactor design for sustainable energy." },
];

export default function Expertise() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const activeSkill = skills.find(s => s.id === selectedSkill);

  const handleOpenModal = async (skillId: string) => {
    setSelectedSkill(skillId);
    const skill = skills.find(s => s.id === skillId);
    if (!skill) return;

    setIsLoading(true);
    setAiExplanation("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Explain Dhanush's expertise in ${skill.title} in 2-3 short sentences.` })
      });
      const data = await res.json();
      setAiExplanation(data.reply);
    } catch (error) {
      setAiExplanation("Error connecting to AI. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="expertise" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4">Core Expertise</h2>
          <p className="text-gray-500 max-w-2xl">
            My technical foundation bridges chemical engineering principles with advanced computational modeling. 
            Click any skill to launch the AI explainer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleOpenModal(skill.id)}
              className="glass-card p-8 rounded-2xl cursor-pointer hover:border-primary/50 transition-all group"
            >
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{skill.title}</h3>
              <p className="text-sm text-gray-500 mb-6">{skill.desc}</p>
              <div className="flex items-center text-xs font-semibold text-primary/80 group-hover:text-primary">
                <BrainCircuit size={14} className="mr-2" /> AI Explanation
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedSkill && activeSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSkill(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glass-card rounded-3xl p-8 shadow-2xl z-10"
            >
              <button 
                onClick={() => setSelectedSkill(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-accent transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center mb-6 text-primary">
                <BrainCircuit size={28} className="mr-3" />
                <h3 className="text-2xl font-heading font-bold">AI Explainer</h3>
              </div>
              
              <h4 className="text-xl font-semibold mb-4">{activeSkill.title}</h4>
              
              <div className="text-gray-400">
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="h-4 w-3/4 bg-border/50 rounded animate-pulse" />
                    <div className="h-4 w-full bg-border/50 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-border/50 rounded animate-pulse" />
                    <p className="text-sm text-primary animate-pulse pt-4">Gemini AI is thinking...</p>
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
