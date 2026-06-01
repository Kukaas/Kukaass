'use client';

import ExperienceCard from './ExperienceCard';
import SectionHeading from './SectionHeading';
import { useExperiences } from '@/hooks/use-experiences';

export default function Experience() {
    const { data: experiences, isLoading, error } = useExperiences();

    if (isLoading) {
        return (
            <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-4xl mx-auto">
                    <SectionHeading title="Work Experience" className="mb-16" />

                    <div className="relative space-y-8">
                        {/* Skeleton timeline connector */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-border sm:left-4" />

                        {[1, 2, 3].map((i) => (
                            <div key={i} className="relative pl-8 sm:pl-12 animate-pulse">
                                {/* Skeleton timeline dot */}
                                <div className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-border sm:left-[12px] sm:w-3 sm:h-3" />

                                <div className="bg-card border border-border rounded-xl p-6 h-32">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 w-10 h-10 rounded-lg bg-muted"></div>
                                        <div className="space-y-2 flex-1">
                                            <div className="h-5 bg-muted rounded w-1/3"></div>
                                            <div className="h-4 bg-muted rounded w-1/4"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-muted rounded w-full"></div>
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
                    <p className="text-destructive">Failed to load experience data.</p>
                </div>
            </section>
        );
    }

    return (
        <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <SectionHeading
                    title="Work Experience"
                    subtitle="The roles and teams I have built with along the way."
                    className="mb-16"
                />

                <div className="relative">
                    {experiences && experiences.length > 0 ? (
                        <div className="space-y-2">
                            {experiences.map((exp, index) => (
                                <ExperienceCard key={exp._id} experience={exp} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-muted-foreground">No experience added yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
