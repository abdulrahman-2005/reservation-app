'use client'

import { useState, useEffect } from 'react'
import TypeSelector from './TypeSelector'
import DateSelector from './DateSelector'
import TimeSelector from './TimeSelector'
import PatientForm from './PatientForm'
import SuccessScreen from './SuccessScreen'

export default function BookingFlow({ settings }) {
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    type: null,
    date: null,
    time: null,
    name: '',
    phone: '',
  })
  const [reservationCode, setReservationCode] = useState(null)
  
  // Load saved patient data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('khatwah_patient')
      if (saved) {
        const { name, phone } = JSON.parse(saved)
        setBookingData(prev => ({ ...prev, name, phone }))
      }
    } catch (err) {
      console.error('Failed to load saved patient data:', err)
    }
  }, [])
  
  const updateBookingData = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleTypeSelect = (type) => {
    updateBookingData('type', type)
    setStep(2)
  }
  
  const handleDateSelect = (date) => {
    updateBookingData('date', date)
    setStep(3)
  }
  
  const handleTimeSelect = (time) => {
    updateBookingData('time', time)
    setStep(4)
  }
  
  const handleBookingComplete = (code) => {
    setReservationCode(code)
    setStep(5)
    
    // Save patient data to localStorage
    try {
      localStorage.setItem('khatwah_patient', JSON.stringify({
        name: bookingData.name,
        phone: bookingData.phone,
      }))
    } catch (err) {
      console.error('Failed to save patient data:', err)
    }
  }
  
  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }
  
  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {step > 1 && step < 5 && (
              <button
                onClick={handleBack}
                className="p-2 text-slate-600 hover:text-cyan-600 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="رجوع"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="flex-1">
              <h1 className="text-lg font-bold text-slate-900">{settings.clinic_name}</h1>
              {step < 5 && (
                <p className="text-sm text-slate-600">
                  الخطوة {step} من 4
                </p>
              )}
            </div>
            {step === 1 && (
              <a
                href="/login"
                className="p-2 text-slate-600 hover:text-cyan-600 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="دخول الموظفين"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      {step < 5 && (
        <div className="max-w-md mx-auto px-4 mt-6">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-cyan-600 to-cyan-500 transition-all duration-500 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-3 text-xs font-medium">
            <span className={step >= 1 ? 'text-cyan-600' : 'text-slate-400'}>النوع</span>
            <span className={step >= 2 ? 'text-cyan-600' : 'text-slate-400'}>التاريخ</span>
            <span className={step >= 3 ? 'text-cyan-600' : 'text-slate-400'}>الوقت</span>
            <span className={step >= 4 ? 'text-cyan-600' : 'text-slate-400'}>البيانات</span>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="max-w-md mx-auto px-4 mt-6">
        {step === 1 && (
          <TypeSelector onSelect={handleTypeSelect} />
        )}
        
        {step === 2 && (
          <DateSelector
            settings={settings}
            onSelect={handleDateSelect}
          />
        )}
        
        {step === 3 && (
          <TimeSelector
            date={bookingData.date}
            settings={settings}
            onSelect={handleTimeSelect}
          />
        )}
        
        {step === 4 && (
          <PatientForm
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onComplete={handleBookingComplete}
          />
        )}
        
        {step === 5 && (
          <SuccessScreen
            bookingData={bookingData}
            reservationCode={reservationCode}
            settings={settings}
          />
        )}
      </div>
    </div>
  )
}
