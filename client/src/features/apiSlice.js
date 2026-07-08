import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery({ url: '/auth/refresh-token', method: 'POST' }, api, extraOptions);
    if (refreshResult.data) {
      localStorage.setItem('accessToken', refreshResult.data.data.accessToken);
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Products', 'Product', 'Categories', 'Cart', 'Orders', 'Order',
    'Reviews', 'Coupons', 'Users', 'Roles', 'Banners', 'GoldRates', 'Wishlist',
  ],
  endpoints: (builder) => ({}),
});
