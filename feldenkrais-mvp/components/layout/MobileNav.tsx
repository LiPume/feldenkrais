'use client';

import Link from 'next/link';
import { useState } from 'react';

type NavItem = {
  href: string;
  label: string;
};

type Props = {
  items: NavItem[];
};

export default function MobileNav({ items }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="mobile-nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? '关闭导航' : '打开导航'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="mobile-nav-overlay" onClick={() => setIsOpen(false)} />
      )}

      <nav className={`mobile-nav-panel ${isOpen ? 'mobile-nav-panel--open' : ''}`}>
        <div className="mobile-nav-inner">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
