import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
};

const variantClasses: Record<AlertVariant, string> = {
  info: 'border-[var(--color-border-soft)] bg-[var(--color-surface-warm)] text-[var(--color-text-primary)]',
  success: 'border-[#c9d4bb] bg-[var(--color-sage-light)] text-[#48543c]',
  warning: 'border-[#dcc497] bg-[var(--color-accent-light)] text-[#62471f]',
  error: 'border-[#e1b8aa] bg-[var(--color-clay-light)] text-[#793f32]',
};

export default function Alert({
  className,
  role,
  variant = 'info',
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(
        'rounded-xl border px-4 py-3 text-sm leading-6 shadow-[0_1px_0_rgba(61,48,35,0.04)]',
        variantClasses[variant],
        className,
      )}
      role={role ?? (variant === 'error' ? 'alert' : 'status')}
      {...props}
    />
  );
}
