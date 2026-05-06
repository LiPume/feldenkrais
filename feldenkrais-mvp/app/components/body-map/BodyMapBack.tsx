'use client';

import type { KeyboardEvent } from 'react';
import type { BodyRegionCode } from '@/types/body-region';
import { BACK_REGIONS } from '@/lib/constants/body-regions';
import type { BodyMapLayer } from './BodyMap';

type Props = {
  selectedCodes: BodyRegionCode[];
  onToggle: (code: BodyRegionCode) => void;
  layer: BodyMapLayer;
};

type RegionShape = {
  code: BodyRegionCode;
  label: string;
  d: string;
};

const REGION_CODES = BACK_REGIONS.map((r) => r.code) as BodyRegionCode[];

const REGION_SHAPES: RegionShape[] = [
  {
    code: 'back_head',
    label: '头',
    d: 'M160 18 C138 18 123 36 123 61 C123 86 139 103 160 103 C181 103 197 86 197 61 C197 36 182 18 160 18 Z',
  },
  {
    code: 'back_neck',
    label: '颈部',
    d: 'M144 98 C149 103 171 103 176 98 L180 128 C170 137 150 137 140 128 Z',
  },
  {
    code: 'back_left_shoulder',
    label: '左肩',
    d: 'M140 124 C121 126 101 135 88 151 C78 164 76 190 89 203 C102 215 121 200 126 176 C130 156 135 139 140 124 Z',
  },
  {
    code: 'back_right_shoulder',
    label: '右肩',
    d: 'M180 124 C199 126 219 135 232 151 C242 164 244 190 231 203 C218 215 199 200 194 176 C190 156 185 139 180 124 Z',
  },
  {
    code: 'back_upper_back',
    label: '上背部',
    d: 'M126 134 C139 127 181 127 194 134 C205 158 209 203 204 239 C190 252 130 252 116 239 C111 203 115 158 126 134 Z',
  },
  {
    code: 'back_lower_back',
    label: '下背部',
    d: 'M116 239 C130 252 190 252 204 239 L200 327 C187 340 133 340 120 327 Z',
  },
  {
    code: 'back_pelvis',
    label: '骨盆',
    d: 'M120 327 C134 342 186 342 200 327 C211 350 202 378 182 390 C171 384 149 384 138 390 C118 378 109 350 120 327 Z',
  },
  {
    code: 'back_left_thigh',
    label: '左大腿',
    d: 'M118 382 C128 392 143 397 154 394 L149 500 C137 508 113 506 104 494 C105 445 109 411 118 382 Z',
  },
  {
    code: 'back_right_thigh',
    label: '右大腿',
    d: 'M202 382 C192 392 177 397 166 394 L171 500 C183 508 207 506 216 494 C215 445 211 411 202 382 Z',
  },
  {
    code: 'back_left_knee',
    label: '左膝',
    d: 'M104 494 C114 486 138 486 149 500 C151 512 144 525 128 529 C113 527 102 516 104 494 Z',
  },
  {
    code: 'back_right_knee',
    label: '右膝',
    d: 'M216 494 C206 486 182 486 171 500 C169 512 176 525 192 529 C207 527 218 516 216 494 Z',
  },
  {
    code: 'back_left_lower_leg',
    label: '左小腿',
    d: 'M105 516 C116 525 137 527 149 518 L143 593 C133 600 111 599 101 590 C99 560 101 536 105 516 Z',
  },
  {
    code: 'back_right_lower_leg',
    label: '右小腿',
    d: 'M215 516 C204 525 183 527 171 518 L177 593 C187 600 209 599 219 590 C221 560 219 536 215 516 Z',
  },
  {
    code: 'back_left_foot',
    label: '左脚',
    d: 'M97 590 C109 598 132 600 143 593 C151 599 149 611 136 616 L98 613 C89 609 88 598 97 590 Z',
  },
  {
    code: 'back_right_foot',
    label: '右脚',
    d: 'M223 590 C211 598 188 600 177 593 C169 599 171 611 184 616 L222 613 C231 609 232 598 223 590 Z',
  },
];

function handleRegionKey(
  event: KeyboardEvent<SVGGElement>,
  code: BodyRegionCode,
  onToggle: (code: BodyRegionCode) => void,
) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onToggle(code);
    return;
  }

  const idx = REGION_CODES.indexOf(code);
  const total = REGION_CODES.length;
  let next: number | null = null;

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    next = (idx + 1) % total;
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    next = (idx - 1 + total) % total;
  }

  if (next !== null) {
    event.preventDefault();
    document.getElementById(`bodymap-back-${REGION_CODES[next]}`)?.focus();
  }
}

