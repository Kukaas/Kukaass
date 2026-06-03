'use client';

import { Files, Search, SquareTerminal, FileDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEditor } from './EditorContext';
import AssistantIcon from './AssistantIcon';
import SettingsMenu from './SettingsMenu';

interface RailButtonProps {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function RailButton({ label, active, onClick, children }: RailButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cn(
        'flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors',
        'hover:bg-accent hover:text-foreground',
        'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
        active && 'bg-accent text-brand',
      )}
    >
      {children}
    </button>
  );
}

export default function ActivityBar() {
  const {
    explorerOpen,
    toggleExplorer,
    setPaletteOpen,
    terminalOpen,
    toggleTerminal,
    assistantOpen,
    toggleAssistant,
    downloadResume,
    resumeLoading,
  } = useEditor();

  return (
    <nav
      aria-label="Editor actions"
      className="flex w-12 shrink-0 select-none flex-col items-center gap-1 border-r border-border bg-card py-2"
    >
      <RailButton label="Toggle explorer" active={explorerOpen} onClick={toggleExplorer}>
        <Files className="size-5" aria-hidden="true" />
      </RailButton>
      <RailButton label="Command palette" onClick={() => setPaletteOpen(true)}>
        <Search className="size-5" aria-hidden="true" />
      </RailButton>
      <RailButton label="Toggle terminal" active={terminalOpen} onClick={toggleTerminal}>
        <SquareTerminal className="size-5" aria-hidden="true" />
      </RailButton>
      <RailButton label="AI assistant" active={assistantOpen} onClick={toggleAssistant}>
        <AssistantIcon className="size-5" />
      </RailButton>
      <RailButton label="Download résumé" onClick={downloadResume}>
        {resumeLoading ? (
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <FileDown className="size-5" aria-hidden="true" />
        )}
      </RailButton>

      <div className="flex-1" />

      <SettingsMenu />
    </nav>
  );
}
