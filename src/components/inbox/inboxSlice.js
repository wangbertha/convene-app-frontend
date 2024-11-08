import { createSlice } from "@reduxjs/toolkit";

const inboxSlice = createSlice({
    name: "inbox",
    initialState: {
        activeConversation: null,
        messages: {},
        conversations: [],
    },
    reducers: {
        setActiveConversation: (state, action) => {
            state.activeConversation = action.payload;
        },
        addMessage: (state, action) => {
            const { conversationId, message } = action.payload;
            if (!state.messages[conversationId]) {
                state.messages[conversationId] = [];
            }
            state.messages[conversationId].push(message);
        },
    },
});

export const { 
    setActiveConversation, 
    addMessage 
} = inboxSlice.actions;
export default inboxSlice.reducer;
