import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const LocationContext = createContext()

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

const stateAbbreviations = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
  'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
  'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
}

// Reverse geocoding function using a free geocoding service
const reverseGeocode = async (latitude, longitude) => {
  try {
    // Using OpenStreetMap Nominatim (free service)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'MiraID-App/1.0'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Geocoding service unavailable')
    }
    
    const data = await response.json()
    const state = data.address?.state
    
    if (!state) {
      throw new Error('State not found in location data')
    }
    
    return state
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    throw error
  }
}

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null)
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getCurrentLocation = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ latitude, longitude })
        
        try {
          // Use reverse geocoding to get state from coordinates
          const state = await reverseGeocode(latitude, longitude)
          setState(state)
          toast.success(`Location detected: ${state}`)
        } catch (err) {
          setError('Failed to determine state from location')
          toast.error('Failed to determine your state')
          // Fallback to manual state selection
          setState(null)
        }
        setLoading(false)
      },
      (error) => {
        setError(error.message)
        setLoading(false)
        toast.error('Location access denied. Please enable location services.')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  const setManualState = (stateName) => {
    setState(stateName)
    toast.success(`State set to: ${stateName}`)
  }

  useEffect(() => {
    // Try to get location on mount
    getCurrentLocation()
  }, [])

  const value = {
    location,
    state,
    loading,
    error,
    getCurrentLocation,
    setManualState,
    stateAbbreviations
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}
