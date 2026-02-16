export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type LessonStatus = 'locked' | 'in_progress' | 'completed';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  status: LessonStatus;
  videoUrl: string;
  duration: string;
}

export type HomeworkStatus = 'Pending' | 'Graded' | 'Resubmit';

export interface HomeworkItem {
  id: string;
  title: string;
  type: 'file' | 'link';
  dueDate: string;
  status: HomeworkStatus;
  submitted: boolean;
  submissionUrl: string;
}

export interface HomeworkSubmissionPayload {
  homeworkId: string;
  submissionUrl: string;
  note?: string;
}

export interface HomeworkSubmissionResult {
  id: string;
  homeworkId: string;
  submissionUrl: string;
  note: string;
  status: 'submitted';
  submittedAt: string;
}

export interface ScheduleItem {
  itemId: string;
  time: string;
  title: string;
  type: string;
}

export interface ScheduleDay {
  day: string;
  items: ScheduleItem[];
}

export interface ScheduleItemPayload {
  day: string;
  time: string;
  title: string;
  type: string;
}

export interface UserSummary {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}
