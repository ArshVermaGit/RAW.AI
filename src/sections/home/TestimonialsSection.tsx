import { Star } from 'lucide-react';
import { Testimonial } from '@/components/home/Testimonial';

export const TestimonialsSection = () => {
  const testimonials = [
    { quote: "Yaar, I used to spend hours fixing my drafts. Now I just paste it here, and done—it sounds exactly like how I'd write it myself.", author: "Priya S.", role: "Content Writer" },
    { quote: "My articles were getting flagged left and right. After using RAW, zero AI detection issues. My traffic is back up!", author: "Rahul M.", role: "SEO Specialist" },
    { quote: "I run a tech blog and write almost daily. This tool is a lifesaver—saves me so much time and my posts sound natural.", author: "Ananya K.", role: "Tech Blogger" },
  ];

  return (
    <section id="testimonials" className="py-12 md:py-16 px-4 md:px-6 relative z-10 overflow-hidden bg-foreground text-background">
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
