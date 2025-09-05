import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { LocationProvider } from './contexts/LocationContext'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import GuidesPage from './pages/GuidesPage'
import RecordingPage from './pages/RecordingPage'
import IncidentsPage from './pages/IncidentsPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/record" element={<RecordingPage />} />
            <Route path="/incidents" element={
              <ProtectedRoute>
                <IncidentsPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </LocationProvider>
    </AuthProvider>
  )
}

export default App