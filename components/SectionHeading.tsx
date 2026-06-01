'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

/**
 * Centered section heading for the landing page. Replaces the old blue->cyan
 * gradient divider with a single short Filament Amber annotation rule.
 * See DESIGN.md "The One Voice Rule".
 *
 * The content is visible by default; motion only adds a rise-in when the user
 * has not requested reduced motion, so the section never ships blank if the
 * reveal does not fire.
 */
export default function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      viewport={{ once: true, margin: '-80px' }}
      className={cn('text-center', className)}
    >
      <h2
        className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        style={{ textWrap: 'balance' }}
      >
        {title}
      </h2>
      <div className="mx-auto mt-5 h-[3px] w-12 rounded-full bg-brand sm:w-16" aria-hidden="true" />
      {subtitle && (
        <p
          className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base"
          style={{ textWrap: 'pretty' }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
