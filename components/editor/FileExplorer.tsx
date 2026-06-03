'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, FileCode2, FileDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEditor } from './EditorContext';
import { FILES } from './files';
import { projectKey, slugify } from './tabs';
import { useProjects } from '@/hooks/use-projects';

export default function FileExplorer() {
  const { activeKey, openFile, openProject, downloadResume, resumeLoading } = useEditor();
  const { data: projects } = useProjects();
  const [projectsExpanded, setProjectsExpanded] = useState(false);

  const rowBase =
    'group flex w-full items-center gap-2 py-1 pr-2 text-left text-[13px] transition-colors hover:bg-accent/70 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-inset';

  return (
    <div className="flex h-full select-none flex-col bg-card">
      <div className="flex h-8 shrink-0 items-center px-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Explorer
        </span>
      </div>

      <div className="editor-scroll min-h-0 flex-1 overflow-y-auto pb-4">
        {/* Root folder */}
        <div className="flex items-center gap-1 px-2 py-1 text-[12px] font-medium text-foreground/80">
          <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
          <span className="tracking-wide">kukaass</span>
        </div>

        <ul className="ml-[15px] border-l border-border">
          {FILES.map((file) => {
            if (file.id === 'projects') {
              const active = activeKey === 'projects';
              const count = projects?.length;
              return (
                <li key={file.id}>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setProjectsExpanded((v) => !v)}
                      aria-label={projectsExpanded ? 'Collapse projects' : 'Expand projects'}
                      aria-expanded={projectsExpanded}
                      className="py-1 pl-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      {projectsExpanded ? (
                        <ChevronDown className="size-3.5" aria-hidden="true" />
                      ) : (
                        <ChevronRight className="size-3.5" aria-hidden="true" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => openFile('projects')}
                      aria-current={active ? 'true' : undefined}
                      className={cn(
                        rowBase,
                        'flex-1 pl-1',
                        active ? 'bg-accent text-foreground' : 'text-foreground/65 hover:text-foreground',
                      )}
                    >
                      <file.icon
                        className={cn('size-4 shrink-0', active ? 'text-brand' : 'text-muted-foreground')}
                        aria-hidden="true"
                      />
                      <span className="truncate">{file.name}</span>
                      {count !== undefined && (
                        <span className="ml-auto px-1.5 text-[10px] tabular-nums text-muted-foreground/70">
                          {count}
                        </span>
                      )}
                    </button>
                  </div>

                  {projectsExpanded && projects && projects.length > 0 && (
                    <ul className="ml-[19px] border-l border-border">
                      {projects.map((p) => {
                        const pActive = activeKey === projectKey(p._id);
                        return (
                          <li key={p._id}>
                            <button
                              type="button"
                              onClick={() => openProject(p)}
                              aria-current={pActive ? 'true' : undefined}
                              className={cn(
                                rowBase,
                                'pl-3',
                                pActive
                                  ? 'bg-accent text-foreground'
                                  : 'text-foreground/60 hover:text-foreground',
                              )}
                            >
                              <FileCode2
                                className={cn(
                                  'size-4 shrink-0',
                                  pActive ? 'text-brand' : 'text-muted-foreground',
                                )}
                                aria-hidden="true"
                              />
                              <span className="truncate">{slugify(p.title)}.tsx</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            const active = activeKey === file.id;
            return (
              <li key={file.id}>
                <button
                  type="button"
                  onClick={() => openFile(file.id)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    rowBase,
                    'pl-3',
                    active ? 'bg-accent text-foreground' : 'text-foreground/65 hover:text-foreground',
                  )}
                >
                  <file.icon
                    className={cn('size-4 shrink-0', active ? 'text-brand' : 'text-muted-foreground')}
                    aria-hidden="true"
                  />
                  <span className="truncate">{file.name}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Static asset: résumé download */}
        <div className="mt-2 px-2">
          <button
            type="button"
            onClick={downloadResume}
            className={cn(rowBase, 'rounded-sm pl-[19px] text-foreground/65 hover:text-foreground')}
          >
            {resumeLoading ? (
              <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" aria-hidden="true" />
            ) : (
              <FileDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            )}
            <span className="truncate">resume.pdf</span>
            <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground/50">
              get
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
