import React, { useState } from 'react';
import { X, Check, Loader2, CreditCard } from 'lucide-react';
import { stripeProducts } from '../stripe-config';
import { useStripe } from '../hooks/useStripe';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const { createCheckoutSession, redirectToCheckout, loading, error } = useStripe();

  const handlePurchase = async (priceId: string, mode: 'payment' | 'subscription') => {
    setSelectedProduct(priceId);
    
    try {
      const session = await createCheckoutSession(priceId, mode);
      
      if (session) {
        await redirectToCheckout(session.sessionId);
      }
    } catch (err) {
      console.error('Purchase error:', err);
    } finally {
      setSelectedProduct(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upgrade Your LifeOS</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {stripeProducts.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-600 mt-1">{product.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      ${(product.price / 100).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {product.mode === 'subscription' ? 'per month' : 'one-time'}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="h-4 w-4 text-green-600" />
                      Unlimited AI life analysis
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="h-4 w-4 text-green-600" />
                      Advanced goal breakdown with AI
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="h-4 w-4 text-green-600" />
                      Personalized insights and recommendations
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="h-4 w-4 text-green-600" />
                      Progress tracking and analytics
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="h-4 w-4 text-green-600" />
                      Priority customer support
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handlePurchase(product.priceId, product.mode)}
                  disabled={loading && selectedProduct === product.priceId}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && selectedProduct === product.priceId ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      {product.mode === 'subscription' ? 'Subscribe Now' : 'Purchase Now'}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Secure payment powered by Stripe</p>
            <p className="mt-1">Cancel anytime • 30-day money-back guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;