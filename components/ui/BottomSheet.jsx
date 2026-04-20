'use client'

import { useEffect } from 'react'

export default function BottomSheet({ isOpen, onClose, title, children }) {
  // Close on escape key
  useEffect(() => {
    if (!isOpen) return
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])
  
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Bottom Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden transition-transform duration-300 ease-out"
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>
        
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
              aria-label="إغلاق"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 py-4">
          {children}
        </div>
      </div>
    </>
  )
}
