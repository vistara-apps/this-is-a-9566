import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import NavBar from '../components/NavBar'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { User, Mail, Crown, Globe, Save, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    email: user?.email || '',
    preferredLanguage: user?.preferredLanguage || 'en'
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile(formData)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = () => {
    toast.success('Upgrade feature coming soon!')
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Profile Settings</h1>
          <p className="text-text-secondary">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-surface rounded-lg shadow-card p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Basic Information
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    Email changes require verification and are not yet supported.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Preferred Language
                  </label>
                  <LanguageSwitcher
                    currentLanguage={formData.preferredLanguage}
                    onLanguageChange={(lang) => setFormData({ ...formData, preferredLanguage: lang })}
                    className="w-full"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Privacy & Security */}
            <div className="bg-surface rounded-lg shadow-card p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy & Security
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-text-primary">Data Encryption</h3>
                    <p className="text-sm text-text-secondary">All recordings are encrypted at rest</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-text-primary">Location Privacy</h3>
                    <p className="text-sm text-text-secondary">Location data is only used for legal guidance</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium text-text-primary">Data Sharing</h3>
                    <p className="text-sm text-text-secondary">Your data is never shared with third parties</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-surface rounded-lg shadow-card p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Account Status</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Plan</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user?.subscriptionStatus === 'premium' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user?.subscriptionStatus === 'premium' ? 'Premium' : 'Free'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Member Since</span>
                  <span className="text-text-primary text-sm">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
                  </span>
                </div>

                {user?.subscriptionStatus === 'free' && (
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={handleUpgrade}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
                    >
                      <Crown className="h-4 w-4" />
                      <span>Upgrade to Premium</span>
                    </button>
                    <p className="text-xs text-text-secondary mt-2 text-center">
                      Unlimited incidents, advanced features, priority support
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Usage Stats */}
            <div className="bg-surface rounded-lg shadow-card p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Usage Statistics</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Incidents Recorded</span>
                  <span className="text-text-primary font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Guides Accessed</span>
                  <span className="text-text-primary font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Recording Time</span>
                  <span className="text-text-primary font-medium">15:42</span>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-surface rounded-lg shadow-card p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Help & Support</h2>
              
              <div className="space-y-3">
                <button className="w-full text-left text-primary hover:underline">
                  Privacy Policy
                </button>
                <button className="w-full text-left text-primary hover:underline">
                  Terms of Service
                </button>
                <button className="w-full text-left text-primary hover:underline">
                  Contact Support
                </button>
                <button className="w-full text-left text-red-600 hover:underline">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage