import { Award, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { useCertificates } from '@/hooks/useData'
import { formatDate, cn } from '@/lib/utils'

const typeLabels: Record<string, string> = {
  med_forfall: 'Med forfall',
  typegodkjenning: 'Typegodkjenning',
  samsvarserklaring: 'Samsvarserklæring',
}

export function Certificates() {
  const { data: certificates, isLoading } = useCertificates()

  const isExpired = (date: string | null) => {
    if (!date) return false
    return new Date(date) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sertifikater
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Administrer sertifikater og godkjenninger
          </p>
        </div>
      </div>

      {/* Certificates table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Alle sertifikater
            {certificates && certificates.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({certificates.length})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
            </div>
          ) : certificates && certificates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-cyan-500/20">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Tittel
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nummer
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Utsteder
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Utløpsdato
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert) => (
                    <tr
                      key={cert.id}
                      className="border-b border-gray-100 dark:border-cyan-500/10 hover:bg-gray-50 dark:hover:bg-cyan-500/5"
                    >
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {cert.tittel}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                        {cert.type ? typeLabels[cert.type] || cert.type : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                        {cert.sertifikat_nummer || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                        {cert.utsteder || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={cn(
                          isExpired(cert.utlops_dato)
                            ? 'text-red-600 dark:text-red-400 font-medium'
                            : 'text-gray-600 dark:text-gray-300'
                        )}>
                          {cert.utlops_dato ? formatDate(cert.utlops_dato) : '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          'px-2 py-1 text-xs rounded-full',
                          isExpired(cert.utlops_dato)
                            ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        )}>
                          {isExpired(cert.utlops_dato) ? 'Utløpt' : cert.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Ingen sertifikater ennå</p>
              <p className="text-sm mt-1">
                Sertifikater ekstraheres fra manualer
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
