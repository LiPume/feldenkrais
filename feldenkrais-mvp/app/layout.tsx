import type { Metadata } from "next";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import SignOutButton from "@/components/auth/SignOutButton";
import { hasPublicSupabaseEnv } from "@/lib/env/public";
import { getOptionalAuthContext } from "@/server/auth/get-optional-user";
import "./globals.css";

export const metadata: Metadata = {
  title: "费登奎斯练习与反馈",
  description: "身体觉察记录与练习检索",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = hasPublicSupabaseEnv() ? await getOptionalAuthContext() : null;
  const userLabel =
    auth?.profile?.fullName ?? auth?.user.email ?? null;
  const showTeacherNav = auth?.profile?.role === UserRole.TEACHER;
  const teacherNavLabel = showTeacherNav ? '老师端' : '老师入口';

  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-800">
        {/* 顶部导航 */}
        <header className="bg-white border-b border-stone-200 px-6 py-4">
          <div className="max-w-5xl mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="text-lg font-medium text-stone-900">
              费登奎斯
            </Link>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
              <nav className="flex flex-wrap gap-4 text-sm text-stone-500">
                <Link href="/practice-search" className="hover:text-stone-800 transition-colors">
                  找练习
                </Link>
                <Link href="/feedback" className="hover:text-stone-800 transition-colors">
                  我的反馈
                </Link>
                <Link href="/teacher" className="hover:text-stone-800 transition-colors">
                  {teacherNavLabel}
                </Link>
              </nav>

              <div className="flex items-center gap-3 text-sm">
                {userLabel ? (
                  <>
                    <span className="text-stone-500 truncate max-w-[14rem]">
                      {userLabel}
                    </span>
                    <SignOutButton />
                  </>
                ) : (
                  <Link href="/login" className="text-stone-500 hover:text-stone-900 transition-colors">
                    登录
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* 主内容区 */}
        <main className="flex-1">{children}</main>

        {/* 底部 */}
        <footer className="border-t border-stone-200 bg-white px-6 py-4 text-center text-xs text-stone-400">
          费登奎斯身体觉察 &copy; {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
