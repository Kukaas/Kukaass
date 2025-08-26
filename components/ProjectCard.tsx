'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Eye, Lock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import GlassCard from './GlassCard';
import PrivateRepoAccess from './PrivateRepoAccess';
import { type Project } from '@/hooks/use-projects';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const router = useRouter();
  const [showPrivateAccess, setShowPrivateAccess] = useState(false);

  const handleCardClick = () => {
    router.push(`/projects/${project._id}`);
  };

  const handleActionClick = (e: React.MouseEvent, action: 'demo' | 'code') => {
    e.stopPropagation();
    if (action === 'demo') {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    } else if (action === 'code') {
      // Check if repository is private based on database field
      if (project.githubLink && project.isPrivate) {
        setShowPrivateAccess(true);
      } else if (project.githubLink) {
        window.open(project.githubLink, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
      >
        <GlassCard className="h-full group cursor-pointer" onClick={handleCardClick}>
          <div className="space-y-3 sm:space-y-4">
            {/* Project Image */}
            {project.images && project.images.length > 0 && (
              <div className="relative overflow-hidden rounded-xl aspect-video">
                    <Image
                   src={project.images[0]}
                   alt={project.title}
                   fill
                   className="object-cover transition-transform duration-300 group-hover:scale-105"
                   sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                 />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* View Details Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 flex items-center gap-2">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    <span className="text-white text-xs sm:text-sm font-medium">View Details</span>
                  </div>
                </div>
              </div>
            )}

            {/* Project Content */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                {project.title}
              </h3>

              <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                {project.description}
              </p>

              {/* Project Actions */}
              <div className="flex items-center gap-2 sm:gap-3 pt-2">
                <motion.button
                  onClick={(e) => handleActionClick(e, 'demo')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1 sm:gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Live Demo</span>
                </motion.button>

                <motion.button
                  onClick={(e) => handleActionClick(e, 'code')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                >
                  <Github className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Code</span>
                  {project.isPrivate && (
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Private Repository Access Modal */}
      {showPrivateAccess && project.githubLink && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-xs sm:max-w-sm"
          >
            <GlassCard className="p-4 sm:p-6 lg:p-8">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setShowPrivateAccess(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <PrivateRepoAccess
                repoUrl={project.githubLink}
                projectTitle={project.title}
              />
            </GlassCard>
          </motion.div>
        </div>
      )}
    </>
  );
}
