import Alert from '@/components/ui/Alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type AudioPanelProps = {
  audioUrl?: string | null;
  description?: string | null;
  durationSec?: number | null;
  title: string;
};

function formatDuration(sec: number): string {
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function AudioPanel({
  audioUrl,
  description,
  durationSec,
  title,
}: AudioPanelProps) {
  return (
    <Card className="overflow-hidden bg-stone-950 text-stone-50">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-stone-300">
              练习音频
            </p>
            <CardTitle className="text-stone-50">{title}</CardTitle>
          </div>
          {durationSec ? (
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-stone-200">
              {formatDuration(durationSec)}
            </span>
          ) : null}
        </div>
        {description && (
          <p className="pt-2 text-sm leading-6 text-stone-300">{description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-5">
        {audioUrl ? (
          <audio controls src={audioUrl} className="w-full" />
        ) : (
          <Alert variant="warning" className="border-white/15 bg-white/10 text-stone-100">
            这个练习暂时没有音频文件，可以先阅读文字步骤。
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
