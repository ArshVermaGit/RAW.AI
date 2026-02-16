import { ClipboardPaste, Wand2, Copy } from 'lucide-react';
import { StepCard } from '@/components/home/StepCard';

export const HowItWorksSection = () => {
  return (
    <section className="py-12 md:py-16 px-4 md:px-6 relative z-10">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4 block">Process</span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold">3 Simple Steps</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            { num: '01', title: 'Paste Your Text', desc: 'Copy your AI content and paste it into our editor.', icon: ClipboardPaste },
            { num: '02', title: 'Click Humanize', desc: 'Choose your settings and transform your text.', icon: Wand2 },
            { num: '03', title: 'Copy & Use', desc: 'Get natural content ready to publish anywhere.', icon: Copy },
          ].map((step, i) => (
            <div key={i} className="relative p-6 md:p-8 rounded-2xl bg-card/30 border border-border/30 group hover:bg-card/50 transition-all">
              <span className="absolute top-6 right-6 text-6xl font-bold text-foreground/5">{step.num}</span>
              <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center mb-6">
                <step.icon className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
