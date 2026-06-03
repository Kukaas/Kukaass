'use client';

import { useState, use, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Code, Zap, Target, Lightbulb, Award, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/GlassCard';
import PrivateRepoAccess from '@/components/PrivateRepoAccess';
import ImageCarousel from '@/components/ImageCarousel';
import ChatWidget from '@/components/ChatWidget';
import { useProject } from '@/hooks/use-projects';
import { useViewTransitionRouter, viewTransitionStyle } from '@/hooks/use-view-transition-router';

const EASE = [0.25, 1, 0.5, 1] as const;

export default function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showPrivateAccess, setShowPrivateAccess] = useState(false);
  const router = useRouter();
  const { back } = useViewTransitionRouter();
  const reduce = useReducedMotion();

  const { data: project, isLoading: loading, error } = useProject(id);

  // Redirect on error in an effect, never during render.
  useEffect(() => {
    if (error) router.push('/#projects');
  }, [error, router]);

  const rise = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: EASE },
        };

  const goBack = () => back({ waitFor: `[data-vt-title="${id}"]` });

  const Header = ({ children }: { children?: React.ReactNode }) => (
    <header className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-6">
      <GlassCard className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-2 text-foreground hover:text-brand transition-colors duration-200 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
            <span className="font-medium text-sm sm:text-base">Back to projects</span>
          </button>
          {children}
        </div>
      </GlassCard>
    </header>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-8 sm:pb-16 px-3 sm:px-4 lg:px-8">
          <div className="max-w-7xl mx-auto animate-pulse">
            <div className="mb-8 sm:mb-12 rounded-xl border border-border bg-card h-32 sm:h-48" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="rounded-xl border border-border bg-card h-80" />
                <div className="rounded-xl border border-border bg-card h-64" />
                <div className="rounded-xl border border-border bg-card h-48" />
              </div>
              <div className="space-y-8">
                <div className="rounded-xl border border-border bg-card h-48" />
                <div className="rounded-xl border border-border bg-card h-64" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <p className="text-xl font-semibold text-foreground">Project not found</p>
          <Button onClick={goBack} variant="outline">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to projects
          </Button>
        </div>
      </div>
    );
  }

  const statusDot =
    project.status === 'in-progress'
      ? 'bg-brand'
      : project.status === 'completed'
        ? 'bg-foreground'
        : 'bg-muted-foreground';

  const stats: { label: string; value: string }[] = [
    { label: 'Status', value: project.status.charAt(0).toUpperCase() + project.status.slice(1) },
    ...(project.role ? [{ label: 'Role', value: project.role }] : []),
    ...(project.startDate
      ? [{ label: 'Start date', value: new Date(project.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }]
      : []),
    ...(project.endDate
      ? [{ label: 'End date', value: new Date(project.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }]
      : []),
    ...(project.calculatedDuration || project.duration
      ? [{ label: 'Duration', value: (project.calculatedDuration || project.duration) as string }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          {project.githubLink && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                project.isPrivate
                  ? setShowPrivateAccess(true)
                  : window.open(project.githubLink, '_blank', 'noopener,noreferrer')
              }
            >
              <Github className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Code</span>
              {project.isPrivate && <Lock className="size-3.5 text-muted-foreground" aria-label="Private repository" />}
            </Button>
          )}
          <Button size="sm" asChild>
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" aria-hidden="true" />
              Live demo
            </a>
          </Button>
        </div>
      </Header>

      <div className="pt-32 pb-8 sm:pb-16 px-3 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Project header */}
          <motion.div {...rise(0.05)} className="mb-8 sm:mb-12">
            <GlassCard className="text-center p-6 sm:p-8 lg:p-12">
              <div className="space-y-4 sm:space-y-6">
                <h1
                  data-vt-title={id}
                  style={viewTransitionStyle(`project-title-${id}`)}
                  className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight tracking-tight"
                >
                  {project.title}
                </h1>
                <p
                  className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                  style={{ textWrap: 'pretty' }}
                >
                  {project.description}
                </p>
              </div>
            </GlassCard>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {project.images && project.images.length > 0 && (
                <motion.div {...rise(0.1)}>
                  <ImageCarousel
                    images={project.images}
                    title={project.title}
                    heroViewTransitionName={`project-image-${id}`}
                    heroId={id}
                  />
                </motion.div>
              )}

              {project.purpose && project.purpose.length > 0 && (
                <motion.div {...rise(0.15)}>
                  <GlassCard>
                    <div className="space-y-5">
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-3">
                        <Target className="size-5 text-muted-foreground" aria-hidden="true" />
                        Project purpose
                      </h2>
                      <ul className="grid gap-3">
                        {project.purpose.map((purpose, index) => (
                          <li key={index} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                            <span className="mt-2.5 size-1.5 rounded-full bg-muted-foreground/60 shrink-0" aria-hidden="true" />
                            {purpose}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {project.features && project.features.length > 0 && (
                <motion.div {...rise(0.2)}>
                  <GlassCard>
                    <div className="space-y-5">
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-3">
                        <Zap className="size-5 text-muted-foreground" aria-hidden="true" />
                        Key features
                      </h2>
                      <ul className="grid gap-3">
                        {project.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                            <span className="mt-2.5 size-1.5 rounded-full bg-muted-foreground/60 shrink-0" aria-hidden="true" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {(project.challenges.length > 0 || project.solutions.length > 0) && (
                <motion.div {...rise(0.25)} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {project.challenges.length > 0 && (
                    <GlassCard>
                      <div className="space-y-5">
                        <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-3">
                          <Target className="size-5 text-muted-foreground" aria-hidden="true" />
                          Challenges
                        </h2>
                        <ul className="grid gap-3">
                          {project.challenges.map((challenge, index) => (
                            <li key={index} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                              <span className="mt-2.5 size-1.5 rounded-full bg-muted-foreground/60 shrink-0" aria-hidden="true" />
                              {challenge}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </GlassCard>
                  )}

                  {project.solutions.length > 0 && (
                    <GlassCard>
                      <div className="space-y-5">
                        <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-3">
                          <Lightbulb className="size-5 text-muted-foreground" aria-hidden="true" />
                          Solutions
                        </h2>
                        <ul className="grid gap-3">
                          {project.solutions.map((solution, index) => (
                            <li key={index} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                              <span className="mt-2.5 size-1.5 rounded-full bg-brand/70 shrink-0" aria-hidden="true" />
                              {solution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </GlassCard>
                  )}
                </motion.div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-6 sm:space-y-8">
              {project.techStack && project.techStack.length > 0 && (
                <motion.div {...rise(0.15)}>
                  <GlassCard>
                    <div className="space-y-5">
                      <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-3">
                        <Code className="size-5 text-muted-foreground" aria-hidden="true" />
                        Tech stack
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech, index) => (
                          <span
                            key={index}
                            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium tracking-wide text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              <motion.div {...rise(0.2)}>
                <GlassCard>
                  <div className="space-y-5">
                    <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-3">
                      <Award className="size-5 text-muted-foreground" aria-hidden="true" />
                      Project details
                    </h2>
                    <dl className="space-y-3">
                      {stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3"
                        >
                          <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                          <dd className="text-sm font-medium text-foreground text-right">
                            {stat.label === 'Status' ? (
                              <span className="inline-flex items-center gap-2">
                                <span className={cn('size-1.5 rounded-full', statusDot)} aria-hidden="true" />
                                {stat.value}
                              </span>
                            ) : (
                              stat.value
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div {...rise(0.25)}>
                <GlassCard>
                  <div className="space-y-4">
                    <h2 className="text-lg sm:text-xl font-bold text-foreground">Quick actions</h2>
                    <div className="space-y-3">
                      <Button asChild className="w-full">
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="size-4" aria-hidden="true" />
                          View live demo
                        </a>
                      </Button>

                      {project.githubLink && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            project.isPrivate
                              ? setShowPrivateAccess(true)
                              : window.open(project.githubLink, '_blank', 'noopener,noreferrer')
                          }
                        >
                          <Github className="size-4" aria-hidden="true" />
                          View source code
                          {project.isPrivate && <Lock className="size-3.5 text-muted-foreground" aria-label="Private repository" />}
                        </Button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Private repository access modal */}
      {showPrivateAccess && project && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
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
              <PrivateRepoAccess repoUrl={project.githubLink || ''} projectTitle={project.title} />
            </GlassCard>
          </motion.div>
        </div>
      )}

      {/* The AI assistant stays reachable while browsing a project. On the
          home editor it lives in the terminal panel instead. */}
      <ChatWidget />
    </div>
  );
}
