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
        <div className="rounded-2xl border border-stone-200 bg-white p-5 md:col-span-3">
          <p className="text-sm text-stone-500 mb-3">老师端最小统计范围</p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
              某练习反馈数
            </span>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
              身体部位出现次数
            </span>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
              常见反馈标签
            </span>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
              学生反馈历史
            </span>
          </div>
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
            <h2 className="text-lg font-medium text-stone-900">学生反馈历史入口</h2>
            <span className="text-xs text-stone-400">
              共 {data.studentSummaries.length} 位学生
            </span>
          </div>
          <TeacherStatList
            items={data.studentSummaries.map((item) => ({
              label: `${item.studentName} · ${item.studentEmail}`,
              value: item.feedbackCount,
              href: `/teacher/students/${item.studentProfileId}`,
            }))}
          />
        </section>
      </div>
    </div>
  );
}
