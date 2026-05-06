'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
  buildStudentAuthEmail,
  normalizeStudentId,
} from '@/lib/auth/student-account';
import { getPostAuthPath } from '@/lib/auth/role-routing';
import { hasPublicSupabaseEnv } from '@/lib/env/public';
import { hasRuntimeDatabaseEnv, hasSupabaseServiceRoleKey } from '@/server/env';
import { createSupabaseAdminClient } from '@/server/auth/supabase-admin';
import { toAuthErrorMessage } from '@/server/auth/auth-error-message';
import { ensureProfileForUser } from '@/server/auth/ensure-profile';
import { getPrismaClient } from '@/server/db/prisma';
import { createSupabaseServerClient } from '@/server/auth/supabase-server';

const authFormSchema = z.object({
  mode: z.enum(['sign-in', 'sign-up']),
  email: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  password: z.string().min(6, '密码至少需要 6 位'),
  role: z.enum(['student', 'teacher']).default('student'),
  fullName: z
    .string()
    .trim()
    .max(50, '姓名请控制在 50 字以内')
    .optional()
    .transform((value) => (value ? value : undefined)),
  studentId: z
    .string()
    .trim()
    .max(50, '学号请控制在 50 字以内')
    .optional()
    .transform((value) => (value ? value : undefined)),
}).superRefine((data, context) => {
  if (data.email) {
    const emailValidation = z.string().email('请输入有效邮箱地址').safeParse(data.email);

    if (!emailValidation.success) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['email'],
        message: emailValidation.error.issues[0]?.message ?? '请输入有效邮箱地址',
      });
    }
  }

  if (data.mode === 'sign-up' && !data.fullName) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['fullName'],
      message: '注册时请填写姓名。',
    });
  }

  if (data.role === 'student' && !data.studentId) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['studentId'],
      message: data.mode === 'sign-up' ? '学生注册时请填写学号。' : '学生登录时请输入学号。',
    });
  }
});

export type AuthFormState = {
  error?: string;
  mode?: 'sign-in' | 'sign-up';
  success?: boolean;
  successMessage?: string;
};

function getMetadataString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim()
    ? value.trim()
    : undefined;
}

async function resolveAuthEmail(input: {
  mode: 'sign-in' | 'sign-up';
  role: 'student' | 'teacher';
  email?: string;
  studentId?: string;
}): Promise<string> {
  if (input.role === 'teacher') {
    return input.email!;
  }

  const normalizedStudentId = normalizeStudentId(input.studentId!);

  return buildStudentAuthEmail(normalizedStudentId);
}

async function upsertStudentAuthUser(input: {
  studentId: string;
  password: string;
  fullName?: string;
}): Promise<string> {
  if (!hasSupabaseServiceRoleKey()) {
    throw new Error('学生学号登录需要配置 SUPABASE_SERVICE_ROLE_KEY。');
  }

  const prisma = getPrismaClient();
  const admin = createSupabaseAdminClient();
  const normalizedStudentId = normalizeStudentId(input.studentId);
  const studentEmail = buildStudentAuthEmail(normalizedStudentId);
  const existingProfile = await prisma.userProfile.findUnique({
    where: {
      studentId: normalizedStudentId,
    },
    select: {
      id: true,
    },
  });

  if (existingProfile) {
    const updateResult = await admin.auth.admin.updateUserById(existingProfile.id, {
      email: studentEmail,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        role: 'student',
        student_id: normalizedStudentId,
        ...(input.fullName ? { full_name: input.fullName } : {}),
      },
      app_metadata: {
        role: 'student',
      },
    });

    if (updateResult.error) {
      throw new Error(updateResult.error.message);
    }

    return studentEmail;
  }

  const createResult = await admin.auth.admin.createUser({
    email: studentEmail,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      role: 'student',
      student_id: normalizedStudentId,
      ...(input.fullName ? { full_name: input.fullName } : {}),
    },
    app_metadata: {
      role: 'student',
    },
  });

  if (createResult.error) {
    throw new Error(createResult.error.message);
  }

  return studentEmail;
}

