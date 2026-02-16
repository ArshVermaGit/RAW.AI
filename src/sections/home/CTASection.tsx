import { ArrowRight } from 'lucide-react';
import { MagneticButton } from '@/components/common';

export const CTASection = () => {
  return (
    <section className="py-12 md:py-16 px-4 md:px-6 relative z-10">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Ready to Humanize?</h2>
        <p className="text-base md:text-lg text-muted-foreground mb-8 md:mb-10">Join thousands of creators who trust our tool.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton size="xl" onClick={() => document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' })}>
            Start Free Now <ArrowRight className="w-5 h-5 ml-2" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};
