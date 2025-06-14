
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { conversationsApi } from '@/services/api'

export interface Message {
  id: string
  conversationId: string
  role: string
  tokenCount?: number
  vectorId?: string
  metadata?: Record<string, any>
  timestamp: string
}

export interface Conversation {
  id: string
  userId: string
  sessionId?: string
  messageCount: number
  totalTokens: number
  status: string
  summary?: string
  metadata: Record<string, any>
  startedAt: string
  endedAt?: string
  createdAt: string
  updatedAt: string
  messages?: Message[]
}

interface ConversationsState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  isLoading: boolean
  error: string | null
}

const initialState: ConversationsState = {
  conversations: [],
  currentConversation: null,
  isLoading: false,
  error: null,
}

export const fetchConversations = createAsyncThunk(
  'conversations/fetchConversations',
  async () => {
    const response = await conversationsApi.getConversations()
    return response.data
  }
)

export const createConversation = createAsyncThunk(
  'conversations/createConversation',
  async (conversationData: Partial<Conversation>) => {
    const response = await conversationsApi.createConversation(conversationData)
    return response.data
  }
)

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false
        state.conversations = action.payload.data
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch conversations'
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.conversations.unshift(action.payload.data)
      })
  },
})

export const { clearError, setCurrentConversation } = conversationsSlice.actions
export default conversationsSlice.reducer
