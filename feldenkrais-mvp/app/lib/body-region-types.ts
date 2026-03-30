// 身体区域代码类型，贯穿前端、SVG、数据库的唯一标识
export type BodyRegionCode =
  | 'front_head'
  | 'front_neck'
  | 'front_left_shoulder'
  | 'front_right_shoulder'
  | 'front_chest'
  | 'front_abdomen'
  | 'front_pelvis'
  | 'front_left_thigh'
  | 'front_right_thigh'
  | 'front_left_knee'
  | 'front_right_knee'
  | 'front_left_lower_leg'
  | 'front_right_lower_leg'
  | 'front_left_foot'
  | 'front_right_foot'
  | 'back_head'
  | 'back_neck'
  | 'back_left_shoulder'
  | 'back_right_shoulder'
  | 'back_upper_back'
  | 'back_lower_back'
  | 'back_pelvis'
  | 'back_left_thigh'
  | 'back_right_thigh'
  | 'back_left_knee'
  | 'back_right_knee'
  | 'back_left_lower_leg'
  | 'back_right_lower_leg'
  | 'back_left_foot'
  | 'back_right_foot';

// 身体区域完整对象
export type BodyRegion = {
  code: BodyRegionCode;
  nameZh: string;
  viewSide: 'front' | 'back';
};

// BodyMap 组件 Props
export type BodyMapProps = {
  /** 当前选中区域，多选模式下可多个 */
  selectedCodes: BodyRegionCode[];
  /** 是否允许多选，默认 false */
  multiSelect?: boolean;
  /** 区域点击回调，返回被点击的 region code */
  onToggle: (code: BodyRegionCode) => void;
};
