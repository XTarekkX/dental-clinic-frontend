import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { APP_ROUTES } from '../../utils/constants'

export function PrivateRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.login} replace />
  }

  return <Outlet />
}