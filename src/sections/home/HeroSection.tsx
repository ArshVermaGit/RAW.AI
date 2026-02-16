import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DynamicHeroText } from '@/components/home/DynamicHeroText';
import { MagneticButton } from '@/components/common';
import { HeroOrbitalElements } from '@/components/home/HeroOrbitalElements';
import { ArrowRight, PlayCircle, Mouse } from 'lucide-react';

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden selection:bg-primary/20">
      {/* Premium Aurora Background */}
      <div className="absolute inset-0 bg-[#030014] -z-20" />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3], 
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, -45, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,#030014_100%)] z-0" />
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="container mx-auto max-w-7xl px-4 relative z-10"
      >
        {/* Orbital Floating Elements */}
        <HeroOrbitalElements />

        <div className="flex flex-col items-center text-center relative z-20">
          
          {/* Main Typography */}
          <DynamicHeroText />

          {/* Minimalist Premium CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-6 mt-16"
          >
            <MagneticButton 
              size="lg"
              variant="primary"
              onClick={() => navigate('/auth')}
              className="group min-w-[200px] h-14 rounded-full bg-foreground text-background font-bold text-sm tracking-widest uppercase hover:bg-foreground/90 shadow-[0_0_50px_-10px_hsl(var(--foreground)/0.4)] transition-all hover:scale-105 border border-transparent"
            >
              Start Free <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
            
            <MagneticButton 
              size="lg"
              variant="outline"
              onClick={() => navigate('/how-it-works')}
              className="group min-w-[200px] h-14 rounded-full border-foreground/20 bg-foreground/5 hover:bg-foreground/10 hover:border-foreground/40 text-sm font-bold tracking-widest uppercase backdrop-blur-xl transition-all hover:scale-105 text-foreground shadow-lg"
            >
              How it works <PlayCircle className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </MagneticButton>
          </motion.div>

        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <Mouse className="w-5 h-5" />
      </motion.div>
    </section>
  );
};
