'use client';

import { Command } from 'cmdk';
import { ChevronRight, FileDown, SquareTerminal, Sparkles, Copy, Github, Linkedin, FileCode2, Keyboard, Palette, Check } from 'lucide-react';
import { useEditor } from './EditorContext';
import { FILES, type FileId } from './files';
import { slugify } from './tabs';
import { PROFILE } from './data';
import { THEMES } from './theme';
import { useProjects } from '@/hooks/use-projects';

const itemClass =
  'flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-[13px] text-foreground/75 transition-colors data-[selected=true]:bg-accent data-[selected=true]:text-foreground';

export default function CommandPalette() {
  const {
    paletteOpen,
    setPaletteOpen,
    openFile,
    openProject,
    downloadResume,
    toggleTerminal,
    toggleAssistant,
    setShortcutsOpen,
    theme,
    setThemeId,
  } = useEditor();
  const { data: projects } = useProjects();

  const run = (fn: () => void) => {
    fn();
    setPaletteOpen(false);
  };

  const openExternal = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');
  const copyEmail = () => {
    void navigator.clipboard?.writeText(PROFILE.email).catch(() => {});
  };

  return (
    <Command.Dialog
      open={paletteOpen}
      onOpenChange={setPaletteOpen}
      label="Command palette"
      overlayClassName="fixed inset-0 z-50 bg-background/70 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0"
      contentClassName="fixed left-1/2 top-[14vh] z-50 w-[92vw] max-w-xl -translate-x-1/2"
      className="overflow-hidden rounded-xl border border-border bg-popover font-mono shadow-[0_16px_48px_-12px_rgba(0,0,0,0.55)]"
    >
      <div className="flex items-center gap-2 border-b border-border px-3">
        <ChevronRight className="size-4 text-brand" aria-hidden="true" />
        <Command.Input
          placeholder="Go to file or run a command…"
          className="w-full bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      <Command.List className="editor-scroll max-h-[50vh] overflow-y-auto p-2">
        <Command.Empty className="px-3 py-6 text-center text-[13px] text-muted-foreground">
          No matching commands.
        </Command.Empty>

        <Command.Group
          heading="Files"
          className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-muted-foreground"
        >
          {FILES.map((file) => (
            <Command.Item
              key={file.id}
              value={`${file.name} ${file.blurb}`}
              onSelect={() => run(() => openFile(file.id as FileId))}
              className={itemClass}
            >
              <file.icon className="size-4 text-muted-foreground" aria-hidden="true" />
              <span>{file.name}</span>
              <span className="ml-auto truncate pl-3 text-[11px] text-muted-foreground/60">
                {file.blurb}
              </span>
            </Command.Item>
          ))}
        </Command.Group>

        {projects && projects.length > 0 && (
          <Command.Group
            heading="Projects"
            className="mt-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            {projects.map((p) => (
              <Command.Item
                key={p._id}
                value={`project ${p.title}`}
                onSelect={() => run(() => openProject(p))}
                className={itemClass}
              >
                <FileCode2 className="size-4 text-muted-foreground" aria-hidden="true" />
                <span>{slugify(p.title)}.tsx</span>
                <span className="ml-auto truncate pl-3 text-[11px] text-muted-foreground/60">{p.title}</span>
              </Command.Item>
            ))}
          </Command.Group>
        )}

        <Command.Group
          heading="Actions"
          className="mt-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-muted-foreground"
        >
          <Command.Item value="download resume cv" onSelect={() => run(downloadResume)} className={itemClass}>
            <FileDown className="size-4 text-muted-foreground" aria-hidden="true" />
            Download résumé
          </Command.Item>
          <Command.Item value="open chat ai assistant copilot ask" onSelect={() => run(toggleAssistant)} className={itemClass}>
            <Sparkles className="size-4 text-muted-foreground" aria-hidden="true" />
            Toggle AI chat
          </Command.Item>
          <Command.Item value="toggle terminal shell console" onSelect={() => run(toggleTerminal)} className={itemClass}>
            <SquareTerminal className="size-4 text-muted-foreground" aria-hidden="true" />
            Toggle terminal
          </Command.Item>
          <Command.Item value="copy email address" onSelect={() => run(copyEmail)} className={itemClass}>
            <Copy className="size-4 text-muted-foreground" aria-hidden="true" />
            Copy email
            <span className="ml-auto truncate pl-3 text-[11px] text-muted-foreground/60">{PROFILE.email}</span>
          </Command.Item>
          <Command.Item value="keyboard shortcuts help keys" onSelect={() => run(() => setShortcutsOpen(true))} className={itemClass}>
            <Keyboard className="size-4 text-muted-foreground" aria-hidden="true" />
            Keyboard shortcuts
            <span className="ml-auto truncate pl-3 text-[11px] text-muted-foreground/60">⌘/</span>
          </Command.Item>
          <Command.Item value="open github profile" onSelect={() => run(() => openExternal(PROFILE.github))} className={itemClass}>
            <Github className="size-4 text-muted-foreground" aria-hidden="true" />
            Open GitHub
          </Command.Item>
          <Command.Item value="open linkedin profile" onSelect={() => run(() => openExternal(PROFILE.linkedin))} className={itemClass}>
            <Linkedin className="size-4 text-muted-foreground" aria-hidden="true" />
            Open LinkedIn
          </Command.Item>
        </Command.Group>

        <Command.Group
          heading="Color Theme"
          className="mt-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-muted-foreground"
        >
          {THEMES.map((t) => (
            <Command.Item
              key={t.id}
              value={`theme ${t.name}`}
              onSelect={() => run(() => setThemeId(t.id))}
              className={itemClass}
            >
              <Palette className="size-4 text-muted-foreground" aria-hidden="true" />
              {t.name}
              {theme.id === t.id ? (
                <Check className="ml-auto size-4 text-brand" aria-hidden="true" />
              ) : (
                <span
                  className="ml-auto size-3 rounded-full ring-1 ring-border"
                  style={{ background: t.swatch }}
                  aria-hidden="true"
                />
              )}
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
