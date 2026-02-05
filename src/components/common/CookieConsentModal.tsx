import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export const CookieConsentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true and disabled
    analytics: true,
    marketing: true,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const storedConsent = localStorage.getItem('cookie-consent');
    if (!storedConsent) {
      // Small delay to not overwhelm user immediately
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for custom event to re-open modal (e.g. from footer)
  useEffect(() => {
    const handleOpenSettings = () => {
      setIsOpen(true);
      setShowPreferences(true);
      
      // Load current preferences if they exist
      const storedConsent = localStorage.getItem('cookie-consent');
      if (storedConsent) {
        try {
          const parsed = JSON.parse(storedConsent);
          setPreferences({ ...preferences, ...parsed });
        } catch {
          // Ignore error
        }
      }
    };

    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => window.removeEventListener('open-cookie-settings', handleOpenSettings);
  }, [preferences]);

  const savePreferences = (newPrefs: typeof preferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(newPrefs));
    localStorage.setItem('cookie-consent-timestamp', new Date().toISOString());
    setIsOpen(false);
  };

  const handleAcceptAll = () => {
    const allEnabled = { essential: true, analytics: true, marketing: true };
    setPreferences(allEnabled);
    savePreferences(allEnabled);
  };

  const handleRejectAll = () => {
    const allDisabled = { essential: true, analytics: false, marketing: false };
    setPreferences(allDisabled);
    savePreferences(allDisabled);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-5xl mx-auto bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col gap-6">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Cookie className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Cookie Preferences</h2>
                    {!showPreferences && (
                      <p className="text-muted-foreground mt-1 text-sm md:text-base">
                        We use cookies to enhance your experience, analyze site traffic, and personalize content.
                      </p>
                    )}
                  </div>
                </div>
                {!showPreferences && (
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="shrink-0 -mr-2 -mt-2">
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>

              {/* Preferences Content */}
              <AnimatePresence>
                {showPreferences && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-muted-foreground mb-6">
                      Manage your cookie settings below. Essential cookies are required for the website to function properly.
                    </p>
                    
                    <div className="space-y-4 mb-2">
                      {/* Essential */}
                      <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
                        <div>
                          <p className="font-semibold flex items-center gap-2">
                            Essential Cookies
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary uppercase tracking-wider">Required</span>
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">Necessary for secure login and core features.</p>
                        </div>
                        <Switch checked={true} disabled />
                      </div>

                      {/* Analytics */}
                      <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
                        <div>
                          <p className="font-semibold">Analytics Cookies</p>
                          <p className="text-sm text-muted-foreground mt-1">Help us understand how you use our site.</p>
                        </div>
                        <Switch 
                          checked={preferences.analytics} 
                          onCheckedChange={(checked) => setPreferences({...preferences, analytics: checked})} 
                        />
                      </div>

                      {/* Marketing */}
                      <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
                        <div>
                          <p className="font-semibold">Marketing Cookies</p>
                          <p className="text-sm text-muted-foreground mt-1">Used to show you relevant advertisements.</p>
                        </div>
                        <Switch 
                          checked={preferences.marketing} 
                          onCheckedChange={(checked) => setPreferences({...preferences, marketing: checked})} 
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex flex-col md:flex-row items-center gap-3 pt-2 md:pt-0">
                {!showPreferences ? (
                  <>
                    <Button onClick={handleAcceptAll} className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                      Accept All
                    </Button>
                    <Button onClick={handleRejectAll} variant="outline" className="w-full md:w-auto">
                      Reject Non-Essential
                    </Button>
                    <Button onClick={() => setShowPreferences(true)} variant="ghost" className="w-full md:w-auto ml-auto text-muted-foreground hover:text-foreground">
                      Manage Preferences <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleSavePreferences} className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                      Save Preferences
                    </Button>
                    <Button onClick={handleAcceptAll} variant="outline" className="w-full md:w-auto">
                      Accept All
                    </Button>
                    <Button onClick={() => setShowPreferences(false)} variant="ghost" className="w-full md:w-auto ml-auto text-muted-foreground hover:text-foreground">
                      Cancel <ChevronUp className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
