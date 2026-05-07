import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

type EmptyStateProps = {
  action?: ReactNode;
  className?: string;
  description?: ReactNode;
  title: ReactNode;
};

export default function EmptyState({
  action,
  className,
  description,
  title,
}: EmptyStateProps) {
  return (
    <Card className={cn('flex flex-col items-center px-6 py-12 text-center', className)}>
      <div className="mb-4 h-px w-16 bg-stone-200" />
      <h3 className="text-lg font-medium text-stone-950">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}
