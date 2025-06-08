import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useStripe } from '../hooks/useStripe';

const SuccessPage: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const { user } = useAuth();
  const { getSubscription } = useStripe();

  useEffect(() => {
    // Get session ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdParam = urlParams.get('session_id');
    setSessionId(sessionIdParam);

    // Fetch subscription data
    if (user) {
      loadSubscription();
    }
  }, [user]);

  const loadSubscription = async () => {
    try {
      const subData = await getSubscription();
      setSubscription(subData);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const goToDashboard = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>

          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                <strong>Session ID:</strong> {sessionId.substring(0, 20)}...
              </p>
            </div>
          )}

          {subscription && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Your Subscription</h3>
              <p className="text-sm text-blue-700">
                Status: <span className="font-medium capitalize">{subscription.subscription_status}</span>
              </p>
              {subscription.current_period_end && (
                <p className="text-sm text-blue-700">
                  Next billing: {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={goToDashboard}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              Go to Dashboard
            </button>
            
            <p className="text-sm text-gray-500">
              You can now access all premium features in your LifeOS dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;