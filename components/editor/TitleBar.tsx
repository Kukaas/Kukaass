'use client';

import { PanelLeft, SquareTerminal, Search } from 'lucide-react';
import { useEditor } from './EditorContext';
import { resolveTab } from './tabs';
import MenuBar from './MenuBar';
import AssistantIcon from './AssistantIcon';
import SettingsMenu from './SettingsMenu';
import { PROFILE } from './data';

/** macOS window chrome — the close / minimise / zoom "traffic lights". Decorative. */
function TrafficLights() {
  const lights = [
    { fill: '#ff5f57', ring: '#e0443e' },
    { fill: '#febc2e', ring: '#dea123' },
    { fill: '#28c840', ring: '#1aac29' },
  ];
  return (
    <div className="flex items-center gap-2 pr-1" aria-hidden="true">
      {lights.map((l) => (
        <span
          key={l.fill}
          className="size-3 rounded-full"
          style={{ backgroundColor: l.fill, boxShadow: `inset 0 0 0 0.5px ${l.ring}` }}
        />
      ))}
    </div>
  );
}

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
            <TrafficLights />
            <MenuBar />
          </>
        )}
      </div>

      {/* Center: VS Code command center on desktop, active file on mobile */}
      {isMobile ? (
        <div className="flex min-w-0 items-center truncate">
          <span className="truncate text-foreground/80">{activeName}</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label="Open command palette"
          className="group flex h-6 min-w-0 max-w-[min(42vw,30rem)] items-center gap-2 rounded-md border border-border/70 bg-background/50 px-3 shadow-sm transition-colors hover:border-border hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Search className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="truncate text-foreground/80">kukaass</span>
          <span className="text-border">/</span>
          <span className="truncate">portfolio</span>
          <kbd className="ml-2 hidden rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>
        </button>
      )}

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
          <AssistantIcon className="size-4" />
        </button>
        {isMobile && (
          <>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
              className="rounded-sm p-1.5 transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Search className="size-4" aria-hidden="true" />
            </button>
            <SettingsMenu
              side="bottom"
              align="end"
              triggerClassName="size-auto rounded-sm p-1.5"
              iconClassName="size-4"
              flatThemes
            />
          </>
        )}
      </div>
    </header>
  );
}
