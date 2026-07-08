import { apiSlice } from '../apiSlice';

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query({
      query: (productId) => `/reviews/product/${productId}`,
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: '/reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    getAllReviews: builder.query({
      query: (params) => ({
        url: '/reviews',
        params,
      }),
      providesTags: ['Reviews'],
    }),
    moderateReview: builder.mutation({
      query: ({ id, status }) => ({
        url: `/reviews/${id}/moderate`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Reviews'],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useGetAllReviewsQuery,
  useModerateReviewMutation,
} = reviewApi;
