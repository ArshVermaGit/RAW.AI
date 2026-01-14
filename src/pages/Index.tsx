import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy, Check, Sparkles, ArrowRight, Zap, Shield, Brain,
  Wand2, Globe, Target, Award, Menu, X, ClipboardPaste,
  Play, Rocket, Star, ChevronDown, Eye, FileText, Lock, Crown, LogOut, User, Settings, LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DynamicHeroText } from '@/components/DynamicHeroText';
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
import { useModals } from '@/hooks/use-modals';
import { AIDetector } from '@/components/AIDetector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  
  const { openModal } = useModals();

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
      openModal('auth-required', {
        onConfirm: () => navigate('/auth')
      });
      return;
    }

    // Check remaining words for authenticated users
    if (user && planLimit < Number.MAX_SAFE_INTEGER && wordCount > remaining) {
      openModal('limit-reached', {
        onConfirm: () => openModal(subscribedPlan === 'free' ? 'pricing-pro' : 'pricing-ultra')
      });
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
          openModal('limit-reached', {
            onConfirm: () => openModal(subscribedPlan === 'free' ? 'pricing-pro' : 'pricing-ultra')
          });
          return;
        }
        if (data.requiresAuth) {
          openModal('auth-required', {
            onConfirm: () => navigate('/auth')
          });
          return;
        }
        if (data.requiresUpgrade) {
          openModal('limit-reached', {
            onConfirm: () => openModal(data.requiredPlan === 'pro' ? 'pricing-pro' : 'pricing-ultra')
          });
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

  const wordCountIn = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCountIn = inputText.length;

  const featuresList = [
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

  const pricingPlans = [
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

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Static grid background */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="RAW.AI" className="w-8 h-8 object-contain invert dark:invert-0" />
                </div>
                <div className="absolute -inset-1 bg-foreground/20 rounded-xl blur-md -z-10" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">RAW<span className="text-muted-foreground">.AI</span></span>
            </div>

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
      </nav>

      <section className="pt-44 pb-24 px-6 relative overflow-hidden grain-texture">
        {/* Ambient Lights */}
        <div className="ambient-light -top-[10%] -left-[10%] opacity-40" />
        <div className="ambient-light top-[20%] -right-[20%] opacity-20" style={{ animationDelay: '-5s' } as React.CSSProperties} />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col items-center">
            <DynamicHeroText />

            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full max-w-4xl border-t border-border/10 pt-16">
              {[
                { value: '99.9%', label: 'Bypass Rate' },
                { value: '50K+', label: 'Global Users' },
                { value: '10M+', label: 'Words Processed' },
                { value: '24/7', label: 'Pro Support' },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.8 }}
                  className="flex flex-col items-center md:items-start"
                >
                  <div className="text-3xl md:text-4xl font-bold tracking-tighter mb-1 font-display">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/30">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tool Hub Section */}
      <section id="converter" className="pb-20 px-6 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <Tabs defaultValue="humanizer" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-secondary/40 backdrop-blur-xl border border-border/50 p-1.5 rounded-full h-14 w-full max-w-[400px]">
                <TabsTrigger 
                  value="humanizer" 
                  className="rounded-full flex-1 h-full font-semibold text-sm data-[state=active]:bg-foreground data-[state=active]:text-background transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Humanizer
                </TabsTrigger>
                <TabsTrigger 
                  value="detector" 
                  className="rounded-full flex-1 h-full font-semibold text-sm data-[state=active]:bg-foreground data-[state=active]:text-background transition-all duration-300"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  AI Detector
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="humanizer" className="focus-visible:ring-0 focus-visible:outline-none">
              <div className="relative rounded-3xl overflow-hidden bg-card/80 backdrop-blur-xl border border-border/30">
                {user && (
                  <div className="p-4 lg:p-6 border-b border-border/30 bg-primary/5">
                    <UsageIndicator onUpgrade={() => openModal(subscribedPlan === 'free' ? 'pricing-pro' : 'pricing-ultra')} />
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 lg:p-6 border-b border-border/30 bg-secondary/20">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">Level:</span>
                    <div className="flex flex-wrap items-center gap-2 p-1 bg-background/40 backdrop-blur-md rounded-full border border-border/40">
                      {(['lite', 'pro', 'ultra'] as Level[]).map((l) => {
                        const isLocked = (l === 'pro' && subscribedPlan === 'free') || (l === 'ultra' && subscribedPlan !== 'ultra');
                        const isActive = level === l;
                        return (
                          <button
                            key={l}
                            onClick={() => isLocked ? openModal(l as 'pricing-pro' | 'pricing-ultra') : setLevel(l)}
                            className={cn(
                              "relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all",
                              isActive ? "bg-foreground text-background shadow-lg" : "text-muted-foreground hover:text-foreground",
                              isLocked && "opacity-60"
                            )}
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              {l === 'lite' && <Zap className="w-3.5 h-3.5" />}
                              {l === 'pro' && <Sparkles className="w-3.5 h-3.5" />}
                              {l === 'ultra' && <Rocket className="w-3.5 h-3.5" />}
                              <span className="capitalize">{l}</span>
                              {isLocked && <Lock className="w-3 h-3 opacity-50" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {subscribedPlan !== 'free' && (
                      <Button variant="ghost" size="sm" onClick={() => setShowModelSelector(!showModelSelector)} className="gap-2 text-muted-foreground hover:text-foreground">
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Model</span>
                      </Button>
                    )}
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{wordCountIn}</span> words · <span className="font-medium">{charCountIn}</span> chars
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {showModelSelector && subscribedPlan !== 'free' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-b border-border/30">
                      <div className="p-4 lg:p-6 bg-secondary/10">
                        <ModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} onUpgrade={(plan) => openModal(plan === 'pro' ? 'pricing-pro' : 'pricing-ultra')} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/30">
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
                    {!inputText && (
                      <div className="absolute inset-0 top-[57px] flex flex-col items-center justify-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center text-muted-foreground/50">
                          <ClipboardPaste className="w-8 h-8" />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <MagneticButton variant="secondary" size="lg" onClick={handlePaste} className="bg-background shadow-md">
                            <ClipboardPaste className="w-4 h-4" />
                            Paste Text
                          </MagneticButton>
                          <MagneticButton variant="ghost" size="lg" onClick={handleTrySample} className="hover:bg-secondary">
                            <Play className="w-4 h-4" />
                            Try Sample
                          </MagneticButton>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative flex flex-col min-h-[350px] bg-secondary/10">
                    <div className="flex items-center justify-between p-4 border-b border-border/30">
                      <div className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">Human Text</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!outputText} className="gap-2 h-8 rounded-full">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <div className="flex-1 p-6">
                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                          <div className="w-16 h-16 rounded-full border-2 border-foreground/20 animate-spin" />
                          <p className="text-sm text-muted-foreground">Humanizing your text...</p>
                        </div>
                      ) : outputText ? (
                        <div>
                          <p className="text-base lg:text-lg leading-relaxed whitespace-pre-wrap font-medium text-foreground/90">{outputText}</p>
                          <div className="mt-8 pt-6 border-t border-border/30 space-y-6">
                            <div className="p-4 rounded-2xl bg-background/50 border border-border/50">
                              <ScoreDisplay
                                score={Number(humanScore) || 0}
                                label="Human Content Score"
                                variant={typeof humanScore === 'number' && humanScore >= 90 ? "success" : typeof humanScore === 'number' && humanScore >= 70 ? "warning" : "danger"}
                              />
                            </div>
                            {improvements.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Improvements Made</p>
                                <ul className="space-y-1">
                                  {improvements.map((improvement, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                      <span>{improvement}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
                            <Wand2 className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground">Your humanized text will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6 bg-secondary/20 border-t border-border/30">
                  <MagneticButton size="xl" onClick={handleHumanize} disabled={isLoading || !inputText.trim()} className="w-full sm:w-auto min-w-[220px]">
                    {isLoading ? "Processing..." : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Humanize Text
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </MagneticButton>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="detector" className="focus-visible:ring-0 focus-visible:outline-none">
              <AIDetector />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Trusted By Marquee */}
      <TrustedByMarquee />

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4 block">Features</span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Why Choose <span className="text-gradient-animated">RAW.AI</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Transform AI content into natural, reader-friendly writing with our advanced technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresList.map((feature, index) => (
              <InteractiveCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                onClick={() => setFeatureModal({ open: true, feature })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4 block">Examples</span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              See the <span className="text-gradient-animated">Difference</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-card/50 border border-destructive/30">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-destructive/10 text-destructive">AI Detected</span>
                <span className="text-sm text-muted-foreground">GPT-4</span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                "Nature is the foundation of human life, providing us with clean air, fresh water, food, and countless resources. Yet, modern development has placed heavy pressure on the environment. Forests are being cut down, rivers are polluted, and wildlife is losing its habitat."
              </p>
              <ScoreDisplay score={100} label="AI Detected" variant="danger" />
            </div>
            <div className="p-8 rounded-2xl bg-card/50 border border-success/30">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-success/10 text-success">Human-like</span>
                <span className="text-sm text-muted-foreground">Humanized</span>
              </div>
              <p className="text-foreground leading-relaxed mb-6">
                "Nature supports all human life and gives us the things we need to survive. It gives us clean air, good water, food, and many other things. But in today's world, new inventions are putting a lot of pressure on nature. Trees are being cut, rivers are being polluted, and animals are losing their home."
              </p>
              <ScoreDisplay score={98} label="Human Score" variant="success" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4 block">Process</span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">3 Simple Steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Paste Your Text', desc: 'Copy your AI content and paste it into our editor.', icon: ClipboardPaste },
              { num: '02', title: 'Click Humanize', desc: 'Choose your settings and transform your text.', icon: Wand2 },
              { num: '03', title: 'Copy & Use', desc: 'Get natural content ready to publish anywhere.', icon: Copy },
            ].map((step, i) => (
              <div key={i} className="relative p-8 rounded-2xl bg-card/30 border border-border/30 group hover:bg-card/50 transition-all">
                <span className="absolute top-6 right-6 text-6xl font-bold text-foreground/5">{step.num}</span>
                <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center mb-6">
                  <step.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 relative z-10 overflow-hidden bg-foreground text-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-wider opacity-60 mb-4 block">Testimonials</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Loved by Creators</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "I always refine drafts to make them more engaging. This tool helps polish my words while keeping my style intact.", author: "Emily D.", role: "Content Writer" },
              { quote: "In SEO, originality is crucial. This tool helped me produce materials that improved my website ranking significantly.", author: "Michael L.", role: "SEO Expert" },
              { quote: "Running a blog requires lots of high-quality articles. This lets me quickly generate content that sounds natural.", author: "Lisa W.", role: "Blogger" },
            ].map((testimonial, i) => (
              <div key={i} className="p-8 rounded-2xl border border-background/20 bg-background/5 backdrop-blur-sm">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <blockquote className="leading-relaxed mb-8 opacity-90">"{testimonial.quote}"</blockquote>
                <div className="flex items-center gap-4 pt-6 border-t border-background/20">
                  <div className="w-12 h-12 rounded-full bg-background/20 flex items-center justify-center font-bold">{testimonial.author.charAt(0)}</div>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm opacity-60">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4 px-4 py-2 bg-card/50 rounded-full border border-border/30">
              <Crown className="w-3 h-3" /> Pricing
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Choose Your Plan</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={cn("group relative rounded-3xl p-8 border-2 transition-all", plan.popular ? "bg-foreground text-background border-foreground shadow-2xl scale-105 z-10" : "bg-card/60 border-border/50")}>
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background text-foreground text-[10px] font-black uppercase px-3 py-1 rounded-full border border-border/30">Most Popular</div>}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm opacity-70">{plan.description}</p>
                </div>
                <div className="mb-8 pb-8 border-b border-current/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.price !== '$0' && <span className="text-base opacity-70">/mo</span>}
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <MagneticButton variant={plan.popular ? "secondary" : "primary"} className="w-full" onClick={() => (plan.planId === 'pro' || plan.planId === 'ultra') ? openModal(plan.planId === 'pro' ? 'pricing-pro' : 'pricing-ultra') : !user && navigate('/auth')}>
                  {plan.cta}
                </MagneticButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Ready to Humanize?</h2>
          <p className="text-lg text-muted-foreground mb-10">Join thousands of creators who trust our tool.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton size="xl" onClick={() => document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' })}>
              Start Free Now <ArrowRight className="w-5 h-5 ml-2" />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-display font-bold text-xl">RAW.AI</span>
              </div>
              <p className="text-sm text-muted-foreground">Transform AI text into authentic content.</p>
            </div>
            {[
              { title: 'Product', links: ['AI Humanizer', 'AI Detector'] },
              { title: 'Legal', links: ['Privacy', 'Terms'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {col.links.map((l, j) => <li key={j}><a href="#" className="hover:text-foreground">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-border/30 flex justify-between items-center text-sm text-muted-foreground">
            <p>© 2026 RAW.AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Modal isOpen={featureModal.open} onClose={() => setFeatureModal({ open: false, feature: null })} title={featureModal.feature?.title}>
        {featureModal.feature && (
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">{featureModal.feature.details}</p>
            <MagneticButton onClick={() => setFeatureModal({ open: false, feature: null })}>Got it</MagneticButton>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Index;
