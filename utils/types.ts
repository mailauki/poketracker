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
  user_id: Key
}

export type Mon = {
  entry_number: number,
  pokemon_species: {
    name: string,
    url: string
  }
}