
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MessageSquare, Plus, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RootState, AppDispatch } from '@/store'
import { fetchConversations } from '@/store/slices/conversationsSlice'
import { formatDistanceToNow } from 'date-fns'

export const Conversations = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { conversations, isLoading } = useSelector((state: RootState) => state.conversations)

  useEffect(() => {
    dispatch(fetchConversations())
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Conversations</h1>
          <p className="text-muted-foreground">
            Manage your AI-powered conversations and chat history
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading conversations...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {conversations.map((conversation) => (
            <Card key={conversation.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    {conversation.summary || `Conversation ${conversation.id.slice(0, 8)}`}
                  </CardTitle>
                  <Badge variant={conversation.status === 'active' ? 'default' : 'secondary'}>
                    {conversation.status}
                  </Badge>
                </div>
                <CardDescription>
                  {conversation.messageCount} messages • {conversation.totalTokens} tokens used
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    {conversation.messageCount}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {conversations.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No conversations yet</h3>
          <p className="text-muted-foreground">
            Start your first AI conversation to begin generating proposals and insights.
          </p>
        </div>
      )}
    </div>
  )
}
