import Link from 'next/link';
import EmptyState from '@/components/ui/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export type StatBarChartItem = {
  href?: string;
  label: string;
  value: number;
};

type Props = {
  description?: string;
  emptyLabel?: string;
  items: StatBarChartItem[];
  title: string;
};

export default function StatBarChart({
  description,
  emptyLabel = '暂无统计数据',
  items,
  title,
}: Props) {
  const maxValue = Math.max(0, ...items.map((item) => item.value));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm leading-6 text-stone-600">{description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-2">
        {items.length === 0 ? (
          <EmptyState
            title={emptyLabel}
            description="调整筛选范围或等待学生提交反馈后，这里会显示统计结果。"
            className="border-dashed shadow-none"
          />
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => {
              const width = maxValue > 0 ? `${Math.max(4, (item.value / maxValue) * 100)}%` : '0%';
              const row = (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-sm font-medium text-stone-700">
                      {item.label}
                    </span>
                    <span className="shrink-0 text-sm font-medium text-stone-950">
                      {item.value}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-amber-700/70"
                      style={{ width }}
                    />
                  </div>
                </div>
              );

              return item.href ? (
                <Link
                  key={`${item.label}-${index}`}
                  href={item.href}
                  className="block rounded-lg transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
                >
                  <div className="p-2">{row}</div>
                </Link>
              ) : (
                <div key={`${item.label}-${index}`} className="p-2">
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
