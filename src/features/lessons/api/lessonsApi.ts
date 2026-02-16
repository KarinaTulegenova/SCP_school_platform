import { baseApi } from '../../../shared/api/baseApi';
import { Lesson } from '../../../shared/types/domain';

export const lessonsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLessons: builder.query<Lesson[], void>({
      query: () => ({
        url: '/lessons',
        method: 'GET'
      }),
      providesTags: (result) =>
        result
          ? [...result.map((lesson) => ({ type: 'Lesson' as const, id: lesson.id })), { type: 'Lesson' as const, id: 'LIST' }]
          : [{ type: 'Lesson' as const, id: 'LIST' }]
    }),
    completeLesson: builder.mutation<Lesson[], { lessonId: string }>({
      query: ({ lessonId }) => ({
        url: `/lessons/${lessonId}/complete`,
        method: 'POST'
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Lesson', id: arg.lessonId },
        { type: 'Lesson', id: 'LIST' },
        { type: 'Progress', id: 'ME' }
      ]
    })
  })
});

export const { useGetLessonsQuery, useCompleteLessonMutation } = lessonsApi;
