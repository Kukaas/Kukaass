'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import GlassCard from './GlassCard';
import { type Experience } from '@/hooks/use-experiences';

interface ExperienceCardProps {
    experience: Experience;
    index: number;
}

export default function ExperienceCard({ experience, index }: ExperienceCardProps) {
    const reduce = useReducedMotion();

    const formatDate = (date: string | Date) => {
        return format(new Date(date), 'MMMM yyyy');
    };

    const reveal = reduce
        ? {}
        : {
            initial: { opacity: 0, x: -40 },
            whileInView: { opacity: 1, x: 0 },
            transition: { duration: 0.6, delay: index * 0.08, ease: [0.25, 1, 0.5, 1] as const },
            viewport: { once: true, margin: '-80px' },
        };

    return (
        <motion.div {...reveal} className="relative pl-8 sm:pl-12 pb-12 last:pb-0">
            {/* Timeline connector */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-border sm:left-4" />

            {/* Timeline dot (the single accent mark for this role) */}
            <div className="absolute left-[-4px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand ring-4 ring-background sm:left-[11px] sm:w-3 sm:h-3" />

            <GlassCard>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-foreground">
                                <Briefcase className="w-5 h-5" aria-hidden="true" />
                            </span>
                            <div>
                                <h3 className="text-xl font-bold text-foreground leading-tight">
                                    {experience.role}
                                </h3>
                                <p className="text-base text-muted-foreground font-medium">
                                    {experience.company}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" aria-hidden="true" />
                                <span>
                                    {formatDate(experience.startDate)} - {experience.isCurrent ? 'Present' : experience.endDate ? formatDate(experience.endDate) : ''}
                                </span>
                            </div>
                            {experience.location && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" aria-hidden="true" />
                                    {experience.mapUrl ? (
                                        <a
                                            href={experience.mapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-brand transition-colors cursor-pointer rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        >
                                            {experience.location}
                                        </a>
                                    ) : (
                                        <span>{experience.location}</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {experience.description && experience.description.length > 0 && (
                            <ul className="space-y-2 mt-4">
                                {experience.description.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-muted-foreground text-sm sm:text-base leading-relaxed">
                                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 mt-2.5 shrink-0" aria-hidden="true" />
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
