'use client'

import { useState } from 'react'

export default function PatientsView({ initialPatients }) {
  const [patients] = useState(initialPatients)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter patients
  const filteredPatients = patients.filter(patient => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      patient.full_name.toLowerCase().includes(query) ||
      patient.phone.includes(query)
    )
  })
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-white">دليل المرضى</h1>
              <p className="text-sm text-white/80">{patients.length} مريض</p>
            </div>
          </div>
          
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم أو رقم الهاتف..."
            className="w-full px-4 py-3 border-2 border-white/30 bg-white/95 backdrop-blur-sm rounded-xl focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>
      
      {/* Patients list */}
      <div className="p-4 space-y-3">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-slate-600">
              {searchQuery ? 'لا توجد نتائج للبحث' : 'لا يوجد مرضى مسجلين'}
            </p>
          </div>
        ) : (
          filteredPatients.map(patient => (
            <div key={patient.id} className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    {patient.full_name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <a
                      href={`tel:${patient.phone}`}
                      className="flex items-center gap-1 hover:text-primary-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {patient.phone}
                    </a>
                    {patient.appointments && patient.appointments.length > 0 && (
                      <>
                        <span className="text-slate-400">•</span>
                        <span>{patient.appointments[0].count} زيارة</span>
                      </>
                    )}
                  </div>
                  
                  {patient.internal_notes && (
                    <p className="text-sm text-slate-600 mt-2 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-2 border border-amber-200">
                      {patient.internal_notes}
                    </p>
                  )}
                </div>
                
                {patient.is_verified && (
                  <div className="w-6 h-6 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
