import { useState } from 'react'
import { X, Check, Wrench, Package, Award, PenTool } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { Manual, AnalysisResults } from '@/types/database'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  manual: Manual | null
  onApprove: (
    selectedJobs: number[],
    selectedComponents: number[],
    selectedCertificates: number[],
    selectedDrawings: number[]
  ) => Promise<void>
  isApproving: boolean
}

type Tab = 'jobs' | 'components' | 'certificates' | 'drawings'

export function ReviewModal({
  isOpen,
  onClose,
  manual,
  onApprove,
  isApproving
}: ReviewModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('jobs')
  const [selectedJobs, setSelectedJobs] = useState<number[]>([])
  const [selectedComponents, setSelectedComponents] = useState<number[]>([])
  const [selectedCertificates, setSelectedCertificates] = useState<number[]>([])
  const [selectedDrawings, setSelectedDrawings] = useState<number[]>([])

  if (!isOpen || !manual) return null

  const results = manual.pending_analysis_results as AnalysisResults | null

  if (!results) {
    return null
  }

  const tabs = [
    { id: 'jobs' as Tab, label: 'Jobber', icon: Wrench, count: results.jobs?.length || 0 },
    { id: 'components' as Tab, label: 'Komponenter', icon: Package, count: results.components?.length || 0 },
    { id: 'certificates' as Tab, label: 'Sertifikater', icon: Award, count: results.certificates?.length || 0 },
    { id: 'drawings' as Tab, label: 'Tegninger', icon: PenTool, count: results.drawings?.length || 0 },
  ]

  const toggleSelection = (
    index: number,
    selected: number[],
    setSelected: (val: number[]) => void
  ) => {
    if (selected.includes(index)) {
      setSelected(selected.filter(i => i !== index))
    } else {
      setSelected([...selected, index])
    }
  }

  const selectAll = (items: unknown[] | undefined, setSelected: (val: number[]) => void) => {
    if (!items) return
    setSelected(items.map((_, i) => i))
  }

  const handleApprove = async () => {
    await onApprove(selectedJobs, selectedComponents, selectedCertificates, selectedDrawings)
    onClose()
  }

  const totalSelected = selectedJobs.length + selectedComponents.length +
    selectedCertificates.length + selectedDrawings.length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-cyan-500/20 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-cyan-500/20">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Gjennomgå analyseresultater
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {manual.tittel}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-cyan-500/20 px-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                activeTab === tab.id
                  ? 'border-sky-500 text-sky-600 dark:text-cyan-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'jobs' && (
            <ItemList
              items={results.jobs}
              selected={selectedJobs}
              onToggle={(i) => toggleSelection(i, selectedJobs, setSelectedJobs)}
              onSelectAll={() => selectAll(results.jobs, setSelectedJobs)}
              renderItem={(job) => (
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{job.tittel}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Type: {job.type} | Intervall: {job.intervall_dager ? `${job.intervall_dager} dager` : job.intervall_driftstimer ? `${job.intervall_driftstimer} timer` : 'Ikke spesifisert'}
                  </p>
                  {job.beskrivelse && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{job.beskrivelse}</p>
                  )}
                </div>
              )}
            />
          )}

          {activeTab === 'components' && (
            <ItemList
              items={results.components}
              selected={selectedComponents}
              onToggle={(i) => toggleSelection(i, selectedComponents, setSelectedComponents)}
              onSelectAll={() => selectAll(results.components, setSelectedComponents)}
              renderItem={(comp) => (
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{comp.tittel}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Type: {comp.type} {comp.sfi_kode && `| SFI: ${comp.sfi_kode}`} {comp.produsent && `| ${comp.produsent}`}
                  </p>
                </div>
              )}
            />
          )}

          {activeTab === 'certificates' && (
            <ItemList
              items={results.certificates}
              selected={selectedCertificates}
              onToggle={(i) => toggleSelection(i, selectedCertificates, setSelectedCertificates)}
              onSelectAll={() => selectAll(results.certificates, setSelectedCertificates)}
              renderItem={(cert) => (
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{cert.tittel}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {cert.type && `Type: ${cert.type}`} {cert.utsteder && `| Utsteder: ${cert.utsteder}`} {cert.utlops_dato && `| Utløper: ${cert.utlops_dato}`}
                  </p>
                </div>
              )}
            />
          )}

          {activeTab === 'drawings' && (
            <ItemList
              items={results.drawings}
              selected={selectedDrawings}
              onToggle={(i) => toggleSelection(i, selectedDrawings, setSelectedDrawings)}
              onSelectAll={() => selectAll(results.drawings, setSelectedDrawings)}
              renderItem={(drawing) => (
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{drawing.tittel}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {drawing.tegning_nummer && `Nr: ${drawing.tegning_nummer}`} {drawing.revisjon && `| Rev: ${drawing.revisjon}`}
                  </p>
                </div>
              )}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-cyan-500/20">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {totalSelected} elementer valgt
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button onClick={handleApprove} isLoading={isApproving}>
              <Check className="h-4 w-4 mr-2" />
              Godkjenn valgte
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ItemListProps<T> {
  items: T[] | undefined
  selected: number[]
  onToggle: (index: number) => void
  onSelectAll: () => void
  renderItem: (item: T) => React.ReactNode
}

function ItemList<T>({ items, selected, onToggle, onSelectAll, renderItem }: ItemListProps<T>) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Ingen elementer funnet
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end mb-2">
        <Button variant="ghost" size="sm" onClick={onSelectAll}>
          Velg alle
        </Button>
      </div>
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => onToggle(index)}
          className={cn(
            'p-3 rounded-lg border cursor-pointer transition-all',
            selected.includes(index)
              ? 'border-sky-500 bg-sky-50 dark:bg-sky-500/10 dark:border-cyan-500'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          )}
        >
          <div className="flex items-start gap-3">
            <div className={cn(
              'mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0',
              selected.includes(index)
                ? 'bg-sky-500 border-sky-500'
                : 'border-gray-300 dark:border-gray-600'
            )}>
              {selected.includes(index) && <Check className="h-3 w-3 text-white" />}
            </div>
            <div className="flex-1">{renderItem(item)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
