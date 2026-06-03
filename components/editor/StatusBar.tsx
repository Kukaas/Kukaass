'use client';

import { GitBranch, MapPin, Github, Linkedin } from 'lucide-react';
import { useEditor } from './EditorContext';
import { resolveTab } from './tabs';
import { PROFILE } from './data';

export default function StatusBar() {
  const { activeKey, projectTitles, openFile, isMobile } = useEditor();
  const lang = activeKey ? resolveTab(activeKey, projectTitles).ext.toUpperCase() || 'DIR' : '—';

  return (
    <footer className="flex h-6 shrink-0 select-none items-center justify-between border-t border-border bg-card px-2 font-mono text-[11px] text-muted-foreground">
      {/* Left */}
      <div className="flex items-center gap-1">
        <span className="flex items-center gap-1 rounded px-1.5 py-0.5">
          <GitBranch className="size-3" aria-hidden="true" />
          main
        </span>
        <button
          type="button"
          onClick={() => openFile('contact')}
          className="flex items-center gap-1.5 rounded px-1.5 py-0.5 transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-brand" />
          </span>
          Open to work
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {!isMobile && (
          <span className="flex items-center gap-1 px-1.5">
            <MapPin className="size-3" aria-hidden="true" />
            {PROFILE.location}
          </span>
        )}
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
          className="rounded p-1 transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Github className="size-3.5" aria-hidden="true" />
        </a>
        <a
          href={PROFILE.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
          className="rounded p-1 transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Linkedin className="size-3.5" aria-hidden="true" />
        </a>
        {!isMobile && (
          <>
            <span className="px-1.5">{lang}</span>
            <span className="px-1.5 text-muted-foreground/70">UTF-8</span>
          </>
        )}
      </div>
    </footer>
  );
}
