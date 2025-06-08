import { useState, useEffect, useCallback } from 'react';
import { supabase, enhanceGoalStructure, getResourcesData, generateBookRecommendations } from '../lib/supabase';
import { UserProfile, Goal, LifeSummary, ResourcesData } from '../types';

export const useSupabaseData = (userId: string | null) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [lifeSummary, setLifeSummary] = useState<LifeSummary | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [resourcesData, setResourcesData] = useState<ResourcesData | null>(null);
  const [isLoadingResources, setIsLoadingResources] = useState<boolean>(false);
  const [resourcesError, setResourcesError] = useState<Error | null>(null);

  useEffect(() => {
    if (userId) {
      loadUserData();
    } else {
      setUserProfile(null);
      setLifeSummary(null);
      setGoals([]);
      setLoading(false);
    }
  }, [userId]);

  const loadUserData = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile:', profileError);
      } else if (profileData) {
        setUserProfile(profileData.profile_data);
      }

      // Load life summary
      const { data: summaryData, error: summaryError } = await supabase
        .from('life_summaries')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (summaryError && summaryError.code !== 'PGRST116') {
        console.error('Error loading summary:', summaryError);
      } else if (summaryData) {
        setLifeSummary(summaryData.summary_data);
      }

      // Load goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (goalsError) {
        console.error('Error loading goals:', goalsError);
      } else if (goalsData) {
        // Enhance goals with new structure
        const enhancedGoals = await enhanceGoalStructure(goalsData.map(goal => goal.goal_data));
        setGoals(enhancedGoals);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUserProfile = async (profile: UserProfile) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          profile_data: profile,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving profile:', error);
        throw new Error(`Failed to save profile: ${error.message}`);
      }

      setUserProfile(profile);
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  };

  const saveLifeSummary = async (summary: LifeSummary) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      const { error } = await supabase
        .from('life_summaries')
        .upsert({
          user_id: userId,
          summary_data: summary,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving summary:', error);
        throw new Error(`Failed to save summary: ${error.message}`);
      }

      setLifeSummary(summary);
    } catch (error) {
      console.error('Error saving life summary:', error);
      throw error;
    }
  };

  const saveGoals = async (goalsToSave: Goal[]) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      // Delete existing goals for this user
      await supabase
        .from('goals')
        .delete()
        .eq('user_id', userId);

      // Insert new goals
      if (goalsToSave.length > 0) {
        const goalsData = goalsToSave.map(goal => ({
          user_id: userId,
          goal_data: goal,
          created_at: new Date().toISOString()
        }));

        const { error } = await supabase
          .from('goals')
          .insert(goalsData);

        if (error) {
          console.error('Error saving goals:', error);
          throw new Error(`Failed to save goals: ${error.message}`);
        }
      }

      setGoals(goalsToSave);
    } catch (error) {
      console.error('Error saving goals:', error);
      throw error;
    }
  };

  const fetchResourcesData = useCallback(async () => {
    if (!userId) return;
    
    setIsLoadingResources(true);
    setResourcesError(null);
    
    try {
      const data = await getResourcesData(userId);
      setResourcesData(data);
    } catch (error) {
      console.error('Error fetching resources data:', error);
      setResourcesError(error as Error);
    } finally {
      setIsLoadingResources(false);
    }
  }, [userId]);

  const refreshBookRecommendations = useCallback(async () => {
    if (!userId) return;
    
    setIsLoadingResources(true);
    setResourcesError(null);
    
    try {
      const data = await generateBookRecommendations(userId);
      setResourcesData(data);
    } catch (error) {
      console.error('Error generating book recommendations:', error);
      setResourcesError(error as Error);
    } finally {
      setIsLoadingResources(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchResourcesData();
    }
  }, [userId, fetchResourcesData]);

  return {
    userProfile,
    lifeSummary,
    goals,
    loading,
    saveUserProfile,
    saveLifeSummary,
    saveGoals,
    refreshData: loadUserData,
    resourcesData,
    isLoadingResources,
    resourcesError,
    fetchResourcesData,
    refreshBookRecommendations,
  };
};