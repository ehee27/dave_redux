import {
  CreateApi,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/dist/query';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
  tagTypes: ['POST'],
  endpoints: builder => ({}),
});
