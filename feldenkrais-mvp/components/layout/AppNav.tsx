'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

export type AppNavItem = {
  href: string;
  label: string;
};

type AppNavProps = {
  items: AppNavItem[];
};

export default function AppNav({ items }: AppNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsOpen(false);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  return (
    <div className="relative">
      <nav aria-label="主导航" className="hidden items-center gap-1 md:flex">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900',
                active
                  ? 'bg-stone-950 text-stone-50'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950',
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className={cn(
          'inline-flex size-10 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-700 shadow-sm md:hidden',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900',
        )}
        aria-label={isOpen ? '关闭导航' : '打开导航'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        {isOpen ? (
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-40 w-56 rounded-xl border border-stone-200 bg-white p-2 shadow-xl md:hidden">
          <nav aria-label="移动端主导航" className="flex flex-col">
            {items.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900',
                    active
                      ? 'bg-stone-950 text-stone-50'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950',
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
