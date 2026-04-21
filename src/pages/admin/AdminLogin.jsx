import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import BrandLogo from '../../components/ui/BrandLogo'
import { buttonClasses } from '../../lib/buttonStyles'
import { getExpectedAdminPassword } from '../../utils/adminSettingsStore'

const AUTH_KEY = 'maywood_admin_auth'

const inputClass =
  'w-full border-0 border-b border-brand-brass/30 bg-transparent py-3 font-body text-[15px] text-brand-ivory outline-none transition-colors placeholder:text-brand-mist/50 focus:border-brand-brass'

const labelClass = 'mb-2 block font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-brass'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (sessionStorage.getItem(AUTH_KEY) === 'true') {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (username.trim() === 'maywood_admin' && password === getExpectedAdminPassword()) {
      sessionStorage.setItem(AUTH_KEY, 'true')
      navigate('/admin/dashboard', { replace: true })
    } else {
      setError('Invalid username or password.')
    }
  }

  if (sessionStorage.getItem(AUTH_KEY) === 'true') {
    return <Navigate to="/admin/dashboard" replace />
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-brand-charcoal px-6 py-16">
      <a
        href="https://maywood.in"
        className="absolute left-6 top-8 font-body text-[13px] uppercase tracking-[0.12em] text-[rgba(184,150,90,0.7)] transition-colors duration-200 hover:text-[#B8965A]"
      >
        ← Back to Website
      </a>
      <div className="w-full max-w-[400px]">
        <div className="flex justify-center">
          <BrandLogo to={null} variant="navbar" className="[&_img]:brightness-0 [&_img]:invert" />
        </div>
        <h1 className="mt-10 text-center font-display text-[22px] font-light text-brand-ivory">Admin sign in</h1>
        <p className="mt-2 text-center font-body text-[13px] text-brand-mist">Maywood Interiors internal dashboard</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <div>
            <label className={labelClass} htmlFor="admin-user">
              Username
            </label>
            <input
              id="admin-user"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="admin-pass">
              Password
            </label>
            <input
              id="admin-pass"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          {error ? <p className="font-body text-[13px] text-red-400">{error}</p> : null}
          <button type="submit" className={['w-full', buttonClasses('primary')].join(' ')}>
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  )
}
