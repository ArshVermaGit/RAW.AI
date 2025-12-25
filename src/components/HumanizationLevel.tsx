import { Sparkles, Zap, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

type Level = 'lite' | 'pro' | 'ultra';

interface HumanizationLevelProps {
  selected: Level;
  onSelect: (level: Level) => void;
}

const levels = [
  {
    id: 'lite' as Level,
    name: 'Lite',
    description: 'Basic humanization',
    icon: Zap,
    free: true,
  },
  {
    id: 'pro' as Level,
    name: 'Pro',
    description: 'Enhanced quality',
    icon: Sparkles,
    free: false,
  },
  {
    id: 'ultra' as Level,
    name: 'Ultra',
    description: 'Maximum power',
    icon: Crown,
    free: false,
  },
];

export const HumanizationLevel = ({ selected, onSelect }: HumanizationLevelProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Level:</span>
      <div className="flex gap-2">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            className={cn(
              "level-chip flex items-center gap-2",
              selected === level.id && "active"
            )}
          >
            <level.icon className="w-3.5 h-3.5" />
            <span>{level.name}</span>
            {!level.free && (
              <span className="text-[10px] opacity-60">PRO</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
