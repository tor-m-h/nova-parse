import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Wrench,
  Award,
  PenTool,
  ChevronLeft,
  ChevronRight,
  Ship,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/manuals', icon: FileText, label: 'Manualer' },
  { to: '/maintenance', icon: Wrench, label: 'Vedlikehold' },
  { to: '/certificates', icon: Award, label: 'Sertifikater' },
  { to: '/drawings', icon: PenTool, label: 'Tegninger' },
]

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen z-40 transition-all duration-300',
        'bg-white dark:bg-gray-900/80 dark:backdrop-blur-xl',
        'border-r border-gray-200 dark:border-cyan-500/20',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-cyan-500/20">
        <Ship className="h-8 w-8 text-sky-500 flex-shrink-0" />
        {!isCollapsed && (
          <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
            Nova Parse
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center px-3 py-2.5 rounded-lg transition-all duration-200',
                'hover:bg-gray-100 dark:hover:bg-cyan-500/10',
                isActive
                  ? 'bg-sky-50 text-sky-600 dark:bg-cyan-500/20 dark:text-cyan-400'
                  : 'text-gray-700 dark:text-gray-300'
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={cn(
          'absolute -right-3 top-20 p-1.5 rounded-full',
          'bg-white dark:bg-gray-800 border border-gray-200 dark:border-cyan-500/30',
          'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white',
          'shadow-sm transition-colors'
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Footer with Nova Safe logo placeholder */}
      <div className="p-4 border-t border-gray-200 dark:border-cyan-500/20">
        {!isCollapsed && (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Powered by Nova Safe
          </p>
        )}
      </div>
    </aside>
  )
}
