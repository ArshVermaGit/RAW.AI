import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Sparkles, PartyPopper, ArrowRight, Zap, LogOut, Trash2, Rocket, Heart, Shield, Loader2 } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { MagneticButton } from '@/components/MagneticButton';
import { cn } from '@/lib/utils';
import { ModalType } from '@/hooks/use-modals';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType | null;
  title?: string;
  message?: string;
  onConfirm?: () => void;
}

const config = {

  'payment-success': {
    icon: PartyPopper,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    glowColor: 'from-green-500/20',
    defaultTitle: 'You\'re All Set!',
    defaultMessage: 'Thanks for the support! Your account is now upgraded. You can start using all the pro features right away.',
    buttonText: 'Let\'s Get Started',
  },
  'payment-failed': {
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    glowColor: 'from-red-500/20',
    defaultTitle: 'Something Went Wrong',
    defaultMessage: 'We couldn\'t quite finish your payment. Could you double-check your card details and try again?',
    buttonText: 'Check Details',
  },
  'limit-reached': {
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    glowColor: 'from-yellow-500/20',
    defaultTitle: 'Time for an Upgrade?',
    defaultMessage: 'You\'ve used up all your words for now. Want to unlock more and keep writing?',
    buttonText: 'See Pricing',
  },
  'auth-required': {
    icon: Sparkles,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    glowColor: 'from-blue-500/20',
    defaultTitle: 'Join the Community',
    defaultMessage: 'Sign in to save your work and unlock all of our tools. It only takes a second!',
    buttonText: 'Sign in with Google',
  },
  'logout-confirm': {
    icon: LogOut,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    glowColor: 'from-orange-500/20',
    defaultTitle: 'Logging Out?',
    defaultMessage: 'Are you sure you want to sign out? You\'ll need to log back in to see your history.',
    buttonText: 'Sign Me Out',
  },
  'subscription-updated': {
    icon: Rocket,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    glowColor: 'from-purple-500/20',
    defaultTitle: 'All Set!',
    defaultMessage: 'Your plan has been updated successfully. Enjoy your new features!',
    buttonText: 'Go to Dashboard',
  },
  'delete-confirm': {
    icon: Trash2,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    glowColor: 'from-red-500/20',
    defaultTitle: 'Are You Sure?',
    defaultMessage: 'Once you delete this, it\'s gone for good. Do you really want to remove it?',
    buttonText: 'Yes, Delete It',
  },
  'welcome-new': {
    icon: Heart,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    glowColor: 'from-pink-500/20',
    defaultTitle: 'Welcome to the Family!',
    defaultMessage: 'We\'re so glad you\'re here. We\'ve given you some free words to help you get started.',
    buttonText: 'Start Writing',
  },
  'generic-success': {
    icon: CheckCircle2,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    glowColor: 'from-green-500/20',
    defaultTitle: 'Success!',
    defaultMessage: 'Your action was completed successfully.',
    buttonText: 'Continue',
  },
  'payment-canceled': {
    icon: XCircle,
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary/50',
    glowColor: 'from-secondary/20',
    defaultTitle: 'Payment Canceled',
    defaultMessage: 'Looks like the payment was canceled. No worries, no charges were made.',
    buttonText: 'Got It',
  },
  'payment-verifying': {
    icon: Loader2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    glowColor: 'from-blue-500/20',
    defaultTitle: 'Checking Things...',
    defaultMessage: 'We\'re just making sure everything went through with Razorpay. This should only take a few seconds.',
    buttonText: 'Just a Sec...',
  },
  'payment-verification-failed': {
    icon: Shield,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    glowColor: 'from-orange-500/20',
    defaultTitle: 'Verification Pending',
    defaultMessage: 'Payment received but verification is taking longer than expected. Please contact support.',
    buttonText: 'Contact Support',
  },
  'order-failed': {
    icon: Zap,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    glowColor: 'from-red-500/20',
    defaultTitle: 'Order Creation Failed',
    defaultMessage: 'We couldn\'t start the checkout process. Please check your internet connection and try again.',
    buttonText: 'Try Again',
  },
  'generic-error': {
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    glowColor: 'from-red-500/20',
    defaultTitle: 'Something went wrong',
    defaultMessage: 'An unexpected error occurred. Please try again later.',
    buttonText: 'Dismiss',
  }
};

export const FeedbackModal = ({ isOpen, onClose, type, title, message, onConfirm }: FeedbackModalProps) => {
  if (!type || !config[type]) return null;

  const { icon: Icon, color, bgColor, glowColor, defaultTitle, defaultMessage, buttonText } = config[type];

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm overflow-hidden">
      <div className="relative p-2">
        {/* Animated Glow Background */}
        <div className={cn("absolute -top-12 -left-12 w-48 h-48 bg-gradient-radial to-transparent blur-3xl -z-10 opacity-60", glowColor)} />
        
        <div className="space-y-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className={cn("w-20 h-20 rounded-2xl mx-auto flex items-center justify-center relative", bgColor)}
          >
            <Icon className={cn("w-10 h-10", color)} />
            <motion.div 
              className={cn("absolute inset-0 rounded-2xl blur-lg opacity-40 -z-10", bgColor)}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              {title || defaultTitle}
            </h2>
            <p className="text-muted-foreground leading-relaxed px-4">
              {message || defaultMessage}
            </p>
          </div>

          <div className="pt-2">
            <MagneticButton
              size="lg"
              className="w-full group"
              onClick={handleConfirm}
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};
