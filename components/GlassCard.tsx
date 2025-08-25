import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassCard({ children, className, onClick }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl",
        "shadow-2xl transition-all duration-300",
        className
      )}
      onClick={onClick}
    >
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
}
