import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Manual, AnalysisResults } from '@/types/database'

export function useAnalyzeManual() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (manual: Manual) => {
      // Update status to analyzing
      await supabase
        .from('manual')
        .update({ status: 'analyserer' })
        .eq('id', manual.id)

      // Fetch the file content from Supabase Storage
      if (!manual.fil_url) {
        throw new Error('Ingen fil-URL tilgjengelig')
      }

      let fileContent = ''

      // Extract the file path from the URL
      const urlParts = manual.fil_url.split('/storage/v1/object/public/manuals/')
      const filePath = urlParts[1] || manual.fil_url.split('/manuals/').pop()

      if (!filePath) {
        throw new Error('Kunne ikke finne filsti')
      }

      if (manual.filtype === 'txt') {
        // Download file using Supabase Storage
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('manuals')
          .download(filePath)

        if (downloadError) {
          throw new Error(`Kunne ikke laste ned fil: ${downloadError.message}`)
        }

        fileContent = await fileData.text()
      } else {
        // For PDF/DOCX, send a message that we need the text content
        // In a full implementation, you'd use a PDF parser
        fileContent = `[Fil: ${manual.filnavn}] - For full analyse, last opp som TXT-fil eller implementer PDF-parser.`
      }

      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-manual', {
        body: {
          fileContent,
          fileName: manual.filnavn,
        },
      })

      if (error) {
        // Update status to error
        await supabase
          .from('manual')
          .update({
            status: 'feil',
            error_message: error.message
          })
          .eq('id', manual.id)
        throw error
      }

      if (!data.success) {
        await supabase
          .from('manual')
          .update({
            status: 'feil',
            error_message: data.error
          })
          .eq('id', manual.id)
        throw new Error(data.error)
      }

      // Store results and update status
      const analysisResults: AnalysisResults = data.data

      await supabase
        .from('manual')
        .update({
          status: 'avventer_godkjenning',
          pending_analysis_results: analysisResults,
          antall_jobber: analysisResults.jobs?.length || 0,
          antall_komponenter: analysisResults.components?.length || 0,
          antall_sertifikater: analysisResults.certificates?.length || 0,
          antall_tegninger: analysisResults.drawings?.length || 0,
        })
        .eq('id', manual.id)

      return analysisResults
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manuals'] })
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['manuals'] })
    },
  })
}

export function useApproveAnalysis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      manual,
      selectedJobs,
      selectedComponents,
      selectedCertificates,
      selectedDrawings
    }: {
      manual: Manual
      selectedJobs: number[]
      selectedComponents: number[]
      selectedCertificates: number[]
      selectedDrawings: number[]
    }) => {
      const results = manual.pending_analysis_results as AnalysisResults
      if (!results) throw new Error('Ingen analyseresultater å godkjenne')

      const fartoyId = manual.fartoy_id

      // Insert selected jobs
      if (selectedJobs.length > 0 && results.jobs) {
        const jobsToInsert = selectedJobs.map(index => ({
          manual_id: manual.id,
          fartoy_id: fartoyId,
          tittel: results.jobs[index].tittel,
          type: results.jobs[index].type,
          beskrivelse: results.jobs[index].beskrivelse,
          intervall_dager: results.jobs[index].intervall_dager,
          intervall_driftstimer: results.jobs[index].intervall_driftstimer,
          kilde_seksjon: results.jobs[index].kilde_seksjon,
          status: 'ukontrollert',
        }))

        await supabase.from('job').insert(jobsToInsert)
      }

      // Insert selected components
      if (selectedComponents.length > 0 && results.components) {
        const componentsToInsert = selectedComponents.map(index => ({
          manual_id: manual.id,
          fartoy_id: fartoyId,
          tittel: results.components[index].tittel,
          type: results.components[index].type,
          sfi_kode: results.components[index].sfi_kode,
          produsent: results.components[index].produsent,
          modell_navn: results.components[index].modell_navn,
          status: 'ukontrollert',
        }))

        await supabase.from('component').insert(componentsToInsert)
      }

      // Insert selected certificates
      if (selectedCertificates.length > 0 && results.certificates) {
        const certificatesToInsert = selectedCertificates.map(index => ({
          manual_id: manual.id,
          fartoy_id: fartoyId,
          tittel: results.certificates[index].tittel,
          type: results.certificates[index].type,
          sertifikat_nummer: results.certificates[index].sertifikat_nummer,
          utsteder: results.certificates[index].utsteder,
          utlops_dato: results.certificates[index].utlops_dato,
          status: 'ukontrollert',
        }))

        await supabase.from('certificate').insert(certificatesToInsert)
      }

      // Insert selected drawings
      if (selectedDrawings.length > 0 && results.drawings) {
        const drawingsToInsert = selectedDrawings.map(index => ({
          manual_id: manual.id,
          fartoy_id: fartoyId,
          tittel: results.drawings[index].tittel,
          tegning_nummer: results.drawings[index].tegning_nummer,
          revisjon: results.drawings[index].revisjon,
          status: 'ukontrollert',
        }))

        await supabase.from('technical_drawing').insert(drawingsToInsert)
      }

      // Update manual status
      await supabase
        .from('manual')
        .update({
          status: 'ferdig_analysert',
          pending_analysis_results: null,
          antall_jobber: selectedJobs.length,
          antall_komponenter: selectedComponents.length,
          antall_sertifikater: selectedCertificates.length,
          antall_tegninger: selectedDrawings.length,
        })
        .eq('id', manual.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manuals'] })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['components'] })
      queryClient.invalidateQueries({ queryKey: ['certificates'] })
      queryClient.invalidateQueries({ queryKey: ['drawings'] })
    },
  })
}
