'use client';

import FeelingTagSelector from '@/components/feedback/FeelingTagSelector';
import IntensitySelector from '@/components/feedback/IntensitySelector';
import LeftRightSelector from '@/components/feedback/LeftRightSelector';
import { getRegionByCode } from '@/lib/constants/body-regions';
import type { FeedbackBodyPartDraft } from '@/types/feedback';

type Props = {
  entry: FeedbackBodyPartDraft;
  onChange: (entry: FeedbackBodyPartDraft) => void;
};

export default function FeedbackBodyPartEditor({ entry, onChange }: Props) {
  const region = getRegionByCode(entry.bodyRegionCode);

  if (!region) {
    return null;
  }

  const updateEntry = (patch: Partial<FeedbackBodyPartDraft>) => {
    onChange({
      ...entry,
      ...patch,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] text-stone-400">当前编辑</p>
        <h2 className="text-xl font-medium text-stone-900">{region.nameZh}</h2>
        <p className="text-sm text-stone-500">
          当前部位的强度、标签、左右差异和备注都会单独保存。
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-stone-700 mb-3">
          感受标签 <span className="text-stone-400 font-normal ml-1">可多选</span>
        </h3>
        <FeelingTagSelector
          selected={entry.labelCodes}
          onChange={(labelCodes) => updateEntry({ labelCodes })}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-stone-700 mb-3">
          强度评分 <span className="text-stone-400 font-normal ml-1">必填，0-10</span>
        </h3>
        <IntensitySelector
          value={entry.intensityScore}
          onChange={(intensityScore) => updateEntry({ intensityScore })}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-stone-700 mb-3">左右差异</h3>
        <LeftRightSelector
          value={entry.leftRightDiff}
          onChange={(leftRightDiff) => updateEntry({ leftRightDiff })}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-stone-700 mb-3">备注</h3>
        <textarea
          value={entry.note}
          onChange={(event) => updateEntry({ note: event.target.value })}
          placeholder={`记录一下 ${region.nameZh} 的更多细节`}
          rows={4}
          className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-500 resize-none"
        />
      </div>
    </div>
  );
}
