import type { BodyRegionCode } from './body-region-types';

// 反馈阶段
export type FeedbackPhase = 'before' | 'after';

// 左右差异
export type LeftRightDiff = 'none' | 'left_more' | 'right_more' | 'unclear';

// 完整反馈记录类型
export type FeedbackRecord = {
  id: string;
  practiceId?: string;
  practiceTitle?: string;
  feedbackPhase: FeedbackPhase;
  feedbackDate: string; // YYYY-MM-DD
  bodyRegionCodes: BodyRegionCode[];
  feelingTags: string[];
  intensityScore: number; // 0-10
  leftRightDiff?: LeftRightDiff;
  note?: string;
  createdAt: string; // ISO timestamp
};

// 反馈表单状态（用于填写过程，不含 id 和 createdAt）
export type FeedbackFormState = {
  practiceId?: string;
  practiceTitle?: string;
  feedbackPhase: FeedbackPhase;
  feedbackDate: string;
  bodyRegionCodes: BodyRegionCode[];
  feelingTags: string[];
  intensityScore: number;
  leftRightDiff?: LeftRightDiff;
  note: string;
};
