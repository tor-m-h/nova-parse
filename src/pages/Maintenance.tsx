import { useState } from 'react'
import { Wrench, Package, Boxes, Truck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

type Tab = 'components' | 'jobs' | 'spareparts' | 'suppliers'

const tabs = [
  { id: 'components' as Tab, label: 'Utstyr', icon: Package },
  { id: 'jobs' as Tab, label: 'Jobber', icon: Wrench },
  { id: 'spareparts' as Tab, label: 'Reservedeler', icon: Boxes },
  { id: 'suppliers' as Tab, label: 'Leverandører', icon: Truck },
]

export function Maintenance() {
  const [activeTab, setActiveTab] = useState<Tab>('components')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Vedlikehold
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Administrer utstyr, jobber, reservedeler og leverandører
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-cyan-500/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-sky-500 text-sky-600 dark:text-cyan-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <Card>
        <CardContent>
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {activeTab === 'components' && (
              <>
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Ingen komponenter ennå</p>
                <p className="text-sm mt-1">
                  Komponenter ekstraheres automatisk fra manualer
                </p>
              </>
            )}
            {activeTab === 'jobs' && (
              <>
                <Wrench className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Ingen vedlikeholdsjobber ennå</p>
                <p className="text-sm mt-1">
                  Jobber ekstraheres automatisk fra manualer
                </p>
              </>
            )}
            {activeTab === 'spareparts' && (
              <>
                <Boxes className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Ingen reservedeler ennå</p>
                <p className="text-sm mt-1">
                  Reservedeler identifiseres fra komponenter
                </p>
              </>
            )}
            {activeTab === 'suppliers' && (
              <>
                <Truck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Ingen leverandører ennå</p>
                <p className="text-sm mt-1">
                  Leverandører synces fra komponenter
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
