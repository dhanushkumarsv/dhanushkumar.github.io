import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-border bg-background mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h2 className="font-heading font-bold text-2xl mb-2">Dhanush Kumar S V</h2>
          <p className="text-muted-foreground text-sm">Chemical Engineering & Process Optimization.</p>
        </div>
        
        <div className="flex space-x-6">
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            <Github size={24} />
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            <Linkedin size={24} />
          </a>
          <a href="mailto:dhanushkumar795@gmail.com" className="text-foreground hover:text-primary transition-colors">
            <Mail size={24} />
          </a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Dhanush Kumar S V. All rights reserved.
      </div>
    </footer>
  );
}
