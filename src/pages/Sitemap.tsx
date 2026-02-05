import { ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Sitemap = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Main',
      links: [
        { label: 'Home', href: '/' },
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Support', href: '/support' },
      ]
    },
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/#features' },
        { label: 'Pricing', href: '/#pricing' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Changelog', href: '/changelog' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'FAQ', href: '/faq' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Disclaimer', href: '/disclaimer' },
        { label: 'Cookie Policy', href: '/cookie-policy' },
        { label: 'Refund Policy', href: '/refund-policy' },
      ]
    },
    {
      title: 'Account',
      links: [
        { label: 'Sign In', href: '/auth' },
        { label: 'Profile', href: '/profile' },
      ]
    },
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
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Sitemap</h1>
          <p className="text-lg md:text-xl text-muted-foreground">All pages on RAW.AI, neatly organized.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-lg font-bold mb-4 text-foreground">{section.title}</h2>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link 
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Sitemap;
