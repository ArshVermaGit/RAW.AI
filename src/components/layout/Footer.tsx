import { useNavigate } from 'react-router-dom';

export const Footer = () => {
  const navigate = useNavigate();

  // Helper to standardise scrolling or navigation
  const handleNavigation = (action: () => void) => {
    // If not on home page, maybe navigate home first? 
    // For simplicity, we assume action handles it or we just run it.
    // If we are strictly on home page, document.getElementById works.
    // If we are on other pages, we might need to navigate('/') then scroll.
    // But for now, we'll keep the logic simple as extracted from Index.tsx.
    action();
  };

  return (
    <footer className="py-12 md:py-16 px-4 md:px-6 border-t border-border/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 md:gap-8 mb-12">
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="RAW.AI" className="w-8 h-8 object-contain dark:invert" />
                <span className="font-display font-bold text-xl">RAW.AI</span>
              </div>
              <p className="text-sm text-muted-foreground">Transform AI text into authentic content.</p>
            </div>
            {[
              { 
                title: 'Product', 
                links: [
                  { label: 'AI Humanizer', action: () => document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' }) }, 
                  { label: 'AI Detector', action: () => document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' }) },
                  { label: 'Pricing', action: () => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }) },
                  { label: 'Changelog', action: () => navigate('/changelog') },
                  { label: 'How It Works', action: () => navigate('/how-it-works') }
                ] 
              },
              { 
                title: 'Company', 
                links: [
                  { label: 'About Us', action: () => navigate('/about') },
                  { label: 'Contact', action: () => navigate('/contact') },
                  { label: 'FAQ', action: () => navigate('/faq') },
                  { label: 'Support', action: () => navigate('/support') }
                ] 
              },
              { 
                title: 'Legal', 
                links: [
                  { label: 'Privacy Policy', action: () => navigate('/privacy') }, 
                  { label: 'Terms of Service', action: () => navigate('/terms') },
                  { label: 'Refund Policy', action: () => navigate('/refund-policy') },
                  { label: 'Disclaimer', action: () => navigate('/disclaimer') },
                  { label: 'Cookie Policy', action: () => navigate('/cookie-policy') }
                ] 
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {col.links.map((l, j) => <li key={j}><button onClick={() => handleNavigation(l.action)} className="hover:text-foreground text-left">{l.label}</button></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-border/30 flex justify-between items-center text-sm text-muted-foreground">
            <p>© 2026 RAW.AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
  );
}
