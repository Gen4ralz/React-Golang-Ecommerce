import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const orderService = createApi({
  reducerPath: 'order',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  endpoints: (builder) => {
    return {
      SaveOrder: builder.mutation({
        query: (orderData) => {
          return {
            url: '/order/saveOrder',
            method: 'POST',
            body: orderData,
          };
        },
      }),
      GetOrder: builder.mutation({
        query: (orderData) => {
          return {
            url: '/order/getOrder',
            method: 'POST',
            body: orderData,
          };
        },
      }),
    };
  },
});

export const { useSaveOrderMutation, useGetOrderMutation } = orderService;
export default orderService;
