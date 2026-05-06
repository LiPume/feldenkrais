#!/usr/bin/env tsx

import { config as loadEnv } from 'dotenv';
import { z } from 'zod';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });
loadEnv();

const argsSchema = z.object({
  email: z.string().email('请提供有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要 6 位'),
  fullName: z.string().trim().max(50).optional(),
});

function usage() {
  console.info(`
用法: npm run teacher:create <邮箱> <密码> [姓名]

示例:
  npm run teacher:create admin@example.com MyPass123 "张老师"
  npm run teacher:create admin@example.com MyPass123

说明:
  - 这是服务级脚本，请仅在部署时运行一次
  - 老师账号使用真实邮箱登录
  - 需要配置 SUPABASE_SERVICE_ROLE_KEY 环境变量
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    usage();
    process.exit(0);
  }

  if (args.length < 2) {
    console.error('错误: 请提供邮箱和密码。');
    usage();
    process.exit(1);
  }

  const parsed = argsSchema.safeParse({
    email: args[0],
    password: args[1],
    fullName: args[2],
  });

  if (!parsed.success) {
    console.error(`错误: ${parsed.error.issues[0]?.message}`);
    process.exit(1);
  }

  const { email, password, fullName } = parsed.data;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('错误: 请确保已配置 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY。');
    process.exit(1);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const dbUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('错误: 请配置 DIRECT_URL 或 DATABASE_URL。');
    process.exit(1);
  }

  const adapter = new PrismaPg(dbUrl);
  const prisma = new PrismaClient({ adapter });

  console.info(`正在创建老师账号: ${email}`);

  let authUserId: string;

  const existing = await prisma.userProfile.findUnique({
    where: { email },
    select: { id: true, role: true },
  });

  if (existing) {
    console.warn(`账号 ${email} 已存在（角色: ${existing.role}），跳过创建步骤。`);
    authUserId = existing.id;

    const updateResult = await admin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: {
        role: 'teacher',
        ...(fullName ? { full_name: fullName } : {}),
      },
      app_metadata: {
        role: 'teacher',
      },
    });

    if (updateResult.error) {
      console.error(`更新 Supabase 用户失败: ${updateResult.error.message}`);
      process.exit(1);
    }
  } else {
    const createResult = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'teacher',
        ...(fullName ? { full_name: fullName } : {}),
      },
      app_metadata: {
        role: 'teacher',
      },
    });

    if (createResult.error) {
      console.error(`创建 Supabase 用户失败: ${createResult.error.message}`);
      process.exit(1);
    }

    if (!createResult.data.user) {
      console.error('创建用户成功但未返回用户 ID。');
      process.exit(1);
    }

    authUserId = createResult.data.user.id;
    console.info(`Supabase 用户创建成功，ID: ${authUserId}`);
  }

  await prisma.userProfile.upsert({
    where: { id: authUserId },
    create: {
      id: authUserId,
      email,
      fullName: fullName ?? null,
      role: 'TEACHER',
    },
    update: {
      email,
      fullName: fullName ?? undefined,
      role: 'TEACHER',
    },
  });

  console.info(`数据库记录同步完成。`);
  console.info(`老师账号创建成功: ${email}`);
  console.info(`登录地址: /admin/login`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
