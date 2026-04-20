'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useStaffProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    loadProfile()
  }, [])
  
  async function loadProfile() {
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) throw userError
      if (!user) {
        setProfile(null)
        return
      }
      
      // Get staff profile
      const { data, error: profileError } = await supabase
        .from('staff_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileError) throw profileError
      
      setProfile(data)
    } catch (err) {
      console.error('Failed to load profile:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  return { profile, loading, error, reload: loadProfile }
}
