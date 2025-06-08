import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, User, Target, BarChart3, CheckCircle } from 'lucide-react';
import { UserProfile, Goal } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  onBack: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    age: 25,
    location: '',
    profession: '',
    workHours: 8,
    socialMediaHours: 2,
    frustrations: '',
    dailyRoutine: '',
    proudHabit: '',
    avoidingWhat: '',
    productivity: 5,
    health: 5,
    motivation: 5,
    mentalHealth: 5,
    careerDirection: 5,
    goals: []
  });

  const [currentGoal, setCurrentGoal] = useState({
    title: '',
    description: '',
    timeframe: '',
    category: 'career'
  });

  const steps = [
    { title: 'Basic Info', icon: User },
    { title: 'Life Audit', icon: BarChart3 },
    { title: 'Goals', icon: Target },
    { title: 'Complete', icon: CheckCircle }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(profile as UserProfile);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const addGoal = () => {
    if (currentGoal.title.trim()) {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: currentGoal.title,
        description: currentGoal.description,
        timeframe: currentGoal.timeframe,
        category: currentGoal.category,
        milestones: [],
        progress: 0
      };
      
      setProfile(prev => ({
        ...prev,
        goals: [...(prev.goals || []), newGoal]
      }));
      
      setCurrentGoal({
        title: '',
        description: '',
        timeframe: '',
        category: 'career'
      });
    }
  };

  const removeGoal = (goalId: string) => {
    setProfile(prev => ({
      ...prev,
      goals: prev.goals?.filter(goal => goal.id !== goalId) || []
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
              <p className="text-gray-600">Basic information to personalize your experience</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="16"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., San Francisco, CA"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Profession/Status</label>
              <input
                type="text"
                value={profile.profession}
                onChange={(e) => setProfile(prev => ({ ...prev, profession: e.target.value }))}
                placeholder="e.g., Software Engineer, Student, Entrepreneur"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work/Study Hours per Day</label>
                <input
                  type="number"
                  value={profile.workHours}
                  onChange={(e) => setProfile(prev => ({ ...prev, workHours: parseInt(e.target.value) }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="16"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Hours per Day</label>
                <input
                  type="number"
                  value={profile.socialMediaHours}
                  onChange={(e) => setProfile(prev => ({ ...prev, socialMediaHours: parseInt(e.target.value) }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="12"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Life Audit</h2>
              <p className="text-gray-600">Help us understand your current situation and mindset</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What frustrates you most right now?</label>
                <textarea
                  value={profile.frustrations}
                  onChange={(e) => setProfile(prev => ({ ...prev, frustrations: e.target.value }))}
                  placeholder="Be honest about your biggest challenges..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Describe your typical weekday</label>
                <textarea
                  value={profile.dailyRoutine}
                  onChange={(e) => setProfile(prev => ({ ...prev, dailyRoutine: e.target.value }))}
                  placeholder="Walk us through your daily routine..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What's one habit you're proud of?</label>
                <input
                  type="text"
                  value={profile.proudHabit}
                  onChange={(e) => setProfile(prev => ({ ...prev, proudHabit: e.target.value }))}
                  placeholder="Something you do consistently that serves you well..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What are you currently avoiding?</label>
                <input
                  type="text"
                  value={profile.avoidingWhat}
                  onChange={(e) => setProfile(prev => ({ ...prev, avoidingWhat: e.target.value }))}
                  placeholder="Tasks, decisions, or situations you're putting off..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate yourself (1-10) in these areas:</h3>
              <div className="space-y-4">
                {[
                  { key: 'productivity', label: 'Productivity' },
                  { key: 'health', label: 'Physical Health' },
                  { key: 'motivation', label: 'Motivation Level' },
                  { key: 'mentalHealth', label: 'Mental Health' },
                  { key: 'careerDirection', label: 'Career Direction' }
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-4">
                    <span className="w-32 text-sm font-medium text-gray-700">{label}</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={profile[key as keyof UserProfile] as number}
                      onChange={(e) => setProfile(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="w-8 text-sm font-semibold text-gray-900">
                      {profile[key as keyof UserProfile] as number}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Goals</h2>
              <p className="text-gray-600">What do you want to achieve? Be specific and ambitious.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a Goal</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                  <input
                    type="text"
                    value={currentGoal.title}
                    onChange={(e) => setCurrentGoal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Get a job at Google, Launch a YouTube channel"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={currentGoal.description}
                    onChange={(e) => setCurrentGoal(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide more details about this goal..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
                    <select
                      value={currentGoal.timeframe}
                      onChange={(e) => setCurrentGoal(prev => ({ ...prev, timeframe: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select timeframe</option>
                      <option value="3 months">3 months</option>
                      <option value="6 months">6 months</option>
                      <option value="1 year">1 year</option>
                      <option value="2 years">2 years</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={currentGoal.category}
                      onChange={(e) => setCurrentGoal(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="career">Career</option>
                      <option value="fitness">Fitness</option>
                      <option value="learning">Learning</option>
                      <option value="finance">Finance</option>
                      <option value="relationships">Relationships</option>
                      <option value="creative">Creative</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={addGoal}
                  disabled={!currentGoal.title || !currentGoal.timeframe}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add Goal
                </button>
              </div>
            </div>
            
            {profile.goals && profile.goals.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Goals ({profile.goals.length})</h3>
                <div className="space-y-3">
                  {profile.goals.map((goal) => (
                    <div key={goal.id} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                        <p className="text-sm text-gray-600">{goal.timeframe} • {goal.category}</p>
                      </div>
                      <button
                        onClick={() => removeGoal(goal.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="bg-green-100 p-6 rounded-2xl w-24 h-24 mx-auto flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfect! You're all set.</h2>
              <p className="text-gray-600">
                We've gathered everything we need to create your personalized life analysis and action plan.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-left">
              <h3 className="font-semibold text-gray-900 mb-3">What happens next:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• AI analysis of your current life situation</li>
                <li>• Personalized life score and insights</li>
                <li>• Goal breakdown into actionable milestones</li>
                <li>• Custom dashboard for tracking progress</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return profile.age && profile.profession && profile.location;
      case 1:
        return profile.frustrations && profile.dailyRoutine && profile.proudHabit && profile.avoidingWhat;
      case 2:
        return profile.goals && profile.goals.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : isCurrent 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-24 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div key={index} className={`text-sm font-medium ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderStep()}
          
          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {currentStep === 0 ? 'Back to Home' : 'Previous'}
            </button>
            
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed"
            >
              {currentStep === steps.length - 1 ? 'Generate My Analysis' : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;