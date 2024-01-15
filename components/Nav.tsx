import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { cookies } from 'next/headers'
import AuthButton from './AuthButton'
import DeployButton from './DeployButton'

export default async function Nav() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
  .from('profiles')
  .select()
  .eq('id', user?.id)
  .single()

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 sticky top-0 bg-background">
      <div className="w-full max-w-4xl flex items-center justify-between p-3 text-sm gap-2">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="py-2 px-3 flex rounded-md no-underline hover:bg-btn-background-hover border"
          >
            PokéTracker
          </Link>
          {profile && 
            <>
              <Link
                href={`/user/${profile.username}`}
                className="py-2 px-3 flex rounded-md no-underline hover:bg-btn-background-hover border"
              >
                Profile
              </Link>
              <Link
                href="/account"
                className="py-2 px-3 flex rounded-md no-underline hover:bg-btn-background-hover border"
              >
                Account
              </Link>
            </>
          }
        </div>
        {/* <DeployButton /> */}
        <AuthButton />
      </div>
    </nav>
  )
}