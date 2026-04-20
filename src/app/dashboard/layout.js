import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export const metadata = {
  title: 'لوحة التحكم | عيادة خطوة',
  description: 'إدارة المواعيد والمرضى',
}

export default async function Layout({ children }) {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }
  
  // Get staff profile
  const { data: profile } = await supabase
    .from('staff_profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (!profile) {
    redirect('/login')
  }
  
  return <DashboardLayout profile={profile}>{children}</DashboardLayout>
}
