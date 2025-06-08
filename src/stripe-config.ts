export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_SSNySQmfYiRzRt',
    priceId: 'price_1RXTCFCccjvIDVoWl47Bdnw1',
    name: 'Subscription',
    description: 'Premium LifeOS subscription with unlimited AI analysis and advanced features',
    mode: 'payment',
    price: 100, // $1.00 in cents
    currency: 'usd'
  }
];

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};