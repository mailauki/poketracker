'use client'

import { Captured, Dex, Mon, Species } from "@/utils/types"
import { Key, useEffect, useState } from "react"
import Sprite from "./Sprite"
// import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/client"
import { Session } from '@supabase/supabase-js'


export default function PokeCard({
  pokemon, pokedex, captured, session
}: {
  pokemon: Mon,
  pokedex: Dex,
  captured: Captured[],
  // handleCapturePokemon: ({ number, pokedex }: { number: Key, pokedex: Key }) => void
  session: Session | null
}) {
  const [pokemonSpecies, setPokemonSpecies] = useState<Species | null>(null)
  let isCaptured = captured.find(mon => mon.number == pokemonSpecies?.id)

  useEffect(() => {
    fetch(pokemon.pokemon_species.url)
    .then((res) => res.json())
    .then((data) => setPokemonSpecies(data))
  }, [])

  const handleCapturePokemon = async () => {
    // 'use server'
    const supabase = createClient()

    const { data: pokemon } = await supabase
    .from('captured_pokemon')
    .insert({ number: pokemonSpecies!.id, pokedex: pokedex.id, user_id: session?.user.id })
    .select()
    .returns<Captured>()
    .single()
  
    const { data } = await supabase.rpc('increment_pokedexes', { row_id: pokedex.id })
  
    console.log({pokemon})

    // console.log({ number: pokemonSpecies!.id, pokedex: pokedex.id, user_id: session?.user.id })
  }

  const handleRemovePokemon = async () => {
    // 'use server'
    const supabase = createClient()

    // const { data: pokemon } = await supabase
    // .from('captured_pokemon')
    // .select(`id`)
    // .match({ number: pokemonSpecies!.id, pokedex: pokedex?.id, user_id: session?.user.id })
    // .returns<Captured>()
    // .single()
  
    const { error } = await supabase
    .from('captured_pokemon')
    .delete()
    .match({ id: isCaptured?.id, user_id: session?.user.id })
  
    const { data } = await supabase.rpc('decrement_pokedexes', { row_id: pokedex.id })

    // console.log(isCaptured?.id)

    // console.log({ number: pokemonSpecies!.id, pokedex: pokedex.id, user_id: session?.user.id })
  }

  return (
    <button
      className="py-2 px-3 flex flex-col items-center justify-between rounded-md no-underline hover:bg-btn-background-hover border w-36 h-36"
      style={{ borderColor: isCaptured ? "red" : "inherit" }}
      onClick={isCaptured ? handleRemovePokemon : handleCapturePokemon}
      disabled={!session}
    >
      <p>{pokemon.entry_number} - {pokemon.pokemon_species.name}</p>
      {pokemonSpecies && <Sprite id={pokemonSpecies.id} shiny={pokedex.shiny || false} />}
      <p>{pokemonSpecies?.id}</p>
    </button>
  )
}