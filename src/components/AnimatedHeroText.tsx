import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const words = ['Authentic', 'Natural', 'Human', 'Engaging', 'Original'];

export const AnimatedHeroText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <motion.h1
        className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tighter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="block mb-2">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            RAW.AI
          </motion.span>
          {' '}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground"
          >
            AI Text
          </motion.span>
        </span>

        <span className="block">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground"
          >
            to
          </motion.span>
          {' '}
          <span className="relative inline-block min-w-[280px] sm:min-w-[350px] md:min-w-[450px]">
            {words.map((word, index) => (
              <motion.span
                key={word}
                className="absolute left-0"
                initial={{ opacity: 0, y: 40, rotateX: -90 }}
                animate={{
                  opacity: index === currentIndex ? 1 : 0,
                  y: index === currentIndex ? 0 : -40,
                  rotateX: index === currentIndex ? 0 : 90,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent glow-text">
                  {word}
                </span>
              </motion.span>
            ))}
            {/* Placeholder for spacing */}
            <span className="invisible">{words[0]}</span>
          </span>
        </span>
      </motion.h1>

      {/* Decorative element */}
      <motion.div
        className="absolute -right-8 top-0 w-20 h-20 border border-foreground/20 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      <motion.div
        className="absolute -left-4 bottom-4 w-3 h-3 bg-foreground rounded-full"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
    </div>
  );
};
