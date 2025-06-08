import React, { useState, useEffect } from 'react';
import { UserProfile, Goal, LifeSummary, AppPage } from './types';
import { generateLifeSummary, generateGoalBreakdown } from './utils/aiService';
import { useAuth } from './hooks/useAuth';
import { useSupabaseData } from './hooks/useSupabaseData';

// Components
import Landing from './components/Landing';
import Onboarding from './components/Onboarding';
import LifeSummaryComponent from './components/LifeSummary';
import GoalPlanner from './components/GoalPlanner';
import { EnhancedGoalPlanner } from './components/goal-planner';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import SuccessPage from './components/SuccessPage';
import CancelPage from './components/CancelPage';
import { ResourcesPage } from './components/resources';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, loading: authLoading } = useAuth();
  const {
    userProfile,
    lifeSummary,
    goals,
    loading: dataLoading,
    saveUserProfile,
    saveLifeSummary,
    saveGoals
  } = useSupabaseData(user?.id || null);

  // Check URL for success/cancel pages
  useEffect(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    
    if (path === '/success' || searchParams.get('session_id')) {
      setCurrentPage('success' as AppPage);
      return;
    }
    
    if (path === '/cancel') {
      setCurrentPage('cancel' as AppPage);
      return;
    }
  }, []);

  // Check if user has completed onboarding and set appropriate page
  useEffect(() => {
    // Don't change pages while loading or if we're on success/cancel pages
    if (authLoading || dataLoading || currentPage === 'success' || currentPage === 'cancel') return;

    if (!user) {
      // User not authenticated, go to landing
      if (currentPage !== 'landing') {
        setCurrentPage('landing');
      }
    } else if (userProfile) {
      // User is authenticated and has completed onboarding
      if (currentPage === 'landing' || currentPage === 'onboarding') {
        setCurrentPage('dashboard');
      }
    } else {
      // User is authenticated but hasn't completed onboarding
      if (currentPage === 'landing') {
        setCurrentPage('onboarding');
      }
    }
  }, [user, userProfile, authLoading, dataLoading, currentPage]);

  const handleOnboardingComplete = async (profile: UserProfile) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      console.log('Starting AI analysis...');
      
      // Generate life summary using AI
      const summary = await generateLifeSummary(profile);
      console.log('Life summary generated:', summary);
      
      // Generate goal breakdowns using AI
      const goalsWithBreakdown = await Promise.all(
        profile.goals.map(async (goal, index) => {
          console.log(`Generating breakdown for goal ${index + 1}:`, goal.title);
          return await generateGoalBreakdown(goal);
        })
      );
      console.log('Goal breakdowns generated:', goalsWithBreakdown);
      
      // Save to Supabase
      console.log('Saving to database...');
      await saveUserProfile(profile);
      await saveLifeSummary(summary);
      await saveGoals(goalsWithBreakdown);
      
      console.log('All data saved successfully');
      setCurrentPage('summary');
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      setError(error.message || 'There was an error processing your information. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoalsUpdate = async (updatedGoals: Goal[]) => {
    if (!user) return;
    
    try {
      await saveGoals(updatedGoals);
    } catch (error: any) {
      console.error('Error updating goals:', error);
      setError(error.message || 'Failed to update goals');
    }
  };

  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    if (!user) return;
    
    try {
      await saveUserProfile(updatedProfile);
      
      // Regenerate life summary if profile changes significantly
      const newSummary = await generateLifeSummary(updatedProfile);
      await saveLifeSummary(newSummary);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    }
  };

  const renderCurrentPage = () => {
    if (authLoading || dataLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
            <p className="text-gray-600">Setting up your LifeOS experience.</p>
          </div>
        </div>
      );
    }

    if (isProcessing) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI is Analyzing Your Life...</h2>
            <p className="text-gray-600">DeepSeek AI is processing your information and creating your personalized plan.</p>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    setIsProcessing(false);
                  }}
                  className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'landing':
        return (
          <Landing 
            onGetStarted={() => user ? setCurrentPage('dashboard') : setCurrentPage('onboarding')} 
          />
        );
      
      case 'onboarding':
        return (
          <Onboarding 
            onComplete={handleOnboardingComplete}
            onBack={() => setCurrentPage('landing')}
          />
        );
      
      case 'summary':
        return lifeSummary ? (
          <LifeSummaryComponent 
            summary={lifeSummary}
            onContinue={() => setCurrentPage('planner')}
          />
        ) : null;
      
      case 'planner':
        return (
          <EnhancedGoalPlanner 
            goals={goals}
            onGoalsUpdate={handleGoalsUpdate}
            onContinue={() => setCurrentPage('dashboard')}
          />
        );
      
      case 'dashboard':
        return (
          <Dashboard 
            goals={goals}
            onGoalsUpdate={handleGoalsUpdate}
            onPageChange={setCurrentPage}
          />
        );
      
      case 'resources':
        return <ResourcesPage />;
      
      case 'settings':
        return userProfile ? (
          <Settings 
            profile={userProfile}
            onProfileUpdate={handleProfileUpdate}
          />
        ) : null;

      case 'success':
        return <SuccessPage />;

      case 'cancel':
        return <CancelPage />;
      
      default:
        return <Landing onGetStarted={() => setCurrentPage('onboarding')} />;
    }
  };

  const showNavigation = user && userProfile && 
    !['landing', 'onboarding', 'success', 'cancel'].includes(currentPage) && 
    !isProcessing;

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavigation && (
        <Navigation 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
      {renderCurrentPage()}
    </div>
  );
}

export default App;