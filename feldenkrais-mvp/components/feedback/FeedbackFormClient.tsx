'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import BodyMap from '@/app/components/body-map/BodyMap';
import FeedbackBodyPartEditor from '@/components/feedback/FeedbackBodyPartEditor';
import { createFeedbackSessionAction } from '@/server/actions/feedback';
import { getRegionByCode } from '@/lib/constants/body-regions';
import { FEEDBACK_PHASE_OPTIONS } from '@/lib/constants/feedback-labels';
import { todayDateString } from '@/lib/utils/date';
import type { BodyRegionCode } from '@/types/body-region';
import type {
  CreateFeedbackSessionPayload,
  FeedbackBodyPartDraft,
  FeedbackFormState,
  FeedbackPhaseValue,
} from '@/types/feedback';

type Props = {
  practiceId?: string;
  practiceTitle?: string;
  practiceSlug?: string;
};

function createEmptyEntry(bodyRegionCode: BodyRegionCode): FeedbackBodyPartDraft {
  return {
    bodyRegionCode,
    intensityScore: null,
    labelCodes: [],
    leftRightDiff: 'none',
    note: '',
  };
}

export default function FeedbackFormClient({ practiceId, practiceTitle, practiceSlug }: Props) {
  const [form, setForm] = useState<FeedbackFormState>({
    practiceId,
    practiceTitle,
    practiceSlug,
    feedbackPhase: 'before',
    feedbackDate: todayDateString(),
    selectedRegionCodes: [],
    activeRegionCode: null,
    entriesByRegionCode: {},
  });
  const [error, setError] = useState<string | null>(null);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeEntry = useMemo(() => {
    if (!form.activeRegionCode) {
      return null;
    }

    return (
      form.entriesByRegionCode[form.activeRegionCode] ??
      createEmptyEntry(form.activeRegionCode)
    );
  }, [form.activeRegionCode, form.entriesByRegionCode]);

  const completedCount = form.selectedRegionCodes.filter((code) => {
    const entry = form.entriesByRegionCode[code];
    return entry?.intensityScore !== null && entry?.intensityScore !== undefined;
  }).length;

  const setPhase = (feedbackPhase: FeedbackPhaseValue) => {
    setError(null);
    setForm((previous) => ({
      ...previous,
      feedbackPhase,
    }));
  };

  const toggleRegion = (bodyRegionCode: BodyRegionCode) => {
    setError(null);
    setForm((previous) => {
      const alreadySelected = previous.selectedRegionCodes.includes(bodyRegionCode);

      if (alreadySelected) {
        const selectedRegionCodes = previous.selectedRegionCodes.filter(
          (code) => code !== bodyRegionCode,
        );
        const entriesByRegionCode = { ...previous.entriesByRegionCode };
        delete entriesByRegionCode[bodyRegionCode];

        return {
          ...previous,
          selectedRegionCodes,
          activeRegionCode:
            previous.activeRegionCode === bodyRegionCode
              ? selectedRegionCodes[0] ?? null
              : previous.activeRegionCode,
          entriesByRegionCode,
        };
      }

      return {
        ...previous,
        selectedRegionCodes: [...previous.selectedRegionCodes, bodyRegionCode],
        activeRegionCode: previous.activeRegionCode ?? bodyRegionCode,
        entriesByRegionCode: {
          ...previous.entriesByRegionCode,
          [bodyRegionCode]:
            previous.entriesByRegionCode[bodyRegionCode] ?? createEmptyEntry(bodyRegionCode),
        },
      };
    });
  };

  const updateEntry = (nextEntry: FeedbackBodyPartDraft) => {
    setError(null);
    setForm((previous) => ({
      ...previous,
      entriesByRegionCode: {
        ...previous.entriesByRegionCode,
        [nextEntry.bodyRegionCode]: nextEntry,
      },
    }));
  };

  const handleSubmit = () => {
    if (form.selectedRegionCodes.length === 0) {
      setError('请先至少选择 1 个身体部位。');
      return;
    }

    const missingIntensityRegionCodes = form.selectedRegionCodes.filter((code) => {
      const entry = form.entriesByRegionCode[code];
      return entry?.intensityScore === null || entry?.intensityScore === undefined;
    });

    if (missingIntensityRegionCodes.length > 0) {
      const firstRegionCode = missingIntensityRegionCodes[0];
      const regionNames = missingIntensityRegionCodes
        .map((code) => getRegionByCode(code)?.nameZh ?? code)
        .join('、');

      setForm((previous) => ({
        ...previous,
        activeRegionCode: firstRegionCode,
      }));
      setError(`请先为这些部位填写强度：${regionNames}`);
      return;
    }

    const payload: CreateFeedbackSessionPayload = {
      practiceId: form.practiceId,
      practiceTitleSnapshot: form.practiceTitle,
      feedbackPhase: form.feedbackPhase,
      feedbackDate: form.feedbackDate,
      entries: form.selectedRegionCodes.map((bodyRegionCode, sortOrder) => {
        const entry = form.entriesByRegionCode[bodyRegionCode]!;

        return {
          bodyRegionCode,
          sortOrder,
          intensityScore: entry.intensityScore!,
          labelCodes: entry.labelCodes,
          leftRightDiff: entry.leftRightDiff,
          note: entry.note.trim() || undefined,
        };
      }),
    };

    startTransition(() => {
      void (async () => {
        setError(null);
        const result = await createFeedbackSessionAction(payload);

        if (!result.success) {
          setError(result.error ?? '保存失败，请稍后再试。');
          return;
        }

        setSavedSessionId(result.sessionId ?? 'saved');
      })();
    });
  };

  if (savedSessionId) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="mb-6">
          <div className="text-5xl mb-4">&#10003;</div>
          <h2 className="text-xl font-medium text-stone-900 mb-2">反馈已保存到数据库</h2>
          <p className="text-sm text-stone-500">
            每个选中部位都已经按独立明细保存，可以到“我的反馈”查看。
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/feedback"
            className="block w-full text-center px-6 py-4 bg-stone-900 text-white text-base font-medium rounded-xl"
          >
            查看我的反馈
          </Link>
          <Link
            href={practiceSlug ? `/practices/${practiceSlug}` : '/practice-search'}
            className="block w-full text-center px-6 py-4 bg-white border border-stone-300 text-stone-800 text-base font-medium rounded-xl"
          >
            返回上一页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <Link
        href={practiceSlug ? `/practices/${practiceSlug}` : '/practice-search'}
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 mb-6 transition-colors"
      >
        <span>&#8592;</span>
        <span>返回</span>
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-medium text-stone-900 mb-1">做反馈</h1>
        <p className="text-sm text-stone-500">
          现在每个身体部位都会分别记录强度、标签、左右差异和备注。
        </p>
        {form.practiceTitle && (
          <p className="text-sm text-stone-500 mt-2">
            练习：<span className="text-stone-700">{form.practiceTitle}</span>
          </p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex gap-2">
              {FEEDBACK_PHASE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPhase(option.value)}
                  className={`px-4 py-2 text-sm rounded-xl border transition-colors ${
                    form.feedbackPhase === option.value
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
            <span className="text-xs text-stone-400">记录日期：{form.feedbackDate}</span>
          </div>

          <BodyMap selectedCodes={form.selectedRegionCodes} multiSelect onToggle={toggleRegion} />

          <div className="mt-4 rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-sm text-stone-500">
            左侧可以多选身体部位。选中多个部位后，请在右侧逐个填写每个部位的独立反馈。
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {form.selectedRegionCodes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-8 text-center">
              <p className="text-stone-700 text-base mb-2">先在左侧选择身体部位</p>
              <p className="text-sm text-stone-400">
                你可以一次选择多个部位，然后在这里逐个填写它们的强度、标签、左右差异和备注。
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-stone-200 p-4">
                <div className="flex flex-wrap gap-2">
                  {form.selectedRegionCodes.map((code) => {
                    const region = getRegionByCode(code);
                    const entry = form.entriesByRegionCode[code];
                    const isActive = form.activeRegionCode === code;
                    const isComplete =
                      entry?.intensityScore !== null && entry?.intensityScore !== undefined;

                    if (!region) {
                      return null;
                    }

                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() =>
                          setForm((previous) => ({
                            ...previous,
                            activeRegionCode: code,
                          }))
                        }
                        className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                          isActive
                            ? 'border-stone-900 bg-stone-900 text-white'
                            : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        <div className="text-sm font-medium">{region.nameZh}</div>
                        <div
                          className={`text-xs mt-1 ${
                            isActive ? 'text-stone-200' : 'text-stone-400'
                          }`}
                        >
                          {isComplete ? `强度 ${entry?.intensityScore}` : '待填写强度'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeEntry && (
                <FeedbackBodyPartEditor entry={activeEntry} onChange={updateEntry} />
              )}
            </>
          )}

          <div className="bg-white rounded-2xl border border-stone-200 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-stone-800">
                  已完成 {completedCount} / {form.selectedRegionCodes.length} 个部位
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  每个选中的部位都会生成一条独立明细。
                </p>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="px-6 py-3 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? '保存中...' : '保存反馈'}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
