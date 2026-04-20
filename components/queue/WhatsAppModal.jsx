'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useClinicSettings } from '@/hooks/useClinicSettings'
import { parseTemplate, openWhatsApp } from '@/lib/utils/whatsapp'
import { formatDateAr, formatTimeAr } from '@/lib/utils/formatters'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function WhatsAppModal({ appointment, onClose }) {
  const { settings } = useClinicSettings()
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadTemplates()
  }, [])
  
  useEffect(() => {
    if (selectedTemplate && settings) {
      const parsed = parseTemplate(selectedTemplate.body, {
        patient_name: appointment.patients.full_name,
        doctor_name: settings.doctor_name,
        clinic_name: settings.clinic_name,
        date: formatDateAr(appointment.date),
        time: formatTimeAr(appointment.start_time),
        code: appointment.reservation_code,
        booking_url: process.env.NEXT_PUBLIC_BOOKING_URL || '',
      })
      setMessage(parsed)
    }
  }, [selectedTemplate, settings, appointment])
  
  async function loadTemplates() {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      
      if (error) throw error
      
      setTemplates(data || [])
      if (data && data.length > 0) {
        setSelectedTemplate(data[0])
      }
    } catch (err) {
      console.error('Failed to load templates:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSend = () => {
    openWhatsApp(appointment.patients.phone, message)
    onClose()
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
      {/* Template selector */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          اختر قالب الرسالة
        </label>
        <select
          value={selectedTemplate?.id || ''}
          onChange={(e) => {
            const template = templates.find(t => t.id === e.target.value)
            setSelectedTemplate(template)
          }}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-slate-800"
        >
          {templates.map(template => (
            <option key={template.id} value={template.id}>
              {template.title}
            </option>
          ))}
        </select>
      </div>
      
      {/* Message preview */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          معاينة الرسالة
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-slate-800 resize-none"
        />
      </div>
      
      {/* Send button */}
      <button
        onClick={handleSend}
        className="w-full py-4 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        فتح واتساب
      </button>
    </div>
  )
}
