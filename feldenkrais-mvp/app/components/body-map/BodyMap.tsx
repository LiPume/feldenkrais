'use client';

import { useState } from 'react';
import BodyMapFront from './BodyMapFront';
import BodyMapBack from './BodyMapBack';
import type { BodyMapProps } from '@/types/body-region';
import { getRegionByCode } from '@/lib/constants/body-regions';

export type BodyMapLayer = 'skin' | 'skeleton';

export default function BodyMap(props: BodyMapProps) {
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [layer, setLayer] = useState<BodyMapLayer>('skin');

  return (
    <div className="body-map-shell">
      <div className="body-map-controls" aria-label="人体图显示选项">
        <div className="body-map-toggle" aria-label="人体朝向">
          <button
            type="button"
            onClick={() => setSide('front')}
            className={`body-map-toggle-btn ${side === 'front' ? 'body-map-toggle-btn--active' : ''}`}
          >
            正面
          </button>
          <button
            type="button"
            onClick={() => setSide('back')}
            className={`body-map-toggle-btn ${side === 'back' ? 'body-map-toggle-btn--active' : ''}`}
          >
            背面
          </button>
        </div>

        <div className="body-map-toggle" aria-label="人体图层">
          <button
            type="button"
            onClick={() => setLayer('skin')}
            className={`body-map-toggle-btn ${layer === 'skin' ? 'body-map-toggle-btn--active' : ''}`}
          >
            皮肤
          </button>
          <button
            type="button"
            onClick={() => setLayer('skeleton')}
            className={`body-map-toggle-btn ${layer === 'skeleton' ? 'body-map-toggle-btn--active' : ''}`}
          >
            骨骼
          </button>
        </div>
      </div>

      {side === 'front' ? (
        <BodyMapFront
          selectedCodes={props.selectedCodes}
          onToggle={props.onToggle}
          layer={layer}
        />
      ) : (
        <BodyMapBack
          selectedCodes={props.selectedCodes}
          onToggle={props.onToggle}
          layer={layer}
        />
      )}

      {props.selectedCodes.length > 0 && (
        <div className="body-map-selected-tags">
          {props.selectedCodes.map((code) => {
            const region = getRegionByCode(code);
            return region ? (
              <span key={code} className="body-map-selected-tag">
                <span className="body-map-selected-dot" />
                {region.nameZh}
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
