import type { LucideIcon } from 'lucide-react';
import { FileCode2 } from 'lucide-react';
import { fileById, type FileId } from './files';

/**
 * A tab is either a static section file (its FileId) or a project detail,
 * keyed as `project:<id>`. Strings keep tab state easy to compare and to
 * serialize into the URL hash.
 */
export type TabKey = string;

const PROJECT_PREFIX = 'project:';
export const projectKey = (id: string): TabKey => `${PROJECT_PREFIX}${id}`;
export const isProjectKey = (key: TabKey): boolean => key.startsWith(PROJECT_PREFIX);
export const projectIdOf = (key: TabKey): string => key.slice(PROJECT_PREFIX.length);

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'project'
  );
}

export interface ResolvedTab {
  key: TabKey;
  kind: 'file' | 'project';
  name: string;
  ext: string;
  icon: LucideIcon;
  breadcrumb: string[];
  fileId?: FileId;
  projectId?: string;
}

export function resolveTab(key: TabKey, projectTitles: Record<string, string>): ResolvedTab {
  if (isProjectKey(key)) {
    const id = projectIdOf(key);
    const title = projectTitles[id];
    const name = `${slugify(title ?? 'project')}.tsx`;
    return {
      key,
      kind: 'project',
      name,
      ext: 'tsx',
      icon: FileCode2,
      breadcrumb: ['kukaass', 'projects', name],
      projectId: id,
    };
  }
  const file = fileById(key as FileId);
  return {
    key,
    kind: 'file',
    name: file.name,
    ext: file.ext,
    icon: file.icon,
    breadcrumb: file.breadcrumb,
    fileId: file.id,
  };
}
