import Link from 'next/link';
import type { PracticeListItem } from '@/types/practice';

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

type Props = {
  practice: PracticeListItem;
};

export default function PracticeCard({ practice }: Props) {
  return (
    <Link
      href={`/practices/${practice.slug}`}
      className="block bg-white rounded-xl border border-stone-200 p-4 hover:border-stone-400 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-medium text-stone-900 leading-snug">
          {practice.title}
        </h3>
        {practice.durationSec ? (
          <span className="text-xs text-stone-400 whitespace-nowrap">
            {formatDuration(practice.durationSec)}
          </span>
        ) : null}
      </div>
      {practice.courseName ? (
        <p className="text-xs text-stone-400 mb-2">{practice.courseName}</p>
      ) : null}
      {practice.summary ? (
        <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
          {practice.summary}
        </p>
      ) : null}
    </Link>
  );
}
