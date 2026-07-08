import { apiSlice } from '../apiSlice';

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: '/cart/items',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation({
      query: ({ itemId, qty }) => ({
        url: `/cart/items/${itemId}`,
        method: 'PATCH',
        body: { qty },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation({
      query: (itemId) => ({
        url: `/cart/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    mergeCart: builder.mutation({
      query: (sessionId) => ({
        url: '/cart/merge',
        method: 'POST',
        body: { sessionId },
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useMergeCartMutation,
} = cartApi;
