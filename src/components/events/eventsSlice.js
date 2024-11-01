import api from "../../store/api";

const eventApi = api.injectEndpoints({
  endpoints: (build) => ({
    getEvents: build.query({
      query: () => "/events",
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
      providesTags: ["Events"],
    }),
    getEvent: build.query({
      query: (id) => `/events/${id}`,
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
      providesTags: ["Events"],
    }),
    updateEvent: build.mutation({
      query: (id, userAttending) => ({
        url: `/events/${id}`,
        method: "PATCH",
        body: userAttending,
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
      invalidatesTags: ["Events"],
    }),
  }),
});

export const { useGetEventsQuery, useGetEventQuery, useUpdateEventMutation } =
  eventApi;
