// Slot generation logic for appointment booking
import { getDayKey, timeToMinutes, minutesToTime } from './formatters'

/**
 * Generate available time slots for a given date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {Object} shiftConfig - Clinic shift configuration from clinic_settings
 * @param {string[]} bookedTimes - Array of already booked times (HH:MM format)
 * @param {string[]} blockedDates - Array of blocked dates (YYYY-MM-DD format)
 * @returns {string[]} Array of available time slots (HH:MM format)
 */
export function getAvailableSlots(dateString, shiftConfig, bookedTimes = [], blockedDates = []) {
  // Check if date is blocked
  if (blockedDates.includes(dateString)) {
    return []
  }
  
  const dayKey = getDayKey(dateString)
  const shifts = shiftConfig.days[dayKey]
  
  // No shifts configured for this day
  if (!shifts || shifts.length === 0) {
    return []
  }
  
  const slotDuration = shiftConfig.slot_duration_minutes || 30
  const slots = []
  
  // Generate slots for each shift
  for (const shift of shifts) {
    let currentMinutes = timeToMinutes(shift.start)
    const endMinutes = timeToMinutes(shift.end)
    
    while (currentMinutes < endMinutes) {
      const timeStr = minutesToTime(currentMinutes)
      
      // Only add if not already booked
      if (!bookedTimes.includes(timeStr)) {
        slots.push(timeStr)
      }
      
      currentMinutes += slotDuration
    }
  }
  
  return slots
}

/**
 * Check if a specific date is available for booking
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {Object} shiftConfig - Clinic shift configuration
 * @param {string[]} blockedDates - Array of blocked dates
 * @returns {boolean} True if date has any available slots
 */
export function isDateAvailable(dateString, shiftConfig, blockedDates = []) {
  if (blockedDates.includes(dateString)) {
    return false
  }
  
  const dayKey = getDayKey(dateString)
  const shifts = shiftConfig.days[dayKey]
  
  return shifts && shifts.length > 0
}

/**
 * Get next N available dates starting from today
 * @param {number} count - Number of dates to return
 * @param {Object} shiftConfig - Clinic shift configuration
 * @param {string[]} blockedDates - Array of blocked dates
 * @returns {Date[]} Array of available dates
 */
export function getNextAvailableDates(count, shiftConfig, blockedDates = []) {
  const dates = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let currentDate = new Date(today)
  let daysChecked = 0
  const maxDaysToCheck = 90 // Don't check more than 3 months ahead
  
  while (dates.length < count && daysChecked < maxDaysToCheck) {
    const dateString = currentDate.toISOString().split('T')[0]
    
    if (isDateAvailable(dateString, shiftConfig, blockedDates)) {
      dates.push(new Date(currentDate))
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
    daysChecked++
  }
  
  return dates
}

/**
 * Validate if a time slot is valid for booking
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {string} timeString - Time in HH:MM format
 * @param {Object} shiftConfig - Clinic shift configuration
 * @param {string[]} bookedTimes - Array of already booked times
 * @param {string[]} blockedDates - Array of blocked dates
 * @returns {boolean} True if slot is valid and available
 */
export function isSlotValid(dateString, timeString, shiftConfig, bookedTimes = [], blockedDates = []) {
  const availableSlots = getAvailableSlots(dateString, shiftConfig, bookedTimes, blockedDates)
  return availableSlots.includes(timeString)
}
