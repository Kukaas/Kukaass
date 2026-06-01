'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Github, Eye, Lock } from 'lucide-react';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import GlassCard from './GlassCard';
import PrivateRepoAccess from './PrivateRepoAccess';
import { projectKeys, type Project } from '@/hooks/use-projects';
import { useViewTransitionRouter, viewTransitionStyle } from '@/hooks/use-view-transition-router';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const reduce = useReducedMotion();
  const queryClient = useQueryClient();
  const { push } = useViewTransitionRouter();
  const [showPrivateAccess, setShowPrivateAccess] = useState(false);

  const handleCardClick = () => {
    // Seed the detail query so the destination renders synchronously and the
    // shared image/title exist for the morph instead of a loading skeleton.
    queryClient.setQueryData(projectKeys.detail(project._id), project);
    push(`/projects/${project._id}`, { waitFor: `[data-vt-title="${project._id}"]` });
  };

  const handleActionClick = (e: React.MouseEvent, action: 'demo' | 'code') => {
    e.stopPropagation();
    if (action === 'demo') {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    } else if (action === 'code') {
      if (project.githubLink && project.isPrivate) {
        setShowPrivateAccess(true);
      } else if (project.githubLink) {
        window.open(project.githubLink, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const reveal = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: index * 0.08, ease: [0.25, 1, 0.5, 1] as const },
        viewport: { once: true, margin: '-80px' },
        whileHover: { y: -4 },
      };

  return (
    <>
      <motion.div {...reveal}>
        <GlassCard className="h-full group cursor-pointer" onClick={handleCardClick}>
          <div className="space-y-3 sm:space-y-4">
            {/* Project image */}
            {project.images && project.images.length > 0 && (
              <div
                data-vt-image={project._id}
                style={viewTransitionStyle(`project-image-${project._id}`)}
                className="relative overflow-hidden rounded-xl aspect-video border border-border"
              >
                <Image
                  src={project.images[0]}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* View details affordance */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-background/85 border border-border rounded-lg px-4 py-2 flex items-center gap-2">
                    <Eye className="size-4 text-foreground" aria-hidden="true" />
                    <span className="text-foreground text-xs sm:text-sm font-medium">View details</span>
                  </div>
                </div>
              </div>
            )}

            {/* Project content */}
            <div className="space-y-2 sm:space-y-3">
              <h3
                data-vt-title={project._id}
                style={viewTransitionStyle(`project-title-${project._id}`)}
                className="text-lg sm:text-xl font-bold text-foreground group-hover:text-brand transition-colors duration-300"
              >
                {project.title}
              </h3>

              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                {project.description}
              </p>

              {/* Project actions */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={(e) => handleActionClick(e, 'demo')}
                  className="flex items-center gap-1.5 text-brand hover:text-brand-deep transition-colors duration-200 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-medium">Live demo</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleActionClick(e, 'code')}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <Github className="size-4" aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-medium">Code</span>
                  {project.isPrivate && <Lock className="size-3.5" aria-label="Private repository" />}
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Private repository access modal */}
      {showPrivateAccess && project.githubLink && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            className="w-full max-w-xs sm:max-w-sm"
          >
            <GlassCard className="p-4 sm:p-6 lg:p-8 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.55)]">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => setShowPrivateAccess(false)}
                  aria-label="Close"
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-accent outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
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
