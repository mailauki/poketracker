'use client'

import { Captured, Dex, Mon, Species } from "@/utils/types"
import { useEffect, useState } from "react"

export default function PokeCard({
  pokemon, pokedex, captured
}: {
  pokemon: Mon,
  pokedex: Dex,
  captured: Captured[]
}) {
  const [pokemonSpecies, setPokemonSpecies] = useState<Species>()

  useEffect(() => {
    fetch(pokemon.pokemon_species.url)
    .then((res) => res.json())
    .then((data) => setPokemonSpecies(data))
  }, [])

  return (
    <div style={{ color: captured.find(mon => mon.number == pokemonSpecies?.id) ? "red" : "inherit" }}>
      <p>{pokemon.entry_number} - {pokemon.pokemon_species.name} - {pokemonSpecies?.id}</p>
    </div>
  )
}