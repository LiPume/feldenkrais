import { UserRole } from '@prisma/client';
import { notFound } from 'next/navigation';
import TeacherPracticeDetail from '@/components/teacher/TeacherPracticeDetail';
import {
  parseTeacherFeedbackCursorParams,
  parseTeacherFeedbackFilters,
} from '@/lib/validation/teacher-feedback-filters';
import { requireRole } from '@/server/auth/require-role';
import { getTeacherPracticeDetail } from '@/server/queries/teacher-feedback';

type Props = {
  params: Promise<{
    practiceId: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TeacherPracticeDetailPage({ params, searchParams }: Props) {
  await requireRole(UserRole.TEACHER);
  const { practiceId } = await params;
  const resolvedSearchParams = await searchParams;
  const filters = parseTeacherFeedbackFilters(resolvedSearchParams);
  const cursorParams = parseTeacherFeedbackCursorParams(resolvedSearchParams);
  const data = await getTeacherPracticeDetail(practiceId, filters, cursorParams);

  if (!data) {
    notFound();
  }

  return <TeacherPracticeDetail data={data} filters={filters} />;
}
