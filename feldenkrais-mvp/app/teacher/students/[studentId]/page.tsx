import Link from 'next/link';
import { UserRole } from '@prisma/client';
import { notFound } from 'next/navigation';
import FeedbackSessionList from '@/components/feedback/FeedbackSessionList';
import { requireRole } from '@/server/auth/require-role';
import { getTeacherStudentHistory } from '@/server/queries/teacher-feedback';

type Props = {
  params: Promise<{
    studentId: string;
  }>;
};

export default async function TeacherStudentHistoryPage({ params }: Props) {
  await requireRole(UserRole.TEACHER);
  const { studentId } = await params;
  const data = await getTeacherStudentHistory(studentId);

  if (!data) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link
        href="/teacher"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 mb-6 transition-colors"
      >
        <span>&#8592;</span>
        <span>返回老师端</span>
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-medium text-stone-900">{data.student.name}</h1>
        {data.student.studentId && (
          <p className="text-sm text-stone-500 mt-1">学号：{data.student.studentId}</p>
        )}
        {data.student.email && (
          <p className="text-sm text-stone-500 mt-1">{data.student.email}</p>
        )}
      </div>

      <FeedbackSessionList
        sessions={data.sessions}
        emptyHref="/teacher"
        emptyTitle="这个学生还没有反馈记录"
        emptyDescription="回到老师端继续查看其他学生或整体统计。"
        emptyActionLabel="返回老师端"
      />
    </div>
  );
}
