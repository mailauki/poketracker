'use client'

import { createClient } from '@/utils/supabase/client'
import { Dex } from '@/utils/types'
import { useEffect, useState } from 'react'

export default function Pokedex({ serverPokedex }: { serverPokedex: Dex }) {
  const [pokedex, setPokedex] = useState(serverPokedex)
  const supabase = createClient()

  useEffect(() => {
    setPokedex(serverPokedex)
  }, [serverPokedex])

  useEffect(() => {
    const channel = supabase
      .channel('realtime pokedex')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pokedexes',
          filter: `id=eq.${pokedex.id}`,
        },
        (payload) => {
          setPokedex(payload.new as Dex)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, setPokedex, pokedex])

  return <pre>{JSON.stringify(pokedex, null, 2)}</pre>
  // return (
  //   <>
  //     {pokedexes.map((pokedex) => (
  //       <div key={pokedex.id}>
  //         <Link href={`${pathname}/${pokedex.hash}`}>{pokedex.title}</Link>
  //       </div>
  //     ))}
  //   </>
  // )
}