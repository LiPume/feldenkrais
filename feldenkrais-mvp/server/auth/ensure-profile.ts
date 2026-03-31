import { UserRole, type UserProfile } from '@prisma/client';
import type { User } from '@supabase/supabase-js';
import { getPrismaClient } from '@/server/db/prisma';

function normalizeEmail(user: User): string {
  const email = user.email?.trim().toLowerCase();

  if (!email) {
    throw new Error('Supabase user is missing an email address.');
  }

  return email;
}

function getFullName(user: User): string | null {
  const maybeName =
    typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === 'string'
        ? user.user_metadata.name
        : null;

  return maybeName?.trim() || null;
}

function getMetadataRole(user: User): UserRole | null {
  const metadataRole = user.app_metadata?.role ?? user.user_metadata?.role;
  if (metadataRole === 'teacher') {
    return UserRole.TEACHER;
  }

  if (metadataRole === 'student') {
    return UserRole.STUDENT;
  }

  return null;
}

export async function ensureProfileForUser(user: User): Promise<UserProfile> {
  const prisma = getPrismaClient();
  const email = normalizeEmail(user);
  const fullName = getFullName(user);
  const metadataRole = getMetadataRole(user);
  const existing = await prisma.userProfile.findUnique({
    where: { id: user.id },
  });

  if (existing) {
    return prisma.userProfile.update({
      where: { id: user.id },
      data: {
        email,
        fullName: fullName ?? existing.fullName,
        role: metadataRole ?? existing.role,
      },
    });
  }

  return prisma.userProfile.create({
    data: {
      id: user.id,
      email,
      fullName,
      role: metadataRole ?? UserRole.STUDENT,
    },
  });
}
