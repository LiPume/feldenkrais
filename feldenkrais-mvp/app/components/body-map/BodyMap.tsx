'use client';

import { useState } from 'react';
import BodyMapFront from './BodyMapFront';
import BodyMapBack from './BodyMapBack';
import type { BodyMapProps } from '../../lib/body-region-types';
import { getRegionByCode } from '../../lib/body-region-constants';

export default function BodyMap(props: BodyMapProps) {
  // 当前显示正面还是背面
  const [side, setSide] = useState<'front' | 'back'>('front');

  return (
    <div>
      {/* 正面 / 背面 切换按钮 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSide('front')}
          className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
            side === 'front'
              ? 'bg-stone-900 text-white border-stone-900'
              : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
          }`}
        >
          正面
        </button>
        <button
          onClick={() => setSide('back')}
          className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
            side === 'back'
              ? 'bg-stone-900 text-white border-stone-900'
              : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
          }`}
        >
          背面
        </button>
      </div>

      {/* SVG 人体图 */}
      {side === 'front' ? (
        <BodyMapFront selectedCodes={props.selectedCodes} onToggle={props.onToggle} />
      ) : (
        <BodyMapBack selectedCodes={props.selectedCodes} onToggle={props.onToggle} />
      )}

      {/* 当前选中区域文字标签 */}
      {props.selectedCodes.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {props.selectedCodes.map(code => {
            const region = getRegionByCode(code);
            return region ? (
              <span
                key={code}
                className="inline-block px-3 py-1 bg-stone-900 text-white text-xs rounded-full"
              >
                {region.nameZh}
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
