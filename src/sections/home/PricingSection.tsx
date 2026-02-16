import { Crown, Check } from 'lucide-react';
import { MagneticButton } from '@/components/common';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useModals } from '@/hooks/use-modals';

import { siteConfig } from '@/config/site';

// Define Plan interface locally or import it if centralized
export interface Plan {
    name: string;
    price: string;
    originalPrice?: string;
    description: string;
    features: string[];
    cta: string;
    popular: boolean;
    planId: 'free' | 'pro' | 'ultra';
}

export const PricingSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openModal } = useModals();

  const pricingPlans: Plan[] = Object.values(siteConfig.plans).map((plan) => ({
    ...(plan as Omit<Plan, 'planId'>),
    planId: (plan as { id: string }).id as 'free' | 'pro' | 'ultra'
  }));

  return (
    <section id="pricing" className="py-12 md:py-16 px-4 md:px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4 px-4 py-2 bg-card/50 rounded-full border border-border/30">
            <Crown className="w-3 h-3" /> Pricing
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-4">Choose Your Plan</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {pricingPlans.map((plan, i) => (
            <div key={i} className={cn("group relative rounded-3xl p-8 border-2 transition-all", plan.popular ? "bg-foreground text-background border-foreground shadow-2xl scale-105 z-10" : "bg-card/60 border-border/50")}>
              {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background text-foreground text-[10px] font-black uppercase px-3 py-1 rounded-full border border-border/30">Most Popular</div>}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm opacity-70">{plan.description}</p>
              </div>
              <div className="mb-8 pb-8 border-b border-current/10">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.price !== '$0' && (
                    <div className="flex flex-col">
                      {'originalPrice' in plan && <span className="text-sm opacity-50 line-through leading-none">{plan.originalPrice}</span>}
                      <span className="text-base opacity-70">/mo</span>
                    </div>
                  )}
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <MagneticButton 
                variant={plan.popular ? "secondary" : "primary"} 
                className="w-full" 
                onClick={() => {
                  if (!user) {
                    navigate('/auth');
                    return;
                  }
                  if (plan.planId === 'pro' || plan.planId === 'ultra') {
                    openModal(plan.planId === 'pro' ? 'pricing-pro' : 'pricing-ultra');
                  }
                }}
              >
                {plan.cta}
              </MagneticButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
