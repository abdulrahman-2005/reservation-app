'use client'

import { useState, useMemo } from 'react'
import { getNextAvailableDates } from '@/lib/utils/slots'
import { formatDateISO, formatDateShortAr, getDayKey } from '@/lib/utils/formatters'
import { DAY_ABBR, MONTHS } from '@/lib/constants'

export default function DateSelector({ settings, onSelect }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  
  // Get available dates for the next 60 days
  const availableDates = useMemo(() => {
    return getNextAvailableDates(
      60,
      settings.shift_config,
      settings.shift_config.blocked_dates || []
    )
  }, [settings])
  
  // Filter dates for selected month
  const datesInMonth = useMemo(() => {
    return availableDates.filter(date => 
      date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
    )
  }, [availableDates, selectedMonth, selectedYear])
  
  // Get calendar grid for the month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(selectedYear, selectedMonth, 1)
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0)
    const startDay = firstDay.getDay() // 0 = Sunday
    const daysInMonth = lastDay.getDate()
    
    const days = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day)
      const dateStr = formatDateISO(date)
      const isAvailable = datesInMonth.some(d => formatDateISO(d) === dateStr)
      const isToday = formatDateISO(new Date()) === dateStr
      
      days.push({
        day,
        date,
        dateStr,
        isAvailable,
        isToday,
      })
    }
    
    return days
  }, [selectedMonth, selectedYear, datesInMonth])
  
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }
  
  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }
  
  const handleDateClick = (dateStr) => {
    onSelect(dateStr)
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">اختر التاريخ</h2>
        <p className="text-slate-600">التواريخ المتاحة للحجز</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleNextMonth}
            className="p-2 text-slate-600 hover:text-cyan-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="الشهر التالي"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h3 className="text-lg font-bold text-slate-900">
            {MONTHS[selectedMonth]} {selectedYear}
          </h3>
          
          <button
            onClick={handlePrevMonth}
            className="p-2 text-slate-600 hover:text-cyan-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="الشهر السابق"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {['sat', 'fri', 'thu', 'wed', 'tue', 'mon', 'sun'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-slate-600 py-2">
              {DAY_ABBR[day]}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} />
            }
            
            return (
              <button
                key={day.dateStr}
                onClick={() => day.isAvailable && handleDateClick(day.dateStr)}
                disabled={!day.isAvailable}
                className={`
                  aspect-square rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center
                  ${day.isAvailable
                    ? 'bg-cyan-600 text-white hover:bg-cyan-700 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }
                  ${day.isToday ? 'ring-2 ring-cyan-500 ring-offset-2' : ''}
                `}
              >
                {day.day}
              </button>
            )
          })}
        </div>
        
        {datesInMonth.length === 0 && (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-600">لا توجد مواعيد متاحة في هذا الشهر</p>
          </div>
        )}
      </div>
      
      {/* Legend */}
      {availableDates.length > 0 && (
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">15</span>
            </div>
            <span className="text-slate-700">متاح</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <span className="text-slate-400 text-xs font-semibold">20</span>
            </div>
            <span className="text-slate-700">غير متاح</span>
          </div>
        </div>
      )}
      
      {/* Quick select buttons for next available dates */}
      {availableDates.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-slate-700 font-semibold">أو اختر من المواعيد القريبة:</p>
          <div className="flex flex-wrap gap-2">
            {availableDates.slice(0, 5).map((date) => {
              const dateStr = formatDateISO(date)
              return (
                <button
                  key={dateStr}
                  onClick={() => handleDateClick(dateStr)}
                  className="px-4 py-2 bg-white rounded-lg text-sm font-semibold text-slate-700 hover:bg-cyan-600 hover:text-white transition-colors border border-slate-200 hover:border-cyan-600"
                >
                  {formatDateShortAr(date)}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
