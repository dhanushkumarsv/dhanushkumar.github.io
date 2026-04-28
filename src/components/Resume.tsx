"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Briefcase, BookOpen, Languages, BrainCircuit, X, Loader2, ArrowUpRight } from "lucide-react";

const education = [
  {
    degree: "M.S. in Chemical Engineering",
    school: "National Chung Hsing University",
    location: "Taichung, Taiwan",
    date: "2024 - Present",
    gpa: "GPA: 3.95/4.3"
  },
  {
    degree: "B.Tech in Chemical Engineering",
    school: "Anna University",
    location: "Chennai, India",
    date: "2019 - 2023",
    gpa: "GPA: 7.84/10"
  }
];

const internships = [
  {
    role: "University Teaching Assistant",
    company: "National Chung Hsing University, Taiwan",
    date: "Sep 2025 - Dec 2025",
    points: [
      "Guided students in process simulation using Aspen Plus, troubleshooting modeling and convergence issues.",
      "Supported design and optimization of chemical processes through hands-on simulation exercises.",
      "Assisted in teaching optimization concepts using GAMS, including constraints and objective functions."
    ]
  },
  {
    role: "Quality Assurance Trainee",
    company: "Steel Authority of India Limited (SAIL), Salem",
    date: "Oct 2022 - Nov 2022",
    points: [
      "Analyzed production data from hot and cold rolling lines to identify factors affecting steel yield and quality.",
      "Investigated manufacturing defects and contributed to root cause analysis for process improvement."
    ]
  },
  {
    role: "CFD Research Intern",
    company: "Indian Institute of Technology, Indore",
    date: "Nov 2021 - Jan 2022",
    points: [
      "Performed computational fluid dynamics analysis for chemical processes, learning parameter optimization and reporting techniques."
    ]
  },
  {
    role: "Surface Coating Intern",
    company: "RK Metals",
    date: "Aug 2021",
    points: [
      "Studied electrochemical coating and metallization methods used in industrial surface treatment.",
      "Evaluated coating performance factors including thickness, adhesion, and corrosion resistance."
    ]
  }
];

