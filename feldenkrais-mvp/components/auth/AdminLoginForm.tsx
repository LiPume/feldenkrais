'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { adminAuthenticate, type AdminLoginState } from '@/server/actions/admin-auth';

const initialState: AdminLoginState = {};

export default function AdminLoginForm() {
  const [state, action, pending] = useActionState(adminAuthenticate, initialState);

  return (
    <form action={action} className="login-form admin-login-form">
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          邮箱 <span className="form-required">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="admin@example.com"
          required
          className="input-field"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          密码 <span className="form-required">*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="输入密码"
          required
          className="input-field"
        />
      </div>

      {state.error && (
        <div className="form-alert form-alert--error">{state.error}</div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary login-submit admin-submit"
      >
        {pending ? (
          <>
            <span className="login-spinner" />
            登录中...
          </>
        ) : '登录后台'}
      </button>

      <p className="login-form-footer">
        <Link href="/" className="login-form-footer-link">返回首页</Link>
      </p>
    </form>
  );
}
