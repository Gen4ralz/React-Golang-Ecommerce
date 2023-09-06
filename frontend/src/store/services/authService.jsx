import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const authService = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
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
          const { token, address } = addressData;
          return {
            headers: {
              authorization: `Bearer ${token}`,
            },
            url: '/user/saveAddress',
            method: 'POST',
            body: address,
            credential: 'include',
          };
        },
      }),
      ChangeActiveAddress: builder.mutation({
        query: (activeData) => {
          const { token, active_address_id } = activeData;
          return {
            headers: {
              authorization: `Bearer ${token}`,
            },
            url: '/user/changeActiveAddress',
            method: 'POST',
            body: active_address_id,
            credentials: 'include',
          };
        },
      }),
      DeleteAddress: builder.mutation({
        query: (deleteData) => {
          const { token, delete_address_id } = deleteData;
          console.log('id->>>>>>>', delete_address_id);
          return {
            headers: {
              authorization: `Bearer ${token}`,
            },
            url: '/user/deleteAddress',
            method: 'POST',
            body: delete_address_id,
            credentials: 'include',
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
