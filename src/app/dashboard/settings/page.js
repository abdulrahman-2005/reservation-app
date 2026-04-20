import { createClient } from '@/lib/supabase/server'
import SettingsView from '@/components/dashboard/SettingsView'

export const metadata = {
  title: 'الإعدادات | عيادة خطوة',
  description: 'إعدادات العيادة وقوالب الرسائل',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  
  // Fetch clinic settings and templates
  const [settingsResult, templatesResult] = await Promise.all([
    supabase.from('clinic_settings').select('*').single(),
    supabase.from('whatsapp_templates').select('*').order('sort_order'),
  ])
  
  if (settingsResult.error || templatesResult.error) {
    console.error('Failed to load settings:', settingsResult.error || templatesResult.error)
    return (
      <div className="p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-700">فشل تحميل الإعدادات</p>
        </div>
      </div>
    )
  }
  
  return (
    <SettingsView
      initialSettings={settingsResult.data}
      initialTemplates={templatesResult.data || []}
    />
  )
}
