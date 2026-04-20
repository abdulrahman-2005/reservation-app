'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function HomePage({ user, profile }) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  
  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-cream-100 to-teal-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-coral-500">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-coral-500 to-coral-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black text-navy-600" style={{fontFamily: 'Cairo, sans-serif'}}>
                  عيادة خطوة
                </h1>
                <p className="text-sm font-bold text-teal-600" style={{fontFamily: 'Tajawal, sans-serif'}}>
                  🏥 العريش • مصر
                </p>
              </div>
            </div>
            
            {/* User Section */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-sand-100 to-sand-200 px-5 py-3 rounded-xl border-2 border-sand-400">
                  <p className="text-base font-bold text-navy-600" style={{fontFamily: 'Cairo, sans-serif'}}>
                    {profile?.full_name || user.email}
                  </p>
                  <p className="text-sm font-bold text-teal-600" style={{fontFamily: 'Tajawal, sans-serif'}}>
                    {profile?.role === 'doctor' ? '👨‍⚕️ طبيب' : profile?.role === 'receptionist' ? '📋 موظف' : '🏥 مريض'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="p-4 bg-coral-500 hover:bg-coral-600 text-white rounded-xl transition-all shadow-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                style={{fontFamily: 'Cairo, sans-serif'}}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                دخول الموظفين
              </button>
            )}
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Text */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-mint-500 to-mint-600 text-white px-8 py-4 rounded-full mb-8 shadow-lg">
            <p className="text-lg font-black" style={{fontFamily: 'Cairo, sans-serif'}}>
              ✨ نظام حجز مواعيد طبية متطور
            </p>
          </div>
          
          <h2 className="text-6xl md:text-8xl font-black text-navy-600 mb-6 leading-tight" style={{fontFamily: 'Cairo, sans-serif'}}>
            مرحباً بك في
          </h2>
          <h3 className="text-7xl md:text-9xl font-black mb-8 leading-tight" style={{fontFamily: 'Cairo, sans-serif'}}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-500 via-sand-500 to-teal-500">
              عيادة خطوة
            </span>
          </h3>
          <p className="text-2xl md:text-3xl text-navy-500 font-bold max-w-4xl mx-auto leading-relaxed" style={{fontFamily: 'Tajawal, sans-serif'}}>
            احجز موعدك بسهولة • تابع حالة حجزك • استمتع بخدمة طبية متميزة
          </p>
        </div>
        
        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {/* Book Appointment */}
          <button
            onClick={() => router.push('/book')}
            className="group bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl p-10 text-right transition-all transform hover:scale-105 border-4 border-coral-300 hover:border-coral-500"
          >
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-coral-500 to-coral-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-4xl font-black text-navy-600 mb-3" style={{fontFamily: 'Cairo, sans-serif'}}>
                  احجز موعد
                </h3>
                <p className="text-xl text-navy-500 font-bold" style={{fontFamily: 'Tajawal, sans-serif'}}>
                  احجز موعدك الآن بخطوات بسيطة وسريعة
                </p>
              </div>
            </div>
          </button>
          
          {/* Lookup Appointment */}
          <button
            onClick={() => router.push('/lookup')}
            className="group bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl p-10 text-right transition-all transform hover:scale-105 border-4 border-teal-300 hover:border-teal-500"
          >
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-4xl font-black text-navy-600 mb-3" style={{fontFamily: 'Cairo, sans-serif'}}>
                  تتبع موعدك
                </h3>
                <p className="text-xl text-navy-500 font-bold" style={{fontFamily: 'Tajawal, sans-serif'}}>
                  تحقق من حالة موعدك أو قم بإلغائه
                </p>
              </div>
            </div>
          </button>
          
          {/* Staff Dashboard - Only if logged in */}
          {user && profile && (profile.role === 'doctor' || profile.role === 'receptionist') && (
            <button
              onClick={() => router.push(profile.role === 'doctor' ? '/admin' : '/dashboard')}
              className="group bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl p-10 text-right transition-all transform hover:scale-105 border-4 border-sand-300 hover:border-sand-500 md:col-span-2"
            >
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-sand-500 to-sand-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-4xl font-black text-navy-600 mb-3" style={{fontFamily: 'Cairo, sans-serif'}}>
                    لوحة التحكم
                  </h3>
                  <p className="text-xl text-navy-500 font-bold" style={{fontFamily: 'Tajawal, sans-serif'}}>
                    {profile.role === 'doctor' ? 'إدارة العيادة والمرضى' : 'إدارة المواعيد والطابور'}
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>
        
        {/* Features */}
        <div className="bg-white rounded-[2.5rem] shadow-xl p-12 border-4 border-sand-200 max-w-6xl mx-auto mb-16">
          <h3 className="text-5xl font-black text-navy-600 mb-12 text-center" style={{fontFamily: 'Cairo, sans-serif'}}>
            لماذا عيادة خطوة؟
          </h3>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-coral-400 to-coral-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-black text-navy-600 mb-3" style={{fontFamily: 'Cairo, sans-serif'}}>
                حجز سريع
              </h4>
              <p className="text-lg text-navy-500 font-bold" style={{fontFamily: 'Tajawal, sans-serif'}}>
                احجز موعدك في أقل من دقيقة
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <h4 className="text-2xl font-black text-navy-600 mb-3" style={{fontFamily: 'Cairo, sans-serif'}}>
                تنبيهات واتساب
              </h4>
              <p className="text-lg text-navy-500 font-bold" style={{fontFamily: 'Tajawal, sans-serif'}}>
                تلقى تنبيهات فورية عبر واتساب
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-mint-400 to-mint-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-2xl font-black text-navy-600 mb-3" style={{fontFamily: 'Cairo, sans-serif'}}>
                آمن وموثوق
              </h4>
              <p className="text-lg text-navy-500 font-bold" style={{fontFamily: 'Tajawal, sans-serif'}}>
                بياناتك محمية بالكامل
              </p>
            </div>
          </div>
        </div>
        
        {/* Contact */}
        <div className="text-center">
          <p className="text-2xl text-navy-600 font-black mb-6" style={{fontFamily: 'Cairo, sans-serif'}}>
            للاستفسارات والطوارئ
          </p>
          <div className="flex items-center justify-center gap-6">
            <a
              href="tel:+201234567890"
              className="flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-2xl font-black text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              style={{fontFamily: 'Cairo, sans-serif'}}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              اتصل بنا
            </a>
            
            <a
              href="https://wa.me/201234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-mint-500 to-mint-600 text-white rounded-2xl font-black text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              style={{fontFamily: 'Cairo, sans-serif'}}
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              واتساب
            </a>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t-4 border-coral-500 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-xl text-navy-600 font-black" style={{fontFamily: 'Cairo, sans-serif'}}>
            © 2024 عيادة خطوة - جميع الحقوق محفوظة
          </p>
          <p className="text-lg text-teal-600 font-bold mt-2" style={{fontFamily: 'Tajawal, sans-serif'}}>
            صُنع بـ ❤️ في العريش
          </p>
        </div>
      </footer>
    </div>
  )
}
