import type { BodyRegion, BodyRegionCode } from './body-region-types';

// 正面身体区域列表
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

// 背面身体区域列表
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

// 快速查询：code -> BodyRegion
const regionMap = {} as Record<BodyRegionCode, BodyRegion>;

// 合并正反面建立 code 索引
[...FRONT_REGIONS, ...BACK_REGIONS].forEach(r => {
  regionMap[r.code] = r;
});

export function getRegionByCode(code: BodyRegionCode): BodyRegion | undefined {
  return regionMap[code];
}
