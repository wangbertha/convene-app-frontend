import { configureStore } from "@reduxjs/toolkit";

import api from "./api";
import authReducer from "../services/authSlice";
import inboxReducer from "../services/inboxSlice";

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
