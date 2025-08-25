'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Code, Zap, Target, Lightbulb, Award } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/GlassCard';

interface Project {
  _id: string;
  title: string;
  description: string;
  link: string;
  githubLink?: string;
  images: string[];
  techStack: string[];
  features: string[];
  challenges: string[];
  solutions: string[];
  purpose: string[];
  duration?: string;
  role?: string;
  status: 'completed' | 'in-progress' | 'planned';
  createdAt: string | Date;
}

export default function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) throw new Error('Project not found');
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        router.push('/#projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        {/* Header with Back Button - Always visible */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-6"
        >
          <GlassCard className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium text-sm sm:text-base">Back to Projects</span>
              </motion.button>

              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
                <div className="flex items-center gap-1 sm:gap-2 text-gray-400">
                  <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm hidden sm:inline">Code</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 bg-gray-600 text-gray-300 px-2 sm:px-4 py-1 sm:py-2 rounded-lg">
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Live Demo</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.header>

                 <div className="pt-32 sm:pt-32 pb-8 sm:pb-16 px-3 sm:px-4 lg:px-8">
           <div className="max-w-7xl mx-auto">
             <div className="animate-pulse">
               {/* Header Skeleton */}
               <div className="mb-8 sm:mb-12">
                 <div className="bg-white/5 rounded-2xl h-32 sm:h-48"></div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Left Column Skeleton */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white/5 rounded-2xl h-80"></div>
                  <div className="bg-white/5 rounded-2xl h-64"></div>
                  <div className="bg-white/5 rounded-2xl h-48"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-2xl h-48"></div>
                    <div className="bg-white/5 rounded-2xl h-48"></div>
                  </div>
                </div>

                {/* Right Column Skeleton */}
                <div className="space-y-8">
                  <div className="bg-white/5 rounded-2xl h-48"></div>
                  <div className="bg-white/5 rounded-2xl h-64"></div>
                  <div className="bg-white/5 rounded-2xl h-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Header with Back Button */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-6"
      >
        <GlassCard className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium text-sm sm:text-base">Back to Projects</span>
            </motion.button>

            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
              {project.githubLink && (
                <motion.a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 sm:gap-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm hidden sm:inline">Code</span>
                </motion.a>
              )}
              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors duration-200"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">Live Demo</span>
              </motion.a>
            </div>
          </div>
        </GlassCard>
      </motion.header>

             {/* Main Content */}
       <div className="pt-32 sm:pt-32 pb-8 sm:pb-16 px-3 sm:px-4 lg:px-8">
         <div className="max-w-7xl mx-auto">
          {/* Project Header */}
                    <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="mb-8 sm:mb-12"
           >
             <GlassCard className="text-center p-6 sm:p-8 lg:p-12">
               <div className="space-y-4 sm:space-y-6">

                 <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                   {project.title}
                 </h1>

                 <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
                   {project.description}
                 </p>
               </div>
             </GlassCard>
           </motion.div>

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
             {/* Left Column - Project Images */}
             <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Main Project Image */}
              {project.images && project.images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <GlassCard>
                    <div className="relative overflow-hidden rounded-xl aspect-video">
                      <Image
                        src={project.images[0]}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                      />
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Additional Images Grid */}
              {project.images && project.images.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <GlassCard>
                    <div className="grid grid-cols-2 gap-4">
                      {project.images.slice(1).map((image, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg aspect-video">
                          <Image
                            src={image}
                            alt={`${project.title} screenshot ${index + 2}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Purpose */}
              {project.purpose && project.purpose.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                                     <GlassCard>
                     <div className="space-y-4 sm:space-y-6">
                       <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                         <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                         Project Purpose
                       </h3>
                       <div className="grid gap-2 sm:gap-3">
                        {project.purpose.map((purpose, index) => (
                          <div key={index} className="flex items-start gap-3 text-gray-300">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="leading-relaxed">{purpose}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                                     <GlassCard>
                     <div className="space-y-4 sm:space-y-6">
                       <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                         <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                         Key Features
                       </h3>
                       <div className="grid gap-2 sm:gap-3">
                        {project.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3 text-gray-300">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Challenges & Solutions */}
              {(project.challenges.length > 0 || project.solutions.length > 0) && (
                                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.6 }}
                   className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
                 >
                  {project.challenges.length > 0 && (
                                         <GlassCard>
                       <div className="space-y-4 sm:space-y-6">
                         <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
                           <Target className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                           Challenges
                         </h3>
                         <div className="grid gap-2 sm:gap-3">
                          {project.challenges.map((challenge, index) => (
                            <div key={index} className="flex items-start gap-3 text-gray-300">
                              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="leading-relaxed">{challenge}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </GlassCard>
                  )}

                  {project.solutions.length > 0 && (
                                         <GlassCard>
                       <div className="space-y-4 sm:space-y-6">
                         <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
                           <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                           Solutions
                         </h3>
                         <div className="grid gap-2 sm:gap-3">
                          {project.solutions.map((solution, index) => (
                            <div key={index} className="flex items-start gap-3 text-gray-300">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="leading-relaxed">{solution}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </GlassCard>
                  )}
                </motion.div>
              )}
            </div>

                         {/* Right Column - Project Info */}
             <div className="space-y-6 sm:space-y-8">
              {/* Tech Stack */}
              {project.techStack && project.techStack.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                                     <GlassCard>
                     <div className="space-y-4 sm:space-y-6">
                       <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
                         <Code className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                         Tech Stack
                       </h3>
                       <div className="flex flex-wrap gap-2 sm:gap-3">
                        {project.techStack.map((tech, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500/20 text-blue-400 rounded-full text-xs sm:text-sm font-medium border border-blue-500/30"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Project Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
              <GlassCard>
                   <div className="space-y-4 sm:space-y-6">
                     <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
                       <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                       Project Stats
                     </h3>
                     <div className="space-y-3 sm:space-y-4">
                                             <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                         <span className="text-gray-300 text-sm sm:text-base">Status</span>
                         <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                           project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                           project.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                           'bg-blue-500/20 text-blue-400'
                         }`}>
                           {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                         </span>
                       </div>

                       {project.role && (
                         <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                           <span className="text-gray-300 text-sm sm:text-base">Role</span>
                           <span className="text-white font-medium text-sm sm:text-base">{project.role}</span>
                         </div>
                       )}

                       {project.duration && (
                         <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                           <span className="text-gray-300 text-sm sm:text-base">Duration</span>
                           <span className="text-white font-medium text-sm sm:text-base">{project.duration}</span>
                         </div>
                       )}

                       <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                         <span className="text-gray-300 text-sm sm:text-base">Created</span>
                         <span className="text-white font-medium text-sm sm:text-base">
                           {new Date(project.createdAt).toLocaleDateString('en-US', {
                             year: 'numeric',
                             month: 'long',
                             day: 'numeric'
                           })}
                         </span>
                       </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                                 <GlassCard>
                   <div className="space-y-3 sm:space-y-4">
                     <h3 className="text-lg sm:text-xl font-bold text-white">Quick Actions</h3>
                     <div className="space-y-2 sm:space-y-3">
                      <motion.a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                                                 className="flex items-center justify-center gap-2 sm:gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
                      >
                        <ExternalLink className="w-5 h-5" />
                        View Live Demo
                      </motion.a>

                      {project.githubLink && (
                        <motion.a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                                                     className="flex items-center justify-center gap-2 sm:gap-3 w-full bg-white/10 hover:bg-white/20 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors duration-200 font-medium border border-white/20 text-sm sm:text-base"
                        >
                          <Github className="w-5 h-5" />
                          View Source Code
                        </motion.a>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
