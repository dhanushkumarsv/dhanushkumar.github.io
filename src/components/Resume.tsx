"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase, BookOpen, Languages } from "lucide-react";

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
  return (
    <section id="resume" className="py-24 bg-accent/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4">Resume & Experience</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            A timeline of my academic background and professional training in chemical engineering.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column: Education & Misc */}
          <div className="space-y-12">
            <div>
              <div className="flex items-center mb-8">
                <GraduationCap size={28} className="text-primary mr-4" />
                <h3 className="text-3xl font-heading font-bold">Education</h3>
              </div>
              <div className="space-y-6">
                {education.map((edu, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="glass-card p-6 rounded-2xl border-l-4 border-l-primary"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold">{edu.school}</h4>
                      <span className="text-sm px-3 py-1 bg-accent rounded-full text-accent-foreground font-medium whitespace-nowrap ml-4">{edu.date}</span>
                    </div>
                    <p className="text-primary font-medium mb-1">{edu.degree}</p>
                    <div className="flex justify-between items-center text-sm text-gray-400 mt-4">
                      <span>{edu.location}</span>
                      <span className="font-semibold text-gray-300">{edu.gpa}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex items-center mb-4 text-primary">
                  <BookOpen size={20} className="mr-2" />
                  <h4 className="font-bold">Publications</h4>
                </div>
                <ul className="space-y-4 text-sm text-gray-400">
                  <li className="leading-relaxed">
                    <span className="text-gray-300 font-medium block">ICATES 2024</span>
                    "Location Selection and Purification Process Simulation for a Glycerol Plant."
                  </li>
                  <li className="leading-relaxed">
                    <span className="text-gray-300 font-medium block">ICATES 2023</span>
                    "Production of Hydrogen Gas Using Photo-catalytic Method."
                  </li>
                </ul>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex items-center mb-4 text-primary">
                  <Languages size={20} className="mr-2" />
                  <h4 className="font-bold">Languages</h4>
                </div>
                <ul className="space-y-3">
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-300">English</span>
                    <span className="text-gray-500">Fluent</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-300">Tamil</span>
                    <span className="text-gray-500">Native</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-300">Chinese</span>
                    <span className="text-gray-500">Basic</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Internships */}
          <div>
            <div className="flex items-center mb-8">
              <Briefcase size={28} className="text-primary mr-4" />
              <h3 className="text-3xl font-heading font-bold">Internships</h3>
            </div>
            <div className="space-y-6">
              {internships.map((intern, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="glass-card p-8 rounded-2xl relative overflow-hidden group hover:border-primary/50 transition-colors"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/10 transition-colors" />
                  <div className="relative z-10">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-100">{intern.role}</h4>
                        <p className="text-primary font-medium mt-1">{intern.company}</p>
                      </div>
                      <span className="text-sm px-3 py-1 bg-accent/50 rounded-full text-gray-300 whitespace-nowrap">{intern.date}</span>
                    </div>
                    <ul className="space-y-2 mt-6">
                      {intern.points.map((point, j) => (
                        <li key={j} className="text-gray-400 text-sm leading-relaxed flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          {point}
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
    </section>
  );
}
