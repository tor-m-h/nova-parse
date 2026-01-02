import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Fartoy } from '@/types/database'

export function useFartoy() {
  return useQuery({
    queryKey: ['fartoy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fartoy')
        .select('*')
        .order('navn')

      if (error) throw error
      return data as Fartoy[]
    },
  })
}
