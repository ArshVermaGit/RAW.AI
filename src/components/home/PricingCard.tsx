import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: { text: string; included: boolean }[];
  popular?: boolean;
  buttonText: string;
  className?: string;
}

export const PricingCard = ({
  name,
  price,
  originalPrice,
  description,
  features,
  popular,
  buttonText,
  className,
}: PricingCardProps) => {
  return (
    <div className={cn(
      "relative p-8 rounded-2xl border-2 transition-all duration-300",
      popular 
        ? "bg-foreground text-background border-foreground scale-105 shadow-2xl" 
        : "bg-background border-border hover:border-foreground/30",
      className
    )}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-background text-foreground text-xs font-bold uppercase tracking-wider rounded-full">
          Most Popular
        </div>
      )}
      
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className={cn(
          "text-sm",
          popular ? "text-background/70" : "text-muted-foreground"
        )}>
          {description}
        </p>
      </div>
      
      {/* Price */}
      <div className="mb-8">
        <div className="flex items-baseline gap-2">
          {originalPrice && (
            <span className={cn(
              "text-lg line-through",
              popular ? "text-background/50" : "text-muted-foreground"
            )}>
              {originalPrice}
            </span>
          )}
          <span className="text-4xl font-bold">{price}</span>
          <span className={cn(
            "text-sm",
            popular ? "text-background/70" : "text-muted-foreground"
          )}>/month</span>
        </div>
      </div>
      
      {/* Features */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {feature.included ? (
              <Check className={cn(
                "w-5 h-5 shrink-0 mt-0.5",
                popular ? "text-background" : "text-foreground"
              )} />
            ) : (
              <X className={cn(
                "w-5 h-5 shrink-0 mt-0.5",
                popular ? "text-background/40" : "text-muted-foreground/50"
              )} />
            )}
            <span className={cn(
              "text-sm",
              !feature.included && (popular ? "text-background/50" : "text-muted-foreground/50")
            )}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      
      {/* CTA */}
      <Button 
        variant={popular ? "outline" : "hero"} 
        size="lg" 
        className={cn(
          "w-full",
          popular && "bg-background text-foreground hover:bg-background/90 border-0"
        )}
      >
        {buttonText}
      </Button>
    </div>
  );
};
