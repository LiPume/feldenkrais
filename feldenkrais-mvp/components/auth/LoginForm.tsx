'use client';

import { useActionState, useState } from 'react';
import { authenticateWithPassword, type AuthFormState } from '@/server/actions/auth';

const initialState: AuthFormState = {};

export default function LoginForm() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [state, action, pending] = useActionState(
    authenticateWithPassword,
    initialState,
  );
  const visibleState = state.mode === mode ? state : undefined;

  return (
    <form action={action} className="login-form">
      {visibleState?.success && (
        <div className="form-alert form-alert--success">{visibleState.successMessage}</div>
      )}

      {visibleState?.error && !visibleState.success && (
        <div className="form-alert form-alert--error">{visibleState.error}</div>
      )}

      <div className="form-group">
        <label htmlFor="fullName" className="form-label">姓名</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="张三"
          className="input-field"
        />
        <p className="form-hint">注册时填写真实姓名；老账号也可在登录时补填</p>
      </div>

      <input type="hidden" name="role" value="student" />

      <div className="form-group">
        <label htmlFor="studentId" className="form-label">
          学号 <span className="form-required">*</span>
        </label>
        <input
          id="studentId"
          name="studentId"
          type="text"
          autoComplete="username"
          placeholder="20240001"
          className="input-field"
          required
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
          placeholder="至少 6 位"
          className="input-field"
          required
          minLength={6}
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          name="mode"
          value="sign-in"
          disabled={pending}
          className={`btn-primary login-submit ${mode === 'sign-in' ? '' : 'btn-secondary--ghost'}`}
          onClick={() => setMode('sign-in')}
        >
          {pending ? (
            <>
              <span className="login-spinner" />
              处理中...
            </>
          ) : '登录'}
        </button>
        <button
          type="submit"
          name="mode"
          value="sign-up"
          disabled={pending}
          className={`btn-secondary login-submit ${mode === 'sign-up' ? '' : 'btn-secondary--ghost'}`}
          onClick={() => setMode('sign-up')}
        >
          注册
        </button>
      </div>
    </form>
  );
}
