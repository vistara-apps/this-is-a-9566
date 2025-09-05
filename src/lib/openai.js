import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
})

/**
 * Generate a "what to say" script based on the situation and state
 * @param {string} state - The US state
 * @param {string} incidentType - Type of interaction (traffic_stop, questioning, etc.)
 * @param {string} language - Language preference ('en' or 'es')
 * @returns {Promise<string>} Generated script
 */
export const generateScript = async (state, incidentType, language = 'en') => {
  const languagePrompt = language === 'es' ? 'Respond in Spanish.' : 'Respond in English.'
  
  const prompt = `You are a legal rights advisor. Generate a concise, practical "what to say" script for someone in ${state} during a ${incidentType.replace('_', ' ')}. 

Key requirements:
- Keep it under 200 words
- Use simple, clear language
- Focus on constitutional rights
- Include specific phrases to use
- Be respectful but firm
- ${languagePrompt}

Format as a numbered list of things to say or do.`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful legal rights advisor who provides practical, constitutional guidance for police interactions."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.3
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error('Error generating script:', error)
    throw new Error('Failed to generate script. Please try again.')
  }
}

/**
 * Generate an incident summary for sharing
 * @param {Object} incidentData - Incident details
 * @param {string} language - Language preference ('en' or 'es')
 * @returns {Promise<string>} Generated summary
 */
export const generateIncidentSummary = async (incidentData, language = 'en') => {
  const languagePrompt = language === 'es' ? 'Respond in Spanish.' : 'Respond in English.'
  
  const prompt = `Create a concise incident summary based on this data:
- Date/Time: ${incidentData.timestamp}
- Location: ${incidentData.location}
- Type: ${incidentData.incidentType}
- Duration: ${incidentData.duration || 'Unknown'}

Requirements:
- Professional, factual tone
- Under 150 words
- Include key details for legal reference
- ${languagePrompt}

Format as a brief paragraph suitable for sharing with legal counsel.`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional legal assistant who creates clear, factual incident summaries."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.2
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error('Error generating summary:', error)
    throw new Error('Failed to generate summary. Please try again.')
  }
}

/**
 * Get legal guidance for a specific situation
 * @param {string} state - The US state
 * @param {string} incidentType - Type of interaction
 * @param {string} language - Language preference
 * @returns {Promise<Object>} Legal guidance with rights and scripts
 */
export const getLegalGuidance = async (state, incidentType, language = 'en') => {
  try {
    const script = await generateScript(state, incidentType, language)
    
    // Basic rights that apply in all states
    const basicRights = language === 'es' ? [
      'Tienes derecho a permanecer en silencio',
      'Tienes derecho a un abogado',
      'Tienes derecho a rechazar búsquedas sin orden judicial',
      'Tienes derecho a grabar la interacción',
      'Tienes derecho a preguntar si eres libre de irte'
    ] : [
      'You have the right to remain silent',
      'You have the right to an attorney',
      'You have the right to refuse searches without a warrant',
      'You have the right to record the interaction',
      'You have the right to ask if you are free to leave'
    ]

    return {
      state,
      incidentType,
      language,
      rights: basicRights,
      script,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error getting legal guidance:', error)
    throw error
  }
}
