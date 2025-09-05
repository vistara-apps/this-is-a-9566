// Stripe integration for subscription management
// Note: In production, payment processing should be handled on the backend

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

/**
 * Initialize Stripe (would typically be done with Stripe.js)
 * For now, this is a placeholder for the subscription system
 */
export const initializeStripe = () => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    console.warn('Stripe publishable key not found')
    return null
  }
  
  // In a real implementation, you would:
  // return loadStripe(STRIPE_PUBLISHABLE_KEY)
  console.log('Stripe initialized with key:', STRIPE_PUBLISHABLE_KEY.substring(0, 20) + '...')
  return { initialized: true }
}

/**
 * Create a subscription checkout session
 * @param {string} priceId - Stripe price ID for the subscription
 * @param {string} userId - User ID
 * @returns {Promise<string>} Checkout session URL
 */
export const createCheckoutSession = async (priceId, userId) => {
  // In production, this would make a request to your backend
  // which would create a Stripe checkout session
  
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl: `${window.location.origin}/dashboard?success=true`,
        cancelUrl: `${window.location.origin}/profile?canceled=true`,
      }),
    })

    const { sessionUrl } = await response.json()
    return sessionUrl
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw new Error('Failed to create checkout session')
  }
}

/**
 * Get subscription status for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Subscription details
 */
export const getSubscriptionStatus = async (userId) => {
  try {
    const response = await fetch(`/api/subscription-status/${userId}`)
    const subscription = await response.json()
    return subscription
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return { status: 'free', active: false }
  }
}

/**
 * Cancel a subscription
 * @param {string} subscriptionId - Stripe subscription ID
 * @returns {Promise<Object>} Cancellation result
 */
export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    })

    return await response.json()
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw new Error('Failed to cancel subscription')
  }
}

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Basic rights information',
      'Single incident recording',
      'State-specific guides',
      'English language support'
    ],
    limits: {
      incidents: 1,
      recordings: 1
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 5,
    priceId: 'price_premium_monthly', // This would be your actual Stripe price ID
    features: [
      'All free features',
      'Advanced scripting',
      'Unlimited incident storage',
      'Bilingual support (English/Spanish)',
      'Shareable incident summaries',
      'Priority support'
    ],
    limits: {
      incidents: -1, // unlimited
      recordings: -1 // unlimited
    }
  }
}

/**
 * Check if user has access to a premium feature
 * @param {Object} user - User object with subscription status
 * @param {string} feature - Feature to check
 * @returns {boolean} Whether user has access
 */
export const hasFeatureAccess = (user, feature) => {
  if (!user) return false
  
  const subscriptionStatus = user.subscription_status || user.subscriptionStatus || 'free'
  
  if (subscriptionStatus === 'premium') return true
  
  // Free tier feature access
  const freeFeatures = [
    'basic_guides',
    'single_recording',
    'english_support'
  ]
  
  return freeFeatures.includes(feature)
}
