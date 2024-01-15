'use client'

import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Key, useEffect, useState } from 'react'

type Pokedex = {
  id: Key,
  title: string,
  game: string,
  type: string,
  shiny: boolean,
  captured: [{ number: string }],
  entries: number,
  number: string,
  hash: string
}

export default function Pokedexes({ serverPokedexes }: { serverPokedexes: Pokedex[] }) {
  // const [pokedexes, setPokedexes] = useState<any[] | null>(null)
  const [pokedexes, setPokedexes] = useState(serverPokedexes)
  const supabase = createClient()

  // useEffect(() => {
  //   const getData = async () => {
  //     const { data } = await supabase.from('pokedexes').select()
  //     setPokedexes(data)
  //   }
  //   getData()
  // }, [])

  useEffect(() => {
    setPokedexes(serverPokedexes)
  }, [serverPokedexes])

  useEffect(() => {
    const channel = supabase
      .channel('*')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pokedexes' }, (payload) =>
        setPokedexes((pokedexes) => [...pokedexes, payload.new as Pokedex])
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, setPokedexes, pokedexes])

  // return <pre>{JSON.stringify(pokedexes, null, 2)}</pre>
  return (
    <>
      {pokedexes.map((pokedex) => (
        <div key={pokedex.id}>
          <Link href={`/${pokedex.hash}`}>{pokedex.title}</Link>
        </div>
      ))}
    </>
  )
}