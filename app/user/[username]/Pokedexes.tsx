'use client'

import { createClient } from '@/utils/supabase/client'
import { Dex } from '@/utils/types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Progress from './Progress'

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
    <div className="w-full max-w-4xl flex flex-col items-center justify-center p-3 my-6 gap-4">
      {pokedexes.map((pokedex) => (
        <Link
          key={pokedex.id}
          href={`${pathname}/${pokedex.hash}`}
          className="py-2 px-3 flex flex-col items-center rounded-md no-underline hover:bg-btn-background-hover border gap-4 w-full"
        >
          {pokedex.title}
          <Progress
            captured={pokedex.captured}
            entries={pokedex.entries}
          />
        </Link>
      ))}
    </div>
  )
}