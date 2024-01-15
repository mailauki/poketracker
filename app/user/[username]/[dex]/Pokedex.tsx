'use client'

import { createClient } from '@/utils/supabase/client'
import { Captured, Dex, Mon } from '@/utils/types'
import { useEffect, useState } from 'react'
import PokeCard from './PokeCard'

export default function Pokedex({
  serverPokedex, serverCapturedPokemon
}: {
  serverPokedex: Dex,
  serverCapturedPokemon: Captured[]
}) {
  const supabase = createClient()
  const [pokedex, setPokedex] = useState(serverPokedex)
  const [pokemonEntries, setPokemonEntries] = useState([])
  const [capturedPokemon, setCapturedPokemon] = useState(serverCapturedPokemon)

  useEffect(() => {
    setPokedex(serverPokedex)
    setCapturedPokemon(serverCapturedPokemon)
  }, [serverPokedex, serverCapturedPokemon])

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
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'captured_pokemon',
          filter: `pokedex=eq.${pokedex.id}`,
        },
        (payload) => {
          setCapturedPokemon((capturedPokemon) => [...capturedPokemon, payload.new as Captured])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'captured_pokemon',
          filter: `pokedex=eq.${pokedex.id}`,
        },
        (payload) => {
          setCapturedPokemon((capturedPokemon) => capturedPokemon.filter((mon) => mon.id !== payload.old.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, setPokedex, pokedex, serverCapturedPokemon, capturedPokemon])

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokedex/${pokedex.number}`)
    .then((res) => res.json())
    .then((data) => setPokemonEntries(data.pokemon_entries))
  }, [pokedex])


  // console.log(pokedex.captured_pokemon)

  // useEffect(() => {
  //   // fetch(`https://pokeapi.co/api/v2/pokedex/${pokedex.number}`)
  //   // .then((res) => res.json())
  //   // .then((data) => console.log(data))
  //   const getData = async () => {
  //     const { data } = await supabase
  //     .from('captured_pokemon')
  //     .select()
  //     .eq('pokedex', pokedex.id)

  //     // console.log(data.number)
  //   }

  //   // getData()
  // }, [])


  // return <pre>{JSON.stringify(pokedex, null, 2)}</pre>
  // return <pre>{JSON.stringify(pokemonEntries, null, 2)}</pre>
  return (
    <div className="w-full max-w-4xl flex items-center justify-between p-3 my-6 gap-2">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {pokemonEntries.map((pokemon: Mon) => (
          <PokeCard
            key={pokemon.entry_number}
            pokemon={pokemon}
            pokedex={pokedex}
            captured={capturedPokemon}
          />
        ))}
      </div>
    </div>
  )
}