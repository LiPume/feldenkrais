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
  'min-h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 text-sm text-[var(--color-text-primary)] shadow-[0_1px_0_rgba(61,48,35,0.04)] transition-colors focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[rgba(139,111,63,0.16)]';

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
            <h2 className="font-[var(--font-display)] text-xl font-medium tracking-normal text-[var(--color-text-primary)]">{title}</h2>
            <p className="mt-1 text-sm leading-7 text-[var(--color-text-secondary)]">
              用阶段和日期范围过滤当前统计结果。
            </p>
          </div>
          {summary && (
            <span className="w-fit rounded-full border border-[#dcc497] bg-[var(--color-accent-light)] px-3 py-1 text-xs font-medium text-[#6f4d1f]">
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
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--color-btn-secondary-border)] bg-[var(--color-btn-secondary-bg)] px-4 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-btn-secondary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            重置
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
