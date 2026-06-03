'use client';

import { createContext, useContext } from 'react';
import type { FileId } from './files';
import type { TabKey } from './tabs';
import type { Theme } from './theme';
import type { Project } from '@/hooks/use-projects';

export interface EditorContextValue {
  /** Open tabs (static files + project tabs), in tab order. */
  openKeys: TabKey[];
  /** Currently focused tab, or null when every tab is closed. */
  activeKey: TabKey | null;
  /** Titles for open project tabs, keyed by project id (drives filenames). */
  projectTitles: Record<string, string>;

  /** Open or focus a static section file. */
  openFile: (id: FileId) => void;
  /** Open or focus an arbitrary tab key (used by the tab bar). */
  selectKey: (key: TabKey) => void;
  /** Open a project tab from a full project object (also records its title). */
  openProject: (project: Project) => void;
  /** Open a project tab by id (deep-link path; title fills in once loaded). */
  openProjectById: (id: string) => void;
  /** Record a project's title so its tab/filename reads correctly. */
  registerProjectTitle: (id: string, title: string) => void;
  /** Close a tab by key. */
  closeKey: (key: TabKey) => void;

  isMobile: boolean;

  explorerOpen: boolean;
  toggleExplorer: () => void;

  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;

  terminalOpen: boolean;
  setTerminalOpen: (open: boolean) => void;
  toggleTerminal: () => void;

  /** The AI assistant ("Copilot") lives in the right-hand panel. */
  assistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
  toggleAssistant: () => void;

  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;

  /** Keyboard-shortcuts reference dialog. */
  shortcutsOpen: boolean;
  setShortcutsOpen: (open: boolean) => void;

  /** Active color theme and switcher. */
  theme: Theme;
  setThemeId: (id: string) => void;

  downloadResume: () => void;
  resumeLoading: boolean;
}

export const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error('useEditor must be used within an EditorShell provider');
  }
  return ctx;
}
