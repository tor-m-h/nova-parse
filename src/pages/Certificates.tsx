import { Award, Upload } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export function Certificates() {
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
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Legg til
        </Button>
      </div>

      {/* Certificates table */}
      <Card>
        <CardHeader>
          <CardTitle>Alle sertifikater</CardTitle>
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
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="py-12">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Ingen sertifikater ennå</p>
                      <p className="text-sm mt-1">
                        Sertifikater ekstraheres fra manualer eller legges til manuelt
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
