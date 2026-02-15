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

                    <div className="space-y-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse pl-12 h-32 bg-white/5 rounded-2xl" />
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
