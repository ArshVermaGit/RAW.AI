import { cn } from '@/lib/utils';

interface ExampleCardProps {
  type: 'original' | 'humanized';
  source?: string;
  text: string;
  score: number;
  wordCount: number;
  className?: string;
}

export const ExampleCard = ({ type, source, text, score, wordCount, className }: ExampleCardProps) => {
  const isOriginal = type === 'original';
  
  return (
    <div className={cn(
      "relative p-6 rounded-2xl border-2 transition-all duration-300 h-full",
      isOriginal 
        ? "bg-secondary/50 border-border" 
        : "bg-background border-foreground/20 hover:border-foreground/40",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xs font-medium px-3 py-1 rounded-full",
            isOriginal 
              ? "bg-destructive/10 text-destructive" 
              : "bg-foreground text-background"
          )}>
            {isOriginal ? 'AI Detected' : 'Human-like'}
          </span>
          {source && (
            <span className="text-xs text-muted-foreground">
              {source}
            </span>
          )}
        </div>
        <span className={cn(
          "text-2xl font-bold",
          isOriginal ? "text-destructive" : "text-foreground"
        )}>
          {score}%
        </span>
      </div>
      
      {/* Text content */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-6">
        {text}
      </p>
      
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
        <span>{wordCount} words</span>
        {!isOriginal && (
          <span className="text-foreground font-medium">
            +{score}% Human Score
          </span>
        )}
      </div>
    </div>
  );
};
