
import { useState, useEffect, useRef } from 'react'
import { Send, Menu, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  conversationId: string | null
  onOpenSidebar: () => void
  sidebarOpen: boolean
}

export const ChatInterface = ({ conversationId, onOpenSidebar, sidebarOpen }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (conversationId) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'Hello! How can I help you today?',
          timestamp: new Date()
        }
      ])
    } else {
      setMessages([])
    }
  }, [conversationId])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Auto-resize textarea back to single line
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I understand your message. This is a simulated response for now.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  if (!conversationId) {
    return (
      <div className="flex flex-col h-full relative">
        {/* Header */}
        <div className="border-b p-4 flex items-center bg-background z-10">
          {!sidebarOpen && (
            <Button 
              onClick={onOpenSidebar} 
              size="sm" 
              variant="ghost"
              className="mr-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <h1 className="font-semibold">FreelanceAI</h1>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center pb-32">
          <div className="text-center max-w-md">
            <Bot className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
            <p className="text-muted-foreground mb-6">
              Select a conversation from the sidebar or start a new one to begin chatting.
            </p>
            <Button onClick={onOpenSidebar} variant="outline">
              <Menu className="h-4 w-4 mr-2" />
              Open Conversations
            </Button>
          </div>
        </div>

        {/* Fixed Input Area */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 z-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                placeholder="Message FreelanceAI..."
                className="flex-1 border-0 bg-transparent resize-none focus:ring-0 focus:outline-none min-h-[24px] max-h-[120px]"
                disabled={true}
                rows={1}
              />
              <Button
                onClick={handleSend}
                disabled={true}
                size="sm"
                className="rounded-md"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Start a conversation to begin chatting
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="border-b p-4 flex items-center bg-background z-10">
        {!sidebarOpen && (
          <Button 
            onClick={onOpenSidebar} 
            size="sm" 
            variant="ghost"
            className="mr-2"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        <h1 className="font-semibold">FreelanceAI</h1>
      </div>

      {/* Messages - with bottom padding to account for fixed input */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-4xl mx-auto p-4 pb-32">
            {messages.map((message) => (
              <div key={message.id} className="mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1">
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm mb-1">Assistant</div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Fixed Input Area */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 z-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Message FreelanceAI..."
              className="flex-1 border-0 bg-transparent resize-none focus:ring-0 focus:outline-none min-h-[24px] max-h-[120px]"
              disabled={isLoading}
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="rounded-md"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
