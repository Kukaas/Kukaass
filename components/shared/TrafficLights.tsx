import { cn } from '@/lib/utils';

const LIGHTS = [
  { fill: '#ff5f57', ring: '#e0443e' },
  { fill: '#febc2e', ring: '#dea123' },
  { fill: '#28c840', ring: '#1aac29' },
];

/**
 * macOS window chrome — the close / minimise / zoom "traffic lights". Purely
 * decorative. Shared by the editor title bar and the admin shell + login.
 */
export default function TrafficLights({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)} aria-hidden="true">
      {LIGHTS.map((l) => (
        <span
          key={l.fill}
          className="size-3 rounded-full"
          style={{ backgroundColor: l.fill, boxShadow: `inset 0 0 0 0.5px ${l.ring}` }}
        />
      ))}
    </div>
  );
}
