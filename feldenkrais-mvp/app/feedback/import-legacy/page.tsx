import LegacyImportClient from '@/components/feedback/LegacyImportClient';
import { requireRole } from '@/server/auth/require-role';
import { FEEDBACK_ACCESS_ROLES } from '@/server/auth/role-groups';

export default async function FeedbackImportLegacyPage() {
  await requireRole(FEEDBACK_ACCESS_ROLES);

  return <LegacyImportClient />;
}
