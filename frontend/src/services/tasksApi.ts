import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { TodoType } from '../types/todo';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  tagTypes: ['Task'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getTasks: builder.query<TodoType[], void>({
      query: () => '/tasks/',
      providesTags: ['Task'],
    }),
    createTask: builder.mutation<TodoType, Partial<TodoType>>({
      query: (task) => ({
        url: '/tasks/',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<TodoType, { id: string; task: Partial<TodoType> }>({
      query: ({ id, task }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTasks: builder.mutation<number[], number[]>({
      query: (taskIds) => ({
        url: '/tasks/delete',
        method: 'POST',
        body: { task_ids: taskIds },
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const { 
  useGetTasksQuery, 
  useCreateTaskMutation, 
  useUpdateTaskMutation, 
  useDeleteTaskMutation,
  useDeleteTasksMutation
} = tasksApi;
