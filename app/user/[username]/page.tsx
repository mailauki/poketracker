import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Pokedexes from './Pokedexes'
import { Dex } from '@/utils/types'
import { notFound } from 'next/navigation'

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
    username,
    user_id
  `)
  .eq('username', username)
  .returns<Dex[]>()

  if (!pokedexes) {
    notFound()
  }

  return (
    <Pokedexes serverPokedexes={pokedexes} />
  )
}