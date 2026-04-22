/** Basic email format check (not full RFC). */
export function isValidEmail(s) {
  return /^\S+@\S+\.\S+$/.test(String(s).trim())
}
