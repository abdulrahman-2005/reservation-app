'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  
  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      const supabase = createClient()
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (signInError) throw signInError
      
      // Check user role
      const { data: profile } = await supabase
        .from('staff_profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()
      
      // Redirect based on role
      if (profile?.role === 'doctor') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
      
    } catch (err) {
      console.error('Login error:', err)
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">عيادة خطوة</h1>
          <p className="text-slate-600">تسجيل دخول الموظفين</p>
        </div>
        
        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-sm p-6 space-y-5 border border-slate-200">
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@khatwah.clinic"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all text-slate-900"
              required
              disabled={loading}
              dir="ltr"
            />
          </div>
          
          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all text-slate-900"
              required
              disabled={loading}
              dir="ltr"
            />
          </div>
          
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="border-white border-t-transparent" />
                جاري تسجيل الدخول...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>
        
        {/* Back to booking */}
        <div className="text-center mt-6">
          <a
            href="/book"
            className="text-cyan-600 hover:text-cyan-700 transition-colors text-sm font-medium"
          >
            ← العودة إلى صفحة الحجز
          </a>
        </div>
      </div>
    </div>
  )
}
