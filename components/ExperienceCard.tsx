'use client';

import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import GlassCard from './GlassCard';
import { type Experience } from '@/hooks/use-experiences';

interface ExperienceCardProps {
    experience: Experience;
    index: number;
}

export default function ExperienceCard({ experience, index }: ExperienceCardProps) {
    const formatDate = (date: string | Date) => {
        return format(new Date(date), 'MMMM yyyy');
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative pl-8 sm:pl-12 pb-12 last:pb-0"
        >
            {/* Timeline connector */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-cyan-500 to-transparent sm:left-4" />

            {/* Timeline dot */}
            <div className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] sm:left-[12px] sm:w-3 sm:h-3" />

            <GlassCard className="hover:shadow-blue-500/5 transition-all duration-500">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white leading-tight">
                                    {experience.role}
                                </h3>
                                <p className="text-lg text-blue-300 font-medium">
                                    {experience.company}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-cyan-400" />
                                <span>
                                    {formatDate(experience.startDate)} - {experience.isCurrent ? 'Present' : experience.endDate ? formatDate(experience.endDate) : ''}
                                </span>
                            </div>
                            {experience.location && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-cyan-400" />
                                    <span>{experience.location}</span>
                                </div>
                            )}
                        </div>

                        {experience.description && experience.description.length > 0 && (
                            <ul className="space-y-2 mt-4">
                                {experience.description.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-gray-300 text-sm sm:text-base leading-relaxed">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}
