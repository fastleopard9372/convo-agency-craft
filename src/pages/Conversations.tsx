
import { useState } from 'react'
import { ConversationList } from '@/components/chat/ConversationList'
import { ChatInterface } from '@/components/chat/ChatInterface'

export const Conversations = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversation List Sidebar */}
      <div className="w-80 border-r bg-background">
        <ConversationList
          onSelectConversation={setSelectedConversationId}
          selectedConversationId={selectedConversationId}
        />
      </div>

      {/* Chat Interface */}
      <div className="flex-1">
        <ChatInterface conversationId={selectedConversationId} />
      </div>
    </div>
  )
}
