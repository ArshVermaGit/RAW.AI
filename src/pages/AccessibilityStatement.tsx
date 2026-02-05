import { motion } from 'framer-motion';
import { ArrowLeft, Accessibility, Eye, MousePointer, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AccessibilityStatement = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      
      <main className="container mx-auto px-6 py-12 relative z-10 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-8 gap-2 hover:bg-secondary/50"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold">Accessibility Statement</h1>
            <p className="text-xl text-muted-foreground">Last updated: January 2026</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Accessibility className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">Commitment to Accessibility</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                RAW.AI is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Eye className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">Conformance Status</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. RAW.AI is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <MousePointer className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">Accessibility Features</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Keyboard Navigation:</strong> Our site is navigable using a keyboard.</li>
                <li><strong>Color Contrast:</strong> We strive to maintain high color contrast ratios for readability.</li>
                <li><strong>Alt Text:</strong> Images include alternative text descriptions where appropriate.</li>
                <li><strong>Responsive Design:</strong> The site adapts to various screen sizes and zoom levels.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <MessageSquare className="w-6 h-6" />
                <h2 className="text-2xl font-bold m-0">Feedback</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We welcome your feedback on the accessibility of RAW.AI. Please let us know if you encounter accessibility barriers on RAW.AI:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>E-mail: arshverma.dev@gmail.com</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We try to respond to feedback within 2 business days.
              </p>
            </section>
          </div>

          <div className="pt-8 border-t border-border/30 text-center text-muted-foreground">
            <p>Accessibility is an ongoing journey, and we are dedicated to making our platform inclusive for all.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AccessibilityStatement;
