// 该页面使用 URL 参数，必须动态渲染
export const dynamic = 'force-dynamic';

import FeedbackFormClient from '@/components/feedback/FeedbackFormClient';
import { getPracticeById } from '@/server/queries/practices';
import { requireRole } from '@/server/auth/require-role';
import { FEEDBACK_ACCESS_ROLES } from '@/server/auth/role-groups';

type Props = {
  searchParams: Promise<{ practiceId?: string; practiceTitle?: string }>;
};

export default async function NewFeedbackPage({ searchParams }: Props) {
  await requireRole(FEEDBACK_ACCESS_ROLES);
  const params = await searchParams;
  const requestedPracticeId = params.practiceId;
  const practice = requestedPracticeId ? await getPracticeById(requestedPracticeId) : null;

  return (
    <FeedbackFormClient
      practiceId={practice?.id ?? requestedPracticeId}
      practiceTitle={practice?.title ?? params.practiceTitle}
      practiceSlug={practice?.slug}
    />
  );
}
