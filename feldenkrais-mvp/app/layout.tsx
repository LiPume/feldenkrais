import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "费登奎斯练习与反馈",
  description: "身体觉察记录与练习检索",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-800">
        {/* 顶部导航 */}
        <header className="bg-white border-b border-stone-200 px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <a href="/" className="text-lg font-medium text-stone-900">
              费登奎斯
            </a>
            <nav className="flex gap-4 text-sm text-stone-500">
              <a href="/practice-search" className="hover:text-stone-800 transition-colors">
                找练习
              </a>
              <a href="/feedback" className="hover:text-stone-800 transition-colors">
                我的反馈
              </a>
            </nav>
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
