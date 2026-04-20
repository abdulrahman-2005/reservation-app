'use client'

import { useState } from 'react'
import AppointmentFinancialCard from './AppointmentFinancialCard'
import { formatDateAr } from '@/lib/utils/formatters'

export default function LedgerView({ initialAppointments }) {
  const [appointments] = useState(initialAppointments)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  
  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        apt.patients.full_name.toLowerCase().includes(query) ||
        apt.patients.phone.includes(query) ||
        apt.reservation_code.toLowerCase().includes(query)
      
      if (!matchesSearch) return false
    }
    
    // Status filter
    if (filterStatus === 'pending') {
      const balance = calculateBalance(apt.transactions)
      return balance > 0
    } else if (filterStatus === 'paid') {
      const balance = calculateBalance(apt.transactions)
      return balance === 0 && apt.transactions?.length > 0
    } else if (filterStatus === 'completed') {
      return apt.status === 'completed'
    }
    
    return true
  })
  
  // Calculate total statistics
  const totalExpected = appointments.reduce((sum, apt) => {
    return sum + (apt.transactions?.reduce((s, t) => s + (parseFloat(t.amount_expected) || 0), 0) || 0)
  }, 0)
  
  const totalPaid = appointments.reduce((sum, apt) => {
    return sum + (apt.transactions?.reduce((s, t) => s + (parseFloat(t.amount_paid) || 0), 0) || 0)
  }, 0)
  
  const totalPending = totalExpected - totalPaid
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-xl font-bold text-white mb-4">دفتر الحسابات</h1>
          
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-xs text-white/90 mb-1">إجمالي متوقع</p>
              <p className="text-lg font-bold text-white">{totalExpected.toFixed(0)}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-xs text-white/90 mb-1">إجمالي مدفوع</p>
              <p className="text-lg font-bold text-white">{totalPaid.toFixed(0)}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-xs text-white/90 mb-1">رصيد معلق</p>
              <p className="text-lg font-bold text-white">{totalPending.toFixed(0)}</p>
            </div>
          </div>
          
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم، الهاتف، أو كود الحجز..."
            className="w-full px-4 py-3 border-2 border-white/30 bg-white/95 backdrop-blur-sm rounded-xl focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-slate-800 placeholder:text-slate-400 mb-3"
          />
          
          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: 'all', label: 'الكل' },
              { key: 'pending', label: 'رصيد معلق' },
              { key: 'paid', label: 'مدفوع بالكامل' },
              { key: 'completed', label: 'مكتمل' },
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filterStatus === filter.key
                    ? 'bg-white text-primary-600 shadow-md'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Appointments list */}
      <div className="p-4 space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-600">لا توجد نتائج</p>
          </div>
        ) : (
          filteredAppointments.map(appointment => (
            <AppointmentFinancialCard key={appointment.id} appointment={appointment} />
          ))
        )}
      </div>
    </div>
  )
}

function calculateBalance(transactions) {
  if (!transactions || transactions.length === 0) return 0
  
  return transactions.reduce((sum, t) => {
    const expected = parseFloat(t.amount_expected) || 0
    const paid = parseFloat(t.amount_paid) || 0
    return sum + (expected - paid)
  }, 0)
}
