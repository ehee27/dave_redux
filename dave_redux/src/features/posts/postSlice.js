// The slice can contain all we need for a 'Slice' of state data
// action creators very much like our previous work with Redux - dispatch to update state

// QUERY vs MUTATIONS
// optional chaining... if true AND this.
// normalize our data - working off an Array of IDs - and entities object
//
import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { sub } from 'date-fns';
import { apiSlice } from '../api/apiSlice';

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // ------------------------- GET ALL POSTS -------------------------------
    getPosts: builder.query({
      query: () => '/posts',
      transformResponse: responseData => {
        let min = 1;
        const loadedPosts = responseData.map(post => {
          // if no date - format one for us
          if (!post?.date)
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          // if no reactions - set them to 0
          if (!post?.reactions)
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => [
        { type: 'Post', id: 'LIST' },
        ...result.ids.map(id => ({ type: 'Post', id })),
      ],
    }),

    // ------------------------- GET SPECIFIC USER POSTS -----------------------
    getPostsByUserId: builder.query({
      query: id => `/posts/?userId=${id}`,
      transformResponse: responseData => {
        let min = 1;
        const loadedPosts = responseData.map(post => {
          // if no date - format one for us
          if (!post?.date)
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          // if no reactions - set them to 0
          if (!post?.reactions)
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => {
        console.log(result);
        return [...result.ids.map(id => ({ type: 'Post', id }))];
      },
    }),

    // ------------------------- CREATE NEW POST -----------------------
    addNewPost: builder.mutation({
      query: initialPost => ({
        url: '/posts',
        method: 'POST',
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        },
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),

    // ------------------------- UPDATE POST -----------------------
    updatePost: builder.mutation({
      query: initialPost => ({
        url: `/posts${initialPost.id}`,
        method: 'PUT',
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, arg) => [{ typer: 'POST', id: arg.id }],
    }),

    // ------------------------- DELETE POST -----------------------
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }],
    }),
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: 'PATCH',
        // in a real app, we'd need to base on user ID somehow
        // so user can't hit the same reaction more than once
        body: { reactions },
      }),
      async onQueryStarted(
        { postId, reactions },
        { dispatch, queryFulfilled }
      ) {
        // 'updateQueryData' requires the endpoint name and cache key args
        // so it know which piece of cache state to update
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData(
            'getPosts',
            undefined,
            draft => {
              // The 'draft' is Immer-wrapped and can be 'mutated' like in createSlice
              const post = draft.entities[postId];
              if (post) post.reactions = reactions;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation,
} = extendedApiSlice;

// returns the query result object -----------------ACTUAL RESULT DATA----------------
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

// creates memoized selector
const selectPostsData = createSelector(
  selectPostsResult,
  postResult => postResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  //
  // Pass in a selector that returns the post slice of state
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState);
