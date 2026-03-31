import type { BodyRegion, BodyRegionCode } from '@/types/body-region';

export const FRONT_REGIONS: BodyRegion[] = [
  { code: 'front_head', nameZh: '头', viewSide: 'front' },
  { code: 'front_neck', nameZh: '颈部', viewSide: 'front' },
  { code: 'front_left_shoulder', nameZh: '左肩', viewSide: 'front' },
  { code: 'front_right_shoulder', nameZh: '右肩', viewSide: 'front' },
  { code: 'front_chest', nameZh: '胸部', viewSide: 'front' },
  { code: 'front_abdomen', nameZh: '腹部', viewSide: 'front' },
  { code: 'front_pelvis', nameZh: '骨盆', viewSide: 'front' },
  { code: 'front_left_thigh', nameZh: '左大腿', viewSide: 'front' },
  { code: 'front_right_thigh', nameZh: '右大腿', viewSide: 'front' },
  { code: 'front_left_knee', nameZh: '左膝', viewSide: 'front' },
  { code: 'front_right_knee', nameZh: '右膝', viewSide: 'front' },
  { code: 'front_left_lower_leg', nameZh: '左小腿', viewSide: 'front' },
  { code: 'front_right_lower_leg', nameZh: '右小腿', viewSide: 'front' },
  { code: 'front_left_foot', nameZh: '左脚', viewSide: 'front' },
  { code: 'front_right_foot', nameZh: '右脚', viewSide: 'front' },
];

export const BACK_REGIONS: BodyRegion[] = [
  { code: 'back_head', nameZh: '头', viewSide: 'back' },
  { code: 'back_neck', nameZh: '颈部', viewSide: 'back' },
  { code: 'back_left_shoulder', nameZh: '左肩', viewSide: 'back' },
  { code: 'back_right_shoulder', nameZh: '右肩', viewSide: 'back' },
  { code: 'back_upper_back', nameZh: '上背部', viewSide: 'back' },
  { code: 'back_lower_back', nameZh: '下背部', viewSide: 'back' },
  { code: 'back_pelvis', nameZh: '骨盆', viewSide: 'back' },
  { code: 'back_left_thigh', nameZh: '左大腿', viewSide: 'back' },
  { code: 'back_right_thigh', nameZh: '右大腿', viewSide: 'back' },
  { code: 'back_left_knee', nameZh: '左膝', viewSide: 'back' },
  { code: 'back_right_knee', nameZh: '右膝', viewSide: 'back' },
  { code: 'back_left_lower_leg', nameZh: '左小腿', viewSide: 'back' },
  { code: 'back_right_lower_leg', nameZh: '右小腿', viewSide: 'back' },
  { code: 'back_left_foot', nameZh: '左脚', viewSide: 'back' },
  { code: 'back_right_foot', nameZh: '右脚', viewSide: 'back' },
];

export const ALL_BODY_REGIONS: BodyRegion[] = [...FRONT_REGIONS, ...BACK_REGIONS];

const regionMap = {} as Record<BodyRegionCode, BodyRegion>;

ALL_BODY_REGIONS.forEach((region) => {
  regionMap[region.code] = region;
});

export const BODY_REGION_CODES = ALL_BODY_REGIONS.map(
  (region) => region.code,
) as [BodyRegionCode, ...BodyRegionCode[]];

export const BODY_REGION_NAME_MAP = ALL_BODY_REGIONS.reduce(
  (accumulator, region) => {
    accumulator[region.code] = region.nameZh;
    return accumulator;
  },
  {} as Record<BodyRegionCode, string>,
);

export function getRegionByCode(code: BodyRegionCode): BodyRegion | undefined {
  return regionMap[code];
}
