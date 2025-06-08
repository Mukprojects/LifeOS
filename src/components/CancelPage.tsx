import React from 'react';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';

const CancelPage: React.FC = () => {
  const goBack = () => {
    window.history.back();
  };

  const tryAgain = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600 mb-6">
            Your payment was cancelled. No charges have been made to your account.
          </p>

          <div className="space-y-3">
            <button
              onClick={tryAgain}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Try Again
            </button>
            
            <button
              onClick={goBack}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            If you experienced any issues, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;