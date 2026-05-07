import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type FormFieldProps = {
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  label?: ReactNode;
};

export default function FormField({
  children,
  className,
  description,
  error,
  htmlFor,
  label,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label
          className="block text-sm font-medium text-[var(--color-text-primary)]"
          htmlFor={htmlFor}
        >
          {label}
        </label>
      )}
      {children}
      {description && !error && (
        <p className="text-xs leading-5 text-[var(--color-text-muted)]">{description}</p>
      )}
      {error && (
        <p className="text-xs leading-5 text-[#793f32]">{error}</p>
      )}
    </div>
  );
}
