import { LogOut, X, Stethoscope } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { logout } from '../../api/auth.api'
import { useAuthStore } from '../../store/authStore'
import { APP_ROUTES } from '../../utils/constants'
import { navigationItems } from './navigation'

interface SidebarProps {
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const fullName = user
    ? `Dr. ${user.firstName} ${user.lastName}`
    : 'Doctor'

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // ignore logout API failure and clear local auth anyway
    } finally {
      clearAuth()
      toast.success('Logged out successfully')
      navigate(APP_ROUTES.login, { replace: true })
    }
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
        />
      )}

      <aside
        className={[
          'fixed left-0 top-0 z-50 flex h-screen w-[290px] flex-col border-r border-emerald-100 bg-white/95 backdrop-blur transition-transform duration-300 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex items-center justify-between border-b border-emerald-100 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900">
                Tarek&apos;s Clinic
              </p>
              <p className="text-xs text-slate-500">
                Dental Management System
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <nav className="space-y-2">
            {navigationItems
              .filter((item) => {
                if (!item.roles) return true
                return user ? item.roles.includes(user.role) : false
              })
              .map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    [
                      'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={[
                          'h-5 w-5 transition',
                          isActive
                            ? 'text-white'
                            : 'text-slate-500 group-hover:text-emerald-600',
                        ].join(' ')}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="border-t border-emerald-100 p-4">
          <div className="mb-4 rounded-2xl bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{fullName}</p>
            <p className="text-xs uppercase tracking-wide text-emerald-700">
              {user?.role ?? 'DOCTOR'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
