import { motion } from 'framer-motion';
import { Check, Sparkles, Shield, Loader2 } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { MagneticButton } from '@/components/MagneticButton';
import { cn } from '@/lib/utils';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useAuth } from '@/hooks/useAuth';

interface UltraPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (plan: 'pro' | 'ultra') => void;
}

export const UltraPlanModal = ({ isOpen, onClose, onSuccess }: UltraPlanModalProps) => {
  const { handleUpgrade, loadingPlan } = useRazorpay();
  const { profile } = useAuth();
  
  const isCurrent = profile?.subscribed_plan === 'ultra';

  const features = [
    'Everything in Pro',
    'The deepest human mode',
    '99.9% pass guarantee',
    'Use your own brand',
    'Unlimited API use',
    'Personal support',
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl w-full bg-background/95 dark:bg-[#050505]/95 border-border/10 dark:border-white/5 p-0 overflow-hidden backdrop-blur-xl my-4">
      <div className="relative p-6 md:p-12 overflow-y-auto max-h-[85vh] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-foreground/10 dark:scrollbar-thumb-white/10">
         {/* Animated Background Elements */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px]" 
          />
        </div>

        <div className="text-center mb-8 md:mb-10">
            <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold uppercase tracking-[0.3em] text-purple-500 dark:text-purple-400 mb-4 md:mb-6"
            >
            <Sparkles className="w-3 h-3" />
            Ultimate Power
            </motion.div>
            <h2 className="text-3xl md:text-6xl font-display font-black tracking-tighter mb-2 md:mb-4 text-foreground dark:text-white">
            Get <span className="text-purple-500">Ultra</span> Access
            </h2>
            <p className="text-muted-foreground dark:text-white/40 text-base md:text-lg max-w-xl mx-auto">
            For teams and power users who demand the absolute best performance.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
                <div className="flex items-baseline gap-2 justify-center md:justify-start">
                    <span className="text-5xl md:text-6xl font-display font-black text-foreground dark:text-white tracking-tighter">$10</span>
                    <div className="flex flex-col text-left">
                        <span className="text-lg line-through text-muted-foreground/50 dark:text-white/20 font-bold decoration-purple-500/40 leading-none mb-1">$20</span>
                        <span className="text-sm font-black text-muted-foreground dark:text-white/40 uppercase tracking-widest">/month</span>
                    </div>
                </div>
                <ul className="space-y-3 md:space-y-4">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-4 text-sm">
                             <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                             </div>
                             <span className="text-foreground/80 dark:text-white/80 font-medium">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="bg-secondary/50 dark:bg-white/5 border border-border/50 dark:border-white/10 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">Maximum Potential</h3>
                <p className="text-muted-foreground dark:text-white/40 text-sm mb-6 md:mb-8">Unleash the full power of RAW.AI.</p>
                
                <MagneticButton
                  size="xl"
                  variant="secondary"
                  disabled={isCurrent || (loadingPlan !== null && loadingPlan !== 'ultra')}
                  onClick={() => handleUpgrade('ultra', onSuccess, onClose)}
                  className={cn(
                    "w-full h-12 md:h-14 rounded-xl text-xs font-black uppercase tracking-[0.25em] transition-all duration-300",
                    isCurrent && "opacity-50 cursor-default grayscale pointer-events-none"
                  )}
                >
                  {loadingPlan === 'ultra' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    isCurrent ? "Current Plan" : "Get Ultra Now"
                  )}
                </MagneticButton>
                 
                <div className="mt-6 flex items-center gap-2 text-muted-foreground/40 dark:text-white/20 font-bold uppercase tracking-[0.1em] text-[10px]">
                    <Shield className="w-3 h-3" />
                    Secure Payment
                </div>
            </div>
        </div>
      </div>
    </Modal>
  );
};
