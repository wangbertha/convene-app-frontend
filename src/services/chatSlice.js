import api from "../store/api";

const chatApi = api.injectEndpoints({
  endpoints: (build) => ({
    createChat: build.mutation({
      query: ({ firstId, secondId }) => ({
        url: "/chats",
        method: "POST",
        body: { firstId, secondId },
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
      invalidatesTags: ["Chats"],
    }),
    getUserChats: build.query({
      query: () => "/chats/user-chats",
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
      providesTags: ["Chats"],
    }),
    getChat: build.query({
      query: ({ firstId, secondId }) => ({
        url: "/chats",
        method: "GET",
        body: { firstId, secondId },
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
      providesTags: ["Chats"],
    }),
    deleteChat: build.mutation({
      query: (id) => ({
        url: `/chats/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
      providesTags: ["Chats"],
    }),
  }),
});

export const {
  useCreateChatMutation,
  useGetUserChatsQuery,
  useGetChatQuery,
  useDeleteChatMutation,
} = chatApi;
