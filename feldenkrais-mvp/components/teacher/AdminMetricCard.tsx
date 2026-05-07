import { Card, CardContent } from '@/components/ui/Card';

type Props = {
  description?: string;
  label: string;
  value: number;
  tone?: 'neutral' | 'warm' | 'success' | 'muted';
};

const toneClasses = {
  neutral: 'border-[var(--color-border-soft)] bg-[var(--color-surface)]',
  warm: 'border-[#dcc497] bg-[linear-gradient(145deg,#fffdfa,#f1e3c8)]',
  success: 'border-[#c9d4bb] bg-[linear-gradient(145deg,#fffdfa,#e7eddf)]',
  muted: 'border-[var(--color-border-soft)] bg-[var(--color-surface-muted)]',
};

export default function AdminMetricCard({
  description,
  label,
  tone = 'neutral',
  value,
}: Props) {
  return (
    <Card className={toneClasses[tone]}>
      <CardContent className="p-5">
        <p className="text-sm font-medium text-[var(--color-text-muted)]">{label}</p>
        <p className="mt-3 text-4xl font-semibold tracking-normal text-[var(--color-text-primary)] tabular-nums">
          {value}
        </p>
        {description && (
          <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
