import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, Check, Sparkles, ArrowRight, Zap, 
  Wand2, Trash2, ClipboardPaste, Play, Settings,
  FileText, Rocket, Lock, Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MagneticButton } from '@/components/MagneticButton';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { UsageIndicator } from '@/components/UsageIndicator';
import { ModelSelector, AIModel } from '@/components/ModelSelector';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useUsage } from '@/hooks/useUsage';
import { cn } from '@/lib/utils';
import { useModals } from '@/hooks/use-modals';

type Level = 'lite' | 'pro' | 'ultra';
type SubscribedPlan = 'free' | 'pro' | 'ultra';

export const HumanizerTool = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [humanScore, setHumanScore] = useState<number | null>(null);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [level, setLevel] = useState<Level>('lite');
  const [style, setStyle] = useState('general');
  const [selectedModel, setSelectedModel] = useState<AIModel>('gpt-4o-mini');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingSteps = ['Reading your text...', 'Making it smooth...', 'Adding a human touch...', 'Almost there...'];
  
  const { openModal } = useModals();
  const { user, profile, session } = useAuth();
  const navigate = useNavigate();
  const { remaining, refetch: refetchUsage, planLimit } = useUsage();

  const subscribedPlan: SubscribedPlan = profile?.subscribed_plan || 'free';

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      toast.error("Empty input", {
        description: "Please enter some text to humanize.",
      });
      return;
    }

    const wordCount = inputText.trim().split(/\s+/).length;

    // Check authentication for all usage
    if (!user) {
      openModal('auth-required', {
        onConfirm: () => navigate('/auth')
      });
      return;
    }

    // Check remaining words for authenticated users
    if (user && planLimit < Number.MAX_SAFE_INTEGER && remaining <= 0) {
      openModal('limit-reached', {
        onConfirm: () => openModal(subscribedPlan === 'free' ? 'pricing-pro' : 'pricing-ultra')
      });
      return;
    }

    if (user && planLimit < Number.MAX_SAFE_INTEGER && wordCount > remaining) {
      toast.error("Insufficient words", {
        description: `You only have ${remaining} words left. Reduce text size or upgrade.`,
      });
      openModal('limit-reached', {
        onConfirm: () => openModal(subscribedPlan === 'free' ? 'pricing-pro' : 'pricing-ultra')
      });
      return;
    }

    setIsLoading(true);
    setLoadingStep(0);
    // const loadingSteps = ['Reading your text...', 'Making it smooth...', 'Adding a human touch...', 'Almost there...'];
    
    // Animate loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1200);
    
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
          style: style,
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

      // Show feedback modal for first usage
      const hasShownFeedback = localStorage.getItem('hasShownHumanizerFeedback');
      if (!hasShownFeedback) {
        openModal('generic-success', {
          title: 'All Ready!',
          message: 'Your first piece is humanized and ready to go. We\'ve made sure it sounds natural and flows perfectly.'
        });
        localStorage.setItem('hasShownHumanizerFeedback', 'true');
      } else {
        toast.success("✨ Text is Ready!", {
          description: `Score: ${data.humanScore}% - Your writing now sounds natural.`,
        });
      }
    } catch (error) {
      console.error('Humanization error:', error);
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to humanize text. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
      clearInterval(stepInterval);
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast.success("📋 Copied!", { description: "Text copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      toast.success("📝 Pasted!", { description: "Text pasted from clipboard." });
    } catch {
      toast.error("Error", { description: "Could not access clipboard." });
    }
  };

  const handleTrySample = () => {
    setInputText(`Artificial intelligence has significantly transformed various industries, enabling organizations to optimize their operations and enhance productivity. The implementation of machine learning algorithms facilitates the automation of complex tasks, thereby reducing operational costs and improving efficiency. Furthermore, AI-driven analytics provide valuable insights that assist in strategic decision-making processes.`);
  };

  const wordCountIn = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  return (
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
            <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Style:</span>
            <div className="flex flex-wrap items-center gap-2 p-1 bg-background/40 backdrop-blur-md rounded-full border border-border/40">
                {['general', 'business', 'academic', 'casual', 'creative'].map((s) => (
                <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold transition-all capitalize",
                    style === s ? "bg-foreground text-background shadow-lg" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {s}
                </button>
                ))}
            </div>
            </div>
            <div className="flex items-center gap-4">
            {subscribedPlan !== 'free' && (
                <Button variant="ghost" size="sm" onClick={() => setShowModelSelector(!showModelSelector)} className="gap-2 text-muted-foreground hover:text-foreground">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Model</span>
                </Button>
            )}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                <div className="relative w-10 h-10 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-secondary/30" />
                    <motion.circle 
                        cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="3" 
                        className={cn("text-foreground", wordCountIn > 1500 && "text-destructive")}
                        initial={{ strokeDasharray: "100 100", strokeDashoffset: 100 }}
                        animate={{ strokeDashoffset: 100 - Math.min((wordCountIn / 2000) * 100, 100) }}
                    />
                    </svg>
                    <span className="absolute text-[10px] font-bold">{Math.round((wordCountIn / 2000) * 100)}%</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">{wordCountIn} words</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Input size</span>
                </div>
                </div>
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
                    <span className="text-sm font-semibold tracking-tight">AI Generated Text</span>
                </div>
                {inputText && (
                    <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => { setInputText(''); setOutputText(''); setHumanScore(null); }} 
                    className="h-8 gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-full"
                    >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear
                    </Button>
                )}
                </div>
            <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your AI-generated text here..."
                className="flex-1 border-0 rounded-none bg-transparent resize-none focus:ring-0 text-base p-6 placeholder:opacity-30"
            />
            {!inputText && (
                <div className="absolute inset-0 top-[57px] flex flex-col items-center justify-center gap-6 pointer-events-none">
                <div className="w-16 h-16 rounded-3xl bg-secondary/50 flex items-center justify-center text-muted-foreground/20">
                    <ClipboardPaste className="w-8 h-8" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
                    <MagneticButton 
                    variant="secondary" 
                    size="lg" 
                    onClick={handlePaste} 
                    className="bg-background shadow-md border-border/10"
                    >
                    <ClipboardPaste className="w-4 h-4" />
                    Paste Text
                    </MagneticButton>
                    <MagneticButton 
                    variant="ghost" 
                    size="lg" 
                    onClick={handleTrySample} 
                    className="hover:bg-secondary/80"
                    >
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
                    <Brain className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold tracking-tight">Humanized Result</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!outputText} className="gap-2 h-8 rounded-full bg-background/50 border border-border/30">
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-xs font-bold">{copied ? 'Copied!' : 'Copy'}</span>
                    </Button>
                </div>
                </div>
            <div className="flex-1 p-6">
                {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-6">
                    <div className="relative">
                    <div className="w-20 h-20 rounded-full border-2 border-foreground/5" />
                    <motion.div 
                        className="absolute inset-0 rounded-full border-t-2 border-foreground"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-foreground animate-pulse" />
                    </div>
                    </div>
                    <div className="text-center space-y-2">
                    <motion.p 
                        key={loadingStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm font-bold tracking-tight text-foreground"
                    >
                        {loadingSteps[loadingStep]}
                    </motion.p>
                    <p className="text-xs text-muted-foreground font-medium">Using {level.toUpperCase()} mode</p>
                    </div>
                    <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-foreground"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(loadingStep + 1) / loadingSteps.length * 100}%` }}
                        transition={{ duration: 1.2 }}
                    />
                    </div>
                </div>
                ) : outputText ? (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex flex-col"
                >
                    <p className="text-base lg:text-lg leading-relaxed whitespace-pre-wrap font-medium text-foreground/90 flex-1">{outputText}</p>
                    <div className="mt-8 pt-6 border-t border-border/30 space-y-6">
                    <div className="p-4 rounded-2xl bg-background/50 border border-border/50">
                        <ScoreDisplay
                        score={Number(humanScore) || 0}
                        label="Human Touch Score"
                        variant={typeof humanScore === 'number' && humanScore >= 90 ? "success" : typeof humanScore === 'number' && humanScore >= 70 ? "warning" : "danger"}
                        />
                    </div>
                    {improvements.length > 0 && (
                        <div className="space-y-2">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Changes We Made</p>
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
                </motion.div>
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
            <div className="w-full sm:w-auto relative group">
            {user && remaining <= 0 && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold uppercase rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                Limit Reached - Upgrade to Continue
                </div>
            )}
            <MagneticButton 
                size="xl" 
                onClick={handleHumanize} 
                disabled={isLoading || (user && remaining <= 0)} 
                className={cn(
                "w-full sm:w-auto min-w-[220px]",
                user && remaining <= 0 && "opacity-50 grayscale cursor-not-allowed"
                )}
            >
                {isLoading ? "One moment..." : (
                <>
                    {!user ? <Lock className="w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    {!user ? "Sign in to humanize" : (user && remaining <= 0 ? "Out of words" : "Make it human")}
                    {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </>
                )}
            </MagneticButton>
            </div>
        </div>
    </div>
  );
};
