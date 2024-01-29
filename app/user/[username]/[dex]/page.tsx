import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Pokedex from './Pokedex'
import { Captured } from '@/utils/types'
import { Metadata } from 'next'

type Props = {
  params: { username: string, dex: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { username, dex } = params

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: pokedex } = await supabase
  .from('pokedexes')
  .select('title')
  .eq('username', username)
  .eq('hash', dex)
  .single()

  return {
    title: pokedex?.title || 'Dex',
  }
}

export default async function Page({
  params: { username, dex }
}: {
  params: { username: string, dex: string }
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { session } } = await supabase.auth.getSession()

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
  // .returns<Dex>()
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
      serverPokedex={pokedex}
      serverCapturedPokemon={capturedPokemon!}
      session={session}
    />
  )
}