import { motion } from 'framer-motion';
import { Star, Crown, Lock, Feather } from 'lucide-react';
import { DynamicHeroText } from '@/components/DynamicHeroText';

export const HeroSection = () => {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-32 px-4 md:px-6 relative overflow-hidden grain-texture">
      {/* Soft Organic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03)_0%,transparent_70%)] -z-10" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col items-center">
          <DynamicHeroText />

          <div className="mt-12 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 w-full max-w-5xl border-t border-foreground/5 pt-8 md:pt-12">
            {[
              { value: '99.9%', label: 'Human Score', icon: Star },
              { value: '50K+', label: 'Readers Reached', icon: Crown },
              { value: '10M+', label: 'Stories Told', icon: Feather },
              { value: '∞', label: 'Absolute Privacy', icon: Lock },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2 + i * 0.1, duration: 1 }}
                className="flex flex-col items-center lg:items-start group cursor-default"
              >
                <div className="flex items-center gap-3 mb-3">
                  <stat.icon className="w-4 h-4 text-muted-foreground/30 group-hover:text-foreground transition-colors" strokeWidth={1} />
                  <div className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-0">{stat.value}</div>
                </div>
                <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground/40 font-sans">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
