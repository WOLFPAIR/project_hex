import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }), // Backend URL
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => {
        // OAuth2PasswordRequestForm expects form-data
        const formData = new FormData();
        formData.append('username', credentials.email);
        formData.append('password', credentials.password);
        
        return {
          url: '/login',
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
