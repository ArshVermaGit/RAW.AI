import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UsageData {
  currentUsage: number;
  planLimit: number;
  remaining: number;
  percentage: number;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const PLAN_LIMITS: Record<string, number> = {
  free: 5000,
  pro: 50000,
  ultra: Number.MAX_SAFE_INTEGER, // Effectively unlimited
};

export const useUsage = (): UsageData => {
  const authContext = useAuth();
  const user = authContext?.user;
  const profile = authContext?.profile;
  
  const [currentUsage, setCurrentUsage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const plan = profile?.subscribed_plan || 'free';
  const planLimit = PLAN_LIMITS[plan] || 5000;

  const fetchUsage = useCallback(async () => {
    if (!user) {
      setCurrentUsage(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data } = await supabase
        .from('usage_logs')
        .select('words_count')
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString());

      if (data) {
        const total = data.reduce((sum, log) => sum + (log.words_count || 0), 0);
        setCurrentUsage(total);
      }
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const isUnlimited = planLimit >= Number.MAX_SAFE_INTEGER;
  const remaining = isUnlimited ? Number.MAX_SAFE_INTEGER : Math.max(0, planLimit - currentUsage);
  const percentage = isUnlimited ? 0 : Math.min((currentUsage / planLimit) * 100, 100);

  return {
    currentUsage,
    planLimit,
    remaining,
    percentage,
    isLoading,
    refetch: fetchUsage,
  };
};
