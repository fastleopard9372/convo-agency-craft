
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  FileText, 
  Settings,
  Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Conversations', href: '/conversations', icon: MessageSquare },
  { name: 'Proposals', href: '/proposals', icon: FileText },
  { name: 'AI Assistant', href: '/ai-assistant', icon: Brain },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export const Sidebar = () => {
  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-card border-r pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6">
          <Brain className="h-8 w-8 text-primary" />
          <span className="ml-2 text-lg font-semibold">FreelanceAI</span>
        </div>
        <nav className="mt-8 flex-1 px-3 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
