import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, Server, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Privacy = () => {
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
            <h1 className="text-4xl md:text-5xl font-display font-bold">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">Last updated: January 2026</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Shield className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">1. Information We Collect</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We collect information you provide directly to us when using RAW.AI. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Account information (email, name) provided during sign-up via Google.</li>
                <li>Content you submit for processing (text for humanization or detection).</li>
                <li>Usage data and interaction metrics to improve our services.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Lock className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">2. How We Use Your Data</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Your data is used solely to provide and improve the RAW.AI experience. We do NOT sell your personal data. We use your information to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Process your text using our AI models.</li>
                <li>Maintain and improve the performance of our tools.</li>
                <li>Communicate with you regarding account updates or support.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Server className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">3. Data Storage & Security</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your data. Your content is processed securely and is not used to train public AI models without your explicit consent. We use Supabase for secure data storage and authentication.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Eye className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">4. Third-Party Services</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We use trusted third-party services for specific functions:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Google Auth:</strong> For secure sign-in.</li>
                <li><strong>Razorpay:</strong> For payment processing. We do not store your credit card details.</li>
                <li><strong>Supabase:</strong> For backend infrastructure.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <FileText className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">5. Your Rights</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to access, correct, or delete your personal data. You can request account deletion at any time through your profile settings or by contacting support.
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

export default Privacy;
