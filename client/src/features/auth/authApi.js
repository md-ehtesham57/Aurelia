import { apiSlice } from '../apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getMe: builder.query({
      query: () => '/users/me',
    }),
    updateMe: builder.mutation({
      query: (data) => ({
        url: '/users/me',
        method: 'PATCH',
        body: data,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: data,
      }),
    }),
    resendVerification: builder.mutation({
      query: (data) => ({
        url: '/auth/resend-verification',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    getWishlist: builder.query({
      query: () => '/users/wishlist',
      providesTags: ['Wishlist'],
    }),
    toggleWishlist: builder.mutation({
      query: (productId) => ({
        url: '/users/wishlist',
        method: 'POST',
        body: { productId },
      }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
});

export const {
  useLoginMutation, useRegisterMutation, useLogoutMutation, useGetMeQuery,
  useForgotPasswordMutation, useResetPasswordMutation,
  useGetWishlistQuery, useToggleWishlistMutation, useUpdateMeMutation,
  useVerifyEmailMutation, useResendVerificationMutation,
} = authApi;
