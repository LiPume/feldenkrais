import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { serializeRole } from '@/lib/auth/role-routing';
import { requireUser } from '@/server/auth/require-user';

export async function requireRole(allowedRoles: UserRole | UserRole[]) {
  const auth = await requireUser();
  const roleList = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roleList.includes(auth.profile.role)) {
    const params = new URLSearchParams({
      expected: roleList.map(serializeRole).join(','),
      actual: serializeRole(auth.profile.role),
    });

    redirect(`/unauthorized?${params.toString()}`);
  }

  return auth;
}
