import { useNavigate } from 'react-router-dom';
import { Github } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const Footer = () => {
  const navigate = useNavigate();



  return (
    <footer className="py-12 md:py-16 px-4 md:px-6 border-t border-border/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 md:gap-8 mb-12">
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="RAW.AI" className="w-8 h-8 object-contain rounded-lg" />
                <span className="font-display font-bold text-xl">RAW.AI</span>
              </div>
              <p className="text-sm text-muted-foreground">Transform AI text into authentic content.</p>
            </div>
            {siteConfig.footerNav.map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {col.links.map((l, j) => (
                    <li key={j}>
                      {l.id === 'cookie-settings' ? (
                        <button
                          onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
                          className="hover:text-foreground text-left transition-colors"
                        >
                          {l.label}
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            if (l.id) {
                              if (window.location.pathname !== '/') {
                                  navigate('/');
                                  setTimeout(() => document.getElementById(l.id!)?.scrollIntoView({ behavior: 'smooth' }), 100);
                              } else {
                                 document.getElementById(l.id)?.scrollIntoView({ behavior: 'smooth' });
                              }
                            } else {
                              navigate(l.href);
                            }
                          }} 
                          className="hover:text-foreground text-left transition-colors"
                        >
                          {l.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2026 RAW.AI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a 
                href="https://github.com/ArshVermaGit/RAW.AI" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="w-5 h-5" />
              </a>
              <p>Built with <span className="text-red-500">❤️</span> by <a href="https://www.linkedin.com/in/arshvermadev/" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:underline">Arsh Verma</a></p>
            </div>
          </div>
        </div>
      </footer>
  );
}
