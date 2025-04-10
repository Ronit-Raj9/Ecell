import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Define nav links
export const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Events",
    href: "/events",
  },
  {
    name: "Gallery",
    href: "/gallery",
  },
  {
    name: "Team",
    href: "/team",
  },
  {
    name: "Resources",
    href: "/resources",
  },
];

interface NavLinksProps {
  className?: string;
  linkClassName?: string;
  activeLinkClassName?: string;
  onLinkClick?: () => void;
}

export default function NavLinks({
  className,
  linkClassName,
  activeLinkClassName,
  onLinkClick
}: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className={className}>
      <ul className="flex flex-col md:flex-row gap-1 md:gap-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || 
            (pathname?.startsWith(link.href) && link.href !== '/');
          
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onLinkClick}
                className={cn(
                  'block px-3 py-2 rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary',
                  linkClassName,
                  isActive && 'bg-primary/10 text-primary dark:text-primary font-medium',
                  isActive && activeLinkClassName
                )}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
} 