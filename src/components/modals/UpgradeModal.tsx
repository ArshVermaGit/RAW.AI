import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Shield, Crown } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
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

import { siteConfig } from '@/config/site';

const ALL_PLANS = Object.values(siteConfig.plans).map(plan => ({
  ...plan,
  buttonVariant: plan.popular ? ('primary' as const) : ('secondary' as const)
}));

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
          } catch {
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
    } catch {
      setLoadingPlan(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[75rem] w-full bg-[#050505]/95 border-white/5 p-0 overflow-visible backdrop-blur-xl">
      <div className="relative p-8 md:p-16 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[120px]" 
          />
        </div>
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6"
          >
            <Crown className="w-3 h-3" />
            Empower Your Writing
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-8xl font-display font-black tracking-tighter mb-6 text-white leading-[0.9]"
          >
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Legacy</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-sm md:text-lg max-w-2xl mx-auto font-medium"
          >
            Unlock the full potential of human-centric AI writing. Built for creators who demand perfection.
          </motion.p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {ALL_PLANS.map((plan, i) => {
            const isCurrent = profile?.subscribed_plan === plan.id;
            const isPro = plan.id === 'pro';

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={cn(
                  "relative flex flex-col p-8 md:p-10 rounded-[2.5rem] border transition-all duration-700 overflow-hidden group",
                  isPro 
                    ? "bg-white/[0.03] border-white/20 shadow-[0_0_80px_rgba(255,255,255,0.05)] scale-105 z-20" 
                    : "bg-white/[0.01] border-white/5 hover:border-white/10 z-10"
                )}
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {plan.popular && (
                  <div className="absolute top-6 right-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary blur-md opacity-50 pulse" />
                      <div className="relative bg-primary text-white text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                        Most Popular
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative mb-10">
                  <h3 className="text-2xl font-display font-black mb-3 text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm font-medium text-white/40 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="relative mb-10 pb-10 border-b border-white/5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-display font-black text-white tracking-tighter">{plan.price}</span>
                    {plan.id !== 'free' && (
                      <div className="flex flex-col">
                        {'originalPrice' in plan && (
                          <span className="text-sm line-through text-white/20 font-bold decoration-primary/40 leading-none mb-1">
                            {plan.originalPrice}
                          </span>
                        )}
                        <span className="text-sm font-black text-white/40 uppercase tracking-widest">/month</span>
                      </div>
                    )}
                  </div>
                </div>

                <ul className="relative space-y-5 mb-12 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-4 text-sm">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                        isPro ? "bg-primary/20 text-primary" : "bg-white/5 text-white/40"
                      )}>
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <span className="text-white/60 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <MagneticButton
                  size="xl"
                  variant={plan.buttonVariant}
                  disabled={isCurrent || (loadingPlan !== null && loadingPlan !== plan.id)}
                  onClick={() => {
                    if (plan.id === 'free') return;
                    handleUpgrade(plan.id as 'pro' | 'ultra');
                  }}
                  className={cn(
                    "relative w-full h-16 rounded-3xl text-xs font-black uppercase tracking-[0.25em] transition-all duration-500 overflow-hidden",
                    isPro 
                      ? "bg-white text-black hover:bg-white/90 shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:-translate-y-1" 
                      : "bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20",
                    isCurrent && "opacity-30 cursor-default grayscale pointer-events-none"
                  )}
                >
                  {loadingPlan === plan.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    isCurrent ? "Active Plan" : plan.cta
                  )}
                </MagneticButton>
              </motion.div>
            );
          })}
        </div>

        {/* Security Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex items-center justify-center gap-6 text-white/20 font-black uppercase tracking-[0.3em] text-[9px]"
        >
          <div className="h-px w-12 bg-white/5" />
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary/40" />
            Enterprise Encryption & Secure Checkout
          </div>
        </motion.div>
      </div>
    </Modal>
  );
};

