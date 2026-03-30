// 该页面使用 URL 参数，必须动态渲染
export const dynamic = 'force-dynamic';

import FeedbackFormClient from './FeedbackFormClient';
import { getPracticeById } from '../../lib/mock-practice-data';

type Props = {
  searchParams: Promise<{ practiceId?: string; practiceTitle?: string }>;
};

export default async function NewFeedbackPage({ searchParams }: Props) {
  const params = await searchParams;
  const practiceId = params.practiceId;
  const practiceTitle = params.practiceTitle;

  return (
    <FeedbackFormClient
      practiceId={practiceId}
      practiceTitle={practiceTitle}
    />
  );
}
