import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Check, Loader2, Zap, Shield, Crown, Star } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { MagneticButton } from '@/components/MagneticButton';
import { useAuth } from '@/hooks/useAuth';
import { useModals } from '@/hooks/use-modals';
import { cn } from '@/lib/utils';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => Promise<void>;
  prefill: {
    email: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, callback: (response: RazorpayFailureResponse) => void) => void;
    };
  }
}

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: string;
  onSuccess: (plan: 'pro' | 'ultra') => void;
}

const ALL_PLANS = [
  {
    id: 'free',
    name: 'Lite',
    price: '$0',
    description: 'Great for a quick start',
    features: [
      '5,000 words every month',
      'Basic AI bypass',
      'Fast processing',
      'Email support',
    ],
    cta: 'Current Plan',
    popular: false,
    buttonVariant: 'secondary' as const
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$5',
    originalPrice: '$10',
    description: 'Perfect for serious writers',
    features: [
      'Write unlimited words',
      'Advanced human touch',
      'Deep AI detection check',
      'Better for SEO',
      'Priority help',
      'API access',
    ],
    cta: 'Join Pro',
    popular: true,
    buttonVariant: 'primary' as const
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: '$10',
    originalPrice: '$20',
    description: 'For teams and power users',
    features: [
      'Everything in Pro',
      'The deepest human mode',
      '99.9% pass guarantee',
      'Use your own brand',
      'Unlimited API use',
      'Personal support',
    ],
    cta: 'Get Ultra',
    popular: false,
    buttonVariant: 'secondary' as const
  },
];

export const UpgradeModal = ({ isOpen, onClose, onSuccess }: UpgradeModalProps) => {
  const { user, session, profile, refreshProfile } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<'pro' | 'ultra' | null>(null);
  const { openModal } = useModals();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async (planId: 'pro' | 'ultra') => {
    if (!user) return;
    
    setLoadingPlan(planId);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        openModal('generic-error', { 
          title: 'Gateway Error', 
          message: 'Failed to load the payment gateway.' 
        });
        setLoadingPlan(null);
        return;
      }

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const orderResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-razorpay-order`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ plan: planId, email: user.email, userId: user.id }),
        }
      );

      if (!orderResponse.ok) {
        onClose();
        setTimeout(() => openModal('order-failed'), 100);
        setLoadingPlan(null);
        return;
      }

      const orderData = await orderResponse.json();

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'RAW.AI',
        description: `${planId.toUpperCase()} Plan Subscription`,
        order_id: orderData.orderId,
        handler: async (response: RazorpayPaymentResponse) => {
          onClose();
          openModal('payment-verifying');

          try {
            const verifyHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
            if (session?.access_token) {
              verifyHeaders['Authorization'] = `Bearer ${session.access_token}`;
            }

            const verifyResponse = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-razorpay-payment`,
              {
                method: 'POST',
                headers: verifyHeaders,
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            if (!verifyResponse.ok) throw new Error('Verification failed');

            await refreshProfile();
            openModal('payment-success', {
              onConfirm: () => {
                onSuccess(planId);
                onClose();
              }
            });
          } catch (error) {
            openModal('payment-verification-failed');
          }
        },
        prefill: { email: user.email || '' },
        theme: { color: planId === 'pro' ? '#3B82F6' : '#8B5CF6' },
        modal: {
          ondismiss: () => {
            setLoadingPlan(null);
            onClose();
            setTimeout(() => openModal('payment-canceled'), 100);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setLoadingPlan(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[75rem] w-full bg-black/90 border-foreground/10 p-0 overflow-visible">
      <div className="relative p-5 md:p-12 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none -z-10" />
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/30 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 md:mb-6"
          >
            <Crown className="w-3 h-3 text-primary" />
            Pricing
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-7xl font-display font-black tracking-tight mb-4 text-white"
          >
            Choose Your Plan
          </motion.h2>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch pt-4 md:pt-8">
          {ALL_PLANS.map((plan, i) => {
            const isCurrent = profile?.subscribed_plan === plan.id;
            const isLite = plan.id === 'free';
            const isPro = plan.id === 'pro';
            const isUltra = plan.id === 'ultra';

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={cn(
                  "relative flex flex-col p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-2 transition-all duration-500 overflow-visible",
                  isPro 
                    ? "bg-white text-black border-white md:scale-105 z-20 shadow-[0_0_50px_rgba(255,255,255,0.1)]" 
                    : "bg-[#0A0A0A] text-white border-white/5 hover:border-white/20 z-10"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black uppercase px-5 py-2 rounded-full border border-white/10 tracking-widest whitespace-nowrap z-50">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-3xl font-black mb-2 flex items-center gap-3 font-display">
                    {plan.name}
                  </h3>
                  <p className={cn("text-sm transition-opacity", isPro ? "text-neutral-500" : "text-neutral-400")}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8 pb-8 border-b border-current/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black font-display">{plan.price}</span>
                    {plan.id !== 'free' && (
                      <div className="flex flex-col">
                        {'originalPrice' in plan && <span className={cn("text-sm line-through leading-none opacity-50", isPro ? "text-neutral-500" : "text-neutral-400")}>{plan.originalPrice}</span>}
                        <span className={cn("text-base font-bold", isPro ? "text-neutral-400" : "text-neutral-500")}>/mo</span>
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-12 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-medium">
                      <Check className={cn("w-4 h-4 shrink-0", isPro ? "text-black" : "text-white")} />
                      <span className="opacity-90">{feature}</span>
                    </li>
                  ))}
                </ul>

                <MagneticButton
                  size="xl"
                  variant={plan.buttonVariant}
                  disabled={isCurrent || (loadingPlan !== null && loadingPlan !== plan.id)}
                  onClick={() => {
                    if (isLite) return;
                    handleUpgrade(plan.id as 'pro' | 'ultra');
                  }}
                  className={cn(
                    "w-full h-15 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-300",
                    isPro && "bg-black text-white border-black hover:bg-neutral-900 hover:scale-[1.02]",
                    !isPro && "bg-white text-black border-white hover:bg-neutral-100",
                    isCurrent && "opacity-50 cursor-default grayscale"
                  )}
                >
                  {loadingPlan === plan.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    isCurrent ? "Current Plan" : plan.cta
                  )}
                </MagneticButton>
              </motion.div>
            );
          })}
        </div>

        {/* Security Note */}
        <div className="mt-16 flex items-center justify-center gap-3 text-muted-foreground/40 font-bold uppercase tracking-[0.2em] text-[10px]">
          <Shield className="w-4 h-4" />
          Secure Payment via Razorpay
        </div>
      </div>
    </Modal>
  );
};

