import type { Metadata } from 'next';
import Link from 'next/link';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import { UserRole } from '@prisma/client';
import SignOutButton from '@/components/auth/SignOutButton';
import MobileNav from '@/components/layout/MobileNav';
import {
  getNavigationItems,
  getUserDisplayLabel,
} from '@/lib/auth/role-routing';
import { hasPublicSupabaseEnv } from '@/lib/env/public';
import { getOptionalAuthContext } from '@/server/auth/get-optional-user';
import './globals.css';

export const metadata: Metadata = {
  title: '费登奎斯身体觉察',
  description: '身体觉察记录与练习检索',
};

const fontDisplay = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const fontSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = hasPublicSupabaseEnv() ? await getOptionalAuthContext() : null;
  const userLabel = getUserDisplayLabel({
    fullName: auth?.profile?.fullName,
    studentId: auth?.profile?.studentId,
    email: auth?.user.email,
  });
  const navItems = getNavigationItems(auth?.profile?.role);
  const isAdmin = auth?.profile?.role === UserRole.TEACHER;

  return (
  <html lang="zh-CN">
    <body className={`${fontDisplay.variable} ${fontSans.variable}`}>
        <header className="site-header">
          <div className="header-inner">
            <div className="header-brand">
              <Link href="/" className="brand-name">费登奎斯</Link>
              <div className="brand-sub">
                {auth?.profile
                  ? isAdmin
                    ? <span className="role-tag role-tag--admin">管理后台</span>
                    : <span className="role-tag">学生</span>
                  : <span className="brand-tagline">身体觉察 &middot; 练习与反馈</span>
                }
              </div>
            </div>

            <nav className="header-nav">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <MobileNav items={navItems} />

            <div className="header-user">
              {userLabel ? (
                <div className="user-info">
                  <span className="user-name">{userLabel}</span>
                  <SignOutButton />
                </div>
              ) : (
                <Link href="/login" className="btn-primary btn-sm">
                  登录
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="site-main">{children}</main>

        <footer className="site-footer">
          <div className="footer-inner">
            <p className="footer-brand">费登奎斯身体觉察</p>
            <p className="footer-copy">&copy; {new Date().getFullYear()} &middot; 感知身体，觉察当下</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
