import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import AdminMetricCard from '@/components/teacher/AdminMetricCard';
import StatBarChart from '@/components/teacher/StatBarChart';
import TeacherFeedbackFiltersForm from '@/components/teacher/TeacherFeedbackFiltersForm';
import { FEEDBACK_PHASE_NAME_MAP } from '@/lib/constants/feedback-labels';
import type { TeacherDashboardData, TeacherFeedbackFilters } from '@/types/feedback';

type PaginationInfo = {
  page: number;
  pageSize: number;
  totalCount: number;
  hasMore: boolean;
};

type Props = {
  teacherName: string;
  data: TeacherDashboardData;
  filters: TeacherFeedbackFilters;
  pagination: PaginationInfo;
};

function buildPaginationUrl(base: string, page: number, filters: TeacherFeedbackFilters): string {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (filters.phase) params.set('phase', filters.phase);
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.set('dateTo', filters.dateTo);
  const qs = params.toString();
  return `${base}${qs ? '?' + qs : ''}`;
}

function formatFilterSummary(filters: TeacherFeedbackFilters): string {
  const parts: string[] = [];

  if (filters.phase) {
    parts.push(FEEDBACK_PHASE_NAME_MAP[filters.phase]);
  }

  if (filters.dateFrom && filters.dateTo) {
    parts.push(`${filters.dateFrom} 至 ${filters.dateTo}`);
  } else if (filters.dateFrom) {
    parts.push(`${filters.dateFrom} 起`);
  } else if (filters.dateTo) {
    parts.push(`截止 ${filters.dateTo}`);
  }

  return parts.join(' · ') || '全部反馈';
}

export default function TeacherDashboard({ teacherName, data, filters, pagination }: Props) {
  const { page, pageSize, totalCount, hasMore } = pagination;
  const baseHref = '/teacher';
  const currentPageSubmittedCount = data.studentSummaries.filter((item) => item.hasSubmitted).length;
  const currentPageMissingCount = data.studentSummaries.length - currentPageSubmittedCount;
  const pageStart = totalCount === 0 ? 0 : ((page - 1) * pageSize) + 1;
  const pageEnd = Math.min(page * pageSize, totalCount);
  const filterSummary = formatFilterSummary(filters);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        eyebrow="管理后台"
        title="管理后台"
        description="查看练习反馈、学生填写情况和身体部位趋势。"
        action={
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Badge variant="warm">{filterSummary}</Badge>
            <span className="text-xs text-stone-500">当前账号：{teacherName}</span>
          </div>
        }
      />

      <TeacherFeedbackFiltersForm
        action="/teacher"
        resetHref="/teacher"
        filters={filters}
        title="数据筛选"
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminMetricCard
          label="反馈总数"
          value={data.totalFeedbackSessions}
          description="符合当前筛选条件的反馈会话"
        />
        <AdminMetricCard
          label="注册学生数"
          value={data.registeredStudentCount}
          description="当前系统中的学生账号总数"
        />
        <AdminMetricCard
          label="当前页已填写"
          value={currentPageSubmittedCount}
          description="基于下方当前学生列表页计算"
        />
        <AdminMetricCard
          label="当前页未填写"
          value={currentPageMissingCount}
          description="基于下方当前学生列表页计算"
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <StatBarChart
          title="练习反馈数量"
          description="反馈最多的练习，点击可查看练习详情。"
          emptyLabel="暂无练习反馈"
          items={data.practiceStats.slice(0, 8).map((item) => ({
            label: item.practiceTitle,
            value: item.feedbackCount,
            href: `/teacher/practices/${item.practiceId}`,
          }))}
        />

        <StatBarChart
          title="身体部位热度"
          description="学生反馈中最常出现的身体部位。"
          emptyLabel="暂无身体部位统计"
          items={data.bodyRegionStats.slice(0, 8).map((item) => ({
            label: item.bodyRegionName,
            value: item.count,
          }))}
        />

        <StatBarChart
          title="感受标签分布"
          description="学生最常选择的感受标签。"
          emptyLabel="暂无感受标签统计"
          items={data.labelStats.slice(0, 8).map((item) => ({
            label: item.labelName,
            value: item.count,
          }))}
        />
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>学生反馈概览</CardTitle>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              按学号排序，每页 {pageSize} 人。当前显示第 {pageStart}–{pageEnd} 位，共 {totalCount} 位。
            </p>
          </div>
          <Badge variant="muted">第 {page} 页</Badge>
        </CardHeader>
        <CardContent className="pt-2">
          {data.studentSummaries.length === 0 ? (
            <EmptyState
              title="暂无学生"
              description="当前还没有可展示的学生账号。"
              className="border-dashed shadow-none"
            />
          ) : (
            <div className="divide-y divide-stone-100">
              {data.studentSummaries.map((student) => (
                <Link
                  key={student.studentProfileId}
                  href={`/teacher/students/${student.studentProfileId}`}
                  className="grid gap-3 px-1 py-4 transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-950">
                      {student.studentName}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      {student.studentId ? `学号 ${student.studentId}` : student.studentEmail ?? '未填写学号'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={student.hasSubmitted ? 'success' : 'muted'}>
                      {student.hasSubmitted ? '已填写' : '未填写'}
                    </Badge>
                    <span className="text-sm font-medium text-stone-900">
                      {student.feedbackCount} 条反馈
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 sm:text-right">
                    {student.lastFeedbackDate ? `最近 ${student.lastFeedbackDate}` : '暂无最近反馈'}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {(page > 1 || hasMore) && (
            <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
              {page > 1 ? (
                <Link
                  href={buildPaginationUrl(baseHref, page - 1, filters)}
                  className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
                >
                  上一页
                </Link>
              ) : (
                <span />
              )}
              {hasMore && (
                <Link
                  href={buildPaginationUrl(baseHref, page + 1, filters)}
                  className="rounded-lg border border-stone-950 bg-stone-950 px-4 py-2 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
                >
                  下一页
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
