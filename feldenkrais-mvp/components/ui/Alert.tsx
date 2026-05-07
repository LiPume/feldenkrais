import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
};

const variantClasses: Record<AlertVariant, string> = {
  info: 'border-sky-200 bg-sky-50 text-sky-950',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-950',
  error: 'border-red-200 bg-red-50 text-red-950',
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
        'rounded-lg border px-4 py-3 text-sm leading-6',
        variantClasses[variant],
        className,
      )}
      role={role ?? (variant === 'error' ? 'alert' : 'status')}
      {...props}
    />
  );
}
