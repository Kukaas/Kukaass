import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Flat "Spec Sheet" surface: a solid Slate Panel separated by a 1px hairline
 * border, no backdrop blur and no resting shadow. See DESIGN.md,
 * "The Flat Drafting-Table Rule" and "The No-Frost Rule".
 */
export default function GlassCard({ children, className, onClick }: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground',
        'transition-colors duration-300',
        className
      )}
      onClick={onClick}
    >
      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
}
