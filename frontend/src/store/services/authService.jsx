import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const authService = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  prepareHeaders: (headers, { getState }) => {
    const reducers = getState();
    const token = reducers?.authReducer?.userSession?.access_token;
    headers.set('Content-Type', 'application/json');
    headers.set('authorization', token ? `Bearer ${token}` : '');
    return headers;
  },
  endpoints: (builder) => {
    return {
      Login: builder.mutation({
        query: (loginData) => {
          return {
            url: '/user/login',
            method: 'POST',
            body: loginData,
            credentials: 'include',
          };
        },
      }),
      Register: builder.mutation({
        query: (registerData) => {
          return {
            url: '/user/register',
            method: 'POST',
            body: registerData,
            credentials: 'include',
          };
        },
      }),
      SaveAddress: builder.mutation({
        query: (addressData) => {
          return {
            url: '/user/saveAddress',
            method: 'POST',
            body: addressData,
          };
        },
      }),
      ChangeActiveAddress: builder.mutation({
        query: (activeData) => {
          return {
            url: '/user/changeActiveAddress',
            method: 'POST',
            body: activeData,
          };
        },
      }),
      DeleteAddress: builder.mutation({
        query: (deleteData) => {
          return {
            url: '/user/deleteAddress',
            method: 'POST',
            body: deleteData,
          };
        },
      }),
    };
  },
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSaveAddressMutation,
  useChangeActiveAddressMutation,
  useDeleteAddressMutation,
} = authService;
export default authService;
