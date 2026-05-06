'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { UserRole } from '@prisma/client';
import { hasPublicSupabaseEnv } from '@/lib/env/public';
import { hasRuntimeDatabaseEnv } from '@/server/env';
import { toAuthErrorMessage } from '@/server/auth/auth-error-message';
import { createSupabaseServerClient } from '@/server/auth/supabase-server';
import { ensureProfileForUser } from '@/server/auth/ensure-profile';

const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('请输入有效的邮箱地址'),
  password: z
    .string()
    .min(1, '请输入密码'),
});

export type AdminLoginState = {
  error?: string;
};

export async function adminAuthenticate(
  _previousState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  if (!hasPublicSupabaseEnv()) {
    return {
      error: '请先配置 NEXT_PUBLIC_SUPABASE_URL，以及 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 或 NEXT_PUBLIC_SUPABASE_ANON_KEY。',
    };
  }

  if (!hasRuntimeDatabaseEnv()) {
    return {
      error: '请先配置 DATABASE_URL。',
    };
  }

  const parsed = adminLoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? '登录信息不完整。',
    };
  }

  const { email, password } = parsed.data;
  const supabase = await createSupabaseServerClient();

  let authResult;

  try {
    authResult = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  } catch (error) {
    return {
      error: toAuthErrorMessage(error, '登录请求失败，请稍后再试。'),
    };
  }

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

  let profile;
  try {
    profile = await ensureProfileForUser(user);
  } catch (error) {
    return {
      error: toAuthErrorMessage(error, '认证成功，但同步账号资料失败，请稍后再试。'),
    };
  }

  if (profile.role !== UserRole.TEACHER) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Best effort clean-up. We still return the access denial message.
    }
    return {
      error: '该账号没有后台访问权限。',
    };
  }

  revalidatePath('/', 'layout');
  redirect('/teacher');
}
