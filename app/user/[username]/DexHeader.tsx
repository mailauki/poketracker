import { adjustName } from "@/utils/helpers"
import { Dex } from "@/utils/types"
import Progress from "./Progress"
import ShinyIcon from "@/components/ShinyIcon"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import ShareBtn from "./ShareBtn"

export default function DexHeader({ pokedex } : { pokedex: Dex }) {
  const pathname = usePathname()
  const { username, dex } = useParams()

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex items-center justify-between">
          <h1 className={dex ? "text-3xl" : "text-xl"}>{pokedex.title}</h1>
          <div className="flex items-center gap-2">
            {pokedex.shiny && <ShinyIcon />}
            <p className="w-30 py-2 px-3 flex text-sm rounded-full bg-btn-background">
              {pokedex.type}
            </p>
            <p className="w-30 py-2 px-3 flex text-sm rounded-full bg-btn-background">
              {adjustName(pokedex.game)}
            </p>
          </div>
        </div>
        {dex && (
          <div className="w-full flex items-center justify-between">
            <Link href={`/user/${username}`} className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">/user/{username}</Link>
            <ShareBtn url={`https://poketracker-one.vercel.app${pathname}`} />
          </div>
        )}
      </div>
      <Progress captured={pokedex.captured} entries={pokedex.entries} />
    </div>
  )
}