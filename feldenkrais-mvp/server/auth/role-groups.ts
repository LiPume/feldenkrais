import { UserRole } from '@prisma/client';

export const FEEDBACK_ACCESS_ROLES: UserRole[] = [
  UserRole.STUDENT,
  UserRole.TEACHER,
];
