'use client';

import { useActionState } from 'react';
import { authenticateWithPassword, type AuthFormState } from '@/server/actions/auth';

const initialState: AuthFormState = {};

export default function LoginForm() {
  const [state, action, pending] = useActionState(
    authenticateWithPassword,
    initialState,
  );

  return (
    <form action={action} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
          邮箱
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
          密码
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="至少 6 位"
          className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
          required
          minLength={6}
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-stone-700 mb-2">
          账号角色
        </label>
        <select
          id="role"
          name="role"
          defaultValue="student"
          className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-stone-500"
        >
          <option value="student">学生</option>
          <option value="teacher">老师</option>
        </select>
        <p className="mt-2 text-xs text-stone-400">
          注册时会按这里创建 profile 角色；登录时会忽略这个值，沿用已存在角色。
        </p>
      </div>

      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {state.successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {state.successMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          name="mode"
          value="sign-in"
          disabled={pending}
          className="flex-1 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? '处理中...' : '登录'}
        </button>
        <button
          type="submit"
          name="mode"
          value="sign-up"
          disabled={pending}
          className="flex-1 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          注册
        </button>
      </div>
    </form>
  );
}
