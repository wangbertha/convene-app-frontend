import api from "../../store/api";

const userApi = api.injectEndpoints({
    endpoints: (build) => ({
        getUsers: build.query({
            query: () => "/users",
            providesTags: ["User"],
        }),
        getUser: build.query({
            query: (id) => "/users/" + id,
            providesTags: ["User"],
        }),
        updateUser: build.mutation({
            query: ({ id, email, firstname, lastname, profilePicture, bio, city, state, age, gender, genderPreference, lookingFor, profileActive }) => ({
                url: "/users/" + id,
                method: "PATCH",
                body: { email, firstname, lastname, profilePicture, bio, city, state, age, gender, genderPreference, lookingFor, profileActive },
            }),
            invalidatesTags: ["User"],
        }),
        deleteUser: build.mutation({
            query: (id) => ({
                url: "/users/" + id,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userApi;