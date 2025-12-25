import { motion } from 'framer-motion';
import { Zap, AlertTriangle, Crown, Infinity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useUsage } from '@/hooks/useUsage';
import { useAuth } from '@/contexts/AuthContext';

interface UsageIndicatorProps {
  compact?: boolean;
  onUpgrade?: () => void;
}

export const UsageIndicator = ({ compact = false, onUpgrade }: UsageIndicatorProps) => {
  const { profile } = useAuth();
  const { currentUsage, planLimit, remaining, percentage, isLoading } = useUsage();

  const plan = profile?.subscribed_plan || 'free';
  const isUnlimited = planLimit >= Number.MAX_SAFE_INTEGER;
  const isLow = !isUnlimited && percentage > 80;
  const isExhausted = !isUnlimited && remaining <= 0;

  if (isLoading) {
    return (
      <div className="animate-pulse bg-secondary/50 rounded-lg h-10" />
    );
  }

  if (compact) {
    return (
      <motion.div 
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
          isExhausted ? "bg-destructive/20 text-destructive" :
          isLow ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" :
          "bg-secondary/50 text-muted-foreground"
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {isUnlimited ? (
          <>
            <Infinity className="w-3.5 h-3.5" />
            <span>Unlimited</span>
          </>
        ) : (
          <>
            <Zap className="w-3.5 h-3.5" />
            <span>{remaining.toLocaleString()} words left</span>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="p-4 rounded-xl bg-secondary/30 border border-border/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Monthly Usage</span>
        </div>
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full font-medium capitalize",
          plan === 'ultra' ? "bg-purple-500/20 text-purple-500" :
          plan === 'pro' ? "bg-blue-500/20 text-blue-500" :
          "bg-secondary text-muted-foreground"
        )}>
          {plan}
        </span>
      </div>

      {isUnlimited ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Infinity className="w-4 h-4" />
          <span>Unlimited words with Ultra plan</span>
        </div>
      ) : (
        <>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">
              {currentUsage.toLocaleString()} / {planLimit.toLocaleString()} words
            </span>
            <span className={cn(
              "font-medium",
              isExhausted ? "text-destructive" :
              isLow ? "text-yellow-600 dark:text-yellow-400" :
              "text-foreground"
            )}>
              {percentage.toFixed(0)}%
            </span>
          </div>
          
          <Progress 
            value={percentage} 
            className={cn(
              "h-1.5",
              isExhausted && "[&>div]:bg-destructive",
              isLow && !isExhausted && "[&>div]:bg-yellow-500"
            )}
          />

          {isExhausted && (
            <motion.div
              className="mt-3 flex items-start gap-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-destructive">Limit reached!</p>
                <p className="text-destructive/80">
                  Upgrade to continue humanizing text.
                </p>
              </div>
              {onUpgrade && (
                <button 
                  onClick={onUpgrade}
                  className="ml-auto shrink-0 flex items-center gap-1 px-2 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  <Crown className="w-3 h-3" />
                  Upgrade
                </button>
              )}
            </motion.div>
          )}

          {isLow && !isExhausted && (
            <motion.p
              className="mt-2 text-xs text-yellow-600 dark:text-yellow-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ⚠️ Running low on words. Consider upgrading for more.
            </motion.p>
          )}
        </>
      )}
    </motion.div>
  );
};
