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
  const studentLabel = `学生：${session.studentName}${session.studentId ? ` · ${session.studentId}` : ''}${session.studentEmail ? ` · ${session.studentEmail}` : ''}`;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          {session.practiceTitle ? (
            session.practiceSlug ? (
              <Link
                href={`/practices/${session.practiceSlug}`}
                className="text-base font-medium text-stone-900 hover:text-stone-700 transition-colors"
              >
                {session.practiceTitle}
              </Link>
            ) : (
              <span className="text-base font-medium text-stone-900">
                {session.practiceTitle}
              </span>
            )
          ) : (
            <span className="text-base font-medium text-stone-400">未关联练习</span>
          )}

          {showStudent && (
            showStudentLink ? (
              <Link
                href={`/teacher/students/${session.studentProfileId}`}
                className="inline-flex mt-1 text-sm text-stone-500 hover:text-stone-800 transition-colors"
              >
                {studentLabel}
              </Link>
            ) : (
              <p className="text-sm text-stone-500 mt-1">
                {studentLabel}
              </p>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-block px-2 py-0.5 text-xs rounded-full ${
              session.feedbackPhase === 'before'
                ? 'bg-stone-100 text-stone-600'
                : 'bg-stone-800 text-white'
            }`}
          >
            {FEEDBACK_PHASE_NAME_MAP[session.feedbackPhase]}
          </span>
          <span className="text-xs text-stone-400">
            {formatMonthDayLabel(session.feedbackDate)}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {session.entries.map((entry) => (
          <div key={entry.id} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-stone-900">{entry.bodyRegionName}</span>
              <span className="text-xs text-stone-500">强度 {entry.intensityScore}/10</span>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {entry.labelNames.length > 0 ? (
                entry.labelNames.map((labelName) => (
                  <span
                    key={`${entry.id}-${labelName}`}
                    className="inline-flex rounded-full bg-white px-2 py-0.5 text-xs text-stone-600 border border-stone-200"
                  >
                    {labelName}
                  </span>
                ))
              ) : (
                <span className="text-xs text-stone-400">未选标签</span>
              )}
            </div>

            <p className="mt-2 text-xs text-stone-500">
              左右差异：{LEFT_RIGHT_NAME_MAP[entry.leftRightDiff]}
            </p>

            {entry.note && (
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">{entry.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
