// 必须动态渲染：角色鉴权
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';
import { requireRole } from '@/server/auth/require-role';

export default async function AdminEntryPage() {
  await requireRole(UserRole.TEACHER);
  redirect('/teacher');
}
