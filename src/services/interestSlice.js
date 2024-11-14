import api from "../store/api";

const interestApi = api.injectEndpoints({
    endpoints: (build) => ({
        getInterests: build.query({
            query: () => "/interests",
            providesTags: ["Interest"],
        }),
        addInterest: build.mutation({
            query: ({ interest }) => ({
                url: "/interests",
                method: "POST",
                body: { interest },
            }),
            invalidatesTags: ["Interest"],
        }),
    }),
});

export const {
    useGetInterestsQuery,
    useAddInterestMutation,
} = interestApi;