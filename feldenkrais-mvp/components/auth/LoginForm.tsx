'use client';

import { useActionState, useEffect, useState, type FormEvent } from 'react';
import { authenticateWithPassword, type AuthFormState } from '@/server/actions/auth';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';

const initialState: AuthFormState = {};
type AuthIntent = 'sign-in' | 'sign-up';

const inputClassName =
  'min-h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 text-sm text-[var(--color-text-primary)] shadow-[0_1px_0_rgba(61,48,35,0.04)] transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[rgba(139,111,63,0.16)]';

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
    <form action={action} className="space-y-5" onSubmit={handleSubmit}>
      {pending ? (
        <Alert variant="info">{pendingMessage}</Alert>
      ) : visibleState?.success ? (
        <Alert variant="success">
          {visibleState.successMessage ?? '账号已创建，正在进入系统...'}
        </Alert>
      ) : visibleState?.error ? (
        <Alert variant="error">{visibleState.error}</Alert>
      ) : (
        <Alert variant="info">
          输入学号和密码后可以直接登录；新账号会在注册后自动进入系统。
        </Alert>
      )}

      <FormField
        htmlFor="fullName"
        label="姓名"
        description="注册时填写真实姓名；老账号也可在登录时补填。"
      >
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="张三"
          className={inputClassName}
        />
      </FormField>

      <input type="hidden" name="role" value="student" />

      <FormField htmlFor="studentId" label="学号">
        <input
          id="studentId"
          name="studentId"
          type="text"
          autoComplete="username"
          placeholder="20240001"
          className={inputClassName}
          required
        />
      </FormField>

      <FormField htmlFor="password" label="密码">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="至少 6 位"
          className={inputClassName}
          required
          minLength={6}
        />
      </FormField>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="submit"
          name="mode"
          value="sign-in"
          disabled={pending}
          loading={pending && pendingIntent === 'sign-in'}
          variant={mode === 'sign-in' ? 'primary' : 'secondary'}
          onClick={() => setMode('sign-in')}
        >
          {pending && pendingIntent === 'sign-in' ? '正在登录...' : '登录'}
        </Button>
        <Button
          type="submit"
          name="mode"
          value="sign-up"
          disabled={pending}
          loading={pending && pendingIntent === 'sign-up'}
          variant={mode === 'sign-up' ? 'primary' : 'secondary'}
          onClick={() => setMode('sign-up')}
        >
          {pending && pendingIntent === 'sign-up' ? '正在创建账号...' : '注册'}
        </Button>
      </div>
    </form>
  );
}
