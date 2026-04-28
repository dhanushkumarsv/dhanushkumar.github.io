"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-accent text-accent-foreground text-sm font-medium tracking-wide">
            Chemical Engineering Graduate
          </span>
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold leading-tight">
            Engineering <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-300">
              Sustainable
            </span>{" "}
            Processes.
          </h1>
          <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
            I am Dhanush Kumar S V, specializing in Process Simulation, Integration, and Data Analysis to optimize supply chains and advance green technologies.
          </p>
          <div className="flex gap-4 pt-4">
            <a href="#projects" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
              View Projects
            </a>
            <a href="#contact" className="glass px-8 py-3 rounded-lg font-medium hover:bg-accent/50 transition-colors">
              Contact Me
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          {/* Real user profile image */}
          <div className="relative w-full aspect-[4/5] rounded-3xl glass-card overflow-hidden border border-border group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-10" />
            <Image
              src="/profile.jpg"
              alt="Dhanush Kumar S V"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
