import Link from 'next/link';
import { notFound } from 'next/navigation';
import AudioPanel from '@/components/ui/AudioPanel';
import Badge from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { getRegionByCode } from '@/lib/constants/body-regions';
import { getPublishedPracticeBySlug } from '@/server/queries/practices';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PracticeDetailPage({ params }: Props) {
  const { slug } = await params;
  const practice = await getPublishedPracticeBySlug(slug);

  if (!practice) {
    notFound();
  }

  const steps = practice.contentText
    ?.split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-7 px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/practice-search"
        className="w-fit text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
      >
        返回找练习
      </Link>

      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border-soft)] bg-[linear-gradient(145deg,var(--color-surface),#f5ecdd)] p-6 shadow-[var(--shadow-card)] sm:p-8">
        <div className="flex flex-wrap gap-2">
          {practice.courseName && <Badge variant="warm">{practice.courseName}</Badge>}
          {practice.bodyRegionCodes.map((code) => {
            const region = getRegionByCode(code);
            return region ? (
              <Badge key={code} variant="neutral">
                {region.nameZh}
              </Badge>
            ) : null;
          })}
        </div>

        <h1 className="mt-6 font-[var(--font-display)] text-3xl font-medium leading-tight tracking-normal text-[var(--color-text-primary)] sm:text-5xl">
          {practice.title}
        </h1>

        {practice.summary && (
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-text-secondary)]">
            {practice.summary}
          </p>
        )}
      </section>

      <AudioPanel
        title="音频引导"
        description={practice.summary}
        audioUrl={practice.audioUrl}
        durationSec={practice.durationSec}
      />

      {steps && steps.length > 0 && (
        <Card>
          <CardContent className="p-6 sm:p-8">
            <h2 className="font-[var(--font-display)] text-2xl font-medium tracking-normal text-[var(--color-text-primary)]">练习步骤</h2>
            <div className="mt-5 space-y-4">
              {steps.map((line, index) => (
                <div key={`${index}-${line}`} className="flex gap-4">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-light)] text-sm font-medium text-[#6f4d1f]">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-8 text-[var(--color-text-secondary)] sm:text-base">{line}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="sticky bottom-4 z-20 rounded-2xl border border-[var(--color-border-soft)] bg-[rgba(251,247,239,0.9)] p-3 shadow-[var(--shadow-soft)] backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
        <Link
          href={`/feedback/new?practiceId=${practice.id}`}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[var(--color-btn-primary)] bg-[var(--color-btn-primary)] px-5 text-base font-medium text-[var(--color-text-inverse)] shadow-[0_8px_20px_rgba(61,48,35,0.16)] transition-colors hover:bg-[var(--color-btn-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          做这个练习的反馈
        </Link>
      </div>
    </div>
  );
}
