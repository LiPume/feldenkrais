import type { FeedbackRecord } from './feedback-types';

const STORAGE_KEY = 'feldenkrais_feedback_records';

// 从 localStorage 读取所有反馈记录
export function getFeedbackRecords(): FeedbackRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// 保存一条新反馈到 localStorage
export function saveFeedbackRecord(record: FeedbackRecord): void {
  if (typeof window === 'undefined') return;
  const existing = getFeedbackRecords();
  existing.unshift(record); // 最新在前面
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

// 生成唯一 ID（简单时间戳 + 随机数）
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
