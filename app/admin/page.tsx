'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Lock, Briefcase, FolderRoot, FileText } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjects, useDeleteProject, type Project } from '@/hooks/use-projects';
import { useExperiences, useDeleteExperience, type Experience } from '@/hooks/use-experiences';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import ResumeManager from '@/components/admin/ResumeManager';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'projects' | 'experiences' | 'resumes'>('projects');

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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.reload(); // Refresh to trigger layout re-check
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const loading = projectsLoading || experiencesLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your portfolio content</p>
          </div>
          <div className="flex gap-3">
            {activeTab !== 'resumes' && (
              <Button
                onClick={() => router.push(activeTab === 'projects' ? '/admin/create' : '/admin/experience/create')}
                className="bg-white text-black hover:bg-gray-100"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add {activeTab === 'projects' ? 'Project' : 'Experience'}
              </Button>
            )}
            <Button onClick={handleLogout} variant="outline" className="border-white/30 text-white hover:bg-white/5">
              Logout
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
          <button
            onClick={() => setActiveTab('projects')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === 'projects' ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
            )}
          >
            <FolderRoot className="w-4 h-4" />
            Projects
          </button>
          <button
            onClick={() => setActiveTab('experiences')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === 'experiences' ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
            )}
          >
            <Briefcase className="w-4 h-4" />
            Experiences
          </button>
          <button
            onClick={() => setActiveTab('resumes')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === 'resumes' ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
            )}
          >
            <FileText className="w-4 h-4" />
            Resumes
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'projects' ? (
              <motion.div
                key="projects"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {projects.map((project, index) => (
                  <GlassCard key={project._id} className="flex flex-col h-full">
                    {project.images?.[0] && (
                      <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                        <Image src={project.images[0]} alt={project.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{project.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">{project.description}</p>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-white/20 text-white"
                        onClick={() => router.push(`/admin/edit/${project._id}`)}
                      >
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 bg-red-500/20  border-red-500/20"
                        onClick={() => handleDeleteProject(project._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </GlassCard>
                ))}
              </motion.div>
            ) : activeTab === 'experiences' ? (
              <motion.div
                key="experiences"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {experiences.map((exp, index) => (
                  <GlassCard key={exp._id} className="flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                          {exp.isCurrent ? 'Present' : 'Past'}
                        </span>
                      </div>
                      <p className="text-blue-300 font-medium mb-1">{exp.company}</p>
                      <p className="text-gray-500 text-xs mb-4">
                        {format(new Date(exp.startDate), 'MMM yyyy')} - {exp.isCurrent ? 'Present' : exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : ''}
                      </p>
                      <ul className="space-y-1 mb-4">
                        {exp.description?.slice(0, 2).map((d, i) => (
                          <li key={i} className="text-gray-400 text-xs flex gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span className="line-clamp-1">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-white/20 text-white"
                        onClick={() => router.push(`/admin/experience/edit/${exp._id}`)}
                      >
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 bg-red-500/20 border-red-500/20"
                        onClick={() => handleDeleteExperience(exp._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </GlassCard>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="resumes"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <ResumeManager />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
