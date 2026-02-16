import { baseApi } from '../../../shared/api/baseApi';
import {
  HomeworkItem,
  HomeworkSubmissionPayload,
  HomeworkSubmissionResult,
  HomeworkSubmissionReview,
  ReviewHomeworkPayload
} from '../../../shared/types/domain';

export const homeworkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomework: builder.query<HomeworkItem[], void>({
      query: () => ({
        url: '/homework',
        method: 'GET'
      }),
      providesTags: [{ type: 'Homework', id: 'LIST' }]
    }),
    submitHomework: builder.mutation<HomeworkSubmissionResult, HomeworkSubmissionPayload>({
      query: ({ homeworkId, ...body }) => ({
        url: `/homework/${homeworkId}/submit`,
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Homework', id: 'LIST' }]
    }),
    getHomeworkSubmissions: builder.query<HomeworkSubmissionReview[], void>({
      query: () => ({
        url: '/homework/submissions',
        method: 'GET'
      }),
      providesTags: [{ type: 'Homework', id: 'SUBMISSIONS' }]
    }),
    reviewHomeworkSubmission: builder.mutation<HomeworkSubmissionReview, ReviewHomeworkPayload>({
      query: ({ submissionId, ...body }) => ({
        url: `/homework/submissions/${submissionId}/review`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: [
        { type: 'Homework', id: 'LIST' },
        { type: 'Homework', id: 'SUBMISSIONS' }
      ]
    })
  })
});

export const {
  useGetHomeworkQuery,
  useSubmitHomeworkMutation,
  useGetHomeworkSubmissionsQuery,
  useReviewHomeworkSubmissionMutation
} = homeworkApi;
