import { PenTool, Upload, Loader2, Eye } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useDrawings } from '@/hooks/useData'
import { cn } from '@/lib/utils'

const statusLabels: Record<string, string> = {
  ukontrollert: 'Ukontrollert',
  verifisert: 'Verifisert',
  avvist: 'Avvist',
}

const statusColors: Record<string, string> = {
  ukontrollert: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400',
  verifisert: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400',
  avvist: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400',
}

export function Drawings() {
  const { data: drawings, isLoading } = useDrawings()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tegninger
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Administrer tekniske tegninger
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Legg til
        </Button>
      </div>

      {/* Drawings table */}
      <Card>
        <CardHeader>
          <CardTitle>Alle tegninger ({drawings?.length || 0})</CardTitle>
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
                    Tegningsnummer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Revisjon
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12">
                      <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                      </div>
                    </td>
                  </tr>
                ) : drawings && drawings.length > 0 ? (
                  drawings.map((drawing) => (
                    <tr
                      key={drawing.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {drawing.tittel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {drawing.tegning_nummer || '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {drawing.revisjon || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            statusColors[drawing.status] || statusColors.ukontrollert
                          )}
                        >
                          {statusLabels[drawing.status] || drawing.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <PenTool className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Ingen tegninger ennå</p>
                        <p className="text-sm mt-1">
                          Tegninger ekstraheres fra manualer eller legges til manuelt
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
