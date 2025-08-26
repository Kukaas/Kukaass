'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Eye } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import GlassCard from './GlassCard';

interface Project {
  _id: string;
  title: string;
  description: string;
  link: string;
  images: string[];
  createdAt: string;
  githubLink: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/projects/${project._id}`);
  };

  const handleActionClick = (e: React.MouseEvent, action: 'demo' | 'code') => {
    e.stopPropagation();
    if (action === 'demo') {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    } else if (action === 'code') {
      window.open(project.githubLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <GlassCard className="h-full group cursor-pointer" onClick={handleCardClick}>
        <div className="space-y-4">
          {/* Project Image */}
          {project.images && project.images.length > 0 && (
            <div className="relative overflow-hidden rounded-xl aspect-video">
                  <Image
                 src={project.images[0]}
                 alt={project.title}
                 fill
                 className="object-cover transition-transform duration-300 group-hover:scale-103"
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* View Details Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">View Details</span>
                </div>
              </div>
            </div>
          )}

          {/* Project Content */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
              {project.title}
            </h3>

            <p className="text-gray-300 text-sm line-clamp-2">
              {project.description}
            </p>

            {/* Project Actions */}
            <div className="flex items-center gap-3 pt-2">
              <motion.button
                onClick={(e) => handleActionClick(e, 'demo')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">Live Demo</span>
              </motion.button>

              <motion.button
                onClick={(e) => handleActionClick(e, 'code')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm font-medium">Code</span>
              </motion.button>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
