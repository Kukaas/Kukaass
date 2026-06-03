'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowLeft, FolderRoot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCreateProject } from '@/hooks/use-projects';
import AdminShell from '@/components/admin/AdminShell';

export default function CreateProject() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const createProjectMutation = useCreateProject();
  const [formData, setFormData] = useState<{
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
    status: 'completed' | 'in-progress' | 'planned';
  }>({
    title: '',
    description: '',
    link: '',
    githubLink: '',
    isPrivate: false,
    images: [],
    techStack: [],
    features: [],
    challenges: [],
    solutions: [],
    purpose: [],
    startDate: '',
    endDate: '',
    isOngoing: false,
    role: '',
    status: 'completed',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const imageData = [...formData.images]; // Start with existing images

      // If there are selected files, upload them first
      if (selectedFiles.length > 0) {
        const formDataFile = new FormData();
        selectedFiles.forEach(file => {
          formDataFile.append('images', file);
        });

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataFile,
        });

        if (!uploadResponse.ok) throw new Error('Failed to upload images');

        const uploadResult = await uploadResponse.json();
        const newImages = uploadResult.images.map((img: { base64: string }) => img.base64);
        imageData.push(...newImages); // Add new images to existing ones
      }

      // Prepare data for submission
      const submissionData = { ...formData, images: imageData };

      // Clear endDate if project is ongoing
      if (submissionData.isOngoing) {
        submissionData.endDate = '';
      }

      // Ensure startDate is not empty (API will handle fallback)
      if (!submissionData.startDate) {
        console.warn('No start date provided, API will use current date as fallback');
      }

      await createProjectMutation.mutateAsync(submissionData);

      router.push('/admin');
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminShell activeSection="projects" tabLabel="new-project.tsx" tabIcon={FolderRoot}>
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/80 px-5 py-3 backdrop-blur">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <span className="text-border">/</span>
        <span className="text-[12px] text-foreground/80">Create new project</span>
      </div>

      <div className="mx-auto max-w-4xl p-5">
        <div className="rounded-lg border border-border bg-card p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-border bg-background/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
                  placeholder="Project title"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-border bg-background/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
                  placeholder="Project description (up to 2000 characters)..."
                  rows={6}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Purpose
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="purposeInput"
                      className="flex-1 px-4 py-3 rounded-md border border-border bg-background/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
                      placeholder="Add a purpose (e.g., Portfolio, Learning)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          const value = input.value.trim();
                          if (value && !formData.purpose.includes(value)) {
                            setFormData({ ...formData, purpose: [...formData.purpose, value] });
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const input = document.getElementById('purposeInput') as HTMLInputElement;
                        const value = input.value.trim();
                        if (value && !formData.purpose.includes(value)) {
                          setFormData({ ...formData, purpose: [...formData.purpose, value] });
                          input.value = '';
                        }
                      }}
                      className="flex items-center gap-2 rounded-md border border-brand/30 bg-brand/15 px-4 py-3 text-brand transition-colors hover:bg-brand/25"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </motion.button>
                  </div>

                  {formData.purpose.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.purpose.map((purpose, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2"
                        >
                          <span className="text-foreground text-sm">{purpose}</span>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              const newPurpose = formData.purpose.filter((_, i) => i !== index);
                              setFormData({ ...formData, purpose: newPurpose });
                            }}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Link
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    GitHub Link
                  </label>
                  <input
                    type="url"
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={formData.isPrivate}
                    onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                    className="size-4 rounded border-border bg-background text-brand accent-brand focus:ring-2 focus:ring-ring/50"
                  />
                  <label htmlFor="isPrivate" className="text-sm font-medium text-foreground/80">
                    Private Repository
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
                    placeholder="e.g., Full-stack Developer"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
                    disabled={formData.isOngoing}
                  />
                  <div className="flex items-center space-x-3 mt-3">
                    <input
                      type="checkbox"
                      id="isOngoing"
                      checked={formData.isOngoing}
                      onChange={(e) => setFormData({ ...formData, isOngoing: e.target.checked })}
                      className="size-4 rounded border-border bg-background text-brand accent-brand focus:ring-2 focus:ring-ring/50"
                    />
                    <label htmlFor="isOngoing" className="text-sm font-medium text-foreground/80">
                      Still working on this project
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'completed' | 'in-progress' | 'planned' })}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background/40 text-foreground focus:outline-none focus:border-brand transition-colors"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Tech Stack
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="techInput"
                      className="flex-1 px-4 py-3 rounded-md border border-border bg-background/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
                      placeholder="Add a technology (e.g., React)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          const value = input.value.trim();
                          if (value && !formData.techStack.includes(value)) {
                            setFormData({ ...formData, techStack: [...formData.techStack, value] });
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const input = document.getElementById('techInput') as HTMLInputElement;
                        const value = input.value.trim();
                        if (value && !formData.techStack.includes(value)) {
                          setFormData({ ...formData, techStack: [...formData.techStack, value] });
                          input.value = '';
                        }
                      }}
                      className="flex items-center gap-2 rounded-md border border-brand/30 bg-brand/15 px-4 py-3 text-brand transition-colors hover:bg-brand/25"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </motion.button>
                  </div>

                  {formData.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.techStack.map((tech, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2"
                        >
                          <span className="text-foreground text-sm">{tech}</span>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              const newTechStack = formData.techStack.filter((_, i) => i !== index);
                              setFormData({ ...formData, techStack: newTechStack });
                            }}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Features
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="featureInput"
                      className="flex-1 px-4 py-3 rounded-md border border-border bg-background/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
                      placeholder="Add a feature (e.g., User authentication)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          const value = input.value.trim();
                          if (value && !formData.features.includes(value)) {
                            setFormData({ ...formData, features: [...formData.features, value] });
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const input = document.getElementById('featureInput') as HTMLInputElement;
                        const value = input.value.trim();
                        if (value && !formData.features.includes(value)) {
                          setFormData({ ...formData, features: [...formData.features, value] });
                          input.value = '';
                        }
                      }}
                      className="flex items-center gap-2 rounded-md border border-brand/30 bg-brand/15 px-4 py-3 text-brand transition-colors hover:bg-brand/25"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </motion.button>
                  </div>

                  {formData.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2"
                        >
                          <span className="text-foreground text-sm">{feature}</span>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              const newFeatures = formData.features.filter((_, i) => i !== index);
                              setFormData({ ...formData, features: newFeatures });
                            }}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Challenges
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="challengeInput"
                        className="flex-1 px-4 py-3 rounded-md border border-border bg-background/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
                        placeholder="Add a challenge"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            const value = input.value.trim();
                            if (value && !formData.challenges.includes(value)) {
                              setFormData({ ...formData, challenges: [...formData.challenges, value] });
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const input = document.getElementById('challengeInput') as HTMLInputElement;
                          const value = input.value.trim();
                          if (value && !formData.challenges.includes(value)) {
                            setFormData({ ...formData, challenges: [...formData.challenges, value] });
                            input.value = '';
                          }
                        }}
                        className="flex items-center gap-2 rounded-md border border-brand/30 bg-brand/15 px-4 py-3 text-brand transition-colors hover:bg-brand/25"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </motion.button>
                    </div>

                    {formData.challenges.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.challenges.map((challenge, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2"
                          >
                            <span className="text-foreground text-sm">{challenge}</span>
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                const newChallenges = formData.challenges.filter((_, i) => i !== index);
                                setFormData({ ...formData, challenges: newChallenges });
                              }}
                              className="text-destructive hover:text-destructive/80 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Solutions
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="solutionInput"
                        className="flex-1 px-4 py-3 rounded-md border border-border bg-background/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
                        placeholder="Add a solution"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            const value = input.value.trim();
                            if (value && !formData.solutions.includes(value)) {
                              setFormData({ ...formData, solutions: [...formData.solutions, value] });
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const input = document.getElementById('solutionInput') as HTMLInputElement;
                          const value = input.value.trim();
                          if (value && !formData.solutions.includes(value)) {
                            setFormData({ ...formData, solutions: [...formData.solutions, value] });
                            input.value = '';
                          }
                        }}
                        className="flex items-center gap-2 rounded-md border border-brand/30 bg-brand/15 px-4 py-3 text-brand transition-colors hover:bg-brand/25"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </motion.button>
                    </div>

                    {formData.solutions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.solutions.map((solution, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2"
                          >
                            <span className="text-foreground text-sm">{solution}</span>
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                const newSolutions = formData.solutions.filter((_, i) => i !== index);
                                setFormData({ ...formData, solutions: newSolutions });
                              }}
                              className="text-destructive hover:text-destructive/80 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Project Images
                </label>

                {/* Image Preview */}
                {selectedFiles.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Preview ({selectedFiles.length} images):</p>
                    <div className="flex flex-wrap gap-3">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            width={96}
                            height={96}
                            className="w-24 h-24 object-cover rounded-md border border-border"
                          />
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              const newFiles = selectedFiles.filter((_, i) => i !== index);
                              setSelectedFiles(newFiles);
                            }}
                            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files || []);
                    setSelectedFiles(prev => [...prev, ...newFiles]); // Append new files to existing ones
                  }}
                  className="w-full rounded-md border border-border bg-background/40 px-4 py-3 text-foreground transition-colors focus:border-brand focus:outline-none file:mr-4 file:rounded-md file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-foreground hover:file:bg-brand-deep"
                />
                <p className="text-xs text-muted-foreground mt-2">You can select multiple images. The first image will be used as the main preview.</p>
              </div>

              <div className="flex gap-4 pt-6">
                <motion.button
                  type="submit"
                  disabled={uploading}
                  whileHover={{ scale: uploading ? 1 : 1.02 }}
                  whileTap={{ scale: uploading ? 1 : 0.98 }}
                  className={`rounded-md px-8 py-3 font-medium transition-colors ${
                    uploading
                      ? 'cursor-not-allowed bg-muted text-muted-foreground'
                      : 'bg-brand text-brand-foreground hover:bg-brand-deep'
                  }`}
                >
                  {uploading ? 'Creating…' : 'Create project'}
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/admin')}
                  className="rounded-md border border-border px-8 py-3 font-medium text-foreground transition-colors hover:bg-accent"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
        </div>
      </div>
    </AdminShell>
  );
}
