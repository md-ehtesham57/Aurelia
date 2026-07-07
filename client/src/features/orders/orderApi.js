import { apiSlice } from '../apiSlice';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart', 'Orders'],
    }),
    getMyOrders: builder.query({
      query: () => '/orders/my-orders',
      providesTags: ['Orders'],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    getAllOrders: builder.query({
      query: (params) => ({
        url: '/orders/admin',
        params,
      }),
      providesTags: ['Orders'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status, note }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status, note },
      }),
      invalidatesTags: ['Orders', 'Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
