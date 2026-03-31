import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <h1 className="text-2xl font-medium text-stone-900 mb-3">没有访问权限</h1>
      <p className="text-sm text-stone-500 mb-6">
        当前账号已登录，但没有打开这个页面所需的角色权限。
        老师端需要老师角色账号。
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Link
          href="/"
          className="px-5 py-3 rounded-xl bg-stone-900 text-white text-sm font-medium"
        >
          返回首页
        </Link>
        <Link
          href="/feedback"
          className="px-5 py-3 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm font-medium"
        >
          去我的反馈
        </Link>
        <Link
          href="/login"
          className="px-5 py-3 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm font-medium"
        >
          换老师账号登录
        </Link>
      </div>
    </div>
  );
}
