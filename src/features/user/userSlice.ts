import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  points: number;
  achievements: string[];
}

const initialState: UserState = {
  points: 120,
  achievements: ['First Steps']
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addPoints(state, action: PayloadAction<number>) {
      state.points += action.payload;
    },
    unlockAchievement(state, action: PayloadAction<string>) {
      if (!state.achievements.includes(action.payload)) {
        state.achievements.push(action.payload);
      }
    }
  }
});

export const { addPoints, unlockAchievement } = userSlice.actions;
export default userSlice.reducer;
