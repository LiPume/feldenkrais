import type { BodyRegionCode } from '@/types/body-region';

export type FeedbackPhaseValue = 'before' | 'after';

export type LeftRightDiffValue = 'none' | 'left_more' | 'right_more' | 'unclear';

export type FeedbackLabelCode =
  | 'tight'
  | 'relaxed'
  | 'sore'
  | 'warm'
  | 'numb'
  | 'clear'
  | 'blurry'
  | 'light'
  | 'heavy'
  | 'connected'
  | 'expanded'
  | 'stable';

export type FeedbackBodyPartDraft = {
  bodyRegionCode: BodyRegionCode;
  intensityScore: number | null;
  labelCodes: FeedbackLabelCode[];
  leftRightDiff: LeftRightDiffValue;
  note: string;
};

export type FeedbackFormState = {
  practiceId?: string;
  practiceTitle?: string;
  practiceSlug?: string;
  feedbackPhase: FeedbackPhaseValue;
  feedbackDate: string;
  selectedRegionCodes: BodyRegionCode[];
  activeRegionCode: BodyRegionCode | null;
  entriesByRegionCode: Partial<Record<BodyRegionCode, FeedbackBodyPartDraft>>;
};

export type FeedbackBodyPartEntryInput = {
  bodyRegionCode: BodyRegionCode;
  sortOrder: number;
  intensityScore: number;
  labelCodes: FeedbackLabelCode[];
  leftRightDiff: LeftRightDiffValue;
  note?: string;
};

export type CreateFeedbackSessionPayload = {
  practiceId?: string;
  practiceTitleSnapshot?: string;
  feedbackPhase: FeedbackPhaseValue;
  feedbackDate: string;
  entries: FeedbackBodyPartEntryInput[];
};

export type FeedbackBodyPartListItem = {
  id: string;
  bodyRegionCode: BodyRegionCode;
  bodyRegionName: string;
  sortOrder: number;
  intensityScore: number;
  labelCodes: FeedbackLabelCode[];
  labelNames: string[];
  leftRightDiff: LeftRightDiffValue;
  note?: string;
};

export type FeedbackSessionListItem = {
  id: string;
  practiceId?: string;
  practiceTitle?: string;
  practiceSlug?: string;
  feedbackPhase: FeedbackPhaseValue;
  feedbackDate: string;
  createdAt: string;
  studentProfileId: string;
  studentName: string;
  studentEmail: string;
  entries: FeedbackBodyPartListItem[];
};

export type PracticeFeedbackStat = {
  practiceId: string;
  practiceTitle: string;
  feedbackCount: number;
};

export type BodyRegionFeedbackStat = {
  bodyRegionCode: BodyRegionCode;
  bodyRegionName: string;
  count: number;
};

export type FeedbackLabelStat = {
  labelCode: FeedbackLabelCode;
  labelName: string;
  count: number;
};

export type StudentFeedbackSummary = {
  studentProfileId: string;
  studentName: string;
  studentEmail: string;
  feedbackCount: number;
  lastFeedbackDate?: string;
};

export type TeacherDashboardData = {
  totalFeedbackSessions: number;
  practiceStats: PracticeFeedbackStat[];
  bodyRegionStats: BodyRegionFeedbackStat[];
  labelStats: FeedbackLabelStat[];
  studentSummaries: StudentFeedbackSummary[];
};

export type FeedbackSessionQueryFilters = {
  studentProfileId?: string;
  practiceId?: string;
  feedbackPhase?: FeedbackPhaseValue;
  dateFrom?: string;
  dateTo?: string;
};

export type TeacherFeedbackFilters = {
  phase?: FeedbackPhaseValue;
  dateFrom?: string;
  dateTo?: string;
};

export type FeedbackCursorPageInfo = {
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor?: string;
  previousCursor?: string;
};

export type PaginatedFeedbackSessions = {
  sessions: FeedbackSessionListItem[];
  pageInfo: FeedbackCursorPageInfo;
};

export type TeacherPracticeDetailData = {
  practice: {
    id: string;
    title: string;
    slug: string;
    courseName?: string | null;
    summary?: string | null;
  };
  feedbackCount: number;
  studentCount: number;
  bodyRegionStats: BodyRegionFeedbackStat[];
  labelStats: FeedbackLabelStat[];
  recentFeedback: PaginatedFeedbackSessions;
};

export type FeedbackActionResult = {
  success: boolean;
  error?: string;
  sessionId?: string;
};

export type LegacyFeedbackRecord = {
  id: string;
  practiceId?: string;
  practiceTitle?: string;
  feedbackPhase: FeedbackPhaseValue;
  feedbackDate: string;
  bodyRegionCodes: BodyRegionCode[];
  feelingTags: FeedbackLabelCode[];
  intensityScore: number;
  leftRightDiff?: LeftRightDiffValue;
  note?: string;
  createdAt?: string;
};

export type LegacyFeedbackImportResult = {
  success: boolean;
  importedCount: number;
  error?: string;
};

export type TeacherStudentHistory = {
  student: {
    id: string;
    name: string;
    email: string;
  };
  sessions: FeedbackSessionListItem[];
};
