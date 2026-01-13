import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Copy, Check, Sparkles, ArrowRight, Zap, Shield, Brain,
  Wand2, Globe, Target, Award, Menu, X, ClipboardPaste,
  Play, Rocket, Star, ChevronDown, Eye, FileText, Lock, Crown, LogOut, User, Settings, LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FloatingParticles } from '@/components/FloatingParticles';
import { AnimatedHeroText } from '@/components/AnimatedHeroText';
import { MagneticButton } from '@/components/MagneticButton';
import { TrustedByMarquee } from '@/components/TrustedByMarquee';
import { InteractiveCard } from '@/components/InteractiveCard';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { Modal } from '@/components/Modal';
import { UpgradeModal } from '@/components/UpgradeModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UsageIndicator } from '@/components/UsageIndicator';
import { ModelSelector, AIModel } from '@/components/ModelSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useUsage } from '@/hooks/useUsage';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

type Level = 'lite' | 'pro' | 'ultra';
type SubscribedPlan = 'free' | 'pro' | 'ultra';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string;
}

interface Plan {
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  planId: 'free' | 'pro' | 'ultra';
}

const Index = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [humanScore, setHumanScore] = useState<number | null>(null);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [level, setLevel] = useState<Level>('lite');
  const [selectedModel, setSelectedModel] = useState<AIModel>('google/gemini-2.5-flash');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featureModal, setFeatureModal] = useState<{ open: boolean; feature: Feature | null }>({ open: false, feature: null });
  const [pricingModal, setPricingModal] = useState<{ open: boolean; plan: Plan | null }>({ open: false, plan: null });
  const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; plan: 'pro' | 'ultra' }>({ open: false, plan: 'pro' });

  const { user, profile, signOut, refreshProfile, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { remaining, refetch: refetchUsage, planLimit } = useUsage();

  // Get subscribed plan from profile
  const subscribedPlan: SubscribedPlan = profile?.subscribed_plan || 'free';

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to humanize.",
        variant: "destructive",
      });
      return;
    }

    const wordCount = inputText.trim().split(/\s+/).length;

    // Check word limit for non-authenticated users
    if (!user && wordCount > 200) {
      toast({
        title: "Word limit exceeded",
        description: "Sign up for free to humanize more than 200 words!",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    // Check remaining words for authenticated users
    if (user && planLimit < Number.MAX_SAFE_INTEGER && wordCount > remaining) {
      toast({
        title: "Limit reached",
        description: `You only have ${remaining} words remaining this month. Upgrade for more!`,
        variant: "destructive",
      });
      setUpgradeModal({ open: true, plan: subscribedPlan === 'free' ? 'pro' : 'ultra' });
      return;
    }

    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add auth header if user is logged in
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/raw-ai`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: inputText,
          level: level,
          style: 'general',
          model: selectedModel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (data.limitReached) {
          toast({
            title: "Monthly limit reached",
            description: `Upgrade your plan to continue humanizing text.`,
            variant: "destructive",
          });
          setUpgradeModal({ open: true, plan: subscribedPlan === 'free' ? 'pro' : 'ultra' });
          return;
        }
        if (data.requiresAuth) {
          toast({
            title: "Sign up required",
            description: data.error,
          });
          navigate('/auth');
          return;
        }
        if (data.requiresUpgrade) {
          toast({
            title: "Upgrade required",
            description: data.error,
          });
          setUpgradeModal({ open: true, plan: data.requiredPlan });
          return;
        }
        throw new Error(data.error || 'Failed to humanize text');
      }

      setOutputText(data.humanizedText);
      setHumanScore(data.humanScore || null);
      setImprovements(data.improvements || []);

      // Refetch usage after successful humanization
      refetchUsage();

      toast({
        title: "✨ Text Humanized!",
        description: `Human score: ${data.humanScore}% - Your text now sounds natural.`,
      });
    } catch (error) {
      console.error('Humanization error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to humanize text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast({ title: "📋 Copied!", description: "Text copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      toast({ title: "📝 Pasted!", description: "Text pasted from clipboard." });
    } catch {
      toast({ title: "Error", description: "Could not access clipboard.", variant: "destructive" });
    }
  };

  const handleTrySample = () => {
    setInputText(`Artificial intelligence has significantly transformed various industries, enabling organizations to optimize their operations and enhance productivity. The implementation of machine learning algorithms facilitates the automation of complex tasks, thereby reducing operational costs and improving efficiency. Furthermore, AI-driven analytics provide valuable insights that assist in strategic decision-making processes.`);
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const features = [
    {
      icon: Award,
      title: "Publication-Ready",
      description: "Polish drafts into clear, coherent, brand-safe prose with professional tone.",
      details: "Our advanced algorithms analyze your content structure, tone, and style to ensure it meets professional publishing standards. Perfect for blogs, articles, and business communications.",
    },
    {
      icon: Target,
      title: "Style Control",
      description: "Match your brand voice with adjustable style while preserving intent.",
      details: "Choose from multiple writing styles including academic, business, creative, and casual. Fine-tune the output to perfectly match your brand's unique voice.",
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Paste text in your preferred language and get refined output.",
      details: "Support for 50+ languages with automatic language detection. Humanize content in English, Spanish, French, German, and many more.",
    },
    {
      icon: Brain,
      title: "Smart Rewriting",
      description: "We rewrite into fluent, authentic content while keeping meaning.",
      details: "Our AI doesn't just swap words—it understands context and rewrites sentences for natural flow while preserving your original message and intent.",
    },
    {
      icon: Zap,
      title: "Boost SEO",
      description: "Improve SEO with proper keywords and enhanced article quality.",
      details: "Optimized for search engines with natural keyword integration, improved readability scores, and content that ranks higher on Google.",
    },
    {
      icon: Shield,
      title: "Undetectable",
      description: "Bypass all major AI detection tools with confidence.",
      details: "Tested against GPTZero, Turnitin, Copyleaks, Originality AI, and more. Our output consistently achieves 95%+ human scores.",
    },
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: ["200 words per request", "Lite mode only", "Basic AI detection check", "Community support"],
      cta: "Current Plan",
      popular: false,
      planId: 'free' as const,
    },
    {
      name: "Pro",
      price: "$25",
      originalPrice: "$49",
      description: "For serious content creators",
      features: ["Unlimited words", "Pro humanization mode", "Advanced AI detection", "SEO optimization", "Priority support", "API access"],
      cta: "Upgrade to Pro",
      popular: true,
      planId: 'pro' as const,
    },
    {
      name: "Ultra",
      price: "$50",
      originalPrice: "$99",
      description: "For power users & teams",
      features: ["Everything in Pro", "Ultra humanization mode", "99.9% undetectable guarantee", "White-label options", "Dedicated support", "Custom integrations"],
      cta: "Upgrade to Ultra",
      popular: false,
      planId: 'ultra' as const,
    },
  ];

  // Parallax scroll effects
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const backgroundY = useTransform(scrollY, [0, 500], [0, -100]);
  const floatingY = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Floating particles background */}
      <motion.div style={{ y: floatingY }}>
        <FloatingParticles />
      </motion.div>

      {/* Grid background with parallax */}
      <motion.div
        className="fixed inset-0 grid-bg opacity-30 pointer-events-none"
        style={{ y: backgroundY }}
      />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 glass-border"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="RAW.AI" className="w-8 h-8 object-contain invert dark:invert-0" />
                </div>
                <div className="absolute -inset-1 bg-foreground/20 rounded-xl blur-md -z-10" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">RAW<span className="text-muted-foreground">.AI</span></span>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-animated">Features</button>
              <button onClick={() => document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-animated">Examples</button>
              <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-animated">Pricing</button>
              <button onClick={() => navigate('/about')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-animated">About</button>
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
                      onClick={() => {
                        signOut();
                        toast({ title: 'Signed out', description: 'See you next time!' });
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      onClick={() => navigate('/auth')}
                    >
                      Login
                    </Button>
                    <MagneticButton size="default" onClick={() => navigate('/auth')}>
                      Get Started Free
                      <ArrowRight className="w-4 h-4" />
                    </MagneticButton>
                  </>
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
                  <button onClick={() => { setMobileMenuOpen(false); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="text-sm font-medium py-2 text-left">Features</button>
                  <button onClick={() => { setMobileMenuOpen(false); document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="text-sm font-medium py-2 text-left">Examples</button>
                  <button onClick={() => { setMobileMenuOpen(false); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="text-sm font-medium py-2 text-left">Pricing</button>
                  <button onClick={() => navigate('/about')} className="text-sm font-medium py-2 text-left">About</button>
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
                        onClick={() => {
                          signOut();
                          toast({ title: 'Signed out', description: 'See you next time!' });
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-3 pt-2">
                      <Button variant="ghost" size="sm" className="flex-1 rounded-full" onClick={() => navigate('/auth')}>Login</Button>
                      <Button variant="default" size="sm" className="flex-1 rounded-full" onClick={() => navigate('/auth')}>Get Started</Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section with Parallax */}
      <section className="pt-36 pb-16 px-6 relative">
        {/* Parallax background elements */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none"
          style={{ y: useTransform(scrollY, [0, 500], [0, 100]) }}
        />
        <motion.div
          className="absolute top-40 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
          style={{ y: useTransform(scrollY, [0, 500], [0, 150]) }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-64 h-64 bg-primary/8 rounded-full blur-3xl pointer-events-none"
          style={{ y: useTransform(scrollY, [0, 500], [0, 80]) }}
        />

        <motion.div
          className="container mx-auto max-w-6xl relative z-10"
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        >
          <div className="text-center mb-16">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-card/50 border border-border/30 rounded-full mb-8 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4 text-yellow-500" />
              </motion.div>
              <span className="text-xs font-medium uppercase tracking-wider">AI-Powered Text Transformation</span>
              <Rocket className="w-4 h-4 animate-bounce-gentle" />
            </motion.div>

            {/* Animated Hero Text */}
            <AnimatedHeroText />

            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Transform AI-generated content into natural, human-like text that bypasses
              all major AI detectors while maintaining your message.
            </motion.p>

            {/* Stats with parallax */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {[
                { value: '99%', label: 'Bypass Rate' },
                { value: '50K+', label: 'Users' },
                { value: '10M+', label: 'Words Humanized' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center group cursor-default"
                  whileHover={{ scale: 1.1, y: -5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <div className="text-3xl md:text-4xl font-bold mb-1 group-hover:glow-text transition-all">
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Converter Section */}
      <section id="converter" className="pb-20 px-6 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Glow border */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-foreground/20 via-foreground/5 to-transparent pointer-events-none" />

            <div className="relative bg-card/80 backdrop-blur-xl border border-border/30 rounded-3xl overflow-hidden">
              {/* Usage indicator for logged in users */}
              {user && (
                <div className="p-4 lg:p-6 border-b border-border/30 bg-primary/5">
                  <UsageIndicator
                    onUpgrade={() => setUpgradeModal({ open: true, plan: subscribedPlan === 'free' ? 'pro' : 'ultra' })}
                  />
                </div>
              )}

              {/* Toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 lg:p-6 border-b border-border/30 bg-secondary/20">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">Level:</span>
                  {(['lite', 'pro', 'ultra'] as Level[]).map((l) => {
                    const isLocked = (l === 'pro' && subscribedPlan === 'free') ||
                      (l === 'ultra' && subscribedPlan !== 'ultra');
                    return (
                      <motion.button
                        key={l}
                        onClick={() => {
                          if (isLocked) {
                            setUpgradeModal({ open: true, plan: l as 'pro' | 'ultra' });
                          } else {
                            setLevel(l);
                          }
                        }}
                        className={cn("level-chip", level === l && "active")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {l === 'lite' && <Zap className="w-3.5 h-3.5" />}
                        {l === 'pro' && <Sparkles className="w-3.5 h-3.5" />}
                        {l === 'ultra' && <Rocket className="w-3.5 h-3.5" />}
                        <span className="capitalize">{l}</span>
                        {isLocked && <Lock className="w-3 h-3 opacity-50" />}
                        {!isLocked && l !== 'lite' && <Crown className="w-3 h-3 text-yellow-500" />}
                      </motion.button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4">
                  {/* Model selector toggle (only for paid users) */}
                  {subscribedPlan !== 'free' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowModelSelector(!showModelSelector)}
                      className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="hidden sm:inline">Model</span>
                    </Button>
                  )}
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{wordCount}</span> words · <span className="font-medium">{charCount}</span> chars
                  </div>
                </div>
              </div>

              {/* Model selector panel */}
              <AnimatePresence>
                {showModelSelector && subscribedPlan !== 'free' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-b border-border/30"
                  >
                    <div className="p-4 lg:p-6 bg-secondary/10">
                      <ModelSelector
                        selectedModel={selectedModel}
                        onSelectModel={setSelectedModel}
                        onUpgrade={(plan) => setUpgradeModal({ open: true, plan })}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Text areas */}
              <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/30">
                {/* Input */}
                <div className="relative flex flex-col min-h-[350px]">
                  <div className="flex items-center justify-between p-4 border-b border-border/30">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-semibold">AI Text</span>
                    </div>
                  </div>
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter your AI-generated text here..."
                    className="flex-1 border-0 rounded-none bg-transparent resize-none focus:ring-0 text-base"
                  />
                  {/* Quick actions overlay */}
                  <AnimatePresence>
                    {!inputText && (
                      <motion.div
                        className="absolute inset-0 top-[57px] flex flex-col items-center justify-center gap-4 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="pointer-events-auto flex flex-col sm:flex-row gap-3">
                          <MagneticButton variant="secondary" onClick={handlePaste}>
                            <ClipboardPaste className="w-4 h-4" />
                            Paste Text
                          </MagneticButton>
                          <MagneticButton variant="secondary" onClick={handleTrySample}>
                            <Play className="w-4 h-4" />
                            Try Sample
                          </MagneticButton>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Output */}
                <div className="relative flex flex-col min-h-[350px] bg-secondary/10">
                  <div className="flex items-center justify-between p-4 border-b border-border/30">
                    <div className="flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-semibold">Human Text</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      disabled={!outputText}
                      className="gap-2 h-8 rounded-full"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <div className="flex-1 p-6">
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          className="flex flex-col items-center justify-center h-full gap-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="relative">
                            <motion.div
                              className="w-16 h-16 rounded-full border-2 border-foreground/20"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            >
                              <div className="absolute top-0 left-1/2 w-2 h-2 -ml-1 bg-foreground rounded-full" />
                            </motion.div>
                            <Wand2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">Humanizing your text...</p>
                        </motion.div>
                      ) : outputText ? (
                        <motion.div
                          key="output"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <p className="text-base leading-relaxed whitespace-pre-wrap">{outputText}</p>
                          <div className="mt-6 pt-4 border-t border-border/30 space-y-4">
                            <ScoreDisplay
                              score={Number(humanScore) || 0}
                              label="Human Score"
                              variant={typeof humanScore === 'number' && humanScore >= 90 ? "success" : typeof humanScore === 'number' && humanScore >= 70 ? "warning" : "danger"}
                            />
                            {improvements.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-2"
                              >
                                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Improvements Made</p>
                                <ul className="space-y-1">
                                  {Array.isArray(improvements) && improvements.map((improvement, i) => (
                                    <motion.li
                                      key={i}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.4 + i * 0.1 }}
                                      className="flex items-start gap-2 text-sm text-muted-foreground"
                                    >
                                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                      <span>{typeof improvement === 'string' ? improvement : JSON.stringify(improvement)}</span>
                                    </motion.li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          className="flex flex-col items-center justify-center h-full text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Wand2 className="w-8 h-8 text-muted-foreground" />
                          </motion.div>
                          <p className="text-muted-foreground">
                            Your humanized text will appear here
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Action bar */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6 bg-secondary/20 border-t border-border/30">
                <MagneticButton
                  size="xl"
                  onClick={handleHumanize}
                  disabled={isLoading || !inputText.trim()}
                  className="w-full sm:w-auto min-w-[220px]"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 rounded-full border-2 border-background border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Humanize Text
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Marquee */}
      <TrustedByMarquee />

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4 block">Features</span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Why Choose <span className="text-gradient-animated">RAW.AI</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Transform AI content into natural, reader-friendly writing with our advanced technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <InteractiveCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
                onClick={() => setFeatureModal({ open: true, feature })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="py-24 px-6 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4 block">Examples</span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              See the <span className="text-gradient-animated">Difference</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Compare AI-generated text with our humanized output.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Original */}
            <motion.div
              className="p-8 rounded-2xl bg-card/50 border border-destructive/30"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-destructive/10 text-destructive">
                  AI Detected
                </span>
                <span className="text-sm text-muted-foreground">GPT-4</span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                "Nature is the foundation of human life, providing us with clean air, fresh water, food, and countless resources. Yet, modern development has placed heavy pressure on the environment. Forests are being cut down, rivers are polluted, and wildlife is losing its habitat."
              </p>
              <ScoreDisplay score={100} label="AI Detected" variant="danger" />
            </motion.div>

            {/* Humanized */}
            <motion.div
              className="p-8 rounded-2xl bg-card/50 border border-success/30"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-success/10 text-success">
                  Human-like
                </span>
                <span className="text-sm text-muted-foreground">Humanized</span>
              </div>
              <p className="text-foreground leading-relaxed mb-6">
                "Nature supports all human life and gives us the things we need to survive. It gives us clean air, good water, food, and many other things. But in today's world, new inventions are putting a lot of pressure on nature. Trees are being cut, rivers are being polluted, and animals are losing their home."
              </p>
              <ScoreDisplay score={98} label="Human Score" variant="success" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4 block">Process</span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
              3 Simple Steps
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Paste Your Text', desc: 'Copy your AI content and paste it into our editor.', icon: ClipboardPaste },
              { num: '02', title: 'Click Humanize', desc: 'Choose your settings and transform your text.', icon: Wand2 },
              { num: '03', title: 'Copy & Use', desc: 'Get natural content ready to publish anywhere.', icon: Copy },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="relative p-8 rounded-2xl bg-card/30 border border-border/30 group hover:bg-card/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -5 }}
              >
                <span className="absolute top-6 right-6 text-6xl font-bold text-foreground/5 group-hover:text-foreground/10 transition-colors">
                  {step.num}
                </span>
                <motion.div
                  className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <step.icon className="w-6 h-6 text-foreground" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-medium uppercase tracking-wider text-background/60 mb-4 block">Testimonials</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-background">
              Loved by Creators
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "I always refine drafts to make them more engaging. This tool helps polish my words while keeping my style intact.", author: "Emily D.", role: "Content Writer" },
              { quote: "In SEO, originality is crucial. This tool helped me produce materials that improved my website ranking significantly.", author: "Michael L.", role: "SEO Expert" },
              { quote: "Running a blog requires lots of high-quality articles. This lets me quickly generate content that sounds natural.", author: "Lisa W.", role: "Blogger" },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-2xl border border-background/20 bg-background/5 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-background/90 leading-relaxed mb-8">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4 pt-6 border-t border-background/20">
                  <div className="w-12 h-12 rounded-full bg-background/20 flex items-center justify-center text-lg font-bold text-background">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-background">{testimonial.author}</div>
                    <div className="text-sm text-background/60">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4 px-4 py-2 bg-card/50 rounded-full border border-border/30"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Crown className="w-3 h-3" />
              Pricing
            </motion.span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Simple, transparent pricing for everyone
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                className={cn(
                  "group relative rounded-3xl transition-all duration-500",
                  plan.popular && "md:-mt-4 md:mb-4"
                )}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                {/* Glow effect for popular */}
                {plan.popular && (
                  <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-foreground/30 via-foreground/10 to-foreground/5 blur-sm" />
                )}

                <div className={cn(
                  "relative h-full p-8 rounded-3xl border-2 transition-all duration-300 backdrop-blur-sm",
                  plan.popular
                    ? "bg-foreground text-background border-foreground shadow-2xl shadow-foreground/20"
                    : "bg-card/60 border-border/50 hover:border-foreground/40 hover:bg-card/80 hover:shadow-xl hover:shadow-foreground/5"
                )}>
                  {plan.popular && (
                    <motion.div
                      className="absolute -top-4 left-1/2 -translate-x-1/2"
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center gap-2 px-5 py-2 bg-background text-foreground text-xs font-bold uppercase tracking-wider rounded-full shadow-lg border border-border/30">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        Most Popular
                      </div>
                    </motion.div>
                  )}

                  {/* Plan name & description */}
                  <div className="mb-6">
                    <h3 className={cn(
                      "text-2xl font-display font-bold mb-2",
                      plan.popular ? "text-background" : "text-foreground"
                    )}>{plan.name}</h3>
                    <p className={cn(
                      "text-sm",
                      plan.popular ? "text-background/70" : "text-muted-foreground"
                    )}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-8 pb-8 border-b border-current/10">
                    <div className="flex items-baseline gap-2">
                      {plan.originalPrice && (
                        <span className={cn(
                          "text-xl line-through font-medium",
                          plan.popular ? "text-background/40" : "text-muted-foreground/60"
                        )}>
                          {plan.originalPrice}
                        </span>
                      )}
                      <span className={cn(
                        "text-5xl font-display font-bold tracking-tight",
                        plan.popular ? "text-background" : "text-foreground"
                      )}>{plan.price}</span>
                      {plan.price !== '$0' && (
                        <span className={cn(
                          "text-base font-medium",
                          plan.popular ? "text-background/60" : "text-muted-foreground"
                        )}>/mo</span>
                      )}
                    </div>
                    {plan.originalPrice && (
                      <motion.div
                        className={cn(
                          "inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold",
                          plan.popular ? "bg-background/20 text-background" : "bg-green-500/10 text-green-600 dark:text-green-400"
                        )}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                      >
                        <Zap className="w-3 h-3" />
                        Save {Math.round((1 - parseInt(plan.price.replace('$', '')) / parseInt(plan.originalPrice.replace('$', ''))) * 100)}%
                      </motion.div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, j) => (
                      <motion.li
                        key={j}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + j * 0.05 }}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          plan.popular ? "bg-background/20" : "bg-foreground/10"
                        )}>
                          <Check className={cn(
                            "w-3 h-3",
                            plan.popular ? "text-background" : "text-foreground"
                          )} />
                        </div>
                        <span className={cn(
                          "text-sm font-medium",
                          plan.popular ? "text-background/90" : "text-muted-foreground"
                        )}>
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <MagneticButton
                    variant={plan.popular ? "secondary" : "primary"}
                    size="lg"
                    className={cn(
                      "w-full font-semibold",
                      plan.popular
                        ? "bg-background text-foreground hover:bg-background/90 shadow-lg"
                        : "hover:shadow-lg"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (plan.planId !== 'free') {
                        setUpgradeModal({ open: true, plan: plan.planId });
                      } else if (!user) {
                        navigate('/auth');
                      }
                    }}
                  >
                    {subscribedPlan === plan.planId ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Current Plan
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {plan.cta}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </MagneticButton>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust badge */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              Secure payment powered by Razorpay • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent" />
        <motion.div
          className="container mx-auto max-w-3xl text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Humanize?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of writers, marketers, and creators who trust our tool.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton
              size="xl"
              onClick={() => document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Free Now
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>
            <MagneticButton variant="secondary" size="xl">
              View Documentation
            </MagneticButton>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border/30 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-background" />
                </div>
                <span className="font-display font-bold text-xl">Humanizer.ai</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transform AI text into authentic, human-like content effortlessly.
              </p>
            </div>

            {[
              { title: 'Product', links: ['AI Humanizer', 'AI Detector', 'Pricing', 'API'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookie Policy'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="hover:text-foreground transition-colors underline-animated">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Humanizer.ai. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['twitter', 'github', 'linkedin'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-5 h-5 rounded-full bg-muted-foreground/20" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Feature Modal */}
      <Modal
        isOpen={featureModal.open}
        onClose={() => setFeatureModal({ open: false, feature: null })}
        title={featureModal.feature?.title}
      >
        {featureModal.feature && (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center">
              <featureModal.feature.icon className="w-8 h-8 text-foreground" />
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {featureModal.feature.details}
            </p>
            <MagneticButton onClick={() => setFeatureModal({ open: false, feature: null })}>
              Got it
            </MagneticButton>
          </div>
        )}
      </Modal>

      {/* Pricing Modal */}
      <Modal
        isOpen={pricingModal.open}
        onClose={() => setPricingModal({ open: false, plan: null })}
        title={pricingModal.plan?.name + ' Plan'}
      >
        {pricingModal.plan && (
          <div className="space-y-6">
            <div className="text-4xl font-bold">
              {pricingModal.plan.price}
              {pricingModal.plan.price !== 'Custom' && <span className="text-lg text-muted-foreground">/month</span>}
            </div>
            <p className="text-muted-foreground">{pricingModal.plan.description}</p>
            <ul className="space-y-3">
              {pricingModal.plan.features.map((feature: string, i: number) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <MagneticButton
              size="lg"
              className="w-full"
              onClick={() => {
                setPricingModal({ open: false, plan: null });
                if (pricingModal.plan.planId !== 'free') {
                  setUpgradeModal({ open: true, plan: pricingModal.plan.planId });
                }
              }}
            >
              {pricingModal.plan.cta}
            </MagneticButton>
          </div>
        )}
      </Modal>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModal.open}
        onClose={() => setUpgradeModal({ ...upgradeModal, open: false })}
        plan={upgradeModal.plan}
        onSuccess={async (plan) => {
          // Update profile in database
          if (user) {
            await supabase
              .from('profiles')
              .update({ subscribed_plan: plan })
              .eq('id', user.id);
            await refreshProfile();
          }
          setLevel(plan);
          toast({
            title: `🎉 Welcome to ${plan.charAt(0).toUpperCase() + plan.slice(1)}!`,
            description: `You now have access to ${plan} humanization mode.`,
          });
        }}
      />
    </div>
  );
};

export default Index;
