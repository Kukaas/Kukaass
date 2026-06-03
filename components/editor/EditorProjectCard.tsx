'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Github, Lock, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import GlassCard from '@/components/GlassCard';
import PrivateRepoAccess from '@/components/PrivateRepoAccess';
import { useEditor } from './EditorContext';
import { slugify } from './tabs';
import { EASE } from './data';
import type { Project } from '@/hooks/use-projects';

export default function EditorProjectCard({ project, index }: { project: Project; index: number }) {
  const { openProject } = useEditor();
  const reduce = useReducedMotion();
  const [showPrivate, setShowPrivate] = useState(false);

  const reveal = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, delay: index * 0.06, ease: EASE },
      };

  const onAction = (e: React.MouseEvent, action: 'demo' | 'code') => {
    e.stopPropagation();
    if (action === 'demo') {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    } else if (project.githubLink) {
      if (project.isPrivate) setShowPrivate(true);
      else window.open(project.githubLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <motion.div {...reveal}>
        <GlassCard
          className="group h-full cursor-pointer transition-colors hover:border-foreground/25"
          onClick={() => openProject(project)}
        >
          <div className="space-y-3">
            {project.images && project.images.length > 0 && (
              <div className="relative aspect-video overflow-hidden rounded-lg border border-border">
                <Image
                  src={project.images[0]}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 rounded-md border border-border bg-background/85 px-3 py-1.5 font-mono text-[12px] text-foreground">
                    open <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-sans text-lg font-semibold text-foreground transition-colors group-hover:text-brand">
                  {project.title}
                </h3>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground/60">
                  {slugify(project.title)}.tsx
                </span>
              </div>

              <p className="line-clamp-2 font-sans text-sm leading-relaxed text-foreground/70">
                {project.description}
              </p>

              <div className="flex items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={(e) => onAction(e, 'demo')}
                  className="flex items-center gap-1.5 font-mono text-[12px] text-foreground/70 transition-colors hover:text-brand focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  demo
                </button>
                {project.githubLink && (
                  <button
                    type="button"
                    onClick={(e) => onAction(e, 'code')}
                    className="flex items-center gap-1.5 font-mono text-[12px] text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <Github className="size-3.5" aria-hidden="true" />
                    code
                    {project.isPrivate && <Lock className="size-3" aria-label="Private repository" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {showPrivate && project.githubLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="w-full max-w-sm"
          >
            <GlassCard className="p-6 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.55)]">
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
            </GlassCard>
          </motion.div>
        </div>
      )}
    </>
  );
}
