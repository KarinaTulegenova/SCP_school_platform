import { UserRole } from '../../shared/types/domain';

export type Permission =
  | 'lesson:read'
  | 'lesson:complete'
  | 'homework:read'
  | 'homework:submit'
  | 'schedule:read'
  | 'progress:read:self'
  | 'progress:read:class'
  | 'lesson:publish'
  | 'user:manage'
  | 'schedule:manage'
  | 'homework:review';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  STUDENT: ['lesson:read', 'lesson:complete', 'homework:read', 'homework:submit', 'schedule:read', 'progress:read:self'],
  TEACHER: ['lesson:read', 'homework:read', 'homework:review', 'schedule:read', 'progress:read:class', 'lesson:publish', 'user:manage'],
  ADMIN: [
    'lesson:read',
    'lesson:complete',
    'homework:read',
    'homework:submit',
    'homework:review',
    'schedule:read',
    'progress:read:self',
    'progress:read:class',
    'lesson:publish',
    'user:manage',
    'schedule:manage'
  ]
};

export const hasPermission = (role: UserRole | null, permission: Permission): boolean =>
  role ? ROLE_PERMISSIONS[role].includes(permission) : false;
