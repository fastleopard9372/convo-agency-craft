
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { conversationsApi } from '@/services/api'
import { act } from 'react'

export interface Message {
  id?: string
  conversationId?: string
  role: 'user' | 'assistant'
  content: string,
  tokenCount?: number
  vectorId?: string
  metadata?: Record<string, any>
  timestamp?: string
}

export interface Conversation {
  id?: string
  sessionId?: string
  messageCount: number
  totalTokens: number
  status: string
  summary?: string
  metadata?: Record<string, any>
  startedAt?: string
  endedAt?: string
  createdAt?: string
  updatedAt?: string
  messages?: Message[]
}

interface ConversationsState {
  conversations: Conversation[]
  currentConversation: Conversation | null,
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

export const fetchConversationById = createAsyncThunk(
  'conversations/fetchConversation',
  async (id:string) => {
    const response = await conversationsApi.getConversationById(id)
    return response.data
  }
)

export const createConversation = createAsyncThunk(
  'conversations/createConversation',
  async (conversationData: Partial<Conversation>) => {
    const response = await conversationsApi.createConversation({
      conversationId: conversationData?.id,
      messages: conversationData?.messages,
      metadata: conversationData?.metadata
    })
    return response.data
  }
)

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    addMessage: (state, action) =>{
      state.currentConversation?.messages.push(action.payload);
      state.currentConversation.messageCount = state.currentConversation.messageCount +1;
    },
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
      .addCase(fetchConversationById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchConversationById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentConversation = action.payload.conversation
      })
      .addCase(fetchConversationById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch conversation'
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        const data = action.payload.data;
        const i = state.conversations?.findIndex(v=>v.id == data.conversation?.id);
        if(i == -1){
          state.conversations.unshift(data.conversation);
        }
        state.currentConversation.messageCount++;
        state.currentConversation.messages.push(data?.message);
      // state.conversations(action.payload.data.message)
      })
  },
})

export const { clearError, setCurrentConversation, addMessage } = conversationsSlice.actions
export default conversationsSlice.reducer
