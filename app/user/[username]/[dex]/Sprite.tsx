'use client'

import { Species, Sprites } from "@/utils/types"
import Image from "next/image"
import { Key, useEffect, useState } from "react"

export default function Sprite({ id, shiny }: { id: Key, shiny: boolean }) {
  const [sprites, setSprites] = useState<Sprites>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)

    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then((res) => res.json())
    .then((data) => {
      setSprites(data.sprites)
      setLoading(false)
    })
  }, [id])

  if (!sprites) return <></>

  if (loading) return (
    <div role="status" className="max-w-sm animate-pulse absolute inset-0 w-full bg-gray-200 dark:bg-gray-700 z-100">
      <span className="sr-only">Loading...</span>
    </div>
  )

  return (
    <div className="absolute inset-0 px-8 py-8">
      {shiny ? (
        <img
          src={sprites?.front_shiny || ""}
          width={80}
          height={80}
          alt={`pokemon #${id}`}
        />
      ) : (
        <img
          src={sprites?.front_default || ""}
          width={80}
          height={80}
          alt={`pokemon #${id}`}
        />
      )}
    </div>
  )
}