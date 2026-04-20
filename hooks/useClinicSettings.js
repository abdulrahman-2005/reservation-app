'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useClinicSettings() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    loadSettings()
  }, [])
  
  async function loadSettings() {
    try {
      const supabase = createClient()
      
      const { data, error: settingsError } = await supabase
        .from('clinic_settings')
        .select('*')
        .single()
      
      if (settingsError) throw settingsError
      
      setSettings(data)
    } catch (err) {
      console.error('Failed to load settings:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  return { settings, loading, error, reload: loadSettings }
}
