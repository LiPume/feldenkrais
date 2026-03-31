'use client';

import { LEFT_RIGHT_OPTIONS } from '@/lib/constants/feedback-labels';
import type { LeftRightDiffValue } from '@/types/feedback';

type Props = {
  value: LeftRightDiffValue;
  onChange: (value: LeftRightDiffValue) => void;
};

export default function LeftRightSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {LEFT_RIGHT_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`px-4 py-2 text-sm rounded-xl border transition-colors ${
            value === option.value
              ? 'bg-stone-900 text-white border-stone-900'
              : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
          }`}
        >
          {option.name}
        </button>
      ))}
    </div>
  );
}
