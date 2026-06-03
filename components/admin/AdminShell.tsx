'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  FolderRoot,
  Briefcase,
  FileText,
  Inbox,
  Settings,
  LogOut,
  SquareArrowOutUpRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { applyTheme, loadThemeId, themeById } from '@/components/editor/theme';

export type AdminSection = 'projects' | 'experiences' | 'resumes' | 'messages' | 'settings';

interface NavItem {
  section: AdminSection;
  label: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { section: 'projects', label: 'Projects', icon: FolderRoot },
  { section: 'experiences', label: 'Experiences', icon: Briefcase },
  { section: 'resumes', label: 'Resumes', icon: FileText },
  { section: 'messages', label: 'Messages', icon: Inbox },
  { section: 'settings', label: 'Settings', icon: Settings },
];

/** macOS window chrome — decorative traffic lights, matching the editor title bar. */
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

interface AdminShellProps {
  /** The dashboard section this view belongs to (drives the rail highlight). */
  activeSection: AdminSection;
  /** The label shown in the editor tab (e.g. "projects.tsx" or "new-project.tsx"). */
  tabLabel: string;
  tabIcon?: LucideIcon;
  children: React.ReactNode;
}

/**
 * The admin CMS presented as Chester's code editor — same Filament Dark chrome
 * as the public portfolio: title bar with macOS traffic lights, an activity-bar
 * rail for sections, an editor tab, and a status bar. Sections are URL-driven
 * (`/admin?tab=…`) so the rail works from every page, including the form routes.
 */
export default function AdminShell({ activeSection, tabLabel, tabIcon: TabIcon = FileText, children }: AdminShellProps) {
  // Match the editor: apply the saved theme so the admin inherits the dark
  // graphite/amber tokens instead of the default light palette.
  useEffect(() => {
    applyTheme(themeById(loadThemeId()));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.reload();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background font-mono text-[13px] text-foreground antialiased">
      {/* Title bar */}
      <header className="flex h-9 shrink-0 select-none items-center justify-between border-b border-border bg-card px-3 text-[12px] text-muted-foreground">
        <div className="flex flex-1 items-center gap-2">
          <TrafficLights />
          <span className="ml-1 text-foreground/80">admin</span>
        </div>
        <div className="flex min-w-0 items-center gap-2 truncate">
          <span className="truncate text-foreground/80">kukaass</span>
          <span className="text-border">/</span>
          <span className="truncate">admin</span>
        </div>
        <div className="flex flex-1 items-center justify-end gap-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <SquareArrowOutUpRight className="size-3.5" aria-hidden="true" />
            View site
          </Link>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Activity-bar rail */}
        <nav
          aria-label="Admin sections"
          className="flex w-12 shrink-0 select-none flex-col items-center gap-1 border-r border-border bg-card py-2"
        >
          {NAV.map((item) => {
            const active = item.section === activeSection;
            return (
              <Link
                key={item.section}
                href={`/admin?tab=${item.section}`}
                aria-label={item.label}
                title={item.label}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors',
                  'hover:bg-accent hover:text-foreground',
                  'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
                  active && 'bg-accent text-brand',
                )}
              >
                <item.icon className="size-5" aria-hidden="true" />
              </Link>
            );
          })}

          <div className="flex-1" />

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
            className="flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <LogOut className="size-5" aria-hidden="true" />
          </button>
        </nav>

        {/* Editor area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Tab bar */}
          <div className="flex h-9 shrink-0 select-none items-center border-b border-border bg-card">
            <div className="tab-accent flex h-full items-center gap-2 border-r border-border bg-background px-3 text-[12px] text-foreground">
              <TabIcon className="size-3.5 text-brand" aria-hidden="true" />
              {tabLabel}
            </div>
          </div>

          {/* Content */}
          <div className="editor-scroll editor-selectable min-h-0 flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <footer className="flex h-6 shrink-0 select-none items-center justify-between border-t border-border bg-card px-2 font-mono text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>⎇ main</span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
            authenticated
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="capitalize">{activeSection}</span>
          <span className="text-muted-foreground/70">UTF-8</span>
        </div>
      </footer>
    </div>
  );
}
