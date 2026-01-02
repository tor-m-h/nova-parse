import { useState } from 'react'
import { Moon, Sun, Settings, HelpCircle, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface HeaderProps {
  isDarkMode: boolean
  onToggleTheme: () => void
  selectedFartoy: string | null
  onLogout: () => void
  userName?: string
}

export function Header({
  isDarkMode,
  onToggleTheme,
  selectedFartoy,
  onLogout,
  userName,
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header
      className={cn(
        'h-16 px-6 flex items-center justify-between',
        'bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl',
        'border-b border-gray-200 dark:border-cyan-500/20'
      )}
    >
      {/* Left side - Fartøy selector */}
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">Fartøy: </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {selectedFartoy || 'Ikke valgt'}
          </span>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button variant="ghost" size="sm" onClick={onToggleTheme}>
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Help */}
        <Button variant="ghost" size="sm">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="sm">
          <Settings className="h-5 w-5" />
        </Button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
              'hover:bg-gray-100 dark:hover:bg-cyan-500/10'
            )}
          >
            <div className="h-8 w-8 rounded-full bg-sky-500 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            {userName && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {userName}
              </span>
            )}
          </button>

          {showUserMenu && (
            <div
              className={cn(
                'absolute right-0 top-full mt-2 w-48 py-2 rounded-lg shadow-lg z-50',
                'bg-white dark:bg-gray-800 border border-gray-200 dark:border-cyan-500/20'
              )}
            >
              <button
                onClick={() => {
                  setShowUserMenu(false)
                  onLogout()
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-4 py-2 text-sm text-left',
                  'text-gray-700 dark:text-gray-300',
                  'hover:bg-gray-100 dark:hover:bg-cyan-500/10'
                )}
              >
                <LogOut className="h-4 w-4" />
                Logg ut
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
