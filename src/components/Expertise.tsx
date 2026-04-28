"use client";

import { motion } from "framer-motion";
import { Laptop, Cpu, LineChart, FileText } from "lucide-react";

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
  return (
    <section id="expertise" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4">Technical Expertise</h2>
          <p className="text-gray-500 max-w-2xl">
            My technical foundation bridges chemical engineering principles with advanced computational modeling and data analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-3xl group"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-primary/10 text-primary rounded-xl mr-4 group-hover:scale-110 transition-transform">
                  <category.icon size={24} />
                </div>
                <h3 className="text-2xl font-bold">{category.title}</h3>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {category.skills.map(skill => (
                  <span 
                    key={skill} 
                    className="px-4 py-2 bg-background/50 border border-border rounded-lg text-sm font-medium text-gray-300 hover:border-primary/50 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
