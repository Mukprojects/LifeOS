import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface StreakData {
  currentStreak: number;
  lastLoginDate: string;
  totalDays: number;
}

export const useStreak = () => {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    lastLoginDate: '',
    totalDays: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadAndUpdateStreak();
    } else {
      setStreakData({ currentStreak: 0, lastLoginDate: '', totalDays: 0 });
      setLoading(false);
    }
  }, [user]);

  const loadAndUpdateStreak = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get current user profile to check for existing streak data
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile for streak:', profileError);
        return;
      }

      const today = new Date().toDateString();
      let currentStreak = 1;
      let lastLoginDate = today;
      let totalDays = 1;

      if (profileData?.profile_data?.streakData) {
        const existingStreak = profileData.profile_data.streakData;
        const lastLogin = new Date(existingStreak.lastLoginDate);
        const todayDate = new Date();
        
        // Calculate days difference
        const timeDiff = todayDate.getTime() - lastLogin.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

        if (daysDiff === 0) {
          // Same day login - keep existing streak
          currentStreak = existingStreak.currentStreak;
          totalDays = existingStreak.totalDays;
          lastLoginDate = existingStreak.lastLoginDate;
        } else if (daysDiff === 1) {
          // Next day login - increment streak
          currentStreak = existingStreak.currentStreak + 1;
          totalDays = existingStreak.totalDays + 1;
          lastLoginDate = today;
        } else if (daysDiff > 1) {
          // Streak broken - reset to 1
          currentStreak = 1;
          totalDays = existingStreak.totalDays + 1;
          lastLoginDate = today;
        }

        // Update the profile with new streak data
        if (daysDiff > 0) {
          const updatedProfile = {
            ...profileData.profile_data,
            streakData: {
              currentStreak,
              lastLoginDate,
              totalDays
            }
          };

          await supabase
            .from('user_profiles')
            .update({
              profile_data: updatedProfile,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        }
      } else if (profileData) {
        // First time setting up streak data
        const updatedProfile = {
          ...profileData.profile_data,
          streakData: {
            currentStreak: 1,
            lastLoginDate: today,
            totalDays: 1
          }
        };

        await supabase
          .from('user_profiles')
          .update({
            profile_data: updatedProfile,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      }

      setStreakData({
        currentStreak,
        lastLoginDate,
        totalDays
      });
    } catch (error) {
      console.error('Error updating streak:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetStreak = async () => {
    if (!user) return;

    try {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        const updatedProfile = {
          ...profileData.profile_data,
          streakData: {
            currentStreak: 1,
            lastLoginDate: new Date().toDateString(),
            totalDays: (profileData.profile_data.streakData?.totalDays || 0) + 1
          }
        };

        await supabase
          .from('user_profiles')
          .update({
            profile_data: updatedProfile,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        setStreakData(updatedProfile.streakData);
      }
    } catch (error) {
      console.error('Error resetting streak:', error);
    }
  };

  return {
    streakData,
    loading,
    resetStreak
  };
};