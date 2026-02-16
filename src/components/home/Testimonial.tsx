import { Star } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  rating?: number;
}

export const Testimonial = ({ quote, author, role, rating = 5 }: TestimonialProps) => {
  return (
    <div className="p-8 bg-background border-2 border-border rounded-2xl hover:border-foreground/20 transition-all duration-300 h-full flex flex-col">
      {/* Stars */}
      <div className="flex gap-1 mb-6">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-foreground text-foreground" />
        ))}
      </div>
      
      {/* Quote */}
      <blockquote className="text-base leading-relaxed mb-8 flex-1">
        "{quote}"
      </blockquote>
      
      {/* Author */}
      <div className="flex items-center gap-4 pt-6 border-t border-border">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold">
          {author.charAt(0)}
        </div>
        <div>
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-muted-foreground">{role}</div>
        </div>
      </div>
    </div>
  );
};
