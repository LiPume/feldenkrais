import PublicHome from '@/components/home/PublicHome';
import RoleWorkspaceHome from '@/components/home/RoleWorkspaceHome';
import { getUserDisplayLabel } from '@/lib/auth/role-routing';
import { hasPublicSupabaseEnv } from '@/lib/env/public';
import { getOptionalAuthContext } from '@/server/auth/get-optional-user';

export default async function HomePage() {
  const auth = hasPublicSupabaseEnv() ? await getOptionalAuthContext() : null;

  if (!auth?.profile) {
    return <PublicHome />;
  }

  const userLabel = getUserDisplayLabel({
    fullName: auth.profile.fullName,
    studentId: auth.profile.studentId,
    email: auth.user.email,
  });

  return (
    <RoleWorkspaceHome
      role={auth.profile.role}
      userLabel={userLabel ?? '当前账号'}
      studentId={auth.profile.studentId ?? undefined}
    />
  );
}
