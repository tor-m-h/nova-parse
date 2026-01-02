import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Job, Component, Certificate, TechnicalDrawing } from '@/types/database'

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Job[]
    },
  })
}

export function useComponents() {
  return useQuery({
    queryKey: ['components'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('component')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Component[]
    },
  })
}

export function useCertificates() {
  return useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificate')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Certificate[]
    },
  })
}

export function useDrawings() {
  return useQuery({
    queryKey: ['drawings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technical_drawing')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as TechnicalDrawing[]
    },
  })
}
