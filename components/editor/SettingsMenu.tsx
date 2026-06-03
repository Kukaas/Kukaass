'use client';

import { Settings, Palette, Command as CommandIcon, Keyboard, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import { useEditor } from './EditorContext';
import { THEMES } from './theme';

/**
 * The gear at the bottom of the activity rail — the VS Code "Manage" cog.
 * Hosts the color-theme picker, quick actions (command palette), and the
 * keyboard-shortcuts reference.
 */
export default function SettingsMenu() {
  const { theme, setThemeId, setPaletteOpen, setShortcutsOpen } = useEditor();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Settings"
        title="Settings"
        className="flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none data-[state=open]:bg-accent data-[state=open]:text-foreground"
      >
        <Settings className="size-5" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" sideOffset={8} className="min-w-56 font-mono">
        <DropdownMenuLabel className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2">
            <Palette className="size-4 text-muted-foreground" aria-hidden="true" />
            Color Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="min-w-48 font-mono">
            {THEMES.map((t) => (
              <DropdownMenuItem key={t.id} onSelect={() => setThemeId(t.id)} className="gap-2">
                <span
                  className="size-3 rounded-full ring-1 ring-border"
                  style={{ background: t.swatch }}
                  aria-hidden="true"
                />
                <span className="flex-1">{t.name}</span>
                {theme.id === t.id && <Check className="size-3.5 text-brand" aria-hidden="true" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem onSelect={() => setPaletteOpen(true)} className="gap-2">
          <CommandIcon className="size-4 text-muted-foreground" aria-hidden="true" />
          Quick Actions
          <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setShortcutsOpen(true)} className="gap-2">
          <Keyboard className="size-4 text-muted-foreground" aria-hidden="true" />
          Keyboard Shortcuts
          <DropdownMenuShortcut>⌘/</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
