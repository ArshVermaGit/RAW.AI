import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractiveCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
  // Delay is removed to prevent JS-based staggered entrance
}

export const InteractiveCard = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick,
  className 
}: InteractiveCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative p-8 rounded-2xl cursor-pointer overflow-hidden",
        "bg-card border border-border/40",
        "hover:border-foreground/20 hover:-translate-y-1.5",
        "transition-all duration-500 ease-out-expo",
        className
      )}
    >
      {/* Spotlight gradient on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] via-transparent to-transparent" />
      </div>

      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none noise" />

      {/* Icon container */}
      <div className="relative w-12 h-12 rounded-xl bg-foreground/5 border border-foreground/10 flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
        <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold mb-2.5 tracking-tight group-hover:text-foreground transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Arrow indicator */}
      <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0">
        <ArrowUpRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
      </div>

      {/* Bottom line accent */}
      <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};