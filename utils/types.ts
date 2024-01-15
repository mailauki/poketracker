import { Key } from "react"

export type Dex = {
  id: Key,
  title: string,
  game: string,
  type: string,
  shiny: boolean,
  captured: number,
  entries: number,
  number: string,
  hash: string,
  username: string,
  user_id: Key,
  // captured_pokemon: [{ number: string }]
}

export type Mon = {
  entry_number: number,
  pokemon_species: {
    name: string,
    url: string
  }
}

export type Captured = {
  id: Key,
  number: string,
  pokedex: number,
  user_id: string
}

export type Species = {
  id: Key,
  evolution_chain: {
    url: string
  },
  evolves_from_species: any | null,
  varieties: [
    {
      pokemon: {
        name: string,
        url: string
      }
    }
  ]
}

export type Sprites = {}