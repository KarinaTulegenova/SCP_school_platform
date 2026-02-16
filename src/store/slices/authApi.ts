import { baseApi } from '../../shared/api/baseApi';
import { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '../../shared/types/domain';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body
      })
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body
      })
    }),
    me: builder.query<AuthUser, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET'
      }),
      providesTags: [{ type: 'Auth', id: 'ME' }]
    }),
    logoutApi: builder.mutation<void, { refreshToken: string | null }>({
      query: ({ refreshToken }) => ({
        url: '/auth/logout',
        method: 'POST',
        body: { refreshToken }
      })
    })
  })
});

export const { useLoginMutation, useRegisterMutation, useMeQuery, useLogoutApiMutation } = authApi;
