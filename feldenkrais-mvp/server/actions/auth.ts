'use server';

import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
  buildStudentAuthEmail,
  normalizeStudentId,
} from '@/lib/auth/student-account';
import { hasPublicSupabaseEnv } from '@/lib/env/public';
import { hasDatabaseEnv, hasSupabaseServiceRoleKey } from '@/server/env';
import { createSupabaseAdminClient } from '@/server/auth/supabase-admin';
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

  if (data.role === 'teacher' && !data.email) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['email'],
      message: '老师请使用邮箱登录或注册。',
    });
  }
});

export type AuthFormState = {
  error?: string;
  successMessage?: string;
};

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

  if (input.mode === 'sign-up') {
    return buildStudentAuthEmail(normalizedStudentId);
  }

  const prisma = getPrismaClient();
  const existingStudent = await prisma.userProfile.findUnique({
    where: {
      studentId: normalizedStudentId,
    },
    select: {
      email: true,
    },
  });

  return existingStudent?.email ?? input.email ?? buildStudentAuthEmail(normalizedStudentId);
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
    email: formData.get('email') ?? undefined,
    password: formData.get('password'),
    role: formData.get('role'),
    fullName: formData.get('fullName') ?? undefined,
    studentId: formData.get('studentId') ?? undefined,
  });

  if (!parsed.success) {
    return {
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
        error: error instanceof Error ? error.message : '学生账号创建失败，请稍后再试。',
      };
    }
  }

  const authResult =
    mode === 'sign-in'
      ? await supabase.auth.signInWithPassword({ email: authEmail, password })
      : role === 'teacher'
        ? await supabase.auth.signUp({
          email: authEmail,
          password,
          options: {
            data: {
              role,
              ...(fullName ? { full_name: fullName } : {}),
              ...(normalizedStudentId ? { student_id: normalizedStudentId } : {}),
            },
          },
          })
        : await supabase.auth.signInWithPassword({ email: authEmail, password });

  if (authResult.error) {
    return {
      error: authResult.error.message,
    };
  }

  let user = authResult.data.user;

  if (!user) {
    return {
      error: '认证完成后未获取到用户信息，请稍后再试。',
    };
  }

  if (mode === 'sign-in' && (fullName || studentId)) {
    const updateProfileResult = await supabase.auth.updateUser({
      data: {
        ...(fullName ? { full_name: fullName } : {}),
        ...(normalizedStudentId ? { student_id: normalizedStudentId } : {}),
      },
    });

    if (updateProfileResult.error) {
      return {
        error: updateProfileResult.error.message,
      };
    }

    user = updateProfileResult.data.user ?? user;
  }

  const profile = await ensureProfileForUser(user);

  if (mode === 'sign-up' && role === 'teacher' && !authResult.data.session) {
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
