import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useModals } from '@/hooks/use-modals';

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

export const useRazorpay = () => {
    const { user, session, refreshProfile } = useAuth();
    const { openModal } = useModals();
    const [loadingPlan, setLoadingPlan] = useState<'pro' | 'ultra' | null>(null);

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

    const handleUpgrade = async (planId: 'pro' | 'ultra', onSuccess: (plan: 'pro' | 'ultra') => void, onClose: () => void) => {
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

    return {
        handleUpgrade,
        loadingPlan
    };
};
