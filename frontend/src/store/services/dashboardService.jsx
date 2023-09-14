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
            url: '/admin/categories',
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
            url: '/admin/createCategory',
            method: 'POST',
            body: name,
            credential: 'include',
          }
        },
      }),
    }
  },
})

export const { useGetCategoriesQuery, useCreateCategoryMutation } =
  dashboardService
export default dashboardService
