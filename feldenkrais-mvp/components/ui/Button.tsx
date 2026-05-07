import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-stone-900 bg-stone-950 text-stone-50 hover:bg-stone-800',
  secondary: 'border-stone-300 bg-white text-stone-800 hover:border-stone-400 hover:bg-stone-50',
  ghost: 'border-transparent bg-transparent text-stone-650 hover:bg-stone-100 hover:text-stone-950',
  danger: 'border-red-700 bg-red-700 text-white hover:bg-red-800',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-4 text-sm',
  lg: 'min-h-12 px-5 text-base',
};

export default function Button({
  children,
  className,
  disabled,
  loading = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg border font-medium leading-none transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900',
        'disabled:cursor-not-allowed disabled:opacity-55',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 rounded-full border-2 border-current border-r-transparent animate-spin"
        />
      )}
      {children}
    </button>
  );
}
