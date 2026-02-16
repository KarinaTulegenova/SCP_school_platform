import { baseApi } from '../../../shared/api/baseApi';
import { ScheduleDay, ScheduleItemPayload } from '../../../shared/types/domain';

export const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchedule: builder.query<ScheduleDay[], void>({
      query: () => ({
        url: '/schedule',
        method: 'GET'
      }),
      providesTags: [{ type: 'Schedule', id: 'LIST' }]
    }),
    addScheduleItem: builder.mutation<ScheduleDay[], ScheduleItemPayload>({
      query: (body) => ({
        url: '/schedule/items',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Schedule', id: 'LIST' }]
    }),
    updateScheduleItem: builder.mutation<ScheduleDay[], { itemId: string; payload: ScheduleItemPayload }>({
      query: ({ itemId, payload }) => ({
        url: `/schedule/items/${itemId}`,
        method: 'PUT',
        body: payload
      }),
      invalidatesTags: [{ type: 'Schedule', id: 'LIST' }]
    }),
    deleteScheduleItem: builder.mutation<ScheduleDay[], { itemId: string }>({
      query: ({ itemId }) => ({
        url: `/schedule/items/${itemId}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Schedule', id: 'LIST' }]
    })
  })
});

export const { useGetScheduleQuery, useAddScheduleItemMutation, useUpdateScheduleItemMutation, useDeleteScheduleItemMutation } = scheduleApi;
