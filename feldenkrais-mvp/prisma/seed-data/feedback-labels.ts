import { FEELING_TAGS } from '@/lib/constants/feedback-labels';

export const FEEDBACK_LABEL_SEED = FEELING_TAGS.map((label, index) => ({
  code: label.code,
  nameZh: label.name,
  sortOrder: index + 1,
  isActive: true,
}));
