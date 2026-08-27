import { cache } from 'react';
import mongoose from 'mongoose';
import dbConnect from './db';
import Project from '@/models/Project';
import Experience from '@/models/Experience';
import type { Project as ProjectType } from '@/hooks/use-projects';
import type { Experience as ExperienceType } from '@/hooks/use-experiences';

/**
 * Server-side data access for SSR pages. These read straight from MongoDB and
 * return plain, serializable objects (ObjectId → string, Date → ISO string via
 * the JSON round-trip) so they can be passed as props to client components.
 * Wrapped in React `cache` so a page + its `generateMetadata` share one query.
 */

function serialize<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

export const getProject = cache(async (id: string): Promise<ProjectType | null> => {
  if (!mongoose.isValidObjectId(id)) return null;
  await dbConnect();
  const doc = await Project.findById(id);
  if (!doc) return null;
  return serialize<ProjectType>(doc.toObject({ virtuals: true }));
});

export const getExperience = cache(async (id: string): Promise<ExperienceType | null> => {
  if (!mongoose.isValidObjectId(id)) return null;
  await dbConnect();
  const doc = await Experience.findById(id);
  if (!doc) return null;
  return serialize<ExperienceType>(doc.toObject({ virtuals: true }));
});

export const getAllProjects = cache(async (): Promise<ProjectType[]> => {
  try {
    await dbConnect();
    const docs = await Project.find({}).sort({ createdAt: -1 });
    return serialize<ProjectType[]>(docs.map((d) => d.toObject({ virtuals: true })));
  } catch (err) {
    console.error('Error fetching all projects:', err);
    return [];
  }
});
