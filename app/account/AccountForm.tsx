'use client'

import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { useCallback, useEffect, useState } from "react"

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: string | null
    avatar_url: string | null
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        username,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
      <label className="text-md" htmlFor="email">Email</label>
      <input
        className="rounded-md px-4 py-2 bg-inherit border mb-6" 
        id="email"
        type="text"
        value={user?.email}
        disabled
      />

      <label className="text-md" htmlFor="username">Username</label>
      <input
        className="rounded-md px-4 py-2 bg-inherit border mb-6"
        id="username"
        type="text"
        value={username || ''}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button
        className="bg-blue-600 rounded-md px-4 py-2 text-foreground mb-2"
        onClick={() => updateProfile({ username, avatar_url })}
        disabled={loading}
      >
        {loading ? 'Loading ...' : 'Update'}
      </button>
    </form>
  )
}