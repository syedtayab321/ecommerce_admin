import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getOrCreateConversation,
  sendMessageService,
  markMessagesAsReadService,
  deleteMessageService,
  getUserConversations,
  getConversationMessages
} from '../services/messageService';

// Define all async thunks at the top level
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ conversationId, senderId, text }, { rejectWithValue }) => {
    try {
      const messageId = await sendMessageService(conversationId, senderId, text);
      return { conversationId, messageId, text };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAsRead = createAsyncThunk( // Renamed to avoid conflict
  'messages/markAsRead',
  async ({ conversationId, userId }, { rejectWithValue }) => {
    try {
      await markMessagesAsReadService(conversationId, userId);
      return { conversationId, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMessageThunk = createAsyncThunk( // Renamed to avoid conflict
  'messages/deleteMessage',
  async ({ conversationId, messageId, userId }, { rejectWithValue }) => {
    try {
      await deleteMessageService(conversationId, messageId, userId);
      return { messageId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  error: null,
  success: false
};

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    resetMessagingState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Send message cases
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark messages as read cases
      .addCase(markAsRead.fulfilled, (state) => { // Updated to use renamed thunk
        state.messages = state.messages.map(msg => ({
          ...msg,
          read: msg.senderId !== state.currentUser?.uid ? true : msg.read
        }));
      })

      // Delete message cases
      .addCase(deleteMessageThunk.fulfilled, (state, action) => { // Updated to use renamed thunk
        state.messages = state.messages.filter(msg => msg.id !== action.payload.messageId);
      });
  }
});

// Regular action creators
export const startConversation = (currentUserId, otherUserId) => async (dispatch) => {
  try {
    const conversationId = await getOrCreateConversation(currentUserId, otherUserId);
    dispatch(messagingSlice.actions.setCurrentConversation(conversationId));
    return conversationId;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
};

export const listenToUserConversations = (userId) => (dispatch) => {
  return getUserConversations(userId, (conversations) => {
    dispatch(messagingSlice.actions.setConversations(conversations));
  });
};

export const listenToConversationMessages = (conversationId, userId) => (dispatch) => {
  return getConversationMessages(conversationId, userId, (messages) => {
    dispatch(messagingSlice.actions.setMessages(messages));
  });
};

export const { 
  resetMessagingState, 
  setCurrentConversation, 
  clearCurrentConversation,
  setConversations,
  setMessages
} = messagingSlice.actions;

export default messagingSlice.reducer;