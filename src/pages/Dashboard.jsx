import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLocation } from '../contexts/LocationContext'
import NavBar from '../components/NavBar'
import { Shield, MapPin, Mic, FileText, Crown, Calendar } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const { state } = useLocation()

  const quickActions = [
    {
      title: 'Know Your Rights',
      description: 'Access state-specific legal guides',
      icon: Shield,
      path: '/guides',
      color: 'bg-blue-500'
    },
    {
      title: 'Record Incident',
      description: 'Start recording an interaction',
      icon: Mic,
      path: '/record',
      color: 'bg-red-500'
    },
    {
      title: 'View Incidents',
      description: 'Review your recorded incidents',
      icon: FileText,
      path: '/incidents',
      color: 'bg-green-500'
    }
  ]

  const stats = [
    { label: 'Total Incidents', value: '3', change: '+1 this week' },
    { label: 'Guides Accessed', value: '12', change: '+2 this month' },
    { label: 'Account Status', value: user?.subscriptionStatus === 'premium' ? 'Premium' : 'Free', change: null }
  ]

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Welcome back, {user?.email?.split('@')[0]}
          </h1>
          <div className="flex items-center text-text-secondary">
            <MapPin className="h-4 w-4 mr-1" />
            <span>Current location: {state || 'Unknown'}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-surface rounded-lg shadow-card p-6">
              <h3 className="text-sm font-medium text-text-secondary mb-2">{stat.label}</h3>
              <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
              {stat.change && (
                <p className="text-sm text-accent mt-1">{stat.change}</p>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className="bg-surface rounded-lg shadow-card p-6 hover:shadow-lg transition-shadow group"
              >
                <div className={`${action.color} rounded-lg w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {action.title}
                </h3>
                <p className="text-text-secondary">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface rounded-lg shadow-card p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="font-medium text-text-primary">Viewed Traffic Stop Guide</p>
                <p className="text-sm text-text-secondary">California specific rights</p>
              </div>
              <span className="text-sm text-text-secondary">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="font-medium text-text-primary">Recorded Incident</p>
                <p className="text-sm text-text-secondary">Downtown traffic stop</p>
              </div>
              <span className="text-sm text-text-secondary">1 day ago</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-text-primary">Account Created</p>
                <p className="text-sm text-text-secondary">Welcome to MiraID!</p>
              </div>
              <span className="text-sm text-text-secondary">3 days ago</span>
            </div>
          </div>
        </div>

        {/* Upgrade Banner */}
        {user?.subscriptionStatus === 'free' && (
          <div className="mt-8 gradient-bg rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  <Crown className="h-5 w-5 mr-2" />
                  Upgrade to Premium
                </h3>
                <p className="text-purple-100">
                  Get unlimited incident storage, advanced scripting, and priority support for just $5/month.
                </p>
              </div>
              <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard