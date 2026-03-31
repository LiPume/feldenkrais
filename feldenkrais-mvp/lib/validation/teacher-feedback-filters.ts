import { z } from 'zod';
import type { TeacherFeedbackFilters } from '@/types/feedback';

const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const teacherFeedbackFiltersSchema = z.object({
  phase: z.enum(['before', 'after']).optional(),
  dateFrom: dateStringSchema.optional(),
  dateTo: dateStringSchema.optional(),
});

function getSingleValue(value: string | string[] | undefined): string | undefined {
  if (typeof value === 'string') {
    return value.trim() || undefined;
  }

  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0].trim() || undefined : undefined;
  }

  return undefined;
}

export function parseTeacherFeedbackFilters(
  searchParams: Record<string, string | string[] | undefined>,
): TeacherFeedbackFilters {
  const parsed = teacherFeedbackFiltersSchema.safeParse({
    phase: getSingleValue(searchParams.phase),
    dateFrom: getSingleValue(searchParams.dateFrom),
    dateTo: getSingleValue(searchParams.dateTo),
  });

  if (!parsed.success) {
    return {};
  }

  const { phase } = parsed.data;
  let { dateFrom, dateTo } = parsed.data;

  if (dateFrom && dateTo && dateFrom > dateTo) {
    [dateFrom, dateTo] = [dateTo, dateFrom];
  }

  return {
    phase,
    dateFrom,
    dateTo,
  };
}

export function hasTeacherFeedbackFilters(filters: TeacherFeedbackFilters): boolean {
  return Boolean(filters.phase || filters.dateFrom || filters.dateTo);
}

export type TeacherFeedbackCursorParams = {
  after?: string;
  before?: string;
};

export function parseTeacherFeedbackCursorParams(
  searchParams: Record<string, string | string[] | undefined>,
): TeacherFeedbackCursorParams {
  const after = getSingleValue(searchParams.after);
  const before = getSingleValue(searchParams.before);

  if (after && before) {
    return {
      after,
    };
  }

  return {
    after,
    before,
  };
}
