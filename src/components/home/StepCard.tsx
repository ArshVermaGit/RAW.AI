import { cn } from '@/lib/utils';

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  className?: string;
}

export const StepCard = ({ number, title, description, className }: StepCardProps) => {
  return (
    <div className={cn(
      "relative group",
      className
    )}>
      {/* Large background number */}
      <span className="absolute -top-4 -left-2 text-[120px] font-bold text-foreground/5 leading-none pointer-events-none select-none group-hover:text-foreground/10 transition-colors duration-300">
        {number}
      </span>
      
      {/* Content */}
      <div className="relative pt-16 pb-8 px-6">
        <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold mb-6">
          {number}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
