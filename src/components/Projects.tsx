"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: "green-hydrogen",
    title: "Green Hydrogen Supply Chain",
    tags: ["Optimization", "Supply Chain", "Sustainability"],
    desc: "A comprehensive model optimizing the production, storage, and distribution of green hydrogen from renewable sources.",
  },
  {
    id: "phosphoric-acid",
    title: "Phosphoric Acid Removal",
    tags: ["Wastewater", "Chemical Process"],
    desc: "Simulation and experimental validation of efficient phosphoric acid extraction from industrial wastewater streams.",
  },
  {
    id: "membrane",
    title: "Membrane Distillation",
    tags: ["VMD-MED", "Simulation", "Aspen Plus"],
    desc: "Hybrid VMD-MED modeling to maximize freshwater recovery while minimizing specific thermal energy consumption.",
  },
  {
    id: "biological",
    title: "Biological Phosphorus Removal",
    tags: ["MEC", "Integration"],
    desc: "Integrating Microbial Electrochemical Cells (MEC) into traditional treatment plants for enhanced phosphorus recovery.",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 bg-accent/20 border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-heading font-bold mb-4">Featured Projects</h2>
            <p className="text-gray-500 max-w-xl">
              Applying chemical engineering principles and process simulation to solve complex industrial and environmental challenges.
            </p>
          </div>
          <button className="text-primary font-medium flex items-center hover:opacity-80 transition-opacity">
            View All Research <ArrowUpRight size={20} className="ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj, i) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative glass-card p-8 rounded-3xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <button className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
                  <ArrowUpRight size={24} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {proj.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs font-medium bg-background rounded-full border border-border">
                    {tag}
                  </span>
                ))}
              </div>
              
              <h3 className="text-2xl font-bold mb-4 pr-12">{proj.title}</h3>
              <p className="text-gray-500 leading-relaxed mb-6">{proj.desc}</p>
              
              <div className="inline-flex items-center text-sm font-medium text-primary cursor-pointer hover:underline">
                Read Case Study
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
