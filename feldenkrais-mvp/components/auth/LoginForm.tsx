'use client';

import { useActionState, useEffect, useState, type FormEvent } from 'react';
import { authenticateWithPassword, type AuthFormState } from '@/server/actions/auth';

const initialState: AuthFormState = {};
type AuthIntent = 'sign-in' | 'sign-up';

export default function LoginForm() {
  const [mode, setMode] = useState<AuthIntent>('sign-in');
  const [pendingIntent, setPendingIntent] = useState<AuthIntent | null>(null);
  const [state, action, pending] = useActionState(
    authenticateWithPassword,
    initialState,
  );
  const visibleState = state.mode === mode ? state : undefined;
  const activeIntent = pendingIntent ?? mode;
  const pendingMessage = activeIntent === 'sign-up'
    ? '正在创建账号并自动登录，请稍候...'
    : '正在登录，请稍候...';

  useEffect(() => {
    if (!pending && pendingIntent) {
      const timerId = window.setTimeout(() => {
        setPendingIntent(null);
      }, 0);

      return () => window.clearTimeout(timerId);
    }

    return undefined;
  }, [pending, pendingIntent, state]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const nextIntent = submitter instanceof HTMLButtonElement && submitter.value === 'sign-up'
      ? 'sign-up'
      : 'sign-in';

    setMode(nextIntent);
    setPendingIntent(nextIntent);
  };

  return (
    <form action={action} className="login-form" onSubmit={handleSubmit}>
      {pending ? (
        <div className="form-alert form-alert--success">
          <span className="login-spinner" />
          {pendingMessage}
        </div>
      ) : visibleState?.success ? (
        <div className="form-alert form-alert--success">
          {visibleState.successMessage ?? '账号已创建，正在进入系统...'}
        </div>
      ) : visibleState?.error ? (
        <div className="form-alert form-alert--error">{visibleState.error}</div>
      ) : (
        <div className="form-alert form-alert--success">
          输入学号和密码后，可以直接登录；新账号会在注册后自动进入系统。
        </div>
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
          {pending && pendingIntent === 'sign-in' ? (
            <>
              <span className="login-spinner" />
              正在登录...
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
          {pending && pendingIntent === 'sign-up' ? (
            <>
              <span className="login-spinner" />
              正在创建账号...
            </>
          ) : '注册'}
        </button>
      </div>
    </form>
  );
}
