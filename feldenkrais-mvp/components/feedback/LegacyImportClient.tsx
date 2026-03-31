'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { LEGACY_FEEDBACK_STORAGE_KEY } from '@/lib/constants/legacy-feedback';
import { formatMonthDayLabel } from '@/lib/utils/date';
import { parseLegacyFeedbackRecords } from '@/lib/validation/feedback';
import { importLegacyFeedbackSessionsAction } from '@/server/actions/feedback';
import type { LegacyFeedbackRecord } from '@/types/feedback';

type LoadState = 'loading' | 'ready' | 'empty' | 'error' | 'done';

type LegacyImportSnapshot = {
  loadState: LoadState;
  records: LegacyFeedbackRecord[];
  message: string | null;
};

function readLegacyImportSnapshot(): LegacyImportSnapshot {
  if (typeof window === 'undefined') {
    return {
      loadState: 'loading',
      records: [],
      message: null,
    };
  }

  const raw = window.localStorage.getItem(LEGACY_FEEDBACK_STORAGE_KEY);

  if (!raw) {
    return {
      loadState: 'empty',
      records: [],
      message: null,
    };
  }

  try {
    const parsed = parseLegacyFeedbackRecords(JSON.parse(raw) as unknown);

    if (parsed.length === 0) {
      return {
        loadState: 'empty',
        records: [],
        message: '本地没有可导入的旧反馈记录。',
      };
    }

    return {
      loadState: 'ready',
      records: parsed,
      message: null,
    };
  } catch {
    return {
      loadState: 'error',
      records: [],
      message: '旧版本地数据无法解析，请先确认浏览器中的记录是否完整。',
    };
  }
}

export default function LegacyImportClient() {
  const [snapshot, setSnapshot] = useState<LegacyImportSnapshot>({
    loadState: 'loading',
    records: [],
    message: null,
  });
  const [importedCount, setImportedCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setSnapshot(readLegacyImportSnapshot());
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);

  const previewRecords = useMemo(() => snapshot.records.slice(0, 5), [snapshot.records]);

  const clearLegacyData = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(LEGACY_FEEDBACK_STORAGE_KEY);
    }

    setSnapshot({
      loadState: 'empty',
      records: [],
      message: '本地旧反馈记录已清空。',
    });
  };

  const importLegacyData = () => {
    startTransition(() => {
      void (async () => {
        setSnapshot((previous) => ({
          ...previous,
          message: null,
        }));

        const result = await importLegacyFeedbackSessionsAction(snapshot.records);

        if (!result.success) {
          setSnapshot((previous) => ({
            ...previous,
            message: result.error ?? '导入失败，请稍后再试。',
          }));
          return;
        }

        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(LEGACY_FEEDBACK_STORAGE_KEY);
        }

        setImportedCount(result.importedCount);
        setSnapshot({
          loadState: 'done',
          records: [],
          message: `已导入 ${result.importedCount} 条旧反馈记录，并清空本地旧数据。`,
        });
      })();
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-6">
        <Link
          href="/feedback"
          className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 mb-4 transition-colors"
        >
          <span>&#8592;</span>
          <span>返回我的反馈</span>
        </Link>
        <h1 className="text-2xl font-medium text-stone-900 mb-2">导入旧版本地反馈</h1>
        <p className="text-sm text-stone-500">
          这个页面只用于一次性把旧版 `localStorage` 数据迁移到数据库。导入后会自动清空本地旧数据。
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
        {snapshot.loadState === 'loading' && (
          <p className="text-sm text-stone-500">正在检查本地旧反馈记录...</p>
        )}

        {snapshot.loadState === 'empty' && (
          <div className="space-y-3">
            <p className="text-sm text-stone-700">没有检测到可导入的旧反馈记录。</p>
            <p className="text-sm text-stone-400">
              如果你之前已经完成过导入，或者当前浏览器里没有旧数据，这里就会显示为空。
            </p>
          </div>
        )}

        {snapshot.loadState === 'error' && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {snapshot.message}
          </div>
        )}

        {snapshot.loadState === 'ready' && (
          <>
            <div className="space-y-2">
              <p className="text-sm text-stone-700">
                检测到 <span className="font-medium text-stone-900">{snapshot.records.length}</span> 条旧反馈记录。
              </p>
              <p className="text-sm text-stone-500">
                旧版结构里多个身体部位共用一套值，导入后会拆成 session + 多条 body part entry，并把共享值复制到每个部位。
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 overflow-hidden">
              <div className="grid grid-cols-[minmax(0,1.3fr)_7rem_8rem] gap-4 bg-stone-50 px-4 py-3 text-xs font-medium text-stone-500">
                <span>练习 / 部位</span>
                <span>阶段</span>
                <span>日期</span>
              </div>
              <div className="divide-y divide-stone-200">
                {previewRecords.map((record) => (
                  <div
                    key={record.id}
                    className="grid grid-cols-[minmax(0,1.3fr)_7rem_8rem] gap-4 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="text-stone-900">{record.practiceTitle ?? '未关联练习'}</p>
                      <p className="text-xs text-stone-400 mt-1">
                        {record.bodyRegionCodes.length} 个部位
                      </p>
                    </div>
                    <span className="text-stone-500">
                      {record.feedbackPhase === 'before' ? '课前' : '课后'}
                    </span>
                    <span className="text-stone-500">
                      {formatMonthDayLabel(record.feedbackDate)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {snapshot.records.length > previewRecords.length && (
              <p className="text-xs text-stone-400">
                仅预览前 {previewRecords.length} 条，导入时会处理全部 {snapshot.records.length} 条。
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={importLegacyData}
                disabled={isPending}
                className="flex-1 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? '导入中...' : '导入到数据库'}
              </button>
              <button
                type="button"
                onClick={clearLegacyData}
                disabled={isPending}
                className="flex-1 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                清空本地旧数据
              </button>
            </div>
          </>
        )}

        {snapshot.loadState === 'done' && (
          <div className="space-y-3">
            <p className="text-sm text-stone-700">
              已完成导入，成功迁移 <span className="font-medium text-stone-900">{importedCount}</span> 条旧反馈记录。
            </p>
            <p className="text-sm text-stone-400">
              现在可以回到“我的反馈”查看数据库中的反馈会话和各身体部位明细。
            </p>
          </div>
        )}

        {snapshot.message && snapshot.loadState !== 'error' && (
          <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
            {snapshot.message}
          </div>
        )}
      </div>
    </div>
  );
}
