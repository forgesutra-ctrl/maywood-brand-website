/** Admin password (plain, internal tool). Default used when unset. */
export const ADMIN_PASSWORD_KEY = 'maywood_admin_password_v1'
const DEFAULT_PASSWORD = 'Maywood@2026'

export function getExpectedAdminPassword() {
  try {
    const p = localStorage.getItem(ADMIN_PASSWORD_KEY)
    return p != null && p !== '' ? p : DEFAULT_PASSWORD
  } catch {
    return DEFAULT_PASSWORD
  }
}

export function setAdminPassword(password) {
  localStorage.setItem(ADMIN_PASSWORD_KEY, password)
  dispatchSettingsChanged()
}

export const ADMIN_INSTALL_DATE_KEY = 'maywood_admin_install_date_v1'

export function ensureAdminInstallDate() {
  try {
    if (!localStorage.getItem(ADMIN_INSTALL_DATE_KEY)) {
      localStorage.setItem(ADMIN_INSTALL_DATE_KEY, new Date().toISOString())
    }
  } catch {
    /* ignore */
  }
}

export function getAdminInstallDateIso() {
  ensureAdminInstallDate()
  return localStorage.getItem(ADMIN_INSTALL_DATE_KEY) || new Date().toISOString()
}

export const ADMIN_PREF_NOTIFY_KEY = 'maywood_admin_pref_notify_v1'
export const ADMIN_PREF_SOUND_KEY = 'maywood_admin_pref_sound_v1'

export function getNotifyPreference() {
  return localStorage.getItem(ADMIN_PREF_NOTIFY_KEY) === '1'
}

export function setNotifyPreference(on) {
  localStorage.setItem(ADMIN_PREF_NOTIFY_KEY, on ? '1' : '0')
}

export function getSoundPreference() {
  return localStorage.getItem(ADMIN_PREF_SOUND_KEY) === '1'
}

export function setSoundPreference(on) {
  localStorage.setItem(ADMIN_PREF_SOUND_KEY, on ? '1' : '0')
}

export const ADMIN_SOURCE_LABELS_KEY = 'maywood_admin_source_labels_v1'

export const DEFAULT_SOURCE_LABELS = {
  'instant-quote': 'Instant Quote',
  'finance-calculator': 'Finance Calculator',
  'homepage-calculator': 'Homepage Calculator',
  'consultation-modal': 'Consultation Modal',
  'partner-form': 'Partner Form',
}

export function getSourceLabels() {
  try {
    const raw = localStorage.getItem(ADMIN_SOURCE_LABELS_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return { ...DEFAULT_SOURCE_LABELS, ...(typeof parsed === 'object' && parsed ? parsed : {}) }
  } catch {
    return { ...DEFAULT_SOURCE_LABELS }
  }
}

export function saveSourceLabels(labels) {
  localStorage.setItem(ADMIN_SOURCE_LABELS_KEY, JSON.stringify(labels))
  dispatchSettingsChanged()
}

export function getSourceLabel(key) {
  const m = getSourceLabels()
  return m[key] || key
}

export function dispatchSettingsChanged() {
  window.dispatchEvent(new Event('maywood-admin-settings-changed'))
}

export function playNotificationBeep() {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(880, ctx.currentTime)
    g.gain.setValueAtTime(0.06, ctx.currentTime)
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + 0.14)
  } catch {
    /* ignore */
  }
}

/** Rough size of all localStorage (UTF-16-ish) in KB */
export function getLocalStorageSizeKb() {
  try {
    let total = 0
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (!k) continue
      const v = localStorage.getItem(k) || ''
      total += k.length + v.length
    }
    return Math.round(((total * 2) / 1024) * 10) / 10
  } catch {
    return 0
  }
}
