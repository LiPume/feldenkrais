'use server';

import { revalidatePath } from 'next/cache';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { ZodError } from 'zod';
import {
  parseCreateFeedbackSessionPayload,
  parseLegacyFeedbackRecords,
} from '@/lib/validation/feedback';
import type {
  CreateFeedbackSessionPayload,
  FeedbackActionResult,
  LegacyFeedbackImportResult,
  LegacyFeedbackRecord,
} from '@/types/feedback';
import { requireRole } from '@/server/auth/require-role';
import { FEEDBACK_ACCESS_ROLES } from '@/server/auth/role-groups';
import {
  createFeedbackSessionForStudent,
  importLegacyFeedbackSessionsForStudent,
} from '@/server/services/feedback';

export async function createFeedbackSessionAction(
  input: CreateFeedbackSessionPayload,
): Promise<FeedbackActionResult> {
  try {
    const { profile } = await requireRole(FEEDBACK_ACCESS_ROLES);
    const payload = parseCreateFeedbackSessionPayload(input);
    const session = await createFeedbackSessionForStudent(profile.id, payload);

    revalidatePath('/feedback');
    revalidatePath('/teacher');

    return {
      success: true,
      sessionId: session.id,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message ?? '反馈数据格式不正确。',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : '保存反馈失败，请稍后再试。',
    };
  }
}

export async function importLegacyFeedbackSessionsAction(
  input: LegacyFeedbackRecord[],
): Promise<LegacyFeedbackImportResult> {
  try {
    const { profile } = await requireRole(FEEDBACK_ACCESS_ROLES);
    const records = parseLegacyFeedbackRecords(input);
    const result = await importLegacyFeedbackSessionsForStudent(profile.id, records);

    revalidatePath('/feedback');
    revalidatePath('/teacher');

    return {
      success: true,
      importedCount: result.importedCount,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      return {
        success: false,
        importedCount: 0,
        error: error.issues[0]?.message ?? '旧反馈记录格式不正确。',
      };
    }

    return {
      success: false,
      importedCount: 0,
      error: error instanceof Error ? error.message : '导入失败，请稍后再试。',
    };
  }
}
