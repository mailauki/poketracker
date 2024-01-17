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
    const filteredCaught = pokemonEntries.filter((entry) =>
    capturedPokemon.map((captured) => captured.number).includes(entry.pokemon_species.url.split("/")[6]))

    if (caughtToggle === "caught") {
      console.log(filteredCaught)
      setFilteredEntries(filteredCaught)
    } else if (caughtToggle === "missing") {
    const filteredMissing = pokemonEntries.filter((entry) =>
    !capturedPokemon.map((captured) => captured.number).includes(entry.pokemon_species.url.split("/")[6]))
      console.log(filteredMissing)
      setFilteredEntries(filteredMissing)
    } else {
      console.log(pokemonEntries)
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
    <div className="w-full max-w-4xl flex flex-col items-center justify-center p-3 my-6 gap-4">
      <div className="w-full flex justify-start">
        {/* <fieldset className="">
          <legend className="hidden block font-medium text-gray-900 dark:text-gray-300 mb-3">Show</legend>
          <div className="flex">
            <div className="flex items-center me-4">
              <input checked id="national-radio" type="radio" value="National" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="national-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">All</label>
            </div>
            <div className="flex items-center me-4">
              <input id="regional-radio" type="radio" value="Regional" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="regional-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Caught</label>
            </div>
            <div className="flex items-center me-4">
              <input id="collective-radio" type="radio" value="Collective" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="collective-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Missing</label>
            </div>
          </div>
        </fieldset> */}
        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400" role="tablist">
          <li className="me-2">
            <button
              className={`inline-block px-4 py-3 rounded-lg ${caughtToggle === "all" ? "text-white bg-blue-600 active" : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"}`}
              value="all"
              type="button"
              role="tab"
              aria-selected={"all" == caughtToggle}
              onClick={() => handleToggleChange("all")}
            >
              All
            </button>
          </li>
          <li className="me-2">
            <button
              className={`inline-block px-4 py-3 rounded-lg ${caughtToggle === "caught" ? "text-white bg-blue-600 active" : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"}`}
              value="caught"
              type="button"
              role="tab"
              aria-selected={"caught" == caughtToggle}
              onClick={() => handleToggleChange("caught")}
            >
              Caught
            </button>
          </li>
          <li className="me-2">
            <button
              className={`inline-block px-4 py-3 rounded-lg ${caughtToggle === "missing" ? "text-white bg-blue-600 active" : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"}`}
              value="missing"
              type="button"
              role="tab"
              aria-selected={"missing" == caughtToggle}
              onClick={() => handleToggleChange("missing")}
            >
              Missing
            </button>
          </li>
        </ul>
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