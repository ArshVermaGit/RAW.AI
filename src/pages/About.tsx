import { ArrowLeft, Mail, Github, Linkedin, Twitter, Gamepad2, Code2, Sparkles, GraduationCap, Globe, Cpu, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { MagneticButton } from '@/components/MagneticButton';
import arshAvatar from '@/assets/arsh-avatar.jpg';
import { motion } from 'framer-motion';

const About = () => {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50, damping: 20 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-primary/20">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6 md:p-10 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full bg-background/50 backdrop-blur-md border border-border/40 hover:border-primary/50"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform ease-out-expo" />
          <span className="text-sm font-medium">Return Home</span>
        </button>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pb-24 max-w-6xl">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Header Section - Full Width */}
          <motion.div variants={item} className="col-span-1 md:col-span-12 mb-8 text-center md:text-left">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
              Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Digital Needs</span>
              <br />
              <span className="text-muted-foreground/40">Into Reality.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
              I'm <span className="text-foreground font-semibold">Arsh Verma</span>. I blend creative vision with engineering precision to craft digital experiences that feel alive.
            </p>
          </motion.div>

          {/* Profile Card - Large */}
          <motion.div variants={item} className="col-span-1 md:col-span-5 row-span-2 relative group overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/30 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
            <img 
              src={arshAvatar} 
              alt="Arsh Verma" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/20 mb-4 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Open for Collaboration
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Arsh Verma</h2>
              <p className="text-white/80 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> San Francisco, CA (Remote)
              </p>
            </div>
          </motion.div>

          {/* Education Card */}
          <motion.div variants={item} className="col-span-1 md:col-span-4 p-8 rounded-[2.5rem] border border-border/50 bg-card/30 backdrop-blur-md flex flex-col justify-between group hover:border-primary/50 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <GraduationCap className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Education</h3>
              <p className="text-xl font-semibold mb-1">Tech Gaming Technology</p>
              <p className="text-blue-500 font-medium">VIT Bhopal University</p>
            </div>
          </motion.div>

          {/* Role Card */}
          <motion.div variants={item} className="col-span-1 md:col-span-3 p-8 rounded-[2.5rem] border border-border/50 bg-card/30 backdrop-blur-md flex flex-col justify-between group hover:border-purple-500/50 transition-colors">
             <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Code2 className="w-7 h-7 text-purple-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Focus</h3>
              <p className="text-xl font-semibold">Full-Stack &amp;</p>
              <p className="text-purple-500 font-medium">Game Development</p>
            </div>
          </motion.div>

          {/* Skills Marquee / Grid */}
          <motion.div variants={item} className="col-span-1 md:col-span-7 p-8 rounded-[2.5rem] border border-border/50 bg-card/30 backdrop-blur-md">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" /> Technical Arsenal
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Unity 3D', icon: Gamepad2, color: 'text-white' },
                { label: 'React / Next.js', icon: Globe, color: 'text-blue-400' },
                { label: 'TypeScript', icon: Code2, color: 'text-blue-600' },
                { label: 'UI/UX Design', icon: Sparkles, color: 'text-pink-500' },
                { label: 'Node.js', icon: Cpu, color: 'text-green-500' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-background/40 border border-border/20">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                  <span className="font-medium text-sm">{s.label}</span>
                </div>
              ))}
              <div className="flex items-center justify-center p-3 rounded-xl bg-primary/10 border border-primary/20">
                <span className="font-bold text-sm text-primary">+ Many More</span>
              </div>
            </div>
          </motion.div>

          {/* Philosophy Card */}
          <motion.div variants={item} className="col-span-1 md:col-span-12 p-10 rounded-[2.5rem] border border-border/50 bg-gradient-to-br from-card/50 to-background backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-[20%] bg-primary/5 blur-3xl rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-700" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-10">
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl md:text-4xl font-display font-bold">
                  "I don't just write code.<br />I engineer <span className="text-primary">emotions</span>."
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                  My philosophy is simple: technology should feel invisible. Whether it's a complex game mechanic or a seamless web authentication flow, the user should only feel the magic, not the machine. I strive for perfection in every pixel and logic gate.
                </p>
                <div className="pt-4 flex flex-wrap gap-4">
                  <MagneticButton 
                    variant="primary" 
                    onClick={() => window.open('https://github.com/ArshVermaGit', '_blank')}
                    className="gap-3"
                  >
                    <Github className="w-5 h-5" /> Visit GitHub
                  </MagneticButton>
                  <MagneticButton 
                    variant="secondary"
                    onClick={() => window.open('https://www.linkedin.com/in/arshvermadev/', '_blank')}
                    className="gap-3"
                  >
                    <Linkedin className="w-5 h-5 text-blue-500" /> LinkedIn
                  </MagneticButton>
                  <MagneticButton 
                    variant="ghost" 
                    onClick={() => window.open('https://x.com/TheArshVerma', '_blank')}
                    className="gap-3"
                  >
                    <Twitter className="w-5 h-5 text-sky-400" /> 
                  </MagneticButton>
                  <MagneticButton 
                    variant="ghost"
                    onClick={() => window.location.href = 'mailto:arshverma.dev@gmail.com'} 
                    className="gap-3"
                  >
                    <Mail className="w-5 h-5 text-red-400" /> 
                  </MagneticButton>
                </div>
              </div>
              
              <div className="hidden md:flex flex-col gap-4 min-w-[200px]">
                <div className="p-6 rounded-3xl bg-background/50 border border-border/50 backdrop-blur-sm">
                  <div className="text-4xl font-bold mb-1">3+</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Years Exp</div>
                </div>
                <div className="p-6 rounded-3xl bg-background/50 border border-border/50 backdrop-blur-sm">
                  <div className="text-4xl font-bold mb-1">50+</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Projects</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA / Footer of About */}
          <motion.div variants={item} className="col-span-1 md:col-span-12 mt-12 text-center">
            <p className="text-muted-foreground mb-6">Want to create something amazing together?</p>
            <MagneticButton size="xl" onClick={() => navigate('/contact')}>
              Let's Talk <ChevronRight className="w-4 h-4 ml-1" />
            </MagneticButton>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default About;
