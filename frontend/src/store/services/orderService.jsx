import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const orderService = createApi({
  reducerPath: 'order',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  endpoints: (builder) => {
    return {
      SaveOrder: builder.mutation({
        query: (orderData) => {
          const { token, order } = orderData
          return {
            headers: {
              authorization: `Bearer ${token}`,
            },
            url: '/order/placeOrder',
            method: 'POST',
            body: order,
            credential: 'include',
          }
        },
      }),
      GetOrder: builder.query({
        query: (arg) => {
          const { token, order_id } = arg
          return {
            headers: {
              authorization: `Bearer ${token}`,
            },
            url: `/order/getOrder/${order_id}`,
          }
        },
      }),
    }
  },
})

export const { useSaveOrderMutation, useGetOrderQuery } = orderService
export default orderService
