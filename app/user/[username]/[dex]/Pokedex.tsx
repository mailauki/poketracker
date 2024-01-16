'use client'

import { createClient } from '@/utils/supabase/client'
import { Captured, Dex, Mon } from '@/utils/types'
import { Key, useEffect, useState } from 'react'
import PokeCard from './PokeCard'
import { Session } from '@supabase/supabase-js'
import Progress from '../Progress'
import { adjustName } from '@/utils/helpers'
import PokedexTabs from './PokedexTabs'
import ShinyIcon from '@/components/ShinyIcon'
import DexHeader from '../DexHeader'

export default function Pokedex({
  serverPokedex, serverCapturedPokemon, session
}: {
  serverPokedex: Dex,
  serverCapturedPokemon: Captured[],
  session: Session | null
}) {
  const supabase = createClient()
  const [pokedex, setPokedex] = useState(serverPokedex)
  const [pokemonEntries, setPokemonEntries] = useState([])
  const [capturedPokemon, setCapturedPokemon] = useState(serverCapturedPokemon)
  const [active, setActive] = useState<Key>(pokedex.number)

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
    fetch(`https://pokeapi.co/api/v2/pokedex/${active}`)
    .then((res) => res.json())
    .then((data) => setPokemonEntries(data.pokemon_entries))
  }, [active])

  const handleTabChange = (id: Key) => {
    setActive(id)
  }

  // return <pre>{JSON.stringify(pokedex, null, 2)}</pre>
  // return <pre>{JSON.stringify(pokemonEntries, null, 2)}</pre>
  return (
    <div className="w-full max-w-4xl flex flex-col items-center justify-center p-3 my-6 gap-4">
      {/* <div className="w-full flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-xl">{pokedex.title}</h1>
          <div className="flex items-center gap-2">
            {pokedex.shiny && <ShinyIcon />}
            <p className="w-30 py-2 px-3 flex text-sm rounded-full bg-btn-background">
              {pokedex.type}
            </p>
            <p className="w-30 py-2 px-3 flex text-sm rounded-full bg-btn-background">
              {adjustName(pokedex.game)}
            </p>
          </div>
        </div>
        <Progress captured={pokedex.captured} entries={pokedex.entries} />
      </div> */}
      <DexHeader pokedex={pokedex} />
      <PokedexTabs pokedex={pokedex} active={active} handleTabChange={handleTabChange} />
      <div className="flex flex-wrap items-center justify-center gap-4">
        {pokemonEntries.map((pokemon: Mon) => (
          <PokeCard
            key={pokemon.entry_number}
            pokemon={pokemon}
            pokedex={pokedex}
            captured={capturedPokemon}
            session={session}
          />
        ))}
      </div>
    </div>
  )
}