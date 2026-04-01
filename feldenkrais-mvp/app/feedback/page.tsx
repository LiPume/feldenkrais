import Link from 'next/link';
import FeedbackSessionList from '@/components/feedback/FeedbackSessionList';
import { requireRole } from '@/server/auth/require-role';
import { FEEDBACK_ACCESS_ROLES } from '@/server/auth/role-groups';
import { getFeedbackSessionsByStudentProfileId } from '@/server/queries/feedback';

export default async function FeedbackListPage() {
  const { profile } = await requireRole(FEEDBACK_ACCESS_ROLES);
  const sessions = await getFeedbackSessionsByStudentProfileId(profile.id);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-stone-900">我的反馈</h1>
          <p className="text-sm text-stone-400 mt-1">
            如果你之前在旧版本里用过本地存储，可以去
            {' '}
            <Link
              href="/feedback/import-legacy"
              className="text-stone-600 hover:text-stone-900 transition-colors"
            >
              导入旧版反馈
            </Link>
            。
          </p>
        </div>
        <Link
          href="/feedback/new"
          className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
        >
          + 新建
        </Link>
      </div>

      <FeedbackSessionList sessions={sessions} />
    </div>
  );
}
