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