import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const productService = createApi({
  reducerPath: 'products',
  tagTypes: 'products',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const reducers = getState();
      const token = reducers?.authReducer?.userSession?.access_token;
      headers.set('Content-Type', 'application/json');
      headers.set('authorization', token ? `Bearer ${token}` : '');
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
      get: builder.query({
        query: () => {
          return {
            url: '/product/getAllProducts',
            method: 'GET',
          };
        },
      }),
      getOneBySlug: builder.query({
        query: (arg) => {
          const { slug, style, size } = arg;
          return {
            url: `/product/getProductBySlug/${slug}`,
            params: { style, size },
          };
        },
      }),
      getOneById: builder.query({
        query: (arg) => {
          const { id, style, size } = arg;
          return {
            url: `/product/getProductById/${id}`,
            params: { style, size },
          };
        },
      }),
    };
  },
});

export const { useGetQuery, useGetOneBySlugQuery, useGetOneByIdQuery } =
  productService;
export default productService;
