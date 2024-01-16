import { adjustName } from "@/utils/helpers"
import { Dex } from "@/utils/types"
import Progress from "./Progress"
import ShinyIcon from "@/components/ShinyIcon"

export default function DexHeader({ pokedex } : { pokedex: Dex }) {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-xl">{pokedex.title}</h1>
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
      <Progress captured={pokedex.captured} entries={pokedex.entries} />
    </div>
  )
}