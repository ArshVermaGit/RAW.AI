import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TrustedByMarquee } from '@/components/TrustedByMarquee';
import { Modal } from '@/components/Modal';
import { AIDetector } from '@/components/AIDetector';
import { useAuth } from '@/hooks/useAuth';
import { useModals } from '@/hooks/use-modals';
import { LucideIcon } from 'lucide-react';

// Sections
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { PricingSection } from '@/components/home/PricingSection';
import { CTASection } from '@/components/home/CTASection';
import { ExamplesSection } from '@/components/home/ExamplesSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { HumanizerTool } from '@/components/home/HumanizerTool';

// Layout
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string;
}

const Index = () => {
  const [featureModal, setFeatureModal] = useState<{ open: boolean; feature: Feature | null }>({ open: false, feature: null });
  
  const { openModal } = useModals();
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Auto-prompt login on initial visit if not authenticated
  useEffect(() => {
    const hasPrompted = sessionStorage.getItem('hasPromptedLogin');
    if (!user && !authLoading && !hasPrompted) {
      openModal('auth-required', {
        onConfirm: () => navigate('/auth')
      });
      sessionStorage.setItem('hasPromptedLogin', 'true');
    }
  }, [user, authLoading, openModal, navigate]);

  // Handle onboarding sequence after login
  useEffect(() => {
    if (user && profile && !profile.onboarding_completed) {
      navigate('/onboarding');
    }
  }, [user, profile, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <Navbar />

      <HeroSection />

      {/* Tool Hub Section */}
      <section id="converter" className="pt-8 md:pt-12 pb-12 md:pb-20 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <Tabs defaultValue="humanizer" className="w-full">
            <div className="flex justify-center mb-8 md:mb-12 relative group">
              <TabsList className="relative z-10 bg-secondary/5 backdrop-blur-3xl border border-foreground/5 p-1 rounded-full h-14 w-full max-w-sm md:max-w-[400px] shadow-sm">
                <TabsTrigger 
                  value="humanizer" 
                  className="rounded-full flex-1 h-full font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-foreground data-[state=active]:text-background transition-all duration-700"
                >
                  Humanizer
                </TabsTrigger>
                <TabsTrigger 
                  value="detector" 
                  className="rounded-full flex-1 h-full font-bold text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-foreground data-[state=active]:text-background transition-all duration-700"
                >
                  AI Detector
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="humanizer" className="focus-visible:ring-0 focus-visible:outline-none">
              <HumanizerTool />
            </TabsContent>

            <TabsContent value="detector" className="focus-visible:ring-0 focus-visible:outline-none">
              <AIDetector />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <TrustedByMarquee />
      
      <FeaturesSection onFeatureClick={(feature) => setFeatureModal({ open: true, feature })} />
      
      <ExamplesSection />
      
      <HowItWorksSection />
      
      <TestimonialsSection />
      
      <PricingSection />
      
      <CTASection />
      
      <Footer />

      <Modal 
        isOpen={featureModal.open} 
        onClose={() => setFeatureModal({ open: false, feature: null })} 
        title={featureModal.feature?.title}
      >
        {featureModal.feature && (
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">{featureModal.feature.details}</p>
            <Button className="w-full" onClick={() => setFeatureModal({ open: false, feature: null })}>Got it</Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Index;
