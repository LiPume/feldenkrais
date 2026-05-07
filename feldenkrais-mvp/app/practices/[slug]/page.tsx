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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/practice-search"
        className="w-fit text-sm font-medium text-stone-500 transition-colors hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
      >
        返回找练习
      </Link>

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_1px_2px_rgba(28,25,23,0.04),0_18px_50px_rgba(28,25,23,0.06)] sm:p-8">
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

        <h1 className="mt-5 text-3xl font-medium leading-tight tracking-normal text-stone-950 sm:text-5xl">
          {practice.title}
        </h1>

        {practice.summary && (
          <p className="mt-5 max-w-3xl text-base leading-8 text-stone-600">
            {practice.summary}
          </p>
        )}
      </section>

      <AudioPanel
        title={practice.title}
        description={practice.summary}
        audioUrl={practice.audioUrl}
        durationSec={practice.durationSec}
      />

      {steps && steps.length > 0 && (
        <Card>
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-xl font-medium tracking-normal text-stone-950">练习步骤</h2>
            <div className="mt-5 space-y-4">
              {steps.map((line, index) => (
                <div key={`${index}-${line}`} className="flex gap-4">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-medium text-stone-600">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-stone-700 sm:text-base">{line}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="sticky bottom-4 z-20 rounded-2xl border border-stone-200 bg-[rgba(250,247,242,0.92)] p-3 shadow-xl backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
        <Link
          href={`/feedback/new?practiceId=${practice.id}`}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-stone-950 bg-stone-950 px-5 text-base font-medium text-stone-50 transition-colors hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
        >
          做这个练习的反馈
        </Link>
      </div>
    </div>
  );
}
