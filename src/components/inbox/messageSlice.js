import api from "../../store/api";

const messageApi = api.injectEndpoints({
  endpoints: (build) => ({
    sendMessage: build.mutation({
      query: ({ chatId, senderId, text }) => ({
        url: "/messages",
        method: "POST",
        body: { chatId, senderId, text },
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
      invalidatesTags: ["Messages"],
    }),
    getMessages: build.query({
      query: (chatId) => `/messages/${chatId}`,
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
      providesTags: ["Messages"],
    }),
  }),
});

export const { useSendMessageMutation, useGetMessagesQuery } = messageApi;
