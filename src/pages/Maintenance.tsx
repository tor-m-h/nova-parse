import { useState } from 'react'
import { Wrench, Package, Boxes, Truck, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { useJobs, useComponents } from '@/hooks/useData'

type Tab = 'components' | 'jobs' | 'spareparts' | 'suppliers'

const tabs = [
  { id: 'components' as Tab, label: 'Utstyr', icon: Package },
  { id: 'jobs' as Tab, label: 'Jobber', icon: Wrench },
  { id: 'spareparts' as Tab, label: 'Reservedeler', icon: Boxes },
  { id: 'suppliers' as Tab, label: 'Leverandører', icon: Truck },
]

const jobTypeLabels: Record<string, string> = {
  preventive: 'Preventivt',
  corrective: 'Korrigerende',
  initial_setup: 'Oppsett',
  on_demand: 'På forespørsel',
}

const componentTypeLabels: Record<string, string> = {
  komponent: 'Komponent',
  reservedel: 'Reservedel',
  utstyr: 'Utstyr',
}

export function Maintenance() {
  const [activeTab, setActiveTab] = useState<Tab>('components')
  const { data: jobs, isLoading: jobsLoading } = useJobs()
  const { data: components, isLoading: componentsLoading } = useComponents()

  const spareParts = components?.filter(c => c.type === 'reservedel') || []

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
            {tab.id === 'jobs' && jobs && jobs.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-sky-100 text-sky-700 dark:bg-cyan-500/20 dark:text-cyan-400">
                {jobs.length}
              </span>
            )}
            {tab.id === 'components' && components && components.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-sky-100 text-sky-700 dark:bg-cyan-500/20 dark:text-cyan-400">
                {components.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <Card>
        <CardContent>
          {/* Components Tab */}
          {activeTab === 'components' && (
            componentsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
              </div>
            ) : components && components.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-cyan-500/20">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Tittel</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">SFI-kode</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Produsent</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {components.map((comp) => (
                      <tr key={comp.id} className="border-b border-gray-100 dark:border-cyan-500/10 hover:bg-gray-50 dark:hover:bg-cyan-500/5">
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900 dark:text-white">{comp.tittel}</p>
                          {comp.modell_navn && <p className="text-sm text-gray-500">{comp.modell_navn}</p>}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                          {componentTypeLabels[comp.type] || comp.type}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                          {comp.sfi_kode || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                          {comp.produsent || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            {comp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Ingen komponenter ennå</p>
                <p className="text-sm mt-1">Komponenter ekstraheres automatisk fra manualer</p>
              </div>
            )
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            jobsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
              </div>
            ) : jobs && jobs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-cyan-500/20">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Tittel</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Intervall</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Beskrivelse</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id} className="border-b border-gray-100 dark:border-cyan-500/10 hover:bg-gray-50 dark:hover:bg-cyan-500/5">
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900 dark:text-white">{job.tittel}</p>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                          {jobTypeLabels[job.type] || job.type}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                          {job.intervall_dager ? `${job.intervall_dager} dager` :
                           job.intervall_driftstimer ? `${job.intervall_driftstimer} timer` : '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                          {job.beskrivelse || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            {job.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Wrench className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Ingen vedlikeholdsjobber ennå</p>
                <p className="text-sm mt-1">Jobber ekstraheres automatisk fra manualer</p>
              </div>
            )
          )}

          {/* Spare Parts Tab */}
          {activeTab === 'spareparts' && (
            componentsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
              </div>
            ) : spareParts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-cyan-500/20">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Tittel</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Produsent</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Modell</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spareParts.map((part) => (
                      <tr key={part.id} className="border-b border-gray-100 dark:border-cyan-500/10 hover:bg-gray-50 dark:hover:bg-cyan-500/5">
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{part.tittel}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{part.produsent || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{part.modell_navn || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Boxes className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Ingen reservedeler ennå</p>
                <p className="text-sm mt-1">Reservedeler identifiseres fra komponenter</p>
              </div>
            )
          )}

          {/* Suppliers Tab */}
          {activeTab === 'suppliers' && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Truck className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Ingen leverandører ennå</p>
              <p className="text-sm mt-1">Leverandører synces fra komponenter</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
