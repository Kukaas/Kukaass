'use client';

import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { useProjects, type Project } from '@/hooks/use-projects';

export default function Projects() {
  const { data: projects, isLoading: loading, error } = useProjects();

  if (loading) {
    return (
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              My Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/5 rounded-2xl h-80"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              My Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full" />
          </motion.div>

          <div className="text-center">
            <p className="text-red-400 text-lg">{error.message}</p>
            <p className="text-gray-400 mt-2">Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            My Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full" />
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
            Explore my latest work showcasing full-stack development, modern web applications, and innovative solutions.
          </p>
        </motion.div>

        {projects?.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-400 text-lg">No projects available yet.</p>
            <p className="text-gray-500 mt-2">Check back soon for updates!</p>
          </div>
                 ) : (
           <div className="grid grid-cols-1 gap-8">
             {projects?.map((project: Project, index: number) => (
               <ProjectCard key={project._id} project={project} index={index} />
             ))}
           </div>
         )}
      </div>
    </section>
  );
}
