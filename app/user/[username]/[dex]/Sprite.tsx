'use client'

import { Species, Sprites } from "@/utils/types"
import Image from "next/image"
import { Key, useEffect, useState } from "react"

export default function Sprite({ id, shiny }: { id: Key, shiny: boolean }) {
  const [sprites, setSprites] = useState<Sprites>()

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then((res) => res.json())
    .then((data) => setSprites(data.sprites))
  }, [])

  return sprites && (
    <>
      {shiny ? (
        <img
          src={sprites?.front_shiny || ""}
          width={60}
          height={60}
          alt={`pokemon #${id}`}
        />
      ) : (
        <img
          src={sprites?.front_default || ""}
          width={60}
          height={60}
          alt={`pokemon #${id}`}
        />
      )}
    </>
  )
}