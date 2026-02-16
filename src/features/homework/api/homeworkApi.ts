import { baseApi } from '../../../shared/api/baseApi';
import { HomeworkItem, HomeworkSubmissionPayload, HomeworkSubmissionResult } from '../../../shared/types/domain';

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
    })
  })
});

export const { useGetHomeworkQuery, useSubmitHomeworkMutation } = homeworkApi;
