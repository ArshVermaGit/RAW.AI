import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  Shield,
  Zap,
  ChevronRight,
  ChevronLeft,
  Check,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingParticles } from '@/components/home/FloatingParticles';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';



import { siteConfig } from '@/config/site';

const ICONS = [
  <Wand2 className="w-8 h-8" />,
  <Shield className="w-8 h-8" />,
  <Zap className="w-8 h-8" />,
  <TrendingUp className="w-8 h-8" />
];

const steps = siteConfig.onboarding.steps.map((step, index) => ({
  ...step,
  icon: ICONS[index]
}));

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsCompleting(true);
    try {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      await refreshProfile();
      toast.success('🎉 Account Created!', {
        description: 'Welcome to RAW.AI!',
      });
      navigate('/');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      navigate('/');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkip = async () => {
    await handleComplete();
  };

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative flex items-center justify-center px-6">
      <FloatingParticles />
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={handleSkip}
        className="fixed top-6 right-6 z-20 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Skip intro
      </motion.button>

      <div className="relative w-full max-w-2xl z-10">
        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-12">
          {steps.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentStep
                  ? "w-8 bg-foreground"
                  : index < currentStep
                    ? "w-2 bg-foreground/60"
                    : "w-2 bg-foreground/20"
              )}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              className="relative mx-auto mb-8 w-24 h-24"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className={cn(
                "absolute inset-0 rounded-3xl bg-gradient-to-br",
                step.gradient
              )} />
              <div className="relative w-full h-full bg-card/80 backdrop-blur-xl border border-border/30 rounded-3xl flex items-center justify-center">
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  {step.icon}
                </motion.div>
              </div>
              <div className="absolute -inset-4 bg-foreground/5 rounded-[2rem] blur-2xl -z-10" />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Step {step.id} of {steps.length}
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-3">
                {step.title}
              </h1>
              <p className="text-lg text-foreground/80 mb-4">{step.subtitle}</p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-muted-foreground max-w-lg mx-auto mb-8"
            >
              {step.description}
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex flex-col gap-3 max-w-sm mx-auto mb-12"
            >
              {step.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 text-left"
                >
                  <div className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-foreground" />
                  </div>
                  <span className="text-sm text-foreground/80">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={cn(
              "rounded-full px-6 transition-all",
              currentStep === 0 && "opacity-0 pointer-events-none"
            )}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Button>

          {isLastStep ? (
            <Button
              size="lg"
              onClick={handleComplete}
              disabled={isCompleting}
              className="rounded-full px-8 bg-foreground text-background hover:bg-foreground/90 gap-2"
            >
              {isCompleting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  Get Started
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleNext}
              className="rounded-full px-8 bg-foreground text-background hover:bg-foreground/90"
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          )}
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-foreground/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-foreground/3 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
};

export default Onboarding;