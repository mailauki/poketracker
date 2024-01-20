import { adjustName } from "@/utils/helpers"
import { Dex } from "@/utils/types"
import Progress from "./Progress"
import ShinyIcon from "@/components/ShinyIcon"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import ShareBtn from "./ShareBtn"
import { PencilIcon } from "@heroicons/react/24/solid"
import { Session } from "@supabase/supabase-js"
import DexForm from "./DexForm"

export default function DexHeader({
  pokedex, session
} : {
  pokedex: Dex,
  session: Session | null
}) {
  const pathname = usePathname()
  const { username, dex } = useParams()

  return (
    <>
      <div className="w-full flex flex-col items-center gap-2">
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              {dex ? (
                <h1 className="text-3xl">{pokedex.title}</h1>
              ) : (
                <>
                  <a href={`${pathname}/${pokedex.hash}`} className="text-2xl font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">{pokedex.title}</a>
                  {/* {session && session.user.id === pokedex.user_id && (
                    <button
                      type="button"
                      className="text-gray-500 dark:text-gray-400 bg-transparent hover:text-gray-900 rounded-full text-sm w-9 h-9 ms-auto inline-flex justify-center items-center dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                      onClick={() => console.log("edit", pokedex)}
                    >
                      <PencilIcon className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )} */}
                  {session && session.user.id === pokedex.user_id && (
                    <DexForm session={session} pokedex={pokedex} />
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {pokedex.shiny && <ShinyIcon />}
              <p className="hidden sm:flex w-30 py-2 px-3 text-sm rounded-full bg-btn-background">
                {pokedex.type}
              </p>
              <p className="hidden sm:flex w-30 py-2 px-3 text-sm rounded-full bg-btn-background">
                {adjustName(pokedex.game)}
              </p>
            </div>
          </div>
          {dex && (
            <div className="w-full flex items-center justify-between">
              <a href={`/user/${username}`} className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">/user/{username}</a>
              <ShareBtn url={`https://poketracker-one.vercel.app${pathname}`} />
            </div>
          )}
        </div>
        <Progress captured={pokedex.captured} entries={pokedex.entries} />
      </div>
      {/* {!dex && session && session.user.id === pokedex.user_id && (
        <DexForm session={session} pokedex={pokedex} />
      )} */}
    </>
  )
}