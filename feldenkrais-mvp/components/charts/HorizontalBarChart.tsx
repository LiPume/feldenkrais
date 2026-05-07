import Link from 'next/link';
import EmptyState from '@/components/ui/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

export type HorizontalBarChartItem = {
  href?: string;
  label: string;
  value: number;
};

type Props = {
  description?: string;
  emptyLabel?: string;
  items: HorizontalBarChartItem[];
  maxItems?: number;
  tone?: 'amber' | 'stone' | 'sage';
  title: string;
};

const toneClasses = {
  amber: {
    accent: 'bg-[var(--color-chart-amber)]',
    soft: 'bg-[var(--color-accent-light)]',
    text: 'text-[#6f4d1f]',
  },
  stone: {
    accent: 'bg-[var(--color-chart-stone)]',
    soft: 'bg-[var(--color-surface-muted)]',
    text: 'text-[var(--color-text-primary)]',
  },
  sage: {
    accent: 'bg-[var(--color-chart-sage)]',
    soft: 'bg-[var(--color-sage-light)]',
    text: 'text-[#566348]',
  },
};

export default function HorizontalBarChart({
  description,
  emptyLabel = '暂无统计数据',
  items,
  maxItems = 8,
  tone = 'amber',
  title,
}: Props) {
  const visibleItems = items.slice(0, maxItems);
  const maxValue = Math.max(0, ...visibleItems.map((item) => item.value));
  const toneClass = toneClasses[tone];

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="border-b border-[var(--color-border-soft)]">
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm leading-7 text-[var(--color-text-secondary)]">{description}</p>
        )}
      </CardHeader>
      <CardContent className="p-5">
        {visibleItems.length === 0 ? (
          <EmptyState
            title={emptyLabel}
            description="调整筛选范围或等待学生提交反馈后，这里会显示统计结果。"
            className="border-dashed shadow-none"
          />
        ) : (
          <div className="space-y-3">
            {visibleItems.map((item, index) => {
              const percent = maxValue > 0 ? item.value / maxValue : 0;
              const width = `${Math.max(item.value > 0 ? 7 : 0, percent * 100)}%`;
              const row = (
                <div className="grid gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className={cn('mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium', toneClass.soft, toneClass.text)}>
                        {index + 1}
                      </span>
                      <span className="min-w-0 truncate text-sm font-medium text-[var(--color-text-primary)]" title={item.label}>
                        {item.label}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-[var(--color-text-primary)]">
                      {item.value}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
                    <div
                      className={cn('h-full rounded-full', toneClass.accent)}
                      style={{ width, opacity: 0.52 + percent * 0.38 }}
                    />
                  </div>
                </div>
              );

              if (item.href) {
                return (
                  <Link
                    key={`${item.label}-${index}`}
                    href={item.href}
                    className="block rounded-xl p-2 transition-colors hover:bg-[var(--color-bg-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                  >
                    {row}
                  </Link>
                );
              }

              return (
                <div key={`${item.label}-${index}`} className="rounded-xl p-2">
                  {row}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
