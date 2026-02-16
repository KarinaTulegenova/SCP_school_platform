import { configureStore } from '@reduxjs/toolkit';
import lessonsReducer from '../features/lessons/lessonsSlice';
import userReducer from '../features/user/userSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lessons: lessonsReducer,
    user: userReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
