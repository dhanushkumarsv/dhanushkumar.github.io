export default function Footer() {
  return (
    <footer className="py-16 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="font-heading font-bold text-3xl text-foreground mb-2">DK<span className="text-primary">.</span></h2>
            <p className="text-muted-foreground text-lg">Dhanush Kumar S V | Chemical Engineer</p>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/dhanushkumarsv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center bg-accent/50 dark:bg-zinc-900 border border-border rounded-xl text-muted-foreground hover:text-primary transition-all shadow-lg"
              title="GitHub"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://www.linkedin.com/in/dhanush-kumar-772274213" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center bg-accent/50 dark:bg-zinc-900 border border-border rounded-xl text-muted-foreground hover:text-primary transition-all shadow-lg"
              title="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="https://dhanushkumar.github.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center bg-accent/50 dark:bg-zinc-900 border border-border rounded-xl text-muted-foreground hover:text-primary transition-all shadow-lg"
              title="Portfolio"
            >
              <Globe size={20} />
            </a>
            <a 
              href="mailto:dhanushkumar795@gmail.com" 
              className="w-12 h-12 flex items-center justify-center bg-accent/50 dark:bg-zinc-900 border border-border rounded-xl text-muted-foreground hover:text-primary transition-all shadow-lg"
              title="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-medium">
          <p>&copy; {new Date().getFullYear()} Dhanush Kumar S V. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-foreground transition-colors uppercase tracking-widest text-[10px]">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors uppercase tracking-widest text-[10px]">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
