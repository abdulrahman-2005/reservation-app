'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeQueue(initialAppointments = []) {
  const [appointments, setAppointments] = useState(initialAppointments)
  
  useEffect(() => {
    const supabase = createClient()
    const today = new Date().toISOString().split('T')[0]
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `date=eq.${today}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // Add new appointment
            loadAppointmentWithPatient(payload.new.id).then(appointment => {
              if (appointment) {
                setAppointments(prev => [...prev, appointment].sort((a, b) => 
                  a.start_time.localeCompare(b.start_time)
                ))
              }
            })
          } else if (payload.eventType === 'UPDATE') {
            // Update existing appointment
            loadAppointmentWithPatient(payload.new.id).then(appointment => {
              if (appointment) {
                setAppointments(prev => 
                  prev.map(a => a.id === appointment.id ? appointment : a)
                )
              }
            })
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted appointment
            setAppointments(prev => prev.filter(a => a.id !== payload.old.id))
          }
        }
      )
      .subscribe()
    
    async function loadAppointmentWithPatient(appointmentId) {
      const { data } = await supabase
        .from('appointments')
        .select('*, patients(full_name, phone)')
        .eq('id', appointmentId)
        .single()
      
      return data
    }
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  
  return appointments
}
