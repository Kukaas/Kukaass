'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={reduce ? false : { y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className={cn(
        'fixed top-3 sm:top-6 left-1/2 -translate-x-1/2 z-50 transition-shadow duration-500',
        'rounded-xl sm:rounded-2xl border border-border bg-card',
        // 1px top highlight (hairline-inset) suggests a physical edge without a drop shadow.
        'shadow-[inset_0_1px_0_0_oklch(1_0_0/0.06)]',
        'w-[95%] sm:w-[90%] max-w-4xl mx-auto overflow-hidden',
        isScrolled && 'shadow-[inset_0_1px_0_0_oklch(1_0_0/0.06),0_16px_48px_-12px_rgba(0,0,0,0.55)]'
      )}
    >
      <div className="px-6 sm:px-8 lg:px-12 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <a
            href="#home"
            className="text-lg sm:text-xl font-bold text-foreground tracking-tight rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            Chester Luke
          </a>

          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href="https://www.linkedin.com/in/chester-luke-maligaso-812732359"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="text-foreground/70 hover:text-foreground p-2 sm:p-2.5 rounded-lg transition-colors duration-300 hover:bg-accent outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>

            <a
              href="https://github.com/Kukaas"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-foreground/70 hover:text-foreground p-2 sm:p-2.5 rounded-lg transition-colors duration-300 hover:bg-accent outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
