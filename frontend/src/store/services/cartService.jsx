import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cartService = createApi({
  reducerPath: 'cart',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  endpoints: (builder) => {
    return {
      SaveCart: builder.mutation({
        query: (cartData) => {
          return {
            url: '/cart/saveCart',
            method: 'POST',
            body: cartData,
          };
        },
      }),
      GetCart: builder.mutation({
        query: (cartData) => {
          return {
            url: '/cart/getCart',
            method: 'POST',
            body: cartData,
          };
        },
      }),
    };
  },
});

export const { useSaveCartMutation, useGetCartMutation } = cartService;
export default cartService;
