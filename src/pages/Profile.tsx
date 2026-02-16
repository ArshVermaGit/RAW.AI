import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { FloatingParticles } from '@/components/home/FloatingParticles';
import { useAuth } from '@/hooks/useAuth';

// Sub Components
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileEditor } from '@/components/profile/ProfileEditor';
import { UsageStats } from '@/components/profile/UsageStats';
import { SubscriptionHistory } from '@/components/profile/SubscriptionHistory';

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <FloatingParticles />
      <motion.div
        className="fixed inset-0 grid-bg opacity-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      />

      {/* Animated background orbs */}
      <motion.div
        className="fixed top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="fixed bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 container mx-auto max-w-3xl px-4 md:px-6 py-8 md:py-12">
        <ProfileHeader />
        
        <ProfileEditor />
        
        <UsageStats />
        
        <SubscriptionHistory />
      </div>
    </div>
  );
};

export default Profile;
