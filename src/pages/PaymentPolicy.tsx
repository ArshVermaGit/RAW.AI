import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Calendar, RefreshCcw, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PaymentPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      
      <main className="container mx-auto px-6 py-12 relative z-10 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-8 gap-2 hover:bg-secondary/50"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold">Payment Policy</h1>
            <p className="text-xl text-muted-foreground">Last updated: January 2026</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <CreditCard className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">1. Accepted Payment Methods</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We accept major credit and debit cards (Visa, MasterCard, American Express) through our secure payment processor, Razorpay. We do not store your card details on our servers; all transactions are encrypted and processed securely by Razorpay.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Calendar className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">2. Billing Cycle and Auto-Renewal</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Subscriptions (Pro and Ultra plans) are billed on a monthly basis. Your subscription will automatically renew at the end of each billing cycle unless you cancel it before the renewal date. You will be charged the standard rate for the next billing cycle upon renewal.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <RefreshCcw className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">3. Cancellation</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                You may cancel your subscription at any time through your account settings or by contacting our support team. Cancellation takes effect at the end of your current billing period. You will retain access to paid features until the end of the period.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <ShieldCheck className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">4. Secure Transactions</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                All payments are processed using industry-standard encryption protocols. We rely on Razorpay to ensure the security and integrity of your payment data.
              </p>
            </section>
          </div>

          <div className="pt-8 border-t border-border/30 text-center text-muted-foreground">
            <p>Questions about billing? Contact us at arshverma.dev@gmail.com</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PaymentPolicy;
