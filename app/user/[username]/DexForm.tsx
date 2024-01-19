'use client'

import { useEffect, useState } from "react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline"
import { createClient } from "@/utils/supabase/client"
import { Game } from "@/utils/types"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { hyphenate } from "@/utils/helpers"
import { Session } from "@supabase/supabase-js"
import { useParams } from "next/navigation"
// import { cookies } from "next/headers"

export default function DexForm({ session }: { session: Session | null }) {
  const { username } = useParams()
  const [open, setOpen] = useState<boolean>(false)
  const [games, setGames] = useState<Game[]>([])
  const [selectedGame, setSelectedGame] = useState<string>("home")
  // const [selectedGame, setSelectedGame] = useState<Game>({ id: 1, hash: "home", name: "HOME", pokedex: "1", DLC: false, entries: 0 })
  const national = games.find(game => game.hash === selectedGame)?.hash === "home"
  const regional = !games.find(game => game.hash === selectedGame)?.DLC && games.find(game => game.hash === selectedGame)?.hash !== "home"
  const collective = games.find(game => game.hash === selectedGame)?.DLC
  const [title, setTitle] = useState<string>("")
  const [type, setType] = useState<string>("National")
  const [shiny, setShiny] = useState<boolean>(false)

  useEffect(() => {
    const supabase = createClient()

    const getGames = async () => {
      const { data: games } = await supabase
      .from('games')
      .select()
      .returns<Game[]>()
      setGames(games!.sort((a, b) => a.id < b.id ? -1 : 1))
    }
    getGames()
  }, [])

  const handleType = () => {
    switch (true) {
      case national:
        setType("National")
        break;
      case regional:
        setType("Regional")
        break;
      case collective:
        setType("Collective")
        break;
      default:
        setType("Regional")
        break;
    }
  }

  useEffect(() => {
    handleType()
  }, [type, national, regional, collective])

  const handleCreateDex = async () => {
    console.log({
      title: title || "Living Dex",
      game: selectedGame,
      type,
      shiny,
      user_id: session?.user.id,
      username,
      captured: 0,
      entries: games.find(game => game.hash === selectedGame)?.entries,
      number: games.find(game => game.hash === selectedGame)?.pokedex || "1",
      hash: hyphenate(title) || "living-dex"
    })

    const supabase = createClient()
  
    try {
      const { error } = await supabase
      .from('pokedexes')
      .insert({
        title: title || "Living Dex",
        game: selectedGame,
        type,
        shiny,
        user_id: session?.user.id,
        username,
        captured: 0,
        entries: games.find(game => game.hash === selectedGame)?.entries,
        number: games.find(game => game.hash === selectedGame)?.pokedex || "1",
        hash: hyphenate(title) || "living-dex"
      })
      if (error) throw error
      // alert('Dex added!')
    } catch (e) {
      throw new Error('Error updating the data!')
    }

    setOpen(false)
  }

  return (
    <>
      <button
        className="w-2/4 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-16"
        type="button"
        onClick={() => setOpen(true)}
      >
        Create New Dex
      </button>
      

      <div className={`${open ? "" : "hidden"} relative z-10`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-background text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              {/* <!-- Modal header --> */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Dex
                </h3>
                <button type="button" className="text-gray-400 bg-transparent hover:text-gray-900 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900" data-modal-hide="default-modal" onClick={() => setOpen(false)}>
                  <XMarkIcon className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">Close</span>
                </button>
              </div>
              {/* <!-- Modal body --> */}
              <div className="p-4 md:p-5 space-y-4">
                <form className="space-y-4">
                  <div className="mb-6">
                    <label className="block font-medium text-gray-900 dark:text-gray-300 mb-1" htmlFor="password">
                      Title
                    </label>
                    <input
                      className="appearance-none rounded w-full h-10 py-2 px-3 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 mb-1 leading-tight" 
                      id="title"
                      type="text"
                      placeholder="Living Dex"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <p className="text-gray-400 text-xs italic">/user/{username}/{hyphenate(title) || "living-dex"}</p>
                  </div>
                  <div className="mb-6">
                    <label className="block font-medium text-gray-900 dark:text-gray-300 mb-1" htmlFor="game">
                      Game
                    </label>
                    <div className="relative">
                      <select
                        className="appearance-none rounded w-full h-10 py-2 px-3 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 leading-tight"
                        id="game"
                        value={selectedGame}
                        onChange={(e) => setSelectedGame(e.target.value)}
                      >
                        {games.map(game => <option key={game.id} value={game.hash}>{game.name}</option>)}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                  <fieldset className="mb-6">
                    <legend className="block font-medium text-gray-900 dark:text-gray-300 mb-1">Type</legend>
                    <div className="flex">
                      {national && <div className="flex items-center me-4">
                        <input
                          checked={national}
                          onChange={handleType}
                          id="national-radio"
                          type="radio"
                          value="National" 
                          name="inline-radio-group"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor="national-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">National</label>
                      </div>}
                      {regional && <div className="flex items-center me-4">
                        <input
                          checked={regional}
                          onChange={handleType}
                          id="regional-radio"
                          type="radio"
                          value="Regional"
                          name="inline-radio-group"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor="regional-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Regional</label>
                      </div>}
                      {collective && <div className="flex items-center me-4">
                        <input
                          checked={collective}
                          onChange={handleType}
                          id="collective-radio"
                          type="radio"
                          value="Collective" name="inline-radio-group"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor="collective-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Collective</label>
                      </div>}
                    </div>
                  </fieldset>
                  <fieldset className="mb-6">
                    <legend className="block font-medium text-gray-900 dark:text-gray-300 mb-1">Customizations</legend>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="shiny"
                          type="checkbox"
                          value="shiny"
                          onChange={() => setShiny(!shiny)}
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500"
                        />
                      </div>
                      <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Shiny</label>
                    </div>
                  </fieldset>
                </form>
              </div>
              {/* <!-- Modal footer --> */}
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                className="w-full block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
                // type="submit" 
                onClick={handleCreateDex}
              >
                Create
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}