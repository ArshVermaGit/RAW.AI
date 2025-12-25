import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, User, Camera, Save, ArrowLeft, Loader2, 
  Crown, CheckCircle, Clock, CreditCard, Mail, BarChart3, Zap
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FloatingParticles } from '@/components/FloatingParticles';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Subscription {
  id: string;
  plan: string;
  amount: number;
  status: string;
  created_at: string;
}

const Profile = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [monthlyUsage, setMonthlyUsage] = useState<number>(0);
  const [loadingUsage, setLoadingUsage] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Load profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUsername(profile.username || '');
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  // Load subscription history and usage
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      // Fetch subscriptions
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .or(`user_id.eq.${user.id},user_email.eq.${user.email}`)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (subData) {
        setSubscriptions(subData as Subscription[]);
      }
      setLoadingHistory(false);

      // Fetch monthly usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: usageData } = await supabase
        .from('usage_logs')
        .select('words_count')
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString());

      if (usageData) {
        const total = usageData.reduce((sum, log) => sum + (log.words_count || 0), 0);
        setMonthlyUsage(total);
      }
      setLoadingUsage(false);
    };

    fetchData();
  }, [user]);

  // Get plan limits
  const getPlanLimit = () => {
    switch (profile?.subscribed_plan) {
      case 'ultra': return Infinity;
      case 'pro': return 50000;
      default: return 5000;
    }
  };

  const planLimit = getPlanLimit();
  const usagePercentage = planLimit === Infinity ? 0 : Math.min((monthlyUsage / planLimit) * 100, 100);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 2MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Delete old avatar if exists
      if (avatarUrl) {
        const oldPath = avatarUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('avatars').remove([oldPath]);
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await refreshProfile();

      toast({
        title: '✨ Avatar updated!',
        description: 'Your profile picture has been changed.',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Could not upload avatar. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          username: username,
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();

      toast({
        title: '✓ Profile saved!',
        description: 'Your changes have been saved.',
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'Save failed',
        description: 'Could not save profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getPlanBadge = (plan: string) => {
    const styles = {
      pro: 'bg-blue-500/20 text-blue-500',
      ultra: 'bg-purple-500/20 text-purple-500',
    };
    return styles[plan as keyof typeof styles] || 'bg-muted text-muted-foreground';
  };

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

      <div className="relative z-10 container mx-auto max-w-3xl px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 mb-6"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </motion.div>

          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              >
                <Sparkles className="w-5 h-5 text-background" />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-2xl font-bold"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Profile Settings
                </motion.h1>
                <motion.p 
                  className="text-muted-foreground text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Manage your account and preferences
                </motion.p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ThemeToggle />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative rounded-2xl overflow-hidden mb-8"
        >
          <motion.div 
            className="absolute -inset-px rounded-2xl bg-gradient-to-b from-foreground/20 via-foreground/5 to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          />
          
          <div className="relative bg-card/80 backdrop-blur-xl border border-border/30 rounded-2xl p-8">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-border/30">
              <div className="relative">
                <div 
                  className={cn(
                    "w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden",
                    isUploading && "opacity-50"
                  )}
                >
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center hover:bg-foreground/90 transition-colors"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h2 className="text-xl font-bold">{profile?.full_name || 'User'}</h2>
                  {profile?.subscribed_plan !== 'free' && (
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      getPlanBadge(profile?.subscribed_plan || 'free')
                    )}>
                      {profile?.subscribed_plan?.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm flex items-center gap-1 justify-center sm:justify-start">
                  <Mail className="w-3.5 h-3.5" />
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="bg-secondary/50 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                    className="bg-secondary/50 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={user?.email || ''}
                  disabled
                  className="bg-secondary/30 h-12 text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto h-12 px-8 rounded-full bg-foreground text-background hover:bg-foreground/90"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Usage Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="relative rounded-2xl overflow-hidden mb-8"
        >
          <motion.div 
            className="absolute -inset-px rounded-2xl bg-gradient-to-b from-foreground/20 via-foreground/5 to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          />
          
          <div className="relative bg-card/80 backdrop-blur-xl border border-border/30 rounded-2xl p-8">
            <motion.div 
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Monthly Usage</h3>
            </motion.div>

            {loadingUsage ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">
                      {monthlyUsage.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      words humanized this month
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="font-medium capitalize">
                        {profile?.subscribed_plan || 'free'} Plan
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {planLimit === Infinity ? 'Unlimited' : `${planLimit.toLocaleString()} words/month`}
                    </div>
                  </div>
                </div>

                {planLimit !== Infinity && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Usage</span>
                      <span className="font-medium">{usagePercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{monthlyUsage.toLocaleString()} used</span>
                      <span>{(planLimit - monthlyUsage).toLocaleString()} remaining</span>
                    </div>
                  </div>
                )}

                {profile?.subscribed_plan === 'free' && usagePercentage > 80 && (
                  <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                    <p className="text-sm text-primary font-medium">
                      You're running low on words! Upgrade to Pro for 50,000 words/month.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Subscription History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-foreground/20 via-foreground/5 to-transparent pointer-events-none" />
          
          <div className="relative bg-card/80 backdrop-blur-xl border border-border/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Subscription History</h3>
            </div>

            {loadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : subscriptions.length > 0 ? (
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        getPlanBadge(sub.plan)
                      )}>
                        <Crown className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">{sub.plan} Plan</span>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(sub.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${(sub.amount / 100).toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground uppercase">{sub.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No subscription history yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Upgrade to Pro or Ultra to unlock premium features
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
