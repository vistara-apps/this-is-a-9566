import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Shield, MapPin, Mic, Share2, Globe, Star, ArrowRight, X } from 'lucide-react'
import toast from 'react-hot-toast'

const LandingPage = () => {
  const { user, signUp, signIn } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  useEffect(() => {
    const authParam = searchParams.get('auth')
    if (authParam === 'signin' || authParam === 'signup') {
      setShowAuth(true)
      setAuthMode(authParam)
    }
  }, [searchParams])

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (authMode === 'signup') {
        await signUp(formData.email, formData.password)
        toast.success('Account created successfully!')
      } else {
        await signIn(formData.email, formData.password)
        toast.success('Signed in successfully!')
      }
      navigate('/dashboard')
    } catch (error) {
      toast.error('Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: MapPin,
      title: 'State-Specific Rights',
      description: 'Get tailored legal guidance based on your location and situation'
    },
    {
      icon: Mic,
      title: 'Instant Recording',
      description: 'One-tap recording with automatic time-stamping and secure storage'
    },
    {
      icon: Globe,
      title: 'Bilingual Support',
      description: 'Available in English and Spanish for broader accessibility'
    },
    {
      icon: Share2,
      title: 'Shareable Reports',
      description: 'Generate and share incident summaries with trusted contacts'
    }
  ]

  const testimonials = [
    {
      name: 'Maria Rodriguez',
      role: 'Community Advocate',
      content: 'MiraID gave me confidence during a traffic stop. Having my rights clearly explained in Spanish was invaluable.',
      rating: 5
    },
    {
      name: 'James Wilson',
      role: 'College Student',
      content: 'The instant recording feature worked perfectly when I needed it most. Simple and reliable.',
      rating: 5
    },
    {
      name: 'Sarah Chen',
      role: 'Parent',
      content: 'Peace of mind knowing my teens have access to accurate legal information whenever they need it.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Shield className="h-20 w-20 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              MiraID
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Your Instant Know-Your-Rights Guide
            </p>
            <p className="text-lg text-purple-200 mb-12 max-w-2xl mx-auto">
              Instant, state-specific legal guidance and documentation tools for law enforcement encounters. 
              Know your rights, stay protected, stay empowered.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setAuthMode('signup')
                  setShowAuth(true)
                }}
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/guides')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-colors"
              >
                View Legal Guides
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Powerful Features for Your Protection
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Everything you need to understand your rights and document interactions with law enforcement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Trusted by Communities
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Real stories from people who have used MiraID when it mattered most.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-surface rounded-lg shadow-card p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-text-secondary mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-text-primary">{testimonial.name}</p>
                  <p className="text-sm text-text-secondary">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Know Your Rights?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands who trust MiraID to protect their rights and document their interactions.
          </p>
          <button
            onClick={() => {
              setAuthMode('signup')
              setShowAuth(true)
            }}
            className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Start Your Free Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg shadow-card max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text-primary">
                {authMode === 'signup' ? 'Create Account' : 'Sign In'}
              </h2>
              <button
                onClick={() => setShowAuth(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : authMode === 'signup' ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
                className="text-primary hover:underline"
              >
                {authMode === 'signup' 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LandingPage