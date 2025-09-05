import React from 'react'
import { Mic, MicOff, Square } from 'lucide-react'

const RecordButton = ({ 
  isRecording, 
  onStartRecording, 
  onStopRecording, 
  disabled = false,
  className = '' 
}) => {
  const handleClick = () => {
    if (isRecording) {
      onStopRecording()
    } else {
      onStartRecording()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative flex items-center justify-center w-20 h-20 rounded-full 
        transition-all duration-200 transform hover:scale-105 active:scale-95
        ${isRecording 
          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
          : 'bg-primary hover:bg-blue-700 text-white'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {isRecording ? (
        <Square className="h-8 w-8" fill="currentColor" />
      ) : (
        <Mic className="h-8 w-8" />
      )}
      
      {isRecording && (
        <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
      )}
    </button>
  )
}

export default RecordButton