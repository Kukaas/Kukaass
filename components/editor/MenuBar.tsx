'use client';

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarSeparator,
  MenubarShortcut,
} from '@/components/ui/menubar';
import { useEditor } from './EditorContext';
import { FILES } from './files';
import { PROFILE, SOCIALS } from './data';

/**
 * The VS Code-style menu strip (File · Edit · View · Go · Run · Terminal ·
 * Help · Copilot). Items map onto the editor's real actions where it makes
 * sense; the menu is the discoverable home for everything the rails and
 * shortcuts also expose.
 */
export default function MenuBar() {
  const {
    explorerOpen,
    toggleExplorer,
    terminalOpen,
    toggleTerminal,
    assistantOpen,
    toggleAssistant,
    setPaletteOpen,
    openFile,
    downloadResume,
  } = useEditor();

  const openExternal = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');
  const copyEmail = () => void navigator.clipboard?.writeText(PROFILE.email).catch(() => {});
  const ensureAssistant = () => {
    if (!assistantOpen) toggleAssistant();
  };
  const ensureTerminal = () => {
    if (!terminalOpen) toggleTerminal();
  };

  return (
    <Menubar className="h-7 gap-0 border-0 bg-transparent p-0 shadow-none">
      {/* File */}
      <MenubarMenu>
        <MenubarTrigger className="px-2 py-0.5 text-[12px] font-normal text-muted-foreground">File</MenubarTrigger>
        <MenubarContent className="font-mono">
          <MenubarItem onSelect={ensureAssistant}>
            New Chat <MenubarShortcut>⌘I</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onSelect={() => setPaletteOpen(true)}>
            Go to File… <MenubarShortcut>⌘K</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onSelect={downloadResume}>Download Résumé</MenubarItem>
          <MenubarItem onSelect={copyEmail}>Copy Email Address</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Edit */}
      <MenubarMenu>
        <MenubarTrigger className="px-2 py-0.5 text-[12px] font-normal text-muted-foreground">Edit</MenubarTrigger>
        <MenubarContent className="font-mono">
          <MenubarItem onSelect={() => setPaletteOpen(true)}>
            Find… <MenubarShortcut>⌘K</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onSelect={copyEmail}>Copy Email Address</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* View */}
      <MenubarMenu>
        <MenubarTrigger className="px-2 py-0.5 text-[12px] font-normal text-muted-foreground">View</MenubarTrigger>
        <MenubarContent className="font-mono">
          <MenubarItem onSelect={() => setPaletteOpen(true)}>
            Command Palette… <MenubarShortcut>⌘K</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarCheckboxItem checked={explorerOpen} onSelect={toggleExplorer}>
            Explorer
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={assistantOpen} onSelect={toggleAssistant}>
            Chat <MenubarShortcut>⌘I</MenubarShortcut>
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={terminalOpen} onSelect={toggleTerminal}>
            Terminal <MenubarShortcut>⌃`</MenubarShortcut>
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Go */}
      <MenubarMenu>
        <MenubarTrigger className="px-2 py-0.5 text-[12px] font-normal text-muted-foreground">Go</MenubarTrigger>
        <MenubarContent className="font-mono">
          <MenubarItem onSelect={() => setPaletteOpen(true)}>
            Go to File… <MenubarShortcut>⌘K</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          {FILES.map((f) => (
            <MenubarItem key={f.id} onSelect={() => openFile(f.id)}>
              {f.name}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>

      {/* Run */}
      <MenubarMenu>
        <MenubarTrigger className="px-2 py-0.5 text-[12px] font-normal text-muted-foreground">Run</MenubarTrigger>
        <MenubarContent className="font-mono">
          <MenubarItem onSelect={downloadResume}>Download Résumé</MenubarItem>
          <MenubarItem onSelect={() => openFile('projects')}>Open Projects</MenubarItem>
          <MenubarItem onSelect={() => openExternal(PROFILE.github)}>View Source on GitHub</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Terminal */}
      <MenubarMenu>
        <MenubarTrigger className="px-2 py-0.5 text-[12px] font-normal text-muted-foreground">Terminal</MenubarTrigger>
        <MenubarContent className="font-mono">
          <MenubarItem onSelect={ensureTerminal}>
            New Terminal <MenubarShortcut>⌃`</MenubarShortcut>
          </MenubarItem>
          <MenubarCheckboxItem checked={terminalOpen} onSelect={toggleTerminal}>
            Toggle Terminal
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Help */}
      <MenubarMenu>
        <MenubarTrigger className="px-2 py-0.5 text-[12px] font-normal text-muted-foreground">Help</MenubarTrigger>
        <MenubarContent className="font-mono">
          <MenubarItem onSelect={() => openFile('about')}>About {PROFILE.handle}</MenubarItem>
          <MenubarItem onSelect={() => openFile('contact')}>Get in Touch</MenubarItem>
          <MenubarSeparator />
          {SOCIALS.slice(0, 3).map((s) => (
            <MenubarItem key={s.name} onSelect={() => (s.href.startsWith('mailto:') ? (window.location.href = s.href) : openExternal(s.href))}>
              {s.name}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>

      {/* Copilot */}
      <MenubarMenu>
        <MenubarTrigger className="px-2 py-0.5 text-[12px] font-normal text-brand/80">Copilot</MenubarTrigger>
        <MenubarContent className="font-mono">
          <MenubarItem onSelect={ensureAssistant}>
            Open Chat <MenubarShortcut>⌘I</MenubarShortcut>
          </MenubarItem>
          <MenubarCheckboxItem checked={assistantOpen} onSelect={toggleAssistant}>
            Toggle Chat Panel
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
