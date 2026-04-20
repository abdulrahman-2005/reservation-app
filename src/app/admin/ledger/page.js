import { createClient } from '@/lib/supabase/server'
import LedgerView from '@/components/admin/LedgerView'

export const metadata = {
  title: 'دفتر الحسابات | عيادة خطوة',
  description: 'سجل المعاملات المالية',
}

export default async function LedgerPage() {
  const supabase = await createClient()
  
  // Fetch all appointments with transactions
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patients(full_name, phone),
      transactions(*)
    `)
    .order('date', { ascending: false })
    .order('start_time', { ascending: false })
  
  if (error) {
    console.error('Failed to load ledger:', error)
    return (
      <div className="p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-700">فشل تحميل دفتر الحسابات</p>
        </div>
      </div>
    )
  }
  
  return <LedgerView initialAppointments={appointments || []} />
}
