'use client';

import { useState } from 'react';
import Link from 'next/link';
import BodyMap from '../components/body-map/BodyMap';
import type { BodyRegionCode } from '../lib/body-region-types';
import { getRegionByCode } from '../lib/body-region-constants';
import { getPracticesByRegion } from '../lib/mock-practice-data';
import type { Practice } from '../lib/mock-practice-data';

// 辅助函数：将秒数格式化为 mm:ss
function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// 单个练习卡片
function PracticeCard({ practice }: { practice: Practice }) {
  return (
    <Link
      href={`/practices/${practice.slug}`}
      className="block bg-white rounded-xl border border-stone-200 p-4 hover:border-stone-400 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-medium text-stone-900 leading-snug">
          {practice.title}
        </h3>
        {practice.durationSec && (
          <span className="text-xs text-stone-400 whitespace-nowrap">
            {formatDuration(practice.durationSec)}
          </span>
        )}
      </div>
      {practice.courseName && (
        <p className="text-xs text-stone-400 mb-2">{practice.courseName}</p>
      )}
      {practice.summary && (
        <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
          {practice.summary}
        </p>
      )}
    </Link>
  );
}

export default function PracticeSearchPage() {
  // 记录当前选中的身体区域（找练习页单选）
  const [selectedRegion, setSelectedRegion] = useState<BodyRegionCode | null>(null);

  const handleToggle = (code: BodyRegionCode) => {
    setSelectedRegion(prev => (prev === code ? null : code));
  };

  const selectedRegionInfo = selectedRegion ? getRegionByCode(selectedRegion) : null;
  const filteredPractices = selectedRegion ? getPracticesByRegion(selectedRegion) : [];

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-medium text-stone-900 mb-2">找练习</h1>
      <p className="text-stone-500 text-sm mb-8">
        点击身体部位，查找相关练习
      </p>

      {/* 人体图 + 练习列表并排 */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 左侧：人体图 */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <BodyMap
              selectedCodes={selectedRegion ? [selectedRegion] : []}
              onToggle={handleToggle}
            />
          </div>
        </div>

        {/* 右侧：练习列表 */}
        <div className="lg:w-1/2 flex flex-col">
          {selectedRegionInfo ? (
            <>
              <h2 className="text-base font-medium text-stone-800 mb-4">
                {selectedRegionInfo.nameZh} 相关练习
              </h2>
              {filteredPractices.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {filteredPractices.map(practice => (
                    <PracticeCard key={practice.id} practice={practice} />
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-stone-400 text-sm text-center min-h-[120px]">
                  暂无该部位相关练习
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-stone-400 text-sm text-center min-h-[120px]">
              请点击左侧身体部位
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
