'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function SettingsView({ initialSettings, initialTemplates }) {
  const [templates, setTemplates] = useState(initialTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplates[0] || null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return
    
    setSaving(true)
    setError(null)
    setSuccess(false)
    
    try {
      const supabase = createClient()
      
      const { error: updateError } = await supabase
        .from('whatsapp_templates')
        .update({
          title: selectedTemplate.title,
          body: selectedTemplate.body,
          is_active: selectedTemplate.is_active,
        })
        .eq('id', selectedTemplate.id)
      
      if (updateError) throw updateError
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save template:', err)
      setError('فشل حفظ القالب')
    } finally {
      setSaving(false)
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-2">الإعدادات</h1>
        <p className="text-white/90">إدارة قوالب رسائل واتساب</p>
      </div>
      
      {/* WhatsApp Templates */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">قوالب رسائل واتساب</h2>
        
        {/* Template selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            اختر القالب
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
        
        {selectedTemplate && (
          <>
            {/* Template title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                عنوان القالب
              </label>
              <input
                type="text"
                value={selectedTemplate.title}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-slate-800"
              />
            </div>
            
            {/* Template body */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                نص الرسالة
              </label>
              <textarea
                value={selectedTemplate.body}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, body: e.target.value })}
                rows={8}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-slate-800 resize-none font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-2">
                المتغيرات المتاحة: {'{'}{'{'} patient_name {'}'}{'}'}, {'{'}{'{'} doctor_name {'}'}{'}'}, {'{'}{'{'} clinic_name {'}'}{'}'}, {'{'}{'{'} date {'}'}{'}'}, {'{'}{'{'} time {'}'}{'}'}, {'{'}{'{'} code {'}'}{'}'}, {'{'}{'{'} booking_url {'}'}{'}'}
              </p>
            </div>
            
            {/* Active toggle */}
            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTemplate.is_active}
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, is_active: e.target.checked })}
                  className="w-5 h-5 text-primary-500 border-2 border-slate-300 rounded focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-slate-700">تفعيل هذا القالب</span>
              </label>
            </div>
            
            {/* Messages */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 mb-4 text-sm text-emerald-700">
                تم حفظ القالب بنجاح
              </div>
            )}
            
            {/* Save button */}
            <button
              onClick={handleSaveTemplate}
              disabled={saving}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-md"
            >
              {saving ? (
                <>
                  <LoadingSpinner size="sm" className="border-white border-t-transparent" />
                  جاري الحفظ...
                </>
              ) : (
                'حفظ التغييرات'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
