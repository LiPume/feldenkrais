'use client';

// 左右差异单选组件
type Props = {
  value: string;
  onChange: (val: string) => void;
};

export default function LeftRightSelector({ value, onChange }: Props) {
  const options = [
    { val: 'none', label: '无差异' },
    { val: 'left_more', label: '左侧更明显' },
    { val: 'right_more', label: '右侧更明显' },
    { val: 'unclear', label: '不确定' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.val}
          type="button"
          onClick={() => onChange(opt.val)}
          className={`px-4 py-2 text-sm rounded-xl border transition-colors ${
            value === opt.val
              ? 'bg-stone-900 text-white border-stone-900'
              : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
