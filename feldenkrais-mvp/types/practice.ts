import type { BodyRegionCode } from '@/types/body-region';

export type PracticeListItem = {
  id: string;
  title: string;
  slug: string;
  courseName?: string | null;
  summary?: string | null;
  durationSec?: number | null;
  bodyRegionCodes: BodyRegionCode[];
};

export type PracticeDetail = PracticeListItem & {
  contentText?: string | null;
  audioUrl?: string | null;
};
