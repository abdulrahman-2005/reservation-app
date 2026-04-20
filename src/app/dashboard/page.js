import { createClient } from '@/lib/supabase/server'
import QueueView from '@/components/queue/QueueView'

export default async function DashboardPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  
  // Fetch today's appointments
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('*, patients(full_name, phone)')
    .eq('date', today)
    .order('start_time')
  
  if (error) {
    console.error('Failed to load appointments:', error)
    return (
      <div className="p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-700">فشل تحميل المواعيد</p>
        </div>
      </div>
    )
  }
  
  return <QueueView initialAppointments={appointments || []} />
}
