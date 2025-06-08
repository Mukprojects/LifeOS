import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface CheckoutSessionData {
  sessionId: string;
  url: string;
}

interface SubscriptionData {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: string;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export const useStripe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createCheckoutSession = async (
    priceId: string,
    mode: 'payment' | 'subscription' = 'payment'
  ): Promise<CheckoutSessionData | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Failed to get user session');
      }

      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: priceId,
          mode,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/cancel`,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to create checkout session');
      }

      if (!data || !data.sessionId) {
        throw new Error('Invalid response from checkout service');
      }

      return data;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to create checkout session');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getSubscription = async (): Promise<SubscriptionData | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return null;
      }

      return data;
    } catch (err: any) {
      console.error('Subscription fetch error:', err);
      setError(err.message || 'Failed to fetch subscription');
      return null;
    }
  };

  const redirectToCheckout = async (sessionId: string) => {
    // Redirect to Stripe Checkout
    const stripe = (window as any).Stripe;
    if (stripe) {
      const stripeInstance = stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      await stripeInstance.redirectToCheckout({ sessionId });
    } else {
      // Fallback: redirect to Stripe's hosted checkout page
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    }
  };

  return {
    createCheckoutSession,
    getSubscription,
    redirectToCheckout,
    loading,
    error,
  };
};