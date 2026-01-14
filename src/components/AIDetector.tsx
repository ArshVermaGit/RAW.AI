import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle2, Copy, Check, Trash2, Info, FileText, ChevronDown, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MagneticButton } from '@/components/MagneticButton';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSentences, setShowSentences] = useState(false);

  const wordCount = inputText.trim().split(/\s+/).filter(w => w).length;
  const charCount = inputText.length;

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (wordCount < 30) {
      toast({
        title: "Text too short",
        description: "Please enter at least 30 words for accurate detection.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-detector', {
        body: { text: inputText },
      });

      if (error) throw error;

      setResult(data);
      toast({
        title: "Analysis Complete",
        description: `Detection score: ${data.overallScore}% AI probability`,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze text.';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
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
    toast({ title: "Copied!", description: "Report copied to clipboard." });
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 lg:p-6 border-b border-border/30 bg-secondary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">AI Content Detector</h3>
                <p className="text-xs text-muted-foreground">Unlimited • No restrictions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground px-3 py-1.5 bg-secondary/50 rounded-full border border-border/30">
                <span className="font-medium">{wordCount}</span> words · <span className="font-medium">{charCount}</span> chars
              </div>
              {inputText && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-9 px-3 text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/30">
            {/* Input */}
            <div className="relative flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between p-4 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Text to Analyze</span>
                </div>
              </div>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste text here to check if it was written by AI... (minimum 30 words)"
                className="flex-1 border-0 rounded-none bg-transparent resize-none focus:ring-0 text-base p-6"
              />
              {/* Empty state */}
              <AnimatePresence>
                {!inputText && (
                  <motion.div
                    className="absolute inset-0 top-[57px] flex flex-col items-center justify-center gap-4 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="pointer-events-auto">
                      <MagneticButton variant="secondary" onClick={handleTrySample}>
                        Try Sample Text
                      </MagneticButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results */}
            <div className="relative flex flex-col min-h-[400px] bg-secondary/10">
              <div className="flex items-center justify-between p-4 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Detection Results</span>
                </div>
                {result && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 gap-2 rounded-full"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Report'}
                  </Button>
                )}
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {isAnalyzing ? (
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
                        <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Analyzing text...</p>
                        <p className="text-xs text-muted-foreground">Checking for AI patterns</p>
                      </div>
                    </motion.div>
                  ) : result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Verdict Card */}
                      <div className={cn("p-6 lg:p-8 rounded-[2rem] border transition-all duration-500", getVerdictBg(result.verdict))}>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
                            <motion.div 
                              className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg", 
                                result.verdict === 'human' ? 'bg-green-500/20 shadow-green-500/10' : 
                                result.verdict === 'mixed' ? 'bg-yellow-500/20 shadow-yellow-500/10' : 
                                'bg-red-500/20 shadow-red-500/10'
                              )}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 200, damping: 12 }}
                            >
                              {result.verdict === 'human' && <CheckCircle2 className="w-8 h-8 text-green-500" />}
                              {result.verdict === 'mixed' && <AlertTriangle className="w-8 h-8 text-yellow-500" />}
                              {result.verdict === 'ai' && <Shield className="w-8 h-8 text-red-500" />}
                            </motion.div>
                            <div>
                              <motion.p 
                                className={cn("text-2xl lg:text-3xl font-display font-bold capitalize tracking-tight mb-1", getVerdictColor(result.verdict))}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                              >
                                {result.verdict === 'ai' ? 'AI Generated' : result.verdict === 'mixed' ? 'Mixed Content' : 'Human Written'}
                              </motion.p>
                              <p className="text-sm font-medium text-muted-foreground/80">{result.confidence}% confidence score</p>
                            </div>
                          </div>
                          <div className="relative flex flex-col items-center justify-center min-w-[120px]">
                            <motion.p 
                              className="text-5xl lg:text-6xl font-display font-bold tracking-tighter"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.8, type: "spring" }}
                            >
                              {result.overallScore}<span className="text-2xl lg:text-3xl opacity-30">%</span>
                            </motion.p>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mt-1">AI Probability</p>
                          </div>
                        </div>
                        {/* Score bar */}
                        <div className="relative h-4 bg-secondary/30 rounded-full overflow-hidden backdrop-blur-sm">
                          <motion.div
                            className={cn("absolute inset-y-0 left-0 rounded-full shadow-lg", getScoreColor(result.overallScore))}
                            initial={{ width: 0 }}
                            animate={{ width: `${result.overallScore}%` }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
                          </motion.div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Summary</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
                      </div>

                      {/* Patterns Detected */}
                      {result.patterns.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Patterns Detected</p>
                          <div className="space-y-2">
                            {result.patterns.map((pattern, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={cn(
                                  "p-3 rounded-xl border flex items-start gap-3",
                                  pattern.severity === 'high' ? 'bg-red-500/5 border-red-500/20' :
                                  pattern.severity === 'medium' ? 'bg-yellow-500/5 border-yellow-500/20' :
                                  'bg-secondary/50 border-border/30'
                                )}
                              >
                                <Info className={cn(
                                  "w-4 h-4 mt-0.5 shrink-0",
                                  pattern.severity === 'high' ? 'text-red-500' :
                                  pattern.severity === 'medium' ? 'text-yellow-500' :
                                  'text-muted-foreground'
                                )} />
                                <div>
                                  <p className="text-sm font-medium">{pattern.name}</p>
                                  <p className="text-xs text-muted-foreground">{pattern.description}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sentence Analysis Toggle */}
                      {result.sentenceAnalysis.length > 0 && (
                        <div className="space-y-3">
                          <button
                            onClick={() => setShowSentences(!showSentences)}
                            className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-medium hover:text-foreground transition-colors"
                          >
                            <motion.div
                              animate={{ rotate: showSentences ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </motion.div>
                            Sentence-by-Sentence Analysis ({result.sentenceAnalysis.length})
                          </button>
                          <AnimatePresence>
                            {showSentences && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-2 overflow-hidden"
                              >
                                {result.sentenceAnalysis.map((sentence, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={cn(
                                      "p-3 rounded-lg border text-sm",
                                      sentence.score >= 70 ? 'bg-red-500/5 border-red-500/20' :
                                      sentence.score >= 40 ? 'bg-yellow-500/5 border-yellow-500/20' :
                                      'bg-green-500/5 border-green-500/20'
                                    )}
                                  >
                                    <div className="flex items-center justify-between gap-3 mb-3">
                                      <div className="flex items-center gap-2">
                                        <div className={cn(
                                          "w-2 h-2 rounded-full animate-pulse",
                                          sentence.score >= 70 ? 'bg-red-500' :
                                          sentence.score >= 40 ? 'bg-yellow-500' :
                                          'bg-green-500'
                                        )} />
                                        <span className={cn(
                                          "text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full",
                                          sentence.score >= 70 ? 'bg-red-500/10 text-red-500' :
                                          sentence.score >= 40 ? 'bg-yellow-500/10 text-yellow-500' :
                                          'bg-green-500/10 text-green-500'
                                        )}>
                                          {sentence.score}% AI Probability
                                        </span>
                                      </div>
                                      {sentence.flags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                          {sentence.flags.map((flag, idx) => (
                                            <span key={idx} className="text-[9px] bg-foreground/5 text-muted-foreground px-1.5 py-0.5 rounded border border-border/20">
                                              {flag}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-foreground/90 leading-relaxed font-medium">{sentence.text}</p>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
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
                        <Shield className="w-8 h-8 text-muted-foreground" />
                      </motion.div>
                      <p className="text-muted-foreground">
                        Detection results will appear here
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Paste text and click "Detect AI Content"
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
              onClick={handleAnalyze}
              disabled={isAnalyzing || wordCount < 30}
              className="w-full sm:w-auto min-w-[220px]"
            >
              {isAnalyzing ? (
                <>
                  <motion.div
                    className="w-5 h-5 rounded-full border-2 border-background border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Detect AI Content
                </>
              )}
            </MagneticButton>
            {wordCount > 0 && wordCount < 30 && (
              <p className="text-sm text-muted-foreground">
                {30 - wordCount} more words needed for analysis
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIDetector;
