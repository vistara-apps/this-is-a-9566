import React, { useState, useEffect } from 'react'
import { useLocation } from '../contexts/LocationContext'
import NavBar from '../components/NavBar'
import InfoCard from '../components/InfoCard'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { MapPin, RefreshCw, AlertTriangle } from 'lucide-react'

const GuidesPage = () => {
  const { state, loading, getCurrentLocation } = useLocation()
  const [selectedState, setSelectedState] = useState('')
  const [selectedIncident, setSelectedIncident] = useState('traffic-stop')
  const [language, setLanguage] = useState('en')
  const [guides, setGuides] = useState({})

  const incidentTypes = [
    { id: 'traffic-stop', name: 'Traffic Stop' },
    { id: 'questioning', name: 'Police Questioning' },
    { id: 'arrest', name: 'Arrest Situation' },
    { id: 'search', name: 'Search Request' },
    { id: 'home-visit', name: 'Home Visit' }
  ]

  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ]

  useEffect(() => {
    if (state) {
      setSelectedState(state)
    }
  }, [state])

  useEffect(() => {
    // Mock legal guides data - in real app, fetch from backend
    const mockGuides = {
      'traffic-stop': {
        en: {
          rights: `Your Rights During a Traffic Stop:

1. You have the right to remain silent. You are only required to provide your driver's license, vehicle registration, and proof of insurance.

2. You have the right to refuse a search of your vehicle unless the officer has a warrant or probable cause.

3. You have the right to ask if you are free to leave. If yes, you may calmly leave.

4. You have the right to record the interaction as long as you don't interfere with the officer's duties.

5. If arrested, you have the right to an attorney before answering any questions.`,
          script: `What to Say During a Traffic Stop:

"Good [morning/afternoon/evening], officer."

When asked for documents: "Here are my license, registration, and insurance."

If asked questions beyond identification: "I am exercising my right to remain silent. Am I free to go?"

If asked to search your vehicle: "I do not consent to any searches."

If given a ticket: "Thank you, officer. Have a good day."

Remember: Be polite, keep your hands visible, and avoid sudden movements.`
        },
        es: {
          rights: `Sus Derechos Durante una Parada de Tráfico:

1. Tiene derecho a permanecer en silencio. Solo debe proporcionar su licencia de conducir, registro del vehículo y prueba de seguro.

2. Tiene derecho a rechazar un registro de su vehículo a menos que el oficial tenga una orden o causa probable.

3. Tiene derecho a preguntar si es libre de irse. Si es así, puede retirarse con calma.

4. Tiene derecho a grabar la interacción siempre que no interfiera con los deberes del oficial.

5. Si es arrestado, tiene derecho a un abogado antes de responder cualquier pregunta.`,
          script: `Qué Decir Durante una Parada de Tráfico:

"Buenos [días/tardes/noches], oficial."

Cuando le pidan documentos: "Aquí están mi licencia, registro y seguro."

Si le hacen preguntas más allá de la identificación: "Estoy ejerciendo mi derecho a permanecer en silencio. ¿Soy libre de irme?"

Si le piden registrar su vehículo: "No consiento ningún registro."

Si le dan una multa: "Gracias, oficial. Que tenga un buen día."

Recuerde: Sea cortés, mantenga las manos visibles y evite movimientos bruscos.`
        }
      },
      'questioning': {
        en: {
          rights: `Your Rights During Police Questioning:

1. You have the constitutional right to remain silent under the Fifth Amendment.

2. You have the right to ask if you are being detained or if you are free to leave.

3. If you are being detained, you have the right to know why.

4. You have the right to refuse to answer questions without an attorney present.

5. You cannot be punished for exercising your right to remain silent.`,
          script: `What to Say During Police Questioning:

"Am I being detained or am I free to leave?"

If detained: "What am I being detained for?"

For any questions: "I am invoking my right to remain silent and would like to speak with an attorney."

If pressured: "I understand you're doing your job, but I will not answer questions without my lawyer present."

Remember: Stay calm, don't argue, and consistently assert your rights.`
        },
        es: {
          rights: `Sus Derechos Durante el Interrogatorio Policial:

1. Tiene el derecho constitucional a permanecer en silencio bajo la Quinta Enmienda.

2. Tiene derecho a preguntar si está siendo detenido o si es libre de irse.

3. Si está siendo detenido, tiene derecho a saber por qué.

4. Tiene derecho a negarse a responder preguntas sin un abogado presente.

5. No puede ser castigado por ejercer su derecho a permanecer en silencio.`,
          script: `Qué Decir Durante el Interrogatorio Policial:

"¿Estoy siendo detenido o soy libre de irme?"

Si está detenido: "¿Por qué estoy siendo detenido?"

Para cualquier pregunta: "Estoy invocando mi derecho a permanecer en silencio y me gustaría hablar con un abogado."

Si lo presionan: "Entiendo que está haciendo su trabajo, pero no responderé preguntas sin mi abogado presente."

Recuerde: Manténgase calmado, no discuta y afirme consistentemente sus derechos.`
        }
      }
    }
    setGuides(mockGuides)
  }, [])

  const currentGuide = guides[selectedIncident]?.[language]

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Know Your Rights</h1>
          <p className="text-text-secondary">
            Get state-specific legal guidance for interactions with law enforcement.
          </p>
        </div>

        {/* Location and Language Controls */}
        <div className="bg-surface rounded-lg shadow-card p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-text-secondary">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Current State:</span>
              </div>
              
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select State</option>
                {usStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              <button
                onClick={getCurrentLocation}
                disabled={loading}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
                title="Detect current location"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <LanguageSwitcher
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>
        </div>

        {/* Incident Type Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Select Situation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {incidentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedIncident(type.id)}
                className={`p-4 rounded-lg border-2 transition-colors text-left ${
                  selectedIncident === type.id
                    ? 'border-primary bg-primary bg-opacity-10 text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-text-primary'
                }`}
              >
                <span className="font-medium">{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Warning */}
        {!selectedState && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Location Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Please select your state to get accurate, location-specific legal guidance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Legal Guides */}
        {currentGuide && selectedState && (
          <div className="space-y-6">
            <InfoCard
              title={`Your Rights - ${selectedState} (${incidentTypes.find(t => t.id === selectedIncident)?.name})`}
              content={currentGuide.rights}
              variant="default"
            />
            
            <InfoCard
              title="What to Say - Recommended Scripts"
              content={currentGuide.script}
              variant="script"
            />
          </div>
        )}

        {/* Legal Disclaimer */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-text-primary mb-2">Legal Disclaimer</h3>
          <p className="text-sm text-text-secondary">
            This information is for educational purposes only and does not constitute legal advice. 
            Laws vary by jurisdiction and can change. For specific legal situations, consult with 
            a qualified attorney in your area. MiraID is not responsible for the accuracy or 
            completeness of this information.
          </p>
        </div>
      </div>
    </div>
  )
}

export default GuidesPage