import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChat: null,
  recipientUser: null,
  newMessage: null,
  onlineUsers: [],
};

const chatSlice = createSlice({
  name: "chatState",
  initialState,
  reducers: {
    setCurrentChat(state, action) {
      state.currentChat = action.payload;
    },
    setRecipient(state, action) {
      state.recipientUser = action.payload;
    },
    addMessage(state, action) {
      const message = action.payload;
      if (state.currentChat && state.currentChat.id === message.chatId) {
        if (!state.currentChat.messages) {
          state.currentChat.messages = [];
        }
        state.currentChat.messages.push(message);
      }
      state.newMessage = message;
    },
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setCurrentChat, setRecipient, addMessage, setOnlineUsers } =
  chatSlice.actions;

export default chatSlice.reducer;
