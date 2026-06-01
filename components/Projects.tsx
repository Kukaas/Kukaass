'use client';

import ProjectCard from './ProjectCard';
import SectionHeading from './SectionHeading';
import { useProjects, type Project } from '@/hooks/use-projects';

export default function Projects() {
  const { data: projects, isLoading: loading, error } = useProjects();

  if (loading) {
    return (
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="My Projects" className="mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 h-full animate-pulse">
                <div className="aspect-video bg-muted rounded-xl mb-6"></div>
                <div className="h-6 w-2/3 bg-muted rounded mb-4"></div>
                <div className="h-4 w-full bg-muted rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-muted rounded mb-6"></div>
                <div className="flex gap-4">
                  <div className="h-4 w-20 bg-muted rounded"></div>
                  <div className="h-4 w-20 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="My Projects" className="mb-16" />

          <div className="text-center">
            <p className="text-destructive text-lg">{error.message}</p>
            <p className="text-muted-foreground mt-2">Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="My Projects"
          subtitle="A selection of full-stack apps and web projects I have designed, built, and shipped."
          className="mb-16"
        />

        {projects?.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground text-lg">No projects available yet.</p>
            <p className="text-muted-foreground/80 mt-2">Check back soon for updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects?.map((project: Project, index: number) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
