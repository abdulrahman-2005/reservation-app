'use client'

import { useState } from 'react'
import BubbleNavbar from '@/components/ui/BubbleNavbar'
import BottomSheet from '@/components/ui/BottomSheet'
import WalkInForm from '@/components/queue/WalkInForm'

export default function DashboardLayout({ profile, children }) {
  const [showFABMenu, setShowFABMenu] = useState(false)
  const [showWalkInForm, setShowWalkInForm] = useState(false)
  
  const handleFABClick = () => {
    setShowFABMenu(true)
  }
  
  const handleWalkInClick = () => {
    setShowFABMenu(false)
    setShowWalkInForm(true)
  }
  
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {children}
      
      {/* Bottom Navigation */}
      <BubbleNavbar userRole={profile.role} onFABClick={handleFABClick} />
      
      {/* FAB Menu */}
      <BottomSheet
        isOpen={showFABMenu}
        onClose={() => setShowFABMenu(false)}
        title="إجراء سريع"
      >
        <div className="space-y-3">
          <button
            onClick={handleWalkInClick}
            className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-primary-500 transition-colors text-right"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">إضافة مريض حضور مباشر</h3>
                <p className="text-sm text-slate-500">تسجيل مريض جديد في الطابور</p>
              </div>
            </div>
          </button>
          
          {profile.role === 'doctor' && (
            <button
              onClick={() => {
                setShowFABMenu(false)
                // TODO: Open payment modal
              }}
              className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-primary-500 transition-colors text-right"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">تسجيل دفعة</h3>
                  <p className="text-sm text-slate-500">إضافة دفعة مالية لمريض</p>
                </div>
              </div>
            </button>
          )}
        </div>
      </BottomSheet>
      
      {/* Walk-in Form */}
      <BottomSheet
        isOpen={showWalkInForm}
        onClose={() => setShowWalkInForm(false)}
        title="إضافة مريض حضور مباشر"
      >
        <WalkInForm onSuccess={() => setShowWalkInForm(false)} />
      </BottomSheet>
    </div>
  )
}
