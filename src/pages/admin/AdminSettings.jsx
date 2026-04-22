import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { buttonClasses } from '../../lib/buttonStyles'
import { clearAllCapturedLeads, exportToCSV, getAllLeads } from '../../utils/adminDataStore'
import {
  ADMIN_INSTALL_DATE_KEY,
  DEFAULT_SOURCE_LABELS,
  ensureAdminInstallDate,
  getAdminInstallDateIso,
  getExpectedAdminPassword,
  getLocalStorageSizeKb,
  getNotifyPreference,
  getSoundPreference,
  getSourceLabels,
  saveSourceLabels,
  setAdminPassword,
  setNotifyPreference,
  setSoundPreference,
} from '../../utils/adminSettingsStore'

const SITE_NAME = 'Maywood Interiors'
const LIVE_URL = 'https://www.maywood.in'

const AUTH_KEY = 'maywood_admin_auth'

const SOURCE_KEYS = Object.keys(DEFAULT_SOURCE_LABELS)

const inputClass =
  'w-full rounded-sm border border-brand-brass-pale/50 bg-white px-3 py-2.5 font-body text-[14px] text-brand-charcoal outline-none focus:border-brand-brass focus:ring-2 focus:ring-brand-brass/20'

const labelClass = 'mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-mist'

