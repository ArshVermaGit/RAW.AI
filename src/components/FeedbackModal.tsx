import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Mail, Sparkles, PartyPopper, ArrowRight, X, Zap, LogOut, Trash2, Rocket, Heart } from 'lucide-react';
import { Modal } from './Modal';
import { MagneticButton } from './MagneticButton';
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
    defaultTitle: 'Payment Successful!',
    defaultMessage: 'Your account has been upgraded. You now have full access to your new features!',
    buttonText: 'Start Using Pro',
  },
  'payment-failed': {
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    glowColor: 'from-red-500/20',
    defaultTitle: 'Payment Failed',
    defaultMessage: 'We couldn\'t process your payment. Please check your card details and try again.',
    buttonText: 'Try Again',
  },
  'limit-reached': {
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    glowColor: 'from-yellow-500/20',
    defaultTitle: 'Limit Reached',
    defaultMessage: 'You\'ve hit your word limit for this month. Upgrade to Pro for unlimited humanization!',
    buttonText: 'View Pricing',
  },
  'auth-required': {
    icon: Sparkles,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    glowColor: 'from-blue-500/20',
    defaultTitle: 'Unlock Full Power',
    defaultMessage: 'Sign in with Google to humanize more words and save your history!',
    buttonText: 'Continue with Google',
  },
  'logout-confirm': {
    icon: LogOut,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    glowColor: 'from-orange-500/20',
    defaultTitle: 'Are you sure?',
    defaultMessage: 'You will need to sign in again to access your history and pro features.',
    buttonText: 'Yes, Sign Out',
  },
  'subscription-updated': {
    icon: Rocket,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    glowColor: 'from-purple-500/20',
    defaultTitle: 'Plan Upgraded!',
    defaultMessage: 'Your subscription has been updated successfully. Enjoy your new limits!',
    buttonText: 'Awesome',
  },
  'delete-confirm': {
    icon: Trash2,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    glowColor: 'from-red-500/20',
    defaultTitle: 'Confirm Deletion',
    defaultMessage: 'This action cannot be undone. All related data will be permanently removed.',
    buttonText: 'Delete Forever',
  },
  'welcome-new': {
    icon: Heart,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    glowColor: 'from-pink-500/20',
    defaultTitle: 'You\'re in!',
    defaultMessage: 'Thanks for joining RAW.AI. We\'ve gifted you some initial words to get started.',
    buttonText: 'Let\'s Go',
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
