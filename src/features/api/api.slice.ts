import type { Comment, Reply } from '../../app/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type CommentsResponse = Comment[];
type RepliesResponse = Reply[];

function providesList<R extends { _id?: string; }[], T extends string>(
  resultsWithIds: R | undefined,
  tagType: T
) {
  return resultsWithIds
    ? [
      { type: tagType, id: 'LIST' },
      ...resultsWithIds.map(({ _id }) => ({ type: tagType, _id })),
    ]
    : [{ type: tagType, id: 'LIST' }];
}

export const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: ['Comments', 'Replies'],
  baseQuery: fetchBaseQuery({ baseUrl: 'https://interactive-comments-api.onrender.com/api' }),
  endpoints: builder => ({
    getComments: builder.query<CommentsResponse, void>({
      query: () => '/',
      providesTags: (result) => providesList(result, 'Comments')
    }),
    getComment: builder.query<Comment, string | undefined>({
      query: (commentId) => `/${commentId}`,
      providesTags: (result, error, commentId) => [{ type: 'Comments', commentId }]
    }),
    addComment: builder.mutation<Comment, string | undefined>({
      query: (newContent) => ({
        url: `/`,
        method: 'POST',
        body: {
          createdAt: new Date(),
          updatedAt: new Date(),
          content: newContent,
          score: 0,
          user: {
            image: {
              png: "../../assets/avatars/image-juliusomo.png",
              webp: "../../assets/avatars/image-juliusomo.webp"
            },
            username: "juliusomo"
          },
          replies: [],
          showReplyForm: false
        },
        timestamp: new Date()
      }),
      invalidatesTags: [{ type: 'Comments', id: 'LIST' }]
    }),
    updateComment: builder.mutation<Comment, Partial<Comment>>({
      query: (data) => {
        const { _id, updatedAt, ...body } = data;
        return {
          url: `/${_id}`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: (result, error, { _id }) => [{ type: 'Comments', _id }],
    }),
    updateShowReplyForm: builder.mutation<Comment, Partial<Comment>>({
      query: (data) => {
        const { _id, ...body } = data;
        return {
          url: `/${_id}/toggle`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: (result, error, { _id }) => [{ type: 'Comments', _id }],
    }),
    editComment: builder.mutation<Comment, Partial<Comment>>({
      query: (data) => {
        const { _id, updatedAt, ...body } = data;
        return {
          url: `/${_id}/edit`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: (result, error, { _id }) => [{ type: 'Comments', _id }],
    }),
    deleteComment: builder.mutation<Comment, string | undefined>({
      query: (_id) => {
        return {
          url: `/${_id}/delete`,
          method: 'DELETE'
        };
      },
      invalidatesTags: [{ type: 'Comments', id: 'LIST' }]
    }),
    getReplies: builder.query<RepliesResponse, string & Partial<Comment>>({
      query: (commentId) => `/${commentId}/replies`,
      providesTags: (result) => providesList(result, 'Replies')
    }),
    getReply: builder.query<Reply, [string, string] & Partial<Comment>>({
      query: ([commentId, replyId]) => `/${commentId}/replies/${replyId}`,
      providesTags: (result, error, replyId) => [{ type: 'Replies', replyId }]
    }),
    addReply: builder.mutation<Reply, [string, string]>({
      query: ([commentId, newContent]) => {
        return {
          url: `/${commentId}/replies/`,
          method: 'POST',
          body: {
            comment: commentId,
            createdAt: new Date(),
            updatedAt: new Date(),
            content: newContent.split(' ').slice(1).join(' '),
            score: 0,
            user: {
              image: {
                png: "../../assets/avatars/image-juliusomo.png",
                webp: "../../assets/avatars/image-juliusomo.webp"
              },
              username: "juliusomo"
            },
            replyingTo: newContent.split(' ')[0],
            showReplyForm: false
          },
          timestamp: new Date()
        };
      },
      invalidatesTags: (result, error, comment, _id) => [{ type: 'Replies', _id }, { type: 'Replies', id: 'LIST' }, { type: 'Comments', comment }, { type: 'Comments', id: 'LIST' }]
    }),
    updateReply: builder.mutation<Reply, Partial<Reply>>({
      query: (data) => {
        const { comment, _id, updatedAt, ...body } = data;
        return {
          url: `/${comment}/replies/${_id}/update`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: (result, error, comment, _id) => [{ type: 'Replies', _id }]
    }),
    editReply: builder.mutation<Reply, Partial<Reply>>({
      query: (reply: Reply) => {
        const { comment, _id, updatedAt, ...body } = reply;
        return {
          url: `/${comment}/replies/${_id}/edit`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: (result, error, _id) => [{ type: 'Replies', _id }]
    }),
    replyUpdateShowReplyForm: builder.mutation<Reply, Partial<Reply>>({
      query: (data) => {
        const { comment, _id, ...body } = data;
        return {
          url: `/${comment}/replies/${_id}/toggle`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: (result, error, _id) => [{ type: 'Replies', _id }]
    }),
    deleteReply: builder.mutation<Reply, [string | undefined, string | undefined]>({
      query: ([comment, _id]) => {
        return {
          url: `/${comment}/replies/${_id}/delete`,
          method: 'DELETE',
        };
      },
      invalidatesTags: (result, error, comment, _id) => [{ type: 'Replies', _id }, { type: 'Replies', id: 'LIST' }, { type: 'Comments', comment }, { type: 'Comments', id: 'LIST' }]
    })
  })
});

export const {
  useGetCommentsQuery,
  useGetCommentQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useUpdateShowReplyFormMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useGetRepliesQuery,
  useGetReplyQuery,
  useAddReplyMutation,
  useEditReplyMutation,
  useUpdateReplyMutation,
  useReplyUpdateShowReplyFormMutation,
  useDeleteReplyMutation
} = apiSlice;