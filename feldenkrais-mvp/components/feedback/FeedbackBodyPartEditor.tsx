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
    onChange({ ...entry, ...patch });
  };

  return (
    <div className="editor-card card">
      <div className="editor-region-header">
        <div>
          <p className="section-eyebrow">当前编辑</p>
          <h2 className="editor-region-title">{region.nameZh}</h2>
        </div>
      </div>

      <div className="editor-sections">
        <div className="editor-section">
          <h3 className="editor-section-label">
            感受标签 <span className="editor-section-optional">可多选</span>
          </h3>
          <FeelingTagSelector
            selected={entry.labelCodes}
            onChange={(labelCodes) => updateEntry({ labelCodes })}
          />
        </div>

        <div className="editor-section">
          <h3 className="editor-section-label">
            强度评分 <span className="editor-section-required">必填</span>
          </h3>
          <IntensitySelector
            value={entry.intensityScore}
            onChange={(intensityScore) => updateEntry({ intensityScore })}
          />
        </div>

        <div className="editor-section">
          <h3 className="editor-section-label">左右差异</h3>
          <LeftRightSelector
            value={entry.leftRightDiff}
            onChange={(leftRightDiff) => updateEntry({ leftRightDiff })}
          />
        </div>

        <div className="editor-section">
          <h3 className="editor-section-label">备注</h3>
          <textarea
            value={entry.note}
            onChange={(event) => updateEntry({ note: event.target.value })}
            placeholder={`记录 ${region.nameZh} 的更多细节`}
            rows={3}
            className="editor-textarea"
          />
        </div>
      </div>
    </div>
  );
}
