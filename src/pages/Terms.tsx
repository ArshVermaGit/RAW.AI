import { motion } from 'framer-motion';
import { ArrowLeft, Book, Scale, Zap, Ban, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Terms = () => {
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
            <h1 className="text-4xl md:text-5xl font-display font-bold">Terms of Service</h1>
            <p className="text-xl text-muted-foreground">Last updated: January 2026</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Book className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">1. Acceptance of Terms</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using RAW.AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Zap className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">2. Description of Service</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                RAW.AI provides AI-powered text processing tools, including but not limited to AI detection and text humanization. We strive for high accuracy but cannot guarantee 100% results due to the evolving nature of AI technology.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Scale className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">3. User Conduct</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to use RAW.AI for any unlawful purpose or to violate any laws in your jurisdiction. You must not transmit any worms, viruses, or any code of a destructive nature.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <CreditCard className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">4. Subscriptions and Billing</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Paid subscriptions ("Pro" and "Ultra") are billed on a monthly basis. You can cancel your subscription at any time; however, no refunds are provided for partial months. Usage limits (words per month) reset at the beginning of each billing cycle.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Ban className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">5. Termination</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Scale className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">6. Limitation of Liability</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall RAW.AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>
          </div>

          <div className="pt-8 border-t border-border/30 text-center text-muted-foreground">
            <p>Questions? Contact us at arshverma.dev@gmail.com</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Terms;
