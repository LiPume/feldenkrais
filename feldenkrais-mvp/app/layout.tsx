import type { Metadata } from 'next';
import { Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google';
import { UserRole } from '@prisma/client';
import AppShell from '@/components/layout/AppShell';
import { getUserDisplayLabel } from '@/lib/auth/role-routing';
import { hasPublicSupabaseEnv } from '@/lib/env/public';
import { getOptionalAuthContext } from '@/server/auth/get-optional-user';
import './globals.css';

export const metadata: Metadata = {
  title: '费登奎斯身体觉察',
  description: '身体觉察记录与练习检索',
};

const fontDisplay = Noto_Serif_SC({
  weight: ['400', '500', '600'],
  variable: '--font-noto-serif-sc',
  display: 'swap',
  preload: false,
});

const fontSans = Noto_Sans_SC({
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
  preload: false,
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
  const shellRole = auth?.profile?.role === UserRole.TEACHER
    ? 'admin'
    : auth?.profile?.role === UserRole.STUDENT
      ? 'student'
      : 'guest';

  return (
    <html lang="zh-CN">
      <body className={`${fontDisplay.variable} ${fontSans.variable}`}>
        <AppShell role={shellRole} userLabel={userLabel}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