export async function authenticateWithPassword(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const submittedMode =
    formData.get('mode') === 'sign-up'
      ? 'sign-up'
      : 'sign-in';

  if (!hasPublicSupabaseEnv()) {
    return {
      mode: submittedMode,
      error: '请先配置 NEXT_PUBLIC_SUPABASE_URL，以及 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 或 NEXT_PUBLIC_SUPABASE_ANON_KEY。',
    };
  }

  if (!hasRuntimeDatabaseEnv()) {
    return {
      mode: submittedMode,
      error: '请先配置 DATABASE_URL。',
    };
  }

  const parsed = authFormSchema.safeParse({
    mode: formData.get('mode'),
    email: formData.get('email') ?? undefined,
    password: formData.get('password'),
    role: formData.get('role'),
    fullName: formData.get('fullName') ?? undefined,
    studentId: formData.get('studentId') ?? undefined,
  });

  if (!parsed.success) {
    return {
      mode: submittedMode,
      error: parsed.error.issues[0]?.message ?? '登录信息不完整。',
    };
  }

  const {
    mode,
    email,
    password,
    role,
    fullName,
    studentId,
  } = parsed.data;

  // 硬拦截：禁止通过公开注册创建老师账号
  if (mode === 'sign-up' && role === 'teacher') {
    return {
      mode,
      error: '老师账号不支持公开注册。请联系管理员开通账号。',
    };
  }

  const authEmail = await resolveAuthEmail({
    mode,
    role,
    email,
    studentId,
  });
  const supabase = await createSupabaseServerClient();
  const normalizedStudentId = studentId ? normalizeStudentId(studentId) : undefined;

  if (mode === 'sign-up' && role === 'student') {
    try {
      await upsertStudentAuthUser({
        studentId: normalizedStudentId!,
        password,
        fullName,
      });
    } catch (error) {
      return {
        mode,
        error: toAuthErrorMessage(error, '学生账号创建失败，请稍后再试。'),
      };
    }

    let signUpAuthResult;

    try {
      signUpAuthResult = await supabase.auth.signInWithPassword({
        email: authEmail,
        password,
      });
    } catch (error) {
      return {
        mode,
        error: toAuthErrorMessage(error, '账号已创建，但自动登录失败，请返回登录页重新登录。'),
      };
    }

    if (signUpAuthResult.error || !signUpAuthResult.data.user) {
      return {
        mode,
        error: '账号已创建，但自动登录失败，请返回登录页重新登录。',
      };
    }

    let profile;

    try {
      profile = await ensureProfileForUser(signUpAuthResult.data.user);
    } catch (error) {
      return {
        mode,
        error: toAuthErrorMessage(error, '账号已创建，但同步账号资料失败，请返回登录页重新登录。'),
      };
    }

    revalidatePath('/', 'layout');
    redirect(getPostAuthPath(profile.role));
  }

  let authResult;

  try {
    authResult = await supabase.auth.signInWithPassword({ email: authEmail, password });
  } catch (error) {
    return {
      mode,
      error: toAuthErrorMessage(error, '登录请求失败，请稍后再试。'),
    };
  }

  if (authResult.error) {
    return {
      mode,
      error: authResult.error.message,
    };
  }

  let user = authResult.data.user;

  if (!user) {
    return {
      mode,
      error: '认证完成后未获取到用户信息，请稍后再试。',
    };
  }

  const currentFullName = getMetadataString(user.user_metadata?.full_name);
  const currentStudentId = getMetadataString(user.user_metadata?.student_id);
  const shouldUpdateStudentMetadata =
    role === 'student'
    && (
      (normalizedStudentId && currentStudentId !== normalizedStudentId)
      || (fullName && currentFullName !== fullName)
    );

  if (shouldUpdateStudentMetadata) {
    let updateProfileResult;

    try {
      updateProfileResult = await supabase.auth.updateUser({
        data: {
          ...(fullName ? { full_name: fullName } : {}),
          ...(normalizedStudentId ? { student_id: normalizedStudentId } : {}),
        },
      });
    } catch (error) {
      return {
        mode,
        error: toAuthErrorMessage(error, '账号资料更新失败，请稍后再试。'),
      };
    }

    if (updateProfileResult.error) {
      return {
        mode,
        error: updateProfileResult.error.message,
      };
    }

    user = updateProfileResult.data.user ?? user;
  }

  let profile;

  try {
    profile = await ensureProfileForUser(user);
  } catch (error) {
    return {
      mode,
      error: toAuthErrorMessage(error, '认证成功，但同步账号资料失败，请稍后再试。'),
    };
  }

  revalidatePath('/', 'layout');
  redirect(getPostAuthPath(profile.role));
}

export async function signOut() {
  if (hasPublicSupabaseEnv()) {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase.auth.signOut();
    } catch {
      // Best effort sign-out. We still redirect so the UI can recover.
    }
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
