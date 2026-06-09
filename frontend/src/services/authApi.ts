import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { tasksApi } from './tasksApi';

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['User'],
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
      invalidatesTags: ['User'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(tasksApi.util.resetApiState());
        } catch (err) {
          // Ignore errors
        }
      },
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
      invalidatesTags: ['User'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(tasksApi.util.resetApiState());
        } catch (err) {
          // Ignore errors
        }
      },
    }),
    getMe: builder.query({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(tasksApi.util.resetApiState());
        } catch (err) {
          // Ignore errors
        }
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetMeQuery, useLogoutMutation } = authApi;
