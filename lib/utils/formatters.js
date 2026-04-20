// Date, time, and currency formatting utilities for Egyptian Arabic locale

/**
 * Format a date for display (Arabic locale, Egypt timezone)
 * @param {string|Date} dateString - Date to format
 * @returns {string} e.g. "الثلاثاء، ١٠ ديسمبر ٢٠٢٤"
 */
export function formatDateAr(dateString) {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
  return new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Africa/Cairo',
  }).format(date)
}

/**
 * Format a date for display (short version)
 * @param {string|Date} dateString - Date to format
 * @returns {string} e.g. "١٠ ديسمبر"
 */
export function formatDateShortAr(dateString) {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
  return new Intl.DateTimeFormat('ar-EG', {
    month: 'long',
    day: 'numeric',
    timeZone: 'Africa/Cairo',
  }).format(date)
}

/**
 * Format a time for display (12-hour format with Arabic numerals)
 * @param {string} timeString - Time in HH:MM format
 * @returns {string} e.g. "١٠:٣٠ ص"
 */
export function formatTimeAr(timeString) {
  const [hours, minutes] = timeString.split(':')
  const d = new Date()
  d.setHours(parseInt(hours), parseInt(minutes))
  
  return new Intl.DateTimeFormat('ar-EG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Africa/Cairo',
  }).format(d)
}

/**
 * Format a currency amount in EGP
 * @param {number} amount - Amount to format
 * @returns {string} e.g. "٥٠٠ ج.م"
 */
export function formatEGP(amount) {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format a phone number for display
 * @param {string} phone - Phone number (01XXXXXXXXX)
 * @returns {string} e.g. "٠١٠ ١٢٣٤ ٥٦٧٨"
 */
export function formatPhoneAr(phone) {
  if (!phone || phone.length !== 11) return phone
  
  // Convert to Arabic numerals and add spacing
  const arabicPhone = phone.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])
  return `${arabicPhone.slice(0, 3)} ${arabicPhone.slice(3, 7)} ${arabicPhone.slice(7)}`
}

/**
 * Get day name from date
 * @param {string|Date} dateString - Date
 * @returns {string} Day key (sun, mon, tue, etc.)
 */
export function getDayKey(dateString) {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  const dayIndex = date.getDay()
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return days[dayIndex]
}

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} e.g. "2024-12-10"
 */
export function formatDateISO(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Parse time string to minutes since midnight
 * @param {string} timeString - Time in HH:MM format
 * @returns {number} Minutes since midnight
 */
export function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Convert minutes since midnight to time string
 * @param {number} minutes - Minutes since midnight
 * @returns {string} Time in HH:MM format
 */
export function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}
