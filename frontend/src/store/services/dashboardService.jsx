import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const dashboardService = createApi({
  reducerPath: 'dashboard',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  endpoints: (builder) => {
    return {
      GetCategories: builder.query({
        query: (arg) => {
          const { token } = arg
          return {
            headers: {
              authorization: `Bearer ${token}`,
            },
            url: '/auth/admin/categories',
          }
        },
      }),
      CreateCategory: builder.mutation({
        query: (data) => {
          const { name, token } = data
          return {
            headers: {
              authorization: `Bearer ${token}`,
            },
            url: '/auth/admin/createCategory',
            method: 'POST',
            body: name,
            credential: 'include',
          }
        },
      }),
      RemoveCategory: builder.mutation({
        query: (data) => {
          const { id, token } = data
          return {
            headers: {
              authorization: `Bearer ${token}`,
            },
            url: '/auth/admin/removeCategory',
            method: 'DELETE',
            body: id,
            credential: 'include',
          }
        },
      }),
      UpdateCategory: builder.mutation({
        query: (data) => {
          const { update, token } = data
          return {
            headers: {
              authorization: `Bearer ${token}`,
            },
            url: '/auth/admin/updateCategory',
            method: 'PUT',
            body: update,
            credential: 'include',
          }
        },
      }),
      GetCoupons: builder.query({
        query: (arg) => {
          const { token } = arg
          return {
            headers: {
              authorization: `Bearer ${token}`,
            },
            url: '/auth/admin/coupons',
          }
        },
      }),
      CreateCoupon: builder.mutation({
        query: (data) => {
          const { arg, token } = data
          return {
            headers: {
              authorization: `Bearer ${token}`,
            },
            url: '/auth/admin/createCoupon',
            method: 'POST',
            body: arg,
            credential: 'include',
          }
        },
      }),
      RemoveCoupon: builder.mutation({
        query: (data) => {
          const { id, token } = data
          return {
            headers: {
              authorization: `Bearer ${token}`,
            },
            url: '/auth/admin/removeCoupon',
            method: 'DELETE',
            body: id,
            credential: 'include',
          }
        },
      }),
      UpdateCoupon: builder.mutation({
        query: (data) => {
          const { arg, token } = data
          return {
            headers: {
              authorization: `Bearer ${token}`,
            },
            url: '/auth/admin/updateCoupon',
            method: 'PUT',
            body: arg,
            credential: 'include',
          }
        },
      }),
      GetProducts: builder.query({
        query: (arg) => {
          const { token } = arg
          return {
            headers: {
              authorization: `Bearer ${token}`,
            },
            url: '/auth/admin/products',
          }
        },
      }),
    }
  },
})

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useRemoveCategoryMutation,
  useUpdateCategoryMutation,
  useGetCouponsQuery,
  useCreateCouponMutation,
  useRemoveCouponMutation,
  useUpdateCouponMutation,
  useGetProductsQuery,
} = dashboardService
export default dashboardService
