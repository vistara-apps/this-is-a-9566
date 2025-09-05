import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import NavBar from '../components/NavBar'
import ShareButton from '../components/ShareButton'
import { FileText, Calendar, MapPin, Clock, Play, Trash2, Search } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const IncidentsPage = () => {
  const { user } = useAuth()
  const [incidents, setIncidents] = useState([])
  const [filteredIncidents, setFilteredIncidents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIncident, setSelectedIncident] = useState(null)

  useEffect(() => {
    // Load incidents from localStorage (in real app, fetch from backend)
    const savedIncidents = JSON.parse(localStorage.getItem('miraid_incidents') || '[]')
    const userIncidents = user 
      ? savedIncidents.filter(incident => incident.userId === user.id)
      : savedIncidents
    
    setIncidents(userIncidents)
    setFilteredIncidents(userIncidents)
  }, [user])

  useEffect(() => {
    // Filter incidents based on search term
    const filtered = incidents.filter(incident =>
      incident.incidentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.state.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredIncidents(filtered)
  }, [searchTerm, incidents])

  const deleteIncident = (incidentId) => {
    if (confirm('Are you sure you want to delete this incident? This action cannot be undone.')) {
      const updatedIncidents = incidents.filter(incident => incident.id !== incidentId)
      setIncidents(updatedIncidents)
      
      // Update localStorage
      const allIncidents = JSON.parse(localStorage.getItem('miraid_incidents') || '[]')
      const filteredAll = allIncidents.filter(incident => incident.id !== incidentId)
      localStorage.setItem('miraid_incidents', JSON.stringify(filteredAll))
      
      toast.success('Incident deleted successfully')
      
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(null)
      }
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const playRecording = (incident) => {
    if (incident.recordingUrl) {
      const audio = new Audio(incident.recordingUrl)
      audio.play().catch(error => {
        console.error('Error playing recording:', error)
        toast.error('Unable to play recording')
      })
    }
  }

  const generateSummary = (incident) => {
    return `Incident Summary:
Type: ${incident.incidentType}
Date: ${format(new Date(incident.timestamp), 'PPP')}
Time: ${format(new Date(incident.timestamp), 'p')}
Location: ${incident.state}
Duration: ${formatDuration(incident.duration)}
Notes: ${incident.notes || 'No additional notes'}

This incident was recorded using MiraID.`
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">My Incidents</h1>
          <p className="text-text-secondary">
            Review and manage your recorded incidents. All recordings are stored securely.
          </p>
        </div>

        {/* Search */}
        <div className="bg-surface rounded-lg shadow-card p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search incidents by type, location, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface rounded-lg shadow-card p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-2">Total Incidents</h3>
            <p className="text-3xl font-bold text-text-primary">{incidents.length}</p>
          </div>
          <div className="bg-surface rounded-lg shadow-card p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-2">This Month</h3>
            <p className="text-3xl font-bold text-text-primary">
              {incidents.filter(incident => 
                new Date(incident.timestamp).getMonth() === new Date().getMonth()
              ).length}
            </p>
          </div>
          <div className="bg-surface rounded-lg shadow-card p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-2">Total Duration</h3>
            <p className="text-3xl font-bold text-text-primary">
              {formatDuration(incidents.reduce((total, incident) => total + incident.duration, 0))}
            </p>
          </div>
        </div>

        {/* Incidents List */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Incidents Grid */}
          <div className="space-y-6">
            {filteredIncidents.length === 0 ? (
              <div className="bg-surface rounded-lg shadow-card p-8 text-center">
                <FileText className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {incidents.length === 0 ? 'No Incidents Recorded' : 'No Incidents Found'}
                </h3>
                <p className="text-text-secondary mb-4">
                  {incidents.length === 0 
                    ? 'Start recording your first incident to build your documentation.' 
                    : 'Try adjusting your search terms.'
                  }
                </p>
                {incidents.length === 0 && (
                  <button
                    onClick={() => window.location.href = '/record'}
                    className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Record First Incident
                  </button>
                )}
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`bg-surface rounded-lg shadow-card p-6 cursor-pointer transition-all ${
                    selectedIncident?.id === incident.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedIncident(incident)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">
                        {incident.incidentType}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-text-secondary mt-1">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(incident.timestamp), 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(incident.duration)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          playRecording(incident)
                        }}
                        className="p-2 text-primary hover:bg-primary hover:bg-opacity-10 rounded-lg transition-colors"
                        title="Play recording"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteIncident(incident.id)
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete incident"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center text-text-secondary mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{incident.state}</span>
                  </div>

                  {incident.notes && (
                    <p className="text-text-secondary text-sm line-clamp-2">
                      {incident.notes}
                    </p>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <ShareButton 
                      incident={{
                        ...incident,
                        summary: generateSummary(incident)
                      }} 
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Incident Detail */}
          {selectedIncident && (
            <div className="bg-surface rounded-lg shadow-card p-6 lg:sticky lg:top-8">
              <h2 className="text-xl font-bold text-text-primary mb-6">Incident Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-text-primary">Type</h3>
                  <p className="text-text-secondary">{selectedIncident.incidentType}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-text-primary">Date & Time</h3>
                  <p className="text-text-secondary">
                    {format(new Date(selectedIncident.timestamp), 'PPP p')}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-text-primary">Location</h3>
                  <p className="text-text-secondary">{selectedIncident.state}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-text-primary">Duration</h3>
                  <p className="text-text-secondary">{formatDuration(selectedIncident.duration)}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-text-primary">Recording Type</h3>
                  <p className="text-text-secondary capitalize">{selectedIncident.recordingType}</p>
                </div>

                {selectedIncident.notes && (
                  <div>
                    <h3 className="font-semibold text-text-primary">Notes</h3>
                    <p className="text-text-secondary whitespace-pre-wrap">{selectedIncident.notes}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <ShareButton 
                    incident={{
                      ...selectedIncident,
                      summary: generateSummary(selectedIncident)
                    }} 
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default IncidentsPage