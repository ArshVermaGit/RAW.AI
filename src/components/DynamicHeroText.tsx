import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { Feather, Quote, Globe, Heart } from 'lucide-react';
import { useRef } from 'react';

export const DynamicHeroText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Organic parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
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
      className="relative w-full z-10 py-8"
      variants={containerVars}
      initial="initial"
      animate="animate"
    >
      <div className="flex flex-col items-center relative z-10">
        {/* Subtle Brand Mark */}
        <motion.div variants={itemVars} className="mb-6 flex items-center gap-4">
          <div className="h-px w-8 bg-foreground/20" />
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted-foreground">
            A Human Story
          </span>
          <div className="h-px w-8 bg-foreground/20" />
        </motion.div>
        
        <div className="relative mb-8 px-4">
          <motion.div 
            style={{ y: y2 }}
            className="flex flex-col items-center"
          >
            <h1 className="flex flex-col items-center text-center gap-2">
              <motion.span 
                variants={itemVars}
                className="text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tight leading-none text-foreground"
              >
                RAW<span className="text-muted-foreground/20 italic font-serif font-light">.</span>AI
              </motion.span>
              <motion.span 
                variants={itemVars}
                className="text-4xl md:text-6xl lg:text-7xl font-serif italic font-medium text-muted-foreground/40 -mt-2 md:-mt-4 lowercase tracking-tighter"
              >
                redesigned for the soul
              </motion.span>
            </h1>
          </motion.div>

          {/* Abstract Hand-drawn Highlight (SVG) */}
          <motion.svg 
            width="200" height="40" viewBox="0 0 200 40" fill="none" 
            className="absolute -bottom-8 -right-4 md:-right-12 text-primary/10 -rotate-3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 1.5 }}
          >
            <path d="M5 30C40 10 160 10 195 35" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </motion.svg>
        </div>
        
        <motion.div 
          variants={itemVars}
          className="max-w-3xl flex flex-col items-center"
        >
          <div className="flex items-center gap-6 mb-6 opacity-40">
            <Quote className="w-5 h-5 fill-muted-foreground/20" />
          </div>
          
          <p className="text-xl md:text-3xl font-serif italic text-muted-foreground/80 text-center leading-relaxed text-balance px-4">
            "Because every piece of writing deserves a heartbeat. We don't just process text; we infuse it with the <span className="text-foreground font-medium border-b border-foreground/10">authenticity</span> of human touch."
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-8 border-t border-foreground/5 pt-8 w-full px-6">
             {[
               { icon: Feather, label: 'Natural Flow', desc: 'Rhythm in every sentence' },
               { icon: Heart, label: 'Handcrafted', desc: 'No robotic patterns' },
               { icon: Globe, label: 'Global Voice', desc: 'Speaks every language' }
             ].map((feature) => (
               <motion.div 
                 key={feature.label}
                 variants={itemVars}
                 className="flex flex-col items-center text-center group"
               >
                 <div className="w-12 h-12 rounded-full border border-foreground/5 flex items-center justify-center mb-4 group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                   <feature.icon className="w-5 h-5" strokeWidth={1} />
                 </div>
                 <p className="text-xs font-bold tracking-widest uppercase mb-1">{feature.label}</p>
                 <p className="text-[10px] text-muted-foreground/60 italic font-serif">{feature.desc}</p>
               </motion.div>
             ))}
          </div>
        </motion.div>
      </div>

      {/* Decorative Signature Effect */}
      <motion.div 
        className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none hidden xl:block z-0"
        style={{ x: y1 }}
      >
        <span className="text-[25vw] font-serif italic whitespace-nowrap">Handcrafted</span>
      </motion.div>

      {/* Ornamental Corner Elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 3, delay: 2 }}
        className="absolute top-0 left-0 w-24 h-24 border-t border-l border-foreground/20 rounded-tl-3xl hidden lg:block"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 3, delay: 2.2 }}
        className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-foreground/20 rounded-br-3xl hidden lg:block"
      />
    </motion.div>
  );
};


