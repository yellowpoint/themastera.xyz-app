export const SUBSCRIPTION_LEVELS = {
  FREE: {
    name: 'Free',
    id: 'free',
    priceId: '',
    price: 0,
    features: [
      'Access to free content',
      'Limited downloads',
      'Standard support',
    ],
  },
  PRO: {
    name: 'Pro',
    id: 'pro',
    priceId:
      process.env.STRIPE_PRICE_ID_PRO || 'price_1RWCOdQQcFkpjZ3XOHCTnq9j',
    price: 2000, // cents
    features: [
      'Access to all content',
      'Unlimited downloads',
      'Priority support',
      'Ad-free experience',
    ],
  },
  MAX: {
    name: 'Max',
    id: 'max',
    priceId:
      process.env.STRIPE_PRICE_ID_MAX || 'price_1RWCOiQQcFkpjZ3XCE9VZrjy',
    price: 5000, // cents
    features: [
      'Everything in Pro',
      'Exclusive 4K content',
      'Early access to new releases',
      'Direct line to creators',
    ],
  },
} as const

export type SubscriptionLevel = keyof typeof SUBSCRIPTION_LEVELS
