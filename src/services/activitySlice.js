import api from "../store/api";

const activityApi = api.injectEndpoints({
  endpoints: (build) => ({
    getActivities: build.query({
      query: () => "/activities",
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
      providesTags: ["Activity"],
    }),
    getActivity: build.query({
      query: (id) => `/activities/${id}`,
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
      providesTags: ["Activity"],
    }),
    updateActivity: build.mutation({
      query: ({ id, saved }) => ({
        url: `/activities/${id}`,
        method: "PATCH",
        body: { saved },
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
      invalidatesTags: ["Activity", "User"],
    }),
  }),
});

export const { 
  useGetActivitiesQuery,
  useGetActivityQuery,
  useUpdateActivityMutation,
} = activityApi;
