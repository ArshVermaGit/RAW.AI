import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Server, Lock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Security = () => {
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
            <h1 className="text-4xl md:text-5xl font-display font-bold">Security</h1>
            <p className="text-xl text-muted-foreground">Last updated: January 2026</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Shield className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">1. Our Commitment to Security</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                At RAW.AI, protecting your data is our top priority. We employ robust security measures to ensure the confidentiality, integrity, and availability of your information.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Lock className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">2. Data Encryption</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                All data transmitted between your device and our servers is encrypted using Transport Layer Security (TLS) with 256-bit encryption. Data at rest is also encrypted to prevent unauthorized access.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Server className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">3. Infrastructure Security</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Our infrastructure is hosted on Supabase, which provides enterprise-grade security features. We utilize Role-Based Access Control (RBAC) and Row Level Security (RLS) to ensure that users access only their own data.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <AlertTriangle className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">4. Reporting Vulnerabilities</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                If you believe you have found a security vulnerability in RAW.AI, please report it to us immediately at arshverma.dev@gmail.com. We value the contributions of the security research community and will work with you to address any issues.
              </p>
            </section>
          </div>

          <div className="pt-8 border-t border-border/30 text-center text-muted-foreground">
            <p>Security concerns? Contact our security team at arshverma.dev@gmail.com</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Security;
