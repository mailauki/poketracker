import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Pokedexes from './Pokedexes'

export default async function Page({
  params: { username }
}: {
  params: { username: string }
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: pokedexes } = await supabase
  .from('pokedexes')
  .select(`
    id,
    title,
    game,
    type,
    shiny,
    captured,
    entries,
    number,
    hash
  `)
  .eq('username', username)

  // return <pre>{JSON.stringify(pokedexes, null, 2)}</pre>
  return pokedexes && (
    // <>
    //   {pokedexes.map((pokedex) => (
    //     <div key={pokedex.id}>
    //       <Link href={`/${pokedex.hash}`}>{pokedex.title}</Link>
    //     </div>
    //   ))}
    // </>
    <Pokedexes serverPokedexes={pokedexes} />
  )
}