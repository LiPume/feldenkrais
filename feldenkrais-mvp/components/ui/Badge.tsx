import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type BadgeVariant = 'neutral' | 'warm' | 'success' | 'muted';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'border-stone-200 bg-white text-stone-700',
  warm: 'border-amber-200 bg-amber-50 text-amber-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  muted: 'border-stone-200 bg-stone-100 text-stone-500',
};

export default function Badge({
  className,
  variant = 'neutral',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium leading-none',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
