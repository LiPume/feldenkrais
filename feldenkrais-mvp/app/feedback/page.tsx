'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFeedbackRecords } from '../lib/feedback-storage';
import { getRegionByCode } from '../lib/body-region-constants';
import type { FeedbackRecord } from '../lib/feedback-types';

const tagNameMap: Record<string, string> = {
  tight: '紧', relaxed: '松', sore: '酸', warm: '热', numb: '麻',
  clear: '清晰', blurry: '模糊', light: '轻', heavy: '沉',
  connected: '有连接感', expanded: '舒展', stable: '稳定',
};

const phaseLabel: Record<string, string> = {
  before: '课前',
  after: '课后',
};

const diffLabel: Record<string, string> = {
  none: '无差异',
  left_more: '左侧更明显',
  right_more: '右侧更明显',
  unclear: '不确定',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

// 单条反馈卡片
function FeedbackCard({ record }: { record: FeedbackRecord }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4">
      {/* 头部：练习名 + 阶段 + 日期 */}
      <div className="flex items-center justify-between mb-3">
        <div>
          {record.practiceTitle ? (
            <span className="text-sm font-medium text-stone-800">{record.practiceTitle}</span>
          ) : (
            <span className="text-sm text-stone-400">无关联练习</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
            record.feedbackPhase === 'before'
              ? 'bg-stone-100 text-stone-600'
              : 'bg-stone-800 text-white'
          }`}>
            {phaseLabel[record.feedbackPhase]}
          </span>
          <span className="text-xs text-stone-400">{formatDate(record.feedbackDate)}</span>
        </div>
      </div>

      {/* 身体部位 */}
      <div className="flex flex-wrap gap-1 mb-2">
        {record.bodyRegionCodes.map(code => {
          const region = getRegionByCode(code);
          return region ? (
            <span key={code} className="inline-block px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full">
              {region.nameZh}
            </span>
          ) : null;
        })}
      </div>

      {/* 标签 + 强度 */}
      <div className="flex items-center gap-3 text-xs text-stone-500">
        {record.feelingTags.length > 0 && (
          <span>{record.feelingTags.map(t => tagNameMap[t] || t).join('、')}</span>
        )}
        <span>强度 {record.intensityScore}/10</span>
        {record.leftRightDiff && record.leftRightDiff !== 'none' && (
          <span>{diffLabel[record.leftRightDiff]}</span>
        )}
      </div>

      {/* 备注 */}
      {record.note && (
        <p className="mt-2 text-xs text-stone-400 leading-relaxed line-clamp-2">
          {record.note}
        </p>
      )}
    </div>
  );
}

export default function FeedbackListPage() {
  const [records, setRecords] = useState<FeedbackRecord[]>([]);

  useEffect(() => {
    setRecords(getFeedbackRecords());
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium text-stone-900">我的反馈</h1>
        <Link
          href="/feedback/new"
          className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
        >
          + 新建
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <p className="text-stone-400 text-sm mb-4">暂无反馈记录</p>
          <Link
            href="/feedback/new"
            className="inline-block px-6 py-3 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-700 transition-colors"
          >
            开始记录第一条
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {records.map(record => (
            <FeedbackCard key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
}
