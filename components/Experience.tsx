'use client';

import { motion } from 'framer-motion';
import ExperienceCard from './ExperienceCard';
import { useExperiences } from '@/hooks/use-experiences';

export default function Experience() {
    const { data: experiences, isLoading, error } = useExperiences();

    if (isLoading) {
        return (
            <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            Experience
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full" />
                    </motion.div>

                    <div className="relative space-y-8">
                        {/* Skeleton Timeline connector */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 sm:left-4" />

                        {[1, 2, 3].map((i) => (
                            <div key={i} className="relative pl-8 sm:pl-12 animate-pulse">
                                {/* Skeleton Timeline dot */}
                                <div className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-white/10 sm:left-[12px] sm:w-3 sm:h-3" />

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-32">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 w-10 h-10 rounded-lg bg-white/10"></div>
                                        <div className="space-y-2 flex-1">
                                            <div className="h-5 bg-white/10 rounded w-1/3"></div>
                                            <div className="h-4 bg-white/10 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-white/10 rounded w-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-red-400">Failed to load experience data.</p>
                </div>
            </section>
        );
    }

    return (
        <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Work Experience
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full" />
                    <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
                        My professional journey and the companies that helped me grow as a developer.
                    </p>
                </motion.div>

                <div className="relative">
                    {experiences && experiences.length > 0 ? (
                        <div className="space-y-2">
                            {experiences.map((exp, index) => (
                                <ExperienceCard key={exp._id} experience={exp} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-400">No experience added yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
