import api from "../../store/api";

const inboxApi = api.injectEndpoints({
    endpoints: (build) => ({
        getMessages: build.query({
            query: (id) => `/messages/${id}`,
            transformResponse: (response) => response,
            transformErrorResponse: (response) => response,
            providesTags: ["Messages"],
        }),
        sendMessage: build.mutation({
            query: ({ senderId, receiverId, content }) => ({
                url: "/messages",
                method: "POST",
                body: { senderId, receiverId, content },
            }),
            transformResponse: (response) => response,
            transformErrorResponse: (response) => response,
            invalidatesTags: ["Messages"],
        }),
        getConversations: build.query({
            query: (id) => `/conversations/${id}`,
            transformResponse: (response) => response,
            transformErrorResponse: (response) => response,
            providesTags: ["Conversations"],
        }),
    }),
});

export const {
    useGetMessagesQuery,
    useSendMessageMutation,
    useGetConversationsQuery,
} = inboxApi;
export default inboxApi;