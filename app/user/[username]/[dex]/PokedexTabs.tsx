import { Dex, PokeTab } from "@/utils/types";
import { Key, useEffect, useState } from "react";

export default function PokedexTabs({ pokedex }: { pokedex: Dex }) {
  const [pokedexes, setPokedexes] = useState<PokeTab[] | []>([])
  const [active, setActive] = useState<Key>(pokedex.number)

  useEffect(() => {
    const id = Number(pokedex.number)
    let poketabs: PokeTab[] = []

    if(pokedex.type === "Collective") {
      fetch(`https://pokeapi.co/api/v2/pokedex/${id}`)
      .then((res) => res.json())
      .then((data) => {
        return poketabs.push({ id: data.id, name: data.name, entries: data.pokemon_entries.length })
      })
      fetch(`https://pokeapi.co/api/v2/pokedex/${id+1}`)
      .then((res) => res.json())
      .then((data) => {
        return poketabs.push({ id: data.id, name: data.name, entries: data.pokemon_entries.length })
      })
      fetch(`https://pokeapi.co/api/v2/pokedex/${id+2}`)
      .then((res) => res.json())
      .then((data) => {
        return poketabs.push({ id: data.id, name: data.name, entries: data.pokemon_entries.length })
      })
      setPokedexes(poketabs)
    } else {
      fetch(`https://pokeapi.co/api/v2/pokedex/${id}`)
      .then((res) => res.json())
      .then((data) => setPokedexes([{ id: data.id, name: data.name, entries: data.pokemon_entries.length }]))
    }
  }, [])

  return (
    <div className="w-full mb-4 border-b border-gray-200 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
        {pokedexes
        .sort((a: any, b: any) => a.id - b.id)
        .map((tab) => (
          <li role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${active == tab.id ? "text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-500 border-blue-600 dark:border-blue-500" : "dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300"} uppercase`}
              type="button"
              role="tab"
              aria-selected={tab.id == active}
              value={tab.id}
              onClick={() => setActive(tab.id)}
            >
              {tab.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}