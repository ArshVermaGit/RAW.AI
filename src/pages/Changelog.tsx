import { ArrowLeft, GitCommit, Calendar, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Changelog = () => {
  const navigate = useNavigate();

  const updates = [
    {
      version: "v2.5.0",
      date: "January 15, 2026",
      title: "The Hyper-Premium Update",
      changes: [
        "Completely redesigned UI with 'Hyper-Premium' aesthetic.",
        "Introduced 'Ultra Logic' model powered by o1-preview.",
        "Added advanced AI Detector with detailed pattern analysis.",
        "New Style Selector for tailored humanization tones.",
        "Enhanced onboarding flow for refined user experience.",
        "Implemented secure Razorpay integration for global payments."
      ]
    },
    {
      version: "v2.1.0",
      date: "December 10, 2025",
      title: "Performance & Precision",
      changes: [
        "Optimized text processing algorithms for 2x faster results.",
        "Added academic and business writing modes.",
        "Improved mobile responsiveness.",
        "Fixed minor formatting bugs in API output."
      ]
    },
    {
      version: "v1.5.0",
      date: "November 1, 2025",
      title: "Pro Features Expansion",
      changes: [
        "Launched Pro plan with unlimited word count.",
        "Added API access for developers.",
        "Integrated Google Authentication.",
        "Initial release of the 'Human Score' metric."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      {/* Header */}
      <header className="relative z-10 p-6 md:p-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Changelog</h1>
          <p className="text-xl text-muted-foreground">Follow our journey of constant improvement.</p>
        </div>

        <div className="space-y-12">
          {updates.map((update, index) => (
            <div key={index} className="relative pl-8 md:pl-0">
              {/* Timeline Line (Desktop) */}
              <div className="hidden md:block absolute left-[150px] top-0 bottom-0 w-px bg-border/50">
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-4 border-primary" />
              </div>

              <div className="md:flex gap-12 group">
                {/* Date & Version */}
                <div className="md:w-[150px] md:text-right shrink-0 mb-4 md:mb-0 pt-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
                    <Tag className="w-3 h-3" />
                    {update.version}
                  </div>
                  <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {update.date}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 rounded-3xl border border-border bg-card/30 backdrop-blur-sm hover:border-primary/20 transition-all">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    {update.title}
                  </h3>
                  <ul className="space-y-3">
                    {update.changes.map((change, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <GitCommit className="w-5 h-5 text-primary shrink-0 mt-0.5 opacity-50" />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Changelog;
