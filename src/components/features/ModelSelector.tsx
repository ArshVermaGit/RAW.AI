import { motion } from 'framer-motion';
import { Cpu, Sparkles, Zap, Crown, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export type AIModel = 
  | 'gpt-4o-mini'
  | 'gpt-4o'
  | 'o1-preview';

interface ModelOption {
  id: AIModel;
  name: string;
  description: string;
  icon: typeof Cpu;
  speed: 'Fast' | 'Medium' | 'Slower';
  quality: 'Good' | 'Better' | 'Best';
  requiredPlan: 'free' | 'pro' | 'ultra';
}

const models: ModelOption[] = [
  {
    id: 'gpt-4o-mini',
    name: 'Standard v4',
    description: 'Fast & efficient',
    icon: Zap,
    speed: 'Fast',
    quality: 'Good',
    requiredPlan: 'free',
  },
  {
    id: 'gpt-4o',
    name: 'Pro v4',
    description: 'Smart & distinct',
    icon: Sparkles,
    speed: 'Medium',
    quality: 'Better',
    requiredPlan: 'pro',
  },
  {
    id: 'o1-preview',
    name: 'Ultra Logic',
    description: 'Deep reasoning',
    icon: Crown,
    speed: 'Slower',
    quality: 'Best',
    requiredPlan: 'ultra',
  },
];

interface ModelSelectorProps {
  selectedModel: AIModel;
  onSelectModel: (model: AIModel) => void;
  onUpgrade?: (plan: 'pro' | 'ultra') => void;
}

export const ModelSelector = ({ selectedModel, onSelectModel, onUpgrade }: ModelSelectorProps) => {
  const { profile } = useAuth();
  const userPlan = profile?.subscribed_plan || 'free';

  const planRank = { free: 0, pro: 1, ultra: 2 };

  const canAccessModel = (requiredPlan: 'free' | 'pro' | 'ultra') => {
    return planRank[userPlan as keyof typeof planRank] >= planRank[requiredPlan];
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">AI Model</label>
      <div className="grid grid-cols-2 gap-2">
        {models.map((model) => {
          const Icon = model.icon;
          const hasAccess = canAccessModel(model.requiredPlan);
          const isSelected = selectedModel === model.id;

          return (
            <motion.button
              key={model.id}
              onClick={() => {
                if (hasAccess) {
                  onSelectModel(model.id);
                } else if (onUpgrade) {
                  onUpgrade(model.requiredPlan as 'pro' | 'ultra');
                }
              }}
              className={cn(
                "relative flex flex-col items-start p-3 rounded-xl border transition-all text-left",
                isSelected && hasAccess
                  ? "border-primary bg-primary/5"
                  : hasAccess
                  ? "border-border/50 bg-secondary/30 hover:bg-secondary/50 hover:border-border"
                  : "border-border/30 bg-secondary/10 opacity-60 cursor-pointer"
              )}
              whileHover={{ scale: hasAccess ? 1.02 : 1 }}
              whileTap={{ scale: hasAccess ? 0.98 : 1 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={cn(
                  "w-4 h-4",
                  isSelected && hasAccess ? "text-primary" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-sm font-medium",
                  isSelected && hasAccess ? "text-foreground" : "text-foreground/80"
                )}>
                  {model.name}
                </span>
                {!hasAccess && <Lock className="w-3 h-3 text-muted-foreground" />}
              </div>
              <span className="text-xs text-muted-foreground">{model.description}</span>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded",
                  model.speed === 'Fast' ? "bg-green-500/20 text-green-600 dark:text-green-400" :
                  model.speed === 'Medium' ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" :
                  "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                )}>
                  {model.speed}
                </span>
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded",
                  model.quality === 'Good' ? "bg-blue-500/20 text-blue-500" :
                  model.quality === 'Better' ? "bg-purple-500/20 text-purple-500" :
                  "bg-primary/20 text-primary"
                )}>
                  {model.quality}
                </span>
              </div>
              {!hasAccess && (
                <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium uppercase">
                  {model.requiredPlan}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
