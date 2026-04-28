import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-16 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="font-heading font-bold text-3xl text-white mb-2">DK<span className="text-primary">.</span></h2>
            <p className="text-zinc-500 text-lg">Dhanush Kumar S V | Chemical Engineer</p>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/dhanushkumarsv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-primary transition-all shadow-lg"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://www.linkedin.com/in/dhanush-kumar-s-v-766a5921a" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-primary transition-all shadow-lg"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="mailto:dhanushkumar795@gmail.com" 
              className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-primary transition-all shadow-lg"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-600 font-medium">
          <p>&copy; {new Date().getFullYear()} Dhanush Kumar S V. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