function BackSkinBase() {
  return (
    <g aria-hidden="true" className="body-map-skin-base">
      <path d="M160 18 C138 18 123 36 123 61 C123 86 139 103 160 103 C181 103 197 86 197 61 C197 36 182 18 160 18 Z" />
      <path d="M144 98 C149 103 171 103 176 98 L180 128 C170 137 150 137 140 128 Z" />
      <path d="M126 134 C139 127 181 127 194 134 C205 158 209 203 204 239 L200 327 C211 350 202 378 182 390 C171 384 149 384 138 390 C118 378 109 350 120 327 L116 239 C111 203 115 158 126 134 Z" />
      <path d="M90 151 C74 170 66 199 66 235 C66 260 58 282 50 304 C45 318 51 330 63 331 C73 332 80 324 82 311 C88 285 96 263 99 239 C103 211 110 190 126 176 C122 155 108 145 90 151 Z" />
      <path d="M230 151 C246 170 254 199 254 235 C254 260 262 282 270 304 C275 318 269 330 257 331 C247 332 240 324 238 311 C232 285 224 263 221 239 C217 211 210 190 194 176 C198 155 212 145 230 151 Z" />
      <path d="M118 382 C128 392 143 397 154 394 L149 500 C151 512 144 525 128 529 C113 527 102 516 104 494 C105 445 109 411 118 382 Z" />
      <path d="M202 382 C192 392 177 397 166 394 L171 500 C169 512 176 525 192 529 C207 527 218 516 216 494 C215 445 211 411 202 382 Z" />
      <path d="M105 516 C116 525 137 527 149 518 L143 593 C151 599 149 611 136 616 L98 613 C89 609 88 598 97 590 C99 560 101 536 105 516 Z" />
      <path d="M215 516 C204 525 183 527 171 518 L177 593 C169 599 171 611 184 616 L222 613 C231 609 232 598 223 590 C221 560 219 536 215 516 Z" />
    </g>
  );
}

function BackSkeleton() {
  return (
    <g aria-hidden="true" className="body-map-skeleton">
      <path className="body-map-bone body-map-bone-fill" d="M160 28 C141 28 130 42 130 61 C130 80 142 94 160 94 C178 94 190 80 190 61 C190 42 179 28 160 28 Z" />
      <path className="body-map-bone" d="M146 109 L174 109" />
      <path className="body-map-bone" d="M160 112 C158 146 158 196 160 236 C162 275 162 326 160 372" />
      <path className="body-map-bone" d="M141 130 L107 154" />
      <path className="body-map-bone" d="M179 130 L213 154" />
      <path className="body-map-bone" d="M130 153 C139 142 151 139 160 146 C169 139 181 142 190 153" />
      <path className="body-map-bone" d="M126 162 C111 180 105 205 111 230 C130 224 145 209 151 184 Z" />
      <path className="body-map-bone" d="M194 162 C209 180 215 205 209 230 C190 224 175 209 169 184 Z" />
      <path className="body-map-bone" d="M104 161 C92 190 86 222 82 251 C79 275 71 297 63 320" />
      <path className="body-map-bone" d="M216 161 C228 190 234 222 238 251 C241 275 249 297 257 320" />
      <path className="body-map-bone" d="M128 250 Q160 272 192 250" />
      <path className="body-map-bone" d="M126 340 C141 363 179 363 194 340" />
      <path className="body-map-bone" d="M138 380 L126 506 L122 594" />
      <path className="body-map-bone" d="M182 380 L194 506 L198 594" />
      <path className="body-map-bone" d="M109 521 L140 521" />
      <path className="body-map-bone" d="M180 521 L211 521" />
      <path className="body-map-bone" d="M103 606 L142 606" />
      <path className="body-map-bone" d="M178 606 L217 606" />
      {Array.from({ length: 10 }, (_, index) => (
        <circle
          key={index}
          className="body-map-bone-dot"
          cx="160"
          cy={128 + index * 25}
          r="2.2"
        />
      ))}
    </g>
  );
}

export default function BodyMapBack({ selectedCodes, onToggle, layer }: Props) {
  const isSelected = (code: BodyRegionCode) => selectedCodes.includes(code);

  return (
    <svg
      viewBox="0 0 320 640"
      className={`body-map-svg body-map-svg--${layer}`}
      aria-label={`背面人体${layer === 'skeleton' ? '骨骼' : '皮肤'}图`}
      role="group"
    >
      <BackSkinBase />
      {layer === 'skeleton' && <BackSkeleton />}

      <g className="body-map-region-layer">
        {REGION_SHAPES.map((region) => {
          const selected = isSelected(region.code);

          return (
            <g
              key={region.code}
              id={`bodymap-back-${region.code}`}
              tabIndex={0}
              role="button"
              aria-pressed={selected}
              aria-label={region.label}
              onClick={() => onToggle(region.code)}
              onKeyDown={(event) => handleRegionKey(event, region.code, onToggle)}
              className="body-map-region-group"
            >
              <path
                d={region.d}
                className={`body-map-region body-map-region--${layer} ${selected ? 'body-map-region--selected' : ''}`}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
