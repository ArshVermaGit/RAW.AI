import { motion } from 'framer-motion';
import { ShieldCheck, Fingerprint, Zap, Ghost } from 'lucide-react';

export const HeroOrbitalElements = () => {
  const floatTransition = {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut" as const
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
      {/* Element 1: Human Score (Top Right) */}
      <motion.div 
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ ...floatTransition, delay: 0 }}
        className="absolute top-[2%] right-[2%] md:top-[10%] md:right-[5%] lg:right-[10%] flex items-center gap-3 px-3 py-2 sm:px-4 rounded-full sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl scale-90 sm:scale-100 origin-top-right"
      >
        <div className="p-2 rounded-full bg-green-500/20 text-green-400 shrink-0">
          <Fingerprint className="w-5 h-5" />
        </div>
        <div className="hidden sm:block">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Human Score</div>
          <div className="text-sm font-bold text-white">100% Match</div>
        </div>
      </motion.div>

      {/* Element 2: Undetectable (Bottom Left) */}
      <motion.div 
        animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
        transition={{ ...floatTransition, delay: 1.5 }}
        className="absolute bottom-[2%] left-[2%] md:bottom-[15%] md:left-[5%] lg:left-[10%] flex items-center gap-3 px-3 py-2 sm:px-4 rounded-full sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl scale-90 sm:scale-100 origin-bottom-left"
      >
        <div className="p-2 rounded-full bg-purple-500/20 text-purple-400 shrink-0">
          <Ghost className="w-5 h-5" />
        </div>
        <div className="hidden sm:block">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">AI Detection</div>
          <div className="text-sm font-bold text-white">Bypassed</div>
        </div>
      </motion.div>

      {/* Element 3: Speed (Top Left - Small) */}
      <motion.div 
        animate={{ y: [-15, 5, -15], x: [0, 10, 0] }}
        transition={{ ...floatTransition, delay: 0.5 }}
        className="absolute top-[2%] left-[2%] md:top-[15%] md:left-[10%] flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-md scale-90 sm:scale-100 origin-top-left"
      >
        <Zap className="w-5 h-5 text-yellow-400" fill="currentColor" />
      </motion.div>

      {/* Element 4: Secure (Bottom Right - Small) */}
      <motion.div 
        animate={{ y: [5, -15, 5], x: [0, -10, 0] }}
        transition={{ ...floatTransition, delay: 1 }}
        className="absolute bottom-[2%] right-[2%] md:bottom-[20%] md:right-[10%] flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-md scale-90 sm:scale-100 origin-bottom-right"
      >
        <ShieldCheck className="w-5 h-5 text-blue-400" />
      </motion.div>
    </div>
  );
};
