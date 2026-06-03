'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEditor } from './EditorContext';
import { resolveTab } from './tabs';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';

export default function TabBar() {
  const { openKeys, activeKey, projectTitles, selectKey, closeKey, closeOtherKeys, closeKeysToRight, closeAllKeys } =
    useEditor();

  return (
    <div
      role="tablist"
      aria-label="Open files"
      className="editor-scroll flex h-9 shrink-0 select-none items-stretch overflow-x-auto border-b border-border bg-card"
    >
      {openKeys.map((key, index) => {
        const tab = resolveTab(key, projectTitles);
        const active = activeKey === key;
        const isLast = index === openKeys.length - 1;
        const onlyTab = openKeys.length === 1;
        return (
          <ContextMenu key={key}>
            <ContextMenuTrigger asChild>
              <div
                className={cn(
                  'group relative flex shrink-0 items-center gap-2 border-r border-border pl-3 pr-2 text-[12px] transition-colors',
                  active
                    ? 'tab-accent bg-background text-foreground'
                    : 'bg-card text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                )}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectKey(key)}
                  // Middle-click closes the tab, matching VS Code / browsers.
                  onAuxClick={(e) => {
                    if (e.button === 1) {
                      e.preventDefault();
                      closeKey(key);
                    }
                  }}
                  className="flex items-center gap-2 py-1 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <tab.icon
                    className={cn('size-3.5', active ? 'text-brand' : 'text-muted-foreground')}
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap">{tab.name}</span>
                </button>
                <button
                  type="button"
                  onClick={() => closeKey(key)}
                  aria-label={`Close ${tab.name}`}
                  className={cn(
                    'rounded p-0.5 text-muted-foreground transition-all hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
                    active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                  )}
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-52 font-mono">
              <ContextMenuItem onSelect={() => closeKey(key)}>Close</ContextMenuItem>
              <ContextMenuItem disabled={onlyTab} onSelect={() => closeOtherKeys(key)}>
                Close Others
              </ContextMenuItem>
              <ContextMenuItem disabled={isLast} onSelect={() => closeKeysToRight(key)}>
                Close to the Right
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onSelect={closeAllKeys}>Close All</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        );
      })}
    </div>
  );
}
