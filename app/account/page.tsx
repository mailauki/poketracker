import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import AccountForm from './AccountForm'

export default async function Page() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <AccountForm user={user} />
    </div>
  )
}