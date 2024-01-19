'use client'

import { createClient } from '@/utils/supabase/client'
import { Dex } from '@/utils/types'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Progress from './Progress'
import DexHeader from './DexHeader'
import ShareBtn from './ShareBtn'

export default function Pokedexes({ serverPokedexes }: { serverPokedexes: Dex[] }) {
  const [pokedexes, setPokedexes] = useState(serverPokedexes)
  const supabase = createClient()
  const pathname = usePathname()
  const { username } = useParams()

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
    <div className="w-full max-w-4xl flex flex-col items-center justify-center p-3 my-6 gap-14">
      <div className="w-full flex items-center gap-2">
        <h1 className="text-3xl">{`${username}'s` || "Your"} Profile</h1>
        <ShareBtn url={`https://poketracker-one.vercel.app${pathname}`} />
      </div>
      {pokedexes.map((pokedex) => (
        <DexHeader key={pokedex.id} pokedex={pokedex} />
      ))}
    </div>
  )
}