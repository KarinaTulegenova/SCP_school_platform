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

export interface RegisterRequest {
  fullName: string;
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
  note?: string;
  feedback?: string;
  reviewedAt?: string | null;
  submittedAt?: string | null;
  fileName?: string;
  submissionType?: 'file' | 'link';
}

export interface HomeworkAttachmentPayload {
  fileName: string;
  mimeType: string;
  size: number;
  contentBase64: string;
}

export interface HomeworkSubmissionPayload {
  homeworkId: string;
  submissionUrl?: string;
  attachment?: HomeworkAttachmentPayload;
  note?: string;
}

export interface HomeworkSubmissionResult {
  id: string;
  homeworkId: string;
  submissionUrl: string;
  submissionType: 'file' | 'link';
  fileName: string;
  note: string;
  status: HomeworkStatus;
  feedback: string;
  reviewedAt: string | null;
  submittedAt: string;
}

export interface HomeworkSubmissionReview {
  id: string;
  homeworkId: string;
  homeworkTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submissionType: 'file' | 'link';
  submissionUrl: string;
  fileName: string;
  note: string;
  status: HomeworkStatus;
  feedback: string;
  submittedAt: string;
  reviewedAt: string | null;
  fileDataUrl: string;
}

export interface ReviewHomeworkPayload {
  submissionId: string;
  status: Exclude<HomeworkStatus, 'Pending'>;
  feedback?: string;
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
