import React from 'react';
import { Home, Target, BarChart3, Settings, Brain, LogOut, BookOpen } from 'lucide-react';
import { AppPage } from '../types';
import { useAuth } from '../hooks/useAuth';

interface NavigationProps {
  currentPage: AppPage;
  onPageChange: (page: AppPage) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard' as AppPage, label: 'Dashboard', icon: Home },
    { id: 'summary' as AppPage, label: 'Life Summary', icon: Brain },
    { id: 'planner' as AppPage, label: 'Goal Planner', icon: Target },
    { id: 'resources' as AppPage, label: 'Resources', icon: BookOpen },
    { id: 'settings' as AppPage, label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img 
              src="/images/Main Logo Navbar.png" 
              alt="LifeOS Logo" 
              className="h-8 w-8 rounded-lg transform hover:scale-110 transition-transform duration-300"
            />
            <span className="text-xl font-bold text-gray-900">LifeOS</span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-8">
            <div className="flex space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* User Menu */}
            {user && (
              <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
                <div className="text-sm text-gray-600">
                  {user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors transform hover:scale-105"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;