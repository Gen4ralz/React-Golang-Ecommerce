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
            url: '/auth/order/placeOrder',
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
            url: `/auth/order/getOrder/${order_id}`,
          }
        },
      }),
      ApplyCoupon: builder.mutation({
        query: (couponData) => {
          const { token, coupon } = couponData
          return {
            headers: {
              authorization: `Bearer ${token}`,
            },
            url: `/auth/coupon/apply`,
            method: 'POST',
            body: coupon,
            credential: 'include',
          }
        },
      }),
    }
  },
})

export const {
  useSaveOrderMutation,
  useGetOrderQuery,
  useApplyCouponMutation,
} = orderService
export default orderService
