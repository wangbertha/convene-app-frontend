import { createSlice } from "@reduxjs/toolkit";
import api from "../../store/api";

//auth endpoints: register, login
const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    //register
    register: builder.mutation({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    //login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;

//session token
const TOKEN_KEY = "token";

//store token in state and session
const storeToken = (state, { payload }) => {
  state.token = payload.token;
  sessionStorage.setItem(TOKEN_KEY, payload.token);
};

//slice for JWT from API
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: sessionStorage.getItem(TOKEN_KEY),
    selectedUserUd: null, //Stores the users id in state
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      sessionStorage.removeItem(TOKEN_KEY);
    },
    setUserId: (state, { payload }) => {
      state.selectedUserUd = payload.userId;
    },
  },
  //update token and LogedUserId for mutations
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        sessionStorage.setItem(TOKEN_KEY, payload.token);
        state.selectedUserId = payload.userId; // Store userId after login
      }
    );
    builder.addMatcher(
      api.endpoints.register.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        sessionStorage.setItem(TOKEN_KEY, payload.token);
        state.selectedUserId = payload.userId; // Store userId after registration
      }
    );
  },
});

//exports
export const { logout, setUserId } = authSlice.actions;

export const selectToken = (state) => state.auth.token;
export const selectUserId = (state) => state.auth.selectedUserUd;
export default authSlice.reducer;
