import type { LucideIcon } from 'lucide-react';
import { FileCode2, FileText, FolderGit2, Braces, Settings2, SquareTerminal } from 'lucide-react';

/**
 * The portfolio's content modelled as files in Chester's editor. The file
 * tree IS the navigation; each file id maps to a section renderer in
 * EditorPane. `resume.pdf` and the social links are actions, not files, and
 * live in the activity rail / status bar instead.
 */
export type FileId = 'home' | 'about' | 'projects' | 'experience' | 'stack' | 'contact';

export interface EditorFile {
  id: FileId;
  /** Displayed file name, e.g. `home.tsx`. */
  name: string;
  /** Extension used for the small language pill; empty for folders. */
  ext: string;
  /** Whether this entry reads as a folder in the tree (projects/). */
  folder?: boolean;
  icon: LucideIcon;
  /** URL hash for deep-linking and back-compat with `/#projects` links. */
  hash: string;
  /** One-line description for the command palette and welcome screen. */
  blurb: string;
  /** Path segments rendered as the editor breadcrumb. */
  breadcrumb: string[];
}

export const FILES: EditorFile[] = [
  {
    id: 'home',
    name: 'home.tsx',
    ext: 'tsx',
    icon: FileCode2,
    hash: '#home',
    blurb: 'Start here, the short version',
    breadcrumb: ['kukaass', 'home.tsx'],
  },
  {
    id: 'about',
    name: 'about.md',
    ext: 'md',
    icon: FileText,
    hash: '#about',
    blurb: 'Who I am and how I work',
    breadcrumb: ['kukaass', 'about.md'],
  },
  {
    id: 'projects',
    name: 'projects',
    ext: '',
    folder: true,
    icon: FolderGit2,
    hash: '#projects',
    blurb: 'Things I have designed, built, and shipped',
    breadcrumb: ['kukaass', 'projects'],
  },
  {
    id: 'experience',
    name: 'experience.json',
    ext: 'json',
    icon: Braces,
    hash: '#experience',
    blurb: 'Roles and teams I have built with',
    breadcrumb: ['kukaass', 'experience.json'],
  },
  {
    id: 'stack',
    name: 'stack.config.ts',
    ext: 'ts',
    icon: Settings2,
    hash: '#stack',
    blurb: 'The tools I reach for',
    breadcrumb: ['kukaass', 'stack.config.ts'],
  },
  {
    id: 'contact',
    name: 'contact.sh',
    ext: 'sh',
    icon: SquareTerminal,
    hash: '#contact',
    blurb: 'How to reach me',
    breadcrumb: ['kukaass', 'contact.sh'],
  },
];

export const DEFAULT_FILE: FileId = 'home';

export const fileById = (id: FileId): EditorFile =>
  FILES.find((f) => f.id === id) ?? FILES[0];

export const fileByHash = (hash: string): EditorFile | undefined =>
  FILES.find((f) => f.hash === hash);
