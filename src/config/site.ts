import { Star, Crown, Feather, Lock } from 'lucide-react';

export const siteConfig = {
  name: "RAW.AI",
  description: "Bypass AI detection with human-grade rewriting.",
  links: {
    github: "https://github.com/ArshVermaGit",
    linkedin: "https://www.linkedin.com/in/arshvermadev/",
    twitter: "https://x.com/TheArshVerma",
    email: "arshverma.dev@gmail.com"
  },
  nav: [
    { label: "Features", href: "#", id: "features" },
    { label: "Examples", href: "#", id: "examples" },
    { label: "Testimonials", href: "#", id: "testimonials" },
    { label: "Pricing", href: "#", id: "pricing" },
    { label: "About", href: "/about", id: null },
  ],
  heroStats: [
    { value: '99.9%', label: 'Human Score', icon: Star },
    { value: '50K+', label: 'Readers Reached', icon: Crown },
    { value: '10M+', label: 'Stories Told', icon: Feather },
    { value: '∞', label: 'Absolute Privacy', icon: Lock },
  ],
  plans: {
    free: {
      id: 'free',
      name: 'Lite',
      price: '$0',
      description: 'Great for a quick start',
      features: [
        '5,000 words every month',
        'Basic AI bypass',
        'Fast processing',
        'Email support',
      ],
      cta: 'Current Plan',
      popular: false,
    },
    pro: {
      id: 'pro',
      name: 'Pro',
      price: '$5',
      originalPrice: '$10',
      description: 'Perfect for serious writers',
      features: [
        'Write unlimited words',
        'Advanced human touch',
        'Deep AI detection check',
        'Better for SEO',
        'Priority help',
        'API access',
      ],
      cta: 'Join Pro',
      popular: true,
    },
    ultra: {
      id: 'ultra',
      name: 'Ultra',
      price: '$10',
      originalPrice: '$20',
      description: 'For teams and power users',
      features: [
        'Everything in Pro',
        'The deepest human mode',
        '99.9% pass guarantee',
        'Use your own brand',
        'Unlimited API use',
        'Personal support',
      ],
      cta: 'Get Ultra',
      popular: false,
    },
  },
  onboarding: {
    steps: [
      {
        id: 1,
        title: "Make it Human",
        subtitle: "Turn AI writing into something real",
        description: "We've designed our tools to take AI-generated text and give it a natural, human touch. Your message stays the same, it just sounds more like you.",
        features: [
          "Keep your original message",
          "Add natural human flow",
          "Keep your unique voice"
        ],
        gradient: "from-foreground/20 via-foreground/10 to-transparent"
      },
      {
        id: 2,
        title: "Written for People",
        subtitle: "Write with total confidence",
        description: "We help your content feel authentic so it can go wherever you need it to—without anyone questioning if it was made by a machine.",
        features: [
          "Designed to feel 100% human",
          "Works for every detector",
          "See your score as you go"
        ],
        gradient: "from-foreground/15 via-foreground/5 to-transparent"
      },
      {
        id: 3,
        title: "Quick and Easy",
        subtitle: "Get it done in a flash",
        description: "We know your time is valuable. Get your writing ready in seconds, so you can focus on the things that matter most.",
        features: [
          "Up to 10,000 words at once",
          "Instant results",
          "Easy to use"
        ],
        gradient: "from-foreground/10 via-foreground/5 to-transparent"
      },
      {
        id: 4,
        title: "You're All Set!",
        subtitle: "Welcome to RAW.AI",
        description: "You're ready to start. Begin with our free plan and upgrade whenever you need more room to grow.",
        features: [
          "Start with 500 free words",
          "Friendly support",
          "Access to all tools"
        ],
        gradient: "from-foreground/20 via-foreground/10 to-transparent"
      }
    ]
  },
  footerNav: [
    { 
      title: 'Product', 
      links: [
        { label: 'Features', href: '/', id: 'features' }, 
        { label: 'How It Works', href: '/how-it-works', id: null }
      ] 
    },
    { 
      title: 'Legal', 
      links: [
        { label: 'Privacy Policy', href: '/privacy', id: null }, 
        { label: 'Terms of Service', href: '/terms', id: null },
        { label: 'Refund Policy', href: '/refund-policy', id: null },
        { label: 'Payment Policy', href: '/payment-policy', id: null },
        { label: 'Accessibility Statement', href: '/accessibility-statement', id: null },
        { label: 'Disclaimer', href: '/disclaimer', id: null },
        { label: 'Cookie Policy', href: '/cookie-policy', id: null },
        { label: 'Cookie Settings', href: '#', id: 'cookie-settings' }
      ] 
    },
    { 
      title: 'Company', 
      links: [
        { label: 'About Us', href: '/about', id: null },
        { label: 'Contact', href: '/contact', id: null },
        { label: 'Support', href: '/support', id: null },
        { label: 'Security', href: '/security', id: null },
        { label: 'FAQ', href: '/faq', id: null },
        { label: 'Changelog', href: '/changelog', id: null },
        { label: 'Sitemap', href: '/sitemap', id: null }
      ] 
    },
  ]
};
