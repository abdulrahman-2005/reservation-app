import HomePage from '@/components/home/HomePage'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  let userProfile = null
  if (user) {
    // Check user role
    const { data: profile } = await supabase
      .from('staff_profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single()
    
    userProfile = profile
  }
  
  return <HomePage user={user} profile={userProfile} />
}
