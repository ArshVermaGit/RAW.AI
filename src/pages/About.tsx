import { ArrowLeft, Mail, Github, Linkedin, Twitter, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { MagneticButton } from '@/components/MagneticButton';
import arshAvatar from '@/assets/arsh-avatar.jpg';
import { motion } from 'framer-motion';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-4 md:p-8">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>
      </nav>

      <main className="relative z-10 container mx-auto px-4 md:px-6 pb-24 max-w-4xl">
        {/* Hero */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-12">
            <div className="relative">
              <img 
                src={arshAvatar} 
                alt="Arsh Verma" 
                className="w-28 h-28 md:w-36 md:h-36 rounded-3xl object-cover shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                <span className="text-white text-xs">👋</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight mb-3">
                Hey, I'm Arsh!
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 text-lg">
                <MapPin className="w-4 h-4" /> India • Building things for the web
              </p>
            </div>
          </div>

          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              I'm a <span className="text-foreground font-medium">developer and designer</span> who loves making stuff that actually works—and looks good doing it. Currently studying at VIT Bhopal, but honestly, most of my learning happens at 2 AM while debugging random errors.
            </p>
            <p>
              I built <span className="text-foreground font-medium">RAW.AI</span> because I was tired of AI text that reads like a robot wrote it (because, well, it did). Every tool I make comes from scratching my own itch first.
            </p>
            <p>
              When I'm not coding, you'll find me gaming, exploring new tech, or doom-scrolling Twitter/X for the latest drama in the dev world. 
            </p>
          </div>
        </motion.div>

        {/* What I do */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">What I work on</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
              <div className="text-2xl mb-3">🎮</div>
              <h3 className="font-bold mb-2">Game Dev</h3>
              <p className="text-sm text-muted-foreground">Unity, C#, making games that are actually fun to play</p>
            </div>
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
              <div className="text-2xl mb-3">🌐</div>
              <h3 className="font-bold mb-2">Web Apps</h3>
              <p className="text-sm text-muted-foreground">React, Next.js, TypeScript—the whole modern stack</p>
            </div>
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
              <div className="text-2xl mb-3">🎨</div>
              <h3 className="font-bold mb-2">UI/UX</h3>
              <p className="text-sm text-muted-foreground">Making things pretty AND usable (yes, both)</p>
            </div>
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
              <div className="text-2xl mb-3">🤖</div>
              <h3 className="font-bold mb-2">AI Tools</h3>
              <p className="text-sm text-muted-foreground">Building useful AI integrations, not just hype</p>
            </div>
          </div>
        </motion.div>

        {/* Numbers */}
        <motion.div 
          className="mb-16 flex gap-8 md:gap-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div>
            <div className="text-4xl md:text-5xl font-black">3+</div>
            <div className="text-sm text-muted-foreground">years coding</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black">50+</div>
            <div className="text-sm text-muted-foreground">projects shipped</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black">∞</div>
            <div className="text-sm text-muted-foreground">coffee consumed</div>
          </div>
        </motion.div>

        {/* Connect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6">Let's connect</h2>
          <p className="text-muted-foreground mb-8">
            Got a cool project? Want to collab? Or just want to say hi? I'm always down to chat.
          </p>
          <div className="flex flex-wrap gap-3">
            <MagneticButton 
              variant="primary" 
              onClick={() => window.open('https://github.com/ArshVermaGit', '_blank')}
              className="gap-2"
            >
              <Github className="w-4 h-4" /> GitHub
            </MagneticButton>
            <MagneticButton 
              variant="secondary"
              onClick={() => window.open('https://www.linkedin.com/in/arshvermadev/', '_blank')}
              className="gap-2"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </MagneticButton>
            <MagneticButton 
              variant="ghost" 
              onClick={() => window.open('https://x.com/TheArshVerma', '_blank')}
              className="gap-2"
            >
              <Twitter className="w-4 h-4" /> Twitter
            </MagneticButton>
            <MagneticButton 
              variant="ghost"
              onClick={() => window.location.href = 'mailto:arshverma.dev@gmail.com'} 
              className="gap-2"
            >
              <Mail className="w-4 h-4" /> Email
            </MagneticButton>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="mt-16 pt-16 border-t border-border/50 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-muted-foreground mb-6">Want to work together on something?</p>
          <MagneticButton size="xl" onClick={() => navigate('/contact')}>
            Let's Talk <ChevronRight className="w-4 h-4 ml-1" />
          </MagneticButton>
        </motion.div>
      </main>
    </div>
  );
};

export default About;
