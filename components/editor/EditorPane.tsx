'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, CornerDownLeft } from 'lucide-react';
import { EASE } from './data';
import { useEditor } from './EditorContext';
import { FILES, type FileId } from './files';
import { resolveTab, type ResolvedTab } from './tabs';
import { PROFILE } from './data';
import HomeFile from './sections/HomeFile';
import AboutFile from './sections/AboutFile';
import ProjectsFile from './sections/ProjectsFile';
import ExperienceFile from './sections/ExperienceFile';
import StackFile from './sections/StackFile';
import ContactFile from './sections/ContactFile';
import ProjectDetailFile from './sections/ProjectDetailFile';

function renderFile(id: FileId) {
  switch (id) {
    case 'home':
      return <HomeFile />;
    case 'about':
      return <AboutFile />;
    case 'projects':
      return <ProjectsFile />;
    case 'experience':
      return <ExperienceFile />;
    case 'stack':
      return <StackFile />;
    case 'contact':
      return <ContactFile />;
  }
}

function renderTab(tab: ResolvedTab) {
  if (tab.kind === 'project' && tab.projectId) {
    return <ProjectDetailFile id={tab.projectId} />;
  }
  if (tab.fileId) return renderFile(tab.fileId);
  return null;
}

function WelcomeScreen() {
  const { openFile, setPaletteOpen } = useEditor();
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <p className="font-mono text-[12px] text-muted-foreground">// no file open</p>
        <h1 className="mt-3 font-sans text-3xl font-semibold tracking-tight text-foreground">
          {PROFILE.handle}
        </h1>
        <p className="mt-1 font-sans text-sm text-muted-foreground">
          {PROFILE.name} — {PROFILE.role}
        </p>

        <div className="mt-6 space-y-1">
          {FILES.map((file) => (
            <button
              key={file.id}
              type="button"
              onClick={() => openFile(file.id)}
              className="group flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-[13px] text-foreground/70 transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <file.icon className="size-4 text-muted-foreground" aria-hidden="true" />
              <span>{file.name}</span>
              <span className="ml-auto truncate text-[11px] text-muted-foreground/60 group-hover:text-muted-foreground">
                {file.blurb}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="mt-6 inline-flex items-center gap-2 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>Or jump anywhere with</span>
          <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px]">
            ⌘K
          </kbd>
        </button>
      </div>
    </div>
  );
}

export default function EditorPane() {
  const { activeKey, projectTitles } = useEditor();
  const reduce = useReducedMotion();

  if (!activeKey) {
    return (
      <div className="editor-selectable h-full bg-background">
        <WelcomeScreen />
      </div>
    );
  }

  const tab = resolveTab(activeKey, projectTitles);

  return (
    <div className="editor-selectable flex h-full flex-col bg-background">
      {/* Breadcrumb */}
      <div className="flex h-7 shrink-0 select-none items-center gap-1 px-4 text-[11px] text-muted-foreground/70">
        {tab.breadcrumb.map((seg, i) => (
          <span key={`${seg}-${i}`} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3" aria-hidden="true" />}
            <span className={i === tab.breadcrumb.length - 1 ? 'text-muted-foreground' : ''}>
              {seg}
            </span>
          </span>
        ))}
        <span className="ml-auto hidden items-center gap-1 text-muted-foreground/50 sm:flex">
          <CornerDownLeft className="size-3" aria-hidden="true" />
          {tab.ext ? tab.ext.toUpperCase() : 'DIR'}
        </span>
      </div>

      {/* Content (re-keyed per tab so switching reads as a quick redraw) */}
      <div className="editor-scroll min-h-0 flex-1 overflow-y-auto">
        <motion.div
          key={activeKey}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          {renderTab(tab)}
        </motion.div>
      </div>
    </div>
  );
}
