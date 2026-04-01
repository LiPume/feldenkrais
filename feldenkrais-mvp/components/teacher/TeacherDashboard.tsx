import type { TeacherDashboardData } from '@/types/feedback';
import type { TeacherFeedbackFilters } from '@/types/feedback';
import TeacherFeedbackFiltersForm from '@/components/teacher/TeacherFeedbackFiltersForm';
import TeacherStatList from '@/components/teacher/TeacherStatList';

type Props = {
  teacherName: string;
  data: TeacherDashboardData;
  filters: TeacherFeedbackFilters;
};

export default function TeacherDashboard({ teacherName, data, filters }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-stone-900">老师端</h1>
        <p className="text-sm text-stone-500">当前账号：{teacherName}</p>
      </div>

      <TeacherFeedbackFiltersForm
        action="/teacher"
        resetHref="/teacher"
        filters={filters}
        title="老师端筛选"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 md:col-span-1">
          <p className="text-sm text-stone-500">反馈会话总数</p>
          <p className="mt-2 text-3xl font-medium text-stone-900">
            {data.totalFeedbackSessions}
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">已注册学生</p>
          <p className="mt-2 text-3xl font-medium text-stone-900">
            {data.registeredStudentCount}
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">当前筛选下已填写</p>
          <p className="mt-2 text-3xl font-medium text-stone-900">
            {data.submittedStudentCount}
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">当前筛选下未填写</p>
          <p className="mt-2 text-3xl font-medium text-stone-900">
            {data.missingStudentCount}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <h2 className="text-lg font-medium text-stone-900 mb-4">练习反馈数</h2>
          <TeacherStatList
            items={data.practiceStats.map((item) => ({
              label: item.practiceTitle,
              value: item.feedbackCount,
              href: `/teacher/practices/${item.practiceId}`,
            }))}
          />
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <h2 className="text-lg font-medium text-stone-900 mb-4">高频身体部位</h2>
          <TeacherStatList
            items={data.bodyRegionStats.map((item) => ({
              label: item.bodyRegionName,
              value: item.count,
            }))}
          />
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <h2 className="text-lg font-medium text-stone-900 mb-4">常见反馈标签</h2>
          <TeacherStatList
            items={data.labelStats.map((item) => ({
              label: item.labelName,
              value: item.count,
            }))}
          />
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-medium text-stone-900">学生填写情况</h2>
            <span className="text-xs text-stone-400">
              共 {data.studentSummaries.length} 位学生
            </span>
          </div>
          <p className="mb-4 text-sm text-stone-500">
            这里会列出所有已注册学生。次数为 0 表示当前筛选范围内还没有填写反馈。
          </p>
          <TeacherStatList
            items={data.studentSummaries.map((item) => ({
              label: `${item.studentName}${item.studentId ? ` · ${item.studentId}` : ''}${item.hasSubmitted ? '' : ' · 未填写'}`,
              value: item.feedbackCount,
              href: `/teacher/students/${item.studentProfileId}`,
            }))}
          />
        </section>
      </div>
    </div>
  );
}
