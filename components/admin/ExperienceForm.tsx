'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Briefcase } from 'lucide-react';
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
import { useCreateExperience, useUpdateExperience, type Experience } from '@/hooks/use-experiences';
import AdminShell from './AdminShell';
import { fieldLabel } from './styles';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i);

interface FormState {
  company: string;
  role: string;
  location: string;
  mapUrl: string;
  startDate: string; // YYYY-MM-01
  endDate: string;
  isCurrent: boolean;
  description: string[];
}

const toDateInput = (d?: string | Date): string => {
  if (!d) return '';
  const s = typeof d === 'string' ? d : new Date(d).toISOString();
  return s.includes('T') ? s.split('T')[0] : s;
};

const monthIndex = (date: string) => (date ? parseInt(date.split('-')[1], 10) - 1 : new Date().getMonth());
const yearValue = (date: string) => (date ? parseInt(date.split('-')[0], 10) : new Date().getFullYear());

function initialState(exp?: Experience): FormState {
  return {
    company: exp?.company ?? '',
    role: exp?.role ?? '',
    location: exp?.location ?? '',
    mapUrl: exp?.mapUrl ?? '',
    startDate: toDateInput(exp?.startDate),
    endDate: toDateInput(exp?.endDate),
    isCurrent: exp?.isCurrent ?? false,
    description: exp?.description && exp.description.length > 0 ? exp.description : [''],
  };
}

/** A month + year picker that stores its value as `YYYY-MM-01`. */
function MonthYear({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
}) {
  const setMonth = (m: number) => {
    const year = value ? value.split('-')[0] : String(new Date().getFullYear());
    onChange(`${year}-${String(m + 1).padStart(2, '0')}-01`);
  };
  const setYear = (y: string) => {
    const month = value ? value.split('-')[1] : String(new Date().getMonth() + 1).padStart(2, '0');
    onChange(`${y}-${month}-01`);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Select value={String(monthIndex(value))} onValueChange={(v) => setMonth(parseInt(v, 10))} disabled={disabled}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          {MONTHS.map((m, i) => (
            <SelectItem key={m} value={String(i)}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={String(yearValue(value))} onValueChange={setYear} disabled={disabled}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          {YEARS.map((y) => (
            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function ExperienceForm({ experience }: { experience?: Experience }) {
  const isEdit = Boolean(experience);
  const router = useRouter();
  const createMutation = useCreateExperience();
  const updateMutation = useUpdateExperience();
  const [form, setForm] = useState<FormState>(() => initialState(experience));

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const busy = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        description: form.description.filter((d) => d.trim() !== ''),
      };
      if (isEdit && experience) {
        await updateMutation.mutateAsync({ id: experience._id, data: data as Partial<Experience> });
      } else {
        await createMutation.mutateAsync(data as Omit<Experience, '_id' | 'createdAt'>);
      }
      router.push('/admin?tab=experiences');
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  return (
    <AdminShell activeSection="experiences" tabLabel={isEdit ? 'edit-experience.tsx' : 'new-experience.tsx'} tabIcon={Briefcase}>
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/80 px-5 py-3 backdrop-blur">
        <button
          type="button"
          onClick={() => router.push('/admin?tab=experiences')}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <span className="text-border">/</span>
        <span className="text-[12px] text-foreground/80">{isEdit ? 'Edit experience' : 'Add experience'}</span>
      </div>

      <div className="mx-auto max-w-4xl p-5">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-border bg-card p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company" className={fieldLabel}>Company</Label>
              <Input id="company" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Company name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className={fieldLabel}>Role</Label>
              <Input id="role" value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Job role" required />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location" className={fieldLabel}>Location</Label>
              <Input id="location" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Location (e.g. Remote, Cebu City)" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mapUrl" className={fieldLabel}>Map URL (Google Maps link)</Label>
              <Input id="mapUrl" type="url" value={form.mapUrl} onChange={(e) => set('mapUrl', e.target.value)} placeholder="https://goo.gl/maps/..." />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className={fieldLabel}>Start date</Label>
              <MonthYear value={form.startDate} onChange={(v) => set('startDate', v)} />
            </div>
            <div className="space-y-2">
              <Label className={fieldLabel}>End date</Label>
              <MonthYear value={form.endDate} onChange={(v) => set('endDate', v)} disabled={form.isCurrent} />
              <div className="flex items-center gap-2 pt-1">
                <Checkbox id="isCurrent" checked={form.isCurrent} onCheckedChange={(v) => set('isCurrent', v === true)} className="data-[state=checked]:border-brand data-[state=checked]:bg-brand" />
                <Label htmlFor="isCurrent" className="text-sm text-muted-foreground">Currently working here</Label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className={fieldLabel}>Description (bullet points)</Label>
            {form.description.map((desc, index) => (
              <div key={index} className="flex gap-3">
                <Textarea
                  value={desc}
                  onChange={(e) => set('description', form.description.map((d, i) => (i === index ? e.target.value : d)))}
                  placeholder="Describe your responsibilities or achievements…"
                  rows={2}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => set('description', form.description.filter((_, i) => i !== index))}
                  className="h-fit self-center text-destructive hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Remove bullet point"
                >
                  <Trash2 className="size-5" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => set('description', [...form.description, ''])}
              className="w-full border-dashed"
            >
              <Plus className="size-4" /> Add bullet point
            </Button>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={busy} className="bg-brand px-6 text-brand-foreground hover:bg-brand-deep">
              {busy ? (isEdit ? 'Updating…' : 'Creating…') : isEdit ? 'Update experience' : 'Create experience'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/admin?tab=experiences')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
