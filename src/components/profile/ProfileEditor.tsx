import { motion } from 'framer-motion';
import { User, Mail, Pencil, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useModals } from '@/hooks/use-modals';
import { cn } from '@/lib/utils';

export const ProfileEditor = () => {
  const { user, profile } = useAuth();
  const { openModal } = useModals();

  const getPlanBadge = (plan: string) => {
    const styles = {
      pro: 'bg-blue-500/20 text-blue-500',
      ultra: 'bg-purple-500/20 text-purple-500',
    };
    return styles[plan as keyof typeof styles] || 'bg-muted text-muted-foreground';
  };

  return (
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

      <div className="relative bg-card/80 backdrop-blur-xl border border-border/30 rounded-2xl p-6 md:p-8">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 mb-8 pb-8 border-b border-border/30">
          <div className="relative group cursor-pointer" onClick={() => openModal('edit-photo')}>
            <div
              className={cn(
                "w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden transition-opacity group-hover:opacity-80"
              )}
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center hover:bg-foreground/90 transition-colors shadow-lg">
              <Camera className="w-4 h-4" />
            </div>
          </div>

          <div className="text-center sm:text-left flex-1">
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
            <p className="text-muted-foreground text-sm flex items-center gap-1 justify-center sm:justify-start break-all">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              {user?.email}
            </p>
          </div>
        </div>

        {/* Profile Details Read-Only View */}
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2 p-4 rounded-xl bg-secondary/20 border border-border/10">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Full Name</label>
              <div className="font-medium text-lg">{profile?.full_name || 'Not set'}</div>
            </div>
            <div className="space-y-2 p-4 rounded-xl bg-secondary/20 border border-border/10">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Username</label>
              <div className="font-medium text-lg">{profile?.username || 'Not set'}</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/10 text-muted-foreground flex justify-between items-center">
                <span>{user?.email}</span>
                <span className="text-xs px-2 py-1 bg-background/50 rounded text-muted-foreground">Cannot Change</span>
            </div>
          </div>

          <Button
            onClick={() => openModal('edit-profile')}
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
