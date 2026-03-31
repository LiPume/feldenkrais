'use server';

import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { hasPublicSupabaseEnv } from '@/lib/env/public';
import { hasDatabaseEnv } from '@/server/env';
import { ensureProfileForUser } from '@/server/auth/ensure-profile';
import { createSupabaseServerClient } from '@/server/auth/supabase-server';

const authFormSchema = z.object({
  mode: z.enum(['sign-in', 'sign-up']),
  email: z.string().trim().email('请输入有效邮箱地址'),
  password: z.string().min(6, '密码至少需要 6 位'),
  role: z.enum(['student', 'teacher']).default('student'),
});

export type AuthFormState = {
  error?: string;
  successMessage?: string;
};

export async function authenticateWithPassword(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (!hasPublicSupabaseEnv()) {
    return {
      error: '请先配置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY。',
    };
  }

  if (!hasDatabaseEnv()) {
    return {
      error: '请先配置 DATABASE_URL 和 DIRECT_URL。',
    };
  }

  const parsed = authFormSchema.safeParse({
    mode: formData.get('mode'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? '登录信息不完整。',
    };
  }

  const { mode, email, password, role } = parsed.data;
  const supabase = await createSupabaseServerClient();

  const authResult =
    mode === 'sign-in'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role,
            },
          },
        });

  if (authResult.error) {
    return {
      error: authResult.error.message,
    };
  }

  const user = authResult.data.user;

  if (!user) {
    return {
      error: '认证完成后未获取到用户信息，请稍后再试。',
    };
  }

  const profile = await ensureProfileForUser(user);

  if (mode === 'sign-up' && !authResult.data.session) {
    return {
      successMessage: '注册成功。请先完成邮箱确认，然后再登录。',
    };
  }

  revalidatePath('/', 'layout');
  redirect(profile.role === UserRole.TEACHER ? '/teacher' : '/feedback');
}

export async function signOut() {
  if (hasPublicSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
