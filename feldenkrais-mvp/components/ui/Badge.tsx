import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type BadgeVariant = 'neutral' | 'warm' | 'success' | 'muted';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'border-[var(--color-border-soft)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]',
  warm: 'border-[#dcc497] bg-[var(--color-accent-light)] text-[#6f4d1f]',
  success: 'border-[#c9d4bb] bg-[var(--color-sage-light)] text-[#566348]',
  muted: 'border-[var(--color-border-soft)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]',
};

export default function Badge({
  className,
  variant = 'neutral',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium leading-none tracking-normal',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
