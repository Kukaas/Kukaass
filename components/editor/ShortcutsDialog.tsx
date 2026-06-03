'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useEditor } from './EditorContext';

interface Shortcut {
  keys: string[];
  label: string;
}

const SHORTCUTS: Shortcut[] = [
  { keys: ['⌘', 'K'], label: 'Command palette · go to file' },
  { keys: ['⌘', 'I'], label: 'Toggle AI chat' },
  { keys: ['⌃', '`'], label: 'Toggle terminal' },
  { keys: ['⌘', 'B'], label: 'Toggle file explorer' },
  { keys: ['⌘', '/'], label: 'Keyboard shortcuts (this panel)' },
  { keys: ['↑', '↓'], label: 'Cycle command history (in terminal)' },
  { keys: ['Esc'], label: 'Close the open panel or dialog' },
];

function Keycap({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-6 items-center justify-center rounded-md border border-border bg-card px-1.5 py-1 font-mono text-[11px] text-foreground/80 shadow-[0_1px_0_0_var(--border)]">
      {children}
    </kbd>
  );
}

export default function ShortcutsDialog() {
  const { shortcutsOpen, setShortcutsOpen } = useEditor();

  return (
    <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
      <DialogContent className="max-w-md gap-0 border-border bg-popover p-0 font-mono">
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle className="text-[14px] font-medium tracking-tight">Keyboard Shortcuts</DialogTitle>
          <DialogDescription className="text-[12px] text-muted-foreground">
            Drive the whole editor without leaving the keyboard.
          </DialogDescription>
        </DialogHeader>
        <ul className="divide-y divide-border/60 px-2 py-2">
          {SHORTCUTS.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-4 px-3 py-2.5">
              <span className="text-[12.5px] text-foreground/80">{s.label}</span>
              <span className="flex shrink-0 items-center gap-1">
                {s.keys.map((k) => (
                  <Keycap key={k}>{k}</Keycap>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
