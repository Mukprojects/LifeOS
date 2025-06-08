import React, { useState, useEffect } from 'react';
import { Calendar, Target, TrendingUp, CheckCircle, Clock, Star, ArrowRight, Zap, Plus, List, User, Crown } from 'lucide-react';
import { Goal, Task, AppPage } from '../types';
import { useStripe } from '../hooks/useStripe';
import { useStreak } from '../hooks/useStreak';
import PricingModal from './PricingModal';

interface DashboardProps {
  goals: Goal[];
  onGoalsUpdate: (goals: Goal[]) => void;
  onPageChange: (page: AppPage) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ goals, onGoalsUpdate, onPageChange }) => {
  const [todaysFocus, setTodaysFocus] = useState<Task[]>([]);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [subscription, setSubscription] = useState<any>(null);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const { getSubscription } = useStripe();
  const { streakData, loading: streakLoading } = useStreak();

  useEffect(() => {
    // Generate today's focus tasks
    const allTasks = goals.flatMap(goal => 
      goal.milestones.flatMap(milestone => 
        milestone.tasks.filter(task => !task.completed).slice(0, 1)
      )
    ).slice(0, 3);
    
    setTodaysFocus(allTasks);

    // Set motivational quote
    const quotes = [
      "Discipline is choosing between what you want now and what you want most.",
      "The best time to plant a tree was 20 years ago. The second best time is now.",
      "Success is the sum of small efforts repeated day in and day out.",
      "You don't have to be great to get started, but you have to get started to be great.",
      "The difference between ordinary and extraordinary is that little extra."
    ];
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // Load subscription data
    loadSubscription();
  }, [goals]);

  const loadSubscription = async () => {
    try {
      const subData = await getSubscription();
      setSubscription(subData);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const calculateOverallProgress = () => {
    if (goals.length === 0) return 0;
    return Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length);
  };

  const getCompletedTasksThisWeek = () => {
    const allTasks = goals.flatMap(goal => 
      goal.milestones.flatMap(milestone => milestone.tasks)
    );
    return allTasks.filter(task => task.completed).length;
  };

  const getTotalTasks = () => {
    return goals.flatMap(goal => 
      goal.milestones.flatMap(milestone => milestone.tasks)
    ).length;
  };

  const markTodayTaskComplete = (taskId: string) => {
    const updatedGoals = goals.map(goal => ({
      ...goal,
      milestones: goal.milestones.map(milestone => ({
        ...milestone,
        tasks: milestone.tasks.map(task => 
          task.id === taskId ? { ...task, completed: true } : task
        )
      }))
    }));

    // Recalculate progress for each goal
    const finalGoals = updatedGoals.map(goal => {
      const totalTasks = goal.milestones.reduce((acc, m) => acc + m.tasks.length, 0);
      const completedTasks = goal.milestones.reduce((acc, m) => 
        acc + m.tasks.filter(t => t.completed).length, 0
      );
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      return { ...goal, progress };
    });

    onGoalsUpdate(finalGoals);
    
    // Update today's focus
    setTodaysFocus(prev => prev.filter(task => task.id !== taskId));
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return 'text-green-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 70) return 'from-green-500 to-green-600';
    if (progress >= 40) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const hasActiveSubscription = subscription && 
    ['active', 'trialing'].includes(subscription.subscription_status);

  const overallProgress = calculateOverallProgress();
  const completedTasks = getCompletedTasksThisWeek();
  const totalTasks = getTotalTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-fade-in">Welcome back! 👋</h1>
          <p className="text-gray-600 animate-slide-up">Here's your progress and today's focus</p>
          
          {/* Subscription Status */}
          {hasActiveSubscription ? (
            <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium transform hover:scale-105 transition-all duration-300 shadow-lg">
              <Crown className="h-4 w-4" />
              Premium Active
            </div>
          ) : (
            <div className="mt-4">
              <button
                onClick={() => setPricingModalOpen(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Crown className="h-4 w-4" />
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className={`text-2xl font-bold ${getProgressColor(overallProgress)} animate-pulse`}>
                  {overallProgress}%
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full transform hover:rotate-12 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${getProgressBarColor(overallProgress)} transition-all duration-1000 animate-pulse`}
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-orange-600 animate-bounce">
                  {streakLoading ? '...' : `${streakData.currentStreak} days`}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full transform hover:rotate-12 transition-transform duration-300">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                <p className="text-2xl font-bold text-green-600 animate-pulse">{completedTasks}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full transform hover:rotate-12 transition-transform duration-300">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold text-purple-600 animate-pulse">{goals.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full transform hover:rotate-12 transition-transform duration-300">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Today's Focus */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="h-6 w-6 text-blue-600 animate-spin" style={{ animationDuration: '3s' }} />
                Today's Focus
              </h2>
              
              {todaysFocus.length > 0 ? (
                <div className="space-y-4">
                  {todaysFocus.map((task, index) => (
                    <div key={task.id} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100 transform hover:scale-105 transition-all duration-300 hover:shadow-lg" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                          <p className="text-gray-600 text-sm">{task.description}</p>
                        </div>
                        <button
                          onClick={() => markTodayTaskComplete(task.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 transform hover:scale-105 hover:shadow-lg"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Complete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-600">You've completed all your focus tasks for today. Great work!</p>
                </div>
              )}
            </div>

            {/* Goals Progress */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Goals Progress</h2>
              <div className="space-y-6">
                {goals.map((goal, index) => (
                  <div key={goal.id} className="border border-gray-200 rounded-xl p-4 transform hover:scale-105 transition-all duration-300 hover:shadow-lg" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                      <span className={`text-lg font-bold ${getProgressColor(goal.progress)} animate-pulse`}>
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full bg-gradient-to-r ${getProgressBarColor(goal.progress)} transition-all duration-1000`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {goal.milestones.filter(m => m.completed).length} of {goal.milestones.length} milestones completed
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Motivational Quote */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-start gap-3">
                <Star className="h-6 w-6 text-yellow-300 flex-shrink-0 mt-1 animate-pulse" />
                <div>
                  <h3 className="font-semibold mb-2">Daily Motivation</h3>
                  <p className="text-blue-100 leading-relaxed">{motivationalQuote}</p>
                </div>
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tasks Completed</span>
                  <span className="font-semibold text-gray-900">{completedTasks}/{totalTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Streak</span>
                  <span className="font-semibold text-orange-600">
                    {streakLoading ? '...' : `${streakData.currentStreak} days`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className={`font-semibold ${getProgressColor(overallProgress)}`}>
                    {overallProgress}%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => onPageChange('onboarding')}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-between transform hover:scale-105"
                >
                  <span className="text-gray-700 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Goal
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
                <button 
                  onClick={() => onPageChange('planner')}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-between transform hover:scale-105"
                >
                  <span className="text-gray-700 flex items-center gap-2">
                    <List className="h-4 w-4" />
                    View All Tasks
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
                <button 
                  onClick={() => onPageChange('settings')}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-between transform hover:scale-105"
                >
                  <span className="text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Update Profile
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
                {!hasActiveSubscription && (
                  <button 
                    onClick={() => setPricingModalOpen(true)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 flex items-center justify-between border border-blue-200 transform hover:scale-105"
                  >
                    <span className="text-blue-700 flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Upgrade to Premium
                    </span>
                    <ArrowRight className="h-4 w-4 text-blue-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bolt Hackathon Footer */}
      <div className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4">
            <p className="text-white text-lg font-semibold mb-2">Built for the Bolt Hackathon 2025</p>
            <p className="text-gray-400 text-sm">Transforming lives through AI-powered personal development</p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <img 
              src="/images/Powered By Bolt.png" 
              alt="Powered by Bolt"
              className="h-8 transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      <PricingModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;