import { baseApi } from '../../../shared/api/baseApi';
import { CreateUserPayload, UserRole, UserSummary } from '../../../shared/types/domain';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserSummary[], void>({
      query: () => ({
        url: '/users',
        method: 'GET'
      }),
      providesTags: [{ type: 'User', id: 'LIST' }]
    }),
    createUser: builder.mutation<UserSummary, CreateUserPayload>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }]
    }),
    updateUserRole: builder.mutation<UserSummary, { userId: string; role: UserRole }>({
      query: ({ userId, role }) => ({
        url: `/users/${userId}/role`,
        method: 'PATCH',
        body: { role }
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }]
    }),
    deleteUser: builder.mutation<void, { userId: string }>({
      query: ({ userId }) => ({
        url: `/users/${userId}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }]
    })
  })
});

export const { useGetUsersQuery, useCreateUserMutation, useUpdateUserRoleMutation, useDeleteUserMutation } = usersApi;
