import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export const metadata = {
  title: 'لوحة الطبيب | عيادة خطوة',
  description: 'إدارة المحاسبة والجدول الزمني',
}

export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }
  
  // Get staff profile and verify doctor role
  const { data: profile } = await supabase
    .from('staff_profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (!profile || profile.role !== 'doctor') {
    redirect('/dashboard')
  }
  
  return <DashboardLayout profile={profile}>{children}</DashboardLayout>
}
