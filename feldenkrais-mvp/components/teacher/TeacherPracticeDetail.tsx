import Link from 'next/link';
import FeedbackSessionList from '@/components/feedback/FeedbackSessionList';
import TeacherFeedbackFiltersForm from '@/components/teacher/TeacherFeedbackFiltersForm';
import TeacherStatList from '@/components/teacher/TeacherStatList';
import type { TeacherFeedbackFilters, TeacherPracticeDetailData } from '@/types/feedback';

type Props = {
  data: TeacherPracticeDetailData;
  filters: TeacherFeedbackFilters;
};

export default function TeacherPracticeDetail({ data, filters }: Props) {
  const buildPaginationHref = (cursorParams: { after?: string; before?: string }) => {
    const searchParams = new URLSearchParams();

    if (filters.phase) {
      searchParams.set('phase', filters.phase);
    }

    if (filters.dateFrom) {
      searchParams.set('dateFrom', filters.dateFrom);
    }

    if (filters.dateTo) {
      searchParams.set('dateTo', filters.dateTo);
    }

    if (cursorParams.after) {
      searchParams.set('after', cursorParams.after);
    }

    if (cursorParams.before) {
      searchParams.set('before', cursorParams.before);
    }

    const queryString = searchParams.toString();
    return queryString
      ? `/teacher/practices/${data.practice.id}?${queryString}`
      : `/teacher/practices/${data.practice.id}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div>
        <Link
          href="/teacher"
          className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 mb-4 transition-colors"
        >
          <span>&#8592;</span>
          <span>返回老师端</span>
        </Link>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">练习详情</p>
          <h1 className="text-2xl font-medium text-stone-900">{data.practice.title}</h1>
          {data.practice.courseName && (
            <p className="text-sm text-stone-500">{data.practice.courseName}</p>
          )}
          {data.practice.summary && (
            <p className="text-sm text-stone-500 max-w-3xl">{data.practice.summary}</p>
          )}
        </div>
      </div>

      <TeacherFeedbackFiltersForm
        action={`/teacher/practices/${data.practice.id}`}
        resetHref={`/teacher/practices/${data.practice.id}`}
        filters={filters}
        title="练习详情筛选"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">反馈会话数</p>
          <p className="mt-2 text-3xl font-medium text-stone-900">{data.feedbackCount}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">涉及学生数</p>
          <p className="mt-2 text-3xl font-medium text-stone-900">{data.studentCount}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">最近反馈入口</p>
          <Link
            href={`/practices/${data.practice.slug}`}
            className="mt-2 inline-flex text-sm text-stone-700 hover:text-stone-900 transition-colors"
          >
            查看学生端练习详情
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <h2 className="text-lg font-medium text-stone-900 mb-4">身体部位分布</h2>
          <TeacherStatList
            items={data.bodyRegionStats.map((item) => ({
              label: item.bodyRegionName,
              value: item.count,
            }))}
            emptyLabel="这个练习还没有身体部位统计。"
          />
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <h2 className="text-lg font-medium text-stone-900 mb-4">常见反馈标签</h2>
          <TeacherStatList
            items={data.labelStats.map((item) => ({
              label: item.labelName,
              value: item.count,
            }))}
            emptyLabel="这个练习还没有标签统计。"
          />
        </section>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-stone-900">最近反馈</h2>
            <p className="text-sm text-stone-500">
              每页展示 {data.recentFeedback.pageInfo.pageSize} 条最近反馈，方便老师快速查看学生的部位明细。
            </p>
          </div>
        </div>

        <FeedbackSessionList
          sessions={data.recentFeedback.sessions}
          showStudent
          showStudentLink
          emptyHref="/teacher"
          emptyTitle="这个练习还没有反馈记录"
          emptyDescription="回到老师端继续查看其他练习或整体统计。"
          emptyActionLabel="返回老师端"
        />

        {(data.recentFeedback.pageInfo.hasPreviousPage || data.recentFeedback.pageInfo.hasNextPage) && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white px-5 py-4">
            <div className="text-sm text-stone-500">
              当前为最近反馈分页视图，筛选条件会在翻页时保留。
            </div>
            <div className="flex items-center gap-3">
              {data.recentFeedback.pageInfo.hasPreviousPage && data.recentFeedback.pageInfo.previousCursor ? (
                <Link
                  href={buildPaginationHref({
                    before: data.recentFeedback.pageInfo.previousCursor,
                  })}
                  className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50"
                >
                  较新反馈
                </Link>
              ) : (
                <span className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-300">
                  较新反馈
                </span>
              )}

              {data.recentFeedback.pageInfo.hasNextPage && data.recentFeedback.pageInfo.nextCursor ? (
                <Link
                  href={buildPaginationHref({
                    after: data.recentFeedback.pageInfo.nextCursor,
                  })}
                  className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700"
                >
                  较旧反馈
                </Link>
              ) : (
                <span className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-300">
                  较旧反馈
                </span>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
