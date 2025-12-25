import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Mail, Github, Linkedin, Twitter, Gamepad2, Code, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MagneticButton } from '@/components/MagneticButton';
import arshAvatar from '@/assets/arsh-avatar.jpg';
import { useRef } from 'react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20
    }
  }
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

const About = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll effects
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 100]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const backgroundY1 = useTransform(scrollY, [0, 500], [0, 150]);
  const backgroundY2 = useTransform(scrollY, [0, 500], [0, -100]);

  const socialLinks = [
    { icon: Mail, href: 'mailto:arshverma.dev@gmail.com', label: 'Email', color: 'hover:text-red-400' },
    { icon: Github, href: 'https://github.com/ArshVermaGit', label: 'GitHub', color: 'hover:text-purple-400' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/arshvermadev/', label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: Twitter, href: 'https://x.com/TheArshVerma', label: 'X (Twitter)', color: 'hover:text-sky-400' },
  ];

  const skills = [
    { icon: Gamepad2, label: 'Game Development', desc: 'Unity Expert' },
    { icon: Code, label: 'Full-Stack Dev', desc: 'Web & Apps' },
    { icon: Sparkles, label: 'Creative Design', desc: 'UI/UX Focus' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Effects */}
      <motion.div 
        className="absolute inset-0 bg-grid-pattern opacity-[0.02]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.02 }}
        transition={{ duration: 1 }}
      />
      <motion.div 
        className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        style={{ y: backgroundY1 }}
        animate={{ 
          x: [0, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        style={{ y: backgroundY2 }}
        animate={{ 
          x: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/8 rounded-full blur-3xl pointer-events-none"
        style={{ y: useTransform(scrollY, [0, 500], [0, 120]) }}
      />

      {/* Header */}
      <motion.header 
        className="relative z-10 p-6 md:p-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </motion.button>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 pb-20">
        {/* Hero Section with Parallax */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ y: heroY, scale: heroScale }}
          className="text-center mb-16"
        >
          {/* Avatar */}
          <motion.div
            variants={scaleIn}
            className="relative inline-block mb-8"
          >
            <motion.div 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 p-1"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <img 
                src={arshAvatar} 
                alt="Arsh Verma" 
                className="w-full h-full rounded-full object-cover"
              />
            </motion.div>
            <motion.div
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-background flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.span 
                className="text-xs font-bold text-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                ✓
              </motion.span>
            </motion.div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            Arsh Verma
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-primary font-medium mb-2"
          >
            Full-Stack Digital Creator
          </motion.p>

          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground"
          >
            Tech Gaming Technology @ VIT Bhopal
          </motion.p>
        </motion.div>

        {/* Skills Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {skills.map((skill) => (
            <motion.div
              key={skill.label}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm text-center group hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <motion.div 
                className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <skill.icon className="w-7 h-7 text-primary" />
              </motion.div>
              <h3 className="font-semibold mb-1">{skill.label}</h3>
              <p className="text-sm text-muted-foreground">{skill.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bio Section */}
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative p-8 md:p-10 rounded-3xl border border-border bg-card/30 backdrop-blur-sm mb-12 overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />
          
          <motion.div 
            className="absolute top-0 left-8 -translate-y-1/2 px-4 py-1 bg-background border border-border rounded-full"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-sm font-medium text-primary">About Me</span>
          </motion.div>

          <motion.div 
            className="space-y-6 text-lg leading-relaxed text-muted-foreground relative z-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p variants={fadeInUp}>
              I'm <span className="text-foreground font-medium">Arsh Verma</span>, a Tech Gaming Technology student at{' '}
              <span className="text-primary">VIT Bhopal</span> and a full-stack digital creator. My expertise lies in
              game development with <span className="text-foreground font-medium">Unity</span>, but I also build dynamic
              websites and apps. I've earned numerous certifications and treat every project, like my portfolio{' '}
              <span className="text-primary font-medium">arshcreates</span>, as an opportunity to blend creative vision
              with technical precision.
            </motion.p>

            <motion.p variants={fadeInUp}>
              My development philosophy is simple:{' '}
              <span className="text-foreground font-medium italic">
                turn great ideas into polished, engaging digital reality
              </span>
              . I love the challenge of coding and design, focusing on creating seamless user experiences across all
              platforms. Take a look around—I'm ready to tackle the next big project!
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="text-center"
        >
          <motion.h3 
            className="text-lg font-semibold mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Let's Connect
          </motion.h3>
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={scaleIn}
                whileHover={{ y: -6, scale: 1.08, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 ${link.color}`}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="text-center mt-16"
        >
          <MagneticButton variant="primary" size="lg" onClick={() => navigate('/')}>
            Try Humanizer.ai
          </MagneticButton>
        </motion.div>
      </main>
    </div>
  );
};

export default About;
