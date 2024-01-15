'use client'

import { Captured, Dex, Mon, Species } from "@/utils/types"
import { useEffect, useState } from "react"
import Sprite from "./Sprite"

export default function PokeCard({
  pokemon, pokedex, captured
}: {
  pokemon: Mon,
  pokedex: Dex,
  captured: Captured[]
}) {
  const [pokemonSpecies, setPokemonSpecies] = useState<Species | null>(null)

  useEffect(() => {
    fetch(pokemon.pokemon_species.url)
    .then((res) => res.json())
    .then((data) => setPokemonSpecies(data))
  }, [])

  function handleCapturePokemon() {
    console.log({ number: pokemonSpecies!.id, pokedex: pokedex.id, user_id: null })
  }

  return (
    <button
      className="py-2 px-3 flex flex-col items-center justify-between rounded-md no-underline hover:bg-btn-background-hover border w-36 h-36"
      style={{ borderColor: captured.find(mon => mon.number == pokemonSpecies?.id) ? "red" : "inherit" }}
      onClick={handleCapturePokemon}
    >
      <p>{pokemon.entry_number} - {pokemon.pokemon_species.name}</p>
      {pokemonSpecies && <Sprite id={pokemonSpecies.id} shiny={pokedex.shiny || false} />}
      <p>{pokemonSpecies?.id}</p>
    </button>
  )
}