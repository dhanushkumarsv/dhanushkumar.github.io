"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText, Sparkles, Loader2, Download } from "lucide-react";

const roles = [
  "Process Engineer",
  "Chemical Engineer",
  "Supply Chain Analyst",
  "Research Assistant"
];

interface TailoredResume {
  title: string;
  summary: string;
  skills: string[];
}

export default function Resume() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeData, setResumeData] = useState<TailoredResume | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResumeData(null);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole })
      });
      const data = await res.json();
      if (data.success) setResumeData(data.resumeData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="resume" className="py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-10 md:p-16 relative overflow-hidden"
        >
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-10" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -z-10" />

          <div className="inline-flex items-center justify-center p-4 bg-background rounded-full mb-8 shadow-inner">
            <FileText size={32} className="text-primary" />
          </div>

          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
            AI-Tailored Resume
          </h2>
          <p className="text-gray-500 mb-10 max-w-xl mx-auto text-lg">
            Select a target role below. The AI will dynamically rebuild my resume, emphasizing the most relevant skills, projects, and experiences for that specific position.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20">
            {/* Custom Dropdown */}
            <div className="relative w-full sm:w-64">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-background border border-border px-4 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <span>{selectedRole}</span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 w-full mt-2 bg-background border border-border rounded-xl shadow-xl overflow-hidden"
                  >
                    {roles.map(role => (
                      <button
                        key={role}
                        onClick={() => {
                          setSelectedRole(role);
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-accent transition-colors font-medium border-b border-border/50 last:border-0"
                      >
                        {role}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 group"
            >
              {isGenerating ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Sparkles size={18} className="mr-2 group-hover:animate-pulse" />}
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>
          
          <div className="mt-8 text-sm text-gray-400 flex items-center justify-center">
            <span>Powered by Gemini API</span>
          </div>

          {/* Generated Resume Output */}
          <AnimatePresence>
            {resumeData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-12 text-left bg-background/80 rounded-2xl p-8 border border-border shadow-inner"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold font-heading text-primary mb-1">{resumeData.title}</h3>
                    <p className="text-sm text-gray-400">Dhanush Kumar S V</p>
                  </div>
                  <button className="p-2 bg-accent rounded-full hover:bg-border transition-colors">
                    <Download size={18} />
                  </button>
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-6">{resumeData.summary}</p>
                
                <h4 className="font-semibold mb-3">Key Targeted Skills:</h4>
                <ul className="grid grid-cols-2 gap-3">
                  {resumeData.skills.map((skill, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-400 before:content-[''] before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full before:mr-2">
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </section>
  );
}
