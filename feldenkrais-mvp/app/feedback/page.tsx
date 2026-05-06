// 该页面需要登录状态和最新内容，必须动态渲染
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import FeedbackSessionList from '@/components/feedback/FeedbackSessionList';
import { requireRole } from '@/server/auth/require-role';
import { FEEDBACK_ACCESS_ROLES } from '@/server/auth/role-groups';
import { getFeedbackSessionsByStudentProfileId } from '@/server/queries/feedback';

export default async function FeedbackListPage() {
  const { profile } = await requireRole(FEEDBACK_ACCESS_ROLES);
  const sessions = await getFeedbackSessionsByStudentProfileId(profile.id);

  return (
    <div className="page-container">
      <div className="page-header animate-fade-in-up">
        <div>
          <p className="section-eyebrow">我的</p>
          <h1 className="page-title">反馈记录</h1>
          <p className="page-subtitle">
            在时间轴中回看练习感受，看见自己的变化轨迹。
          </p>
        </div>
        <Link href="/feedback/new" className="btn-primary page-new-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          新建反馈
        </Link>
      </div>

      <FeedbackSessionList sessions={sessions} />
    </div>
  );
}
