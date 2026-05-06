import Link from 'next/link';
import {
  FEEDBACK_PHASE_NAME_MAP,
  LEFT_RIGHT_NAME_MAP,
} from '@/lib/constants/feedback-labels';
import { formatMonthDayLabel } from '@/lib/utils/date';
import type { FeedbackSessionListItem } from '@/types/feedback';

type Props = {
  session: FeedbackSessionListItem;
  showStudent?: boolean;
  showStudentLink?: boolean;
};

export default function FeedbackSessionCard({
  session,
  showStudent = false,
  showStudentLink = false,
}: Props) {
  const studentLabel = `${session.studentName}${session.studentId ? ` · ${session.studentId}` : ''}${session.studentEmail ? ` · ${session.studentEmail}` : ''}`;

  return (
    <div className="session-card card">
      {/* Card header */}
      <div className="session-card-header">
        <div className="session-card-meta">
          {session.practiceTitle ? (
            session.practiceSlug ? (
              <Link
                href={`/practices/${session.practiceSlug}`}
                className="session-card-title"
              >
                {session.practiceTitle}
              </Link>
            ) : (
              <span className="session-card-title session-card-title--dim">{session.practiceTitle}</span>
            )
          ) : (
            <span className="session-card-title session-card-title--dim">未关联练习</span>
          )}

          {showStudent && (
            showStudentLink ? (
              <Link
                href={`/teacher/students/${session.studentProfileId}`}
                className="session-card-student"
              >
                {studentLabel}
              </Link>
            ) : (
              <p className="session-card-student">{studentLabel}</p>
            )
          )}
        </div>

        <div className="session-card-tags">
          <span className={`session-phase-tag ${session.feedbackPhase === 'before' ? 'session-phase-tag--before' : 'session-phase-tag--after'}`}>
            {FEEDBACK_PHASE_NAME_MAP[session.feedbackPhase]}
          </span>
          <span className="session-date">{formatMonthDayLabel(session.feedbackDate)}</span>
        </div>
      </div>

      {/* Entries */}
      <div className="session-entries">
        {session.entries.map((entry) => (
          <div key={entry.id} className="session-entry">
            <div className="session-entry-header">
              <div className="session-entry-region">
                <span className="session-entry-dot" />
                {entry.bodyRegionName}
              </div>
              <span className="session-entry-intensity">
                强度 {entry.intensityScore}
                <span className="session-entry-intensity-max">/10</span>
              </span>
            </div>

            {(entry.labelNames.length > 0 || entry.note) && (
              <div className="session-entry-details">
                {entry.labelNames.length > 0 && (
                  <div className="session-entry-labels">
                    {entry.labelNames.map((labelName) => (
                      <span key={`${entry.id}-${labelName}`} className="session-entry-label">
                        {labelName}
                      </span>
                    ))}
                  </div>
                )}
                {entry.note && (
                  <p className="session-entry-note">{entry.note}</p>
                )}
                {entry.leftRightDiff !== 'none' && (
                  <p className="session-entry-diff">左右差异：{LEFT_RIGHT_NAME_MAP[entry.leftRightDiff]}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
