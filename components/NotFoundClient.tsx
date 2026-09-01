'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  FileCode2,
  FileText,
  FolderGit2,
  Braces,
  Settings2,
  SquareTerminal,
  Home,
  Compass,
  AlertTriangle,
} from 'lucide-react';
import TrafficLights from '@/components/shared/TrafficLights';
import { Button } from '@/components/ui/button';
import { applyTheme, loadThemeId, themeById } from '@/components/editor/theme';
import { FILES } from '@/components/editor/files';

const EASE = [0.25, 1, 0.5, 1] as const;

export default function NotFoundClient() {
  const reduce = useReducedMotion();
  const [currentPath, setCurrentPath] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    applyTheme(themeById(loadThemeId()));
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const rise = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay, ease: EASE },
        };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 antialiased selection:bg-brand/25 selection:text-foreground">
      <motion.div
        {...rise(0)}
        className="w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-card shadow-[0_16px_48px_-12px_rgba(0,0,0,0.55)]"
      >
        {/* Title / Tab Bar Chrome */}
        <div className="flex h-10 select-none items-center justify-between border-b border-border bg-card px-3 sm:px-4 text-[12px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <TrafficLights />
            <div className="flex items-center gap-1.5 border-l border-border/80 pl-3">
              <span className="inline-block size-2 rounded-full bg-brand" aria-hidden="true" />
              <span className="font-mono text-xs text-foreground font-medium">404.ts</span>
              <span className="text-muted-foreground/60 hidden sm:inline">— not_found</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-brand px-2 py-0.5 rounded-full border border-brand/30 bg-brand/5">
              ERR_NOT_FOUND
            </span>
          </div>
        </div>

        {/* Breadcrumb Path Bar */}
        <div className="flex items-center gap-2 border-b border-border/60 bg-background/50 px-4 py-2 text-xs font-mono text-muted-foreground">
          <span className="text-foreground/70">kukaass</span>
          <span>/</span>
          <span>errors</span>
          <span>/</span>
          <span className="text-brand">404.ts</span>
          <span className="ml-auto text-[11px] text-muted-foreground/60 hidden sm:inline">
            TypeScript • UTF-8
          </span>
        </div>

        {/* Code / Spec Sheet Diagnostics Area */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase text-brand">
              <AlertTriangle className="size-3.5" aria-hidden="true" />
              <span>HTTP Status 404 // Route Resolution Error</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground font-sans">
              Resource Not Found
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl font-sans">
              The requested file or route could not be resolved in the workspace. It may have been moved, renamed, or never existed.
            </p>
          </div>

          {/* Diagnostic Code Block */}
          <div className="rounded-lg border border-border bg-background p-3 sm:p-4 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto">
            <div className="code-lines space-y-1 text-muted-foreground">
              <div className="code-row">
                <span className="code-body text-muted-foreground/70">
                  <span className="text-muted-foreground/50">// Diagnostic Trace</span>
                </span>
              </div>
              <div className="code-row">
                <span className="code-body">
                  <span className="text-foreground/90 font-medium">const</span> targetRoute ={' '}
                  <span className="text-brand">
                    &quot;{mounted && currentPath ? currentPath : '/unknown-route'}&quot;
                  </span>
                  ;
                </span>
              </div>
              <div className="code-row">
                <span className="code-body">
                  <span className="text-foreground/90 font-medium">const</span> status ={' '}
                  <span className="text-foreground font-semibold">404</span>;
                </span>
              </div>
              <div className="code-row">
                <span className="code-body text-destructive">
                  <span className="text-destructive/80">throw new</span> Error(
                  <span className="text-destructive">`[ENOENT] Cannot resolve &apos;{mounted && currentPath ? currentPath : '/...'}&apos;`</span>
                  );
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button asChild size="default" className="font-sans font-medium">
              <Link href="/">
                <Home className="size-4" aria-hidden="true" />
                Return to Workspace
              </Link>
            </Button>
            <Button
              variant="outline"
              size="default"
              onClick={() => {
                if (typeof window !== 'undefined' && window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.href = '/';
                }
              }}
              className="font-sans"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Go Back
            </Button>
          </div>

          {/* Quick Jump / Workspace Directory */}
          <div className="border-t border-border/80 pt-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-muted-foreground">
              <Compass className="size-3.5 text-brand" aria-hidden="true" />
              <span>Available Workspace Files</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {FILES.map((file) => {
                const Icon = file.icon;
                const href = file.id === 'home' ? '/' : `/${file.hash}`;
                return (
                  <Link
                    key={file.id}
                    href={href}
                    className="group flex items-start gap-3 rounded-lg border border-border/70 bg-background/40 p-3 transition-all duration-200 hover:border-brand/50 hover:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <Icon className="size-4 shrink-0 text-muted-foreground group-hover:text-brand transition-colors mt-0.5" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-xs font-medium text-foreground group-hover:text-brand transition-colors truncate">
                        {file.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {file.blurb}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Terminal Hint Bar */}
          <div className="flex items-center justify-between rounded-md border border-border/60 bg-background/60 px-3 py-2 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-2 truncate">
              <SquareTerminal className="size-3.5 text-brand shrink-0" aria-hidden="true" />
              <span className="truncate">
                kukaass@portfolio:~$ <span className="text-foreground">cd /home</span>
              </span>
              <span className="caret-blink" aria-hidden="true" />
            </div>
            <span className="text-[10px] text-muted-foreground/60 hidden sm:inline shrink-0">
              Select a file or Return Home
            </span>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex h-7 items-center justify-between border-t border-border bg-card px-3 text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-destructive">
              <span className="size-1.5 rounded-full bg-destructive" />
              1 Error
            </span>
            <span className="hidden sm:inline text-muted-foreground/40">|</span>
            <span className="hidden sm:inline">0 Warnings</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground/80">Chester Luke A. Maligaso</span>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
