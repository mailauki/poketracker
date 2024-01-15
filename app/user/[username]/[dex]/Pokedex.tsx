'use client'

import { createClient } from '@/utils/supabase/client'
import { Captured, Dex, Mon } from '@/utils/types'
import { Key, useEffect, useState } from 'react'
import PokeCard from './PokeCard'
import { Session } from '@supabase/supabase-js'
import Progress from '../Progress'
import { adjustName } from '@/utils/helpers'

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

  const handleCapturePokemon = async ({ number, pokedex }: { number: Key, pokedex: Key }) => {
    // 'use server'

    // const number = formData.get('number') as number
    // const pokedex = formData.get('pokedex') as number
    // const cookieStore = cookies()
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    // if (error) {
    //   return redirect('/login?message=Could not authenticate user')
    // }

    return console.log({ number, pokedex, user_id: user?.id })
  }

  // return <pre>{JSON.stringify(pokedex, null, 2)}</pre>
  // return <pre>{JSON.stringify(pokemonEntries, null, 2)}</pre>
  return (
    <div className="w-full max-w-4xl flex flex-col items-center justify-center p-3 my-6 gap-4">
      <div className="w-full flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-xl">{pokedex.title}</h1>
          <div className="flex gap-2">
            <p className="w-30 py-2 px-3 flex text-sm rounded-full bg-btn-background">
              {pokedex.type}
            </p>
            <p className="w-30 py-2 px-3 flex text-sm rounded-full bg-btn-background">
              {adjustName(pokedex.game)}
            </p>
          </div>
        </div>
        <Progress captured={pokedex.captured} entries={pokedex.entries} />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {pokemonEntries.map((pokemon: Mon) => (
          <PokeCard
            key={pokemon.entry_number}
            pokemon={pokemon}
            pokedex={pokedex}
            captured={capturedPokemon}
            // handleCapturePokemon={handleCapturePokemon}
            session={session}
          />
        ))}
      </div>
    </div>
  )
}