import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import { hasPublicSupabaseEnv } from '@/lib/env/public';
import { hasRuntimeDatabaseEnv } from '@/server/env';
import { getOptionalAuthContext } from '@/server/auth/get-optional-user';
import { UserRole } from '@prisma/client';

export default async function AdminLoginPage() {
  const auth = await getOptionalAuthContext();

  if (auth?.profile?.role === UserRole.TEACHER) {
    redirect('/teacher');
  }

  const envReady = hasPublicSupabaseEnv() && hasRuntimeDatabaseEnv();

  return (
    <div className="login-page">
      <div className="login-layout">
        {/* Left panel — dark branding */}
        <div className="login-panel login-panel--left login-panel--dark">
          <div className="login-panel-bg" />
          <div className="login-panel-content">
            <p className="section-eyebrow login-panel-eyebrow login-panel-eyebrow--dark">
              管理后台
            </p>
            <h2 className="login-panel-title login-panel-title--dark">
              费登奎斯<br />
              <em>管理平台</em>
            </h2>
            <div className="divider divider--dark" />
            <p className="login-panel-desc login-panel-desc--dark">
              查看全班练习反馈统计与学生填写情况，下钻到具体学生或练习的详细数据。
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
              <h1 className="login-form-title">登录后台</h1>
              <p className="login-form-subtitle">请使用后台账号邮箱登录</p>
            </div>

            {envReady ? (
              <AdminLoginForm />
            ) : (
              <div className="card login-env-card">
                <p className="login-env-title">环境变量未配置</p>
                <p className="login-env-desc">以下环境变量需要配置后才能使用登录功能：</p>
                <div className="login-env-list">
                  <code>NEXT_PUBLIC_SUPABASE_URL</code>
                  <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>
                  <code>DATABASE_URL</code>
                </div>
                <p className="login-env-hint">
                  兼容旧项目也可继续使用 <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
