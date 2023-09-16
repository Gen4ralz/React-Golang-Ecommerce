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
    }
  },
})

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useRemoveCategoryMutation,
} = dashboardService
export default dashboardService
