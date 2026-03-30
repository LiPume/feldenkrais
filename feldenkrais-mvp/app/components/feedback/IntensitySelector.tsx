'use client';

// 强度评分选择器 0-10
type Props = {
  value: number;
  onChange: (score: number) => void;
};

export default function IntensitySelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-stone-500">非常弱</span>
        <span className="text-sm font-medium text-stone-900">{value}</span>
        <span className="text-sm text-stone-500">非常强</span>
      </div>
      {/* 0-10 数字按钮，每 2 个一跳 */}
      <div className="flex gap-1 flex-wrap">
        {Array.from({ length: 11 }, (_, i) => i).map(num => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`flex-1 min-w-[2rem] h-9 rounded-lg text-sm font-medium transition-colors ${
              value === num
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
