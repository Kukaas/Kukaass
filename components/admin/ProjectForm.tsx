'use client';

import { useState } from 'react';
import { ArrowLeft, Trash2, FolderRoot } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useCreateProject, useUpdateProject, type Project } from '@/hooks/use-projects';
import AdminShell from './AdminShell';
import TagInput from './TagInput';
import { fieldLabel } from './styles';

type ProjectStatus = 'completed' | 'in-progress' | 'planned';

interface FormState {
  title: string;
  description: string;
  link: string;
  githubLink: string;
  isPrivate: boolean;
  images: string[];
  techStack: string[];
  features: string[];
  challenges: string[];
  solutions: string[];
  purpose: string[];
  startDate: string;
  endDate: string;
  isOngoing: boolean;
  role: string;
  status: ProjectStatus;
}

const toDateInput = (d?: string | Date): string => {
  if (!d) return '';
  const s = typeof d === 'string' ? d : new Date(d).toISOString();
  return s.includes('T') ? s.split('T')[0] : s;
};

function initialState(project?: Project): FormState {
  return {
    title: project?.title ?? '',
    description: project?.description ?? '',
    link: project?.link ?? '',
    githubLink: project?.githubLink ?? '',
    isPrivate: project?.isPrivate ?? false,
    images: project?.images ?? [],
    techStack: project?.techStack ?? [],
    features: project?.features ?? [],
    challenges: project?.challenges ?? [],
    solutions: project?.solutions ?? [],
    purpose: project?.purpose ?? [],
    startDate: toDateInput(project?.startDate),
    endDate: toDateInput(project?.endDate),
    isOngoing: project?.isOngoing ?? false,
    role: project?.role ?? '',
    status: (project?.status as ProjectStatus) ?? 'completed',
  };
}

export default function ProjectForm({ project }: { project?: Project }) {
  const isEdit = Boolean(project);
  const router = useRouter();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [form, setForm] = useState<FormState>(() => initialState(project));

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const busy = uploading || createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const images = [...form.images];

      if (selectedFiles.length > 0) {
        const fd = new FormData();
        selectedFiles.forEach((file) => fd.append('images', file));
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        if (!res.ok) throw new Error('Failed to upload images');
        const result = await res.json();
        images.push(...result.images.map((img: { base64: string }) => img.base64));
      }

      const data = { ...form, images, endDate: form.isOngoing ? '' : form.endDate };

      if (isEdit && project) {
        await updateMutation.mutateAsync({ id: project._id, data });
      } else {
        await createMutation.mutateAsync(data as Omit<Project, '_id' | 'createdAt'>);
      }
      router.push('/admin?tab=projects');
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminShell activeSection="projects" tabLabel={isEdit ? 'edit-project.tsx' : 'new-project.tsx'} tabIcon={FolderRoot}>
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/80 px-5 py-3 backdrop-blur">
        <button
          type="button"
          onClick={() => router.push('/admin?tab=projects')}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <span className="text-border">/</span>
        <span className="text-[12px] text-foreground/80">{isEdit ? 'Edit project' : 'Create new project'}</span>
      </div>

      <div className="mx-auto max-w-4xl p-5">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-border bg-card p-6">
          <div className="space-y-2">
            <Label htmlFor="title" className={fieldLabel}>Title</Label>
            <Input id="title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Project title" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className={fieldLabel}>Description</Label>
            <Textarea id="description" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Project description (up to 2000 characters)…" rows={6} required />
          </div>

          <TagInput label="Purpose" placeholder="Add a purpose (e.g., Portfolio, Learning)" values={form.purpose} onChange={(v) => set('purpose', v)} />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="link" className={fieldLabel}>Link</Label>
              <Input id="link" type="url" value={form.link} onChange={(e) => set('link', e.target.value)} placeholder="https://example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubLink" className={fieldLabel}>GitHub link</Label>
              <Input id="githubLink" type="url" value={form.githubLink} onChange={(e) => set('githubLink', e.target.value)} placeholder="https://github.com/username/repo" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="isPrivate" checked={form.isPrivate} onCheckedChange={(v) => set('isPrivate', v === true)} className="data-[state=checked]:border-brand data-[state=checked]:bg-brand" />
              <Label htmlFor="isPrivate" className="text-sm font-medium text-foreground/80">Private repository</Label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="role" className={fieldLabel}>Role</Label>
              <Input id="role" value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="e.g., Full-stack Developer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate" className={fieldLabel}>Start date *</Label>
              <Input id="startDate" type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className={fieldLabel}>End date</Label>
              <Input id="endDate" type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} disabled={form.isOngoing} />
              <div className="flex items-center gap-2 pt-1">
                <Checkbox id="isOngoing" checked={form.isOngoing} onCheckedChange={(v) => set('isOngoing', v === true)} className="data-[state=checked]:border-brand data-[state=checked]:bg-brand" />
                <Label htmlFor="isOngoing" className="text-sm font-medium text-foreground/80">Still working on this</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label className={fieldLabel}>Status</Label>
              <Select value={form.status} onValueChange={(v) => set('status', v as ProjectStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TagInput label="Tech stack" placeholder="Add a technology (e.g., React)" values={form.techStack} onChange={(v) => set('techStack', v)} />
          <TagInput label="Features" placeholder="Add a feature (e.g., User authentication)" values={form.features} onChange={(v) => set('features', v)} />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TagInput label="Challenges" placeholder="Add a challenge" values={form.challenges} onChange={(v) => set('challenges', v)} />
            <TagInput label="Solutions" placeholder="Add a solution" values={form.solutions} onChange={(v) => set('solutions', v)} />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label className={fieldLabel}>Project images</Label>

            {form.images.length > 0 && (
              <div className="mb-2">
                <p className="mb-2 text-sm text-muted-foreground">Current images:</p>
                <div className="flex flex-wrap gap-3">
                  {form.images.map((image, index) => (
                    <div key={index} className="relative">
                      <Image src={image} alt={`Image ${index + 1}`} width={96} height={96} className="h-24 w-24 rounded-md border border-border object-cover" />
                      <button
                        type="button"
                        onClick={() => set('images', form.images.filter((_, i) => i !== index))}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs text-white transition-colors hover:bg-destructive/90"
                        aria-label="Remove image"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedFiles.length > 0 && (
              <div className="mb-2">
                <p className="mb-2 text-sm text-muted-foreground">New images ({selectedFiles.length}):</p>
                <div className="flex flex-wrap gap-3">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <Image src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} width={96} height={96} className="h-24 w-24 rounded-md border border-border object-cover" />
                      <button
                        type="button"
                        onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== index))}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs text-white transition-colors hover:bg-destructive/90"
                        aria-label="Remove image"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files || [])])}
              className="file:mr-4 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1 file:text-sm file:font-semibold file:text-brand-foreground hover:file:bg-brand-deep"
            />
            <p className="text-xs text-muted-foreground">The first image is used as the main preview.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={busy} className="bg-brand px-6 text-brand-foreground hover:bg-brand-deep">
              {busy ? (isEdit ? 'Updating…' : 'Creating…') : isEdit ? 'Update project' : 'Create project'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/admin?tab=projects')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
