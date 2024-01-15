'use client'

import { createClient } from '@/utils/supabase/client'
import { Dex, Mon } from '@/utils/types'
import { useEffect, useState } from 'react'

export default function Pokedex({ serverPokedex }: { serverPokedex: Dex }) {
  const supabase = createClient()
  const [pokedex, setPokedex] = useState(serverPokedex)
  const [pokemonEntries, setPokemonEntries] = useState([])

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

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokedex/${pokedex.number}`)
    .then((res) => res.json())
    .then((data) => setPokemonEntries(data.pokemon_entries))
  }, [pokedex])

  // return <pre>{JSON.stringify(pokedex, null, 2)}</pre>
  // return <pre>{JSON.stringify(pokemonEntries, null, 2)}</pre>
  return (
    <>
      {pokemonEntries.map((pokemon: Mon) => (
        <div key={pokedex.id}>
          <p>{pokemon.entry_number} - {pokemon.pokemon_species.name}</p>
        </div>
      ))}
    </>
  )
}