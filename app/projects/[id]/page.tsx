import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProject } from '@/lib/data';
import ProjectDetailView from '@/components/projects/ProjectDetailView';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return { title: 'Project not found' };
  return {
    title: `${project.title} — kukaass`,
    description: project.description?.slice(0, 160),
    openGraph: {
      title: project.title,
      description: project.description?.slice(0, 200),
      images: project.images?.[0] ? [project.images[0]] : undefined,
    },
  };
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();
  return <ProjectDetailView project={project} id={id} />;
}
