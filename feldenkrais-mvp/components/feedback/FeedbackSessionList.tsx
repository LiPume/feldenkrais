import Link from 'next/link';
import type { FeedbackSessionListItem } from '@/types/feedback';
import FeedbackSessionCard from '@/components/feedback/FeedbackSessionCard';

type Props = {
  sessions: FeedbackSessionListItem[];
  showStudent?: boolean;
  showStudentLink?: boolean;
  emptyHref?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
};

export default function FeedbackSessionList({
  sessions,
  showStudent = false,
  showStudentLink = false,
  emptyHref = '/feedback/new',
  emptyTitle = '暂无反馈记录',
  emptyDescription = '做完练习后，可以来这里查看每个身体部位的独立反馈。',
  emptyActionLabel = '开始记录第一条',
}: Props) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
        <p className="text-stone-700 text-base mb-2">{emptyTitle}</p>
        <p className="text-stone-400 text-sm mb-5">{emptyDescription}</p>
        <Link
          href={emptyHref}
          className="inline-block px-6 py-3 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-700 transition-colors"
        >
          {emptyActionLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {sessions.map((session) => (
        <FeedbackSessionCard
          key={session.id}
          session={session}
          showStudent={showStudent}
          showStudentLink={showStudentLink}
        />
      ))}
    </div>
  );
}
