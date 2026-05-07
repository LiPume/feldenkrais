import Link from 'next/link';
import type { ReactNode } from 'react';
import SignOutButton from '@/components/auth/SignOutButton';
import AppNav, { type AppNavItem } from '@/components/layout/AppNav';

type AppShellRole = 'guest' | 'student' | 'admin';

type AppShellProps = {
  children: ReactNode;
  role: AppShellRole;
  userLabel?: string | null;
};

function getShellNavItems(role: AppShellRole): AppNavItem[] {
  if (role === 'admin') {
    return [
      { href: '/teacher', label: '管理后台' },
    ];
  }

  if (role === 'student') {
    return [
      { href: '/practice-search', label: '找练习' },
      { href: '/feedback', label: '我的反馈' },
    ];
  }

  return [
    { href: '/practice-search', label: '找练习' },
  ];
}

function getRoleLabel(role: AppShellRole): string {
  if (role === 'admin') return '管理后台';
  if (role === 'student') return '学生';
  return '身体觉察 · 练习与反馈';
}

export default function AppShell({ children, role, userLabel }: AppShellProps) {
  const navItems = getShellNavItems(role);

  return (
    <div className="min-h-dvh bg-[var(--color-bg)] text-stone-950">
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[rgba(250,247,242,0.92)] backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <Link
              href="/"
              className="block w-fit text-lg font-medium tracking-normal text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
            >
              费登奎斯
            </Link>
            <p className="mt-0.5 truncate text-xs text-stone-500">{getRoleLabel(role)}</p>
          </div>

          <AppNav items={navItems} />

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {userLabel ? (
              <div className="flex items-center gap-3">
                <span className="hidden max-w-32 truncate text-sm text-stone-600 sm:inline">
                  {userLabel}
                </span>
                <SignOutButton />
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex min-h-9 items-center justify-center rounded-lg border border-stone-950 bg-stone-950 px-3 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-stone-200/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-8 text-sm text-stone-500 sm:px-6">
          <p className="font-medium text-stone-700">费登奎斯身体觉察</p>
          <p>&copy; {new Date().getFullYear()} · 感知身体，觉察当下</p>
        </div>
      </footer>
    </div>
  );
}
