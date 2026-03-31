import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRegionByCode } from '../../lib/body-region-constants';
import { getPublishedPracticeBySlug, getPublishedPractices } from '@/server/queries/practices';

// 辅助函数：将秒数格式化为 mm:ss
function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const practices = await getPublishedPractices();
  return practices.map((practice) => ({ slug: practice.slug }));
}

export default async function PracticeDetailPage({ params }: Props) {
  const { slug } = await params;
  const practice = await getPublishedPracticeBySlug(slug);

  if (!practice) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* 返回链接 */}
      <Link
        href="/practice-search"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 mb-6 transition-colors"
      >
        <span>←</span>
        <span>返回找练习</span>
      </Link>

      {/* 标题区 */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-stone-900 mb-2">
          {practice.title}
        </h1>
        {practice.courseName && (
          <p className="text-sm text-stone-400">{practice.courseName}</p>
        )}
      </div>

      {/* 身体部位标签 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {practice.bodyRegionCodes.map(code => {
          const region = getRegionByCode(code);
          return region ? (
            <span
              key={code}
              className="inline-block px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full"
            >
              {region.nameZh}
            </span>
          ) : null;
        })}
      </div>

      {/* 音频播放器 */}
      {practice.audioUrl && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-stone-500">引导音频</span>
            {practice.durationSec && (
              <span className="text-xs text-stone-400">
                {formatDuration(practice.durationSec)}
              </span>
            )}
          </div>
          <audio
            controls
            src={practice.audioUrl}
            className="w-full h-10"
          />
        </div>
      )}

      {/* 简介 */}
      {practice.summary && (
        <div className="mb-6 p-4 bg-stone-50 rounded-xl text-sm text-stone-600 leading-relaxed">
          {practice.summary}
        </div>
      )}

      {/* 详细文字说明 */}
      {practice.contentText && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-stone-700 mb-3">练习步骤</h2>
          <div className="space-y-2">
            {practice.contentText.split('\n').map((line, i) => (
              <p key={i} className="text-sm text-stone-600 leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 做反馈按钮 */}
      <div className="mt-10 pt-6 border-t border-stone-200">
        <Link
          href={`/feedback/new?practiceId=${practice.id}`}
          className="block w-full text-center px-6 py-4 bg-stone-900 text-white text-base font-medium rounded-xl hover:bg-stone-700 transition-colors"
        >
          做这个练习的反馈
        </Link>
      </div>
    </div>
  );
}
