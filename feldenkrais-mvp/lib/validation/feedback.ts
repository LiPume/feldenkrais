import { z } from 'zod';
import { BODY_REGION_CODES } from '@/lib/constants/body-regions';
import { FEELING_TAGS } from '@/lib/constants/feedback-labels';
import type {
  CreateFeedbackSessionPayload,
  FeedbackLabelCode,
  LegacyFeedbackRecord,
} from '@/types/feedback';

const feedbackLabelCodes = FEELING_TAGS.map(
  (tag) => tag.code,
) as [FeedbackLabelCode, ...FeedbackLabelCode[]];

const feedbackPhaseSchema = z.enum(['before', 'after']);
const bodyRegionCodeSchema = z.enum(BODY_REGION_CODES);
const feedbackLabelCodeSchema = z.enum(feedbackLabelCodes);
const leftRightDiffSchema = z.enum(['none', 'left_more', 'right_more', 'unclear']);

export const feedbackBodyPartEntryInputSchema = z.object({
  bodyRegionCode: bodyRegionCodeSchema,
  sortOrder: z.number().int().min(0),
  intensityScore: z.number().int().min(0).max(10),
  labelCodes: z
    .array(feedbackLabelCodeSchema)
    .max(feedbackLabelCodes.length)
    .transform((labelCodes) => Array.from(new Set(labelCodes))),
  leftRightDiff: leftRightDiffSchema.default('none'),
  note: z
    .string()
    .trim()
    .max(1000, '备注请控制在 1000 字以内')
    .optional()
    .transform((note) => (note ? note : undefined)),
});

export const createFeedbackSessionPayloadSchema = z
  .object({
    practiceId: z.string().uuid().optional(),
    practiceTitleSnapshot: z
      .string()
      .trim()
      .max(200, '练习标题请控制在 200 字以内')
      .optional()
      .transform((title) => (title ? title : undefined)),
    feedbackPhase: feedbackPhaseSchema,
    feedbackDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '请输入有效日期'),
    entries: z
      .array(feedbackBodyPartEntryInputSchema)
      .min(1, '请至少选择并填写 1 个身体部位'),
  })
  .superRefine((payload, context) => {
    const seenRegionCodes = new Set<string>();

    payload.entries.forEach((entry, index) => {
      if (seenRegionCodes.has(entry.bodyRegionCode)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: '同一个身体部位只能提交一次反馈',
          path: ['entries', index, 'bodyRegionCode'],
        });
      }

      seenRegionCodes.add(entry.bodyRegionCode);
    });
  });

export function parseCreateFeedbackSessionPayload(input: unknown): CreateFeedbackSessionPayload {
  return createFeedbackSessionPayloadSchema.parse(input);
}

export const legacyFeedbackRecordSchema = z.object({
  id: z.string().trim().min(1, '旧反馈记录缺少 id'),
  practiceId: z.string().trim().optional(),
  practiceTitle: z
    .string()
    .trim()
    .max(200, '练习标题请控制在 200 字以内')
    .optional()
    .transform((title) => (title ? title : undefined)),
  feedbackPhase: feedbackPhaseSchema,
  feedbackDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '旧反馈记录日期格式不正确'),
  bodyRegionCodes: z
    .array(bodyRegionCodeSchema)
    .min(1, '旧反馈记录至少需要 1 个身体部位')
    .transform((codes) => Array.from(new Set(codes))),
  feelingTags: z
    .array(feedbackLabelCodeSchema)
    .default([])
    .transform((tags) => Array.from(new Set(tags))),
  intensityScore: z.number().int().min(0).max(10),
  leftRightDiff: leftRightDiffSchema.optional().default('none'),
  note: z
    .string()
    .trim()
    .max(1000, '备注请控制在 1000 字以内')
    .optional()
    .transform((note) => (note ? note : undefined)),
  createdAt: z.string().datetime().optional(),
});

export const legacyFeedbackRecordArraySchema = z.array(legacyFeedbackRecordSchema);

export function parseLegacyFeedbackRecords(input: unknown): LegacyFeedbackRecord[] {
  return legacyFeedbackRecordArraySchema.parse(input);
}
