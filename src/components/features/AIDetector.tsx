import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle2, Copy, Check, Trash2, FileText, ChevronDown, BarChart3, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MagneticButton } from '@/components/common';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useModals } from '@/hooks/use-modals';
import { useNavigate } from 'react-router-dom';

interface SentenceAnalysis {
  text: string;
  score: number;
  flags: string[];
}

interface DetectionResult {
  overallScore: number;
  verdict: 'human' | 'mixed' | 'ai';
  confidence: number;
  sentenceAnalysis: SentenceAnalysis[];
  patterns: {
    name: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  summary: string;
}

export const AIDetector = () => {
  // removed useToast
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSentences, setShowSentences] = useState(false);
  const { user } = useAuth();
  const { openModal } = useModals();
  const navigate = useNavigate();
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingSteps = ['Reading your text...', 'Making it smooth...', 'Adding a human touch...', 'Almost there...'];

  const wordCount = inputText.trim().split(/\s+/).filter(w => w).length;

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast.error("Empty input", {
        description: "Please enter some text to analyze.",
      });
      return;
    }

    if (!user) {
      openModal('auth-required', {
        onConfirm: () => navigate('/auth')
      });
      return;
    }

    if (wordCount < 30) {
      toast.error("Text too short", {
        description: "Please enter at least 30 words for accurate detection.",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setLoadingStep(0);

    // Animate loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const { data, error } = await supabase.functions.invoke('ai-detector', {
        body: { text: inputText },
      });

      if (error) throw error;

      setResult(data);
      
      const hasShownFeedback = localStorage.getItem('hasShownDetectorFeedback');
      if (!hasShownFeedback) {
        openModal('generic-success', {
          title: 'Analysis Done!',
          message: 'Your first scan is finished. We\'ve looked at the patterns and the style of your writing to see how it looks.'
        });
        localStorage.setItem('hasShownDetectorFeedback', 'true');
      } else {
        toast.info("Scan Finished", {
          description: `This looks like it has a ${data.overallScore}% chance of being AI.`,
        });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze text.';
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsAnalyzing(false);
      setLoadingStep(0);
      clearInterval(stepInterval);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setShowSentences(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    const reportText = `AI Detection Report\n${'='.repeat(40)}\n\nOverall Score: ${result.overallScore}% AI Probability\nVerdict: ${result.verdict.toUpperCase()}\nConfidence: ${result.confidence}%\n\nSummary:\n${result.summary}\n\nPatterns Detected:\n${result.patterns.map(p => `- ${p.name}: ${p.description}`).join('\n')}`;
    await navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied!", { description: "Report copied to clipboard." });
  };

  const handleTrySample = () => {
    setInputText(`Artificial intelligence has revolutionized the way we live and work. Machine learning algorithms can now process vast amounts of data and identify patterns that would be impossible for humans to detect. This technology is being applied across various industries, from healthcare to finance, transforming traditional business models. The integration of AI systems into everyday applications has made our lives more convenient and efficient. These systems can automate repetitive tasks, freeing up human workers to focus on more creative and strategic activities. As AI continues to evolve, we can expect even more significant advancements in the years to come.`);
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'human': return 'text-green-500';
      case 'mixed': return 'text-yellow-500';
      case 'ai': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getVerdictBg = (verdict: string) => {
    switch (verdict) {
      case 'human': return 'bg-green-500/10 border-green-500/30';
      case 'mixed': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'ai': return 'bg-red-500/10 border-red-500/30';
      default: return 'bg-secondary';
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 30) return 'bg-green-500';
    if (score <= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <div className="relative rounded-3xl overflow-hidden shadow-xl">
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-foreground/20 via-foreground/5 to-transparent pointer-events-none" />

        <div className="relative bg-card/80 backdrop-blur-xl border border-border/30 rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 lg:p-6 border-b border-border/30 bg-secondary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">AI Checker</h3>
                <p className="text-xs text-muted-foreground">Free and unlimited</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-secondary/30" />
                    <motion.circle 
                      cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="3" 
                      className={cn("text-foreground", wordCount < 30 && "text-orange-500")}
                      initial={{ strokeDasharray: "100 100", strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 100 - Math.min((wordCount / 100) * 100, 100) }}
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold">{wordCount < 30 ? wordCount : '100%'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">{wordCount} / 30 words</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Words needed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/30">
            <div className="relative flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between p-4 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold tracking-tight">Your text</span>
                </div>
                {inputText && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClear} 
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
                placeholder="Paste text here to check if it was written by AI... (minimum 30 words)"
                className="flex-1 border-0 rounded-none bg-transparent resize-none focus:ring-0 text-base p-6 placeholder:opacity-30"
              />
              {!inputText && (
                <div className="absolute inset-0 top-[57px] flex flex-col items-center justify-center gap-6 pointer-events-none">
                  <div className="w-16 h-16 rounded-3xl bg-secondary/50 flex items-center justify-center text-muted-foreground/20">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
                    <MagneticButton variant="secondary" onClick={handleTrySample} className="bg-background shadow-md border-border/10">Try Sample Text</MagneticButton>
                  </div>
                </div>
              )}
            </div>

            <div className="relative flex flex-col min-h-[400px] bg-secondary/10">
              <div className="flex items-center justify-between p-4 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Detection Results</span>
                </div>
                {result && (
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-2 rounded-full">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy results'}
                  </Button>
                )}
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center h-full gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-2 border-foreground/5" />
                      <motion.div 
                        className="absolute inset-0 rounded-full border-t-2 border-foreground"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-foreground animate-pulse" />
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
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Looking for patterns</p>
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
                ) : result ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div className={cn("p-6 lg:p-8 rounded-3xl border transition-all shadow-lg", getVerdictBg(result.verdict))}>
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
                          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl", 
                            result.verdict === 'human' ? 'bg-green-500 text-white' : 
                            result.verdict === 'mixed' ? 'bg-yellow-500 text-white' : 
                            'bg-red-500 text-white')}
                          >
                            {result.verdict === 'human' && <CheckCircle2 className="w-8 h-8" />}
                            {result.verdict === 'mixed' && <AlertTriangle className="w-8 h-8" />}
                            {result.verdict === 'ai' && <Shield className="w-8 h-8" />}
                          </div>
                          <div>
                            <p className={cn("text-2xl lg:text-3xl font-display font-bold capitalize mb-1", getVerdictColor(result.verdict))}>
                              {result.verdict === 'ai' ? 'AI Written' : result.verdict === 'mixed' ? 'A bit of both' : 'Human Written'}
                            </p>
                            <p className="text-sm font-medium text-muted-foreground/80">{result.confidence}% sure</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-5xl lg:text-6xl font-display font-bold">{result.overallScore}<span className="text-2xl opacity-30">%</span></p>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">AI Score</p>
                        </div>
                      </div>
                      <div className="h-3 bg-secondary/30 rounded-full overflow-hidden">
                        <div className={cn("h-full transition-all duration-1000", getScoreColor(result.overallScore))} style={{ width: `${result.overallScore}%` }} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs uppercase font-bold text-muted-foreground">Summary</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
                    </div>

                    {result.patterns.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs uppercase font-bold text-muted-foreground">Patterns Detected</p>
                        <div className="space-y-2">
                          {result.patterns.map((p, i) => (
                            <div key={i} className={cn("p-3 rounded-xl border flex items-start gap-3 text-sm", 
                              p.severity === 'high' ? 'bg-red-500/5 border-red-500/20' : 
                              p.severity === 'medium' ? 'bg-yellow-500/5 border-yellow-500/20' : 
                              'bg-secondary/50 border-border/30')}
                            >
                              <div className="pt-0.5">
                                <FileText className={cn("w-4 h-4", p.severity === 'high' ? 'text-red-500' : p.severity === 'medium' ? 'text-yellow-500' : 'text-muted-foreground')} />
                              </div>
                              <div>
                                <p className="font-bold">{p.name}</p>
                                <p className="text-xs text-muted-foreground">{p.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.sentenceAnalysis.length > 0 && (
                      <div className="space-y-3">
                        <button onClick={() => setShowSentences(!showSentences)} className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase">
                          <ChevronDown className={cn("w-4 h-4 transition-transform", showSentences && "rotate-180")} />
                          Sentence Details ({result.sentenceAnalysis.length})
                        </button>
                        {showSentences && (
                          <div className="space-y-2">
                            {result.sentenceAnalysis.map((s, i) => (
                              <div key={i} className={cn("p-4 rounded-xl border text-sm transition-all", 
                                s.score >= 70 ? 'bg-red-500/5 border-red-500/20' : 
                                s.score >= 40 ? 'bg-yellow-500/5 border-yellow-500/20' : 
                                'bg-green-500/5 border-green-500/20')}
                              >
                                <div className="flex items-center gap-2 mb-2 font-bold text-[10px] uppercase">
                                  <span className={cn("px-2 py-0.5 rounded-full", 
                                    s.score >= 70 ? 'bg-red-500/10 text-red-500' : 
                                    s.score >= 40 ? 'bg-yellow-500/10 text-yellow-500' : 
                                    'bg-green-500/10 text-green-500')}
                                  >
                                    {s.score}% AI
                                  </span>
                                  {s.flags.map((f, idx) => <span key={idx} className="bg-foreground/5 px-1.5 py-0.5 rounded">{f}</span>)}
                                </div>
                                <p className="leading-relaxed opacity-90">{s.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Shield className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">Your results will show up here</p>
                    <p className="text-xs text-muted-foreground mt-1">Paste at least 30 words to start</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6 bg-secondary/20 border-t border-border/30">
            <MagneticButton 
              size="xl" 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || wordCount < 30} 
              className="w-full sm:w-auto min-w-[220px]"
            >
              {isAnalyzing ? "One moment..." : (
                <>
                  {!user ? <Lock className="w-4 h-4 mr-2" /> : <Shield className="w-5 h-5 mr-2" />}
                  {!user ? "Sign in to check" : "Check for AI"}
                </>
              )}
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDetector;
