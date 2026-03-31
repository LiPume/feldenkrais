import { UserRole } from '@prisma/client';
import TeacherDashboard from '@/components/teacher/TeacherDashboard';
import { parseTeacherFeedbackFilters } from '@/lib/validation/teacher-feedback-filters';
import { requireRole } from '@/server/auth/require-role';
import { getTeacherDashboardData } from '@/server/queries/teacher-feedback';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TeacherHomePage({ searchParams }: Props) {
  const { profile } = await requireRole(UserRole.TEACHER);
  const filters = parseTeacherFeedbackFilters(await searchParams);
  const data = await getTeacherDashboardData(filters);

  return (
    <TeacherDashboard
      teacherName={profile.fullName ?? profile.email}
      data={data}
      filters={filters}
    />
  );
}
