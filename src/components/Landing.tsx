import React, { useState, useEffect } from 'react';
import { ArrowRight, Target, Brain, TrendingUp, Users, Star, PlayCircle, LogIn, UserPlus, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

interface LandingProps {
  onGetStarted: () => void;
}

// Add type definition for the spline-viewer element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        url: string;
      };
    }
  }
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const { user } = useAuth();

  // Add Spline viewer script
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.10.2/build/spline-viewer.js';
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGetStarted = () => {
    if (user) {
      onGetStarted();
    } else {
      setAuthMode('signup');
      setAuthModalOpen(true);
    }
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setAuthModalOpen(true);
  };

  const handleWatchDemo = () => {
    setVideoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img 
                src="/images/Main Logo Navbar.png" 
                alt="LifeOS Logo" 
                className="h-8 w-8 rounded-lg transform hover:scale-110 transition-transform duration-300"
              />
              <span className="text-xl font-bold text-gray-900">LifeOS</span>
            </div>
            
            {!user && (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSignIn}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Combined Hero and Features Section with Spline Background */}
      <div className="relative overflow-hidden py-16">
        {/* Spline 3D Background */}
        <div className="absolute inset-0 -z-10 w-full h-full">
          <spline-viewer url="https://prod.spline.design/tBMNEX3YVfC-ndst/scene.splinecode"></spline-viewer>
        </div>
        
        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 z-10">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl transform hover:rotate-12 transition-transform duration-500 hover:scale-110">
                <Brain className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Your Life. Your Plan.
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block animate-pulse">
                Built by AI.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
              Tell us where you are and where you want to go. LifeOS gives you the roadmap, 
              tracking, and motivation to transform your goals into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
              >
                {user ? 'Continue to Dashboard' : 'Start My Life Audit'}
                <ArrowRight className="h-5 w-5" />
              </button>
              <button 
                onClick={handleWatchDemo}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors transform hover:scale-105"
              >
                <PlayCircle className="h-5 w-5" />
                Watch Demo
              </button>
            </div>
          </div>
          
          {/* Features Section (now part of the same container) */}
          <div className="mt-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Personal Operating System for Growth
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need to understand yourself, plan your future, and track your progress.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-lg rounded-xl bg-white/80 backdrop-blur-sm">
                <div className="bg-blue-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Life Audit</h3>
                <p className="text-gray-600">
                  Get a comprehensive analysis of your current life situation, complete with personalized insights and a life score across key areas.
                </p>
              </div>
              
              <div className="text-center p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-lg rounded-xl bg-white/80 backdrop-blur-sm">
                <div className="bg-purple-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Goal Planning</h3>
                <p className="text-gray-600">
                  Break down your biggest goals into monthly milestones, weekly targets, and daily actionable tasks that actually move the needle.
                </p>
              </div>
              
              <div className="text-center p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-lg rounded-xl bg-white/80 backdrop-blur-sm">
                <div className="bg-green-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Dashboard</h3>
                <p className="text-gray-600">
                  Track your progress with an intuitive dashboard, get daily focus suggestions, and stay motivated with streak tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join Thousands Ready to Transform Their Lives
            </h2>
            <div className="flex items-center justify-center gap-2 text-yellow-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <p className="text-gray-600">Launching Soon • Be Part of the First 1,000 Founders</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Future Me",
                role: "",
                text: "I imagined what LifeOS could do for me — if it can truly break down my goals like it claims, I'd finally stop procrastinating."
              },
              {
                name: "Beta Waitlist Member",
                role: "",
                text: "This platform could be the system I've needed for years. It feels like a personal life strategist in my pocket."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold transform hover:rotate-12 transition-transform duration-300">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">— {testimonial.name}</div>
                    {testimonial.role && <div className="text-sm text-gray-600">{testimonial.role}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands who have already started their growth journey with LifeOS.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200 hover:scale-105"
          >
            {user ? 'Go to Dashboard' : 'Start Your Life Audit Now'}
          </button>
          <p className="text-blue-100 mt-4 text-sm">Free to start • No credit card required</p>
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

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">LifeOS Demo</h3>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="aspect-video">
              <video
                controls
                autoPlay
                className="w-full h-full"
                src="https://drive.google.com/uc?export=download&id=1EVb5ywLYOA7Ns_kIz28qdPkI1WL3euO8"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
};

export default Landing;