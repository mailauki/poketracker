import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
  .from('profiles')
  .select()
  .eq('id', user!.id)
  .single()

  // const { data: { session } } = await supabase.auth.getSession()

  return <pre>{JSON.stringify(profile, null, 2)}</pre>
}