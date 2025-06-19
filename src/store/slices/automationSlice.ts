import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AutomationStatus, ChatMessage } from '../../automation/types';

// Note: ConversationListener import moved to avoid circular dependencies
// We'll instantiate it in the thunks directly

interface AutomationState {
  isActive: boolean;
  status: AutomationStatus;
  recentMessages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AutomationState = {
  isActive: false,
  status: {
    isInitialized: false,
    isListening: false,
    messagesSeen: 0,
    lastActivity: null
  },
  recentMessages: [],
  isLoading: false,
  error: null
};

// Store listener instance globally to avoid issues with module loading
let listenerInstance: any = null;

export const startAutomation = createAsyncThunk(
  'automation/start',
  async (url?: string, { rejectWithValue }) => {
    try {
      // Dynamic import to avoid circular dependency issues
      const { ConversationListener } = await import('../../automation/listener');
      
      if (!listenerInstance) {
        listenerInstance = new ConversationListener();
        
        // Set up message callback to update Redux store
        listenerInstance.setMessageCallback(async (message: ChatMessage) => {
          // You can dispatch actions here if needed
          console.log('New message received:', message);
        });
      }
      
      await listenerInstance.initialize(url);
      await listenerInstance.startListening();
      
      return listenerInstance.getStatus();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to start automation');
    }
  }
);

export const stopAutomation = createAsyncThunk(
  'automation/stop',
  async (_, { rejectWithValue }) => {
    try {
      if (listenerInstance) {
        listenerInstance.stopListening();
        await listenerInstance.shutdown();
        listenerInstance = null;
      }
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to stop automation');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'automation/sendMessage',
  async ({ message, options }: { message: string; options?: any }, { rejectWithValue }) => {
    try {
      if (!listenerInstance) {
        throw new Error('Automation not initialized');
      }
      
      await listenerInstance.sendReply(message, options);
      return { message, timestamp: new Date().toISOString() };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

export const getAutomationStatus = createAsyncThunk(
  'automation/getStatus',
  async (_, { rejectWithValue }) => {
    try {
      if (!listenerInstance) {
        return {
          isInitialized: false,
          isListening: false,
          messagesSeen: 0,
          lastActivity: null
        };
      }
      
      return listenerInstance.getStatus();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get status');
    }
  }
);

export const replyToSender = createAsyncThunk(
  'automation/replyToSender',
  async ({ senderName, message }: { senderName: string; message: string }, { rejectWithValue }) => {
    try {
      if (!listenerInstance) {
        throw new Error('Automation not initialized');
      }
      
      const success = await listenerInstance.replyToSender(senderName, message);
      if (!success) {
        throw new Error(`Failed to reply to ${senderName}`);
      }
      
      return { senderName, message, timestamp: new Date().toISOString() };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to reply to sender');
    }
  }
);

const automationSlice = createSlice({
  name: 'automation',
  initialState,
  reducers: {
    updateStatus: (state, action: PayloadAction<AutomationStatus>) => {
      state.status = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.recentMessages.unshift(action.payload);
      // Keep only last 50 messages
      if (state.recentMessages.length > 50) {
        state.recentMessages = state.recentMessages.slice(0, 50);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.recentMessages = [];
    },
    setAutoRespond: (state, action: PayloadAction<boolean>) => {
      // This would need to be implemented in the listener
      // For now, just store the preference
      state.status = { ...state.status };
    }
  },
  extraReducers: (builder) => {
    builder
      // Start Automation
      .addCase(startAutomation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startAutomation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isActive = true;
        state.status = action.payload;
        state.error = null;
      })
      .addCase(startAutomation.rejected, (state, action) => {
        state.isLoading = false;
        state.isActive = false;
        state.error = action.payload as string || 'Failed to start automation';
      })
      
      // Stop Automation
      .addCase(stopAutomation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(stopAutomation.fulfilled, (state) => {
        state.isLoading = false;
        state.isActive = false;
        state.status = initialState.status;
        state.error = null;
      })
      .addCase(stopAutomation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to stop automation';
      })
      
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Add sent message to recent messages
        const sentMessage: ChatMessage = {
          sender: 'assistant',
          content: action.payload.message,
          timestamp: new Date(action.payload.timestamp),
          messageId: `sent_${Date.now()}`
        };
        state.recentMessages.unshift(sentMessage);
        if (state.recentMessages.length > 50) {
          state.recentMessages = state.recentMessages.slice(0, 50);
        }
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to send message';
      })
      
      // Get Status
      .addCase(getAutomationStatus.fulfilled, (state, action) => {
        state.status = action.payload;
      })
      .addCase(getAutomationStatus.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to get status';
      })
      
      // Reply to Sender
      .addCase(replyToSender.pending, (state) => {
        state.error = null;
      })
      .addCase(replyToSender.fulfilled, (state, action) => {
        // Add reply to recent messages
        const replyMessage: ChatMessage = {
          sender: 'assistant',
          content: `To ${action.payload.senderName}: ${action.payload.message}`,
          timestamp: new Date(action.payload.timestamp),
          messageId: `reply_${Date.now()}`
        };
        state.recentMessages.unshift(replyMessage);
        if (state.recentMessages.length > 50) {
          state.recentMessages = state.recentMessages.slice(0, 50);
        }
        state.error = null;
      })
      .addCase(replyToSender.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to reply to sender';
      });
  }
});

export const { 
  updateStatus, 
  addMessage, 
  clearError, 
  clearMessages, 
  setAutoRespond 
} = automationSlice.actions;

export default automationSlice.reducer;

// Selector helpers
export const selectAutomationState = (state: { automation: AutomationState }) => state.automation;
export const selectIsAutomationActive = (state: { automation: AutomationState }) => state.automation.isActive;
export const selectAutomationStatus = (state: { automation: AutomationState }) => state.automation.status;
export const selectRecentMessages = (state: { automation: AutomationState }) => state.automation.recentMessages;
export const selectAutomationError = (state: { automation: AutomationState }) => state.automation.error;