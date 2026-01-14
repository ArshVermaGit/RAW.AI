import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Check, Loader2, Zap, Shield, Crown } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { MagneticButton } from '@/components/MagneticButton';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
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
  plan: 'pro' | 'ultra';
  onSuccess: (plan: 'pro' | 'ultra') => void;
}

const planDetails = {
  pro: {
    name: 'Pro',
    price: '$5',
    priceNum: 5,
    icon: Sparkles,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    features: [
      'Unlimited words per request',
      'Pro humanization mode',
      'Advanced AI detection bypass',
      'SEO optimization tools',
      'Priority email support',
      'API access (1000 calls/month)',
    ],
  },
  ultra: {
    name: 'Ultra',
    price: '$10',
    priceNum: 10,
    icon: Rocket,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    features: [
      'Everything in Pro',
      'Ultra humanization mode',
      '99.9% undetectable guarantee',
      'White-label options',
      'Dedicated account manager',
      'Unlimited API access',
      'Custom integrations',
      'Priority 24/7 support',
    ],
  },
};

export const UpgradeModal = ({ isOpen, onClose, plan, onSuccess }: UpgradeModalProps) => {
  const { user, session, refreshProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { openModal } = useModals();
  const details = planDetails[plan];
  const Icon = details.icon;

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

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

  const handlePayment = async () => {


    setIsLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        openModal('generic-error', { 
          title: 'Gateway Error', 
          message: 'Failed to load the payment gateway. Please check your connection.' 
        });
        setIsLoading(false);
        return;
      }

      // Create order
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const orderResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-razorpay-order`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ plan, email, userId: user?.id }),
        }
      );

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        console.error('Order creation error:', error);
        onClose(); // Close the upgrade modal first
        setTimeout(() => openModal('order-failed'), 100);
        setIsLoading(false);
        return;
      }

      const orderData = await orderResponse.json();
      console.log('Order created:', orderData);

      // Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'RAW.AI',
        description: `${details.name} Plan - Monthly Subscription`,
        order_id: orderData.orderId,
        handler: async (response: RazorpayPaymentResponse) => {
          console.log('Payment successful:', response);
          onClose(); // Close the upgrade modal immediately
          openModal('payment-verifying');

          // Verify payment
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

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            // Refresh user profile to get updated plan
            await refreshProfile();

            openModal('payment-success', {
              onConfirm: () => {
                onSuccess(plan);
                onClose();
              }
            });
          } catch (error) {
            console.error('Verification error:', error);
            openModal('payment-verification-failed');
          }
        },
        prefill: {
          email: email,
        },
        theme: {
          color: plan === 'pro' ? '#3B82F6' : '#8B5CF6',
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            onClose(); // Close upgrade modal
            setTimeout(() => openModal('payment-canceled'), 100);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response: RazorpayFailureResponse) => {
        console.error('Payment failed:', response.error);
        onClose(); // Close upgrade modal
        setTimeout(() => openModal('payment-failed'), 100);
        setIsLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      onClose(); // Close upgrade modal
      setTimeout(() => {
        openModal('generic-error', {
          title: 'Initialization Failed',
          message: error instanceof Error ? error.message : 'Failed to initialize payment gateway.'
        });
      }, 100);
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <motion.div
            className={cn('w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center', details.bgColor)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <Icon className={cn('w-10 h-10', details.color)} />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Upgrade to {details.name}</h2>
          <p className="text-muted-foreground">
            Unlock the full power of AI humanization
          </p>
        </div>

        {/* Price */}
        <div className="text-center py-4 border-y border-border/30">
          <span className="text-5xl font-bold">{details.price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {details.features.map((feature, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3"
            >
              <Check className={cn('w-5 h-5 shrink-0 mt-0.5', details.color)} />
              <span className="text-sm">{feature}</span>
            </motion.li>
          ))}
        </ul>



        {/* CTA */}
        <MagneticButton
          size="xl"
          className="w-full"
          onClick={handlePayment}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Crown className="w-5 h-5" />
              Pay {details.price} & Upgrade
            </>
          )}
        </MagneticButton>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-4 h-4" />
          <span>Secure payment powered by Razorpay</span>
        </div>
      </div>
    </Modal>
  );
};
