'use client';

import { FEELING_TAGS } from '@/lib/constants/feedback-labels';
import type { FeedbackLabelCode } from '@/types/feedback';

type Props = {
  selected: FeedbackLabelCode[];
  onChange: (tags: FeedbackLabelCode[]) => void;
};

export default function FeelingTagSelector({ selected, onChange }: Props) {
  const toggle = (code: FeedbackLabelCode) => {
    if (selected.includes(code)) {
      onChange(selected.filter((tag) => tag !== code));
      return;
    }

    onChange([...selected, code]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {FEELING_TAGS.map((tag) => {
        const active = selected.includes(tag.code);

        return (
          <button
            key={tag.code}
            type="button"
            onClick={() => toggle(tag.code)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              active
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
            }`}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}
