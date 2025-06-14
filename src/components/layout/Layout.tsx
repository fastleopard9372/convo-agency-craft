
import { ReactNode, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { setTheme } from '@/store/slices/themeSlice'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const { theme } = useSelector((state: RootState) => state.theme)
  const dispatch = useDispatch()

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    
    // Save to localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    if (savedTheme && savedTheme !== theme) {
      dispatch(setTheme(savedTheme))
    }
  }, [dispatch, theme])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="lg:ml-64">
        <Header />
        <main className="p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
