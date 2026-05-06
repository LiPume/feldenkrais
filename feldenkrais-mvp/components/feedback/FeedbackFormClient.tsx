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
    if (!form.activeRegionCode) return null;
    return form.entriesByRegionCode[form.activeRegionCode] ?? createEmptyEntry(form.activeRegionCode);
  }, [form.activeRegionCode, form.entriesByRegionCode]);

  const completedCount = form.selectedRegionCodes.filter((code) => {
    const entry = form.entriesByRegionCode[code];
    return entry?.intensityScore !== null && entry?.intensityScore !== undefined;
  }).length;

  const setPhase = (feedbackPhase: FeedbackPhaseValue) => {
    setError(null);
    setForm((prev) => ({ ...prev, feedbackPhase }));
  };

  const toggleRegion = (bodyRegionCode: BodyRegionCode) => {
    setError(null);
    setForm((prev) => {
      const alreadySelected = prev.selectedRegionCodes.includes(bodyRegionCode);
      if (alreadySelected) {
        const selectedRegionCodes = prev.selectedRegionCodes.filter((c) => c !== bodyRegionCode);
        const entriesByRegionCode = { ...prev.entriesByRegionCode };
        delete entriesByRegionCode[bodyRegionCode];
        return {
          ...prev,
          selectedRegionCodes,
          activeRegionCode: prev.activeRegionCode === bodyRegionCode
            ? selectedRegionCodes[0] ?? null
            : prev.activeRegionCode,
          entriesByRegionCode,
        };
      }
      return {
        ...prev,
        selectedRegionCodes: [...prev.selectedRegionCodes, bodyRegionCode],
        activeRegionCode: prev.activeRegionCode ?? bodyRegionCode,
        entriesByRegionCode: {
          ...prev.entriesByRegionCode,
          [bodyRegionCode]: prev.entriesByRegionCode[bodyRegionCode] ?? createEmptyEntry(bodyRegionCode),
        },
      };
    });
  };

  const updateEntry = (nextEntry: FeedbackBodyPartDraft) => {
    setError(null);
    setForm((prev) => ({
      ...prev,
      entriesByRegionCode: {
        ...prev.entriesByRegionCode,
        [nextEntry.bodyRegionCode]: nextEntry,
      },
    }));
  };

  const handleSubmit = () => {
    if (form.selectedRegionCodes.length === 0) {
      setError('请先至少选择 1 个身体部位。');
      return;
    }
    const missing = form.selectedRegionCodes.filter((code) => {
      const entry = form.entriesByRegionCode[code];
      return entry?.intensityScore === null || entry?.intensityScore === undefined;
    });
    if (missing.length > 0) {
      const names = missing.map((c) => getRegionByCode(c)?.nameZh ?? c).join('、');
      setForm((prev) => ({ ...prev, activeRegionCode: missing[0] }));
      setError(`请先为这些部位填写强度：${names}`);
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
      <div className="feedback-success">
        <div className="feedback-success-card card">
          <div className="feedback-success-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 className="feedback-success-title">反馈已保存</h2>
          <p className="feedback-success-desc">
            每个选中部位都已按独立明细保存。可以在「我的反馈」中查看完整历史轨迹。
          </p>
          <div className="feedback-success-actions">
            <Link href="/feedback" className="btn-primary">查看我的反馈</Link>
            <Link
              href={practiceSlug ? `/practices/${practiceSlug}` : '/practice-search'}
              className="btn-secondary"
            >
              返回练习页
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-form-page">
      <div className="feedback-form-inner">
        {/* Page header */}
        <div className="feedback-form-header animate-fade-in-up">
          <Link
            href={practiceSlug ? `/practices/${practiceSlug}` : '/practice-search'}
            className="feedback-back-link"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回
          </Link>

          <div className="feedback-form-heading">
            <div>
              <p className="section-eyebrow">记录反馈</p>
              <h1 className="feedback-form-title">做反馈</h1>
            </div>
            {form.practiceTitle && (
              <span className="feedback-practice-badge">{form.practiceTitle}</span>
            )}
          </div>

          <p className="feedback-form-hint">
            每个身体部位独立填写强度、标签、左右差异和备注。
          </p>
        </div>

        {/* Main layout */}
        <div className="feedback-form-grid animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          {/* Left: body map */}
          <div className="feedback-map-panel">
            <div className="card feedback-map-card">
              {/* Phase toggle */}
              <div className="feedback-phase-row">
                <div className="feedback-phase-toggle">
                  {FEEDBACK_PHASE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPhase(option.value)}
                      className={`feedback-phase-btn ${form.feedbackPhase === option.value ? 'feedback-phase-btn--active' : ''}`}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
                <span className="feedback-date">{form.feedbackDate}</span>
              </div>

              <BodyMap
                selectedCodes={form.selectedRegionCodes}
                multiSelect
                onToggle={toggleRegion}
              />

              <p className="feedback-map-hint">
                点击身体部位，最多可选多个部位
              </p>
            </div>
          </div>

          {/* Right: editor */}
          <div className="feedback-editor-panel">
            {form.selectedRegionCodes.length === 0 ? (
              <div className="card feedback-empty-editor">
                <div className="feedback-empty-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
                <p className="feedback-empty-title">先选择身体部位</p>
                <p className="feedback-empty-desc">
                  点击左侧人体图，选择你要记录感受的部位。可以一次选多个，然后逐个填写。
                </p>
              </div>
            ) : (
              <>
                {/* Region tabs */}
                <div className="feedback-region-tabs">
                  {form.selectedRegionCodes.map((code) => {
                    const region = getRegionByCode(code);
                    const entry = form.entriesByRegionCode[code];
                    const isActive = form.activeRegionCode === code;
                    const isComplete = entry?.intensityScore !== null && entry?.intensityScore !== undefined;
                    if (!region) return null;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, activeRegionCode: code }))}
                        className={`feedback-region-tab ${isActive ? 'feedback-region-tab--active' : ''} ${isComplete ? 'feedback-region-tab--complete' : ''}`}
                      >
                        <span className="feedback-region-tab-name">{region.nameZh}</span>
                        <span className="feedback-region-tab-status">
                          {isComplete ? entry?.intensityScore : '待填'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {activeEntry && (
                  <FeedbackBodyPartEditor entry={activeEntry} onChange={updateEntry} />
                )}
              </>
            )}

            {/* Submit bar */}
            <div className="feedback-submit-bar card">
              <div className="feedback-submit-info">
                <p className="feedback-submit-count">
                  已完成 <strong>{completedCount}</strong> / {form.selectedRegionCodes.length} 个部位
                </p>
                <p className="feedback-submit-hint">
                  所有部位填写强度后即可保存
                </p>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="btn-primary"
              >
                {isPending ? '保存中...' : '保存反馈'}
              </button>
            </div>

            {error && (
              <div className="form-alert form-alert--error feedback-error">{error}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
