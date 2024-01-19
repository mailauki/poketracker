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
import CaughtToggle from './CaughtToggle'
import Search from './Search'

export default function Pokedex({
  serverPokedex, serverCapturedPokemon, session
}: {
  serverPokedex: Dex,
  serverCapturedPokemon: Captured[],
  session: Session | null
}) {
  const supabase = createClient()
  const [pokedex, setPokedex] = useState(serverPokedex)
  const [pokemonEntries, setPokemonEntries] = useState<Mon[]>([])
  const [capturedPokemon, setCapturedPokemon] = useState(serverCapturedPokemon)
  const [active, setActive] = useState<Key>(pokedex.number)
  const [caughtToggle, setCaughtToggle] = useState<string>('all')
  const [filteredEntries, setFilteredEntries] = useState<Mon[]>(pokemonEntries)

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
    .then((data) => setFilteredEntries(data.pokemon_entries))
  }, [])

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokedex/${active}`)
    .then((res) => res.json())
    .then((data) => setPokemonEntries(data.pokemon_entries))
  }, [active])

  useEffect(() => {
    if (caughtToggle === "caught") {
      const filteredCaught = pokemonEntries.filter((entry) => capturedPokemon.map((captured) => captured.number).includes(entry.pokemon_species.url.split("/")[6]))

      setFilteredEntries(filteredCaught)
    } else if (caughtToggle === "missing") {
      const filteredMissing = pokemonEntries.filter((entry) =>
      !capturedPokemon.map((captured) => captured.number).includes(entry.pokemon_species.url.split("/")[6]))

      setFilteredEntries(filteredMissing)
    } else {
      setFilteredEntries(pokemonEntries)
    }
  }, [caughtToggle, pokemonEntries])

  const handleTabChange = (id: Key) => {
    setActive(id)
  }

  const handleToggleChange = (value: string) => {
    setCaughtToggle(value)
  }

  return (
    <div className="w-full max-w-4xl flex flex-col items-center justify-center p-3 my-3 gap-4">
      <div className="w-full flex flex-col-reverse md:flex-row justify-between sticky top-16 py-3 gap-4 bg-background z-10">
        <CaughtToggle
          caughtToggle={caughtToggle}
          handleToggleChange={handleToggleChange}
        />
        <Search />
      </div>
      <DexHeader pokedex={pokedex} />
      <PokedexTabs pokedex={pokedex} active={active} handleTabChange={handleTabChange} />
      <div className="flex flex-wrap items-center justify-center gap-4">
        {filteredEntries.map((pokemon: Mon) => (
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