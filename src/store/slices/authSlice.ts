import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApi';
import { AuthUser, UserRole } from '../../shared/types/domain';
import { clearAuthSession, loadAuthSession, saveAuthSession } from './authStorage';

interface AuthState {
  user: AuthUser | null;
  role: UserRole | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  error: string | null;
}

const persistedSession = loadAuthSession();

const initialState: AuthState = {
  user: persistedSession?.user ?? null,
  role: persistedSession?.user.role ?? null,
  accessToken: persistedSession?.accessToken ?? null,
  refreshToken: persistedSession?.refreshToken ?? null,
  isAuthenticated: Boolean(persistedSession),
  status: persistedSession ? 'authenticated' : 'idle',
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      clearAuthSession();
      state.user = null;
      state.role = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchPending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      state.status = 'authenticated';
      state.user = action.payload.user;
      state.role = action.payload.user.role;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
      saveAuthSession({
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        user: action.payload.user
      });
    });
    builder.addMatcher(authApi.endpoints.me.matchFulfilled, (state, action) => {
      if (!state.accessToken || !state.refreshToken) {
        return;
      }

      state.status = 'authenticated';
      state.user = action.payload;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.error = null;
      saveAuthSession({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: action.payload
      });
    });
    builder.addMatcher(authApi.endpoints.me.matchRejected, (state) => {
      clearAuthSession();
      state.status = 'error';
      state.error = 'Session expired. Please sign in again.';
      state.user = null;
      state.role = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    });
    builder.addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
      clearAuthSession();
      state.status = 'error';
      state.error = action.error?.message ?? 'Unable to sign in';
      state.user = null;
      state.role = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
