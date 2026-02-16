import { InteractiveCard } from '@/components/home/InteractiveCard';
import { featuresList, Feature } from '@/data/features';

interface FeaturesSectionProps {
  onFeatureClick: (feature: Feature) => void;
}


export const FeaturesSection = ({ onFeatureClick }: FeaturesSectionProps) => {
  return (
    <section id="features" className="py-12 md:py-16 px-4 md:px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4 block">Features</span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
            Why Choose <span className="text-gradient-animated">RAW.AI</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Turn robotic AI text into writing that actually sounds like you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuresList.map((feature, index) => (
            <InteractiveCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              onClick={() => onFeatureClick(feature)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
