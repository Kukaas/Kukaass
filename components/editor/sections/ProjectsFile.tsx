'use client';

import EditorProjectCard from '../EditorProjectCard';
import { useProjects, type Project } from '@/hooks/use-projects';

function HeaderLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 font-mono text-[12.5px] text-muted-foreground">
      <span className="text-muted-foreground/50">//</span> {children}
    </p>
  );
}

export default function ProjectsFile() {
  const { data: projects, isLoading, error } = useProjects();

  return (
    <div className="w-full max-w-7xl px-6 py-8 sm:px-8 sm:py-12">
      {isLoading && (
        <>
          <HeaderLine>loading projects…</HeaderLine>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-6">
                <div className="mb-5 aspect-video rounded-lg bg-muted" />
                <div className="mb-3 h-5 w-2/3 rounded bg-muted" />
                <div className="mb-2 h-4 w-full rounded bg-muted" />
                <div className="h-4 w-5/6 rounded bg-muted" />
              </div>
            ))}
          </div>
        </>
      )}

      {error && (
        <div className="font-mono text-[13px]">
          <HeaderLine>projects</HeaderLine>
          <p className="text-destructive">Error: failed to load projects.</p>
          <p className="mt-1 text-muted-foreground">Please try again later.</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <HeaderLine>
            {projects?.length ?? 0} {projects?.length === 1 ? 'project' : 'projects'}, designed,
            built, and shipped
          </HeaderLine>

          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project: Project, index: number) => (
                <EditorProjectCard key={project._id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <p className="font-mono text-[13px] text-muted-foreground">
              <span className="text-foreground/60">{'// '}</span>no projects yet. check back soon.
            </p>
          )}
        </>
      )}
    </div>
  );
}
