import { configureStore } from "@reduxjs/toolkit";

import api from "./api";
import authReducer from "../components/auth/authSlice";
import inboxReducer from "../components/inbox/inboxSlice";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    inbox: inboxReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
