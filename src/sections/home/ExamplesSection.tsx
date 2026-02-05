import { ScoreDisplay } from '@/components/ScoreDisplay';

export const ExamplesSection = () => {
  return (
    <section id="examples" className="py-12 md:py-16 px-4 md:px-6 relative z-10">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4 block">Examples</span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
            See the <span className="text-gradient-animated">Difference</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
          <div className="p-5 md:p-8 rounded-2xl bg-card/50 border border-destructive/30">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-destructive/10 text-destructive">AI Detected</span>
              <span className="text-sm text-muted-foreground">GPT-4</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              "Nature is the foundation of human life, providing us with clean air, fresh water, food, and countless resources. Yet, modern development has placed heavy pressure on the environment. Forests are being cut down, rivers are polluted, and wildlife is losing its habitat."
            </p>
            <ScoreDisplay score={100} label="AI Detected" variant="danger" />
          </div>
          <div className="p-5 md:p-8 rounded-2xl bg-card/50 border border-success/30">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-success/10 text-success">Human-like</span>
              <span className="text-sm text-muted-foreground">Humanized</span>
            </div>
            <p className="text-foreground leading-relaxed mb-6">
              "Look, everything we have comes from nature—the air we breathe, the water we drink, the food on our plates. But the way we're building cities and factories, we're putting a lot of pressure on the planet. Forests are disappearing, rivers are getting polluted, and animals are losing the places they call home."
            </p>
            <ScoreDisplay score={98} label="Human Score" variant="success" />
          </div>
        </div>
      </div>
    </section>
  );
};
