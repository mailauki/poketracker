import { UUID } from "crypto"
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
  user_id: UUID,
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

export type Sprites = {
  back_default: string | null
  back_female: string | null
  back_shiny: string | null
  back_shiny_female: null
  front_default: string
  front_female: string | null
  front_shiny: string | null
  front_shiny_female: string | null
}

export type PokeTab = {
  id: Key,
  name: string,
  entries: number
}

export type Game = {
  id: Key,
  name: string,
  pokedex: string,
  entries: number,
  DLC: boolean,
  hash: string
}