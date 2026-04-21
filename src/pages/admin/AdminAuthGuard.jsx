import { Navigate, Outlet } from 'react-router-dom'

const AUTH_KEY = 'maywood_admin_auth'

export default function AdminAuthGuard() {
  if (sessionStorage.getItem(AUTH_KEY) !== 'true') {
    return <Navigate to="/admin/login" replace />
  }
  return <Outlet />
}
