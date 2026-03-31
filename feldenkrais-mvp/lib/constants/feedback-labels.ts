import type {
  FeedbackLabelCode,
  FeedbackPhaseValue,
  LeftRightDiffValue,
} from '@/types/feedback';

export type FeedbackLabelOption = {
  code: FeedbackLabelCode;
  name: string;
};

export type LeftRightOption = {
  value: LeftRightDiffValue;
  name: string;
};

export type FeedbackPhaseOption = {
  value: FeedbackPhaseValue;
  name: string;
};

export const FEEDBACK_PHASE_OPTIONS: FeedbackPhaseOption[] = [
  { value: 'before', name: '课前' },
  { value: 'after', name: '课后' },
];

export const FEEDBACK_PHASE_NAME_MAP: Record<FeedbackPhaseValue, string> = {
  before: '课前',
  after: '课后',
};

export const FEELING_TAGS: FeedbackLabelOption[] = [
  { code: 'tight', name: '紧' },
  { code: 'relaxed', name: '松' },
  { code: 'sore', name: '酸' },
  { code: 'warm', name: '热' },
  { code: 'numb', name: '麻' },
  { code: 'clear', name: '清晰' },
  { code: 'blurry', name: '模糊' },
  { code: 'light', name: '轻' },
  { code: 'heavy', name: '沉' },
  { code: 'connected', name: '有连接感' },
  { code: 'expanded', name: '舒展' },
  { code: 'stable', name: '稳定' },
];

export const FEELING_TAG_NAME_MAP: Record<FeedbackLabelCode, string> = {
  tight: '紧',
  relaxed: '松',
  sore: '酸',
  warm: '热',
  numb: '麻',
  clear: '清晰',
  blurry: '模糊',
  light: '轻',
  heavy: '沉',
  connected: '有连接感',
  expanded: '舒展',
  stable: '稳定',
};

export const LEFT_RIGHT_OPTIONS: LeftRightOption[] = [
  { value: 'none', name: '无差异' },
  { value: 'left_more', name: '左侧更明显' },
  { value: 'right_more', name: '右侧更明显' },
  { value: 'unclear', name: '不确定' },
];

export const LEFT_RIGHT_NAME_MAP: Record<LeftRightDiffValue, string> = {
  none: '无差异',
  left_more: '左侧更明显',
  right_more: '右侧更明显',
  unclear: '不确定',
};
