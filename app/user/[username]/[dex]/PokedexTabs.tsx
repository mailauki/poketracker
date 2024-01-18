import { adjustName } from "@/utils/helpers";
import { Dex, PokeTab } from "@/utils/types";
import { Key, useEffect, useState } from "react";

export default function PokedexTabs({
  pokedex, active, handleTabChange
}: {
  pokedex: Dex,
  active: Key,
  handleTabChange: (id: Key) => void
}) {
  const [pokedexes, setPokedexes] = useState<PokeTab[] | []>([])

  useEffect(() => {
    const getPokedexTabs = async () => {
      const id = Number(pokedex.number)

      const res = await fetch(`https://pokeapi.co/api/v2/pokedex/${id}`)
      if (!res.ok) {
        throw new Error('Failed to fetch data')
      }
      const data = await res.json()

      const res2 = await fetch(`https://pokeapi.co/api/v2/pokedex/${id+1}`)
      if (!res2.ok) {
        throw new Error('Failed to fetch data')
      }
      const data2 = await res2.json()

      const res3 = await fetch(`https://pokeapi.co/api/v2/pokedex/${id+2}`)
      if (!res3.ok) {
        throw new Error('Failed to fetch data')
      }
      const data3 = await res3.json()

      if (pokedex.type === "Collective") {
        setPokedexes([
          {id: id, name: data.name, entries: data.pokemon_entries.length},
          {id: id+1, name: data2.name, entries: data2.pokemon_entries.length},
          {id: id+2, name: data3.name, entries: data3.pokemon_entries.length}
        ])
      } else {
        setPokedexes([{id: id, name: data.name, entries: data.pokemon_entries.length}])
      }
    }
    getPokedexTabs()
  }, [])

  return (
    <div className="w-full mb-4 border-b border-gray-200 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
        {pokedexes
        .sort((a: any, b: any) => a.id - b.id)
        .map((tab) => (
          <li key={tab.id} role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${active == tab.id ? "text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-500 border-blue-600 dark:border-blue-500" : "text-gray-500 hover:text-gray-600 dark:text-gray-400 border-transparent hover:border-gray-300 dark:hover:text-gray-300"} uppercase`}
              type="button"
              role="tab"
              aria-selected={tab.id == active}
              value={tab.id}
              onClick={() => handleTabChange(tab.id)}
            >
              {adjustName(tab.name)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}