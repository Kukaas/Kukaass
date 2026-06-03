'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, Github, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ImageCarousel from '@/components/ImageCarousel';
import PrivateRepoAccess from '@/components/PrivateRepoAccess';
import { useProject } from '@/hooks/use-projects';
import { useEditor } from '../EditorContext';
import { slugify } from '../tabs';

function fmt(date?: string | Date) {
  if (!date) return undefined;
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function List({ heading, items, accent }: { heading: string; items: string[]; accent?: boolean }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="font-sans text-lg font-semibold tracking-tight text-foreground">{heading}</h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 font-sans text-[15px] leading-relaxed text-foreground/80">
            <span
              className={cn('mt-2.5 size-1.5 shrink-0 rounded-full', accent ? 'bg-brand/70' : 'bg-muted-foreground/60')}
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ProjectDetailFile({ id }: { id: string }) {
  const { data: project, isLoading, error } = useProject(id);
  const { registerProjectTitle, openFile } = useEditor();
  const [showPrivate, setShowPrivate] = useState(false);

  useEffect(() => {
    if (project?.title) registerProjectTitle(id, project.title);
  }, [project?.title, id, registerProjectTitle]);

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl animate-pulse px-5 py-10 sm:px-8">
        <div className="mb-4 h-7 w-1/2 rounded bg-muted" />
        <div className="mb-8 h-4 w-3/4 rounded bg-muted" />
        <div className="mb-8 aspect-video rounded-xl border border-border bg-card" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="w-full max-w-3xl px-5 py-12 font-mono text-[13px] sm:px-8">
        <p className="text-destructive">Error: project not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => openFile('projects')}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to projects
        </Button>
      </div>
    );
  }

  const statusDot =
    project.status === 'in-progress'
      ? 'bg-brand'
      : project.status === 'completed'
        ? 'bg-foreground'
        : 'bg-muted-foreground';

  const meta: { label: string; value: string }[] = [
    { label: 'status', value: project.status },
    ...(project.role ? [{ label: 'role', value: project.role }] : []),
    ...(fmt(project.startDate) ? [{ label: 'start', value: fmt(project.startDate)! }] : []),
    ...(fmt(project.endDate) ? [{ label: 'end', value: fmt(project.endDate)! }] : []),
    ...(project.calculatedDuration || project.duration
      ? [{ label: 'duration', value: (project.calculatedDuration || project.duration) as string }]
      : []),
  ];

  return (
    <div className="w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <button
        type="button"
        onClick={() => openFile('projects')}
        className="mb-6 inline-flex items-center gap-1.5 font-mono text-[12px] text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        projects/
      </button>

      <h1 className="font-sans text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
        {project.title}
      </h1>
      <p className="mt-3 max-w-[65ch] font-sans text-base leading-relaxed text-foreground/75" style={{ textWrap: 'pretty' }}>
        {project.description}
      </p>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button asChild className="h-10 px-4 text-sm">
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-4" aria-hidden="true" />
            Live demo
          </a>
        </Button>
        {project.githubLink && (
          <Button
            variant="outline"
            className="h-10 px-4 text-sm"
            onClick={() =>
              project.isPrivate
                ? setShowPrivate(true)
                : window.open(project.githubLink, '_blank', 'noopener,noreferrer')
            }
          >
            <Github className="size-4" aria-hidden="true" />
            Source
            {project.isPrivate && <Lock className="size-3.5 text-muted-foreground" aria-label="Private repository" />}
          </Button>
        )}
      </div>

      {/* Images */}
      {project.images && project.images.length > 0 && (
        <div className="mt-8">
          <ImageCarousel images={project.images} title={project.title} />
        </div>
      )}

      {/* Meta */}
      <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
        {meta.map((m) => (
          <div key={m.label} className="flex items-center justify-between gap-4 bg-card px-4 py-2.5 font-mono text-[12.5px]">
            <dt className="text-muted-foreground">{m.label}</dt>
            <dd className="text-right text-foreground/85">
              {m.label === 'status' ? (
                <span className="inline-flex items-center gap-2 capitalize">
                  <span className={cn('size-1.5 rounded-full', statusDot)} aria-hidden="true" />
                  {m.value}
                </span>
              ) : (
                m.value
              )}
            </dd>
          </div>
        ))}
      </dl>

      {/* Tech */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 font-sans text-lg font-semibold tracking-tight text-foreground">Built with</h2>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[12px] text-foreground/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 space-y-8">
        <List heading="Purpose" items={project.purpose} />
        <List heading="Key features" items={project.features} />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <List heading="Challenges" items={project.challenges} />
          <List heading="Solutions" items={project.solutions} accent />
        </div>
      </div>

      {showPrivate && project.githubLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.55)]">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrivate(false)}
                aria-label="Close"
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <PrivateRepoAccess repoUrl={project.githubLink} projectTitle={project.title} />
          </div>
        </div>
      )}
    </div>
  );
}
