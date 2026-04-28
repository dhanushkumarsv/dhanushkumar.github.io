"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Beaker, Factory, Zap } from "lucide-react";

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
  return (
    <section id="projects" className="py-24 bg-accent/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4">Research & Projects</h2>
          <p className="text-gray-500 max-w-2xl">
            Applying chemical engineering principles and process simulation to solve complex industrial and environmental challenges.
          </p>
        </div>

        <div className="space-y-8">
          {projects.map((proj, i) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 md:p-10 rounded-3xl group hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform">
                    <proj.icon size={32} />
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{proj.title}</h3>
                      <p className="text-primary font-medium text-sm">{proj.subtitle}</p>
                    </div>
                    <button className="hidden md:flex items-center text-sm font-semibold text-gray-500 hover:text-primary transition-colors">
                      Details <ArrowUpRight size={16} className="ml-1" />
                    </button>
                  </div>
                  
                  <ul className="space-y-3">
                    {proj.points.map((point, j) => (
                      <li key={j} className="text-gray-400 text-sm md:text-base leading-relaxed flex items-start">
                        <span className="text-primary mr-3 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-primary" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
