import { motion, Variants } from 'framer-motion';

export const DynamicHeroText = () => {
  const containerVars: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVars: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1, 
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      } 
    }
  };

  return (
    <motion.div 
      className="relative z-10"
      variants={containerVars}
      initial="initial"
      animate="animate"
    >
      <div className="flex flex-col items-center">
        <motion.div variants={itemVars} className="mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/80">
            Version 2.0 • Ultra-Premium
          </span>
        </motion.div>
        
        <h1 className="hero-heading text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[7.5vw] flex flex-col items-center gap-0 text-center">
          <motion.span variants={itemVars} className="inline-block whitespace-nowrap">
            RAW<span className="text-muted-foreground/20">.</span>AI
          </motion.span>
          <motion.span 
            variants={itemVars} 
            className="inline-block text-muted-foreground/10 -mt-[2vw] lg:-mt-[1.5vw] mix-blend-exclusion"
          >
            HUMANIZED
          </motion.span>
        </h1>
        
        <motion.div 
          variants={itemVars}
          className="mt-12 relative flex flex-col items-center"
        >
          <div className="absolute -inset-10 bg-foreground/[0.02] blur-3xl rounded-full -z-10" />
          <p className="text-lg md:text-xl text-muted-foreground/60 max-w-2xl text-center leading-relaxed font-medium text-balance">
            A simple way to make your AI content feel real. Transform 
            <span className="text-foreground font-semibold mx-1.5 underline underline-offset-8 decoration-foreground/10">synthetic writing</span>
            into natural, engaging stories that people actually want to read.
          </p>
          
          <div className="mt-12 flex flex-wrap justify-center gap-3">
             {['Undetectable', 'Context-Aware', 'SEO-Optimized'].map((tag, i) => (
               <motion.span 
                 key={tag}
                 variants={itemVars}
                 className="px-4 py-1.5 rounded-full bg-secondary/30 border border-border/50 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
               >
                 {tag}
               </motion.span>
             ))}
          </div>
        </motion.div>
      </div>
      
      {/* Abstract decorative elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute -top-24 -left-24 w-64 h-64 border border-foreground rounded-full hidden lg:block"
      />
      <motion.div 
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 0.03, width: '100%' }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute -bottom-16 left-0 h-[1px] bg-foreground"
      />
    </motion.div>
  );
};


