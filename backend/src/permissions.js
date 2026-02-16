export const ROLE_PERMISSIONS = {
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

export const hasPermission = (role, permission) => {
  const permissions = ROLE_PERMISSIONS[role] ?? [];
  return permissions.includes(permission);
};
