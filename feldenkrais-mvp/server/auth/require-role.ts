import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { requireUser } from '@/server/auth/require-user';

export async function requireRole(allowedRoles: UserRole | UserRole[]) {
  const auth = await requireUser();
  const roleList = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roleList.includes(auth.profile.role)) {
    redirect('/unauthorized');
  }

  return auth;
}
