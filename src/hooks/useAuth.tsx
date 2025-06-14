
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { supabase } from '@/integrations/supabase/client'
import { setToken, logout } from '@/store/slices/authSlice'
import type { User, Session } from '@supabase/supabase-js'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.access_token) {
          dispatch(setToken(session.access_token))
        } else {
          dispatch(logout())
        }
        
        setLoading(false)
      }
    )

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.access_token) {
        dispatch(setToken(session.access_token))
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  return {
    user,
    session,
    loading,
    signOut: () => supabase.auth.signOut()
  }
}
