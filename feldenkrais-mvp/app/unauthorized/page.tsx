import { UserRole } from '@prisma/client';
import Link from 'next/link';
import {
  getRoleLabel,
  getUnauthorizedState,
  parseRoleListParam,
} from '@/lib/auth/role-routing';
import { getOptionalAuthContext } from '@/server/auth/get-optional-user';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UnauthorizedPage({ searchParams }: Props) {
  const auth = await getOptionalAuthContext();
  const params = await searchParams;
  const expected = parseRoleListParam(
    Array.isArray(params.expected) ? params.expected[0] : params.expected,
  );
  const state = getUnauthorizedState({
    actualRole: auth?.profile?.role ?? null,
    expectedRoles: expected,
  });
  const currentRoleLabel =
    auth?.profile?.role ? getRoleLabel(auth.profile.role) : null;

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-card card">
        <div className="unauthorized-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h1 className="unauthorized-title">{state.title}</h1>
        <p className="unauthorized-desc">{state.description}</p>

        {currentRoleLabel && (
          <div className="unauthorized-role">
            <span className="unauthorized-role-label">当前账号</span>
            <span className="unauthorized-role-value">{currentRoleLabel}</span>
          </div>
        )}

        <div className="unauthorized-actions">
          <Link href={state.primaryAction.href} className="btn-primary">
            {state.primaryAction.label}
          </Link>
          {state.secondaryActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="btn-secondary"
            >
              {action.label}
            </Link>
          ))}
          {auth?.profile?.role === UserRole.STUDENT && expected.includes(UserRole.TEACHER) && (
            <Link href="/admin/login" className="btn-secondary">
              换后台账号登录
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
