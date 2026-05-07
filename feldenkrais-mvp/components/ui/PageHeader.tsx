import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type PageHeaderProps = {
  action?: ReactNode;
  className?: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
};

export default function PageHeader({
  action,
  className,
  description,
  eyebrow,
  title,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-5 border-b border-stone-200 pb-6 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-medium tracking-normal text-stone-950 sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
    </header>
  );
}
