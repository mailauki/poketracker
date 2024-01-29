import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Pokedexes from './Pokedexes'
import { Dex } from '@/utils/types'
import DexForm from './DexForm'
import { Metadata } from 'next'

type Props = {
  params: { username: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { username } = params

  return {
    title: `${username}'s Profile` || 'Profile',
  }
}

export default async function Page({
  params: { username }
}: {
  params: { username: string }
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { session } } = await supabase.auth.getSession()

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
    hash,
    username,
    user_id
  `)
  .eq('username', username)
  .returns<Dex[]>()

  return pokedexes && (
    <>
      <Pokedexes serverPokedexes={pokedexes} session={session} />
      {session && session.user.id === pokedexes[0].user_id && (
        <DexForm session={session} pokedex={null} />
      )}
    </>
  )
}