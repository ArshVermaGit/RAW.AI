import { Star } from 'lucide-react';

export const TestimonialsSection = () => {
  const testimonials = [
    { quote: "I always refine drafts to make them more engaging. This tool helped polish my words while keeping my style intact.", author: "Emily D.", role: "Content Writer" },
    { quote: "In SEO, originality is crucial. This tool helped me produce materials that improved my website ranking significantly.", author: "Michael L.", role: "SEO Expert" },
    { quote: "Running a blog requires lots of high-quality articles. This lets me quickly generate content that sounds natural.", author: "Lisa W.", role: "Blogger" },
  ];

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 relative z-10 overflow-hidden bg-foreground text-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-xs font-medium uppercase tracking-wider opacity-60 mb-4 block">Testimonials</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold">Loved by Creators</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="p-8 rounded-2xl border border-background/20 bg-background/5 backdrop-blur-sm">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <blockquote className="leading-relaxed mb-8 opacity-90">"{testimonial.quote}"</blockquote>
              <div className="flex items-center gap-4 pt-6 border-t border-background/20">
                <div className="w-12 h-12 rounded-full bg-background/20 flex items-center justify-center font-bold">{testimonial.author.charAt(0)}</div>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm opacity-60">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
