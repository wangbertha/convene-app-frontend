import { configureStore } from "@reduxjs/toolkit";
import api from "./api";
import authReducer from "../services/authSlice";
import chatStateReducer from "../services/chatStateSlice";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    chats: chatStateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
