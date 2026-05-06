// 必须动态渲染：数据库查询 + 角色鉴权
export const dynamic = 'force-dynamic';

import { UserRole } from '@prisma/client';
import TeacherDashboard from '@/components/teacher/TeacherDashboard';
import {
  parseTeacherFeedbackFilters,
} from '@/lib/validation/teacher-feedback-filters';
import { requireRole } from '@/server/auth/require-role';
import { getTeacherDashboardData } from '@/server/queries/teacher-feedback';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parsePageParam(value: string | string[] | undefined): number {
  if (typeof value === 'string') {
    const n = parseInt(value, 10);
    return isNaN(n) ? 1 : n;
  }
  return 1;
}

export default async function TeacherHomePage({ searchParams }: Props) {
  const { profile } = await requireRole(UserRole.TEACHER);
  const resolved = await searchParams;
  const filters = parseTeacherFeedbackFilters(resolved);
  const page = parsePageParam(resolved.page);
  const data = await getTeacherDashboardData(filters, { page });

  return (
    <TeacherDashboard
      teacherName={profile.fullName ?? profile.email}
      data={data}
      filters={filters}
      pagination={data.pagination}
    />
  );
}
