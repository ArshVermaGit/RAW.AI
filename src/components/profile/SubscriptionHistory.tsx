import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2, Crown, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Subscription {
  id: string;
  plan: string;
  amount: number;
  status: string;
  created_at: string;
}

export const SubscriptionHistory = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user) return;
      setLoadingHistory(true);

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
    };

    fetchSubscriptions();
  }, [user]);

  const getPlanBadge = (plan: string) => {
    const styles = {
      pro: 'bg-blue-500/20 text-blue-500',
      ultra: 'bg-purple-500/20 text-purple-500',
    };
    return styles[plan as keyof typeof styles] || 'bg-muted text-muted-foreground';
  };

  return (
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
          <h3 className="text-lg font-semibold">Payments</h3>
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
            <p className="text-muted-foreground">You haven't upgraded yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Ready for more? Upgrade to Pro or Ultra to unlock our best features.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
