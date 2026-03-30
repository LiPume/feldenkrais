'use client';

import { useState } from 'react';
import Link from 'next/link';
import BodyMap from '../../components/body-map/BodyMap';
import FeelingTagSelector from '../../components/feedback/FeelingTagSelector';
import IntensitySelector from '../../components/feedback/IntensitySelector';
import LeftRightSelector from '../../components/feedback/LeftRightSelector';
import type { FeedbackPhase } from '../../lib/feedback-types';
import type { FeedbackFormState } from '../../lib/feedback-types';
import type { BodyRegionCode } from '../../lib/body-region-types';
import { getPracticeById } from '../../lib/mock-practice-data';
import { saveFeedbackRecord, generateId } from '../../lib/feedback-storage';
import { getRegionByCode } from '../../lib/body-region-constants';

type Props = {
  practiceId?: string;
  practiceTitle?: string;
};

export default function FeedbackFormClient({ practiceId, practiceTitle }: Props) {
  // 表单状态
  const [form, setForm] = useState<FeedbackFormState>({
    practiceId,
    practiceTitle,
    feedbackPhase: 'before',
    feedbackDate: new Date().toISOString().slice(0, 10),
    bodyRegionCodes: [],
    feelingTags: [],
    intensityScore: 5,
    leftRightDiff: 'none',
    note: '',
  });

  // 保存状态
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 阶段切换
  const setPhase = (phase: FeedbackPhase) => {
    setForm(prev => ({ ...prev, feedbackPhase: phase }));
  };

  // 身体部位切换（多选）
  const toggleRegion = (code: BodyRegionCode) => {
    setForm(prev => {
      const codes = prev.bodyRegionCodes.includes(code)
        ? prev.bodyRegionCodes.filter(c => c !== code)
        : [...prev.bodyRegionCodes, code];
      return { ...prev, bodyRegionCodes: codes };
    });
  };

  // 提交
  const handleSubmit = () => {
    if (form.bodyRegionCodes.length === 0) {
      alert('请至少选择一个身体部位');
      return;
    }
    setSaving(true);
    const record = {
      id: generateId(),
      practiceId: form.practiceId,
      practiceTitle: form.practiceTitle,
      feedbackPhase: form.feedbackPhase,
      feedbackDate: form.feedbackDate,
      bodyRegionCodes: form.bodyRegionCodes,
      feelingTags: form.feelingTags,
      intensityScore: form.intensityScore,
      leftRightDiff: form.leftRightDiff,
      note: form.note,
      createdAt: new Date().toISOString(),
    };
    saveFeedbackRecord(record);
    setSaving(false);
    setSaved(true);
  };

  // 保存成功
  if (saved) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="mb-6">
          <div className="text-5xl mb-4">&#10003;</div>
          <h2 className="text-xl font-medium text-stone-900 mb-2">反馈已保存</h2>
          <p className="text-sm text-stone-500">可以在"我的反馈"中查看记录</p>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/feedback"
            className="block w-full text-center px-6 py-4 bg-stone-900 text-white text-base font-medium rounded-xl"
          >
            查看我的反馈
          </Link>
          <Link
            href="/"
            className="block w-full text-center px-6 py-4 bg-white border border-stone-300 text-stone-800 text-base font-medium rounded-xl"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const practiceSlug = practiceId ? getPracticeById(practiceId)?.slug : undefined;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* 返回链接 */}
      <Link
        href={practiceSlug ? `/practices/${practiceSlug}` : '/practice-search'}
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 mb-6 transition-colors"
      >
        <span>&#8592;</span>
        <span>返回</span>
      </Link>

      <h1 className="text-2xl font-medium text-stone-900 mb-1">做反馈</h1>

      {/* 关联练习 */}
      {form.practiceTitle && (
        <p className="text-sm text-stone-500 mb-6">
          练习：<span className="text-stone-700">{form.practiceTitle}</span>
        </p>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 左侧：人体图（多选） */}
        <div className="lg:w-5/12">
          <div className="bg-white rounded-2xl border border-stone-200 p-4">
            {/* 课前 / 课后切换 */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setPhase('before')}
                className={`flex-1 px-4 py-2 text-sm rounded-xl border transition-colors ${
                  form.feedbackPhase === 'before'
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
                }`}
              >
                课前
              </button>
              <button
                onClick={() => setPhase('after')}
                className={`flex-1 px-4 py-2 text-sm rounded-xl border transition-colors ${
                  form.feedbackPhase === 'after'
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
                }`}
              >
                课后
              </button>
            </div>

            <BodyMap
              selectedCodes={form.bodyRegionCodes as BodyRegionCode[]}
              multiSelect
              onToggle={toggleRegion}
            />

            {/* 选中区域文字 */}
            {form.bodyRegionCodes.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {form.bodyRegionCodes.map(code => {
                  const region = getRegionByCode(code as BodyRegionCode);
                  return region ? (
                    <span key={code} className="inline-block px-2 py-0.5 bg-stone-900 text-white text-xs rounded-full">
                      {region.nameZh}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>

        {/* 右侧：表单内容 */}
        <div className="lg:w-7/12 flex flex-col gap-6">
          {/* 感受标签 */}
          <div>
            <h3 className="text-sm font-medium text-stone-700 mb-3">感受标签（可多选）</h3>
            <FeelingTagSelector
              selected={form.feelingTags}
              onChange={tags => setForm(prev => ({ ...prev, feelingTags: tags }))}
            />
          </div>

          {/* 强度评分 */}
          <div>
            <h3 className="text-sm font-medium text-stone-700 mb-3">
              整体感受强度 <span className="text-stone-400 font-normal ml-1">0-10</span>
            </h3>
            <IntensitySelector
              value={form.intensityScore}
              onChange={score => setForm(prev => ({ ...prev, intensityScore: score }))}
            />
          </div>

          {/* 左右差异 */}
          <div>
            <h3 className="text-sm font-medium text-stone-700 mb-3">左右差异</h3>
            <LeftRightSelector
              value={form.leftRightDiff || 'none'}
              onChange={val => setForm(prev => ({ ...prev, leftRightDiff: val as any }))}
            />
          </div>

          {/* 备注 */}
          <div>
            <h3 className="text-sm font-medium text-stone-700 mb-3">备注（选填）</h3>
            <textarea
              value={form.note}
              onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))}
              placeholder="还有什么想记录的..."
              rows={3}
              className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-500 resize-none"
            />
          </div>

          {/* 保存按钮 */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full py-4 bg-stone-900 text-white text-base font-medium rounded-xl hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? '保存中...' : '保存反馈'}
          </button>
        </div>
      </div>
    </div>
  );
}
