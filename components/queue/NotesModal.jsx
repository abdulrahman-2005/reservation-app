'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function NotesModal({ appointment, onClose }) {
  const [internalNotes, setInternalNotes] = useState('')
  const [visitNotes, setVisitNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    loadNotes()
  }, [])
  
  async function loadNotes() {
    try {
      const supabase = createClient()
      
      // Load patient internal notes
      const { data: patient } = await supabase
        .from('patients')
        .select('internal_notes')
        .eq('id', appointment.patient_id)
        .single()
      
      setInternalNotes(patient?.internal_notes || '')
      setVisitNotes(appointment.visit_notes || '')
    } catch (err) {
      console.error('Failed to load notes:', err)
    } finally {
      setLoading(false)
    }
  }
  
  async function handleSave() {
    setSaving(true)
    setError(null)
    
    try {
      const supabase = createClient()
      
      // Update patient internal notes
      const { error: patientError } = await supabase
        .from('patients')
        .update({ internal_notes: internalNotes })
        .eq('id', appointment.patient_id)
      
      if (patientError) throw patientError
      
      // Update appointment visit notes
      const { error: appointmentError } = await supabase
        .from('appointments')
        .update({ visit_notes: visitNotes })
        .eq('id', appointment.id)
      
      if (appointmentError) throw appointmentError
      
      onClose()
    } catch (err) {
      console.error('Failed to save notes:', err)
      setError('فشل حفظ الملاحظات')
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {/* Patient name */}
      <div className="bg-slate-50 rounded-xl p-4">
        <h3 className="font-semibold text-slate-800">{appointment.patients.full_name}</h3>
        <p className="text-sm text-slate-500">{appointment.patients.phone}</p>
      </div>
      
      {/* Internal notes (patient-level) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          ملاحظات داخلية (خاصة بالموظفين)
        </label>
        <textarea
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
          placeholder="مثال: حساسية من البنسلين، يفضل المواعيد الصباحية..."
          rows={4}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-slate-800 resize-none"
        />
        <p className="text-xs text-slate-500 mt-1">
          هذه الملاحظات تظهر في جميع مواعيد المريض
        </p>
      </div>
      
      {/* Visit notes (appointment-level) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          ملاحظات الزيارة (هذا الموعد فقط)
        </label>
        <textarea
          value={visitNotes}
          onChange={(e) => setVisitNotes(e.target.value)}
          placeholder="مثال: شكوى من صداع مستمر، تم وصف دواء..."
          rows={4}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-slate-800 resize-none"
        />
      </div>
      
      {/* Error */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      
      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {saving ? (
          <>
            <LoadingSpinner size="sm" className="border-white border-t-transparent" />
            جاري الحفظ...
          </>
        ) : (
          'حفظ الملاحظات'
        )}
      </button>
    </div>
  )
}
