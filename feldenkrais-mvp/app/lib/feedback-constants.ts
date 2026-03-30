// 感受标签常量
// 前端展示用，数据库只存 code
export const FEELING_TAGS: { code: string; name: string }[] = [
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

// 左右差异选项
export const LEFT_RIGHT_OPTIONS: { value: string; name: string }[] = [
  { value: 'none', name: '无差异' },
  { value: 'left_more', name: '左侧更明显' },
  { value: 'right_more', name: '右侧更明显' },
  { value: 'unclear', name: '不确定' },
];
