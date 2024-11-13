import api from "../store/api";

const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    getUsers: build.query({
      query: () => "/users",
      providesTags: ["User"],
    }),
    getUser: build.query({
      query: (id) => "/users/" + id,
      providesTags: ["User"],
    }),
    updateMe: build.mutation({
      query: ({
        email,
        firstname,
        lastname,
        profilePicture,
        bio,
        city,
        state,
        age,
        gender,
        genderPreference,
        lookingFor,
        profileActive,
        interestToConnect,
        interestToDisconnect,
      }) => ({
        url: "/users/me",
        method: "PATCH",
        body: {
          email,
          firstname,
          lastname,
          profilePicture,
          bio,
          city,
          state,
          age,
          gender,
          genderPreference,
          lookingFor,
          profileActive,
          interestToConnect,
          interestToDisconnect,
        },
      }),
      invalidatesTags: ["User"],
    }),
    deleteMe: build.mutation({
      query: () => ({
        url: "/users/me",
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updatePassword: build.mutation({
      query: ({ currentPassword, newPassword }) => ({
        url: "users/me/password",
        method: "PATCH",
        body: {
          currentPassword,
          newPassword,
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateMeMutation,
  useDeleteMeMutation,
  useUpdatePasswordMutation,
} = userApi;
