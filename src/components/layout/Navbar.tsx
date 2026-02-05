import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MagneticButton } from '@/components/MagneticButton';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useModals } from '@/hooks/use-modals';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { openModal } = useModals();
  const navigate = useNavigate();

  const subscribedPlan = profile?.subscribed_plan || 'free';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
       el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
       // If not found (e.g. not on home), go home
       navigate('/');
       // Timeout to allow nav then scroll? tricky in React without context/global state. 
       // For now simple.
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative">
                <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="RAW.AI" className="w-8 h-8 object-contain rounded-lg" />
                </div>
                <div className="absolute -inset-1 bg-foreground/20 rounded-xl blur-md -z-10" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">RAW<span className="text-muted-foreground">.AI</span></span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {siteConfig.nav.map((item) => (
                <button 
                  key={item.label}
                  onClick={() => item.id ? scrollToSection(item.id) : navigate(item.href)} 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-animated"
                >
                  {item.label}
                </button>
              ))}
              <ThemeToggle />
              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    <button
                      onClick={() => navigate('/profile')}
                      className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full hover:bg-secondary/80 transition-colors"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{profile?.full_name || user.email?.split('@')[0]}</span>
                      {subscribedPlan !== 'free' && (
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          subscribedPlan === 'ultra' ? "bg-purple-500/20 text-purple-500" : "bg-blue-500/20 text-blue-500"
                        )}>
                          {subscribedPlan.toUpperCase()}
                        </span>
                      )}
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full gap-2"
                      onClick={() => openModal('logout-confirm', {
                        onConfirm: async () => {
                          await signOut();
                          navigate('/auth');
                        }
                      })}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <MagneticButton size="default" onClick={() => navigate('/auth')}>
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Nav */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                className="md:hidden pt-6 pb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Theme</span>
                    <ThemeToggle />
                  </div>
                  {siteConfig.nav.map((item) => (
                     <button 
                        key={item.label}
                        onClick={() => { 
                          if (item.id) {
                            setMobileMenuOpen(false); 
                            scrollToSection(item.id); 
                          } else {
                            navigate(item.href);
                          }
                        }} 
                        className="text-sm font-medium py-2 text-left"
                      >
                        {item.label}
                      </button>
                  ))}
                  {user ? (
                    <div className="flex flex-col gap-3 pt-2">
                      <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-lg hover:bg-secondary/80 transition-colors"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{profile?.full_name || user.email?.split('@')[0]}</span>
                        {subscribedPlan !== 'free' && (
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium ml-auto",
                            subscribedPlan === 'ultra' ? "bg-purple-500/20 text-purple-500" : "bg-blue-500/20 text-blue-500"
                          )}>
                            {subscribedPlan.toUpperCase()}
                          </span>
                        )}
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full gap-2"
                        onClick={() => openModal('logout-confirm', {
                          onConfirm: async () => {
                            await signOut();
                            navigate('/auth');
                          }
                        })}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <Button variant="default" size="sm" className="w-full rounded-full" onClick={() => navigate('/auth')}>Get Started Free</Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
  );
};
