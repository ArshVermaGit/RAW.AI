import { useEffect, useRef } from 'react';

const detectors = [
  { name: 'GPTZero', letter: 'G' },
  { name: 'Turnitin', letter: 'T' },
  { name: 'Copyleaks', letter: 'C' },
  { name: 'Originality AI', letter: 'O' },
  { name: 'Winston AI', letter: 'W' },
  { name: 'ZeroGPT', letter: 'Z' },
  { name: 'Quillbot', letter: 'Q' },
  { name: 'Grammarly', letter: 'G' },
];

export const TrustedBy = () => {
  return (
    <section className="py-12 border-y border-border bg-secondary/30">
      <div className="container mx-auto mb-6">
        <p className="text-center text-sm text-muted-foreground font-medium">
          Made to work everywhere
        </p>
      </div>
      
      <div className="marquee-container">
        <div className="marquee-track">
          {/* Double the items for seamless loop */}
          {[...detectors, ...detectors].map((detector, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-6 py-3 bg-background border border-border rounded-full hover:border-foreground/20 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform">
                {detector.letter}
              </div>
              <span className="text-sm font-medium whitespace-nowrap">{detector.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
