import { motion } from 'framer-motion';
import { Check, Crown, Shield, Loader2 } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { MagneticButton } from '@/components/MagneticButton';
import { cn } from '@/lib/utils';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useAuth } from '@/hooks/useAuth';

interface ProPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (plan: 'pro' | 'ultra') => void;
}

export const ProPlanModal = ({ isOpen, onClose, onSuccess }: ProPlanModalProps) => {
  const { handleUpgrade, loadingPlan } = useRazorpay();
  const { profile } = useAuth();
  
  const isCurrent = profile?.subscribed_plan === 'pro';

  const features = [
    'Write unlimited words',
    'Advanced human touch',
    'Deep AI detection check',
    'Better for SEO',
    'Priority help',
    'API access',
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl w-full bg-[#050505]/95 border-white/5 p-0 overflow-visible backdrop-blur-xl">
      <div className="relative p-8 md:p-12 overflow-hidden">
         {/* Animated Background Elements */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/20 rounded-full blur-[120px]" 
          />
        </div>

        <div className="text-center mb-10">
            <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400 mb-6"
            >
            <Crown className="w-3 h-3" />
            Most Popular Choice
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-4 text-white">
            Upgrade to <span className="text-blue-500">Pro</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
            Perfect for serious writers and content creators who need more power.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
                <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-display font-black text-white tracking-tighter">$5</span>
                    <div className="flex flex-col">
                        <span className="text-lg line-through text-white/20 font-bold decoration-blue-500/40 leading-none mb-1">$10</span>
                        <span className="text-sm font-black text-white/40 uppercase tracking-widest">/month</span>
                    </div>
                </div>
                <ul className="space-y-4">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-4 text-sm">
                             <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                             </div>
                             <span className="text-white/80 font-medium">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-bold text-white mb-2">Ready to start?</h3>
                <p className="text-white/40 text-sm mb-8">Get instant access to all Pro features.</p>
                
                <MagneticButton
                  size="xl"
                  variant="primary"
                  disabled={isCurrent || (loadingPlan !== null && loadingPlan !== 'pro')}
                  onClick={() => handleUpgrade('pro', onSuccess, onClose)}
                  className={cn(
                    "w-full h-14 rounded-xl text-xs font-black uppercase tracking-[0.25em] transition-all duration-300",
                     isCurrent && "opacity-50 cursor-default grayscale pointer-events-none"
                  )}
                >
                  {loadingPlan === 'pro' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    isCurrent ? "Current Plan" : "Join Pro Now"
                  )}
                </MagneticButton>
                 
                <div className="mt-6 flex items-center gap-2 text-white/20 font-bold uppercase tracking-[0.1em] text-[10px]">
                    <Shield className="w-3 h-3" />
                    Secure Payment
                </div>
            </div>
        </div>
      </div>
    </Modal>
  );
};
