'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BubbleNavbar({ userRole, onFABClick }) {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)
  
  const isActive = (path) => pathname === path || pathname.startsWith(path + '/')
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      {/* SVG navbar shape with cutout */}
      <svg 
        width="100%" 
        height="80" 
        viewBox="0 0 390 80" 
        preserveAspectRatio="none"
        className="absolute bottom-0 pointer-events-auto"
      >
        <path
          d="
            M0,20
            L140,20
            Q150,20 155,15
            Q165,5 175,2
            Q185,0 195,0
            Q205,0 215,2
            Q225,5 235,15
            Q240,20 250,20
            L390,20
            L390,80
            L0,80
            Z
          "
          className="fill-white dark:fill-slate-900"
          style={{ filter: 'drop-shadow(0 -2px 8px rgba(0,0,0,0.08))' }}
        />
      </svg>
      
      {/* Nav items */}
      <div className="relative flex items-end justify-around px-4 pb-4 h-20 pointer-events-auto">
        <NavItem 
          href="/dashboard" 
          icon="queue" 
          label="الطابور" 
          active={isActive('/dashboard') && !pathname.includes('/patients') && !pathname.includes('/settings')}
        />
        
        <NavItem 
          href="/dashboard/patients" 
          icon="patients" 
          label="المرضى" 
          active={isActive('/dashboard/patients')}
        />
        
        {/* FAB in the cutout */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-4">
          <button
            onClick={onFABClick}
            className="w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95"
            aria-label="إضافة"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        <button
          onClick={() => setShowMenu(true)}
          className={`flex flex-col items-center gap-1 min-w-[60px] transition-colors duration-200 ${
            showMenu ? 'text-primary-500' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          <span className="text-xs font-medium">المزيد</span>
        </button>
        
        {userRole === 'doctor' && (
          <NavItem 
            href="/admin" 
            icon="accounting" 
            label="المحاسبة" 
            active={isActive('/admin')}
          />
        )}
      </div>
      
      {/* More Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed bottom-20 left-4 right-4 z-50 bg-white rounded-2xl shadow-2xl p-4 space-y-2 max-w-md mx-auto">
            <a
              href="/dashboard/settings"
              className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors"
              onClick={() => setShowMenu(false)}
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-slate-800">الإعدادات</span>
            </a>
            
            <a
              href="/logout"
              className="flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl transition-colors text-red-600"
              onClick={() => setShowMenu(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">تسجيل الخروج</span>
            </a>
          </div>
        </>
      )}
    </div>
  )
}

function NavItem({ href, icon, label, active }) {
  const iconMap = {
    queue: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    patients: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    settings: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    accounting: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }
  
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 min-w-[60px] transition-colors duration-200 ${
        active ? 'text-primary-500' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {iconMap[icon]}
      <span className="text-xs font-medium">{label}</span>
    </Link>
  )
}
