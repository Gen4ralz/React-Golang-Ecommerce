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
          const { selected, token } = cartData;
          return {
            headers: {
              authorization: `Bearer ${token}`,
            },
            url: '/cart/saveCart',
            method: 'POST',
            body: selected,
            credential: 'include',
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
