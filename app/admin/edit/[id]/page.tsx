import { notFound } from 'next/navigation';
import { getProject } from '@/lib/data';
import ProjectForm from '@/components/admin/ProjectForm';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();
  return <ProjectForm project={project} />;
}
