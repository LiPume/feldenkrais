'use client';

import { useMemo, useState } from 'react';
import BodyMap from '@/app/components/body-map/BodyMap';
import { getRegionByCode } from '@/lib/constants/body-regions';
import type { BodyRegionCode } from '@/types/body-region';
import type { PracticeListItem } from '@/types/practice';
import PracticeCard from '@/components/practices/PracticeCard';

type Props = {
  practices: PracticeListItem[];
};

export default function PracticeSearchClient({ practices }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<BodyRegionCode | null>(null);

  const handleToggle = (code: BodyRegionCode) => {
    setSelectedRegion((prev) => (prev === code ? null : code));
  };

  const selectedRegionInfo = selectedRegion ? getRegionByCode(selectedRegion) : null;
  const filteredPractices = useMemo(() => {
    if (!selectedRegion) return [];
    return practices.filter((p) => p.bodyRegionCodes.includes(selectedRegion));
  }, [practices, selectedRegion]);

  return (
    <div className="search-page">
      <div className="search-page-inner">
        {/* Header */}
        <div className="search-header animate-fade-in-up">
          <p className="section-eyebrow">练习库</p>
          <h1 className="search-title">找练习</h1>
          <p className="search-subtitle">
            点击身体部位，发现相关的费登奎斯练习内容
          </p>
        </div>

        {/* Main grid */}
        <div className="search-grid">
          {/* Left: body map */}
          <div className="search-map-panel card animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            <BodyMap
              selectedCodes={selectedRegion ? [selectedRegion] : []}
              onToggle={handleToggle}
            />
          </div>

          {/* Right: results */}
          <div className="search-results-panel animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            {selectedRegionInfo ? (
              <>
                <div className="search-results-header">
                  <div className="search-region-badge">
                    <div className="search-region-dot" />
                    <span className="search-region-name">{selectedRegionInfo.nameZh}</span>
                  </div>
                  <span className="search-results-count">
                    {filteredPractices.length > 0
                      ? `${filteredPractices.length} 个练习`
                      : '暂无练习'}
                  </span>
                </div>

                {filteredPractices.length > 0 ? (
                  <div className="search-results-list stagger-children">
                    {filteredPractices.map((practice) => (
                      <PracticeCard key={practice.id} practice={practice} />
                    ))}
                  </div>
                ) : (
                  <div className="search-empty">
                    <p className="search-empty-title">暂无该部位相关练习</p>
                    <p className="search-empty-desc">试试点击其他身体部位</p>
                  </div>
                )}
              </>
            ) : (
              <div className="search-empty">
                <div className="search-empty-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4M12 16h.01"/>
                  </svg>
                </div>
                <p className="search-empty-title">选择身体部位</p>
                <p className="search-empty-desc">点击左侧人体图上的部位，查找相关练习</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
