import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLocation } from '../contexts/LocationContext'
import NavBar from '../components/NavBar'
import RecordButton from '../components/RecordButton'
import { Clock, MapPin, Save, Trash2, Camera, Mic } from 'lucide-react'
import toast from 'react-hot-toast'

const RecordingPage = () => {
  const { user } = useAuth()
  const { location, state } = useLocation()
  const navigate = useNavigate()
  
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recordingType, setRecordingType] = useState('audio') // 'audio' or 'video'
  const [incidentType, setIncidentType] = useState('')
  const [notes, setNotes] = useState('')
  const [mediaStream, setMediaStream] = useState(null)
  const [recordedData, setRecordedData] = useState(null)
  
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const intervalRef = useRef(null)

  const incidentTypes = [
    'Traffic Stop',
    'Police Questioning',
    'Arrest Situation',
    'Search Request',
    'Home Visit',
    'Other'
  ]

  const startRecording = async () => {
    try {
      const constraints = {
        audio: true,
        video: recordingType === 'video' ? { width: 1280, height: 720 } : false
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setMediaStream(stream)

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: recordingType === 'video' 
          ? 'video/webm;codecs=vp9' 
          : 'audio/webm;codecs=opus'
      })

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recordingType === 'video' ? 'video/webm' : 'audio/webm'
        })
        setRecordedData(blob)
      }

      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setRecordingDuration(0)

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)

      toast.success(`${recordingType === 'video' ? 'Video' : 'Audio'} recording started`)
    } catch (error) {
      console.error('Error starting recording:', error)
      toast.error('Failed to start recording. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop())
        setMediaStream(null)
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      toast.success('Recording stopped')
    }
  }

  const saveIncident = () => {
    if (!recordedData) {
      toast.error('No recording to save')
      return
    }

    if (!incidentType) {
      toast.error('Please select an incident type')
      return
    }

    // Create incident object
    const incident = {
      id: Date.now().toString(),
      userId: user?.id || 'anonymous',
      timestamp: new Date().toISOString(),
      location: location ? `${location.latitude}, ${location.longitude}` : 'Unknown',
      state: state || 'Unknown',
      incidentType,
      notes,
      duration: recordingDuration,
      recordingType,
      // In a real app, upload the blob to storage and store the URL
      recordingUrl: URL.createObjectURL(recordedData)
    }

    // Save to localStorage (in real app, save to backend)
    const existingIncidents = JSON.parse(localStorage.getItem('miraid_incidents') || '[]')
    existingIncidents.push(incident)
    localStorage.setItem('miraid_incidents', JSON.stringify(existingIncidents))

    toast.success('Incident saved successfully!')
    
    if (user) {
      navigate('/incidents')
    } else {
      // Prompt for account creation
      toast.success('Recording saved locally. Create an account to sync across devices.')
    }
  }

  const discardRecording = () => {
    if (recordedData) {
      URL.revokeObjectURL(URL.createObjectURL(recordedData))
    }
    setRecordedData(null)
    setRecordingDuration(0)
    setNotes('')
    setIncidentType('')
    toast.success('Recording discarded')
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Record Incident</h1>
          <p className="text-text-secondary">
            Document your interaction with law enforcement safely and securely.
          </p>
        </div>

        {/* Recording Type Selection */}
        <div className="bg-surface rounded-lg shadow-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Recording Type</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setRecordingType('audio')}
              disabled={isRecording}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                recordingType === 'audio'
                  ? 'border-primary bg-primary bg-opacity-10 text-primary'
                  : 'border-gray-200 hover:border-gray-300 text-text-primary'
              }`}
            >
              <Mic className="h-5 w-5" />
              <span>Audio Only</span>
            </button>
            <button
              onClick={() => setRecordingType('video')}
              disabled={isRecording}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                recordingType === 'video'
                  ? 'border-primary bg-primary bg-opacity-10 text-primary'
                  : 'border-gray-200 hover:border-gray-300 text-text-primary'
              }`}
            >
              <Camera className="h-5 w-5" />
              <span>Video</span>
            </button>
          </div>
        </div>

        {/* Recording Control */}
        <div className="bg-surface rounded-lg shadow-card p-8 mb-6">
          <div className="text-center">
            {/* Recording Status */}
            <div className="mb-6">
              {isRecording ? (
                <div className="flex items-center justify-center space-x-2 text-red-600 mb-4">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="font-semibold">Recording {recordingType}...</span>
                </div>
              ) : recordedData ? (
                <div className="text-accent font-semibold mb-4">
                  Recording Complete ({formatDuration(recordingDuration)})
                </div>
              ) : (
                <div className="text-text-secondary mb-4">
                  Tap to start recording
                </div>
              )}

              {/* Duration */}
              <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-text-primary">
                <Clock className="h-6 w-6" />
                <span>{formatDuration(recordingDuration)}</span>
              </div>
            </div>

            {/* Record Button */}
            <div className="mb-6">
              <RecordButton
                isRecording={isRecording}
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
                disabled={!!recordedData}
              />
            </div>

            {/* Location Info */}
            <div className="flex items-center justify-center text-text-secondary">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{state || 'Location not detected'}</span>
            </div>
          </div>
        </div>

        {/* Incident Details */}
        {(isRecording || recordedData) && (
          <div className="bg-surface rounded-lg shadow-card p-6 mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Incident Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Incident Type *
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select incident type</option>
                  {incidentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any relevant details about the incident..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {recordedData && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={saveIncident}
              className="flex items-center justify-center space-x-2 bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              <Save className="h-5 w-5" />
              <span>Save Incident</span>
            </button>
            
            <button
              onClick={discardRecording}
              className="flex items-center justify-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
              <span>Discard</span>
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Recording Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Keep your device stable and ensure clear audio</li>
            <li>• State the date, time, and location at the beginning</li>
            <li>• Remain calm and follow officer instructions</li>
            <li>• Do not interfere with official duties while recording</li>
            <li>• Recording is legal in public spaces in most jurisdictions</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RecordingPage