import { apiSlice } from '../apiSlice';
import { setCart, clearCart } from './cartSlice';

const updateCartInSlice = async (_, { dispatch, queryFulfilled }) => {
  try {
    const { data } = await queryFulfilled;
    if (data?.data?.cart) {
      dispatch(setCart(data.data.cart));
    }
  } catch (error) {
    console.error("Cart sync failed:", error);
  }
};

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.cart) {
            dispatch(setCart(data.data.cart));
          }
        } catch {}
      },
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: '/cart/items',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart'],
      onQueryStarted: updateCartInSlice,
    }),
    updateCartItem: builder.mutation({
      query: ({ itemId, qty }) => ({
        url: `/cart/items/${itemId}`,
        method: 'PUT', 
        body: { qty },
      }),
      invalidatesTags: ['Cart'],
      onQueryStarted: updateCartInSlice,
    }),
    removeCartItem: builder.mutation({
      query: (itemId) => ({
        url: `/cart/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
      onQueryStarted: updateCartInSlice,
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