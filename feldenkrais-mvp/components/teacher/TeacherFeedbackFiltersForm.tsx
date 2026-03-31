import Link from 'next/link';
import { FEEDBACK_PHASE_OPTIONS, FEEDBACK_PHASE_NAME_MAP } from '@/lib/constants/feedback-labels';
import { hasTeacherFeedbackFilters } from '@/lib/validation/teacher-feedback-filters';
import type { TeacherFeedbackFilters } from '@/types/feedback';

type Props = {
  action: string;
  resetHref: string;
  filters: TeacherFeedbackFilters;
  title?: string;
};

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

  return parts.join(' · ');
}

export default function TeacherFeedbackFiltersForm({
  action,
  resetHref,
  filters,
  title = '筛选范围',
}: Props) {
  const hasFilters = hasTeacherFeedbackFilters(filters);
  const summary = hasFilters ? formatFilterSummary(filters) : null;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-medium text-stone-900">{title}</h2>
          <p className="text-sm text-stone-500">
            用阶段和日期范围过滤当前统计结果。
          </p>
        </div>
        {summary && (
          <span className="text-xs text-stone-400">
            当前筛选：{summary}
          </span>
        )}
      </div>

      <form action={action} className="grid gap-4 md:grid-cols-[12rem_1fr_1fr_auto_auto] md:items-end">
        <div>
          <label htmlFor="phase" className="block text-sm font-medium text-stone-700 mb-2">
            阶段
          </label>
          <select
            id="phase"
            name="phase"
            defaultValue={filters.phase ?? ''}
            className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-stone-500"
          >
            <option value="">全部阶段</option>
            {FEEDBACK_PHASE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dateFrom" className="block text-sm font-medium text-stone-700 mb-2">
            开始日期
          </label>
          <input
            id="dateFrom"
            name="dateFrom"
            type="date"
            defaultValue={filters.dateFrom}
            className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-stone-500"
          />
        </div>

        <div>
          <label htmlFor="dateTo" className="block text-sm font-medium text-stone-700 mb-2">
            结束日期
          </label>
          <input
            id="dateTo"
            name="dateTo"
            type="date"
            defaultValue={filters.dateTo}
            className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-stone-500"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700"
        >
          应用筛选
        </button>

        <Link
          href={resetHref}
          className="rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50 text-center"
        >
          重置
        </Link>
      </form>
    </div>
  );
}
