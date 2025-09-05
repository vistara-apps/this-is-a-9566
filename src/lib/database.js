import { supabase, TABLES } from './supabase.js'

/**
 * Incident Management Functions
 */

/**
 * Create a new incident record
 * @param {Object} incidentData - Incident details
 * @returns {Promise<Object>} Created incident
 */
export const createIncident = async (incidentData) => {
  const { data, error } = await supabase
    .from(TABLES.INCIDENTS)
    .insert([{
      user_id: incidentData.userId,
      timestamp: incidentData.timestamp || new Date().toISOString(),
      location: incidentData.location,
      incident_type: incidentData.incidentType,
      recording_url: incidentData.recordingUrl,
      summary: incidentData.summary,
      duration: incidentData.duration,
      notes: incidentData.notes
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get all incidents for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} User's incidents
 */
export const getUserIncidents = async (userId) => {
  const { data, error } = await supabase
    .from(TABLES.INCIDENTS)
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get a specific incident by ID
 * @param {string} incidentId - Incident ID
 * @returns {Promise<Object>} Incident details
 */
export const getIncident = async (incidentId) => {
  const { data, error } = await supabase
    .from(TABLES.INCIDENTS)
    .select('*')
    .eq('id', incidentId)
    .single()

  if (error) throw error
  return data
}

/**
 * Update an incident
 * @param {string} incidentId - Incident ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated incident
 */
export const updateIncident = async (incidentId, updates) => {
  const { data, error } = await supabase
    .from(TABLES.INCIDENTS)
    .update(updates)
    .eq('id', incidentId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete an incident
 * @param {string} incidentId - Incident ID
 * @returns {Promise<void>}
 */
export const deleteIncident = async (incidentId) => {
  const { error } = await supabase
    .from(TABLES.INCIDENTS)
    .delete()
    .eq('id', incidentId)

  if (error) throw error
}

/**
 * Legal Guides Management Functions
 */

/**
 * Get legal guide for a specific state and incident type
 * @param {string} state - US state
 * @param {string} incidentType - Type of incident
 * @returns {Promise<Object>} Legal guide
 */
export const getLegalGuide = async (state, incidentType) => {
  const { data, error } = await supabase
    .from(TABLES.LEGAL_GUIDES)
    .select('*')
    .eq('state', state)
    .eq('incident_type', incidentType)
    .single()

  if (error) {
    // If no specific guide found, try to get a general guide
    const { data: generalData, error: generalError } = await supabase
      .from(TABLES.LEGAL_GUIDES)
      .select('*')
      .eq('state', 'general')
      .eq('incident_type', incidentType)
      .single()

    if (generalError) throw generalError
    return generalData
  }
  
  return data
}

/**
 * Get all legal guides for a state
 * @param {string} state - US state
 * @returns {Promise<Array>} Legal guides for the state
 */
export const getStateGuides = async (state) => {
  const { data, error } = await supabase
    .from(TABLES.LEGAL_GUIDES)
    .select('*')
    .eq('state', state)
    .order('incident_type')

  if (error) throw error
  return data || []
}

/**
 * File Upload Functions
 */

/**
 * Upload a recording file to Supabase Storage
 * @param {File} file - Audio/video file
 * @param {string} userId - User ID
 * @param {string} incidentId - Incident ID
 * @returns {Promise<string>} File URL
 */
export const uploadRecording = async (file, userId, incidentId) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${incidentId}/recording.${fileExt}`

  const { data, error } = await supabase.storage
    .from('recordings')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('recordings')
    .getPublicUrl(fileName)

  return publicUrl
}

/**
 * Delete a recording file
 * @param {string} filePath - File path in storage
 * @returns {Promise<void>}
 */
export const deleteRecording = async (filePath) => {
  const { error } = await supabase.storage
    .from('recordings')
    .remove([filePath])

  if (error) throw error
}

/**
 * User Profile Functions
 */

/**
 * Get user profile data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile
 */
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from(TABLES.USERS)
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} Updated profile
 */
export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from(TABLES.USERS)
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
