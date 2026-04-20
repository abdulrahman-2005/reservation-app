import { createClient } from '@/lib/supabase/server'
import PatientsView from '@/components/dashboard/PatientsView'

export const metadata = {
  title: 'المرضى | عيادة خطوة',
  description: 'دليل المرضى',
}

export default async function PatientsPage() {
  const supabase = await createClient()
  
  // Fetch all patients with their appointment count
  const { data: patients, error } = await supabase
    .from('patients')
    .select('*, appointments(count)')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Failed to load patients:', error)
    return (
      <div className="p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-700">فشل تحميل قائمة المرضى</p>
        </div>
      </div>
    )
  }
  
  return <PatientsView initialPatients={patients || []} />
}
