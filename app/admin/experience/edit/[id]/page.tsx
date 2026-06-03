import { notFound } from 'next/navigation';
import { getExperience } from '@/lib/data';
import ExperienceForm from '@/components/admin/ExperienceForm';

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const experience = await getExperience(id);
  if (!experience) notFound();
  return <ExperienceForm experience={experience} />;
}
