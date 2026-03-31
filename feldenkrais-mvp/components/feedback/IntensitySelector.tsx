'use client';

type Props = {
  value: number | null;
  onChange: (score: number) => void;
};

export default function IntensitySelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-stone-500">非常弱</span>
        <span className="text-sm font-medium text-stone-900">
          {value === null ? '未填写' : value}
        </span>
        <span className="text-sm text-stone-500">非常强</span>
      </div>
      <div className="flex gap-1 flex-wrap">
        {Array.from({ length: 11 }, (_, index) => index).map((num) => (
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
