import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import FormField from '@/components/ui/FormField';
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

const inputClassName =
  'min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3.5 text-sm text-stone-900 shadow-sm transition-colors focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200';

export default function TeacherFeedbackFiltersForm({
  action,
  resetHref,
  filters,
  title = '筛选范围',
}: Props) {
  const hasFilters = hasTeacherFeedbackFilters(filters);
  const summary = hasFilters ? formatFilterSummary(filters) : null;

  return (
    <Card>
      <CardContent className="space-y-5 p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-lg font-medium tracking-normal text-stone-950">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              用阶段和日期范围过滤当前统计结果。
            </p>
          </div>
          {summary && (
            <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">
              当前筛选：{summary}
            </span>
          )}
        </div>

        <form action={action} className="grid gap-4 md:grid-cols-[12rem_1fr_1fr_auto_auto] md:items-end">
          <FormField htmlFor="phase" label="阶段">
            <select
              id="phase"
              name="phase"
              defaultValue={filters.phase ?? ''}
              className={inputClassName}
            >
              <option value="">全部阶段</option>
              {FEEDBACK_PHASE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField htmlFor="dateFrom" label="开始日期">
            <input
              id="dateFrom"
              name="dateFrom"
              type="date"
              defaultValue={filters.dateFrom}
              className={inputClassName}
            />
          </FormField>

          <FormField htmlFor="dateTo" label="结束日期">
            <input
              id="dateTo"
              name="dateTo"
              type="date"
              defaultValue={filters.dateTo}
              className={inputClassName}
            />
          </FormField>

          <Button type="submit">应用筛选</Button>

          <Link
            href={resetHref}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-stone-300 bg-white px-4 text-sm font-medium text-stone-800 transition-colors hover:border-stone-400 hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
          >
            重置
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
