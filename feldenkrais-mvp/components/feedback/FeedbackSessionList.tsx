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
  emptyDescription = '做完练习后来这里查看记录。慢慢来，注意感受每一个部位。',
  emptyActionLabel = '开始记录',
}: Props) {
  if (sessions.length === 0) {
    return (
      <div className="session-list-empty card">
        <div className="session-list-empty-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12l2 2 4-4"/>
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
          </svg>
        </div>
        <h3 className="session-list-empty-title">{emptyTitle}</h3>
        <p className="session-list-empty-desc">{emptyDescription}</p>
        <Link href={emptyHref} className="btn-primary session-list-empty-btn">
          {emptyActionLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="session-list stagger-children">
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
