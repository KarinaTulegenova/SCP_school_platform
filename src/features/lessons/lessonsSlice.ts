import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import lessonsData from './data/lessons.json';

export type LessonStatus = 'locked' | 'in_progress' | 'completed';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  status: LessonStatus;
  videoUrl: string;
  duration: string;
}

interface LessonsState {
  lessons: Lesson[];
  currentLessonId: string | null;
  completedCount: number;
}

const initialLessons = lessonsData as Lesson[];

const getCompletedCount = (lessons: Lesson[]): number =>
  lessons.filter((lesson) => lesson.status === 'completed').length;

const initialState: LessonsState = {
  lessons: initialLessons,
  currentLessonId: initialLessons.find((lesson) => lesson.status === 'in_progress')?.id ?? null,
  completedCount: getCompletedCount(initialLessons)
};

const lessonsSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    startLesson(state, action: PayloadAction<string>) {
      const lesson = state.lessons.find((item) => item.id === action.payload);
      if (!lesson || lesson.status === 'locked') return;

      state.currentLessonId = lesson.id;
      if (lesson.status !== 'completed') {
        lesson.status = 'in_progress';
      }
    },
    completeLesson(state, action: PayloadAction<string>) {
      const lessonIndex = state.lessons.findIndex((item) => item.id === action.payload);
      if (lessonIndex === -1) return;

      const lesson = state.lessons[lessonIndex];
      if (lesson.status === 'completed') return;

      lesson.status = 'completed';
      state.completedCount = getCompletedCount(state.lessons);

      const nextLesson = state.lessons[lessonIndex + 1];
      if (nextLesson?.status === 'locked') {
        nextLesson.status = 'in_progress';
      }
      state.currentLessonId = nextLesson?.id ?? null;
    }
  }
});

export const { startLesson, completeLesson } = lessonsSlice.actions;
export default lessonsSlice.reducer;
