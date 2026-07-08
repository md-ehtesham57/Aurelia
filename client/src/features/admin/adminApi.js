import { apiSlice } from '../apiSlice';

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: '/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Categories'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Categories'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
    getUsers: builder.query({
      query: (params) => ({
        url: '/users',
        params,
      }),
      providesTags: ['Users'],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, roleId }) => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
        body: { roleId },
      }),
      invalidatesTags: ['Users'],
    }),
    getRoles: builder.query({
      query: () => '/roles',
      providesTags: ['Roles'],
    }),
    createRole: builder.mutation({
      query: (data) => ({
        url: '/roles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Roles'],
    }),
    updateRolePermissions: builder.mutation({
      query: ({ id, permissions }) => ({
        url: `/roles/${id}/permissions`,
        method: 'PATCH',
        body: { permissions },
      }),
      invalidatesTags: ['Roles'],
    }),
    getBanners: builder.query({
      query: (all) => `/banners${all ? '?all=true' : ''}`,
      providesTags: ['Banners'],
    }),
    getAdminBanners: builder.query({
      query: () => '/banners?all=true',
      providesTags: ['Banners'],
    }),
    createBanner: builder.mutation({
      query: (data) => ({
        url: '/banners',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Banners'],
    }),
    updateBanner: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/banners/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Banners'],
    }),
    getGoldRates: builder.query({
      query: () => '/gold-rate',
      providesTags: ['GoldRates'],
    }),
    updateGoldRate: builder.mutation({
      query: (data) => ({
        url: '/gold-rate',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['GoldRates'],
    }),
    getCoupons: builder.query({
      query: () => '/coupons',
      providesTags: ['Coupons'],
    }),
    createCoupon: builder.mutation({
      query: (data) => ({
        url: '/coupons',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Coupons'],
    }),
    applyCoupon: builder.mutation({
      query: (data) => ({
        url: '/coupons/apply',
        method: 'POST',
        body: data,
      }),
    }),
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: '/upload/image',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRolePermissionsMutation,
  useGetBannersQuery,
  useGetAdminBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useGetGoldRatesQuery,
  useUpdateGoldRateMutation,
  useGetCouponsQuery,
  useCreateCouponMutation,
  useApplyCouponMutation,
  useUploadImageMutation,
} = adminApi;
