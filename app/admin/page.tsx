'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Lock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjects, useDeleteProject, type Project } from '@/hooks/use-projects';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { data: projects = [], isLoading: loading } = useProjects();
  const deleteProjectMutation = useDeleteProject();


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (password === adminPassword) {
      setIsAuthenticated(true);
      setError('');
      // Store authentication in sessionStorage for persistence during session
      sessionStorage.setItem('adminAuthenticated', 'true');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  // Check if already authenticated on component mount
  useEffect(() => {
    const authenticated = sessionStorage.getItem('adminAuthenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Projects are automatically fetched by TanStack Query when authenticated



  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

    try {
      await deleteProjectMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const handleEdit = (project: Project) => {
    router.push(`/admin/edit/${project._id}`);
  };



  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
    setPassword('');
    setError('');
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <GlassCard>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Access</h1>
              <p className="text-gray-400 mt-2">Enter password to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-white/40"
                  required
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-100"
              >
                Access Admin
              </Button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-white/5 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => router.push('/admin/create')}
                  className="bg-white text-black hover:bg-gray-100"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Project
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/5"
                >
                  Logout
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>


        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="transition-all duration-300 h-full"
            >
              <GlassCard className="hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                <div className="flex-1 flex flex-col">
                  {project.images && project.images.length > 0 && (
                    <div className="aspect-video rounded-lg overflow-hidden relative flex-shrink-0 mb-4">
                      <Image
                        src={project.images[0]}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2 flex-1">{project.description}</p>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 text-sm hover:text-purple-300 flex items-center gap-1 mt-auto"
                    >
                      <Eye className="w-4 h-4" />
                      View Project
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEdit(project)}
                    className="flex-1 bg-white/10 text-white px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/20 border border-white/20 transition-all duration-200 hover:shadow-lg"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(project._id)}
                    className="flex-1 bg-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-500/30 border border-red-500/30 transition-all duration-200 hover:shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No projects found.</p>
            <p className="text-gray-500 mt-2">Add your first project to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
