'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import GlassCard from '@/components/GlassCard';
import { useCreateProject } from '@/hooks/use-projects';

export default function CreateProject() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    duration: string;
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
    duration: '',
    role: '',
    status: 'completed',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageData = formData.images;

      // If there's a selected file, upload it first
      if (selectedFile) {
        const formDataFile = new FormData();
        formDataFile.append('image', selectedFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataFile,
        });

        if (!uploadResponse.ok) throw new Error('Failed to upload image');

        const uploadResult = await uploadResponse.json();
        imageData = [uploadResult.base64];
      }

      await createProjectMutation.mutateAsync({ ...formData, images: imageData });

      router.push('/admin');
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/admin')}
                className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </motion.button>
            </div>
            <h1 className="text-3xl font-bold text-white">Create New Project</h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Project title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Project description (up to 2000 characters)..."
                  rows={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Purpose
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="purposeInput"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
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
                      className="px-4 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 border border-green-500/30 flex items-center gap-2 transition-colors"
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
                          className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                        >
                          <span className="text-white text-sm">{purpose}</span>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              const newPurpose = formData.purpose.filter((_, i) => i !== index);
                              setFormData({ ...formData, purpose: newPurpose });
                            }}
                            className="text-red-400 hover:text-red-300 transition-colors"
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Link
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub Link
                  </label>
                  <input
                    type="url"
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={formData.isPrivate}
                    onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="isPrivate" className="text-sm font-medium text-gray-300">
                    Private Repository
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="e.g., Full-stack Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="e.g., 3 months"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'completed' | 'in-progress' | 'planned' })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tech Stack
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="techInput"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
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
                      className="px-4 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 border border-green-500/30 flex items-center gap-2 transition-colors"
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
                          className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                        >
                          <span className="text-white text-sm">{tech}</span>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              const newTechStack = formData.techStack.filter((_, i) => i !== index);
                              setFormData({ ...formData, techStack: newTechStack });
                            }}
                            className="text-red-400 hover:text-red-300 transition-colors"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Features
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="featureInput"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
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
                      className="px-4 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 border border-green-500/30 flex items-center gap-2 transition-colors"
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
                          className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                        >
                          <span className="text-white text-sm">{feature}</span>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              const newFeatures = formData.features.filter((_, i) => i !== index);
                              setFormData({ ...formData, features: newFeatures });
                            }}
                            className="text-red-400 hover:text-red-300 transition-colors"
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Challenges
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="challengeInput"
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
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
                        className="px-4 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 border border-green-500/30 flex items-center gap-2 transition-colors"
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
                            className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                          >
                            <span className="text-white text-sm">{challenge}</span>
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                const newChallenges = formData.challenges.filter((_, i) => i !== index);
                                setFormData({ ...formData, challenges: newChallenges });
                              }}
                              className="text-red-400 hover:text-red-300 transition-colors"
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Solutions
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="solutionInput"
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
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
                        className="px-4 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 border border-green-500/30 flex items-center gap-2 transition-colors"
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
                            className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                          >
                            <span className="text-white text-sm">{solution}</span>
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                const newSolutions = formData.solutions.filter((_, i) => i !== index);
                                setFormData({ ...formData, solutions: newSolutions });
                              }}
                              className="text-red-400 hover:text-red-300 transition-colors"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Image
                </label>

                {/* Image Preview */}
                {selectedFile && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Preview:</p>
                    <div className="relative inline-block">
                      <Image
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        width={96}
                        height={96}
                        className="w-24 h-24 object-cover rounded-lg border border-white/20"
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedFile(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-100 transition-colors"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <motion.button
                  type="submit"
                  disabled={uploading}
                  whileHover={{ scale: uploading ? 1 : 1.02 }}
                  whileTap={{ scale: uploading ? 1 : 0.98 }}
                  className={`px-8 py-3 rounded-lg font-medium transition-all ${
                    uploading
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {uploading ? 'Creating...' : 'Create Project'}
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/admin')}
                  className="border border-white/30 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/5 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
