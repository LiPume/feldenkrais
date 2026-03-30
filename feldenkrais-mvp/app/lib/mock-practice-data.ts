import type { BodyRegionCode } from './body-region-types';

// 练习对象类型
export type Practice = {
  id: string;
  title: string;
  slug: string;
  courseName?: string;
  summary?: string;
  contentText?: string;
  audioUrl?: string;
  durationSec?: number;
  bodyRegionCodes: BodyRegionCode[];
};

// 练习数据
// 音频文件放在 public/audio/ 目录下，Next.js 直接通过 /audio/xxx 访问
export const MOCK_PRACTICES: Practice[] = [
  {
    id: '1',
    title: '感知身体的对角线',
    slug: 'perceive-body-diagonal',
    courseName: 'ATM - 感知系列',
    summary: '通过身体对角线的感知练习，建立左右两侧的协调连接，提升整体身体意识。',
    contentText: `1. 站立或坐姿，保持脊柱自然伸展。
2. 将注意力从左脚跟慢慢向上移动，沿左腿、左侧骨盆、腰椎方向移动。
3. 穿过躯干，到达右肩。
4. 再从右肩向下，经右臂回到右手指尖。
5. 这是身体的一条对角线。感受这条线上的张力、重量、温度。
6. 现在反向走：从右手指尖回到左脚跟。
7. 重复 3-5 次，体会左右两侧的差异。`,
    audioUrl: '/audio/感知身体的对角线.mp3',
    durationSec: 300,
    bodyRegionCodes: ['front_left_foot', 'front_right_foot', 'front_left_thigh', 'front_right_thigh', 'front_pelvis', 'back_pelvis', 'front_left_shoulder', 'front_right_shoulder'],
  },
  {
    id: '2',
    title: '柔软的手臂',
    slug: 'soft-arm',
    courseName: 'ATM - 肩颈专项',
    summary: '通过手臂的缓慢运动，释放肩颈部的紧张，感受手臂重量与肩部的自然连接。',
    contentText: `1. 站立或坐姿，双臂自然垂于身体两侧。
2. 慢慢将右臂向前抬起，与地面平行。
3. 继续向上抬起，直到手指指向天花板，同时肩膀自然向上耸起。
4. 感受手臂的重量，以及肩胛骨随着抬起产生的移动。
5. 反向缓慢放下手臂，让肩膀完全松弛落下。
6. 观察放下后肩膀是否比抬起前更低。
7. 左臂重复相同动作，感受左右差异。
8. 双臂同时做，感知整体肩颈的连接感。`,
    audioUrl: '/audio/柔软的手臂.mp3',
    durationSec: 360,
    bodyRegionCodes: ['front_left_shoulder', 'front_right_shoulder', 'back_left_shoulder', 'back_right_shoulder', 'front_neck', 'front_chest'],
  },
  {
    id: '3',
    title: '迷你 ATM 脊柱链条',
    slug: 'mini-atm-spine-chain',
    courseName: 'ATM - 脊柱专项',
    summary: '一系列简短动作，串联脊柱各节段的感知，建立脊柱整体运动的连贯意识。',
    contentText: `1. 仰卧，膝盖弯曲，双脚踩地。
2. 轻轻将骨盆向后倾斜，尾骨向下压地面，感受下背部的细微变化。
3. 再将骨盆向前推，尾骨上抬，感受下背部另一侧的变化。
4. 交替骨盆倾斜，保持幅度小，专注于脊柱的感觉。
5. 将头轻轻转向右侧，再转向左侧，感知颈椎与胸椎的过渡。
6. 抬起右臂，向天花板方向伸直，慢慢将手臂向头部方向放下，感知肩胛骨在背部的移动。
7. 重复左侧。全程保持呼吸平稳。`,
    audioUrl: '/audio/迷你ATM脊柱链条.aac',
    durationSec: 420,
    bodyRegionCodes: ['back_lower_back', 'back_upper_back', 'front_neck', 'back_neck', 'back_left_shoulder', 'back_right_shoulder', 'back_pelvis'],
  },
  {
    id: '4',
    title: '好的姿势',
    slug: 'good-posture',
    courseName: 'ATM - 站立系列',
    summary: '通过感知重力在身体中的分布，找到骨骼支撑的自然姿势，减少肌肉的无效用力。',
    contentText: `1. 站立，双脚与肩同宽。
2. 轻轻屈膝，感受重心略微下移。
3. 慢慢伸直双腿，但不完全锁定膝关节。
4. 感受重力从脚底向上传递：穿过踝、膝、髋、骨盆、脊柱。
5. 想象一根线从头顶向上轻拉，感受脊柱的伸展。
6. 观察肩部是否在无意识中耸起。
7. 让肩部完全松弛，感受手臂的自然下垂。
8. 找到骨骼支撑、肌肉松弛的感觉，这就是"好的姿势"。`,
    audioUrl: '/audio/ATM—好的姿势.aac',
    durationSec: 330,
    bodyRegionCodes: ['front_pelvis', 'back_lower_back', 'front_abdomen', 'front_left_shoulder', 'front_right_shoulder', 'front_neck'],
  },
  {
    id: '5',
    title: '颈部自由旋转',
    slug: 'neck-free-rotation',
    courseName: 'ATM - 地面动作',
    summary: '通过缓慢的头部旋转，觉察颈部与肩部的连接方式，找到自然的运动路径。',
    contentText: `1. 仰卧，膝盖弯曲，双脚踩地。
2. 轻轻将头部从一侧转向另一侧。
3. 注意颈部两侧的伸展感是否对称。
4. 让头部重量自然引导转动，不主动用力。
5. 每次转动后稍作停留，感受颈部与地面的接触。
6. 重复 5-10 次，慢慢观察两侧感受的变化。`,
    audioUrl: undefined,
    durationSec: 240,
    bodyRegionCodes: ['front_neck', 'front_head', 'front_left_shoulder', 'front_right_shoulder'],
  },
  {
    id: '6',
    title: '髋部旋转觉察',
    slug: 'hip-rotation-awareness',
    courseName: 'ATM - 地面动作',
    summary: '仰卧状态下进行髋部内外旋，观察左右两侧的运动幅度与感觉差异。',
    contentText: `1. 仰卧，双腿伸直放松。
2. 屈右膝，将右脚放在左膝上。
3. 右手穿过双腿之间抱住左膝，左手放在右膝外侧。
4. 轻轻将双腿向胸部方向拉近，感受右髋的伸展。
5. 两侧交换，感知左右髋部灵活性是否相同。
6. 每侧保持 1-2 分钟，呼吸保持平稳。`,
    audioUrl: undefined,
    durationSec: 360,
    bodyRegionCodes: ['front_pelvis', 'front_left_thigh', 'front_right_thigh', 'back_pelvis'],
  },
  {
    id: '7',
    title: '脚部重量感知',
    slug: 'foot-weight-awareness',
    courseName: 'ATM - 站立系列',
    summary: '通过站立时脚部感觉的重新分配，建立更好的重心感知和下肢连接。',
    contentText: `1. 站立，双脚与髋同宽。
2. 将注意力放在脚底，感受与地面的接触。
3. 试着将重心稍微移向脚掌前端，再移向脚跟。
4. 感受足弓的变化和脚趾的活动。
5. 尝试将重心移向左侧，再移向右侧。
6. 观察站立时左右脚用力是否均匀。
7. 最后找到双脚均匀受力的感觉，保持片刻。`,
    audioUrl: undefined,
    durationSec: 270,
    bodyRegionCodes: ['front_left_foot', 'front_right_foot', 'front_left_lower_leg', 'front_right_lower_leg', 'back_left_foot', 'back_right_foot'],
  },
];

// 根据身体区域 code 查找关联练习
export function getPracticesByRegion(code: BodyRegionCode): Practice[] {
  return MOCK_PRACTICES.filter(p => p.bodyRegionCodes.includes(code));
}

// 根据 slug 查找练习
export function getPracticeBySlug(slug: string): Practice | undefined {
  return MOCK_PRACTICES.find(p => p.slug === slug);
}

// 根据 id 查找练习
export function getPracticeById(id: string): Practice | undefined {
  return MOCK_PRACTICES.find(p => p.id === id);
}
