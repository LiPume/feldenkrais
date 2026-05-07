import { Card, CardContent } from '@/components/ui/Card';

type Props = {
  description?: string;
  label: string;
  value: number;
  tone?: 'neutral' | 'warm' | 'success' | 'muted';
};

const toneClasses = {
  neutral: 'border-stone-200 bg-white',
  warm: 'border-amber-200 bg-amber-50/70',
  success: 'border-emerald-200 bg-emerald-50/70',
  muted: 'border-stone-200 bg-stone-50',
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
        <p className="text-sm font-medium text-stone-500">{label}</p>
        <p className="mt-3 text-4xl font-medium tracking-normal text-stone-950">
          {value}
        </p>
        {description && (
          <p className="mt-2 text-xs leading-5 text-stone-500">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
