import Link from 'next/link';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import Alert from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
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
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-5xl flex-col justify-center gap-8 px-4 py-8 sm:px-6">
      <div className="max-w-2xl">
        <Link
          href="/"
          className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
        >
          返回首页
        </Link>
        <div className="mt-8">
          <Badge variant="warm">学生入口</Badge>
          <h1 className="mt-5 text-3xl font-medium leading-tight tracking-normal text-stone-950 sm:text-4xl">
            登录或注册，继续你的身体觉察记录。
          </h1>
          <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-base">
            使用学号和密码进入系统。新账号注册后会自动登录并进入学生工作台。
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_24rem] lg:items-start">
        <Card>
          <CardHeader>
            <CardTitle>学号登录 / 注册</CardTitle>
            <p className="text-sm leading-6 text-stone-600">
              老师和后台账号请使用独立后台入口。
            </p>
          </CardHeader>
          <CardContent>
            {envReady ? (
              <LoginForm />
            ) : (
              <Alert variant="warning">
                环境变量未配置。请配置 Supabase 公开变量和 DATABASE_URL 后再使用登录功能。
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#fffaf0]">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-stone-700">进入前的小提示</p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              这里记录的是练习过程中的感受，不需要追求标准答案。选择一个身体部位，慢慢完成练习，再写下当下最真实的反馈。
            </p>
            <Link
              href="/admin/login"
              className="mt-5 inline-flex text-sm font-medium text-stone-700 underline underline-offset-4 transition-colors hover:text-stone-950"
            >
              后台账号登录
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
