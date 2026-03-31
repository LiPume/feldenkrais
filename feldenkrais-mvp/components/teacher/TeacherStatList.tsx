import Link from 'next/link';

type Props = {
  items: Array<{ label: string; value: number; href?: string }>;
  emptyLabel?: string;
};

export default function TeacherStatList({
  items,
  emptyLabel = '还没有统计数据。',
}: Props) {
  if (items.length === 0) {
    return <p className="text-sm text-stone-400">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const content = (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
            <span className="text-sm text-stone-700">{item.label}</span>
            <span className="text-sm font-medium text-stone-900">{item.value}</span>
          </div>
        );

        return item.href ? (
          <Link
            key={`${item.label}-${item.value}`}
            href={item.href}
            className="block hover:opacity-80 transition-opacity"
          >
            {content}
          </Link>
        ) : (
          <div key={`${item.label}-${item.value}`}>{content}</div>
        );
      })}
    </div>
  );
}
