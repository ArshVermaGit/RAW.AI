import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingParticles } from '@/components/home/FloatingParticles';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Google Icon Component
const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Auth = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        toast.error('Authentication Error', {
          description: error.message,
        });
      }
    } catch {
      toast.error('Error', {
        description: 'Failed to sign in with Google',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative flex items-center justify-center px-6">
      {/* Theme Toggle */}
      <motion.div
        className="fixed top-6 right-6 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        <ThemeToggle />
      </motion.div>

      <FloatingParticles />
      <motion.div
        className="fixed inset-0 grid-bg opacity-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      />

      {/* Animated background orbs */}
      <motion.div
        className="fixed top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="fixed bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative w-full max-w-md z-10"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
              <img src="/logo.png" alt="RAW.AI" className="w-8 h-8 object-contain rounded-lg relative z-10" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">
              RAW<span className="text-muted-foreground">.AI</span>
            </span>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-display font-black mb-4 tracking-tight leading-[1.1]">
            Hey there! 👋
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xs mx-auto leading-relaxed">
            Ready to make your writing sound like <span className="text-foreground font-medium">you</span> again?
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent rounded-[2rem] blur-xl opacity-60" />
          <div className="relative bg-card/60 backdrop-blur-2xl border border-border/40 rounded-[2rem] p-8 shadow-2xl">
            
            {/* Decorative corner accents */}
            <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-primary/30 rounded-tl-xl" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-primary/30 rounded-br-xl" />

            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  One click. That's it.
                </p>
              </div>

              <Button
                type="button"
                variant="default"
                size="xl"
                className="w-full h-14 rounded-xl bg-foreground text-background hover:bg-foreground/90 gap-3 text-base font-bold shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <div className="bg-white p-1.5 rounded-lg">
                      <GoogleIcon />
                    </div>
                    <span>Continue with Google</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/50">
                <ShieldCheck className="w-3 h-3" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social proof / trust element */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm text-muted-foreground/60">
            Trusted by <span className="text-foreground font-semibold">2,000+</span> writers
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;
