'use client';

import { useActionState, useState } from 'react';
import { authenticateWithPassword, type AuthFormState } from '@/server/actions/auth';

const initialState: AuthFormState = {};

export default function LoginForm() {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [state, action, pending] = useActionState(
    authenticateWithPassword,
    initialState,
  );

  return (
    <form action={action} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-stone-700 mb-2">
          姓名
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="例如：张三"
          className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
        />
        <p className="mt-2 text-xs text-stone-400">
          注册时建议填写真实姓名；如果老账号之前没填，现在登录时也可以补上。
        </p>
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-stone-700 mb-2">
          账号角色
        </label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(event) => setRole(event.target.value as 'student' | 'teacher')}
          className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-stone-500"
        >
          <option value="student">学生</option>
          <option value="teacher">老师</option>
        </select>
        <p className="mt-2 text-xs text-stone-400">
          学生使用学号登录；老师继续使用邮箱登录。注册时会按这里创建 profile 角色。
        </p>
      </div>

      <div>
        <label htmlFor="studentId" className="block text-sm font-medium text-stone-700 mb-2">
          学号
        </label>
        <input
          id="studentId"
          name="studentId"
          type="text"
          autoComplete="username"
          placeholder="例如：20240001"
          className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
          required={role === 'student'}
        />
        <p className="mt-2 text-xs text-stone-400">
          学生登录和注册都用学号。老师可留空。
        </p>
      </div>

      {role === 'teacher' && (
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
            邮箱
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="teacher@example.com"
            className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
            required
          />
          <p className="mt-2 text-xs text-stone-400">
            老师账号继续使用邮箱登录和注册。
          </p>
        </div>
      )}

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
