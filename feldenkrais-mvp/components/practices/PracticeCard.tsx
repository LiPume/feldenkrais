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
      className="practice-card"
    >
      <div className="practice-card-inner">
        <div className="practice-card-body">
          <h3 className="practice-card-title">{practice.title}</h3>
          {practice.courseName && (
            <p className="practice-card-course">{practice.courseName}</p>
          )}
          {practice.summary && (
            <p className="practice-card-summary">{practice.summary}</p>
          )}
        </div>
        {practice.durationSec && (
          <div className="practice-card-duration">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {formatDuration(practice.durationSec)}
          </div>
        )}
      </div>
      <div className="practice-card-arrow">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </Link>
  );
}