export default function AdminSettings() {
  const navigate = useNavigate()
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwMsg, setPwMsg] = useState(null)
  const [permHint, setPermHint] = useState(null)
  const [notifyOn, setNotifyOn] = useState(() => getNotifyPreference())
  const [soundOn, setSoundOn] = useState(() => getSoundPreference())
  const [labels, setLabels] = useState(() => getSourceLabels())
  const [labelMsg, setLabelMsg] = useState(null)
  const [clearInput, setClearInput] = useState('')
  const [storageKb, setStorageKb] = useState(() => getLocalStorageSizeKb())

  useEffect(() => {
    const t = setInterval(() => setStorageKb(getLocalStorageSizeKb()), 2000)
    return () => clearInterval(t)
  }, [])

  const installDateDisplay = useMemo(() => {
    ensureAdminInstallDate()
    const iso = getAdminInstallDateIso()
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  }, [])

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    setPwMsg(null)
    if (currentPw !== getExpectedAdminPassword()) {
      setPwMsg({ type: 'err', text: 'Current password is incorrect.' })
      return
    }
    if (newPw.length < 6) {
      setPwMsg({ type: 'err', text: 'New password must be at least 6 characters.' })
      return
    }
    if (newPw !== confirmPw) {
      setPwMsg({ type: 'err', text: 'New password and confirmation do not match.' })
      return
    }
    setAdminPassword(newPw)
    setCurrentPw('')
    setNewPw('')
    setConfirmPw('')
    setPwMsg({ type: 'ok', text: 'Password updated.' })
  }

  const handleNotifyToggle = async () => {
    setPermHint(null)
    const next = !notifyOn
    if (next && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      const p = await Notification.requestPermission()
      if (p !== 'granted') {
        setPermHint('Browser notifications were blocked. Enable them in your browser settings.')
        return
      }
    }
    setNotifyOn(next)
    setNotifyPreference(next)
  }

  const handleSoundToggle = () => {
    const next = !soundOn
    setSoundOn(next)
    setSoundPreference(next)
  }

  const handleSaveLabels = (e) => {
    e.preventDefault()
    setLabelMsg(null)
    const trimmed = {}
    for (const k of SOURCE_KEYS) {
      const v = (labels[k] || '').trim()
      trimmed[k] = v || DEFAULT_SOURCE_LABELS[k]
    }
    saveSourceLabels(trimmed)
    setLabels(getSourceLabels())
    setLabelMsg('Labels saved.')
  }

  const handleExportAll = async () => {
    const rows = await getAllLeads()
    exportToCSV(rows, `maywood-all-leads-${Date.now()}.csv`)
  }

  const handleClearAll = async () => {
    if (clearInput.trim().toUpperCase() !== 'DELETE') return
    try {
      await clearAllCapturedLeads()
    } catch {
      /* ignore */
    }
    sessionStorage.removeItem(AUTH_KEY)
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="font-display text-[26px] font-light text-brand-charcoal lg:text-[28px]">Settings</h1>
        <p className="mt-1 font-body text-[14px] text-brand-mist">Credentials, notifications, data, and display labels</p>
      </div>

      <section className="rounded-lg border border-brand-brass-pale/35 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-light text-brand-charcoal">Admin credentials</h2>
        <p className="mt-1 font-body text-[13px] text-brand-mist">Change the password used to sign in to this dashboard.</p>
        <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
          <div>
            <label className={labelClass} htmlFor="cur-pw">
              Current password
            </label>
            <input
              id="cur-pw"
              type="password"
              autoComplete="current-password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="new-pw">
              New password
            </label>
            <input
              id="new-pw"
              type="password"
              autoComplete="new-password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className={inputClass}
              required
              minLength={6}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="conf-pw">
              Confirm new password
            </label>
            <input
              id="conf-pw"
              type="password"
              autoComplete="new-password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className={inputClass}
              required
              minLength={6}
            />
          </div>
          {pwMsg ? (
            <p className={`font-body text-[13px] ${pwMsg.type === 'ok' ? 'text-green-700' : 'text-red-600'}`}>
              {pwMsg.text}
            </p>
          ) : null}
          <button type="submit" className={buttonClasses('primary', 'py-2.5 text-[11px] uppercase tracking-[0.12em]')}>
            UPDATE PASSWORD
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-brand-brass-pale/35 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-light text-brand-charcoal">Notification preferences</h2>
        <div className="mt-6 space-y-4">
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-sm border border-brand-brass-pale/40 px-4 py-3">
            <span className="font-body text-[14px] text-brand-charcoal">
              Show browser notification when a new lead comes in
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={notifyOn}
              onClick={handleNotifyToggle}
              className={[
                'relative h-7 w-12 shrink-0 rounded-full transition-colors',
                notifyOn ? 'bg-brand-brass' : 'bg-brand-mist/30',
              ].join(' ')}
            >
              <span
                className={[
                  'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
                  notifyOn ? 'translate-x-5' : 'translate-x-0.5',
                ].join(' ')}
              />
            </button>
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-sm border border-brand-brass-pale/40 px-4 py-3">
            <span className="font-body text-[14px] text-brand-charcoal">Play a sound on new lead submission</span>
            <button
              type="button"
              role="switch"
              aria-checked={soundOn}
              onClick={handleSoundToggle}
              className={[
                'relative h-7 w-12 shrink-0 rounded-full transition-colors',
                soundOn ? 'bg-brand-brass' : 'bg-brand-mist/30',
              ].join(' ')}
            >
              <span
                className={[
                  'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
                  soundOn ? 'translate-x-5' : 'translate-x-0.5',
                ].join(' ')}
              />
            </button>
          </label>
          <p className="font-body text-[12px] text-brand-mist">
            Keep this admin tab open to detect new leads. Notifications require permission from your browser.
          </p>
          {permHint ? <p className="font-body text-[13px] text-red-600">{permHint}</p> : null}
        </div>
      </section>

      <section className="rounded-lg border border-red-200/80 bg-red-50/40 p-6 shadow-sm">
        <h2 className="font-display text-lg font-light text-red-900">Data management</h2>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={handleExportAll}
            className={buttonClasses('primary', 'py-2.5 text-[11px] uppercase tracking-[0.1em]')}
          >
            Export all leads as CSV
          </button>
        </div>
        <div className="mt-8 border-t border-red-200/60 pt-6">
          <p className="font-body text-[14px] font-medium text-red-900">Clear all data</p>
          <p className="mt-2 font-body text-[13px] leading-relaxed text-red-800/90">
            This cannot be undone. All lead rows in Supabase (quotes, consultations, calculator leads, and partner
            applications) will be permanently deleted and you will be signed out. Admin preferences stored in this
            browser are kept. Type <span className="font-semibold">DELETE</span> to enable the button.
          </p>
          <input
            type="text"
            value={clearInput}
            onChange={(e) => setClearInput(e.target.value)}
            placeholder="Type DELETE"
            className="mt-4 w-full max-w-xs rounded-sm border border-red-300 bg-white px-3 py-2 font-body text-[14px] text-brand-charcoal"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={handleClearAll}
            disabled={clearInput.trim().toUpperCase() !== 'DELETE'}
            className={[
              'mt-4 rounded-sm px-5 py-2.5 font-body text-[12px] font-semibold uppercase tracking-[0.1em]',
              clearInput.trim().toUpperCase() === 'DELETE'
                ? 'bg-red-700 text-white hover:bg-red-800'
                : 'cursor-not-allowed bg-red-200 text-red-400',
            ].join(' ')}
          >
            Clear all data
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-brand-brass-pale/35 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-light text-brand-charcoal">Website info</h2>
        <dl className="mt-4 space-y-3 font-body text-[14px]">
          <div className="flex justify-between gap-4 border-b border-brand-brass-pale/25 pb-3">
            <dt className="text-brand-mist">Site name</dt>
            <dd className="text-right font-medium text-brand-charcoal">{SITE_NAME}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-brand-brass-pale/25 pb-3">
            <dt className="text-brand-mist">Live URL</dt>
            <dd className="text-right">
              <a href={LIVE_URL} className="text-brand-brass underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">
                {LIVE_URL}
              </a>
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-brand-brass-pale/25 pb-3">
            <dt className="text-brand-mist">Admin created</dt>
            <dd className="text-right text-brand-charcoal">{installDateDisplay}</dd>
          </div>
          <div className="flex justify-between gap-4 pt-1">
            <dt className="text-brand-mist">Total data size (localStorage)</dt>
            <dd className="tabular-nums text-brand-charcoal">{storageKb} KB</dd>
          </div>
        </dl>
        <p className="mt-3 font-body text-[11px] text-brand-mist">
          Install date is stored as <code className="rounded bg-brand-ivory-deep px-1">{ADMIN_INSTALL_DATE_KEY}</code> after
          first visit.
        </p>
      </section>

      <section className="rounded-lg border border-brand-brass-pale/35 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-light text-brand-charcoal">Form source labels</h2>
        <p className="mt-1 font-body text-[13px] text-brand-mist">
          Rename how each source appears on the dashboard and analytics tables.
        </p>
        <form onSubmit={handleSaveLabels} className="mt-6 space-y-4">
          {SOURCE_KEYS.map((key) => (
            <div key={key}>
              <label className={labelClass} htmlFor={`label-${key}`}>
                {key}
              </label>
              <input
                id={`label-${key}`}
                type="text"
                value={labels[key] ?? ''}
                onChange={(e) => setLabels((prev) => ({ ...prev, [key]: e.target.value }))}
                className={inputClass}
              />
            </div>
          ))}
          {labelMsg ? <p className="font-body text-[13px] text-green-700">{labelMsg}</p> : null}
          <button type="submit" className={buttonClasses('primary', 'py-2.5 text-[11px]')}>
            Save labels
          </button>
        </form>
      </section>
    </div>
  )
}
