'use client';

import type { BodyRegionCode } from '../../lib/body-region-types';

type Props = {
  selectedCodes: BodyRegionCode[];
  onToggle: (code: BodyRegionCode) => void;
};

// 背面人体图 SVG
// viewBox 0 0 300 600，与正面共享坐标系
// 背面用 back_upper_back + back_lower_back 替代正面的 chest + abdomen
export default function BodyMapBack({ selectedCodes, onToggle }: Props) {
  const selected = (code: BodyRegionCode) => selectedCodes.includes(code);

  return (
    <svg
      viewBox="0 0 300 600"
      className="w-full max-w-[280px] mx-auto"
      aria-label="背面人体图"
    >
      {/* 头部 */}
      <g
        id="back_head"
        onClick={() => onToggle('back_head')}
        className="cursor-pointer"
      >
        <ellipse
          cx="150" cy="55" rx="32" ry="38"
          fill={selected('back_head') ? '#44403c' : '#d6d3d1'}
          stroke="#a8a29e"
          strokeWidth="1.5"
          className="transition-colors duration-150"
        />
      </g>

      {/* 颈部 */}
      <g
        id="back_neck"
        onClick={() => onToggle('back_neck')}
        className="cursor-pointer"
      >
        <rect
          x="138" y="88" width="24" height="24"
          fill={selected('back_neck') ? '#44403c' : '#d6d3d1'}
          stroke="#a8a29e"
          strokeWidth="1.5"
          className="transition-colors duration-150"
        />
      </g>

      {/* 左肩 */}
      <g
        id="back_left_shoulder"
        onClick={() => onToggle('back_left_shoulder')}
        className="cursor-pointer"
      >
        <path
          d="M 138 108 Q 105 112 95 135 Q 90 152 105 158 L 138 155 Z"
          fill={selected('back_left_shoulder') ? '#44403c' : '#d6d3d1'}
          stroke="#a8a29e"
          strokeWidth="1.5"
          className="transition-colors duration-150"
        />
      </g>

      {/* 右肩 */}
      <g
        id="back_right_shoulder"
        onClick={() => onToggle('back_right_shoulder')}
        className="cursor-pointer"
      >
        <path
          d="M 162 108 Q 195 112 205 135 Q 210 152 195 158 L 162 155 Z"
          fill={selected('back_right_shoulder') ? '#44403c' : '#d6d3d1'}
          stroke="#a8a29e"
          strokeWidth="1.5"
          className="transition-colors duration-150"
        />
      </g>

      {/* 上背部 */}
      <g
        id="back_upper_back"
        onClick={() => onToggle('back_upper_back')}
        className="cursor-pointer"
      >
        <path
          d="M 105 158 L 100 200 L 138 210 L 150 208 L 162 210 L 200 200 L 195 158 L 162 148 Q 150 145 138 148 Z"
          fill={selected('back_upper_back') ? '#44403c' : '#d6d3d1'}
          stroke="#a8a29e"
          strokeWidth="1.5"
          className="transition-colors duration-150"
        />
      </g>

      {/* 下背部 */}
      <g
        id="back_lower_back"
        onClick={() => onToggle('back_lower_back')}
        className="cursor-pointer"
      >
        <path
          d="M 100 200 L 98 272 L 138 280 L 150 278 L 162 280 L 202 272 L 200 200 Z"
          fill={selected('back_lower_back') ? '#44403c' : '#d6d3d1'}
          stroke="#a8a29e"
          strokeWidth="1.5"
          className="transition-colors duration-150"
        />
      </g>

      {/* 骨盆 */}
      <g
        id="back_pelvis"
        onClick={() => onToggle('back_pelvis')}
        className="cursor-pointer"
      >
        <path
          d="M 98 272 L 96 318 L 135 326 L 150 324 L 165 326 L 204 318 L 202 272 Z"
          fill={selected('back_pelvis') ? '#44403c' : '#d6d3d1'}
          stroke="#a8a29e"
          strokeWidth="1.5"
          className="transition-colors duration-150"
        />
      </g>

      {/* 左大腿 */}
      <g
        id="back_left_thigh"
        onClick={() => onToggle('back_left_thigh')}
        className="cursor-pointer"
      >
        <path
          d="M 96 318 L 93 415 L 128 420 L 136 326 L 135 326 L 96 318 Z"
          fill={selected('back_left_thigh') ? '#44403c' : '#d6d3d1'}
          stroke="#a8a29e"
          strokeWidth="1.5"
          className="transition-colors duration-150"
        />
      </g>

      {/* 右大腿 */}
      <g
        id="back_right_thigh"
        onClick={() => onToggle('back_right_thigh')}
        className="cursor-pointer"
      >
        <path
          d="M 204 318 L 207 415 L 172 420 L 164 326 L 165 326 L 204 318 Z"
          fill={selected('back_right_thigh') ? '#44403c' : '#d6d3d1'}
          stroke="#a8a29e"
          strokeWidth="1.5"
          className="transition-colors duration-150"
        />
      </g>

      {/* 左膝 */}
      <g
        id="back_left_knee"
        onClick={() => onToggle('back_left_knee')}
        className="cursor-pointer"
      >
        <ellipse
          cx="110" cy="432" rx="20" ry="16"
          fill={selected('back_left_knee') ? '#44403c' : '#d6d3d1'}
          stroke="#a8a29e"
          strokeWidth="1.5"
          className="transition-colors duration-150"
        />
      </g>

      {/* 右膝 */}
      <g
        id="back_right_knee"
        onClick={() => onToggle('back_right_knee')}
        className="cursor-pointer"
      >
        <ellipse
          cx="190" cy="432" rx="20" ry="16"
          fill={selected('back_right_knee') ? '#44403c' : '#d6d3d1'}
          stroke="#a8a29e"
          strokeWidth="1.5"
          className="transition-colors duration-150"
        />
      </g>

      {/* 左小腿 */}
      <g
        id="back_left_lower_leg"
        onClick={() => onToggle('back_left_lower_leg')}
        className="cursor-pointer"
      >
        <path
          d="M 93 445 L 90 520 L 125 525 L 130 445 Z"
          fill={selected('back_left_lower_leg') ? '#44403c' : '#d6d3d1'}
          stroke="#a8a29e"
          strokeWidth="1.5"
          className="transition-colors duration-150"
        />
      </g>

      {/* 右小腿 */}
      <g
        id="back_right_lower_leg"
        onClick={() => onToggle('back_right_lower_leg')}
        className="cursor-pointer"
      >
        <path
          d="M 207 445 L 210 520 L 175 525 L 170 445 Z"
          fill={selected('back_right_lower_leg') ? '#44403c' : '#d6d3d1'}
          stroke="#a8a29e"
          strokeWidth="1.5"
          className="transition-colors duration-150"
        />
      </g>

      {/* 左脚 */}
      <g
        id="back_left_foot"
        onClick={() => onToggle('back_left_foot')}
        className="cursor-pointer"
      >
        <path
          d="M 80 530 Q 82 525 88 522 L 135 525 Q 138 535 130 538 L 80 530 Z"
          fill={selected('back_left_foot') ? '#44403c' : '#d6d3d1'}
          stroke="#a8a29e"
          strokeWidth="1.5"
          className="transition-colors duration-150"
        />
      </g>

      {/* 右脚 */}
      <g
        id="back_right_foot"
        onClick={() => onToggle('back_right_foot')}
        className="cursor-pointer"
      >
        <path
          d="M 220 530 Q 218 525 212 522 L 165 525 Q 162 535 170 538 L 220 530 Z"
          fill={selected('back_right_foot') ? '#44403c' : '#d6d3d1'}
          stroke="#a8a29e"
          strokeWidth="1.5"
          className="transition-colors duration-150"
        />
      </g>
    </svg>
  );
}
