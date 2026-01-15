import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How does RAW.AI humanize text?",
      answer: "RAW.AI uses advanced proprietary algorithms to restructure text, vary sentence length, and introduce natural nuances. It analyzes millions of human-written patterns to replicate the authentic 'imperfections' and flow that characterize human writing."
    },
    {
      question: "Will the text pass AI detectors?",
      answer: "Yes. Our 'Ultra' mode is specifically designed to bypass the most rigorous AI detectors, including Turnitin, GPTZero, and Originality.ai. We constantly update our models to stay ahead of detection technology."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We adhere to strict privacy standards. Your input text is processed securely and is not stored or used to train our models. We believe in absolute privacy for your creative work."
    },
    {
      question: "What is the difference between Pro and Ultra plans?",
      answer: "Pro is great for general content creation and basic humanization. Ultra offers our deepest level of humanization, specifically engineered for academic and high-stakes content that requires a 99.9% human score and detection bypass."
    },
    {
      question: "Can I use the API?",
      answer: "Yes, API access is available on both Pro and Ultra plans. You can integrate RAW.AI's humanization engine directly into your own applications or workflows."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 7-day money-back guarantee if you're not satisfied with the results. Just contact our support team, and we'll take care of it."
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
      <main className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">Everything you need to know about RAW.AI.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </main>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-card/30 backdrop-blur-sm overflow-hidden transition-all hover:border-primary/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-semibold text-lg">{question}</span>
        <div className={`p-2 rounded-full bg-primary/10 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? <Minus className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-primary" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQ;
