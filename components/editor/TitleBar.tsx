'use client';

import { PanelLeft, SquareTerminal, Search, Sparkles } from 'lucide-react';
import { useEditor } from './EditorContext';
import { resolveTab } from './tabs';
import MenuBar from './MenuBar';
import { PROFILE } from './data';

export default function TitleBar() {
  const {
    isMobile,
    activeKey,
    projectTitles,
    setMobileNavOpen,
    toggleTerminal,
    terminalOpen,
    toggleAssistant,
    assistantOpen,
    setPaletteOpen,
  } = useEditor();

  const activeName = activeKey ? resolveTab(activeKey, projectTitles).name : 'kukaass';

  return (
    <header className="flex h-9 shrink-0 select-none items-center justify-between border-b border-border bg-card px-3 text-[12px] text-muted-foreground">
      {/* Left */}
      <div className="flex flex-1 items-center gap-2">
        {isMobile ? (
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open file tree"
            className="-ml-1 rounded-sm p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <PanelLeft className="size-4" aria-hidden="true" />
          </button>
        ) : (
          <>
            <span
              className="ml-0.5 mr-1 size-3.5 rounded-[3px] bg-brand"
              aria-hidden="true"
              title={PROFILE.handle}
            />
            <MenuBar />
          </>
        )}
      </div>

      {/* Center: window title */}
      <div className="flex min-w-0 items-center gap-2 truncate">
        <span className="truncate text-foreground/80">
          {isMobile ? activeName : 'kukaass'}
        </span>
        {!isMobile && (
          <>
            <span className="text-border">/</span>
            <span className="truncate">portfolio</span>
            <span className="ml-2 hidden items-center gap-1 text-muted-foreground/70 sm:inline-flex">
              <span aria-hidden="true">⎇</span> main
            </span>
          </>
        )}
      </div>

      {/* Right */}
      <div className="flex flex-1 items-center justify-end gap-1">
        {isMobile && (
          <button
            type="button"
            onClick={toggleTerminal}
            aria-label="Toggle terminal"
            aria-pressed={terminalOpen}
            className="rounded-sm p-1.5 transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none aria-pressed:text-brand"
          >
            <SquareTerminal className="size-4" aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          onClick={toggleAssistant}
          aria-label="Toggle AI assistant"
          aria-pressed={assistantOpen}
          title="Chat (⌘I)"
          className="rounded-sm p-1.5 transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none aria-pressed:text-brand"
        >
          <Sparkles className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label="Open command palette"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Search className="size-3.5" aria-hidden="true" />
          {!isMobile && (
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          )}
        </button>
      </div>
    </header>
  );
}
