import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'

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
    hash
  `)
  .eq('username', username)
  .eq('hash', dex)
  .single()

  return <pre>{JSON.stringify(pokedex, null, 2)}</pre>
}