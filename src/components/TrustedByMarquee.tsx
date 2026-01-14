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
    <section className="py-16 relative overflow-hidden border-y border-border/30">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-card/50 to-background" />
      
      <div className="container mx-auto mb-8 relative z-10">
        <motion.p 
          className="text-center text-sm text-muted-foreground font-medium uppercase tracking-wider"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Built to feel human
        </motion.p>
      </div>
      
      <div className="marquee-container relative z-10">
        <motion.div 
          className="marquee-track"
          animate={{ x: [0, -50 * items.length] }}
          transition={{ 
            x: { 
              repeat: Infinity, 
              repeatType: "loop", 
              duration: 40, 
              ease: "linear" 
            }
          }}
        >
          {items.map((detector, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 px-6 py-3 bg-card/50 border border-border/30 rounded-full hover:border-foreground/20 hover:bg-card transition-all duration-300 group cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-background transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: detector.color }}
              >
                {detector.letter}
              </div>
              <span className="text-sm font-medium whitespace-nowrap group-hover:text-foreground transition-colors">
                {detector.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
