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
      <div className="mb-5 h-px w-16 bg-[var(--color-border-strong)]" />
      <h3 className="font-[var(--font-display)] text-xl font-medium text-[var(--color-text-primary)]">{title}</h3>
      {description && (
        <p className="mt-3 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}
