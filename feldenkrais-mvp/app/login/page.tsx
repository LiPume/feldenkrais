import Link from 'next/link';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';
import LoginForm from '@/components/auth/LoginForm';
import { hasPublicSupabaseEnv } from '@/lib/env/public';
import { getOptionalAuthContext } from '@/server/auth/get-optional-user';
import { hasDatabaseEnv } from '@/server/env';

export default async function LoginPage() {
  const auth = await getOptionalAuthContext();

  if (auth) {
    redirect(auth.profile?.role === UserRole.TEACHER ? '/teacher' : '/feedback');
  }

  const envReady = hasPublicSupabaseEnv() && hasDatabaseEnv();

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 mb-6 transition-colors"
      >
        <span>&larr;</span>
        <span>返回首页</span>
      </Link>

      <h1 className="text-2xl font-medium text-stone-900 mb-2">登录 / 注册</h1>
      <p className="text-sm text-stone-500 mb-8">
        学生和老师共用同一个项目，通过角色控制可访问的数据和页面。
        学生现在使用学号登录，老师继续使用邮箱登录。
      </p>

      <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-stone-900">想进老师端？</p>
            <p className="text-sm text-stone-500 mt-1">
              用老师角色登录后，系统会直接跳到 `/teacher`。
            </p>
          </div>
          <Link
            href="/teacher"
            className="inline-flex justify-center rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 hover:bg-stone-50 transition-colors"
          >
            打开老师入口
          </Link>
        </div>
      </div>

      {envReady ? (
        <LoginForm />
      ) : (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
          <p className="text-sm text-stone-700">
            还差环境变量配置，登录功能暂时不会真正连到 Supabase。
          </p>
          <div className="rounded-xl bg-stone-100 px-4 py-3 text-sm text-stone-600">
            <p>`NEXT_PUBLIC_SUPABASE_URL`</p>
            <p>`NEXT_PUBLIC_SUPABASE_ANON_KEY`</p>
            <p>`DATABASE_URL`</p>
            <p>`DIRECT_URL`</p>
          </div>
          <p className="text-xs text-stone-400">
            把这些值写到 `.env.local` 后，这个页面就可以直接继续使用。
          </p>
        </div>
      )}
    </div>
  );
}
