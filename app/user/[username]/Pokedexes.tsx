'use client'

import { createClient } from '@/utils/supabase/client'
import { Dex } from '@/utils/types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Pokedexes({ serverPokedexes }: { serverPokedexes: Dex[] }) {
  const [pokedexes, setPokedexes] = useState(serverPokedexes)
  const supabase = createClient()
  const pathname = usePathname()

  useEffect(() => {
    setPokedexes(serverPokedexes)
  }, [serverPokedexes])

  useEffect(() => {
    const channel = supabase
      .channel('realtime pokedexes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'pokedexes' },
        (payload) => {
          setPokedexes((pokedexes) => [...pokedexes, payload.new as Dex])
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'pokedexes' },
        (payload) => {
          setPokedexes((pokedexes) => pokedexes.filter((pokedex) => pokedex.id !== payload.old.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, setPokedexes, pokedexes])

  return (
    <>
      {pokedexes.map((pokedex) => (
        <div key={pokedex.id}>
          <Link href={`${pathname}/${pokedex.hash}`}>{pokedex.title}</Link>
        </div>
      ))}
    </>
  )
}