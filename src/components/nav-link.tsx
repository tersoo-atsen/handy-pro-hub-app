'use client';

import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import type { AnchorHTMLAttributes, CSSProperties } from 'react';

type NavLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    exact?: boolean;
    activeClassName?: string;
    activeStyle?: CSSProperties;
  };

/** Link that applies primary-color active styling based on the current route. */
export function NavLink({
  href,
  exact = false,
  className = '',
  style,
  activeClassName = '',
  activeStyle,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  const target = typeof href === 'string' ? href : (href.pathname ?? '');
  const isActive = exact
    ? pathname === target
    : pathname === target || pathname.startsWith(`${target}/`);

  return (
    <Link
      href={href}
      className={`${className} ${isActive ? activeClassName : ''}`.trim()}
      style={
        isActive
          ? { ...style, color: 'var(--color-primary)', ...activeStyle }
          : style
      }
      aria-current={isActive ? 'page' : undefined}
      {...props}
    />
  );
}
