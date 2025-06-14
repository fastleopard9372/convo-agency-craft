
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { RootState, AppDispatch } from '@/store'
import { fetchConversations, createConversation, setCurrentConversation } from '@/store/slices/conversationsSlice'
import { formatDistanceToNow } from 'date-fns'

interface ConversationListProps {
  onSelectConversation: (conversationId: string) => void
  selectedConversationId: string | null
}

export const ConversationList = ({ onSelectConversation, selectedConversationId }: ConversationListProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { conversations, isLoading } = useSelector((state: RootState) => state.conversations)

  useEffect(() => {
    dispatch(fetchConversations())
  }, [dispatch])

  const handleNewConversation = () => {
    dispatch(createConversation({
      summary: 'New Conversation',
      status: 'active',
      metadata: {}
    }))
  }

  const handleSelectConversation = (conversation: any) => {
    dispatch(setCurrentConversation(conversation))
    onSelectConversation(conversation.id)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <Button onClick={handleNewConversation} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`p-3 cursor-pointer transition-colors hover:bg-accent ${
                  selectedConversationId === conversation.id ? 'bg-accent' : ''
                }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {conversation.summary || `Conversation ${conversation.id.slice(0, 8)}`}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {conversation.messageCount} messages
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
