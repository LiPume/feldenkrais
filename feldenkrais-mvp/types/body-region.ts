export type BodyViewSide = 'front' | 'back';

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

export type BodyRegion = {
  code: BodyRegionCode;
  nameZh: string;
  viewSide: BodyViewSide;
};

export type BodyMapProps = {
  selectedCodes: BodyRegionCode[];
  multiSelect?: boolean;
  onToggle: (code: BodyRegionCode) => void;
};
