import { ArrowLeft, Cpu, UserCheck, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MagneticButton } from '@/components/common';

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Cpu,
      title: "1. Advanced Analysis",
      description: "When you input text, our engine first analyzes its structure, perplexity, and burstiness - the key metrics detectors use to identify AI. We identify the 'robotic' patterns.",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      icon: Zap,
      title: "2. Contextual Rewriting",
      description: "Our proprietary AI models then rewrite the content. Unlike simple spinners, we understand context. We inject natural human imperfections, varied sentence structures, and idiomatic expressions.",
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20"
    },
    {
      icon: UserCheck,
      title: "3. Human Verification",
      description: "The rewritten text goes through a secondary layer that simulates human editorial standards, ensuring readability and coherence while maintaining the original intent.",
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    },
    {
      icon: ShieldCheck,
      title: "4. Detection Shield",
      description: "Finally, we run the text against our internal classifiers (modeled after leading detectors) to guarantee it passes as verified human content before we show it to you.",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      {/* Header */}
      <header className="relative z-10 p-4 md:p-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pb-20">
        <div className="text-center mb-12 md:mb-20">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">How RAW.AI Works</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            From robotic to relatable. See what happens under the hood.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-border to-transparent -z-10" />
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[80%] w-px bg-gradient-to-b from-transparent via-border to-transparent -z-10" />

          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`p-6 md:p-8 rounded-[2rem] md:rounded-3xl border ${step.border} bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-500 group`}
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${step.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <step.icon className={`w-6 h-6 md:w-7 md:h-7 ${step.color}`} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <div className="inline-block p-1 rounded-full bg-secondary/50 backdrop-blur-md border border-border">
            <MagneticButton size="xl" onClick={() => navigate('/')}>
              Try It Yourself
            </MagneticButton>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
