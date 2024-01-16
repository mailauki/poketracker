'use client'

import { Captured, Dex, Mon, Species } from "@/utils/types"
import { Key, useEffect, useState } from "react"
import Sprite from "./Sprite"
import { createClient } from "@/utils/supabase/client"
import { Session } from '@supabase/supabase-js'
import { adjustName, padZero } from "@/utils/helpers"


export default function PokeCard({
  pokemon, pokedex, captured, session
}: {
  pokemon: Mon,
  pokedex: Dex,
  captured: Captured[],
  session: Session | null
}) {
  const [pokemonSpecies, setPokemonSpecies] = useState<Species | null>(null)
  let isCaptured = captured.find(mon => mon.number == pokemonSpecies?.id)

  useEffect(() => {
    fetch(pokemon.pokemon_species.url)
    .then((res) => res.json())
    .then((data) => setPokemonSpecies(data))
  }, [pokemon])

  const handleCapturePokemon = async () => {
    const supabase = createClient()

    const { data: pokemon } = await supabase
    .from('captured_pokemon')
    .insert({ number: pokemonSpecies!.id, pokedex: pokedex.id, user_id: session?.user.id })
    .select()
    .returns<Captured>()
    .single()
  
    const { data } = await supabase.rpc('increment_pokedexes', { row_id: pokedex.id })
  }

  const handleRemovePokemon = async () => {
    const supabase = createClient()
  
    const { error } = await supabase
    .from('captured_pokemon')
    .delete()
    .match({ id: isCaptured?.id, user_id: session?.user.id })
  
    const { data } = await supabase.rpc('decrement_pokedexes', { row_id: pokedex.id })
  }

  return (
    <button
      className={`py-2 px-3 flex flex-col items-center justify-between rounded-md border ${isCaptured ? "hover:bg-blue-100 dark:hover:bg-blue-900 border-blue-600 hover:border-blue-800 dark:border-blue-500 dark:hover:border-blue-400 bg-blue-50 dark:bg-blue-950" : "hover:bg-btn-background-hover border-gray-300 hover:border-gray-400 dark:border-gray-700"} w-36 h-36`}
      onClick={isCaptured ? handleRemovePokemon : handleCapturePokemon}
      disabled={!session}
    >
      <p className="uppercase">{adjustName(pokemon.pokemon_species.name)}</p>
      {pokemonSpecies && (
        <Sprite id={pokemonSpecies.id} shiny={pokedex.shiny || false} />
      )}
      <p className="text-sm">{padZero(pokemon.entry_number)}</p>
    </button>
  )
}