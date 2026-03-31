import { ALL_BODY_REGIONS } from '@/lib/constants/body-regions';

export const BODY_REGION_SEED = ALL_BODY_REGIONS.map((region, index) => ({
  code: region.code,
  nameZh: region.nameZh,
  viewSide: region.viewSide,
  sortOrder: index + 1,
  svgKey: region.code,
}));
