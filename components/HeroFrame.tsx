import { cn } from '@/lib/utils';

// L-shaped crop marks, one per corner. Each path is two 22px arms (length 44),
// matching --draft-len in globals.css. Drawn in sequence, top-left first.
const CORNERS = [
  { d: 'M1 23 L1 1 L23 1', pos: '-top-2 -left-2 sm:-top-3 sm:-left-3', delay: '0.45s' },
  { d: 'M1 1 L23 1 L23 23', pos: '-top-2 -right-2 sm:-top-3 sm:-right-3', delay: '0.6s' },
  { d: 'M1 1 L1 23 L23 23', pos: '-bottom-2 -left-2 sm:-bottom-3 sm:-left-3', delay: '0.75s' },
  { d: 'M23 1 L23 23 L1 23', pos: '-bottom-2 -right-2 sm:-bottom-3 sm:-right-3', delay: '0.9s' },
];

/**
 * Decorative registration marks that bracket the hero content, evoking crop
 * marks on a spec sheet. Purely decorative (aria-hidden, pointer-events-none).
 */
export default function HeroFrame() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {CORNERS.map((corner) => (
        <svg
          key={corner.d}
          viewBox="0 0 24 24"
          fill="none"
          className={cn('absolute size-4 sm:size-6 text-brand/70', corner.pos)}
        >
          <path
            d={corner.d}
            className="draft-mark"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="square"
            style={{ ['--draft-delay']: corner.delay } as React.CSSProperties}
          />
        </svg>
      ))}
    </div>
  );
}
