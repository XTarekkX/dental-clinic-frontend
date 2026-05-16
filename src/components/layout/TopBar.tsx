import { Menu, Bell, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { navigationItems } from './navigation'

interface TopBarProps {
  onOpenMobileMenu: () => void
}

export function TopBar({ onOpenMobileMenu }: TopBarProps) {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)

  const currentItem = navigationItems.find(
    (item) => item.path === location.pathname,
  )

  const pageTitle = currentItem?.label ?? 'Dashboard'

  return (
    <header className="sticky top-0 z-30 border-b border-emerald-100 bg-white/85 backdrop-blur">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-slate-700 shadow-sm transition hover:bg-emerald-50 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              {pageTitle}
            </h1>
            <p className="mt-1 hidden text-sm text-slate-500 sm:block">
              Welcome back, Dr. {user?.firstName ?? 'Doctor'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-slate-500 shadow-sm md:flex">
            <Search className="h-4 w-4" />
            <span className="text-sm">Clinic workspace</span>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-slate-600 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Bell className="h-5 w-5" />
          </button>

          <div className="hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 px-4 py-2 text-white shadow-sm sm:block">
            <p className="text-sm font-semibold">
              Dr. {user?.firstName ?? 'Doctor'}
            </p>
            <p className="text-xs text-emerald-50">{user?.role ?? 'DOCTOR'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}