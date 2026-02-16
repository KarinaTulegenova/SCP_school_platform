import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface AuthUser {
  id: string;
  fullName: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}

const mockUsersByRole: Record<UserRole, AuthUser> = {
  STUDENT: { id: 'u-student-1', fullName: 'Aruzhan Student', role: 'STUDENT' },
  TEACHER: { id: 'u-teacher-1', fullName: 'Dana Teacher', role: 'TEACHER' },
  ADMIN: { id: 'u-admin-1', fullName: 'Alex Admin', role: 'ADMIN' }
};

const initialState: AuthState = {
  user: null,
  role: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    mockLogin(state, action: PayloadAction<UserRole>) {
      const selectedRole = action.payload;
      const selectedUser = mockUsersByRole[selectedRole];

      state.user = selectedUser;
      state.role = selectedRole;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
    }
  }
});

export const { mockLogin, logout } = authSlice.actions;
export default authSlice.reducer;
