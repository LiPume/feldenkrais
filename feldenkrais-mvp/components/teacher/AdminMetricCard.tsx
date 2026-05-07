import { Card, CardContent } from '@/components/ui/Card';

type Props = {
  description?: string;
  label: string;
  value: number;
};

export default function AdminMetricCard({ description, label, value }: Props) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm font-medium text-stone-500">{label}</p>
        <p className="mt-3 text-3xl font-medium tracking-normal text-stone-950">
          {value}
        </p>
        {description && (
          <p className="mt-2 text-xs leading-5 text-stone-500">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
