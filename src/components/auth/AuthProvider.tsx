
import { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  useAuth() // This hook handles all auth state management
  
  return <>{children}</>
}
