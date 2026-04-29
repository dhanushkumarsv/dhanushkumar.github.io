"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, MapPin, Mail, Phone, Github, Linkedin, Globe, Book, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [isSubmitting, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "YOUR_ACCESS_KEY_HERE"); // Placeholder, user will need to replace this

    try {
      // For now, we simulate success so the user sees the UI working
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8 relative z-10" 
                  onSubmit={handleSubmit}
                >
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Full Name</label>
                      <input 
                        name="name"
                        type="text" 
                        required
                        className="w-full bg-background border border-border rounded-xl px-6 py-4 text-foreground focus:outline-none focus:border-primary transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Email Address</label>
                      <input 
                        name="email"
                        type="email" 
                        required
                        className="w-full bg-background border border-border rounded-xl px-6 py-4 text-foreground focus:outline-none focus:border-primary transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Your Message</label>
                      <textarea 
                        name="message"
                        rows={4}
                        required
                        className="w-full bg-background border border-border rounded-xl px-6 py-4 text-foreground focus:outline-none focus:border-primary transition-all resize-none"
                        placeholder="Hello Dhanush..."
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-xl flex items-center justify-center group disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin mr-3" size={20} />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={20} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={40} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                  </div>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="text-primary font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
