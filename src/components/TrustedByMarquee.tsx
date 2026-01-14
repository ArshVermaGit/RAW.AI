import { motion } from 'framer-motion';

const detectors = [
  { name: 'GPTZero', letter: 'G', color: '#6366f1' },
  { name: 'Turnitin', letter: 'T', color: '#ec4899' },
  { name: 'Copyleaks', letter: 'C', color: '#22c55e' },
  { name: 'Originality AI', letter: 'O', color: '#f59e0b' },
  { name: 'Winston AI', letter: 'W', color: '#3b82f6' },
  { name: 'ZeroGPT', letter: 'Z', color: '#8b5cf6' },
  { name: 'Quillbot', letter: 'Q', color: '#14b8a6' },
  { name: 'Grammarly', letter: 'G', color: '#84cc16' },
];

export const TrustedByMarquee = () => {
  const items = [...detectors, ...detectors, ...detectors];

  return (
    <section className="py-24 relative overflow-hidden border-y border-white/[0.02] bg-black/20">
      {/* Side Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />
      
      <div className="container mx-auto mb-16 relative z-10">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-center text-4xl font-serif italic text-muted-foreground/30">
            designed for every medium
          </p>
          <div className="h-px w-12 bg-foreground/10" />
        </motion.div>
      </div>
      
      <div className="relative z-10 px-4" style={{ perspective: '1000px' }}>
        <motion.div 
          className="flex gap-4"
          animate={{ x: [0, -items.length * 30] }}
          style={{ rotateX: 5, rotateY: -2 }}
          transition={{ 
            x: { 
              repeat: Infinity, 
              repeatType: "loop", 
              duration: 50, 
              ease: "linear" 
            }
          }}
        >
          {items.map((detector, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 px-8 py-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-primary/30 hover:bg-white/[0.05] transition-all duration-500 group cursor-pointer whitespace-nowrap"
              whileHover={{ scale: 1.05, y: -5, rotateZ: 2 }}
            >
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-lg transition-transform duration-500 group-hover:rotate-[360deg]"
                style={{ backgroundColor: detector.color }}
              >
                {detector.letter}
              </div>
              <span className="text-sm font-bold tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">
                {detector.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
