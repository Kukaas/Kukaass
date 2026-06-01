'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Code2, Server, Layers } from 'lucide-react';
import GlassCard from './GlassCard';
import SectionHeading from './SectionHeading';

const capabilities = [
  {
    icon: Code2,
    title: 'Frontend',
    detail: 'React, Next.js, TypeScript, Tailwind CSS',
  },
  {
    icon: Server,
    title: 'Backend',
    detail: 'Node.js, Express, Laravel, MongoDB',
  },
  {
    icon: Layers,
    title: 'Full-stack',
    detail: 'MERN stack, REST APIs, GraphQL',
  },
];

export default function About() {
  const reduce = useReducedMotion();

  const slide = (x: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, x },
          whileInView: { opacity: 1, x: 0 },
          transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] as const },
          viewport: { once: true, margin: '-80px' },
        };

  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 px-3 sm:px-4 lg:px-8 overflow-hidden">
      <div className="w-[95%] sm:w-[90%] max-w-4xl mx-auto">
        <SectionHeading title="About Me" className="mb-12 sm:mb-16" />

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-stretch">
          <motion.div {...slide(-40)} className="text-center lg:text-left">
            <GlassCard className="h-full p-6 sm:p-8 lg:p-12">
              <div className="space-y-6 sm:space-y-8">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                  I&apos;m Chester
                </h3>

                <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  <p className="text-lg sm:text-xl font-medium text-foreground">
                    A full-stack developer who ships web applications end to end.
                  </p>
                  <p>
                    I work primarily across the MERN stack and Laravel, building everything from API
                    and database design to the interface people actually use.
                  </p>
                </div>

                <div className="pt-4 sm:pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Available for freelance projects and full-time roles.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.ul {...slide(40)} className="space-y-4">
            {capabilities.map((item) => (
              <li key={item.title}>
                <GlassCard className="p-5 sm:p-6">
                  <div className="flex items-center gap-4 text-left">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border text-foreground">
                      <item.icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-foreground">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                  </div>
                </GlassCard>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
