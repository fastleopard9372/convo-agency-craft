
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, MessageSquare, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RootState, AppDispatch } from '@/store'
import { fetchConversations, createConversation, setCurrentConversation } from '@/store/slices/conversationsSlice'

interface ConversationSidebarProps {
  onSelectConversation: (conversationId: string) => void
  selectedConversationId: string | null
  onCloseSidebar: () => void
}

export const ConversationSidebar = ({ 
  onSelectConversation, 
  selectedConversationId,
  onCloseSidebar 
}: ConversationSidebarProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { conversations, isLoading } = useSelector((state: RootState) => state.conversations)

  useEffect(() => {
    dispatch(fetchConversations())
  }, [dispatch])

  const handleNewConversation = () => {
    const newConversation = {
      summary: 'New Conversation',
      status: 'active',
      metadata: {}
    }
    dispatch(createConversation(newConversation))
  }

  const handleSelectConversation = (conversation: any) => {
    dispatch(setCurrentConversation(conversation))
    onSelectConversation(conversation.id)
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-lg">Conversations</h2>
        <div className="flex items-center gap-2">
          <Button onClick={handleNewConversation} size="sm" variant="ghost">
            <Plus className="h-4 w-4" />
          </Button>
          <Button onClick={onCloseSidebar} size="sm" variant="ghost" className="md:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Loading...
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                  selectedConversationId === conversation.id 
                    ? 'bg-gray-200 dark:bg-gray-700' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="font-medium text-sm truncate">
                  {conversation.summary || `Conversation ${conversation.id.slice(0, 8)}`}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {conversation.messageCount} messages
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
