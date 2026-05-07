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
    accent: 'bg-amber-700',
    soft: 'bg-amber-50',
    text: 'text-amber-900',
  },
  stone: {
    accent: 'bg-stone-700',
    soft: 'bg-stone-100',
    text: 'text-stone-900',
  },
  sage: {
    accent: 'bg-emerald-700',
    soft: 'bg-emerald-50',
    text: 'text-emerald-900',
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
      <CardHeader className="border-b border-stone-100">
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm leading-6 text-stone-600">{description}</p>
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
                      <span className="min-w-0 truncate text-sm font-medium text-stone-800" title={item.label}>
                        {item.label}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-stone-950">
                      {item.value}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-stone-100">
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
                    className="block rounded-xl p-2 transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
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
