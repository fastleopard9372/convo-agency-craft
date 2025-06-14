
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { supabase } from '@/integrations/supabase/client'
import { setToken, logout, setUser, setLoading } from '@/store/slices/authSlice'
import type { User, Session } from '@supabase/supabase-js'

export const useAuth = () => {
  const [user, setUserState] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoadingState] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setUserState(session?.user ?? null)
        
        if (session?.access_token) {
          dispatch(setToken(session.access_token))
          // Convert Supabase user to our User interface
          if (session.user) {
            const appUser = {
              id: session.user.id,
              email: session.user.email || '',
              username: session.user.user_metadata?.username,
              settings: {},
              memoryQuotaMb: 1000, // Default value
              createdAt: session.user.created_at,
              updatedAt: session.user.updated_at || session.user.created_at,
            }
            dispatch(setUser(appUser))
          }
        } else {
          dispatch(logout())
        }
        
        setLoadingState(false)
        dispatch(setLoading(false))
      }
    )

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUserState(session?.user ?? null)
      
      if (session?.access_token) {
        dispatch(setToken(session.access_token))
        if (session.user) {
          const appUser = {
            id: session.user.id,
            email: session.user.email || '',
            username: session.user.user_metadata?.username,
            settings: {},
            memoryQuotaMb: 1000, // Default value
            createdAt: session.user.created_at,
            updatedAt: session.user.updated_at || session.user.created_at,
          }
          dispatch(setUser(appUser))
        }
      }
      
      setLoadingState(false)
      dispatch(setLoading(false))
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
