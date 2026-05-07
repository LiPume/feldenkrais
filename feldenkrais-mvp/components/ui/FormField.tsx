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
          className="block text-sm font-medium text-stone-800"
          htmlFor={htmlFor}
        >
          {label}
        </label>
      )}
      {children}
      {description && !error && (
        <p className="text-xs leading-5 text-stone-500">{description}</p>
      )}
      {error && (
        <p className="text-xs leading-5 text-red-700">{error}</p>
      )}
    </div>
  );
}