export default function Resume() {
  const [selectedInternship, setSelectedInternship] = useState<typeof internships[0] | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenInternAI = async (intern: typeof internships[0]) => {
    setSelectedInternship(intern);
    setIsLoading(true);
    setAiAnalysis("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: `Dhanush completed an internship as a "${intern.role}" at "${intern.company}". Key responsibilities: ${intern.points.join(". ")}. Explain why this experience is valuable for a professional process engineer and what specific high-level technical skills Dhanush likely gained.` 
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
    <section id="resume" className="py-24 bg-background relative border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-foreground">Resume & Experience</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            A comprehensive timeline of my academic background and professional training in chemical engineering.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column: Education & Misc */}
          <div className="space-y-12">
            <div>
              <div className="flex items-center mb-10">
                <div className="p-3 bg-primary/10 text-primary rounded-xl mr-5">
                  <GraduationCap size={28} />
                </div>
                <h3 className="text-3xl font-heading font-bold text-foreground tracking-tight">Education</h3>
              </div>
              <div className="space-y-6">
                {education.map((edu, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="bg-accent/30 dark:bg-zinc-900/40 border border-border p-8 rounded-[2rem] border-l-4 border-l-primary hover:bg-accent/50 dark:hover:bg-zinc-900/60 transition-colors group shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{edu.school}</h4>
                        <p className="text-primary font-bold text-sm uppercase tracking-widest mt-1">{edu.degree}</p>
                      </div>
                      <span className="text-xs px-4 py-1.5 bg-background dark:bg-zinc-800 border border-border rounded-full text-muted-foreground font-bold whitespace-nowrap">{edu.date}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground pt-4 border-t border-border/50">
                      <span>{edu.location}</span>
                      <span className="font-black text-foreground">{edu.gpa}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-accent/30 dark:bg-zinc-900/40 border border-border p-8 rounded-[2rem] shadow-sm"
              >
                <div className="flex items-center mb-6 text-primary">
                  <BookOpen size={24} className="mr-3" />
                  <h4 className="font-bold uppercase tracking-widest text-xs">Publications</h4>
                </div>
                <ul className="space-y-6 text-sm">
                  <li className="leading-relaxed">
                    <span className="text-foreground font-bold block mb-1">ICATES 2024</span>
                    <p className="text-muted-foreground">"Location Selection and Purification Process Simulation for a Glycerol Plant."</p>
                  </li>
                  <li className="leading-relaxed">
                    <span className="text-foreground font-bold block mb-1">ICATES 2023</span>
                    <p className="text-muted-foreground">"Production of Hydrogen Gas Using Photo-catalytic Method."</p>
                  </li>
                </ul>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="bg-accent/30 dark:bg-zinc-900/40 border border-border p-8 rounded-[2rem] shadow-sm"
              >
                <div className="flex items-center mb-6 text-primary">
                  <Languages size={24} className="mr-3" />
                  <h4 className="font-bold uppercase tracking-widest text-xs">Languages</h4>
                </div>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-foreground font-bold">English</span>
                    <span className="text-muted-foreground text-xs font-bold uppercase">Fluent</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-foreground font-bold">Tamil</span>
                    <span className="text-muted-foreground text-xs font-bold uppercase">Native</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-foreground font-bold">Chinese</span>
                    <span className="text-muted-foreground text-xs font-bold uppercase">Basic</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Internships */}
          <div>
            <div className="flex items-center mb-10">
              <div className="p-3 bg-primary/10 text-primary rounded-xl mr-5">
                <Briefcase size={28} />
              </div>
              <h3 className="text-3xl font-heading font-bold text-foreground tracking-tight">Internships</h3>
            </div>
            <div className="space-y-6">
              {internships.map((intern, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-accent/30 dark:bg-zinc-900/40 border border-border p-8 rounded-[2.5rem] relative overflow-hidden group hover:bg-accent/50 dark:hover:bg-zinc-900/50 transition-all duration-500 shadow-sm"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/10 transition-colors" />
                  <div className="relative z-10">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                      <div className="flex-grow">
                        <h4 className="text-2xl font-bold text-foreground mb-1 tracking-tight group-hover:text-primary transition-colors">{intern.role}</h4>
                        <p className="text-primary font-black text-xs uppercase tracking-[0.2em]">{intern.company}</p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <span className="text-[10px] font-black px-3 py-1 bg-background dark:bg-zinc-800 border border-border rounded-full text-muted-foreground uppercase tracking-widest">{intern.date}</span>
                        <button 
                          onClick={() => handleOpenInternAI(intern)}
                          className="p-2 bg-background dark:bg-zinc-800 text-primary border border-border rounded-lg hover:bg-primary hover:text-white transition-all shadow-md group/btn"
                          title="AI Experience Analysis"
                        >
                          <BrainCircuit size={18} />
                        </button>
                      </div>
                    </div>
                    <ul className="space-y-4">
                      {intern.points.map((point, j) => (
                        <li key={j} className="text-muted-foreground text-base leading-relaxed flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3 mt-2 flex-shrink-0" />
                          <p>{point}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedInternship && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInternship(null)}
              className="absolute inset-0 bg-black/60 dark:bg-black/95 backdrop-blur-2xl" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-2xl bg-background dark:bg-zinc-900 border border-border rounded-[3rem] p-10 md:p-12 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedInternship(null)}
                className="absolute top-10 right-10 p-3 rounded-full bg-accent dark:bg-zinc-800 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="mb-10">
                <div className="flex items-center text-primary mb-4">
                  <BrainCircuit size={32} className="mr-3" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">AI Experience Insights</span>
                </div>
                <h4 className="text-3xl font-bold text-foreground mb-1 leading-tight tracking-tight">{selectedInternship.role}</h4>
                <p className="text-primary font-bold text-sm uppercase tracking-widest">{selectedInternship.company}</p>
              </div>
              
              <div className="text-foreground dark:text-zinc-300 text-lg leading-relaxed space-y-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 size={48} className="animate-spin text-primary mb-6" />
                    <p className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-[0.2em]">Analyzing Career Impact...</p>
                  </div>
                ) : (
                  <div className="prose dark:prose-invert prose-lg max-w-none">
                    <p>{aiAnalysis}</p>
                  </div>
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-border flex justify-end">
                <button 
                  onClick={() => setSelectedInternship(null)}
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
