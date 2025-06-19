
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  FileText, 
  Settings,
  Brain,
  Bot
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Conversations', href: '/conversations', icon: MessageSquare },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Proposals', href: '/proposals', icon: FileText },
  { name: 'Automation', href: '/automation', icon: Bot },
  { name: 'AI Assistant', href: '/ai-assistant', icon: Brain },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center">
          <Brain className="h-8 w-8 text-primary" />
          <span className="ml-2 text-lg font-semibold">FreelanceAI</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
