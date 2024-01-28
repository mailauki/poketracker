'use client'

import { createClient } from '@/utils/supabase/client'
import { Captured, Dex, Mon } from '@/utils/types'
import { Key, SetStateAction, useEffect, useState } from 'react'
import PokeCard from './PokeCard'
import { Session } from '@supabase/supabase-js'
import PokedexTabs from './PokedexTabs'
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
  const [caughtToggle, setCaughtToggle] = useState<string>("all")
  const [filteredEntries, setFilteredEntries] = useState<Mon[]>(pokemonEntries)
	const [keyword, setKeyword] = useState<string>("")
	const [searchEntries, setSearchEntries] = useState<Mon[]>(filteredEntries)

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
  }, [active])

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
  }, [capturedPokemon, caughtToggle, pokemonEntries])

	useEffect(() => {
		if (keyword) {
			const searchFiltered = filteredEntries.filter((entry) => entry.pokemon_species.name.includes(keyword.toLowerCase()) || String(entry.entry_number).includes(keyword) || entry.pokemon_species.url.split("/")[6].includes(keyword))
			setSearchEntries(searchFiltered)
		} else {
			setSearchEntries(filteredEntries)
		}
	}, [filteredEntries, keyword])

  const handleTabChange = (id: Key) => {
    setActive(id)
  }

  const handleToggleChange = (value: string) => {
    setCaughtToggle(value)
  }

	const handleSearchChange = (event: { target: { value: SetStateAction<string> } }) => {
		setKeyword(event.target.value)
	}

	// if (!pokemonEntries) return <Loading />
	// console.log(pokemonEntries)
	const loadingArray = Array.from(new Array(10)).map((_, index) => index)
	// console.log(loadingArray)

  return (
    <div className="w-full max-w-4xl flex flex-col items-center justify-center p-3 gap-4">
      <div className="w-full flex flex-col-reverse md:flex-row justify-between sticky top-16 py-3 gap-4 bg-background z-10">
        <CaughtToggle
          caughtToggle={caughtToggle}
          handleToggleChange={handleToggleChange}
        />
        <Search
					keyword={keyword}
					handleSearchChange={handleSearchChange}
				/>
      </div>

      <DexHeader pokedex={pokedex} session={session} />

      <PokedexTabs pokedex={pokedex} active={active} handleTabChange={handleTabChange} />
			
      {pokemonEntries && pokemonEntries.length !== 0 ? (
				<div className="flex flex-wrap items-center justify-center gap-4">
					{searchEntries && searchEntries.length !== 0 ? (
						searchEntries.map((pokemon: Mon) => (
							<PokeCard
								key={pokemon.entry_number}
								pokemon={pokemon}
								pokedex={pokedex}
								captured={capturedPokemon}
								session={session}
							/>
						))
					) : (
						<div className="flex flex-col justify-center items-center">
							<p className="text-2xl">No Pokemon Found</p>
							<p className="text-gray-500">Try clearing the search or switching between pokedexes.</p>
						</div>
					)}
				</div>
			) : (
				<div className="flex flex-wrap items-center justify-center gap-4">
					{loadingArray.map((index) => (
						<div
							key={index}
							className="rounded-md border hover:bg-btn-background-hover border-gray-300 hover:border-gray-400 dark:border-gray-700 w-full h-20 sm:w-36 sm:h-36 relative overflow-auto animate-pulse  bg-gray-200 dark:bg-gray-700"
							role="status"
						></div>
					))}
				</div>
			)}
    </div>
  )
}