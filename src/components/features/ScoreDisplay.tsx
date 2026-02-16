import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  score: number;
  label: string;
  variant?: 'danger' | 'success' | 'warning';
  className?: string;
}

export const ScoreDisplay = ({ score, label, variant = 'success', className }: ScoreDisplayProps) => {
  const colors = {
    danger: {
      bg: 'bg-destructive/10',
      text: 'text-destructive',
      bar: 'bg-destructive',
    },
    warning: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-500',
      bar: 'bg-yellow-500',
    },
    success: {
      bg: 'bg-success/10',
      text: 'text-success',
      bar: 'bg-success',
    },
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className={cn(
          "text-xs font-medium px-2 py-1 rounded-full",
          colors[variant].bg,
          colors[variant].text
        )}>
          {label}
        </span>
        <span className={cn("text-2xl font-bold transition-all duration-500", colors[variant].text)}>
          {score}%
        </span>
      </div>
      <div className="score-bar h-2 bg-secondary/30 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-1000 ease-out", colors[variant].bar)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
