// Reservation code utilities (client-side only - generation happens server-side)

/**
 * Validate reservation code format
 * @param {string} code - Code to validate
 * @returns {boolean} True if code format is valid
 */
export function isValidReservationCode(code) {
  if (!code || typeof code !== 'string') return false
  
  // Code should be 4 alphanumeric characters (uppercase)
  return /^[A-Z0-9]{4}$/.test(code.toUpperCase())
}

/**
 * Format reservation code for display (uppercase, spaced)
 * @param {string} code - Code to format
 * @returns {string} Formatted code
 */
export function formatReservationCode(code) {
  if (!code) return ''
  return code.toUpperCase().trim()
}

/**
 * Normalize reservation code input (remove spaces, uppercase)
 * @param {string} input - User input
 * @returns {string} Normalized code
 */
export function normalizeReservationCode(input) {
  if (!input) return ''
  return input.replace(/\s/g, '').toUpperCase().slice(0, 4)
}
