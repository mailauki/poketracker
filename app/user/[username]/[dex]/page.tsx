import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Pokedex from './Pokedex'
import { Captured, Dex } from '@/utils/types'

export default async function Page({
  params: { username, dex }
}: {
  params: { username: string, dex: string }
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: pokedex } = await supabase
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
    hash,
    username,
    user_id
  `)
  .eq('username', username)
  .eq('hash', dex)
  .returns<Dex>()
  .single()

  if (!pokedex) {
    notFound()
  }
  
  const { data: capturedPokemon } = await supabase
  .from('captured_pokemon')
  .select()
  .eq('pokedex', pokedex.id)
  .eq('user_id', pokedex.user_id)
  .returns<Captured[]>()

  return (
    <Pokedex
      serverPokedex={pokedex!}
      serverCapturedPokemon={capturedPokemon!}
    />
  )
  // return <pre>{JSON.stringify(capturedPokemon, null, 2)}</pre>
}