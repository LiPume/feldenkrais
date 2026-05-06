import Link from 'next/link';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import { getPostAuthPath } from '@/lib/auth/role-routing';
import { hasPublicSupabaseEnv } from '@/lib/env/public';
import { getOptionalAuthContext } from '@/server/auth/get-optional-user';
import { hasRuntimeDatabaseEnv } from '@/server/env';

export default async function LoginPage() {
  const auth = await getOptionalAuthContext();

  if (auth?.profile) {
    redirect(getPostAuthPath(auth.profile.role));
  }

  const envReady = hasPublicSupabaseEnv() && hasRuntimeDatabaseEnv();

  return (
    <div className="login-page">
      <div className="login-layout">
        {/* Left panel — branding */}
        <div className="login-panel login-panel--left">
          <div className="login-panel-bg" />
          <div className="login-panel-content">
            <p className="section-eyebrow login-panel-eyebrow">身体觉察</p>
            <h2 className="login-panel-title">
              感知身体<br />
              <em>觉察当下</em>
            </h2>
            <div className="divider" />
            <p className="login-panel-desc">
              费登奎斯练习与反馈记录。慢慢来，感受每一个部位，看见自己的变化。
            </p>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="login-panel login-panel--right">
          <div className="login-form-wrap">
            <Link href="/" className="login-back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              返回首页
            </Link>

            <div className="login-form-header">
              <h1 className="login-form-title">登录 / 注册</h1>
              <p className="login-form-subtitle">使用学号 + 密码登录或注册新账号</p>
              <p className="login-env-hint">
                老师请前往 <Link href="/admin/login">后台登录</Link>。
              </p>
            </div>

            {envReady ? (
              <LoginForm />
            ) : (
              <div className="card login-env-card">
                <p className="login-env-title">环境变量未配置</p>
                <p className="login-env-desc">
                  以下环境变量需要配置后才能使用登录功能：
                </p>
                <div className="login-env-list">
                  <code>NEXT_PUBLIC_SUPABASE_URL</code>
                  <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>
                  <code>DATABASE_URL</code>
                </div>
                <p className="login-env-hint">
                  兼容旧项目也可继续使用 <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>。如需学生注册，还要额外配置 <code>SUPABASE_SERVICE_ROLE_KEY</code>。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
