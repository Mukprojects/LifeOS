import React, { useState } from 'react';
import { User, Bell, Shield, Trash2, Download, Mail } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsProps {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, onProfileUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    weeklyProgress: true,
    goalDeadlines: true,
    motivationalQuotes: false
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const handleProfileUpdate = (field: keyof UserProfile, value: any) => {
    onProfileUpdate({
      ...profile,
      [field]: value
    });
  };

  const exportData = () => {
    const data = {
      profile,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lifeos-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => handleProfileUpdate('age', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => handleProfileUpdate('location', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                  <input
                    type="text"
                    value={profile.profession}
                    onChange={(e) => handleProfileUpdate('profession', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Hours/Day</label>
                  <input
                    type="number"
                    value={profile.workHours}
                    onChange={(e) => handleProfileUpdate('workHours', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Hours/Day</label>
                  <input
                    type="number"
                    value={profile.socialMediaHours}
                    onChange={(e) => handleProfileUpdate('socialMediaHours', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Life Ratings</h3>
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
                      onChange={(e) => handleProfileUpdate(key as keyof UserProfile, parseInt(e.target.value))}
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

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'dailyReminders', label: 'Daily task reminders', description: 'Get reminded of your daily focus tasks' },
                  { key: 'weeklyProgress', label: 'Weekly progress updates', description: 'Receive weekly summaries of your progress' },
                  { key: 'goalDeadlines', label: 'Goal deadline alerts', description: 'Get notified when goal milestones are due' },
                  { key: 'motivationalQuotes', label: 'Daily motivation', description: 'Receive daily motivational quotes and tips' }
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{label}</h4>
                      <p className="text-sm text-gray-600">{description}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications[key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Download className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">Export Your Data</h4>
                      <p className="text-sm text-blue-700 mb-3">Download all your profile data, goals, and progress in JSON format.</p>
                      <button
                        onClick={exportData}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Download Data
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Trash2 className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-900">Delete Account</h4>
                      <p className="text-sm text-red-700 mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Policy</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your privacy is important to us. All your personal data is stored locally in your browser and is not shared with third parties. 
                  We use this data solely to provide you with personalized insights and recommendations to help you achieve your goals.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your profile, preferences, and privacy settings</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-8">
            {renderTabContent()}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-6 inline-block">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <span className="text-gray-700">Need help? Contact us at</span>
              <a href="mailto:support@lifeos.app" className="text-blue-600 hover:text-blue-800 font-medium">
                support@lifeos.app
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;