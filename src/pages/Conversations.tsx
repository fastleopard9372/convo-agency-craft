
import { useState } from 'react'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { ConversationSidebar } from '@/components/chat/ConversationSidebar'

export const Conversations = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="h-[calc(100vh-4rem)] flex relative overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64 border-r bg-background flex-shrink-0">
          <ConversationSidebar
            onSelectConversation={setSelectedConversationId}
            selectedConversationId={selectedConversationId}
            onCloseSidebar={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 relative">
        <ChatInterface 
          conversationId={selectedConversationId}
          onOpenSidebar={() => setSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
        />
      </div>
    </div>
  )
}
