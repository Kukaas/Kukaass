import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProject } from '@/lib/data';
import ProjectDetailView from '@/components/projects/ProjectDetailView';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return { title: 'Project not found' };
  return {
    title: `${project.title} — Chester Luke A. Maligaso (Chester Maligaso)`,
    description: project.description?.slice(0, 160),
    alternates: {
      canonical: `https://kukaass.app/projects/${id}`,
    },
    authors: [
      { name: 'Chester Luke A. Maligaso', url: 'https://kukaass.app' },
      { name: 'Chester Maligaso', url: 'https://kukaass.app' },
    ],
    creator: 'Chester Luke A. Maligaso (Chester Maligaso)',
    keywords: [
      project.title,
      ...(project.techStack || []),
      'Chester Maligaso',
      'Chester Luke Maligaso',
      'Chester Luke A. Maligaso',
      'Maligaso',
      'Kukaass',
      'Full-Stack Developer',
    ],
    openGraph: {
      title: `${project.title} | Chester Luke Maligaso (Chester Maligaso)`,
      description: project.description?.slice(0, 200),
      url: `https://kukaass.app/projects/${id}`,
      images: project.images?.[0] ? [project.images[0]] : ['/logo.jpeg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | Chester Luke Maligaso`,
      description: project.description?.slice(0, 200),
      images: project.images?.[0] ? [project.images[0]] : ['/logo.jpeg'],
    },
  };
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://kukaass.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Projects',
        item: 'https://kukaass.app/#projects',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: `https://kukaass.app/projects/${id}`,
      },
    ],
  };

  const softwareLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    url: project.link || `https://kukaass.app/projects/${id}`,
    applicationCategory: 'WebApplication',
    operatingSystem: 'All',
    author: {
      '@type': 'Person',
      '@id': 'https://kukaass.app/#person',
      name: 'Chester Luke A. Maligaso',
      alternateName: ['Chester Maligaso', 'Chester Luke Maligaso', 'Maligaso', 'Kukaass'],
      url: 'https://kukaass.app',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <ProjectDetailView project={project} id={id} />
    </>
  );
}
