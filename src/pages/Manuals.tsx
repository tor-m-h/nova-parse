import { useState } from 'react'
import { FileText, Upload, Trash2, Loader2, Sparkles, Eye } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { UploadModal } from '@/components/modals/UploadModal'
import { ReviewModal } from '@/components/modals/ReviewModal'
import { useManuals, useUploadManual, useDeleteManual } from '@/hooks/useManuals'
import { useAnalyzeManual, useApproveAnalysis } from '@/hooks/useAnalysis'
import { useFartoy } from '@/hooks/useFartoy'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Manual, ManualStatus } from '@/types/database'

const statusLabels: Record<ManualStatus, string> = {
  lastet_opp: 'Lastet opp',
  analyserer: 'Analyserer...',
  avventer_godkjenning: 'Venter godkjenning',
  ferdig_analysert: 'Ferdig',
  feil: 'Feil',
}

const statusColors: Record<ManualStatus, string> = {
  lastet_opp: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  analyserer: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  avventer_godkjenning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  ferdig_analysert: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  feil: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export function Manuals() {
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [reviewManual, setReviewManual] = useState<Manual | null>(null)
  const { data: fartoyList } = useFartoy()
  const { data: manuals, isLoading } = useManuals()
  const uploadManual = useUploadManual()
  const deleteManual = useDeleteManual()
  const analyzeManual = useAnalyzeManual()
  const approveAnalysis = useApproveAnalysis()

  const handleUpload = async (file: File, tittel: string) => {
    const fartoyId = fartoyList?.[0]?.id
    if (!fartoyId) {
      alert('Ingen fartøy tilgjengelig. Kontakt administrator.')
      return
    }
    await uploadManual.mutateAsync({ file, fartoyId, tittel })
  }

  const handleDelete = async (id: string) => {
    if (confirm('Er du sikker på at du vil slette denne manualen?')) {
      await deleteManual.mutateAsync(id)
    }
  }

  const handleAnalyze = async (manual: Manual) => {
    try {
      await analyzeManual.mutateAsync(manual)
    } catch (error) {
      alert(`Analyse feilet: ${error instanceof Error ? error.message : 'Ukjent feil'}`)
    }
  }

  const handleApprove = async (
    selectedJobs: number[],
    selectedComponents: number[],
    selectedCertificates: number[],
    selectedDrawings: number[]
  ) => {
    if (!reviewManual) return
    await approveAnalysis.mutateAsync({
      manual: reviewManual,
      selectedJobs,
      selectedComponents,
      selectedCertificates,
      selectedDrawings,
    })
    setReviewManual(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manualer
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Administrer dine vedlikeholdsmanualer
          </p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Last opp
        </Button>
      </div>

      {/* Manuals table */}
      <Card>
        <CardHeader>
          <CardTitle>Alle manualer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-cyan-500/20">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tittel
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Filtype
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Jobber
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Komponenter
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Dato
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12">
                      <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                      </div>
                    </td>
                  </tr>
                ) : manuals && manuals.length > 0 ? (
                  manuals.map((manual) => (
                    <tr
                      key={manual.id}
                      className="border-b border-gray-100 dark:border-cyan-500/10 hover:bg-gray-50 dark:hover:bg-cyan-500/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {manual.tittel}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {manual.filnavn}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            statusColors[manual.status]
                          )}
                        >
                          {manual.status === 'analyserer' && (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          )}
                          {statusLabels[manual.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 uppercase">
                        {manual.filtype}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                        {manual.antall_jobber}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                        {manual.antall_komponenter}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(manual.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* Analyze button - only show for uploaded files */}
                          {manual.status === 'lastet_opp' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAnalyze(manual)}
                              disabled={analyzeManual.isPending}
                              className="text-sky-500 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-500/10"
                            >
                              <Sparkles className="h-4 w-4" />
                            </Button>
                          )}

                          {/* Review button - only show for pending approval */}
                          {manual.status === 'avventer_godkjenning' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setReviewManual(manual)}
                              className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-500/10"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}

                          {/* Delete button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(manual.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Ingen manualer lastet opp ennå</p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setIsUploadOpen(true)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Last opp din første manual
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
        isUploading={uploadManual.isPending}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={!!reviewManual}
        onClose={() => setReviewManual(null)}
        manual={reviewManual}
        onApprove={handleApprove}
        isApproving={approveAnalysis.isPending}
      />
    </div>
  )
}
