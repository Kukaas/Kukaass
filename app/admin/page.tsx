'use client';

import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, FolderRoot, Briefcase, FileText, Inbox, Settings, FileCode2, ImageOff } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useProjects, useDeleteProject } from '@/hooks/use-projects';
import { useExperiences, useDeleteExperience } from '@/hooks/use-experiences';
import { format } from 'date-fns';
import ResumeManager from '@/components/admin/ResumeManager';
import AdminSettings from '@/components/admin/AdminSettings';
import MessagesManager from '@/components/admin/MessagesManager';
import AdminShell, { type AdminSection } from '@/components/admin/AdminShell';

const TAB_META: Record<AdminSection, { tabLabel: string; tabIcon: typeof FileCode2; title: string }> = {
  projects: { tabLabel: 'projects.tsx', tabIcon: FolderRoot, title: 'Projects' },
  experiences: { tabLabel: 'experiences.tsx', tabIcon: Briefcase, title: 'Experiences' },
  resumes: { tabLabel: 'resumes.json', tabIcon: FileText, title: 'Resumes' },
  messages: { tabLabel: 'messages.inbox', tabIcon: Inbox, title: 'Messages' },
  settings: { tabLabel: 'settings.json', tabIcon: Settings, title: 'Settings' },
};

const cardClass =
  'group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-brand/40';

function AdminDashboard() {
  const router = useRouter();
  const params = useSearchParams();
  const activeTab = (params.get('tab') as AdminSection) || 'projects';

  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: experiences = [], isLoading: experiencesLoading } = useExperiences();

  const deleteProjectMutation = useDeleteProject();
  const deleteExperienceMutation = useDeleteExperience();

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProjectMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    try {
      await deleteExperienceMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const loading = projectsLoading || experiencesLoading;
  const meta = TAB_META[activeTab];
  const canAdd = activeTab === 'projects' || activeTab === 'experiences';

  return (
    <AdminShell activeSection={activeTab} tabLabel={meta.tabLabel} tabIcon={meta.tabIcon}>
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background/80 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <span className="text-foreground/80">{meta.title}</span>
          {canAdd && (
            <span className="text-muted-foreground/60">
              · {activeTab === 'projects' ? projects.length : experiences.length} items
            </span>
          )}
        </div>
        {canAdd && (
          <Button
            size="sm"
            onClick={() => router.push(activeTab === 'projects' ? '/admin/create' : '/admin/experience/create')}
            className="bg-brand text-brand-foreground hover:bg-brand-deep"
          >
            <Plus className="size-4" />
            Add {activeTab === 'projects' ? 'project' : 'experience'}
          </Button>
        )}
      </div>

      <div className="p-5">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-lg border border-border bg-card" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'projects' ? (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                {projects.map((project) => (
                  <div key={project._id} className={cardClass}>
                    {project.images?.[0] ? (
                      <div className="relative aspect-video overflow-hidden border-b border-border">
                        <Image src={project.images[0]} alt={project.title} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center border-b border-dashed border-border bg-muted/20">
                        <span className="flex flex-col items-center gap-1.5 text-[11px] text-muted-foreground/60">
                          <ImageOff className="size-6" aria-hidden="true" />
                          no preview
                        </span>
                      </div>
                    )}
                    <div className="flex-1 p-4">
                      <h3 className="mb-1 line-clamp-1 text-[14px] font-semibold text-foreground">{project.title}</h3>
                      <p className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">{project.description}</p>
                    </div>
                    <div className="flex gap-2 border-t border-border p-3">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push(`/admin/edit/${project._id}`)}>
                        <Pencil className="size-3.5" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteProject(project._id)}>
                        <Trash2 className="size-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && <EmptyState label="No projects yet." />}
              </motion.div>
            ) : activeTab === 'experiences' ? (
              <motion.div
                key="experiences"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                {experiences.map((exp) => (
                  <div key={exp._id} className={cardClass}>
                    <div className="flex-1 p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h3 className="text-[14px] font-semibold text-foreground">{exp.role}</h3>
                        <span className="rounded border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                          {exp.isCurrent ? 'Present' : 'Past'}
                        </span>
                      </div>
                      <p className="mb-1 text-[12px] font-medium text-brand">{exp.company}</p>
                      <p className="mb-3 text-[11px] text-muted-foreground/70">
                        {format(new Date(exp.startDate), 'MMM yyyy')} —{' '}
                        {exp.isCurrent ? 'Present' : exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : ''}
                      </p>
                      <ul className="space-y-1">
                        {exp.description?.slice(0, 2).map((d, i) => (
                          <li key={i} className="flex gap-2 text-[12px] text-muted-foreground">
                            <span className="select-none text-muted-foreground/50" aria-hidden="true">⎿</span>
                            <span className="line-clamp-1">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2 border-t border-border p-3">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push(`/admin/experience/edit/${exp._id}`)}>
                        <Pencil className="size-3.5" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteExperience(exp._id)}>
                        <Trash2 className="size-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
                {experiences.length === 0 && <EmptyState label="No experiences yet." />}
              </motion.div>
            ) : activeTab === 'messages' ? (
              <motion.div key="messages" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <MessagesManager />
              </motion.div>
            ) : activeTab === 'settings' ? (
              <motion.div key="settings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <AdminSettings />
              </motion.div>
            ) : (
              <motion.div key="resumes" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <ResumeManager />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </AdminShell>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="col-span-full py-16 text-center text-[13px] text-muted-foreground">
      <span className="select-none text-muted-foreground/50">// </span>
      {label}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="h-[100dvh] bg-background" />}>
      <AdminDashboard />
    </Suspense>
  );
}
