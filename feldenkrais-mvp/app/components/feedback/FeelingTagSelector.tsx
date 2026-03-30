'use client';

// 感受标签多选组件
type Props = {
  selected: string[];
  onChange: (tags: string[]) => void;
};

export default function FeelingTagSelector({ selected, onChange }: Props) {
  // 所有标签从常量导入（避免循环 import）
  const allTags = [
    'tight', 'relaxed', 'sore', 'warm', 'numb',
    'clear', 'blurry', 'light', 'heavy', 'connected', 'expanded', 'stable',
  ];
  const nameMap: Record<string, string> = {
    tight: '紧', relaxed: '松', sore: '酸', warm: '热', numb: '麻',
    clear: '清晰', blurry: '模糊', light: '轻', heavy: '沉',
    connected: '有连接感', expanded: '舒展', stable: '稳定',
  };

  const toggle = (code: string) => {
    if (selected.includes(code)) {
      onChange(selected.filter(t => t !== code));
    } else {
      onChange([...selected, code]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {allTags.map(code => {
        const active = selected.includes(code);
        return (
          <button
            key={code}
            type="button"
            onClick={() => toggle(code)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              active
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
            }`}
          >
            {nameMap[code]}
          </button>
        );
      })}
    </div>
  );
}
