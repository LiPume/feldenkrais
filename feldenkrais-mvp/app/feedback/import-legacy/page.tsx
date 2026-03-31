import { UserRole } from '@prisma/client';
import LegacyImportClient from '@/components/feedback/LegacyImportClient';
import { requireRole } from '@/server/auth/require-role';

export default async function FeedbackImportLegacyPage() {
  await requireRole(UserRole.STUDENT);

  return <LegacyImportClient />;
}
