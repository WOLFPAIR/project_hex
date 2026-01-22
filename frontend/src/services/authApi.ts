import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000',
    credentials: 'include',
  }), // Backend URL
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
    getMe: builder.query({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetMeQuery } = authApi;
