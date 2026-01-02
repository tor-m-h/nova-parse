import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Manual } from '@/types/database'

export function useManuals(fartoyId?: string) {
  return useQuery({
    queryKey: ['manuals', fartoyId],
    queryFn: async () => {
      let query = supabase
        .from('manual')
        .select('*')
        .order('created_at', { ascending: false })

      if (fartoyId) {
        query = query.eq('fartoy_id', fartoyId)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Manual[]
    },
  })
}

export function useManual(id: string) {
  return useQuery({
    queryKey: ['manual', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manual')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Manual
    },
    enabled: !!id,
  })
}

export function useUploadManual() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      file,
      fartoyId,
      tittel,
    }: {
      file: File
      fartoyId: string
      tittel: string
    }) => {
      // Upload file to storage
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const fileName = `${fartoyId}/${Date.now()}-${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('manuals')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('manuals')
        .getPublicUrl(fileName)

      // Create manual record
      const { data, error } = await supabase
        .from('manual')
        .insert({
          fartoy_id: fartoyId,
          tittel,
          filnavn: file.name,
          filtype: fileExt as 'pdf' | 'docx' | 'txt',
          fil_url: urlData.publicUrl,
          fil_storrelse: file.size,
          status: 'lastet_opp',
        })
        .select()
        .single()

      if (error) throw error
      return data as Manual
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manuals'] })
    },
  })
}

export function useDeleteManual() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('manual').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manuals'] })
    },
  })
}

export function useUpdateManualStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: Manual['status']
    }) => {
      const { data, error } = await supabase
        .from('manual')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Manual
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manuals'] })
    },
  })
}
