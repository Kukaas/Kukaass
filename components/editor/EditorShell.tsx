'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useActiveResume } from '@/hooks/use-resumes';
import type { Project } from '@/hooks/use-projects';
import { EditorContext, type EditorContextValue } from './EditorContext';
import { DEFAULT_FILE, fileByHash, fileById, type FileId } from './files';
import { projectKey, isProjectKey, projectIdOf, type TabKey } from './tabs';
import { EASE } from './data';
import { applyTheme, loadThemeId, saveThemeId, themeById, DEFAULT_THEME_ID } from './theme';
import TitleBar from './TitleBar';
import ActivityBar from './ActivityBar';
import FileExplorer from './FileExplorer';
import TabBar from './TabBar';
import EditorPane from './EditorPane';
import StatusBar from './StatusBar';
import Terminal from './Terminal';
import Assistant from './Assistant';
import { AssistantChatProvider } from './AssistantChatContext';
import CommandPalette from './CommandPalette';
import ShortcutsDialog from './ShortcutsDialog';

const PROJECT_HASH = '#projects/';
const MIN_TERMINAL = 160;

export default function EditorShell() {
  const isMobile = useIsMobile();
  const reduce = useReducedMotion();

  const [openKeys, setOpenKeys] = useState<TabKey[]>([DEFAULT_FILE]);
  const [activeKey, setActiveKey] = useState<TabKey | null>(DEFAULT_FILE);
  const [projectTitles, setProjectTitles] = useState<Record<string, string>>({});
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(300);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [themeId, setThemeIdState] = useState(DEFAULT_THEME_ID);
  const theme = useMemo(() => themeById(themeId), [themeId]);

  const openKeysRef = useRef(openKeys);
  openKeysRef.current = openKeys;

  // --- Résumé download (active résumé from the CMS) --------------------------
  const { isLoading: resumeQueryLoading } = useActiveResume();
  const [downloading, setDownloading] = useState(false);
  const resumeLoading = resumeQueryLoading || downloading;
  const downloadResume = useCallback(async () => {
    setDownloading(true);
    await new Promise((r) => setTimeout(r, 600));
    try {
      window.location.href = '/api/resumes/active/download';
    } finally {
      setDownloading(false);
    }
  }, []);

  // --- Tabs ------------------------------------------------------------------
  const openKey = useCallback((key: TabKey) => {
    setOpenKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
    setActiveKey(key);
    setMobileNavOpen(false);
  }, []);

  const openFile = useCallback((id: FileId) => openKey(id), [openKey]);
  const selectKey = useCallback((key: TabKey) => openKey(key), [openKey]);

  const registerProjectTitle = useCallback((id: string, title: string) => {
    setProjectTitles((prev) => (prev[id] === title ? prev : { ...prev, [id]: title }));
  }, []);

  const openProjectById = useCallback((id: string) => openKey(projectKey(id)), [openKey]);
  const openProject = useCallback(
    (project: Project) => {
      registerProjectTitle(project._id, project.title);
      openKey(projectKey(project._id));
    },
    [openKey, registerProjectTitle],
  );

  const closeKey = useCallback((key: TabKey) => {
    const idx = openKeysRef.current.indexOf(key);
    const remaining = openKeysRef.current.filter((k) => k !== key);
    setOpenKeys(remaining);
    setActiveKey((curr) => {
      if (curr !== key) return curr;
      if (remaining.length === 0) return null;
      return remaining[Math.max(0, idx - 1)];
    });
  }, []);

  // Tab context-menu actions (VS Code-style): close others / to the right / all.
  const closeOtherKeys = useCallback((key: TabKey) => {
    setOpenKeys([key]);
    setActiveKey(key);
  }, []);

  const closeKeysToRight = useCallback((key: TabKey) => {
    const keys = openKeysRef.current;
    const idx = keys.indexOf(key);
    if (idx === -1) return;
    const remaining = keys.slice(0, idx + 1);
    setOpenKeys(remaining);
    setActiveKey((curr) => (curr && remaining.includes(curr) ? curr : key));
  }, []);

  const closeAllKeys = useCallback(() => {
    setOpenKeys([]);
    setActiveKey(null);
  }, []);

  const toggleExplorer = useCallback(() => setExplorerOpen((v) => !v), []);
  const toggleTerminal = useCallback(() => setTerminalOpen((v) => !v), []);
  const toggleAssistant = useCallback(() => setAssistantOpen((v) => !v), []);

  // Theme: load the saved choice on mount, then apply + persist on change.
  useEffect(() => {
    const id = loadThemeId();
    setThemeIdState(id);
    applyTheme(themeById(id));
  }, []);
  const setThemeId = useCallback((id: string) => {
    setThemeIdState(id);
    applyTheme(themeById(id));
    saveThemeId(id);
  }, []);

  // Deep-link from the URL hash on first load.
  useEffect(() => {
    const h = window.location.hash;
    if (h.startsWith(PROJECT_HASH)) {
      const id = h.slice(PROJECT_HASH.length);
      if (id) openProjectById(id);
    } else {
      const file = fileByHash(h);
      if (file && file.id !== DEFAULT_FILE) openFile(file.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect the active tab in the URL hash without scrolling.
  useEffect(() => {
    let target = '';
    if (activeKey) {
      target = isProjectKey(activeKey)
        ? `${PROJECT_HASH}${projectIdOf(activeKey)}`
        : fileById(activeKey as FileId).hash;
    }
    if (window.location.hash !== target) {
      window.history.replaceState(
        null,
        '',
        target || window.location.pathname + window.location.search,
      );
    }
  }, [activeKey]);

  // Global shortcuts: ⌘K palette · ⌘B explorer · ⌃` terminal · ⌘I chat ·
  // ⌘/ keyboard-shortcuts reference.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      // Let the focused field own its keystrokes (e.g. ⌘B/⌘I/⌘K in the contact
      // form) — app shortcuts shouldn't fire while typing in an input.
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      const k = e.key.toLowerCase();
      if (k === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === '`') {
        e.preventDefault();
        toggleTerminal();
      } else if (k === 'i') {
        e.preventDefault();
        toggleAssistant();
      } else if (k === 'b') {
        e.preventDefault();
        toggleExplorer();
      } else if (e.key === '/') {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleTerminal, toggleAssistant, toggleExplorer]);

  // Drag-to-resize the terminal panel (desktop).
  const startTerminalResize = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = terminalHeight;
    const max = Math.round(window.innerHeight * 0.72);
    const onMove = (ev: PointerEvent) => {
      const next = Math.min(max, Math.max(MIN_TERMINAL, startHeight + (startY - ev.clientY)));
      setTerminalHeight(next);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [terminalHeight]);

  // Seed the resizable Group with the same layout it settles into, so the
  // explorer/assistant don't flash wide before JS measures on first paint.
  const EXPLORER_PCT = 20;
  const ASSISTANT_PCT = 26;
  const defaultLayout = useMemo(() => {
    const explorer = explorerOpen ? EXPLORER_PCT : 0;
    const assistant = assistantOpen ? ASSISTANT_PCT : 0;
    const layout: Record<string, number> = { main: 100 - explorer - assistant };
    if (explorerOpen) layout.explorer = explorer;
    if (assistantOpen) layout.assistant = assistant;
    return layout;
  }, [explorerOpen, assistantOpen]);

  const ctx: EditorContextValue = useMemo(
    () => ({
      openKeys,
      activeKey,
      projectTitles,
      openFile,
      selectKey,
      openProject,
      openProjectById,
      registerProjectTitle,
      closeKey,
      closeOtherKeys,
      closeKeysToRight,
      closeAllKeys,
      isMobile,
      explorerOpen,
      toggleExplorer,
      mobileNavOpen,
      setMobileNavOpen,
      terminalOpen,
      setTerminalOpen,
      toggleTerminal,
      assistantOpen,
      setAssistantOpen,
      toggleAssistant,
      paletteOpen,
      setPaletteOpen,
      shortcutsOpen,
      setShortcutsOpen,
      theme,
      setThemeId,
      downloadResume,
      resumeLoading,
    }),
    [
      openKeys,
      activeKey,
      projectTitles,
      openFile,
      selectKey,
      openProject,
      openProjectById,
      registerProjectTitle,
      closeKey,
      closeOtherKeys,
      closeKeysToRight,
      closeAllKeys,
      isMobile,
      explorerOpen,
      toggleExplorer,
      mobileNavOpen,
      terminalOpen,
      toggleTerminal,
      assistantOpen,
      toggleAssistant,
      paletteOpen,
      shortcutsOpen,
      theme,
      setThemeId,
      downloadResume,
      resumeLoading,
    ],
  );

  return (
    <EditorContext.Provider value={ctx}>
      <AssistantChatProvider>
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-background font-mono text-[13px] text-foreground antialiased">
        <TitleBar />

        <div className="flex min-h-0 flex-1">
          {!isMobile && <ActivityBar />}

          {!isMobile ? (
            <Group orientation="horizontal" defaultLayout={defaultLayout} className="min-w-0 flex-1">
              {explorerOpen && (
                <>
                  <Panel id="explorer" defaultSize="20%" minSize="180px" maxSize="32%" className="min-h-0">
                    <FileExplorer />
                  </Panel>
                  <Separator className="w-px bg-border outline-none transition-colors hover:bg-brand data-[separator-state=drag]:bg-brand" />
                </>
              )}
              <Panel id="main" minSize="30%" className="flex min-h-0 min-w-0 flex-col">
                <TabBar />
                <div className="min-h-0 flex-1">
                  <EditorPane />
                </div>
                {terminalOpen && (
                  <div
                    style={{ height: terminalHeight }}
                    className="shrink-0 border-t border-border"
                  >
                    <div
                      onPointerDown={startTerminalResize}
                      className="h-1 cursor-row-resize bg-transparent transition-colors hover:bg-brand/40"
                      role="separator"
                      aria-orientation="horizontal"
                      aria-label="Resize terminal"
                    />
                    <div className="h-[calc(100%-0.25rem)]">
                      <Terminal />
                    </div>
                  </div>
                )}
              </Panel>
              {assistantOpen && (
                <>
                  <Separator className="w-px bg-border outline-none transition-colors hover:bg-brand data-[separator-state=drag]:bg-brand" />
                  <Panel id="assistant" defaultSize="26%" minSize="260px" maxSize="44%" className="min-h-0">
                    <Assistant />
                  </Panel>
                </>
              )}
            </Group>
          ) : (
            <div className="flex min-w-0 flex-1 flex-col">
              <TabBar />
              <div className="min-h-0 flex-1">
                <EditorPane />
              </div>
            </div>
          )}
        </div>

        <StatusBar />
      </div>

      <CommandPalette />
      <ShortcutsDialog />

      {/* Mobile file-tree drawer */}
      {isMobile && (
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              className="fixed inset-0 z-40 flex"
              initial={reduce ? { opacity: 0 } : undefined}
              animate={reduce ? { opacity: 1 } : undefined}
              exit={reduce ? { opacity: 0 } : undefined}
            >
              <motion.button
                type="button"
                aria-label="Close file tree"
                className="absolute inset-0 bg-background/70 backdrop-blur-[2px]"
                onClick={() => setMobileNavOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                className="relative z-10 flex h-full w-[78%] max-w-xs flex-col border-r border-border bg-card"
                initial={reduce ? false : { x: '-100%' }}
                animate={{ x: 0 }}
                exit={reduce ? { opacity: 0 } : { x: '-100%' }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    Explorer
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen(false)}
                    aria-label="Close file tree"
                    className="rounded-sm p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="min-h-0 flex-1">
                  <FileExplorer showHeader={false} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Mobile terminal sheet */}
      {isMobile && (
        <AnimatePresence>
          {terminalOpen && (
            <motion.div
              className="fixed inset-0 z-40 flex flex-col justify-end"
              initial={reduce ? { opacity: 0 } : undefined}
              animate={reduce ? { opacity: 1 } : undefined}
              exit={reduce ? { opacity: 0 } : undefined}
            >
              <motion.button
                type="button"
                aria-label="Close terminal"
                className="absolute inset-0 bg-background/70 backdrop-blur-[2px]"
                onClick={() => setTerminalOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                className="relative z-10 h-[68dvh] border-t border-border bg-background"
                initial={reduce ? false : { y: '100%' }}
                animate={{ y: 0 }}
                exit={reduce ? { opacity: 0 } : { y: '100%' }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <Terminal />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Mobile assistant drawer (slides from the right, like Copilot Chat) */}
      {isMobile && (
        <AnimatePresence>
          {assistantOpen && (
            <motion.div
              className="fixed inset-0 z-40 flex justify-end"
              initial={reduce ? { opacity: 0 } : undefined}
              animate={reduce ? { opacity: 1 } : undefined}
              exit={reduce ? { opacity: 0 } : undefined}
            >
              <motion.button
                type="button"
                aria-label="Close chat"
                className="absolute inset-0 bg-background/70 backdrop-blur-[2px]"
                onClick={() => setAssistantOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                className="relative z-10 flex h-full w-[86%] max-w-sm flex-col border-l border-border bg-card"
                initial={reduce ? false : { x: '100%' }}
                animate={{ x: 0 }}
                exit={reduce ? { opacity: 0 } : { x: '100%' }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                <Assistant />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      </AssistantChatProvider>
    </EditorContext.Provider>
  );
}
