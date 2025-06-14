
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MessageSquare, Plus, Send, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { RootState, AppDispatch } from '@/store'
import { fetchConversations, createConversation } from '@/store/slices/conversationsSlice'
import { formatDistanceToNow } from 'date-fns'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export const Conversations = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { conversations, isLoading } = useSelector((state: RootState) => state.conversations)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    dispatch(fetchConversations())
  }, [dispatch])

  const handleNewConversation = () => {
    const newConversation = {
      id: `conv-${Date.now()}`,
      summary: 'New Conversation',
      messageCount: 0,
      totalTokens: 0,
      status: 'active',
      updatedAt: new Date().toISOString()
    }
    dispatch(createConversation(newConversation))
    setSelectedConversation(newConversation.id)
    setMessages([])
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: 'This is a simulated AI response. In a real implementation, this would connect to your AI service.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r bg-muted/30 overflow-hidden`}>
        <div className="p-4 border-b">
          <Button onClick={handleNewConversation} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            New Conversation
          </Button>
        </div>
        
        <div className="p-4 space-y-2">
          {conversations.map((conversation) => (
            <Card 
              key={conversation.id} 
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedConversation === conversation.id ? 'bg-muted border-primary' : ''
              }`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-medium">
                    {conversation.summary || `Conversation ${conversation.id.slice(0, 8)}`}
                  </CardTitle>
                  <Badge variant={conversation.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {conversation.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  {conversation.messageCount} messages • {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {conversations.length === 0 && !isLoading && (
          <div className="p-4 text-center text-muted-foreground">
            <MessageSquare className="mx-auto h-8 w-8 mb-2" />
            <p className="text-sm">No conversations yet</p>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">
              {selectedConversation ? 'Chat' : 'Conversations'}
            </h1>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {!selectedConversation ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your first AI conversation to begin generating proposals and insights.
                </p>
                <Button onClick={handleNewConversation}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Conversation
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-2">
                      {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Input - Fixed at Bottom */}
        {selectedConversation && (
          <div className="border-t p-4 bg-background">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="min-h-[50px] max-h-[200px] resize-none"
                    rows={1}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  size="sm"
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
