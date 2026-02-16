import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const DynamicHeroText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Organic parallax effects
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);

  const containerVars: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  };

  const itemVars: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1.5, 
        ease: [0.19, 1, 0.22, 1]
      } 
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className="relative w-full z-10 py-4"
      variants={containerVars}
      initial="initial"
      animate="animate"
    >
      <div className="flex flex-col items-center relative z-10 bg-transparent">
        
        <div className="relative mb-8 px-4">
          <motion.div 
            style={{ y: y2 }}
            className="flex flex-col items-center"
          >
            <h1 className="flex flex-col items-center text-center gap-2">
              <motion.span 
                variants={itemVars}
                className="text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tight leading-none text-foreground drop-shadow-2xl"
              >
                RAW<span className="text-muted-foreground/20 italic font-serif font-light">.</span>AI
              </motion.span>
              <motion.span 
                variants={itemVars}
                className="text-2xl md:text-3xl lg:text-4xl font-light tracking-widest text-muted-foreground/80 mt-4 uppercase"
              >
                AI Text Humanizer & Detector
              </motion.span>
            </h1>
          </motion.div>

        </div>
      </div>


    </motion.div>
  );
};


