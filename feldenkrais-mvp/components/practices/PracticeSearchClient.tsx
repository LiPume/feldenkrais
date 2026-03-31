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
    if (!selectedRegion) {
      return [];
    }

    return practices.filter((practice) => practice.bodyRegionCodes.includes(selectedRegion));
  }, [practices, selectedRegion]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-medium text-stone-900 mb-2">找练习</h1>
      <p className="text-stone-500 text-sm mb-8">
        点击身体部位，查找相关练习
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <BodyMap
              selectedCodes={selectedRegion ? [selectedRegion] : []}
              onToggle={handleToggle}
            />
          </div>
        </div>

        <div className="lg:w-1/2 flex flex-col">
          {selectedRegionInfo ? (
            <>
              <h2 className="text-base font-medium text-stone-800 mb-4">
                {selectedRegionInfo.nameZh} 相关练习
              </h2>
              {filteredPractices.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {filteredPractices.map((practice) => (
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
