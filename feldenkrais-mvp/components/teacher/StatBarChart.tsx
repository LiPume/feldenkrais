import HorizontalBarChart from '@/components/charts/HorizontalBarChart';

export type StatBarChartItem = {
  href?: string;
  label: string;
  value: number;
};

type Props = {
  description?: string;
  emptyLabel?: string;
  items: StatBarChartItem[];
  maxItems?: number;
  title: string;
};

export default function StatBarChart({
  description,
  emptyLabel = '暂无统计数据',
  items,
  maxItems,
  title,
}: Props) {
  return (
    <HorizontalBarChart
      title={title}
      description={description}
      emptyLabel={emptyLabel}
      items={items}
      maxItems={maxItems}
    />
  );
}
