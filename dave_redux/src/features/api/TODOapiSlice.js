import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// create the slice and set to the 'API' object
export const apiSlice = createApi({
  // set the reducer params and the BASE QUERY
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
  tagTypes: ['Todos'],
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => '/todos',
      // sort in descending... b - a
      transformResponse: (res) => res.sort((a, b) => b.id - a.id),
      providesTags: ['Todos'],
    }),
    // additional methods or queries with standard API params
    addTodo: builder.mutation({
      query: (todo) => ({
        url: '/todos',
        method: 'POST',
        body: todo,
      }),
      invalidatesTags: ['Todos'],
    }),
    updateTodo: builder.mutation({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: 'PATCH',
        body: todo,
      }),
      invalidatesTags: ['Todos'],
    }),
    deleteTodo: builder.mutation({
      query: ({ id }) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
        body: id,
      }),
      invalidatesTags: ['Todos'],
    }),
  }),
});
// these hooks are automatically generated
export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = apiSlice;
