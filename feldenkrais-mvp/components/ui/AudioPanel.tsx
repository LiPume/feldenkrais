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
    <Card className="overflow-hidden border-[#b79d73] bg-[#3a3027] text-[#fff8ea] shadow-[0_20px_52px_rgba(61,48,35,0.18)]">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#d9c8aa]">
              练习音频
            </p>
            <CardTitle className="font-[var(--font-display)] text-2xl font-medium text-[#fff8ea]">{title}</CardTitle>
          </div>
          {durationSec ? (
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-[#f1dfbd]">
              {formatDuration(durationSec)}
            </span>
          ) : null}
        </div>
        {description && (
          <p className="pt-2 text-sm leading-7 text-[#e5d7bd]">{description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-5">
        {audioUrl ? (
          <audio controls src={audioUrl} className="w-full accent-[#d1a15f]" />
        ) : (
          <Alert variant="warning" className="border-white/15 bg-white/10 text-[#fff8ea]">
            这个练习暂时没有音频文件，可以先阅读文字步骤。
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
