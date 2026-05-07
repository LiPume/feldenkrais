import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export type DonutDistributionItem = {
  label: string;
  value: number;
};

type Props = {
  description?: string;
  emptyLabel?: string;
  items: DonutDistributionItem[];
  maxItems?: number;
  title: string;
};

const segmentColors = [
  '#a8752a',
  '#71805f',
  '#9a6049',
  '#786d61',
  '#8a8354',
  '#b88745',
  '#6f6657',
  '#b99670',
];

export default function DonutDistributionChart({
  description,
  emptyLabel = '暂无分布数据',
  items,
  maxItems = 8,
  title,
}: Props) {
  const visibleItems = items
    .slice(0, maxItems)
    .filter((item) => item.value > 0);
  const total = visibleItems.reduce((sum, item) => sum + item.value, 0);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const segments = visibleItems.map((item) => {
    const fraction = total > 0 ? item.value / total : 0;
    const dash = fraction * circumference;
    return {
      dash,
      item,
    };
  }).reduce<Array<{ dash: number; item: DonutDistributionItem; offset: number }>>((result, segment) => {
    const previous = result[result.length - 1];
    result.push({
      ...segment,
      offset: previous ? previous.offset + previous.dash : 0,
    });
    return result;
  }, []);

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="border-b border-[var(--color-border-soft)]">
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm leading-7 text-[var(--color-text-secondary)]">{description}</p>
        )}
      </CardHeader>
      <CardContent className="p-5">
        {visibleItems.length === 0 || total === 0 ? (
          <EmptyState
            title={emptyLabel}
            description="有标签反馈后，这里会显示感受分布。"
            className="border-dashed shadow-none"
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-[11rem_1fr] sm:items-center lg:grid-cols-1 xl:grid-cols-[11rem_1fr]">
            <div className="relative mx-auto size-44">
              <svg viewBox="0 0 120 120" className="size-44 -rotate-90" aria-hidden="true">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#eee5d6"
                  strokeWidth="16"
                />
                {segments.map((segment, index) => {
                  return (
                    <circle
                      key={`${segment.item.label}-${index}`}
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke={segmentColors[index % segmentColors.length]}
                      strokeWidth="16"
                      strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
                      strokeDashoffset={-segment.offset}
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold tabular-nums text-[var(--color-text-primary)]">{total}</span>
                <span className="text-xs text-[var(--color-text-muted)]">标签选择</span>
              </div>
            </div>

            <div className="space-y-2">
              {visibleItems.map((item, index) => {
                const percent = Math.round((item.value / total) * 100);
                return (
                  <div key={`${item.label}-${index}`} className="flex items-center justify-between gap-3 rounded-xl bg-[var(--color-bg-soft)] px-3 py-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: segmentColors[index % segmentColors.length] }}
                      />
                      <span className="truncate text-sm font-medium text-[var(--color-text-secondary)]" title={item.label}>
                        {item.label}
                      </span>
                    </div>
                    <Badge variant="neutral">
                      {item.value} · {percent}%
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
