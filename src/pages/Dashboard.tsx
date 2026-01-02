import { FileText, Wrench, Award, PenTool, Upload, Search } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

const stats = [
  { label: 'Manualer', value: 0, icon: FileText, color: 'text-sky-500' },
  { label: 'Jobber', value: 0, icon: Wrench, color: 'text-cyan-500' },
  { label: 'Sertifikater', value: 0, icon: Award, color: 'text-emerald-500' },
  { label: 'Tegninger', value: 0, icon: PenTool, color: 'text-purple-500' },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Velkommen til Nova Parse - AI-drevet analyse av vedlikeholdsmanualer
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Folder Search Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-cyan-500" />
              Mappesøk
            </CardTitle>
            <CardDescription>
              Søk gjennom en mappe på din datamaskin og la AI klassifisere filene
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Velg mappe
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Støtter PDF, DOCX og TXT-filer. Prosesserer opptil 15 filer om gangen.
            </p>
          </CardContent>
        </Card>

        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-sky-500" />
              Last opp manual
            </CardTitle>
            <CardDescription>
              Last opp en enkelt manual for AI-analyse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 dark:border-cyan-500/30 rounded-lg p-6 text-center hover:border-sky-500 dark:hover:border-cyan-500 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Klikk eller dra filer hit
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                PDF, DOCX eller TXT (maks 50MB)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Nylig aktivitet</CardTitle>
          <CardDescription>
            Dine siste analyser og handlinger
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Ingen aktivitet ennå</p>
            <p className="text-sm mt-1">Last opp en manual for å komme i gang</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
