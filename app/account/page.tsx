import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import AccountForm from './AccountForm'

export default async function Page() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  // const { data: { session } } = await supabase.auth.getSession()

  // const { data: profile } = await supabase
  // .from('profiles')
  // .select()
  // .eq('id', user?.id)
  // .single()

  // return <pre>{JSON.stringify(profile, null, 2)}</pre>
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>

      {/* <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        // action={signIn}
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          // value={username || ''}
          // onChange={(e) => setUsername(e.target.value)}
        />
        <button className="bg-blue-600 rounded-md px-4 py-2 text-foreground mb-2">
          Sign In
        </button>
      </form> */}
      <AccountForm user={user} />
    </div>
  )
}