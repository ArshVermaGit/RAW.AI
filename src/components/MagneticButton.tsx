import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg' | 'xl';
  className?: string;
  disabled?: boolean;
}

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'default',
  className,
  disabled = false
}, ref) => {
  const variants = {
    primary: "bg-foreground text-background hover:shadow-[0_0_50px_-10px_hsl(var(--foreground)/0.4)] border border-transparent",
    secondary: "bg-secondary text-foreground border border-border/60 hover:border-foreground/30 hover:bg-secondary/80",
    ghost: "text-foreground hover:bg-secondary/60 border border-transparent",
    outline: "bg-transparent text-foreground border border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs font-medium",
    default: "h-11 px-6 text-sm",
    lg: "h-12 px-8 text-sm font-medium",
    xl: "h-14 px-10 text-base font-semibold",
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center gap-2.5 rounded-full font-medium",
        "transition-all duration-400 ease-out-expo",
        "disabled:opacity-40 disabled:pointer-events-none",
        "overflow-hidden",
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
    >
      {/* Shimmer sweep effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/15 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
      
      {/* Glow layer for primary */}
      {variant === 'primary' && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-transparent to-primary-foreground/5" />
      )}
      
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
      </span>
    </motion.button>
  );
});

MagneticButton.displayName = 'MagneticButton';