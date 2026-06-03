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
import { cn } from '@/lib/utils';
import { useEditor } from './EditorContext';
import { THEMES } from './theme';

interface SettingsMenuProps {
  /** Where the dropdown opens relative to the trigger. Defaults to the rail layout. */
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  /** Override the trigger styling (e.g. the compact title-bar variant on mobile). */
  triggerClassName?: string;
  iconClassName?: string;
  /**
   * Render the theme list inline instead of in a nested submenu. Nested submenus
   * fly out sideways and get clipped on narrow screens, so mobile uses the flat
   * layout.
   */
  flatThemes?: boolean;
}

/**
 * The gear at the bottom of the activity rail — the VS Code "Manage" cog.
 * Hosts the color-theme picker, quick actions (command palette), and the
 * keyboard-shortcuts reference. On mobile the rail is hidden, so it also
 * appears in the title bar via the compact trigger props.
 */
export default function SettingsMenu({
  side = 'right',
  align = 'end',
  triggerClassName,
  iconClassName = 'size-5',
  flatThemes = false,
}: SettingsMenuProps = {}) {
  const { theme, setThemeId, setPaletteOpen, setShortcutsOpen } = useEditor();

  const themeItems = THEMES.map((t) => (
    <DropdownMenuItem key={t.id} onSelect={() => setThemeId(t.id)} className="gap-2">
      <span
        className="size-3 rounded-full ring-1 ring-border"
        style={{ background: t.swatch }}
        aria-hidden="true"
      />
      <span className="flex-1">{t.name}</span>
      {theme.id === t.id && <Check className="size-3.5 text-brand" aria-hidden="true" />}
    </DropdownMenuItem>
  ));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Settings"
        title="Settings"
        className={cn(
          'flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none data-[state=open]:bg-accent data-[state=open]:text-foreground',
          triggerClassName,
        )}
      >
        <Settings className={iconClassName} aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        align={align}
        sideOffset={8}
        className="max-h-[min(70vh,28rem)] min-w-56 overflow-y-auto font-mono"
      >
        <DropdownMenuLabel className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {flatThemes ? (
          <>
            <DropdownMenuLabel className="flex items-center gap-2 text-muted-foreground">
              <Palette className="size-4" aria-hidden="true" />
              Color Theme
            </DropdownMenuLabel>
            {themeItems}
            <DropdownMenuSeparator />
          </>
        ) : (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <Palette className="size-4 text-muted-foreground" aria-hidden="true" />
              Color Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="min-w-48 font-mono">{themeItems}</DropdownMenuSubContent>
          </DropdownMenuSub>
        )}

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
