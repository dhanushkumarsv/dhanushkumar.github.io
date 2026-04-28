"use client";

import { motion } from "framer-motion";
import { Send, MapPin, Mail, Phone, Github, Linkedin, Globe, Book } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-background relative border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-foreground">Let's Connect</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            I am currently open to new opportunities and collaborations in process engineering and manufacturing optimization.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-accent/50 dark:bg-zinc-900/40 border border-border p-8 rounded-[2rem] flex items-start space-x-6 hover:bg-accent/80 dark:hover:bg-zinc-900/60 transition-colors group">
              <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl text-foreground mb-1">Location</h3>
                <p className="text-muted-foreground text-lg">Taichung, Taiwan</p>
              </div>
            </div>
            
            <div className="bg-accent/50 dark:bg-zinc-900/40 border border-border p-8 rounded-[2rem] flex items-start space-x-6 hover:bg-accent/80 dark:hover:bg-zinc-900/60 transition-colors group">
              <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl text-foreground mb-1">Email</h3>
                <a href="mailto:dhanushkumar795@gmail.com" className="text-muted-foreground text-lg hover:text-primary transition-colors">
                  dhanushkumar795@gmail.com
                </a>
              </div>
            </div>

            <div className="bg-accent/50 dark:bg-zinc-900/40 border border-border p-8 rounded-[2rem] flex items-start space-x-6 hover:bg-accent/80 dark:hover:bg-zinc-900/60 transition-colors group">
              <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl text-foreground mb-1">Phone</h3>
                <a href="tel:+8860909505486" className="text-muted-foreground text-lg hover:text-primary transition-colors">
                  +886-0909505486
                </a>
              </div>
            </div>

            <div className="pt-8 flex flex-wrap gap-6">
              <a 
                href="https://github.com/dhanushkumarsv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-5 bg-accent/50 dark:bg-zinc-900 border border-border rounded-2xl text-foreground hover:text-primary hover:border-primary/50 transition-all shadow-xl"
                title="GitHub"
              >
                <Github size={28} />
              </a>
              <a 
                href="https://www.linkedin.com/in/dhanush-kumar-772274213" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-5 bg-accent/50 dark:bg-zinc-900 border border-border rounded-2xl text-foreground hover:text-primary hover:border-primary/50 transition-all shadow-xl"
                title="LinkedIn"
              >
                <Linkedin size={28} />
              </a>
              <a 
                href="https://dhanushkumarsv.github.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-5 bg-accent/50 dark:bg-zinc-900 border border-border rounded-2xl text-foreground hover:text-primary hover:border-primary/50 transition-all shadow-xl"
                title="Portfolio"
              >
                <Globe size={28} />
              </a>
              <a 
                href="https://dhanushkumarsv.blogspot.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-5 bg-accent/50 dark:bg-zinc-900 border border-border rounded-2xl text-foreground hover:text-primary hover:border-primary/50 transition-all shadow-xl"
                title="Blog"
              >
                <Book size={28} />
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-accent/30 dark:bg-zinc-900/40 border border-border p-10 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full -ml-16 -mt-16" />
            
            <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-background border border-border rounded-xl px-6 py-4 text-foreground focus:outline-none focus:border-primary transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-background border border-border rounded-xl px-6 py-4 text-foreground focus:outline-none focus:border-primary transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Your Message</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-background border border-border rounded-xl px-6 py-4 text-foreground focus:outline-none focus:border-primary transition-all resize-none"
                    placeholder="Hello Dhanush..."
                  />
                </div>
              </div>
              
              <button className="w-full py-5 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-xl flex items-center justify-center group">
                Send Message
                <Send size={20} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
