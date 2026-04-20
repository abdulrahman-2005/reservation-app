// WhatsApp deep link utilities (zero-cost messaging)

/**
 * Parses a WhatsApp template body and replaces {{tags}} with patient data.
 * @param {string} templateBody - e.g. "مرحباً {{patient_name}}، موعدك {{date}}"
 * @param {Object} data - { patient_name, doctor_name, clinic_name, date, time, code, booking_url }
 * @returns {string} Parsed message ready for wa.me link
 */
export function parseTemplate(templateBody, data) {
  return templateBody.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] ?? match // Leave unreplaced if key not found
  })
}

/**
 * Builds a wa.me deep link for a given Egyptian phone number.
 * Handles number normalization (strips leading 0, adds country code 20).
 * @param {string} phone - e.g. "01012345678"
 * @param {string} message - pre-parsed message text
 * @returns {string} Full wa.me URL
 */
export function buildWhatsAppLink(phone, message) {
  // Normalize Egyptian phone: remove leading 0, prepend 20
  const normalized = phone.startsWith('0') 
    ? `20${phone.slice(1)}` 
    : phone.startsWith('20') 
      ? phone 
      : `20${phone}`
  
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}

/**
 * Opens WhatsApp in a new tab. Call this from onClick handlers.
 * @param {string} phone - Egyptian phone number
 * @param {string} message - Message text
 */
export function openWhatsApp(phone, message) {
  const link = buildWhatsAppLink(phone, message)
  window.open(link, '_blank', 'noopener,noreferrer')
}

/**
 * Share text via Web Share API (fallback to WhatsApp)
 * @param {string} text - Text to share
 * @param {string} phone - Optional phone number for WhatsApp fallback
 */
export async function shareText(text, phone = null) {
  // Try Web Share API first (native share on mobile)
  if (navigator.share) {
    try {
      await navigator.share({ text })
      return true
    } catch (err) {
      // User canceled or error occurred
      console.log('Share canceled or failed:', err)
    }
  }
  
  // Fallback to WhatsApp if phone provided
  if (phone) {
    openWhatsApp(phone, text)
    return true
  }
  
  return false
}
