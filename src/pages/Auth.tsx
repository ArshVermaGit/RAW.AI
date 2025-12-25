import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FloatingParticles } from '@/components/FloatingParticles';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

// Google Icon Component
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string; confirmPassword?: string }>({});

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign in with Google',
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Check for password reset token in URL
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');

    if (type === 'recovery') {
      setMode('reset');
    }
  }, []);

  // Redirect if already logged in (but not if resetting password)
  useEffect(() => {
    if (user && !loading && mode !== 'reset') {
      navigate('/');
    }
  }, [user, loading, navigate, mode]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; fullName?: string; confirmPassword?: string } = {};

    if (mode !== 'reset') {
      const emailResult = emailSchema.safeParse(email);
      if (!emailResult.success) {
        newErrors.email = emailResult.error.errors[0].message;
      }
    }

    if (mode === 'login' || mode === 'signup' || mode === 'reset') {
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        newErrors.password = passwordResult.error.errors[0].message;
      }
    }

    if (mode === 'reset' && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (mode === 'signup' && !fullName.trim()) {
      newErrors.fullName = 'Please enter your name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: 'Login Failed',
              description: 'Invalid email or password. Please try again.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Error',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Welcome back! 👋',
            description: 'You have successfully logged in.',
          });
          navigate('/');
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Account Exists',
              description: 'This email is already registered. Please sign in instead.',
              variant: 'destructive',
            });
            setMode('login');
          } else {
            toast({
              title: 'Error',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: '🎉 Account Created!',
            description: 'Welcome to RAW.AI!',
          });
          navigate('/onboarding');
        }
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });

        if (error) {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          setResetEmailSent(true);
          toast({
            title: '📧 Email Sent!',
            description: 'Check your inbox for the password reset link.',
          });
        }
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: '✓ Password Updated!',
            description: 'Your password has been successfully changed.',
          });
          // Clear the hash and redirect
          window.location.hash = '';
          navigate('/');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Create Account';
      case 'forgot': return 'Reset Password';
      case 'reset': return 'New Password';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Sign in to access your account';
      case 'signup': return 'Join thousands of creators using RAW.AI';
      case 'forgot': return 'Enter your email and we\'ll send you a reset link';
      case 'reset': return 'Choose a new password for your account';
    }
  };

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
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            <motion.div
              className="relative"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="RAW.AI" className="w-10 h-10 object-contain invert dark:invert-0" />
              </div>
              <motion.div
                className="absolute -inset-1 bg-foreground/20 rounded-xl blur-md -z-10"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <span className="font-display font-bold text-2xl tracking-tight">
              RAW<span className="text-muted-foreground">.AI</span>
            </span>
          </motion.div>
          <motion.h1
            className="text-2xl font-bold mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {getTitle()}
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {getSubtitle()}
          </motion.p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          layout
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            className="absolute -inset-px rounded-2xl bg-gradient-to-b from-foreground/20 via-foreground/5 to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          />

          <motion.div
            className="relative bg-card/80 backdrop-blur-xl border border-border/30 rounded-2xl p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            {/* Reset Email Sent Success */}
            {mode === 'forgot' && resetEmailSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Check Your Email</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMode('login');
                    setResetEmailSent(false);
                  }}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name (Signup only) */}
                <AnimatePresence mode="wait">
                  {mode === 'signup' && (
                    <motion.div
                      key="fullname"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-medium">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-11 bg-secondary/50 h-12"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName}</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email (not shown in reset mode) */}
                {mode !== 'reset' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-11 bg-secondary/50 h-12"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                )}

                {/* Password (not shown in forgot mode) */}
                {mode !== 'forgot' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {mode === 'reset' ? 'New Password' : 'Password'}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-11 pr-11 bg-secondary/50 h-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>
                )}

                {/* Confirm Password (reset mode only) */}
                {mode === 'reset' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-11 bg-secondary/50 h-12"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* Forgot Password Link (login mode only) */}
                {mode === 'login' && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrors({});
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 rounded-full bg-foreground text-background hover:bg-foreground/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {mode === 'login' && 'Sign In'}
                      {mode === 'signup' && 'Create Account'}
                      {mode === 'forgot' && 'Send Reset Link'}
                      {mode === 'reset' && 'Update Password'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                {/* Divider and Google Sign In - only for login and signup */}
                {(mode === 'login' || mode === 'signup') && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/50"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full h-12 rounded-full border-border/60 hover:border-foreground/30 hover:bg-secondary/50 gap-3"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleLoading}
                    >
                      {isGoogleLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <GoogleIcon />
                          <span>Continue with Google</span>
                        </>
                      )}
                    </Button>
                  </>
                )}
              </form>
            )}

            {/* Toggle / Back Links */}
            {!(mode === 'forgot' && resetEmailSent) && (
              <div className="mt-6 text-center">
                {mode === 'login' && (
                  <p className="text-muted-foreground">
                    Don't have an account?
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrors({});
                      }}
                      className="ml-2 text-foreground font-medium hover:underline"
                    >
                      Sign Up
                    </button>
                  </p>
                )}
                {mode === 'signup' && (
                  <p className="text-muted-foreground">
                    Already have an account?
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setErrors({});
                      }}
                      className="ml-2 text-foreground font-medium hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                )}
                {mode === 'forgot' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrors({});
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </button>
                )}
                {mode === 'reset' && (
                  <p className="text-sm text-muted-foreground">
                    Enter your new password above
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Back to home */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;
